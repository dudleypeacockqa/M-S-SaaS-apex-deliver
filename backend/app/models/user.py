"""User model definitions."""
from __future__ import annotations

import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Enum, String

from app.db.base import Base


class UserRole(str, enum.Enum):
    """Supported user roles mirrored from Clerk custom claims."""

    solo = "solo"
    growth = "growth"
    enterprise = "enterprise"
    admin = "admin"


def get_role_level(role: UserRole) -> int:
    """
    Get numeric permission level for a role.
    Higher numbers indicate more permissions.

    Args:
        role: The UserRole to get level for

    Returns:
        Integer permission level (1-4)
    """
    role_levels = {
        UserRole.solo: 1,
        UserRole.growth: 2,
        UserRole.enterprise: 3,
        UserRole.admin: 4,
    }
    return role_levels.get(role, 0)


class User(Base):
    """Application user synchronized from Clerk."""

    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    clerk_user_id = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    profile_image_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    last_login_at = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    role = Column(Enum(UserRole, native_enum=False, length=32), default=UserRole.solo, nullable=False)
    organization_id = Column(String(36), nullable=True)

    def __repr__(self) -> str:  # pragma: no cover - repr aid
        return f"User(id={self.id!s}, clerk_user_id={self.clerk_user_id!r})"
