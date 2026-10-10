"""
Industrial Visit routes.
"""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user, require_industry, require_student
from app.models.industrial_visit import VisitStatus
from app.models.user import User
from app.schemas.common import PaginatedResponse
from app.schemas.industrial_visit import (
    BookingCreate,
    BookingResponse,
    BookingStatusUpdate,
    IndustrialVisitCreate,
    IndustrialVisitResponse,
    IndustrialVisitUpdate,
)
from app.services.industrial_visit import (
    create_booking,
    create_visit,
    get_student_bookings,
    get_visit,
    list_visits,
    update_booking_status,
    update_visit,
)

router = APIRouter(prefix="/industrial-visits", tags=["Industrial Visits"])


@router.post("", response_model=IndustrialVisitResponse, status_code=201)
def post_visit(
    data: IndustrialVisitCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_industry),
):
    from app.models.company import Company
    company = db.query(Company).filter_by(owner_id=current_user.id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Register your company first")
    return create_visit(db, company, data)


@router.get("", response_model=PaginatedResponse[IndustrialVisitResponse])
def get_visits(
    company_id: Optional[int] = Query(default=None),
    status_filter: Optional[VisitStatus] = Query(default=None, alias="status"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    skip = (page - 1) * page_size
    visits, total = list_visits(db, company_id=company_id, status_filter=status_filter, skip=skip, limit=page_size)
    pages = (total + page_size - 1) // page_size
    return PaginatedResponse(items=visits, total=total, page=page, page_size=page_size, pages=pages)


@router.get("/mine", response_model=PaginatedResponse[IndustrialVisitResponse])
def get_my_visits(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_industry),
):
    from app.models.company import Company
    company = db.query(Company).filter_by(owner_id=current_user.id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    skip = (page - 1) * page_size
    visits, total = list_visits(db, company_id=company.id, skip=skip, limit=page_size)
    pages = (total + page_size - 1) // page_size
    return PaginatedResponse(items=visits, total=total, page=page, page_size=page_size, pages=pages)


@router.get("/{visit_id}", response_model=IndustrialVisitResponse)
def get_visit_detail(visit_id: int, db: Session = Depends(get_db)):
    return get_visit(db, visit_id)


@router.patch("/{visit_id}", response_model=IndustrialVisitResponse)
def update_visit_detail(
    visit_id: int,
    data: IndustrialVisitUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    visit = get_visit(db, visit_id)
    from app.models.company import Company
    company = db.get(Company, visit.company_id)
    if company.owner_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return update_visit(db, visit, data)


# ── Bookings ──────────────────────────────────────────────────────────────────

@router.post("/{visit_id}/book", response_model=BookingResponse, status_code=201)
def book_visit(
    visit_id: int,
    data: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_student),
):
    visit = get_visit(db, visit_id)
    return create_booking(db, visit, current_user, data)


@router.get("/bookings/me", response_model=PaginatedResponse[BookingResponse])
def my_bookings(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    skip = (page - 1) * page_size
    bookings, total = get_student_bookings(db, current_user.id, skip=skip, limit=page_size)
    pages = (total + page_size - 1) // page_size
    return PaginatedResponse(items=bookings, total=total, page=page, page_size=page_size, pages=pages)


@router.patch("/bookings/{booking_id}/status", response_model=BookingResponse)
def set_booking_status(
    booking_id: int,
    data: BookingStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_booking_status(db, booking_id, data, current_user)
