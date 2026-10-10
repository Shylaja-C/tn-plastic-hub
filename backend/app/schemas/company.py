"""
Company Pydantic schemas.
"""

from datetime import datetime
from typing import Optional

from pydantic import EmailStr, Field

from app.models.company import CompanyStatus, CompanyType
from app.schemas.common import OrmBase


class CompanyCreate(OrmBase):
    name: str = Field(min_length=2, max_length=255)
    company_type: CompanyType
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(default=None, max_length=20)
    website: Optional[str] = Field(default=None, max_length=500)
    address: Optional[str] = None
    city: Optional[str] = Field(default=None, max_length=100)
    district: Optional[str] = Field(default=None, max_length=100)
    pincode: Optional[str] = Field(default=None, max_length=10)
    description: Optional[str] = None
    year_established: Optional[int] = Field(default=None, ge=1900, le=2030)
    employee_count: Optional[int] = Field(default=None, ge=1)
    annual_turnover: Optional[str] = Field(default=None, max_length=50)
    gst_number: Optional[str] = Field(default=None, max_length=20)
    logo_url: Optional[str] = Field(default=None, max_length=500)


class CompanyUpdate(OrmBase):
    name: Optional[str] = Field(default=None, min_length=2, max_length=255)
    company_type: Optional[CompanyType] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(default=None, max_length=20)
    website: Optional[str] = Field(default=None, max_length=500)
    address: Optional[str] = None
    city: Optional[str] = Field(default=None, max_length=100)
    district: Optional[str] = Field(default=None, max_length=100)
    pincode: Optional[str] = Field(default=None, max_length=10)
    description: Optional[str] = None
    year_established: Optional[int] = Field(default=None, ge=1900, le=2030)
    employee_count: Optional[int] = Field(default=None, ge=1)
    annual_turnover: Optional[str] = Field(default=None, max_length=50)
    logo_url: Optional[str] = Field(default=None, max_length=500)


class CompanyVerify(OrmBase):
    status: CompanyStatus  # verified | rejected
    notes: Optional[str] = None


class CompanyResponse(OrmBase):
    id: int
    owner_id: int
    name: str
    company_type: CompanyType
    status: CompanyStatus
    email: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    district: Optional[str] = None
    state: str
    pincode: Optional[str] = None
    description: Optional[str] = None
    year_established: Optional[int] = None
    employee_count: Optional[int] = None
    annual_turnover: Optional[str] = None
    gst_number: Optional[str] = None
    logo_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class CompanyPublic(OrmBase):
    """Minimal public info used in listings."""

    id: int
    name: str
    company_type: CompanyType
    city: Optional[str] = None
    district: Optional[str] = None
    logo_url: Optional[str] = None
    status: CompanyStatus
