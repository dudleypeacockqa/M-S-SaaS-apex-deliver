"""RBAC audit logging models."""
from __future__ import annotations

import enum
import uuid
from datetime import datetime, timezone
from typing import Optional, Any

from sqlalchemy import Column, DateTime, ForeignKey, JSON, String, Text
from sqlalchemy.orm import relationship

from app.db.base import Base


class RBACAuditAction(str, enum.Enum):
    """Actions that can be recorded in the RBAC audit log."""

    ROLE_CHANGE = "role_change"
    USER_DELETED = "user_deleted"
    USER_RESTORED = "user_restored"
    CLAIM_MISMATCH = "claim_mismatch"
    PERMISSION_DENIED = "permission_denied"
    IMPERSONATION = "impersonation"
    RESOURCE_SCOPE_VIOLATION = "resource_scope_violation"


class RBACAuditLog(Base):
    """Audit log entry for RBAC-sensitive operations."""

    __tablename__ = "rbac_audit_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    actor_user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    target_user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    organization_id = Column(String(36), nullable=True, index=True)
    action = Column(String(32), nullable=False)
    detail = Column(Text, nullable=True)
    claim_snapshot = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    actor = relationship("User", foreign_keys=[actor_user_id], lazy="joined")
    target = relationship("User", foreign_keys=[target_user_id], lazy="joined")

    def to_dict(self) -> dict[str, Any]:  # pragma: no cover - debug helper
        """Serialize audit log entry for debugging."""
        return {
            "id": self.id,
            "actor_user_id": self.actor_user_id,
            "target_user_id": self.target_user_id,
            "organization_id": self.organization_id,
            "action": self.action,
            "detail": self.detail,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
