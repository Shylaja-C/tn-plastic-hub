"""
Spec-aligned industrial visits path:
  GET /api/industrial-visits/my-bookings
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.user import User
from app.schemas.common import PaginatedResponse
from app.schemas.industrial_visit import BookingResponse
from app.services.industrial_visit import get_student_bookings

router = APIRouter(prefix="/industrial-visits", tags=["Industrial Visits"])


@router.get(
    "/my-bookings",
    response_model=PaginatedResponse[BookingResponse],
    summary="Get my industrial visit bookings (alias for /bookings/me)",
)
def my_bookings(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    skip = (page - 1) * page_size
    bookings, total = get_student_bookings(db, current_user.id, skip=skip, limit=page_size)
    pages = (total + page_size - 1) // page_size
    return PaginatedResponse(
        items=bookings, total=total, page=page, page_size=page_size, pages=pages
    )
