"""
Application Pydantic schemas.
"""

from datetime import datetime
from typing import Optional

from pydantic import Field

from app.models.application import ApplicationStatus
from app.schemas.common import OrmBase
from app.schemas.internship import InternshipResponse
from app.schemas.user import UserPublic


class ApplicationCreate(OrmBase):
    internship_id: int
    cover_letter: Optional[str] = None
    resume_url: Optional[str] = Field(default=None, max_length=500)


class ApplicationStatusUpdate(OrmBase):
    status: ApplicationStatus
    reviewer_notes: Optional[str] = None


class ApplicationResponse(OrmBase):
    id: int
    applicant_id: int
    internship_id: int
    status: ApplicationStatus
    cover_letter: Optional[str] = None
    resume_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    applicant: Optional[UserPublic] = None
    internship: Optional[InternshipResponse] = None


class ApplicationResponseCompact(OrmBase):
    """Compact version – no nested objects – for list views."""

    id: int
    applicant_id: int
    internship_id: int
    status: ApplicationStatus
    created_at: datetime
    updated_at: datetime
