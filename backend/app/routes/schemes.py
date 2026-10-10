"""
Scheme routes.
"""

from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import require_admin
from app.models.scheme import Scheme, SchemeCategory, SchemeStatus
from app.models.user import User
from app.schemas.common import PaginatedResponse
from app.schemas.scheme import SchemeCreate, SchemeResponse, SchemeUpdate
from app.services.crud import create_obj, delete_obj, get_obj, list_objs, update_obj

router = APIRouter(prefix="/schemes", tags=["Schemes"])


@router.get("", response_model=PaginatedResponse[SchemeResponse])
def get_schemes(
    category: Optional[SchemeCategory] = Query(default=None),
    status_filter: Optional[SchemeStatus] = Query(default=None, alias="status"),
    featured: Optional[bool] = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    filters = []
    if category:
        filters.append(Scheme.category == category)
    if status_filter:
        filters.append(Scheme.status == status_filter)
    if featured is not None:
        filters.append(Scheme.is_featured == featured)
    skip = (page - 1) * page_size
    items, total = list_objs(db, Scheme, filters=filters, skip=skip, limit=page_size)
    pages = (total + page_size - 1) // page_size
    return PaginatedResponse(items=items, total=total, page=page, page_size=page_size, pages=pages)


@router.get("/{scheme_id}", response_model=SchemeResponse)
def get_scheme(scheme_id: int, db: Session = Depends(get_db)):
    return get_obj(db, Scheme, scheme_id)


@router.post("", response_model=SchemeResponse, status_code=201)
def create_scheme(
    data: SchemeCreate,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    return create_obj(db, Scheme, data)


@router.patch("/{scheme_id}", response_model=SchemeResponse)
def update_scheme(
    scheme_id: int,
    data: SchemeUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    scheme = get_obj(db, Scheme, scheme_id)
    return update_obj(db, scheme, data)


@router.delete("/{scheme_id}", status_code=204)
def delete_scheme(
    scheme_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    scheme = get_obj(db, Scheme, scheme_id)
    delete_obj(db, scheme)
