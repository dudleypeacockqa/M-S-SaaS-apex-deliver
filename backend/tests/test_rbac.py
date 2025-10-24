"""Tests for RBAC (Role-Based Access Control) dependencies."""
from __future__ import annotations

import pytest
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_admin_user, require_min_role, require_role
from app.models.user import User, UserRole


@pytest.fixture
def solo_user(db_session: Session) -> User:
    """Create a solo tier user."""
    user = User(
        clerk_user_id="user_solo123",
        email="solo@example.com",
        role=UserRole.solo,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def growth_user(db_session: Session) -> User:
    """Create a growth tier user."""
    user = User(
        clerk_user_id="user_growth123",
        email="growth@example.com",
        role=UserRole.growth,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def enterprise_user(db_session: Session) -> User:
    """Create an enterprise tier user."""
    user = User(
        clerk_user_id="user_enterprise123",
        email="enterprise@example.com",
        role=UserRole.enterprise,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def admin_user(db_session: Session) -> User:
    """Create an admin user."""
    user = User(
        clerk_user_id="user_admin123",
        email="admin@example.com",
        role=UserRole.admin,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


def test_get_current_admin_user_with_admin(admin_user: User):
    """Test that admin user can access admin-only endpoints."""
    result = get_current_admin_user(admin_user)
    assert result == admin_user


def test_get_current_admin_user_with_non_admin(solo_user: User):
    """Test that non-admin user is rejected from admin endpoints."""
    with pytest.raises(HTTPException) as exc_info:
        get_current_admin_user(solo_user)
    assert exc_info.value.status_code == 403
    assert "Admin access required" in exc_info.value.detail


def test_require_role_exact_match(growth_user: User):
    """Test require_role with exact role match."""
    dependency = require_role(UserRole.growth)
    result = dependency(growth_user)
    assert result == growth_user


def test_require_role_no_match(solo_user: User):
    """Test require_role rejects user without required role."""
    dependency = require_role(UserRole.enterprise)
    with pytest.raises(HTTPException) as exc_info:
        dependency(solo_user)
    assert exc_info.value.status_code == 403
    assert "enterprise" in exc_info.value.detail.lower()


def test_require_role_admin_override(admin_user: User):
    """Test that admin can access any role-protected endpoint."""
    dependency = require_role(UserRole.solo)
    result = dependency(admin_user)
    assert result == admin_user


def test_require_min_role_exact_match(growth_user: User):
    """Test require_min_role with exact match."""
    dependency = require_min_role(UserRole.growth)
    result = dependency(growth_user)
    assert result == growth_user


def test_require_min_role_higher_role(enterprise_user: User):
    """Test require_min_role allows higher roles."""
    dependency = require_min_role(UserRole.solo)
    result = dependency(enterprise_user)
    assert result == enterprise_user


def test_require_min_role_lower_role(solo_user: User):
    """Test require_min_role rejects lower roles."""
    dependency = require_min_role(UserRole.enterprise)
    with pytest.raises(HTTPException) as exc_info:
        dependency(solo_user)
    assert exc_info.value.status_code == 403


def test_require_min_role_admin_override(admin_user: User):
    """Test that admin always has sufficient permissions."""
    dependency = require_min_role(UserRole.enterprise)
    result = dependency(admin_user)
    assert result == admin_user


def test_role_hierarchy():
    """Test role hierarchy levels."""
    from app.models.user import get_role_level

    assert get_role_level(UserRole.solo) < get_role_level(UserRole.growth)
    assert get_role_level(UserRole.growth) < get_role_level(UserRole.enterprise)
    assert get_role_level(UserRole.enterprise) < get_role_level(UserRole.admin)
