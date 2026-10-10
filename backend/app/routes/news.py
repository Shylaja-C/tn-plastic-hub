"""
News routes.
"""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user, require_admin
from app.models.news import News, NewsCategory, NewsStatus
from app.models.user import User
from app.schemas.common import PaginatedResponse
from app.schemas.news import NewsCreate, NewsResponse, NewsUpdate
from app.services.crud import create_obj, delete_obj, get_obj, list_objs, update_obj

router = APIRouter(prefix="/news", tags=["News"])


@router.get("", response_model=PaginatedResponse[NewsResponse])
def get_news(
    category: Optional[NewsCategory] = Query(default=None),
    status_filter: Optional[NewsStatus] = Query(default=None, alias="status"),
    featured: Optional[bool] = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    filters = []
    if category:
        filters.append(News.category == category)
    if status_filter:
        filters.append(News.status == status_filter)
    if featured is not None:
        filters.append(News.is_featured == featured)
    skip = (page - 1) * page_size
    items, total = list_objs(db, News, filters=filters, skip=skip, limit=page_size)
    pages = (total + page_size - 1) // page_size
    return PaginatedResponse(items=items, total=total, page=page, page_size=page_size, pages=pages)


@router.get("/{news_id}", response_model=NewsResponse)
def get_news_item(news_id: int, db: Session = Depends(get_db)):
    return get_obj(db, News, news_id)


@router.post("", response_model=NewsResponse, status_code=201)
def create_news(
    data: NewsCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    # Check slug uniqueness
    if db.query(News).filter(News.slug == data.slug).first():
        raise HTTPException(status_code=409, detail="Slug already exists")
    return create_obj(db, News, data, author_id=current_user.id)


@router.patch("/{news_id}", response_model=NewsResponse)
def update_news_item(
    news_id: int,
    data: NewsUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    news = get_obj(db, News, news_id)
    return update_obj(db, news, data)


@router.delete("/{news_id}", status_code=204)
def delete_news_item(
    news_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    news = get_obj(db, News, news_id)
    delete_obj(db, news)
