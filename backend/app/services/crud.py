"""
Generic CRUD helpers for content models (Schemes, Loans, News,
Technologies, Associations, Contacts, Documents, Notifications).
"""

from typing import Any, List, Optional, Type, TypeVar

from fastapi import HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import Base

ModelT = TypeVar("ModelT", bound=Base)


def create_obj(db: Session, model: Type[ModelT], data: BaseModel, **extra) -> ModelT:
    obj = model(**data.model_dump(), **extra)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def get_obj(db: Session, model: Type[ModelT], obj_id: int) -> ModelT:
    obj = db.get(model, obj_id)
    if not obj:
        raise HTTPException(status_code=404, detail=f"{model.__name__} not found")
    return obj


def list_objs(
    db: Session,
    model: Type[ModelT],
    filters: Optional[List] = None,
    skip: int = 0,
    limit: int = 20,
) -> tuple[List[ModelT], int]:
    q = db.query(model)
    for f in (filters or []):
        q = q.filter(f)
    total = q.count()
    if hasattr(model, "created_at"):
        q = q.order_by(model.created_at.desc())
    elif hasattr(model, "id"):
        q = q.order_by(model.id.desc())
    return q.offset(skip).limit(limit).all(), total


def update_obj(db: Session, obj: ModelT, data: BaseModel) -> ModelT:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(obj, field, value)
    db.commit()
    db.refresh(obj)
    return obj


def delete_obj(db: Session, obj: ModelT) -> None:
    db.delete(obj)
    db.commit()
