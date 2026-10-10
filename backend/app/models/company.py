"""
Company model – plastics industry companies registered on the platform.
"""

import enum
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Enum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.mixins import TimestampMixin

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.internship import Internship
    from app.models.industrial_visit import IndustrialVisit


class CompanyType(str, enum.Enum):
    manufacturer = "manufacturer"
    recycler = "recycler"
    supplier = "supplier"
    trader = "trader"
    consultant = "consultant"
    other = "other"


class CompanyStatus(str, enum.Enum):
    pending = "pending"
    verified = "verified"
    rejected = "rejected"
    suspended = "suspended"


class Company(TimestampMixin, Base):
    __tablename__ = "companies"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    owner_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )

    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    company_type: Mapped[CompanyType] = mapped_column(
        Enum(CompanyType, name="companytype"), nullable=False
    )
    status: Mapped[CompanyStatus] = mapped_column(
        Enum(CompanyStatus, name="companystatus"),
        default=CompanyStatus.pending,
        nullable=False,
    )

    # Contact & location
    email: Mapped[Optional[str]] = mapped_column(String(255))
    phone: Mapped[Optional[str]] = mapped_column(String(20))
    website: Mapped[Optional[str]] = mapped_column(String(500))
    address: Mapped[Optional[str]] = mapped_column(Text)
    city: Mapped[Optional[str]] = mapped_column(String(100))
    district: Mapped[Optional[str]] = mapped_column(String(100))
    state: Mapped[str] = mapped_column(String(100), default="Tamil Nadu")
    pincode: Mapped[Optional[str]] = mapped_column(String(10))

    # Business info
    description: Mapped[Optional[str]] = mapped_column(Text)
    year_established: Mapped[Optional[int]] = mapped_column(Integer)
    employee_count: Mapped[Optional[int]] = mapped_column(Integer)
    annual_turnover: Mapped[Optional[str]] = mapped_column(String(50))
    gst_number: Mapped[Optional[str]] = mapped_column(String(20), unique=True)
    logo_url: Mapped[Optional[str]] = mapped_column(String(500))

    # Verification
    verified_by_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL")
    )

    # ── Relationships ────────────────────────────────────────────────────────
    owner: Mapped["User"] = relationship("User", foreign_keys=[owner_id], back_populates="company")
    verified_by: Mapped[Optional["User"]] = relationship("User", foreign_keys=[verified_by_id])
    internships: Mapped[List["Internship"]] = relationship(
        "Internship", back_populates="company", cascade="all, delete-orphan"
    )
    industrial_visits: Mapped[List["IndustrialVisit"]] = relationship(
        "IndustrialVisit", back_populates="company", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Company id={self.id} name={self.name}>"
