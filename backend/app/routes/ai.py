"""
AI Chat route – POST /api/ai/chat

This endpoint is the clean interface for the Gemini/RAG layer.
Member 3 only needs to modify app/services/ai_service.py (_call_gemini).
Nothing in this file needs to change when the real AI is connected.

Error handling:
  - 400  Invalid request (empty message, validation failure)
  - 422  Pydantic validation error (automatic)
  - 500  AI provider unavailable / unexpected server error
  - 503  Database unavailable
"""

import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.chat import ChatConversation, ChatMessage
from app.models.user import User
from app.schemas.chat import (
    ChatConversationResponse,
    ChatMessageResponse,
    ChatRequest,
    ChatResponse,
    AISourceSchema,
)
from app.schemas.common import PaginatedResponse
from app.services.ai_service import handle_chat

logger = logging.getLogger("tnplastichub.ai.route")

router = APIRouter(prefix="/ai", tags=["AI Assistant"])

_optional_bearer = HTTPBearer(auto_error=False)


def _optional_user(
    credentials: HTTPAuthorizationCredentials = Depends(_optional_bearer),
    db: Session = Depends(get_db),
) -> Optional[User]:
    """Return the current user if a valid token is supplied, otherwise None."""
    if credentials is None:
        return None
    from app.services.auth import decode_token
    token_data = decode_token(credentials.credentials)
    if token_data is None or token_data.user_id is None:
        return None
    return db.get(User, token_data.user_id)


@router.post(
    "/chat",
    response_model=ChatResponse,
    summary="Send a message to the AI assistant",
    description=(
        "Send a user message and receive a structured AI response with answer, "
        "sources, and confidence. Conversation history is automatically maintained "
        "via the `conversation_id` UUID. Omit `conversation_id` to start a new session."
    ),
)
def chat(
    body: ChatRequest,
    db: Session = Depends(get_db),
    # Auth is optional – anonymous users can also chat
    current_user: Optional[User] = Depends(_optional_user),
):
    """
    POST /api/ai/chat

    Accepts:
        message         – user's text (required, 1-4000 chars)
        conversation_id – existing session UUID (optional)

    Returns:
        answer          – AI-generated text response
        sources         – list of cited sources [{title, url, type}]
        confidence      – high | medium | low
        conversation_id – UUID for subsequent turns
    """
    user_id = current_user.id if current_user else None

    try:
        ai_resp, convo_uuid = handle_chat(
            db=db,
            user_message=body.message,
            conversation_uuid=body.conversation_id,
            user_id=user_id,
        )
    except SQLAlchemyError as exc:
        logger.error("Database error during chat: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database unavailable. Please try again later.",
        )
    except Exception as exc:
        logger.exception("Unexpected error during chat: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI service encountered an unexpected error.",
        )

    sources = [
        AISourceSchema(title=s.title, url=s.url, type=s.type)
        for s in ai_resp.sources
    ]

    return ChatResponse(
        answer=ai_resp.answer,
        sources=sources,
        confidence=ai_resp.confidence,
        conversation_id=convo_uuid,
    )


@router.get(
    "/conversations",
    response_model=PaginatedResponse[ChatConversationResponse],
    summary="List current user's conversations",
)
def list_conversations(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    skip = (page - 1) * page_size
    q = db.query(ChatConversation).filter(ChatConversation.user_id == current_user.id)
    total = q.count()
    items = q.order_by(ChatConversation.updated_at.desc()).offset(skip).limit(page_size).all()
    pages = (total + page_size - 1) // page_size
    return PaginatedResponse(items=items, total=total, page=page, page_size=page_size, pages=pages)


@router.get(
    "/conversations/{conversation_uuid}",
    response_model=ChatConversationResponse,
    summary="Get conversation with full message history",
)
def get_conversation(
    conversation_uuid: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    convo = (
        db.query(ChatConversation)
        .filter(ChatConversation.conversation_uuid == conversation_uuid)
        .first()
    )
    if not convo:
        raise HTTPException(status_code=404, detail="Conversation not found")
    if convo.user_id and convo.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    return convo


@router.delete(
    "/conversations/{conversation_uuid}",
    status_code=204,
    summary="Delete (archive) a conversation",
)
def delete_conversation(
    conversation_uuid: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from app.models.chat import ConversationStatus
    convo = (
        db.query(ChatConversation)
        .filter(ChatConversation.conversation_uuid == conversation_uuid)
        .first()
    )
    if not convo:
        raise HTTPException(status_code=404, detail="Conversation not found")
    if convo.user_id and convo.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    convo.status = ConversationStatus.archived
    db.commit()
