"""
Technology routes.
"""

from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import require_admin
from app.models.technology import Technology, TechnologyCategory
from app.models.user import User
from app.schemas.common import PaginatedResponse
from app.schemas.technology import TechnologyCreate, TechnologyResponse, TechnologyUpdate
from app.services.crud import create_obj, delete_obj, get_obj, list_objs, update_obj

router = APIRouter(prefix="/technologies", tags=["Technologies"])


@router.get("", response_model=PaginatedResponse[TechnologyResponse])
def get_technologies(
    category: Optional[TechnologyCategory] = Query(default=None),
    active_only: bool = Query(default=True),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    filters = []
    if category:
        filters.append(Technology.category == category)
    if active_only:
        filters.append(Technology.is_active == True)
    skip = (page - 1) * page_size
    items, total = list_objs(db, Technology, filters=filters, skip=skip, limit=page_size)
    pages = (total + page_size - 1) // page_size
    return PaginatedResponse(items=items, total=total, page=page, page_size=page_size, pages=pages)


@router.get("/{tech_id}", response_model=TechnologyResponse)
def get_technology(tech_id: int, db: Session = Depends(get_db)):
    return get_obj(db, Technology, tech_id)


@router.post("", response_model=TechnologyResponse, status_code=201)
def create_technology(
    data: TechnologyCreate,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    return create_obj(db, Technology, data)


@router.patch("/{tech_id}", response_model=TechnologyResponse)
def update_technology(
    tech_id: int,
    data: TechnologyUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    tech = get_obj(db, Technology, tech_id)
    return update_obj(db, tech, data)


@router.delete("/{tech_id}", status_code=204)
def delete_technology(
    tech_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    tech = get_obj(db, Technology, tech_id)
    delete_obj(db, tech)
