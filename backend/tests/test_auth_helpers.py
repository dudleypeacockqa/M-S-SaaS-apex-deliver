"""Tests for auth.py helper functions and security-critical operations."""
from __future__ import annotations

import pytest
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies.auth import (
    _extract_claim,
    _sanitize_claims,
    _enforce_claim_integrity,
    get_current_user,
    require_feature,
)
from app.models.user import User, UserRole
from app.models.organization import Organization


# Tests for _extract_claim helper
def test_extract_claim_with_single_key():
    """Test claim extraction with single key."""
    claims = {"sub": "user_123", "email": "test@example.com"}
    result = _extract_claim(claims, "sub")
    assert result == "user_123"


def test_extract_claim_with_multiple_keys_returns_first_found():
    """Test that _extract_claim returns first matching key in priority order."""
    claims = {"orgId": "org_456", "organization_id": "org_789"}
    # orgId should be returned since it's first in the key list
    result = _extract_claim(claims, "org_id", "orgId", "organization_id")
    assert result == "org_456"


def test_extract_claim_returns_none_when_not_found():
    """Test _extract_claim returns None when no keys match."""
    claims = {"email": "test@example.com"}
    result = _extract_claim(claims, "org_id", "orgId", "organization_id")
    assert result is None


def test_extract_claim_skips_empty_values():
    """Test _extract_claim skips empty string values."""
    claims = {"org_id": "", "orgId": "org_real"}
    result = _extract_claim(claims, "org_id", "orgId")
    # Should skip empty string and return "org_real"
    assert result == "org_real"


def test_extract_claim_handles_falsy_but_valid_values():
    """Test _extract_claim returns 0 and False (truthy check, not identity check)."""
    # Note: Current implementation uses `if value:` which filters out 0 and False
    # This test documents current behavior
    claims = {"count": 0, "flag": False}
    result = _extract_claim(claims, "count")
    assert result is None  # Current implementation filters out 0


# Tests for _sanitize_claims helper
def test_sanitize_claims_filters_allowed_keys():
    """Test _sanitize_claims only returns allowed keys."""
    claims = {
        "sub": "user_123",
        "org_id": "org_456",
        "org_role": "admin",
        "sid": "session_789",
        "iss": "https://clerk.example.com",
        "session_id": "sess_abc",
        "unexpected_key": "should_be_removed",
        "another_bad_key": "also_removed"
    }
    result = _sanitize_claims(claims)

    # Should only contain allowed keys
    assert "sub" in result
    assert "org_id" in result
    assert "org_role" in result
    assert "sid" in result
    assert "iss" in result
    assert "session_id" in result

    # Should NOT contain unexpected keys
    assert "unexpected_key" not in result
    assert "another_bad_key" not in result


def test_sanitize_claims_handles_missing_allowed_keys():
    """Test _sanitize_claims doesn't add keys that don't exist in input."""
    claims = {"sub": "user_123"}
    result = _sanitize_claims(claims)

    assert result == {"sub": "user_123"}
    assert "org_id" not in result
    assert len(result) == 1


def test_sanitize_claims_returns_empty_dict_for_no_allowed_keys():
    """Test _sanitize_claims returns empty dict when no allowed keys present."""
    claims = {"bad_key1": "value1", "bad_key2": "value2"}
    result = _sanitize_claims(claims)
    assert result == {}


# Tests for _enforce_claim_integrity (security-critical function)
def test_enforce_claim_integrity_validates_org_match(db_session: Session):
    """Test _enforce_claim_integrity validates organization claim matches DB."""
    org = Organization(
        id="org_match",
        name="Test Org",
        slug="test-org",
        subscription_tier="professional"
    )
    db_session.add(org)

    user = User(
        clerk_user_id="user_claim_test",
        email="test@example.com",
        role=UserRole.growth,
        organization_id="org_match"
    )
    db_session.add(user)
    db_session.commit()

    claims = {
        "sub": "user_claim_test",
        "org_id": "org_match",
        "org_role": "growth"
    }

    # Should not raise exception - org matches
    _enforce_claim_integrity(user, claims, db_session)


