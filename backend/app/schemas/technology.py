"""
Technology Pydantic schemas.
"""

from datetime import datetime
from typing import Optional

from app.models.technology import TechnologyCategory
from app.schemas.common import OrmBase


class TechnologyCreate(OrmBase):
    name: str
    category: TechnologyCategory = TechnologyCategory.other
    description: Optional[str] = None
    applications: Optional[str] = None
    advantages: Optional[str] = None
    related_materials: Optional[str] = None
    image_url: Optional[str] = None
    reference_url: Optional[str] = None
    is_active: bool = True
    is_featured: bool = False


class TechnologyUpdate(OrmBase):
    name: Optional[str] = None
    category: Optional[TechnologyCategory] = None
    description: Optional[str] = None
    applications: Optional[str] = None
    advantages: Optional[str] = None
    related_materials: Optional[str] = None
    image_url: Optional[str] = None
    reference_url: Optional[str] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None


class TechnologyResponse(OrmBase):
    id: int
    name: str
    category: TechnologyCategory
    description: Optional[str] = None
    applications: Optional[str] = None
    advantages: Optional[str] = None
    related_materials: Optional[str] = None
    image_url: Optional[str] = None
    reference_url: Optional[str] = None
    is_active: bool
    is_featured: bool
    created_at: datetime
    updated_at: datetime
