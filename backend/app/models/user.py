"""User model definitions."""
from __future__ import annotations

import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Enum, String
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base


class UserRole(str, enum.Enum):
    """Supported user roles mirrored from Clerk custom claims."""

    solo = "solo"
    growth = "growth"
    enterprise = "enterprise"
    admin = "admin"


class User(Base):
    """Application user synchronized from Clerk."""

    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
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
    organization_id = Column(UUID(as_uuid=True), nullable=True)

    def __repr__(self) -> str:  # pragma: no cover - repr aid
        return f"User(id={self.id!s}, clerk_user_id={self.clerk_user_id!r})"
