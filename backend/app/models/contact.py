"""
Contact / Inquiry model – submitted via the contact form.
"""

import enum
from typing import Optional

from sqlalchemy import Enum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base
from app.models.mixins import TimestampMixin


class ContactStatus(str, enum.Enum):
    new = "new"
    in_progress = "in_progress"
    resolved = "resolved"
    closed = "closed"


class ContactCategory(str, enum.Enum):
    general = "general"
    internship = "internship"
    industrial_visit = "industrial_visit"
    scheme = "scheme"
    technical = "technical"
    complaint = "complaint"
    other = "other"


class Contact(TimestampMixin, Base):
    __tablename__ = "contacts"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    phone: Mapped[Optional[str]] = mapped_column(String(20))
    subject: Mapped[str] = mapped_column(String(500), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[ContactCategory] = mapped_column(
        Enum(ContactCategory, name="contactcategory"), default=ContactCategory.general
    )
    status: Mapped[ContactStatus] = mapped_column(
        Enum(ContactStatus, name="contactstatus"), default=ContactStatus.new
    )
    # If the inquiry came from a logged-in user
    user_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    admin_notes: Mapped[Optional[str]] = mapped_column(Text)

    def __repr__(self) -> str:
        return f"<Contact id={self.id} email={self.email}>"
