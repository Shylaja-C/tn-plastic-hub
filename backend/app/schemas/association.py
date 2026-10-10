"""
Association Pydantic schemas.
"""

from datetime import datetime
from typing import Optional

from app.schemas.common import OrmBase


class AssociationCreate(OrmBase):
    name: str
    acronym: Optional[str] = None
    description: Optional[str] = None
    headquarters: Optional[str] = None
    website: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    logo_url: Optional[str] = None
    membership_info: Optional[str] = None
    is_active: bool = True
    is_featured: bool = False


class AssociationUpdate(OrmBase):
    name: Optional[str] = None
    acronym: Optional[str] = None
    description: Optional[str] = None
    headquarters: Optional[str] = None
    website: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    logo_url: Optional[str] = None
    membership_info: Optional[str] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None


class AssociationResponse(OrmBase):
    id: int
    name: str
    acronym: Optional[str] = None
    description: Optional[str] = None
    headquarters: Optional[str] = None
    website: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    logo_url: Optional[str] = None
    membership_info: Optional[str] = None
    is_active: bool
    is_featured: bool
    created_at: datetime
    updated_at: datetime
