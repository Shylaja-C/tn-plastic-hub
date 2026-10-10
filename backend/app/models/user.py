"""
User model – covers students, company reps, and admins.
"""

import enum
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Boolean, Enum, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.mixins import TimestampMixin

if TYPE_CHECKING:
    from app.models.company import Company
    from app.models.application import Application
    from app.models.industrial_visit import IndustrialVisitBooking
    from app.models.notification import Notification
    from app.models.document import Document


class UserRole(str, enum.Enum):
    student = "student"
    industry = "industry"      # company representative
    entrepreneur = "entrepreneur"
    admin = "admin"


class UserStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"
    suspended = "suspended"
    pending_verification = "pending_verification"


class User(TimestampMixin, Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(20))
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole, name="userrole"), default=UserRole.student, nullable=False
    )
    status: Mapped[UserStatus] = mapped_column(
        Enum(UserStatus, name="userstatus"),
        default=UserStatus.active,
        nullable=False,
    )
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Student-specific fields
    college_name: Mapped[Optional[str]] = mapped_column(String(255))
    department: Mapped[Optional[str]] = mapped_column(String(255))
    graduation_year: Mapped[Optional[int]] = mapped_column()
    skills: Mapped[Optional[str]] = mapped_column(Text)  # comma-separated

    # Profile
    profile_picture_url: Mapped[Optional[str]] = mapped_column(String(500))
    bio: Mapped[Optional[str]] = mapped_column(Text)
    linkedin_url: Mapped[Optional[str]] = mapped_column(String(500))

    # ── Relationships ────────────────────────────────────────────────────────
    company: Mapped[Optional["Company"]] = relationship(
        "Company",
        primaryjoin="User.id == Company.owner_id",
        foreign_keys="Company.owner_id",
        back_populates="owner",
        uselist=False,
    )
    applications: Mapped[List["Application"]] = relationship(
        "Application", back_populates="applicant", cascade="all, delete-orphan"
    )
    visit_bookings: Mapped[List["IndustrialVisitBooking"]] = relationship(
        "IndustrialVisitBooking", back_populates="student", cascade="all, delete-orphan"
    )
    notifications: Mapped[List["Notification"]] = relationship(
        "Notification", back_populates="user", cascade="all, delete-orphan"
    )
    documents: Mapped[List["Document"]] = relationship(
        "Document", back_populates="owner", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email} role={self.role}>"
