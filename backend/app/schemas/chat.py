"""
Chat Pydantic schemas.
"""

from datetime import datetime
from typing import List, Optional

from pydantic import Field

from app.models.chat import ConversationStatus, MessageRole
from app.schemas.common import OrmBase


# ── Request ───────────────────────────────────────────────────────────────────

class ChatRequest(OrmBase):
    message: str = Field(min_length=1, max_length=4000)
    conversation_id: Optional[str] = Field(
        default=None,
        description="UUID of an existing conversation. Omit to start a new one.",
    )


# ── Response ──────────────────────────────────────────────────────────────────

class AISourceSchema(OrmBase):
    title: str
    url: str = ""
    type: str = "reference"


class ChatResponse(OrmBase):
    answer: str
    sources: List[AISourceSchema] = []
    confidence: str = "medium"   # high | medium | low
    conversation_id: str          # UUID echoed back to the client


# ── DB-backed schemas ─────────────────────────────────────────────────────────

class ChatMessageResponse(OrmBase):
    id: int
    role: MessageRole
    content: str
    confidence: Optional[str] = None
    created_at: datetime


class ChatConversationResponse(OrmBase):
    id: int
    conversation_uuid: str
    title: Optional[str] = None
    status: ConversationStatus
    created_at: datetime
    updated_at: datetime
    messages: List[ChatMessageResponse] = []
