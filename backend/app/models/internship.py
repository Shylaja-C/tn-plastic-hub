"""
Internship model – posted by companies, applied to by students.
"""

import enum
from datetime import date
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Date, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.mixins import TimestampMixin

if TYPE_CHECKING:
    from app.models.company import Company
    from app.models.application import Application


class InternshipStatus(str, enum.Enum):
    draft = "draft"
    open = "open"
    closed = "closed"
    cancelled = "cancelled"


class InternshipType(str, enum.Enum):
    full_time = "full_time"
    part_time = "part_time"
    remote = "remote"
    hybrid = "hybrid"


class Internship(TimestampMixin, Base):
    __tablename__ = "internships"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    company_id: Mapped[int] = mapped_column(
        ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True
    )

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    requirements: Mapped[Optional[str]] = mapped_column(Text)
    responsibilities: Mapped[Optional[str]] = mapped_column(Text)

    internship_type: Mapped[InternshipType] = mapped_column(
        Enum(InternshipType, name="internshiptype"), default=InternshipType.full_time
    )
    status: Mapped[InternshipStatus] = mapped_column(
        Enum(InternshipStatus, name="internshipstatus"), default=InternshipStatus.open
    )

    location: Mapped[Optional[str]] = mapped_column(String(255))
    duration_months: Mapped[Optional[int]] = mapped_column(Integer)
    stipend_amount: Mapped[Optional[int]] = mapped_column(Integer)  # in INR
    vacancies: Mapped[int] = mapped_column(Integer, default=1)

    application_deadline: Mapped[Optional[date]] = mapped_column(Date)
    start_date: Mapped[Optional[date]] = mapped_column(Date)

    skills_required: Mapped[Optional[str]] = mapped_column(Text)  # comma-separated

    # ── Relationships ────────────────────────────────────────────────────────
    company: Mapped["Company"] = relationship("Company", back_populates="internships")
    applications: Mapped[List["Application"]] = relationship(
        "Application", back_populates="internship", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Internship id={self.id} title={self.title}>"
