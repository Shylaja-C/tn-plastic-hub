"""
Contact Pydantic schemas.
"""

from datetime import datetime
from typing import Optional

from pydantic import EmailStr

from app.models.contact import ContactCategory, ContactStatus
from app.schemas.common import OrmBase


class ContactCreate(OrmBase):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str
    category: ContactCategory = ContactCategory.general


class ContactAdminUpdate(OrmBase):
    status: Optional[ContactStatus] = None
    admin_notes: Optional[str] = None


class ContactResponse(OrmBase):
    id: int
    name: str
    email: str
    phone: Optional[str] = None
    subject: str
    message: str
    category: ContactCategory
    status: ContactStatus
    user_id: Optional[int] = None
    admin_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
