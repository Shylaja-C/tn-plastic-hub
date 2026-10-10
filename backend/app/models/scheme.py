"""
Government / Industry Scheme model.
"""

import enum
from datetime import date
from typing import Optional

from sqlalchemy import Boolean, Date, Enum, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base
from app.models.mixins import TimestampMixin


class SchemeCategory(str, enum.Enum):
    startup = "startup"
    msme = "msme"
    technology = "technology"
    export = "export"
    environment = "environment"
    other = "other"


class SchemeStatus(str, enum.Enum):
    active = "active"
    expired = "expired"
    upcoming = "upcoming"


class Scheme(TimestampMixin, Base):
    __tablename__ = "schemes"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    category: Mapped[SchemeCategory] = mapped_column(
        Enum(SchemeCategory, name="schemecategory"), default=SchemeCategory.other
    )
    status: Mapped[SchemeStatus] = mapped_column(
        Enum(SchemeStatus, name="schemestatus"), default=SchemeStatus.active
    )

    description: Mapped[Optional[str]] = mapped_column(Text)
    eligibility: Mapped[Optional[str]] = mapped_column(Text)
    benefits: Mapped[Optional[str]] = mapped_column(Text)
    how_to_apply: Mapped[Optional[str]] = mapped_column(Text)

    issuing_authority: Mapped[Optional[str]] = mapped_column(String(255))
    scheme_url: Mapped[Optional[str]] = mapped_column(String(500))
    application_deadline: Mapped[Optional[date]] = mapped_column(Date)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)

    def __repr__(self) -> str:
        return f"<Scheme id={self.id} title={self.title}>"
