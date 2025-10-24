"""RBAC (Role-Based Access Control) dependencies.

This module re-exports RBAC functions from auth.py for backward compatibility
and cleaner imports in route files.
"""

from app.api.dependencies.auth import (
    get_current_admin_user,
    require_role,
    require_min_role
)

__all__ = [
    "get_current_admin_user",
    "require_role",
    "require_min_role"
]
