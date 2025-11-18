"""User model definitions."""
from __future__ import annotations

import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Enum, String
from sqlalchemy.orm import relationship

from app.db.base import Base


class UserRole(str, enum.Enum):
    """Supported user roles mirrored from Clerk custom claims."""

    solo = "solo"
    growth = "growth"
    enterprise = "enterprise"
    admin = "admin"
    master_admin = "master_admin"


def get_role_level(role: UserRole) -> int:
    """
    Get numeric permission level for a role.
    Higher numbers indicate more permissions.

    Args:
        role: The UserRole to get level for

    Returns:
        Integer permission level (1-5, where 5 is master_admin)
    """
    role_levels = {
        UserRole.solo: 1,
        UserRole.growth: 2,
        UserRole.enterprise: 3,
        UserRole.admin: 4,
        UserRole.master_admin: 5,
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
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    # Master Admin Portal relationships
    admin_goals = relationship("AdminGoal", back_populates="user", cascade="all, delete-orphan")
    admin_activities = relationship("AdminActivity", back_populates="user", cascade="all, delete-orphan")
    admin_scores = relationship("AdminScore", back_populates="user", cascade="all, delete-orphan")
    admin_focus_sessions = relationship("AdminFocusSession", back_populates="user", cascade="all, delete-orphan")
    admin_nudges = relationship("AdminNudge", back_populates="user", cascade="all, delete-orphan")
    admin_meetings = relationship("AdminMeeting", back_populates="user", cascade="all, delete-orphan")
    admin_prospects = relationship("AdminProspect", back_populates="user", cascade="all, delete-orphan")
    admin_deals = relationship("AdminDeal", back_populates="user", cascade="all, delete-orphan")
    admin_campaigns = relationship("AdminCampaign", back_populates="user", cascade="all, delete-orphan")
    admin_content_pieces = relationship("AdminContentPiece", back_populates="user", cascade="all, delete-orphan")
    admin_content_scripts = relationship("AdminContentScript", back_populates="user", cascade="all, delete-orphan")
    admin_lead_captures = relationship("AdminLeadCapture", back_populates="user", cascade="all, delete-orphan")
    admin_collateral = relationship("AdminCollateral", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self) -> str:  # pragma: no cover - repr aid
        return f"User(id={self.id!s}, clerk_user_id={self.clerk_user_id!r})"
