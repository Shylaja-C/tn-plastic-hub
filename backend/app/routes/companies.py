"""
Company routes.
"""

from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user, require_admin, require_industry
from app.models.company import CompanyStatus, CompanyType
from app.models.user import User
from app.schemas.common import PaginatedResponse
from app.schemas.company import CompanyCreate, CompanyResponse, CompanyUpdate, CompanyVerify
from app.services.company import (
    create_company,
    get_company_by_id,
    list_companies,
    update_company,
    verify_company,
)

router = APIRouter(prefix="/companies", tags=["Companies"])


@router.post("", response_model=CompanyResponse, status_code=201)
def register_company(
    data: CompanyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_industry),
):
    return create_company(db, current_user, data)


@router.get("/me", response_model=CompanyResponse)
def get_my_company(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    from app.models.company import Company
    from fastapi import HTTPException
    company = db.query(Company).filter(Company.owner_id == current_user.id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company


@router.get("", response_model=PaginatedResponse[CompanyResponse])
def get_companies(
    company_type: Optional[CompanyType] = Query(default=None),
    status_filter: Optional[CompanyStatus] = Query(default=None, alias="status"),
    city: Optional[str] = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    skip = (page - 1) * page_size
    companies, total = list_companies(
        db, company_type=company_type, status_filter=status_filter, city=city,
        skip=skip, limit=page_size,
    )
    pages = (total + page_size - 1) // page_size
    return PaginatedResponse(items=companies, total=total, page=page, page_size=page_size, pages=pages)


@router.get("/{company_id}", response_model=CompanyResponse)
def get_company(company_id: int, db: Session = Depends(get_db)):
    return get_company_by_id(db, company_id)


@router.patch("/{company_id}", response_model=CompanyResponse)
def update_company_profile(
    company_id: int,
    data: CompanyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    company = get_company_by_id(db, company_id)
    if company.owner_id != current_user.id and current_user.role.value != "admin":
        from fastapi import HTTPException, status
        raise HTTPException(status_code=403, detail="Not your company")
    return update_company(db, company, data)


@router.post("/{company_id}/verify", response_model=CompanyResponse)
def admin_verify_company(
    company_id: int,
    data: CompanyVerify,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    return verify_company(db, company_id, admin, data)
