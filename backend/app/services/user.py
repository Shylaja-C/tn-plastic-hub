"""
User service – CRUD operations.
"""

from typing import List, Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User, UserRole, UserStatus
from app.schemas.user import UserRegister, UserUpdate, UserStatusUpdate
from app.services.auth import hash_password, verify_password


def create_user(db: Session, data: UserRegister) -> User:
    if db.query(User).filter(User.email == data.email.lower()).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email already exists",
        )
    user = User(
        email=data.email.lower(),
        hashed_password=hash_password(data.password),
        full_name=data.full_name,
        phone=data.phone,
        role=data.role,
        college_name=data.college_name,
        department=data.department,
        graduation_year=data.graduation_year,
        status=UserStatus.active,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user_by_id(db: Session, user_id: int) -> User:
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


def list_users(
    db: Session,
    role: Optional[UserRole] = None,
    status_filter: Optional[UserStatus] = None,
    skip: int = 0,
    limit: int = 20,
) -> tuple[List[User], int]:
    q = db.query(User)
    if role:
        q = q.filter(User.role == role)
    if status_filter:
        q = q.filter(User.status == status_filter)
    total = q.count()
    q = q.order_by(User.created_at.desc())
    return q.offset(skip).limit(limit).all(), total


def update_user(db: Session, user: User, data: UserUpdate) -> User:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user


def change_password(db: Session, user: User, current_password: str, new_password: str) -> User:
    if not verify_password(current_password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect"
        )
    user.hashed_password = hash_password(new_password)
    db.commit()
    db.refresh(user)
    return user


def update_user_status(db: Session, user_id: int, data: UserStatusUpdate) -> User:
    user = get_user_by_id(db, user_id)
    user.status = data.status
    db.commit()
    db.refresh(user)
    return user
