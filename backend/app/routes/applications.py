"""
Application routes.
"""

from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user, require_admin, require_student, require_industry
from app.models.application import ApplicationStatus
from app.models.user import User
from app.schemas.application import ApplicationCreate, ApplicationResponse, ApplicationStatusUpdate
from app.schemas.common import PaginatedResponse
from app.services.application import (
    create_application,
    get_application,
    list_applications_by_internship,
    list_applications_by_student,
    update_application_status,
    withdraw_application,
)

router = APIRouter(prefix="/applications", tags=["Applications"])


@router.post("", response_model=ApplicationResponse, status_code=201)
def apply(
    data: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_student),
):
    return create_application(db, current_user, data)


@router.get("/me", response_model=PaginatedResponse[ApplicationResponse])
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


@router.get("/internship/{internship_id}", response_model=PaginatedResponse[ApplicationResponse])
def applications_for_internship(
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


@router.get("/my", response_model=PaginatedResponse[ApplicationResponse], summary="Get my applications (alias /my)")
def my_applications_alias(
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


@router.get("/received", response_model=PaginatedResponse[ApplicationResponse])
def received_applications(
    status_filter: Optional[ApplicationStatus] = Query(default=None, alias="status"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_industry),
):
    from app.models.company import Company
    from app.models.internship import Internship
    from app.models.application import Application
    company = db.query(Company).filter_by(owner_id=current_user.id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    q = db.query(Application).join(Internship).filter(Internship.company_id == company.id)
    if status_filter:
        q = q.filter(Application.status == status_filter)
    total = q.count()
    q = q.order_by(Application.created_at.desc())
    apps = q.offset((page - 1) * page_size).limit(page_size).all()
    pages = (total + page_size - 1) // page_size
    return PaginatedResponse(items=apps, total=total, page=page, page_size=page_size, pages=pages)


@router.get("/{application_id}", response_model=ApplicationResponse)
def get_app(application_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return get_application(db, application_id)


@router.patch("/{application_id}/status", response_model=ApplicationResponse)
def set_app_status(
    application_id: int,
    data: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_application_status(db, application_id, data, current_user)


@router.post("/{application_id}/withdraw", response_model=ApplicationResponse)
def withdraw(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    application = get_application(db, application_id)
    return withdraw_application(db, application, current_user)
