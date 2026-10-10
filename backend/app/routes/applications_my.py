"""
Spec-aligned applications path:
  GET /api/applications/my   (spec uses /my instead of /me)
"""

from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.application import ApplicationStatus
from app.models.user import User
from app.schemas.application import ApplicationResponse
from app.schemas.common import PaginatedResponse
from app.services.application import list_applications_by_student

router = APIRouter(prefix="/applications", tags=["Applications"])


@router.get(
    "/my",
    response_model=PaginatedResponse[ApplicationResponse],
    summary="Get my applications (alias for /applications/me)",
)
def my_applications(
    status_filter: Optional[ApplicationStatus] = Query(default=None, alias="status"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    skip = (page - 1) * page_size
    apps, total = list_applications_by_student(
        db, current_user.id, status_filter=status_filter, skip=skip, limit=page_size
    )
    pages = (total + page_size - 1) // page_size
    return PaginatedResponse(items=apps, total=total, page=page, page_size=page_size, pages=pages)
