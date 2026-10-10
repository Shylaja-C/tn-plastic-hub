"""
Industrial Visit & Booking Pydantic schemas.
"""

from datetime import date, datetime
from typing import Optional

from pydantic import Field

from app.models.industrial_visit import BookingStatus, VisitStatus
from app.schemas.common import OrmBase
from app.schemas.company import CompanyPublic


class IndustrialVisitCreate(OrmBase):
    title: str = Field(min_length=3, max_length=255)
    description: Optional[str] = None
    visit_date: date
    duration_hours: Optional[int] = Field(default=None, ge=1, le=24)
    max_participants: int = Field(default=30, ge=1)
    location: Optional[str] = Field(default=None, max_length=255)
    target_audience: Optional[str] = Field(default=None, max_length=255)
    registration_deadline: Optional[date] = None


class IndustrialVisitUpdate(OrmBase):
    title: Optional[str] = Field(default=None, min_length=3, max_length=255)
    description: Optional[str] = None
    visit_date: Optional[date] = None
    duration_hours: Optional[int] = Field(default=None, ge=1, le=24)
    max_participants: Optional[int] = Field(default=None, ge=1)
    location: Optional[str] = Field(default=None, max_length=255)
    status: Optional[VisitStatus] = None
    target_audience: Optional[str] = Field(default=None, max_length=255)
    registration_deadline: Optional[date] = None


class IndustrialVisitResponse(OrmBase):
    id: int
    company_id: int
    title: str
    description: Optional[str] = None
    visit_date: date
    duration_hours: Optional[int] = None
    max_participants: int
    location: Optional[str] = None
    status: VisitStatus
    target_audience: Optional[str] = None
    registration_deadline: Optional[date] = None
    created_at: datetime
    updated_at: datetime
    company: Optional[CompanyPublic] = None


# ── Booking ───────────────────────────────────────────────────────────────────

class BookingCreate(OrmBase):
    notes: Optional[str] = None


class BookingStatusUpdate(OrmBase):
    status: BookingStatus


class BookingResponse(OrmBase):
    id: int
    visit_id: int
    student_id: int
    status: BookingStatus
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    visit: Optional[IndustrialVisitResponse] = None
