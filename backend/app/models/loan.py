"""
Loan / Financial Assistance scheme model.
"""

import enum
from typing import Optional

from sqlalchemy import Boolean, Enum, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base
from app.models.mixins import TimestampMixin


class LoanCategory(str, enum.Enum):
    term_loan = "term_loan"
    working_capital = "working_capital"
    equipment = "equipment"
    startup = "startup"
    msme = "msme"
    other = "other"


class LoanStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"


class Loan(TimestampMixin, Base):
    __tablename__ = "loans"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    provider: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[LoanCategory] = mapped_column(
        Enum(LoanCategory, name="loancategory"), default=LoanCategory.other
    )
    status: Mapped[LoanStatus] = mapped_column(
        Enum(LoanStatus, name="loanstatus"), default=LoanStatus.active
    )

    description: Mapped[Optional[str]] = mapped_column(Text)
    eligibility: Mapped[Optional[str]] = mapped_column(Text)
    interest_rate_min: Mapped[Optional[str]] = mapped_column(String(20))  # e.g. "7.5%"
    interest_rate_max: Mapped[Optional[str]] = mapped_column(String(20))
    max_amount: Mapped[Optional[int]] = mapped_column(Integer)  # in INR lakhs
    repayment_period_years: Mapped[Optional[int]] = mapped_column(Integer)
    collateral_required: Mapped[bool] = mapped_column(Boolean, default=False)
    application_url: Mapped[Optional[str]] = mapped_column(String(500))
    contact_info: Mapped[Optional[str]] = mapped_column(Text)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)

    def __repr__(self) -> str:
        return f"<Loan id={self.id} title={self.title}>"
