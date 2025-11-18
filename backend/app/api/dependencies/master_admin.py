"""Master admin special permission dependencies."""
from __future__ import annotations

from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user, is_master_admin
from app.db.session import get_db
from app.models.user import User, UserRole


def can_manage_all_organizations(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Dependency that ensures the current user can manage all organizations.
    Only master admin has this permission.

    Args:
        current_user: The authenticated user

    Returns:
        The authenticated master admin user

    Raises:
        HTTPException: If user is not a master admin (403 Forbidden)
    """
    if not is_master_admin(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Master admin access required to manage all organizations",
        )
    return current_user


def can_override_subscription_limits(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Dependency that ensures the current user can override subscription tier restrictions.
    Only master admin has this permission.

    Args:
        current_user: The authenticated user

    Returns:
        The authenticated master admin user

    Raises:
        HTTPException: If user is not a master admin (403 Forbidden)
    """
    if not is_master_admin(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Master admin access required to override subscription limits",
        )
    return current_user


def can_manage_all_users(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Dependency that ensures the current user can manage users across all organizations.
    Only master admin has this permission.

    Args:
        current_user: The authenticated user

    Returns:
        The authenticated master admin user

    Raises:
        HTTPException: If user is not a master admin (403 Forbidden)
    """
    if not is_master_admin(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Master admin access required to manage all users",
        )
    return current_user

