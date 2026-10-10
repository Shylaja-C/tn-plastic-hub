"""
Document model – uploaded files (resumes, certificates, company docs, etc.).
"""

import enum
from typing import Optional

from sqlalchemy import Enum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.mixins import TimestampMixin


class DocumentType(str, enum.Enum):
    resume = "resume"
    certificate = "certificate"
    company_registration = "company_registration"
    gst_certificate = "gst_certificate"
    id_proof = "id_proof"
    other = "other"


class Document(TimestampMixin, Base):
    __tablename__ = "documents"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    owner_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    document_type: Mapped[DocumentType] = mapped_column(
        Enum(DocumentType, name="documenttype"), default=DocumentType.other
    )
    file_url: Mapped[str] = mapped_column(String(500), nullable=False)
    file_size_kb: Mapped[Optional[int]] = mapped_column(Integer)
    mime_type: Mapped[Optional[str]] = mapped_column(String(100))
    description: Mapped[Optional[str]] = mapped_column(Text)
    is_verified: Mapped[bool] = mapped_column(default=False)

    # ── Relationships ────────────────────────────────────────────────────────
    owner = relationship("User", back_populates="documents")

    def __repr__(self) -> str:
        return f"<Document id={self.id} title={self.title}>"
