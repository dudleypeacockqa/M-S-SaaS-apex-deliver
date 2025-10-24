"""Authentication dependencies."""
from __future__ import annotations

from typing import Callable

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.security import AuthError, decode_clerk_jwt
from app.db.session import get_db
from app.models.user import User, UserRole, get_role_level
from app.services.user_service import get_user_by_clerk_id

http_bearer = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(http_bearer),
    db: Session = Depends(get_db),
) -> User:
    """Retrieve the current user based on Clerk JWT."""

    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")

    try:
        claims = decode_clerk_jwt(credentials.credentials)
    except AuthError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc

    clerk_user_id = claims.get("sub")
    if not clerk_user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    user = get_user_by_clerk_id(db, clerk_user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not registered")

    return user


def get_current_admin_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Dependency that ensures the current user is an admin.

    Args:
        current_user: The authenticated user

    Returns:
        The authenticated admin user

    Raises:
        HTTPException: If user is not an admin (403 Forbidden)
    """
    if current_user.role != UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user


def require_role(required_role: UserRole) -> Callable:
    """
    Factory function that creates a dependency to require a specific role.
    Admin users can bypass role requirements.

    Args:
        required_role: The role required to access the endpoint

    Returns:
        A dependency function that checks user role

    Example:
        @router.get("/enterprise-feature", dependencies=[Depends(require_role(UserRole.enterprise))])
        async def enterprise_only():
            pass
    """

    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        # Admin can access everything
        if current_user.role == UserRole.admin:
            return current_user

        # Check for exact role match
        if current_user.role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"This endpoint requires {required_role.value} role",
            )
        return current_user

    return role_checker


def require_min_role(minimum_role: UserRole) -> Callable:
    """
    Factory function that creates a dependency for hierarchical role checking.
    Users with roles at or above the minimum level can access the endpoint.
    Admin users always have sufficient permissions.

    Args:
        minimum_role: The minimum role level required

    Returns:
        A dependency function that checks user permission level

    Example:
        @router.get("/professional-feature", dependencies=[Depends(require_min_role(UserRole.growth))])
        async def growth_and_above():
            # Accessible by growth, enterprise, and admin
            pass
    """

    def permission_checker(current_user: User = Depends(get_current_user)) -> User:
        # Admin always has sufficient permissions
        if current_user.role == UserRole.admin:
            return current_user

        user_level = get_role_level(current_user.role)
        required_level = get_role_level(minimum_role)

        if user_level < required_level:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"This endpoint requires at least {minimum_role.value} role",
            )
        return current_user

    return permission_checker
