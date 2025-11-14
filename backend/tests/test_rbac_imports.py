"""
Tests for RBAC module imports - Critical Path (Phase 3.2)
TDD: RED → GREEN → REFACTOR
Feature: RBAC backward compatibility exports
"""
import pytest

from app.api.dependencies.rbac import (
    get_current_admin_user,
    require_role,
    require_min_role,
)


def test_rbac_imports_success():
    """Test that RBAC functions can be imported from rbac module."""
    # Test that all exports are available
    assert get_current_admin_user is not None
    assert require_role is not None
    assert require_min_role is not None
    
    # Test that they are callable (dependencies)
    assert callable(get_current_admin_user)
    assert callable(require_role)
    assert callable(require_min_role)


def test_rbac_imports_match_auth_module():
    """Test that RBAC imports match the auth module functions."""
    from app.api.dependencies import auth
    from app.api.dependencies import rbac
    
    # Verify they reference the same functions
    assert rbac.get_current_admin_user is auth.get_current_admin_user
    assert rbac.require_role is auth.require_role
    assert rbac.require_min_role is auth.require_min_role

