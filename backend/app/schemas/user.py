"""
User Pydantic schemas.
"""

from datetime import datetime
from typing import Optional

from pydantic import EmailStr, Field, field_validator

from app.models.user import UserRole, UserStatus
from app.schemas.common import OrmBase


# ── Request schemas ───────────────────────────────────────────────────────────

class UserRegister(OrmBase):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    full_name: str = Field(min_length=2, max_length=255)
    phone: Optional[str] = Field(default=None, max_length=20)
    role: UserRole = UserRole.student

    # Student-specific (optional at registration)
    college_name: Optional[str] = Field(default=None, max_length=255)
    department: Optional[str] = Field(default=None, max_length=255)
    graduation_year: Optional[int] = Field(default=None, ge=2000, le=2040)

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        if not any(c.isalpha() for c in v):
            raise ValueError("Password must contain at least one letter")
        return v


class UserLogin(OrmBase):
    email: EmailStr
    password: str


class UserUpdate(OrmBase):
    full_name: Optional[str] = Field(default=None, max_length=255)
    phone: Optional[str] = Field(default=None, max_length=20)
    college_name: Optional[str] = Field(default=None, max_length=255)
    department: Optional[str] = Field(default=None, max_length=255)
    graduation_year: Optional[int] = Field(default=None, ge=2000, le=2040)
    skills: Optional[str] = None
    bio: Optional[str] = None
    linkedin_url: Optional[str] = Field(default=None, max_length=500)
    profile_picture_url: Optional[str] = Field(default=None, max_length=500)


class UserStatusUpdate(OrmBase):
    status: UserStatus


class PasswordChange(OrmBase):
    current_password: str
    new_password: str = Field(min_length=8, max_length=128)


# ── Response schemas ──────────────────────────────────────────────────────────

class UserResponse(OrmBase):
    id: int
    email: str
    full_name: str
    phone: Optional[str] = None
    role: UserRole
    status: UserStatus
    is_verified: bool
    college_name: Optional[str] = None
    department: Optional[str] = None
    graduation_year: Optional[int] = None
    skills: Optional[str] = None
    bio: Optional[str] = None
    linkedin_url: Optional[str] = None
    profile_picture_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class UserPublic(OrmBase):
    """Minimal public-facing user info (e.g. for application listings)."""

    id: int
    full_name: str
    role: UserRole
    college_name: Optional[str] = None
    department: Optional[str] = None
    profile_picture_url: Optional[str] = None


# ── Token schemas ─────────────────────────────────────────────────────────────

class Token(OrmBase):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(OrmBase):
    user_id: Optional[int] = None
    role: Optional[str] = None
