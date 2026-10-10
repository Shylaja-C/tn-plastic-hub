"""
Chat models – conversation sessions and individual messages.
Lightweight: stores only text metadata, no model weights or embeddings.
"""

import enum
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Boolean, Enum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.mixins import TimestampMixin


class MessageRole(str, enum.Enum):
    user = "user"
    assistant = "assistant"
    system = "system"


class ConversationStatus(str, enum.Enum):
    active = "active"
    archived = "archived"


class ChatConversation(TimestampMixin, Base):
    """
    One conversation session per user (or anonymous via session UUID).
    Stores only lightweight metadata – no model files.
    """
    __tablename__ = "chat_conversations"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    # UUID string so the frontend can reference it without exposing integer PKs
    conversation_uuid: Mapped[str] = mapped_column(
        String(36), unique=True, index=True, nullable=False
    )

    # Optional: link to a registered user; anonymous sessions have NULL
    user_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True
    )

    title: Mapped[Optional[str]] = mapped_column(String(255))  # auto-generated from first message
    status: Mapped[ConversationStatus] = mapped_column(
        Enum(ConversationStatus, name="conversationstatus"),
        default=ConversationStatus.active,
        nullable=False,
    )

    # ── Relationships ────────────────────────────────────────────────────────
    messages: Mapped[List["ChatMessage"]] = relationship(
        "ChatMessage", back_populates="conversation", cascade="all, delete-orphan",
        order_by="ChatMessage.id",
    )

    def __repr__(self) -> str:
        return f"<ChatConversation id={self.id} uuid={self.conversation_uuid}>"


class ChatMessage(TimestampMixin, Base):
    """
    Individual message within a conversation.
    Stores user queries and assistant responses as plain text.
    Sources are stored as a JSON-serialised string to avoid a separate join table.
    """
    __tablename__ = "chat_messages"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    conversation_id: Mapped[int] = mapped_column(
        ForeignKey("chat_conversations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    role: Mapped[MessageRole] = mapped_column(
        Enum(MessageRole, name="messagerole"), nullable=False
    )
    content: Mapped[str] = mapped_column(Text, nullable=False)

    # AI-specific metadata (only populated for assistant messages)
    # Stored as a JSON string: [{"title": "...", "url": "..."}]
    sources_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    confidence: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)  # high/medium/low
    model_used: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    is_flagged: Mapped[bool] = mapped_column(Boolean, default=False)

    # ── Relationships ────────────────────────────────────────────────────────
    conversation: Mapped["ChatConversation"] = relationship(
        "ChatConversation", back_populates="messages"
    )

    def __repr__(self) -> str:
        return f"<ChatMessage id={self.id} role={self.role}>"
