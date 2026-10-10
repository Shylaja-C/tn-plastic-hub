"""
Application service.
"""

from typing import List, Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.application import Application, ApplicationStatus
from app.models.internship import Internship, InternshipStatus
from app.models.user import User
from app.schemas.application import ApplicationCreate, ApplicationStatusUpdate


def create_application(db: Session, applicant: User, data: ApplicationCreate) -> Application:
    internship = db.get(Internship, data.internship_id)
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    if internship.status != InternshipStatus.open:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Internship is not open for applications"
        )
    existing = (
        db.query(Application)
        .filter(
            Application.applicant_id == applicant.id,
            Application.internship_id == data.internship_id,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="You have already applied to this internship"
        )
    application = Application(
        applicant_id=applicant.id,
        internship_id=data.internship_id,
        cover_letter=data.cover_letter,
        resume_url=data.resume_url,
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


def get_application(db: Session, application_id: int) -> Application:
    app = db.get(Application, application_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app


def list_applications_by_student(
    db: Session,
    student_id: int,
    status_filter: Optional[ApplicationStatus] = None,
    skip: int = 0,
    limit: int = 20,
) -> tuple[List[Application], int]:
    q = db.query(Application).filter(Application.applicant_id == student_id)
    if status_filter:
        q = q.filter(Application.status == status_filter)
    total = q.count()
    q = q.order_by(Application.created_at.desc())
    return q.offset(skip).limit(limit).all(), total


def list_applications_by_internship(
    db: Session,
    internship_id: int,
    current_user: User,
    status_filter: Optional[ApplicationStatus] = None,
    skip: int = 0,
    limit: int = 20,
) -> tuple[List[Application], int]:
    from app.models.company import Company
    internship = db.get(Internship, internship_id)
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    company = db.get(Company, internship.company_id)
    if current_user.role.value != "admin" and company.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view these applications")
    
    q = db.query(Application).filter(Application.internship_id == internship_id)
    if status_filter:
        q = q.filter(Application.status == status_filter)
    total = q.count()
    q = q.order_by(Application.created_at.desc())
    return q.offset(skip).limit(limit).all(), total


def update_application_status(
    db: Session, application_id: int, data: ApplicationStatusUpdate, current_user: User
) -> Application:
    app = get_application(db, application_id)
    internship = db.get(Internship, app.internship_id)
    from app.models.company import Company
    company = db.get(Company, internship.company_id)
    if current_user.role.value != "admin" and company.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update application status")
    
    app.status = data.status
    if data.reviewer_notes is not None:
        app.reviewer_notes = data.reviewer_notes
    db.commit()
    db.refresh(app)
    return app


def withdraw_application(db: Session, application: Application, student: User) -> Application:
    if application.applicant_id != student.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your application")
    if application.status not in (ApplicationStatus.applied, ApplicationStatus.under_review):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot withdraw application at this stage",
        )
    application.status = ApplicationStatus.withdrawn
    db.commit()
    db.refresh(application)
    return application
