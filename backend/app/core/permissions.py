"""Centralized permission registry for workspace roles."""
from __future__ import annotations

import enum
from typing import Mapping

from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user, is_master_admin
from app.db.session import get_db
from app.models.user import User, UserRole
from app.services import rbac_audit_service


class Permission(str, enum.Enum):
    """Enumerated platform permissions for coarse-grained checks."""

    BILLING_VIEW = "billing:view"
    BILLING_MANAGE = "billing:manage"
    MASTER_IMPERSONATE = "master:impersonate"


PERMISSION_MATRIX: Mapping[Permission, set[UserRole]] = {
    Permission.BILLING_VIEW: {
        UserRole.solo,
        UserRole.growth,
        UserRole.enterprise,
        UserRole.admin,
        UserRole.master_admin,
    },
    Permission.BILLING_MANAGE: {
        UserRole.admin,
        UserRole.master_admin,
    },
    Permission.MASTER_IMPERSONATE: {
        UserRole.master_admin,
    },
}


def _normalize_role(role: UserRole | str | None) -> UserRole | None:
    if isinstance(role, UserRole):
        return role
    if isinstance(role, str):
        try:
            return UserRole(role)
        except ValueError:
            return None
    return None


def check_permission(user: User, permission: Permission) -> bool:
    """Return True if the user is allowed to perform the permission."""

    if is_master_admin(user):
        return True
    normalized_role = _normalize_role(user.role)
    if not normalized_role:
        return False

    allowed_roles = PERMISSION_MATRIX.get(permission, set())
    return normalized_role in allowed_roles


def require_permission(permission: Permission):
    """FastAPI dependency enforcing that the current user has a permission."""

    def permission_checker(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db),
    ) -> User:
        if not check_permission(current_user, permission):
            rbac_audit_service.log_permission_denied(
                db,
                actor_user_id=current_user.id,
                organization_id=current_user.organization_id,
                permission=permission.value,
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission '{permission.value}' required",
            )
        return current_user

    return permission_checker


__all__ = ["Permission", "check_permission", "require_permission"]
