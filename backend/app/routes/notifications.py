"""
Notification routes.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user, require_admin
from app.models.notification import Notification
from app.models.user import User
from app.schemas.common import PaginatedResponse
from app.schemas.notification import NotificationCreate, NotificationResponse
from app.services.crud import create_obj, get_obj, list_objs

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("/me", response_model=PaginatedResponse[NotificationResponse])
def my_notifications(
    unread_only: bool = Query(default=False),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    filters = [Notification.user_id == current_user.id]
    if unread_only:
        filters.append(Notification.is_read == False)
    skip = (page - 1) * page_size
    items, total = list_objs(db, Notification, filters=filters, skip=skip, limit=page_size)
    pages = (total + page_size - 1) // page_size
    return PaginatedResponse(items=items, total=total, page=page, page_size=page_size, pages=pages)


@router.post("/{notif_id}/read", response_model=NotificationResponse)
def mark_read(
    notif_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    notif = get_obj(db, Notification, notif_id)
    if notif.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    notif.is_read = True
    db.commit()
    db.refresh(notif)
    return notif


@router.post("/me/read-all", response_model=dict)
def mark_all_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False,
    ).update({"is_read": True})
    db.commit()
    return {"message": "All notifications marked as read"}


@router.post("", response_model=NotificationResponse, status_code=201)
def create_notification(
    data: NotificationCreate,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    return create_obj(db, Notification, data)
