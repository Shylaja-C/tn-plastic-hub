"""
Scheme Pydantic schemas.
"""

from datetime import date, datetime
from typing import Optional

from app.models.scheme import SchemeCategory, SchemeStatus
from app.schemas.common import OrmBase


class SchemeCreate(OrmBase):
    title: str
    category: SchemeCategory = SchemeCategory.other
    status: SchemeStatus = SchemeStatus.active
    description: Optional[str] = None
    eligibility: Optional[str] = None
    benefits: Optional[str] = None
    how_to_apply: Optional[str] = None
    issuing_authority: Optional[str] = None
    scheme_url: Optional[str] = None
    application_deadline: Optional[date] = None
    is_featured: bool = False


class SchemeUpdate(OrmBase):
    title: Optional[str] = None
    category: Optional[SchemeCategory] = None
    status: Optional[SchemeStatus] = None
    description: Optional[str] = None
    eligibility: Optional[str] = None
    benefits: Optional[str] = None
    how_to_apply: Optional[str] = None
    issuing_authority: Optional[str] = None
    scheme_url: Optional[str] = None
    application_deadline: Optional[date] = None
    is_featured: Optional[bool] = None


class SchemeResponse(OrmBase):
    id: int
    title: str
    category: SchemeCategory
    status: SchemeStatus
    description: Optional[str] = None
    eligibility: Optional[str] = None
    benefits: Optional[str] = None
    how_to_apply: Optional[str] = None
    issuing_authority: Optional[str] = None
    scheme_url: Optional[str] = None
    application_deadline: Optional[date] = None
    is_featured: bool
    created_at: datetime
    updated_at: datetime
