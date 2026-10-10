"""
News / Article model – industry news and announcements.
"""

import enum
from typing import Optional

from sqlalchemy import Boolean, Enum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base
from app.models.mixins import TimestampMixin


class NewsCategory(str, enum.Enum):
    industry = "industry"
    government = "government"
    technology = "technology"
    event = "event"
    announcement = "announcement"
    other = "other"


class NewsStatus(str, enum.Enum):
    draft = "draft"
    published = "published"
    archived = "archived"


class News(TimestampMixin, Base):
    __tablename__ = "news"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(500), nullable=False, index=True)
    slug: Mapped[str] = mapped_column(String(500), unique=True, index=True, nullable=False)
    summary: Mapped[Optional[str]] = mapped_column(Text)
    content: Mapped[Optional[str]] = mapped_column(Text)
    category: Mapped[NewsCategory] = mapped_column(
        Enum(NewsCategory, name="newscategory"), default=NewsCategory.industry
    )
    status: Mapped[NewsStatus] = mapped_column(
        Enum(NewsStatus, name="newsstatus"), default=NewsStatus.draft
    )
    thumbnail_url: Mapped[Optional[str]] = mapped_column(String(500))
    source_url: Mapped[Optional[str]] = mapped_column(String(500))
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)

    # Author (admin user)
    author_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )

    def __repr__(self) -> str:
        return f"<News id={self.id} title={self.title}>"
