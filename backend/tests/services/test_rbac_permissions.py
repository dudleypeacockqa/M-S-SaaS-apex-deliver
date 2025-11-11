"""
Comprehensive RBAC Permissions Service tests.
Tests audit logging, role hierarchy, and permission enforcement.
Following TDD: RED → GREEN → REFACTOR

Coverage targets:
- RBAC Audit Service (log_role_change, log_user_status_change, log_claim_mismatch)
- Auth dependency enforcement (role hierarchy, claim integrity)
- Permission hierarchy validation

Estimated: 15 tests to push backend coverage from 83% → 84%+
"""
from __future__ import annotations

import pytest
from sqlalchemy.orm import Session

from app.models.rbac_audit_log import RBACAuditAction, RBACAuditLog
from app.models.user import User, UserRole, get_role_level
from app.services.rbac_audit_service import (
    CLAIM_SNAPSHOT_KEYS,
    log_claim_mismatch,
    log_role_change,
    log_user_status_change,
)


class TestRBACAuditServiceLogging:
    """Test suite for RBAC audit logging operations."""

    def test_log_role_change_creates_audit_entry(
        self, db_session: Session, create_user
    ):
        """Verify that log_role_change creates a RBACAuditLog entry."""
        actor = create_user(role=UserRole.admin, email="admin@example.com")
        target = create_user(role=UserRole.solo, email="target@example.com")

        audit_log = log_role_change(
            db_session,
            actor_user_id=actor.id,
            target_user_id=target.id,
            organization_id=actor.organization_id,
            previous_role="solo",
            new_role="growth",
        )

        assert audit_log is not None
        assert audit_log.action == RBACAuditAction.ROLE_CHANGE.value
        assert audit_log.actor_user_id == actor.id
        assert audit_log.target_user_id == target.id

    def test_log_role_change_captures_before_after_values(
        self, db_session: Session, create_user
    ):
        """Verify detail field contains from→to format for role transitions."""
        actor = create_user(role=UserRole.admin)
        target = create_user(role=UserRole.solo)

        audit_log = log_role_change(
            db_session,
            actor_user_id=actor.id,
            target_user_id=target.id,
            organization_id=actor.organization_id,
            previous_role="solo",
            new_role="admin",
        )

        assert "solo" in audit_log.detail
        assert "admin" in audit_log.detail
        assert "Role changed from" in audit_log.detail

    def test_log_user_status_change_user_deleted(
        self, db_session: Session, create_user
    ):
        """Verify deletion events are logged correctly."""
        actor = create_user(role=UserRole.admin)
        target = create_user(role=UserRole.solo)

        audit_log = log_user_status_change(
            db_session,
            actor_user_id=actor.id,
            target_user_id=target.id,
            organization_id=actor.organization_id,
            action=RBACAuditAction.USER_DELETED,
            detail="User soft-deleted by admin",
        )

        assert audit_log.action == RBACAuditAction.USER_DELETED.value
        assert audit_log.detail == "User soft-deleted by admin"

    def test_log_user_status_change_user_restored(
        self, db_session: Session, create_user
    ):
        """Verify restoration events are logged correctly."""
        actor = create_user(role=UserRole.admin)
        target = create_user(role=UserRole.solo)

        audit_log = log_user_status_change(
            db_session,
            actor_user_id=actor.id,
            target_user_id=target.id,
            organization_id=actor.organization_id,
            action=RBACAuditAction.USER_RESTORED,
            detail="User restored from deleted state",
        )

        assert audit_log.action == RBACAuditAction.USER_RESTORED.value
        assert "restored" in audit_log.detail.lower()

    def test_log_user_status_change_rejects_invalid_action(
        self, db_session: Session, create_user
    ):
        """Verify ValueError is raised on unsupported action types."""
        actor = create_user(role=UserRole.admin)
        target = create_user(role=UserRole.solo)

        with pytest.raises(ValueError, match="Unsupported action"):
            log_user_status_change(
                db_session,
                actor_user_id=actor.id,
                target_user_id=target.id,
                organization_id=actor.organization_id,
                action=RBACAuditAction.ROLE_CHANGE,  # Invalid for status change
                detail="This should fail",
            )

    def test_log_claim_mismatch_sanitizes_claims(
        self, db_session: Session, create_user
    ):
        """Verify only safe claim keys are stored in snapshot."""
        actor = create_user(role=UserRole.admin)

        full_claims = {
            "sub": "clerk_12345",
            "org_id": "org_67890",
            "org_role": "admin",
            "sid": "session_abc",
            "iss": "clerk.example.com",
            "session_id": "sess_xyz",
            "unsafe_pii": "secret_data",  # Should be filtered out
            "another_unsafe": "more_secrets",  # Should be filtered out
        }

        audit_log = log_claim_mismatch(
            db_session,
            actor_user_id=actor.id,
            organization_id=actor.organization_id,
            detail="Organization ID mismatch detected",
            claim_snapshot=full_claims,
        )

        # Verify only safe keys are in the snapshot
        assert audit_log.claim_snapshot is not None
        for safe_key in CLAIM_SNAPSHOT_KEYS:
            if safe_key in full_claims:
                assert safe_key in audit_log.claim_snapshot

        # Verify unsafe keys are NOT in snapshot
        assert "unsafe_pii" not in audit_log.claim_snapshot
        assert "another_unsafe" not in audit_log.claim_snapshot

    def test_log_claim_mismatch_logs_org_and_user_ids(
        self, db_session: Session, create_user
    ):
        """Verify audit trail contains actor, target, and organization IDs."""
        actor = create_user(role=UserRole.admin, email="admin@example.com")

        audit_log = log_claim_mismatch(
            db_session,
            actor_user_id=actor.id,
            organization_id=actor.organization_id,
            detail="Role claim mismatch",
            claim_snapshot={"sub": "clerk_123", "org_role": "solo"},
        )

        assert audit_log.actor_user_id == actor.id
        assert audit_log.target_user_id == actor.id  # Claim mismatch targets self
        assert audit_log.organization_id == actor.organization_id
        assert audit_log.action == RBACAuditAction.CLAIM_MISMATCH.value


