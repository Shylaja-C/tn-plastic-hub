"""
Contact / Inquiry routes.
"""

from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user, require_admin
from app.models.contact import Contact, ContactStatus
from app.models.user import User
from app.schemas.common import PaginatedResponse
from app.schemas.contact import ContactAdminUpdate, ContactCreate, ContactResponse
from app.services.crud import create_obj, get_obj, list_objs, update_obj

router = APIRouter(prefix="/contacts", tags=["Contacts"])


@router.post("", response_model=ContactResponse, status_code=201)
def submit_contact(
    data: ContactCreate,
    db: Session = Depends(get_db),
    # Optional: attach user_id if logged in (not required)
):
    return create_obj(db, Contact, data)


@router.get("", response_model=PaginatedResponse[ContactResponse])
def get_contacts(
    status_filter: Optional[ContactStatus] = Query(default=None, alias="status"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    filters = []
    if status_filter:
        filters.append(Contact.status == status_filter)
    skip = (page - 1) * page_size
    items, total = list_objs(db, Contact, filters=filters, skip=skip, limit=page_size)
    pages = (total + page_size - 1) // page_size
    return PaginatedResponse(items=items, total=total, page=page, page_size=page_size, pages=pages)


@router.get("/{contact_id}", response_model=ContactResponse)
def get_contact(
    contact_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    return get_obj(db, Contact, contact_id)


@router.patch("/{contact_id}", response_model=ContactResponse)
def update_contact(
    contact_id: int,
    data: ContactAdminUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    contact = get_obj(db, Contact, contact_id)
    return update_obj(db, contact, data)
