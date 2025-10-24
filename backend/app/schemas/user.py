"""User schemas for API requests and responses."""
from __future__ import annotations

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, ConfigDict

from app.models.user import UserRole


class UserBase(BaseModel):
    """Base user schema with common fields."""

    clerk_user_id: str
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_image_url: Optional[str] = None
    role: UserRole = UserRole.solo
    is_active: bool = True
    last_login_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class UserRead(UserBase):
    """User schema for API responses."""

    id: UUID  # UUID from database, serialized as string in JSON
    created_at: datetime
    updated_at: datetime
    organization_id: Optional[UUID] = None

    model_config = ConfigDict(
        from_attributes=True,
        json_encoders={UUID: str}  # Serialize UUID as string in JSON responses
    )


class UserCreate(UserBase):
    """User schema for creation (not used in Clerk sync, kept for consistency)."""

    pass


class UserUpdate(BaseModel):
    """User schema for updates."""

    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_image_url: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
