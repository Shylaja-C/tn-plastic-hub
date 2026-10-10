"""
News Pydantic schemas.
"""

from datetime import datetime
from typing import Optional

from app.models.news import NewsCategory, NewsStatus
from app.schemas.common import OrmBase


class NewsCreate(OrmBase):
    title: str
    slug: str
    summary: Optional[str] = None
    content: Optional[str] = None
    category: NewsCategory = NewsCategory.industry
    status: NewsStatus = NewsStatus.draft
    thumbnail_url: Optional[str] = None
    source_url: Optional[str] = None
    is_featured: bool = False


class NewsUpdate(OrmBase):
    title: Optional[str] = None
    slug: Optional[str] = None
    summary: Optional[str] = None
    content: Optional[str] = None
    category: Optional[NewsCategory] = None
    status: Optional[NewsStatus] = None
    thumbnail_url: Optional[str] = None
    source_url: Optional[str] = None
    is_featured: Optional[bool] = None


class NewsResponse(OrmBase):
    id: int
    title: str
    slug: str
    summary: Optional[str] = None
    content: Optional[str] = None
    category: NewsCategory
    status: NewsStatus
    thumbnail_url: Optional[str] = None
    source_url: Optional[str] = None
    is_featured: bool
    author_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
