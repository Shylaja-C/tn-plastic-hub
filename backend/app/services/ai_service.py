"""
AI Service Interface – Clean abstraction layer for the Gemini/RAG integration.

Member 3 responsibility:
  Replace the _call_gemini() stub with a real Gemini API call and plug in
  a RAG retrieval step.  The contract (inputs / outputs) must not change so
  the route, schema, and DB layer remain untouched.

Architecture:
  Route  ──►  ai_service.handle_chat()
                 ├── load_conversation_history()   (reads DB)
                 ├── _call_gemini()                ◄── Member 3 fills this in
                 └── save_message()                (writes DB)

Nothing here downloads model weights or stores large files in PostgreSQL.
GEMINI_API_KEY is read from the environment at request time.
"""

from __future__ import annotations

import json
import logging
import uuid
from dataclasses import dataclass, field
from typing import List, Optional

from sqlalchemy.orm import Session

from app.config import get_settings
from app.models.chat import ChatConversation, ChatMessage, ConversationStatus, MessageRole

logger = logging.getLogger("tnplastichub.ai")
settings = get_settings()


# ── Data transfer objects ──────────────────────────────────────────────────────

@dataclass
class AISource:
    title: str
    url: str = ""
    type: str = "reference"   # reference | platform | government


@dataclass
class AIResponse:
    answer: str
    sources: List[AISource] = field(default_factory=list)
    confidence: str = "medium"   # high | medium | low
    model_used: str = "placeholder"
    error: Optional[str] = None


# ── Conversation helpers ───────────────────────────────────────────────────────

def get_or_create_conversation(
    db: Session,
    conversation_uuid: Optional[str],
    user_id: Optional[int] = None,
) -> ChatConversation:
    """
    Return an existing conversation by UUID or create a new one.
    UUID is generated here when not supplied by the caller.
    """
    if conversation_uuid:
        convo = (
            db.query(ChatConversation)
            .filter(ChatConversation.conversation_uuid == conversation_uuid)
            .first()
        )
        if convo:
            return convo

    # Create fresh conversation
    convo = ChatConversation(
        conversation_uuid=conversation_uuid or str(uuid.uuid4()),
        user_id=user_id,
        status=ConversationStatus.active,
    )
    db.add(convo)
    db.flush()   # get the id without committing
    return convo


def load_history(db: Session, conversation_id: int, last_n: int = 10) -> List[dict]:
    """
    Return the last N messages as a simple list of dicts for prompt construction.
    Keeps the context window lightweight.
    """
    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.conversation_id == conversation_id)
        .order_by(ChatMessage.id.desc())
        .limit(last_n)
        .all()
    )
    return [{"role": m.role.value, "content": m.content} for m in reversed(messages)]


def save_message(
    db: Session,
    conversation_id: int,
    role: MessageRole,
    content: str,
    sources: Optional[List[AISource]] = None,
    confidence: Optional[str] = None,
    model_used: Optional[str] = None,
) -> ChatMessage:
    """Persist a single chat message."""
    sources_json: Optional[str] = None
    if sources:
        sources_json = json.dumps([{"title": s.title, "url": s.url, "type": s.type} for s in sources])

    msg = ChatMessage(
        conversation_id=conversation_id,
        role=role,
        content=content,
        sources_json=sources_json,
        confidence=confidence,
        model_used=model_used,
    )
    db.add(msg)
    return msg


def _auto_title(message: str) -> str:
    """Generate a short title from the first user message (max 60 chars)."""
    cleaned = message.strip().rstrip("?").strip()
    return cleaned[:57] + "..." if len(cleaned) > 60 else cleaned


# ── Gemini stub – Member 3 replaces this ──────────────────────────────────────

def _call_gemini(
    user_message: str,
    history: List[dict],
    gemini_api_key: str,
) -> AIResponse:
    if not gemini_api_key:
        return AIResponse(
            answer=(
                "The AI assistant is not yet configured. "
                "Please set GEMINI_API_KEY in the environment."
            ),
            sources=[],
            confidence="low",
            model_used="none",
            error="GEMINI_API_KEY not set",
        )

    try:
        import httpx
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key={gemini_api_key}"
        contents = []
        for h in history:
            role = "user" if h.get("role") == "user" else "model"
            contents.append({"role": role, "parts": [{"text": h.get("content", "")}]})
        contents.append({"role": "user", "parts": [{"text": user_message}]})

        system_instruction = {
            "parts": [{
                "text": (
                    "You are the TNPlasticHub AI Assistant, an expert advisor for Tamil Nadu's "
                    "plastics industry. You assist entrepreneurs, students, and businesses with "
                    "information on polymer manufacturing, government schemes, machinery, recycling, "
                    "and industrial setup in Tamil Nadu. Provide helpful, accurate, and concise guidance."
                )
            }]
        }

        payload = {
            "contents": contents,
            "system_instruction": system_instruction,
            "generationConfig": {"temperature": 0.7, "maxOutputTokens": 1000},
        }

        resp = httpx.post(url, json=payload, timeout=20.0)
        if resp.status_code == 200:
            data = resp.json()
            candidates = data.get("candidates", [])
            if candidates:
                text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                return AIResponse(
                    answer=text,
                    confidence="high",
                    model_used="gemini-3.8-flash",
                )

        error_data = resp.json() if "application/json" in resp.headers.get("content-type", "") else {}
        err_msg = error_data.get("error", {}).get("message", resp.text)
        logger.error("Gemini API error (%s): %s", resp.status_code, err_msg)
        return AIResponse(
            answer=f"AI service error: {err_msg}",
            confidence="low",
            model_used="gemini-3.8-flash",
            error=err_msg,
        )
    except Exception as exc:
        logger.error("Exception calling Gemini: %s", exc)
        return AIResponse(
            answer="Sorry, an error occurred while connecting to the AI assistant.",
            confidence="low",
            model_used="gemini-3.8-flash",
            error=str(exc),
        )


# ── Public entry point called by the route ────────────────────────────────────

def handle_chat(
    db: Session,
    user_message: str,
    conversation_uuid: Optional[str],
    user_id: Optional[int] = None,
) -> tuple[AIResponse, str]:
    """
    Orchestrate a full chat turn:
      1. Resolve / create conversation
      2. Persist the user message
      3. Load history for context
      4. Call the AI backend (stub or real Gemini)
      5. Persist the assistant response
      6. Commit and return

    Returns: (AIResponse, conversation_uuid)
    Raises:  RuntimeError on DB failure (caught by the route)
    """
    gemini_api_key = settings.GEMINI_API_KEY

    # 1. Conversation
    convo = get_or_create_conversation(db, conversation_uuid, user_id)
    if not convo.title:
        convo.title = _auto_title(user_message)

    # 2. Save user message
    save_message(db, convo.id, MessageRole.user, user_message)

    # 3. History (excludes the message we just saved → flush first)
    db.flush()
    history = load_history(db, convo.id, last_n=10)

    # 4. Call AI backend
    try:
        ai_resp = _call_gemini(user_message, history, gemini_api_key)
    except Exception as exc:
        logger.exception("Gemini call failed: %s", exc)
        ai_resp = AIResponse(
            answer="The AI service is temporarily unavailable. Please try again shortly.",
            sources=[],
            confidence="low",
            model_used="none",
            error=str(exc),
        )

    # 5. Save assistant response
    save_message(
        db,
        convo.id,
        MessageRole.assistant,
        ai_resp.answer,
        sources=ai_resp.sources,
        confidence=ai_resp.confidence,
        model_used=ai_resp.model_used,
    )

    db.commit()
    db.refresh(convo)
    return ai_resp, convo.conversation_uuid
