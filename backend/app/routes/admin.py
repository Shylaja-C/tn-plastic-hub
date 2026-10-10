"""
Admin routes.

GET  /api/admin/dashboard            – platform-wide statistics
GET  /api/admin/pending-verifications – companies awaiting verification
PUT  /api/admin/verify/{company_id}  – approve or reject a company
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import require_admin
from app.models.application import Application, ApplicationStatus
from app.models.company import Company, CompanyStatus
from app.models.industrial_visit import IndustrialVisit
from app.models.internship import Internship, InternshipStatus
from app.models.news import News, NewsStatus
from app.models.user import User, UserRole, UserStatus
from app.schemas.common import PaginatedResponse
from app.schemas.company import CompanyResponse, CompanyVerify
from app.services.company import verify_company

router = APIRouter(prefix="/admin", tags=["Admin"])


# ── Dashboard ────────────────────────────────────────────────────────────────

@router.get("/dashboard", summary="Platform-wide statistics")
def dashboard(
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    """
    Returns counts and key metrics for the admin overview page.
    All queries are simple COUNT(*) — no heavy aggregations.
    """
    total_students = db.query(User).filter(User.role == UserRole.student).count()
    total_companies = db.query(Company).count()
    verified_companies = db.query(Company).filter(Company.status == CompanyStatus.verified).count()
    pending_companies = db.query(Company).filter(Company.status == CompanyStatus.pending).count()
    active_internships = db.query(Internship).filter(Internship.status == InternshipStatus.open).count()
    total_applications = db.query(Application).count()
    shortlisted_applications = (
        db.query(Application).filter(Application.status == ApplicationStatus.shortlisted).count()
    )
    upcoming_visits = db.query(IndustrialVisit).count()
    published_news = db.query(News).filter(News.status == NewsStatus.published).count()
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.status == UserStatus.active).count()

    return {
        "users": {
            "total": total_users,
            "active": active_users,
            "students": total_students,
        },
        "companies": {
            "total": total_companies,
            "verified": verified_companies,
            "pending_verification": pending_companies,
        },
        "internships": {
            "active": active_internships,
        },
        "applications": {
            "total": total_applications,
            "shortlisted": shortlisted_applications,
        },
        "industrial_visits": {
            "total": upcoming_visits,
        },
        "news": {
            "published": published_news,
        },
    }


# ── Pending verifications ────────────────────────────────────────────────────

@router.get(
    "/pending-verifications",
    response_model=PaginatedResponse[CompanyResponse],
    summary="Companies awaiting admin verification",
)
def pending_verifications(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    skip = (page - 1) * page_size
    q = db.query(Company).filter(Company.status == CompanyStatus.pending)
    total = q.count()
    items = q.order_by(Company.created_at.asc()).offset(skip).limit(page_size).all()
    pages = (total + page_size - 1) // page_size
    return PaginatedResponse(items=items, total=total, page=page, page_size=page_size, pages=pages)


# ── Verify company ────────────────────────────────────────────────────────────

@router.put(
    "/verify/{company_id}",
    response_model=CompanyResponse,
    summary="Approve or reject a company registration",
)
def verify(
    company_id: int,
    data: CompanyVerify,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """
    Set company status to `verified` or `rejected`.
    The `notes` field is stored as a reviewer comment.
    """
    if data.status not in (CompanyStatus.verified, CompanyStatus.rejected):
        raise HTTPException(
            status_code=400,
            detail="status must be 'verified' or 'rejected'",
        )
    return verify_company(db, company_id, admin, data)
