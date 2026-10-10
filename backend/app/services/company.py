"""
Company service – CRUD and verification workflow.
"""

from typing import List, Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.company import Company, CompanyStatus, CompanyType
from app.models.user import User
from app.schemas.company import CompanyCreate, CompanyUpdate, CompanyVerify


def create_company(db: Session, owner: User, data: CompanyCreate) -> Company:
    # One company per user
    if db.query(Company).filter(Company.owner_id == owner.id).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You already have a registered company",
        )
    if data.gst_number:
        if db.query(Company).filter(Company.gst_number == data.gst_number).first():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="GST number already registered"
            )
    company = Company(owner_id=owner.id, **data.model_dump())
    db.add(company)
    db.commit()
    db.refresh(company)
    return company


def get_company_by_id(db: Session, company_id: int) -> Company:
    company = db.get(Company, company_id)
    if not company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
    return company


def list_companies(
    db: Session,
    company_type: Optional[CompanyType] = None,
    status_filter: Optional[CompanyStatus] = None,
    city: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
) -> tuple[List[Company], int]:
    q = db.query(Company)
    if company_type:
        q = q.filter(Company.company_type == company_type)
    if status_filter:
        q = q.filter(Company.status == status_filter)
    if city:
        q = q.filter(Company.city.ilike(f"%{city}%"))
    total = q.count()
    q = q.order_by(Company.created_at.desc())
    return q.offset(skip).limit(limit).all(), total


def update_company(db: Session, company: Company, data: CompanyUpdate) -> Company:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(company, field, value)
    db.commit()
    db.refresh(company)
    return company


def verify_company(db: Session, company_id: int, admin: User, data: CompanyVerify) -> Company:
    company = get_company_by_id(db, company_id)
    company.status = data.status
    company.verified_by_id = admin.id
    db.commit()
    db.refresh(company)
    return company