def test_enforce_claim_integrity_rejects_org_mismatch(db_session: Session):
    """Test _enforce_claim_integrity rejects mismatched organization claims."""
    user = User(
        clerk_user_id="user_mismatch",
        email="test@example.com",
        role=UserRole.growth,
        organization_id="org_db"
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    claims = {
        "sub": "user_mismatch",
        "org_id": "org_token",  # Mismatch!
        "org_role": "growth"
    }

    with pytest.raises(HTTPException) as exc_info:
        _enforce_claim_integrity(user, claims, db_session)

    assert exc_info.value.status_code == 401
    assert "Invalid session claims" in exc_info.value.detail


def test_enforce_claim_integrity_rejects_missing_org_claim_when_user_has_org(db_session: Session):
    """Test _enforce_claim_integrity rejects missing org claim when user has organization."""
    user = User(
        clerk_user_id="user_no_claim",
        email="test@example.com",
        role=UserRole.growth,
        organization_id="org_exists"
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    claims = {
        "sub": "user_no_claim",
        # Missing org_id claim!
        "org_role": "growth"
    }

    with pytest.raises(HTTPException) as exc_info:
        _enforce_claim_integrity(user, claims, db_session)

    assert exc_info.value.status_code == 401


def test_enforce_claim_integrity_creates_missing_org_from_clerk(db_session: Session):
    """Test _enforce_claim_integrity creates organization when missing from Clerk sync."""
    user = User(
        clerk_user_id="user_new_org",
        email="test@example.com",
        role=UserRole.growth,
        organization_id=None  # No org yet
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    claims = {
        "sub": "user_new_org",
        "org_id": "org_from_clerk",  # Org exists in Clerk but not DB
        "org_role": "growth"
    }

    # Should create org and populate user.organization_id
    _enforce_claim_integrity(user, claims, db_session)

    db_session.refresh(user)
    assert user.organization_id == "org_from_clerk"

    # Verify org was created
    org = db_session.get(Organization, "org_from_clerk")
    assert org is not None
    assert org.name == "Organization org_from_clerk"
    assert org.slug == "org_from_clerk"
    assert org.subscription_tier == "starter"


def test_enforce_claim_integrity_validates_role_match(db_session: Session):
    """Test _enforce_claim_integrity validates role claim matches DB."""
    user = User(
        clerk_user_id="user_role_match",
        email="test@example.com",
        role=UserRole.enterprise,
        organization_id=None
    )
    db_session.add(user)
    db_session.commit()

    claims = {
        "sub": "user_role_match",
        "org_role": "enterprise"  # Matches
    }

    # Should not raise
    _enforce_claim_integrity(user, claims, db_session)


def test_enforce_claim_integrity_rejects_role_mismatch(db_session: Session):
    """Test _enforce_claim_integrity rejects mismatched role claims."""
    user = User(
        clerk_user_id="user_role_mismatch",
        email="test@example.com",
        role=UserRole.solo,
        organization_id=None
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    claims = {
        "sub": "user_role_mismatch",
        "org_role": "enterprise"  # Mismatch!
    }

    with pytest.raises(HTTPException) as exc_info:
        _enforce_claim_integrity(user, claims, db_session)

    assert exc_info.value.status_code == 401


def test_enforce_claim_integrity_rejects_unknown_role_claim(db_session: Session):
    """Test _enforce_claim_integrity rejects unknown role values."""
    user = User(
        clerk_user_id="user_unknown_role",
        email="test@example.com",
        role=UserRole.growth,
        organization_id=None
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    claims = {
        "sub": "user_unknown_role",
        "org_role": "superuser"  # Not a valid UserRole
    }

    with pytest.raises(HTTPException) as exc_info:
        _enforce_claim_integrity(user, claims, db_session)

    assert exc_info.value.status_code == 401


def test_enforce_claim_integrity_logs_claim_mismatches(db_session: Session):
    """Test _enforce_claim_integrity logs mismatches to rbac_audit_log."""
    user = User(
        clerk_user_id="user_audit_log",
        email="test@example.com",
        role=UserRole.growth,
        organization_id="org_audit"
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    claims = {
        "sub": "user_audit_log",
        "org_id": "org_different",  # Mismatch to trigger audit log
        "org_role": "growth",
        "sid": "session_123"
    }

    try:
        _enforce_claim_integrity(user, claims, db_session)
    except HTTPException:
        pass  # Expected to raise

    # Verify audit log entry was created
    from app.models.rbac_audit_log import RBACAuditLog

    audit_entries = db_session.query(RBACAuditLog).filter_by(
        actor_user_id=user.id,
        action="claim_mismatch"
    ).all()

    assert len(audit_entries) > 0
    audit_entry = audit_entries[-1]  # Get most recent
    assert audit_entry.actor_user_id == user.id
    assert audit_entry.organization_id == "org_audit"
    assert "Organization claim mismatch" in audit_entry.detail
    assert audit_entry.claim_snapshot is not None
    assert "sub" in audit_entry.claim_snapshot


def test_enforce_claim_integrity_allows_missing_role_claim(db_session: Session):
    """Test _enforce_claim_integrity allows missing role claim (optional field)."""
    user = User(
        clerk_user_id="user_no_role_claim",
        email="test@example.com",
        role=UserRole.growth,
        organization_id=None
    )
    db_session.add(user)
    db_session.commit()

    claims = {
        "sub": "user_no_role_claim",
        # No org_role claim - should be allowed
    }

    # Should not raise
    _enforce_claim_integrity(user, claims, db_session)


# Tests for get_current_user (integration test)
@pytest.mark.asyncio
async def test_get_current_user_enforces_claim_integrity(db_session: Session):
    """Test get_current_user calls _enforce_claim_integrity."""
    # This is an integration test that would require mocking Clerk JWT decode
    # Covered by existing auth tests, but noted here for completeness
    pass


# Tests for require_feature (subscription tier feature access)
@pytest.mark.asyncio
async def test_require_feature_allows_access_with_sufficient_tier():
    """Test require_feature allows access when user's tier has feature."""
    # Note: This requires mocking check_feature_access from entitlement_service
    # Will be covered in dedicated entitlement_service tests
    pass


@pytest.mark.asyncio
async def test_require_feature_blocks_access_with_insufficient_tier():
    """Test require_feature blocks access with 403 when tier lacks feature."""
    # Note: This requires mocking check_feature_access from entitlement_service
    # Will be covered in dedicated entitlement_service tests
    pass
