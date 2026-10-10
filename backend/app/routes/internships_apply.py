"""
Spec-aligned apply endpoint:
  POST /api/internships/{internship_id}/apply
  GET  /api/internships/{internship_id}/applications

These complement the existing /api/v1/internships router.
The apply action lives here to match the spec path exactly.
"""

from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user, require_student
from app.models.application import ApplicationStatus
from app.models.user import User
from app.schemas.application import ApplicationCreate, ApplicationResponse, ApplicationStatusUpdate
from app.schemas.common import PaginatedResponse
from app.services.application import (
    create_application,
    list_applications_by_internship,
    update_application_status,
)

router = APIRouter(prefix="/internships", tags=["Internships"])


@router.post(
    "/{internship_id}/apply",
    response_model=ApplicationResponse,
    status_code=201,
    summary="Apply to an internship",
)
def apply_to_internship(
    internship_id: int,
    data: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_student),
):
    """Student applies to internship_id. Body fields (cover_letter, resume_url) are optional."""
    # Override internship_id from the path – body internship_id is ignored if supplied
    data_with_id = data.model_copy(update={"internship_id": internship_id})
    return create_application(db, current_user, data_with_id)


@router.get(
    "/{internship_id}/applications",
    response_model=PaginatedResponse[ApplicationResponse],
    summary="List applications for an internship",
)
def internship_applications(
    internship_id: int,
    status_filter: Optional[ApplicationStatus] = Query(default=None, alias="status"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    skip = (page - 1) * page_size
    apps, total = list_applications_by_internship(
        db, internship_id, current_user, status_filter=status_filter, skip=skip, limit=page_size
    )
    pages = (total + page_size - 1) // page_size
    return PaginatedResponse(items=apps, total=total, page=page, page_size=page_size, pages=pages)


@router.put(
    "/applications/{application_id}/status",
    response_model=ApplicationResponse,
    summary="Update application status (company / admin)",
)
def set_application_status(
    application_id: int,
    data: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_application_status(db, application_id, data, current_user)
