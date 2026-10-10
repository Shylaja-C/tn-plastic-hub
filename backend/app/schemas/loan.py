"""
Loan Pydantic schemas.
"""

from datetime import datetime
from typing import Optional

from app.models.loan import LoanCategory, LoanStatus
from app.schemas.common import OrmBase


class LoanCreate(OrmBase):
    title: str
    provider: str
    category: LoanCategory = LoanCategory.other
    status: LoanStatus = LoanStatus.active
    description: Optional[str] = None
    eligibility: Optional[str] = None
    interest_rate_min: Optional[str] = None
    interest_rate_max: Optional[str] = None
    max_amount: Optional[int] = None
    repayment_period_years: Optional[int] = None
    collateral_required: bool = False
    application_url: Optional[str] = None
    contact_info: Optional[str] = None
    is_featured: bool = False


class LoanUpdate(OrmBase):
    title: Optional[str] = None
    provider: Optional[str] = None
    category: Optional[LoanCategory] = None
    status: Optional[LoanStatus] = None
    description: Optional[str] = None
    eligibility: Optional[str] = None
    interest_rate_min: Optional[str] = None
    interest_rate_max: Optional[str] = None
    max_amount: Optional[int] = None
    repayment_period_years: Optional[int] = None
    collateral_required: Optional[bool] = None
    application_url: Optional[str] = None
    contact_info: Optional[str] = None
    is_featured: Optional[bool] = None


class LoanResponse(OrmBase):
    id: int
    title: str
    provider: str
    category: LoanCategory
    status: LoanStatus
    description: Optional[str] = None
    eligibility: Optional[str] = None
    interest_rate_min: Optional[str] = None
    interest_rate_max: Optional[str] = None
    max_amount: Optional[int] = None
    repayment_period_years: Optional[int] = None
    collateral_required: bool
    application_url: Optional[str] = None
    contact_info: Optional[str] = None
    is_featured: bool
    created_at: datetime
    updated_at: datetime
