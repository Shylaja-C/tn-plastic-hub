"""
Internship routes.
"""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user, require_industry
from app.models.internship import InternshipStatus
from app.models.user import User
from app.schemas.common import PaginatedResponse
from app.schemas.internship import InternshipCreate, InternshipResponse, InternshipUpdate
from app.services.company import get_company_by_id
from app.services.internship import (
    create_internship,
    delete_internship,
    get_internship,
    list_internships,
    update_internship,
)

router = APIRouter(prefix="/internships", tags=["Internships"])


@router.post("", response_model=InternshipResponse, status_code=201)
def post_internship(
    data: InternshipCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_industry),
):
    company = db.query(__import__("app.models.company", fromlist=["Company"]).Company).filter_by(owner_id=current_user.id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Register your company first")
    return create_internship(db, company, data)


@router.get("/mine", response_model=PaginatedResponse[InternshipResponse])
def get_my_internships(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_industry),
):
    from app.models.company import Company
    company = db.query(Company).filter(Company.owner_id == current_user.id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    skip = (page - 1) * page_size
    internships, total = list_internships(
        db, company_id=company.id, skip=skip, limit=page_size,
    )
    pages = (total + page_size - 1) // page_size
    return PaginatedResponse(items=internships, total=total, page=page, page_size=page_size, pages=pages)


@router.get("", response_model=PaginatedResponse[InternshipResponse])
def get_internships(
    company_id: Optional[int] = Query(default=None),
    status_filter: Optional[InternshipStatus] = Query(default=None, alias="status"),
    search: Optional[str] = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    skip = (page - 1) * page_size
    internships, total = list_internships(
        db, company_id=company_id, status_filter=status_filter, search=search,
        skip=skip, limit=page_size,
    )
    pages = (total + page_size - 1) // page_size
    return PaginatedResponse(items=internships, total=total, page=page, page_size=page_size, pages=pages)


@router.get("/{internship_id}", response_model=InternshipResponse)
def get_internship_detail(internship_id: int, db: Session = Depends(get_db)):
    return get_internship(db, internship_id)


@router.patch("/{internship_id}", response_model=InternshipResponse)
def update_internship_post(
    internship_id: int,
    data: InternshipUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    internship = get_internship(db, internship_id)
    company = get_company_by_id(db, internship.company_id)
    if company.owner_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return update_internship(db, internship, data)


@router.delete("/{internship_id}", status_code=204)
def delete_internship_post(
    internship_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    internship = get_internship(db, internship_id)
    company = get_company_by_id(db, internship.company_id)
    if company.owner_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    delete_internship(db, internship)
