"""
Internship service.
"""

from typing import List, Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.internship import Internship, InternshipStatus
from app.models.company import Company
from app.schemas.internship import InternshipCreate, InternshipUpdate


def create_internship(db: Session, company: Company, data: InternshipCreate) -> Internship:
    internship = Internship(company_id=company.id, **data.model_dump())
    db.add(internship)
    db.commit()
    db.refresh(internship)
    return internship


def get_internship(db: Session, internship_id: int) -> Internship:
    internship = db.get(Internship, internship_id)
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    return internship


def list_internships(
    db: Session,
    company_id: Optional[int] = None,
    status_filter: Optional[InternshipStatus] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
) -> tuple[List[Internship], int]:
    q = db.query(Internship)
    if company_id:
        q = q.filter(Internship.company_id == company_id)
    if status_filter:
        q = q.filter(Internship.status == status_filter)
    if search:
        q = q.filter(Internship.title.ilike(f"%{search}%"))
    total = q.count()
    q = q.order_by(Internship.created_at.desc())
    return q.offset(skip).limit(limit).all(), total


def update_internship(db: Session, internship: Internship, data: InternshipUpdate) -> Internship:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(internship, field, value)
    db.commit()
    db.refresh(internship)
    return internship


def delete_internship(db: Session, internship: Internship) -> None:
    db.delete(internship)
    db.commit()
