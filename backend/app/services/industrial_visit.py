"""
Industrial Visit & Booking service.
"""

from typing import List, Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.industrial_visit import (
    IndustrialVisit,
    IndustrialVisitBooking,
    BookingStatus,
    VisitStatus,
)
from app.models.company import Company
from app.models.user import User
from app.schemas.industrial_visit import (
    IndustrialVisitCreate,
    IndustrialVisitUpdate,
    BookingCreate,
    BookingStatusUpdate,
)


# ── Visits ────────────────────────────────────────────────────────────────────

def create_visit(db: Session, company: Company, data: IndustrialVisitCreate) -> IndustrialVisit:
    visit = IndustrialVisit(company_id=company.id, **data.model_dump())
    db.add(visit)
    db.commit()
    db.refresh(visit)
    return visit


def get_visit(db: Session, visit_id: int) -> IndustrialVisit:
    visit = db.get(IndustrialVisit, visit_id)
    if not visit:
        raise HTTPException(status_code=404, detail="Industrial visit not found")
    return visit


def list_visits(
    db: Session,
    company_id: Optional[int] = None,
    status_filter: Optional[VisitStatus] = None,
    skip: int = 0,
    limit: int = 20,
) -> tuple[List[IndustrialVisit], int]:
    q = db.query(IndustrialVisit)
    if company_id:
        q = q.filter(IndustrialVisit.company_id == company_id)
    if status_filter:
        q = q.filter(IndustrialVisit.status == status_filter)
    total = q.count()
    q = q.order_by(IndustrialVisit.created_at.desc())
    return q.offset(skip).limit(limit).all(), total


def update_visit(db: Session, visit: IndustrialVisit, data: IndustrialVisitUpdate) -> IndustrialVisit:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(visit, field, value)
    db.commit()
    db.refresh(visit)
    return visit


# ── Bookings ──────────────────────────────────────────────────────────────────

def create_booking(db: Session, visit: IndustrialVisit, student: User, data: BookingCreate) -> IndustrialVisitBooking:
    import datetime
    
    # We must lock the visit to prevent overbooking races
    visit = db.query(IndustrialVisit).filter(IndustrialVisit.id == visit.id).with_for_update().first()
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")

    if visit.status != VisitStatus.upcoming:
        raise HTTPException(status_code=400, detail="Visit is not upcoming")
        
    if visit.registration_deadline and visit.registration_deadline < datetime.date.today():
        raise HTTPException(status_code=400, detail="Registration deadline has passed")

    # Check for existing booking
    existing = (
        db.query(IndustrialVisitBooking)
        .filter(
            IndustrialVisitBooking.visit_id == visit.id,
            IndustrialVisitBooking.student_id == student.id,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You have already booked this visit",
        )
    # Check capacity (pending + confirmed)
    booked_count = (
        db.query(IndustrialVisitBooking)
        .filter(
            IndustrialVisitBooking.visit_id == visit.id,
            IndustrialVisitBooking.status.in_([BookingStatus.confirmed, BookingStatus.pending]),
        )
        .count()
    )
    if booked_count >= visit.max_participants:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Visit is fully booked"
        )
    booking = IndustrialVisitBooking(
        visit_id=visit.id, student_id=student.id, notes=data.notes
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


def update_booking_status(
    db: Session, booking_id: int, data: BookingStatusUpdate, current_user: User
) -> IndustrialVisitBooking:
    booking = db.get(IndustrialVisitBooking, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    visit = db.get(IndustrialVisit, booking.visit_id)
    company = db.get(Company, visit.company_id)
    
    if current_user.role.value != "admin" and company.owner_id != current_user.id:
        if current_user.id == booking.student_id:
            if data.status != BookingStatus.cancelled:
                raise HTTPException(status_code=403, detail="Students can only cancel their bookings")
        else:
            raise HTTPException(status_code=403, detail="Not authorized to update this booking")
            
    booking.status = data.status
    db.commit()
    db.refresh(booking)
    return booking


def get_student_bookings(
    db: Session, student_id: int, skip: int = 0, limit: int = 20
) -> tuple[List[IndustrialVisitBooking], int]:
    q = db.query(IndustrialVisitBooking).filter(
        IndustrialVisitBooking.student_id == student_id
    )
    total = q.count()
    q = q.order_by(IndustrialVisitBooking.created_at.desc())
    return q.offset(skip).limit(limit).all(), total
