"""
Document Pydantic schemas.
"""

from datetime import datetime
from typing import Optional

from app.models.document import DocumentType
from app.schemas.common import OrmBase


class DocumentCreate(OrmBase):
    title: str
    document_type: DocumentType = DocumentType.other
    file_url: str
    file_size_kb: Optional[int] = None
    mime_type: Optional[str] = None
    description: Optional[str] = None


class DocumentUpdate(OrmBase):
    title: Optional[str] = None
    document_type: Optional[DocumentType] = None
    description: Optional[str] = None


class DocumentResponse(OrmBase):
    id: int
    owner_id: int
    title: str
    document_type: DocumentType
    file_url: str
    file_size_kb: Optional[int] = None
    mime_type: Optional[str] = None
    description: Optional[str] = None
    is_verified: bool
    created_at: datetime
    updated_at: datetime
