"""
Loan routes.
"""

from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import require_admin
from app.models.loan import Loan, LoanCategory, LoanStatus
from app.models.user import User
from app.schemas.common import PaginatedResponse
from app.schemas.loan import LoanCreate, LoanResponse, LoanUpdate
from app.services.crud import create_obj, delete_obj, get_obj, list_objs, update_obj

router = APIRouter(prefix="/loans", tags=["Loans"])


@router.get("", response_model=PaginatedResponse[LoanResponse])
def get_loans(
    category: Optional[LoanCategory] = Query(default=None),
    status_filter: Optional[LoanStatus] = Query(default=None, alias="status"),
    featured: Optional[bool] = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    filters = []
    if category:
        filters.append(Loan.category == category)
    if status_filter:
        filters.append(Loan.status == status_filter)
    if featured is not None:
        filters.append(Loan.is_featured == featured)
    skip = (page - 1) * page_size
    items, total = list_objs(db, Loan, filters=filters, skip=skip, limit=page_size)
    pages = (total + page_size - 1) // page_size
    return PaginatedResponse(items=items, total=total, page=page, page_size=page_size, pages=pages)


@router.get("/{loan_id}", response_model=LoanResponse)
def get_loan(loan_id: int, db: Session = Depends(get_db)):
    return get_obj(db, Loan, loan_id)


@router.post("", response_model=LoanResponse, status_code=201)
def create_loan(
    data: LoanCreate,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    return create_obj(db, Loan, data)


@router.patch("/{loan_id}", response_model=LoanResponse)
def update_loan(
    loan_id: int,
    data: LoanUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    loan = get_obj(db, Loan, loan_id)
    return update_obj(db, loan, data)


@router.delete("/{loan_id}", status_code=204)
def delete_loan(
    loan_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    loan = get_obj(db, Loan, loan_id)
    delete_obj(db, loan)