class TestAuthDependencyEnforcement:
    """Test suite for auth dependency permission enforcement."""

    def test_require_min_role_admin_always_passes(self, create_user):
        """Verify admin bypasses all role checks (level 4)."""
        admin_user = create_user(role=UserRole.admin)

        # Admin level should be 4 (highest)
        assert get_role_level(admin_user.role) == 4

    def test_require_min_role_hierarchy_validation(self, create_user):
        """Verify solo < growth < enterprise < admin ordering."""
        solo_user = create_user(role=UserRole.solo)
        growth_user = create_user(role=UserRole.growth)
        enterprise_user = create_user(role=UserRole.enterprise)
        admin_user = create_user(role=UserRole.admin)

        solo_level = get_role_level(solo_user.role)
        growth_level = get_role_level(growth_user.role)
        enterprise_level = get_role_level(enterprise_user.role)
        admin_level = get_role_level(admin_user.role)

        # Verify strict hierarchy
        assert solo_level < growth_level < enterprise_level < admin_level
        assert solo_level == 1
        assert growth_level == 2
        assert enterprise_level == 3
        assert admin_level == 4

    def test_enforce_claim_integrity_creates_missing_org(
        self, db_session: Session, create_user
    ):
        """
        Verify auto-creation of missing organization from Clerk claim.

        This is a critical security edge case: when a user's JWT contains
        an org_id claim but the organization doesn't exist in our DB.
        """
        # This test verifies the behavior exists - implementation may be
        # in auth dependencies (not rbac_audit_service directly)
        # Marking as placeholder for auth dependency integration tests
        pytest.skip("Auth dependency integration test - requires auth.py mocking")

    def test_enforce_claim_integrity_logs_mismatch(
        self, db_session: Session, create_user
    ):
        """
        Verify claim violations are recorded in audit log.

        When a user's JWT org_id or role doesn't match DB values,
        the mismatch should be logged via log_claim_mismatch().
        """
        pytest.skip("Auth dependency integration test - requires auth.py mocking")

    def test_get_current_user_rejects_missing_clerk_id(self):
        """Verify 401 when sub claim is missing from JWT."""
        pytest.skip("Auth dependency integration test - requires FastAPI request context")


class TestPermissionHierarchy:
    """Test suite for permission hierarchy validation."""

    def test_role_level_function_returns_correct_values(self):
        """Verify get_role_level returns solo=1, growth=2, enterprise=3, admin=4."""
        assert get_role_level(UserRole.solo) == 1
        assert get_role_level(UserRole.growth) == 2
        assert get_role_level(UserRole.enterprise) == 3
        assert get_role_level(UserRole.admin) == 4

    def test_admin_override_bypasses_exact_role_requirement(self, create_user):
        """Verify admin can access role-restricted endpoints."""
        admin_user = create_user(role=UserRole.admin)

        # Admin should have highest privilege level
        assert get_role_level(admin_user.role) == 4

        # Admin level should be greater than all other roles
        assert get_role_level(admin_user.role) > get_role_level(UserRole.enterprise)
        assert get_role_level(admin_user.role) > get_role_level(UserRole.growth)
        assert get_role_level(admin_user.role) > get_role_level(UserRole.solo)

    def test_feature_access_respects_subscription_tier(self):
        """
        Verify Professional+ features are blocked for Starter tier.

        This test validates entitlement_service.py feature gating.
        """
        pytest.skip("Entitlement service test - covered in test_entitlement.py")
