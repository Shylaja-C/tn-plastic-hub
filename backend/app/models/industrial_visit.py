"""
Industrial Visit & Booking models.
Companies create visits; students book slots.
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
    from app.models.user import User


class VisitStatus(str, enum.Enum):
    upcoming = "upcoming"
    ongoing = "ongoing"
    completed = "completed"
    cancelled = "cancelled"


class BookingStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    cancelled = "cancelled"
    attended = "attended"


class IndustrialVisit(TimestampMixin, Base):
    __tablename__ = "industrial_visits"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    company_id: Mapped[int] = mapped_column(
        ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True
    )

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    visit_date: Mapped[date] = mapped_column(Date, nullable=False)
    duration_hours: Mapped[Optional[int]] = mapped_column(Integer)
    max_participants: Mapped[int] = mapped_column(Integer, default=30)
    location: Mapped[Optional[str]] = mapped_column(String(255))
    status: Mapped[VisitStatus] = mapped_column(
        Enum(VisitStatus, name="visitstatus"), default=VisitStatus.upcoming
    )
    target_audience: Mapped[Optional[str]] = mapped_column(String(255))  # e.g. "Engineering students"
    registration_deadline: Mapped[Optional[date]] = mapped_column(Date)

    # ── Relationships ────────────────────────────────────────────────────────
    company: Mapped["Company"] = relationship("Company", back_populates="industrial_visits")
    bookings: Mapped[List["IndustrialVisitBooking"]] = relationship(
        "IndustrialVisitBooking", back_populates="visit", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<IndustrialVisit id={self.id} title={self.title}>"


class IndustrialVisitBooking(TimestampMixin, Base):
    __tablename__ = "industrial_visit_bookings"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    visit_id: Mapped[int] = mapped_column(
        ForeignKey("industrial_visits.id", ondelete="CASCADE"), nullable=False, index=True
    )
    student_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    status: Mapped[BookingStatus] = mapped_column(
        Enum(BookingStatus, name="bookingstatus"), default=BookingStatus.pending
    )
    notes: Mapped[Optional[str]] = mapped_column(Text)

    # ── Relationships ────────────────────────────────────────────────────────
    visit: Mapped["IndustrialVisit"] = relationship("IndustrialVisit", back_populates="bookings")
    student: Mapped["User"] = relationship("User", back_populates="visit_bookings")

    def __repr__(self) -> str:
        return f"<Booking id={self.id} visit={self.visit_id} student={self.student_id}>"
