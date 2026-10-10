"""
Notification Pydantic schemas.
"""

from datetime import datetime
from typing import Optional

from app.models.notification import NotificationType
from app.schemas.common import OrmBase


class NotificationCreate(OrmBase):
    user_id: int
    title: str
    message: str
    notification_type: NotificationType = NotificationType.system
    action_url: Optional[str] = None


class NotificationResponse(OrmBase):
    id: int
    user_id: int
    title: str
    message: str
    notification_type: NotificationType
    is_read: bool
    action_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime
