"""
Application model – student applies to an internship.
"""

import enum
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Enum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.mixins import TimestampMixin

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.internship import Internship


class ApplicationStatus(str, enum.Enum):
    applied = "applied"
    under_review = "under_review"
    shortlisted = "shortlisted"
    rejected = "rejected"
    offered = "offered"
    accepted = "accepted"
    withdrawn = "withdrawn"


class Application(TimestampMixin, Base):
    __tablename__ = "applications"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    applicant_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    internship_id: Mapped[int] = mapped_column(
        ForeignKey("internships.id", ondelete="CASCADE"), nullable=False, index=True
    )

    status: Mapped[ApplicationStatus] = mapped_column(
        Enum(ApplicationStatus, name="applicationstatus"),
        default=ApplicationStatus.applied,
        nullable=False,
    )
    cover_letter: Mapped[Optional[str]] = mapped_column(Text)
    resume_url: Mapped[Optional[str]] = mapped_column(String(500))
    reviewer_notes: Mapped[Optional[str]] = mapped_column(Text)  # internal – admin/company only

    # ── Relationships ────────────────────────────────────────────────────────
    applicant: Mapped["User"] = relationship("User", back_populates="applications")
    internship: Mapped["Internship"] = relationship("Internship", back_populates="applications")

    def __repr__(self) -> str:
        return f"<Application id={self.id} user={self.applicant_id} internship={self.internship_id}>"
