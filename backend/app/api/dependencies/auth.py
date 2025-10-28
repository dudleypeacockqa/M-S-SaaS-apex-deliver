"""Authentication dependencies."""
from __future__ import annotations

from typing import Callable
import logging

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.security import AuthError, decode_clerk_jwt
from app.db.session import get_db
from app.models.user import User, UserRole, get_role_level
from app.services.user_service import get_user_by_clerk_id
from app.services.entitlement_service import (
    check_feature_access,
    get_required_tier,
    get_feature_upgrade_message,
)

logger = logging.getLogger(__name__)

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


def require_feature(feature: str) -> Callable:
    """
    FastAPI dependency that enforces subscription tier-based feature access.

    Returns 403 with upgrade guidance if user's tier is insufficient for the feature.

    Args:
        feature: Feature identifier (e.g., "podcast_audio", "youtube_integration")

    Returns:
        Dependency function that checks feature access and returns the user

    Raises:
        HTTPException: 403 if user's tier lacks access to the feature

    Example:
        >>> @router.post("/episodes")
        >>> async def create_episode(
        ...     current_user: User = Depends(require_feature("podcast_audio"))
        ... ):
        ...     # Only Professional+ users reach here
        ...     return await podcast_service.create_episode(...)

    Headers in 403 response:
        - X-Required-Tier: Minimum tier needed (e.g., "professional")
        - X-Upgrade-URL: URL to upgrade page (e.g., "/pricing")
        - X-Feature-Locked: The feature that was locked
    """
    async def check_access(
        current_user: User = Depends(get_current_user)
    ) -> User:
        # Check if user's organization has access to the feature
        has_access = await check_feature_access(
            current_user.organization_id,
            feature
        )

        if not has_access:
            # Get required tier and upgrade message
            required_tier = get_required_tier(feature)

            # Try to get current tier from user model for better messaging
            # If user doesn't have subscription_tier attribute, pass None
            current_tier = getattr(current_user, 'subscription_tier', None)

            # Get user-friendly upgrade message
            if current_tier:
                upgrade_message = get_feature_upgrade_message(feature, current_tier)
            else:
                # Fallback message if tier not available
                upgrade_message = f"Upgrade to {required_tier.value.title()} tier to unlock this feature."

            # Log blocked request for analytics
            logger.warning(
                f"Feature access blocked: user_id={current_user.id}, "
                f"org_id={current_user.organization_id}, feature={feature}, "
                f"required_tier={required_tier.value}"
            )

            # Return 403 with upgrade guidance
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=upgrade_message,
                headers={
                    "X-Required-Tier": required_tier.value,
                    "X-Upgrade-URL": "/pricing",
                    "X-Feature-Locked": feature,
                }
            )

        # Access granted - log for debugging
        logger.debug(
            f"Feature access granted: user_id={current_user.id}, feature={feature}"
        )

        return current_user

    return check_access
