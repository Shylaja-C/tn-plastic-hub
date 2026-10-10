"""
User management routes.
"""

from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user, require_admin
from app.models.user import User, UserRole, UserStatus
from app.schemas.common import PaginatedResponse
from app.schemas.user import PasswordChange, UserResponse, UserStatusUpdate, UserUpdate
from app.services.user import (
    change_password,
    get_user_by_id,
    list_users,
    update_user,
    update_user_status,
)

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("", response_model=PaginatedResponse[UserResponse])
def get_users(
    role: Optional[UserRole] = Query(default=None),
    status_filter: Optional[UserStatus] = Query(default=None, alias="status"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    skip = (page - 1) * page_size
    users, total = list_users(db, role=role, status_filter=status_filter, skip=skip, limit=page_size)
    pages = (total + page_size - 1) // page_size
    return PaginatedResponse(items=users, total=total, page=page, page_size=page_size, pages=pages)


@router.get("/me", response_model=UserResponse, summary="Get my profile")
def get_me(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return current_user


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Users can view their own profile; admins can view anyone
    if current_user.id != user_id and current_user.role.value != "admin":
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return get_user_by_id(db, user_id)


@router.patch("/me", response_model=UserResponse)
def update_me(
    data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_user(db, current_user, data)


@router.post("/me/change-password", response_model=UserResponse)
def change_my_password(
    data: PasswordChange,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return change_password(db, current_user, data.current_password, data.new_password)


@router.patch("/{user_id}/status", response_model=UserResponse)
def set_user_status(
    user_id: int,
    data: UserStatusUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    return update_user_status(db, user_id, data)
