"""
Technology / Knowledge Base model – plastics processing technologies.
"""

import enum
from typing import Optional

from sqlalchemy import Boolean, Enum, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base
from app.models.mixins import TimestampMixin


class TechnologyCategory(str, enum.Enum):
    processing = "processing"
    recycling = "recycling"
    raw_material = "raw_material"
    machinery = "machinery"
    testing = "testing"
    sustainability = "sustainability"
    other = "other"


class Technology(TimestampMixin, Base):
    __tablename__ = "technologies"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    category: Mapped[TechnologyCategory] = mapped_column(
        Enum(TechnologyCategory, name="technologycategory"), default=TechnologyCategory.other
    )
    description: Mapped[Optional[str]] = mapped_column(Text)
    applications: Mapped[Optional[str]] = mapped_column(Text)
    advantages: Mapped[Optional[str]] = mapped_column(Text)
    related_materials: Mapped[Optional[str]] = mapped_column(Text)
    image_url: Mapped[Optional[str]] = mapped_column(String(500))
    reference_url: Mapped[Optional[str]] = mapped_column(String(500))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)

    def __repr__(self) -> str:
        return f"<Technology id={self.id} name={self.name}>"
