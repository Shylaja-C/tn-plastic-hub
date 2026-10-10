"""
Association routes.
"""

from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import require_admin
from app.models.association import Association
from app.models.user import User
from app.schemas.association import AssociationCreate, AssociationResponse, AssociationUpdate
from app.schemas.common import PaginatedResponse
from app.services.crud import create_obj, delete_obj, get_obj, list_objs, update_obj

router = APIRouter(prefix="/associations", tags=["Associations"])


@router.get("", response_model=PaginatedResponse[AssociationResponse])
def get_associations(
    active_only: bool = Query(default=True),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    filters = []
    if active_only:
        filters.append(Association.is_active == True)
    skip = (page - 1) * page_size
    items, total = list_objs(db, Association, filters=filters, skip=skip, limit=page_size)
    pages = (total + page_size - 1) // page_size
    return PaginatedResponse(items=items, total=total, page=page, page_size=page_size, pages=pages)


@router.get("/{assoc_id}", response_model=AssociationResponse)
def get_association(assoc_id: int, db: Session = Depends(get_db)):
    return get_obj(db, Association, assoc_id)


@router.post("", response_model=AssociationResponse, status_code=201)
def create_association(
    data: AssociationCreate,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    return create_obj(db, Association, data)


@router.patch("/{assoc_id}", response_model=AssociationResponse)
def update_association(
    assoc_id: int,
    data: AssociationUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    assoc = get_obj(db, Association, assoc_id)
    return update_obj(db, assoc, data)


@router.delete("/{assoc_id}", status_code=204)
def delete_association(
    assoc_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    assoc = get_obj(db, Association, assoc_id)
    delete_obj(db, assoc)
