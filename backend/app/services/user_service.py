"""User service handling Clerk synchronization."""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Optional

from sqlalchemy.orm import Session

from app.models.user import User, UserRole


def _extract_email(data: dict[str, Any]) -> Optional[str]:
    for entry in data.get("email_addresses", []) or []:
        email = entry.get("email_address")
        if email:
            return email
    return data.get("email")


def _extract_profile_image(data: dict[str, Any]) -> Optional[str]:
    return data.get("profile_image_url")


def _extract_role(data: dict[str, Any]) -> Optional[UserRole]:
    role_value = (
        (data.get("public_metadata") or {}).get("role")
        or (data.get("unsafe_metadata") or {}).get("role")
    )
    if not role_value:
        return None
    try:
        return UserRole(role_value)
    except ValueError:
        return None


def _extract_organization_id(data: dict[str, Any]) -> Optional[str]:
    return (
        data.get("organization_id")
        or (data.get("unsafe_metadata") or {}).get("organization_id")
    )


def create_user_from_clerk(db: Session, clerk_data: dict[str, Any]) -> User:
    """Create or update a user from Clerk webhook payload."""

    existing = get_user_by_clerk_id(db, clerk_data["id"])
    if existing:
        return update_user_from_clerk(db, clerk_data["id"], clerk_data)

    email = _extract_email(clerk_data)
    role = _extract_role(clerk_data) or UserRole.solo
    user = User(
        clerk_user_id=clerk_data["id"],
        email=email or "",
        first_name=clerk_data.get("first_name"),
        last_name=clerk_data.get("last_name"),
        profile_image_url=_extract_profile_image(clerk_data),
        role=role,
        organization_id=_extract_organization_id(clerk_data),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user_from_clerk(db: Session, clerk_user_id: str, clerk_data: dict[str, Any]) -> User:
    user = get_user_by_clerk_id(db, clerk_user_id)
    if user is None:
        raise ValueError(f"User with clerk_user_id={clerk_user_id!r} not found")

    email = _extract_email(clerk_data)
    if email:
        user.email = email
    if (first_name := clerk_data.get("first_name")) is not None:
        user.first_name = first_name
    if (last_name := clerk_data.get("last_name")) is not None:
        user.last_name = last_name
    if (profile := _extract_profile_image(clerk_data)) is not None:
        user.profile_image_url = profile
    if (role := _extract_role(clerk_data)) is not None:
        user.role = role
    if (org_id := _extract_organization_id(clerk_data)) is not None:
        user.organization_id = org_id

    db.commit()
    db.refresh(user)
    return user


def delete_user(db: Session, clerk_user_id: str) -> None:
    user = get_user_by_clerk_id(db, clerk_user_id)
    if user is None:
        return
    user.is_active = False
    db.commit()


def get_user_by_clerk_id(db: Session, clerk_user_id: str) -> Optional[User]:
    return db.query(User).filter(User.clerk_user_id == clerk_user_id).first()


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def update_last_login(db: Session, clerk_user_id: str, last_login: Optional[datetime] = None) -> Optional[User]:
    user = get_user_by_clerk_id(db, clerk_user_id)
    if user is None:
        return None
    user.last_login_at = last_login or datetime.now(timezone.utc)
    db.commit()
    db.refresh(user)
    return user
