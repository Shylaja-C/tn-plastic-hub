"""
Shared schema primitives used across multiple modules.
"""

from datetime import datetime
from typing import Generic, List, Optional, TypeVar

from pydantic import BaseModel, ConfigDict

DataT = TypeVar("DataT")


class OrmBase(BaseModel):
    """Base for all schemas that read from ORM models."""

    model_config = ConfigDict(from_attributes=True)


class PaginatedResponse(BaseModel, Generic[DataT]):
    """Generic paginated response envelope."""

    items: List[DataT]
    total: int
    page: int
    page_size: int
    pages: int


class MessageResponse(BaseModel):
    message: str


class StatusResponse(BaseModel):
    status: str
    detail: Optional[str] = None
