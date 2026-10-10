"""
Internship Pydantic schemas.
"""

from datetime import date, datetime
from typing import Optional

from pydantic import Field

from app.models.internship import InternshipStatus, InternshipType
from app.schemas.common import OrmBase
from app.schemas.company import CompanyPublic


class InternshipCreate(OrmBase):
    title: str = Field(min_length=3, max_length=255)
    description: Optional[str] = None
    requirements: Optional[str] = None
    responsibilities: Optional[str] = None
    internship_type: InternshipType = InternshipType.full_time
    location: Optional[str] = Field(default=None, max_length=255)
    duration_months: Optional[int] = Field(default=None, ge=1, le=24)
    stipend_amount: Optional[int] = Field(default=None, ge=0)
    vacancies: int = Field(default=1, ge=1)
    application_deadline: Optional[date] = None
    start_date: Optional[date] = None
    skills_required: Optional[str] = None


class InternshipUpdate(OrmBase):
    title: Optional[str] = Field(default=None, min_length=3, max_length=255)
    description: Optional[str] = None
    requirements: Optional[str] = None
    responsibilities: Optional[str] = None
    internship_type: Optional[InternshipType] = None
    status: Optional[InternshipStatus] = None
    location: Optional[str] = Field(default=None, max_length=255)
    duration_months: Optional[int] = Field(default=None, ge=1, le=24)
    stipend_amount: Optional[int] = Field(default=None, ge=0)
    vacancies: Optional[int] = Field(default=None, ge=1)
    application_deadline: Optional[date] = None
    start_date: Optional[date] = None
    skills_required: Optional[str] = None


class InternshipResponse(OrmBase):
    id: int
    company_id: int
    title: str
    description: Optional[str] = None
    requirements: Optional[str] = None
    responsibilities: Optional[str] = None
    internship_type: InternshipType
    status: InternshipStatus
    location: Optional[str] = None
    duration_months: Optional[int] = None
    stipend_amount: Optional[int] = None
    vacancies: int
    application_deadline: Optional[date] = None
    start_date: Optional[date] = None
    skills_required: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    company: Optional[CompanyPublic] = None
