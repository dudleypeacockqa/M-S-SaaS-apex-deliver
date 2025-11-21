"""
Tests for RBAC Audit Service - Phase 3.5
TDD: RED → GREEN → REFACTOR
Feature: Complete coverage for rbac_audit_service.py
"""
import pytest
from sqlalchemy.orm import Session

from app.services.rbac_audit_service import (
    log_role_change,
    log_user_status_change,
    log_claim_mismatch,
    log_impersonation,
    log_resource_scope_violation,
)
from app.services.audit_event_sink import set_audit_event_publisher
from app.models.rbac_audit_log import RBACAuditAction, RBACAuditLog


class TestRBACAuditService:
    """Test RBAC audit service functions"""
    
    def test_log_role_change_creates_audit_entry(
        self,
        db_session: Session,
        create_user,
    ):
        """Test log_role_change creates an audit log entry."""
        actor = create_user(email="actor@example.com")
        target = create_user(email="target@example.com")
        
        entry = log_role_change(
            db_session,
            actor_user_id=actor.id,
            target_user_id=target.id,
            organization_id=str(actor.organization_id),
            previous_role="solo",
            new_role="growth",
        )
        
        assert entry is not None
        assert entry.actor_user_id == actor.id
        assert entry.target_user_id == target.id
        assert entry.action == RBACAuditAction.ROLE_CHANGE.value
        assert "solo" in entry.detail
        assert "growth" in entry.detail
        
        # Verify it was persisted
        db_entry = db_session.get(RBACAuditLog, entry.id)
        assert db_entry is not None
        assert db_entry.action == RBACAuditAction.ROLE_CHANGE.value
    
    def test_log_user_status_change_user_deleted(
        self,
        db_session: Session,
        create_user,
    ):
        """Test log_user_status_change logs user deletion."""
        actor = create_user(email="actor@example.com")
        target = create_user(email="target@example.com")
        
        entry = log_user_status_change(
            db_session,
            actor_user_id=actor.id,
            target_user_id=target.id,
            organization_id=str(actor.organization_id),
            action=RBACAuditAction.USER_DELETED,
            detail="User deleted by admin",
        )
        
        assert entry is not None
        assert entry.actor_user_id == actor.id
        assert entry.target_user_id == target.id
        assert entry.action == RBACAuditAction.USER_DELETED.value
        assert "deleted" in entry.detail.lower()
    
    def test_log_user_status_change_user_restored(
        self,
        db_session: Session,
        create_user,
    ):
        """Test log_user_status_change logs user restoration."""
        actor = create_user(email="actor@example.com")
        target = create_user(email="target@example.com")
        
        entry = log_user_status_change(
            db_session,
            actor_user_id=actor.id,
            target_user_id=target.id,
            organization_id=str(actor.organization_id),
            action=RBACAuditAction.USER_RESTORED,
            detail="User restored by admin",
        )
        
        assert entry is not None
        assert entry.action == RBACAuditAction.USER_RESTORED.value
        assert "restored" in entry.detail.lower()
    
    def test_log_user_status_change_rejects_invalid_action(
        self,
        db_session: Session,
        create_user,
    ):
        """Test log_user_status_change raises ValueError for invalid action."""
        actor = create_user(email="actor@example.com")
        target = create_user(email="target@example.com")
        
        with pytest.raises(ValueError) as exc_info:
            log_user_status_change(
                db_session,
                actor_user_id=actor.id,
                target_user_id=target.id,
                organization_id=str(actor.organization_id),
                action=RBACAuditAction.CLAIM_MISMATCH,  # Invalid for status change
                detail="Test",
            )
        
        assert "Unsupported action" in str(exc_info.value)
    
    def test_log_claim_mismatch_creates_audit_entry(
        self,
        db_session: Session,
        create_user,
    ):
        """Test log_claim_mismatch creates an audit log entry."""
        user = create_user(email="user@example.com")
        claims = {
            "sub": "clerk_user_123",
            "org_id": "wrong_org",
            "org_role": "admin",
        }
        
        entry = log_claim_mismatch(
            db_session,
            actor_user_id=user.id,
            organization_id=str(user.organization_id),
            detail="Organization claim mismatch",
            claim_snapshot=claims,
        )
        
        assert entry is not None
        assert entry.actor_user_id == user.id
        assert entry.target_user_id == user.id  # Same as actor
        assert entry.action == RBACAuditAction.CLAIM_MISMATCH.value
        assert "mismatch" in entry.detail.lower()
        assert entry.claim_snapshot is not None
        assert entry.claim_snapshot["sub"] == "clerk_user_123"
        assert entry.claim_snapshot["org_id"] == "wrong_org"
    
    def test_log_claim_mismatch_filters_claim_snapshot(
        self,
        db_session: Session,
        create_user,
    ):
        """Test log_claim_mismatch filters claim snapshot to allowed keys."""
        user = create_user(email="user@example.com")
        claims = {
            "sub": "clerk_user_123",
            "org_id": "wrong_org",
            "org_role": "admin",
            "sid": "session_123",
            "iss": "clerk",
            "session_id": "sess_456",
            "unallowed_key": "should_be_removed",
            "another_bad": "removed",
        }
        
        entry = log_claim_mismatch(
            db_session,
            actor_user_id=user.id,
            organization_id=str(user.organization_id),
            detail="Test",
            claim_snapshot=claims,
        )
        
        assert entry.claim_snapshot is not None
        # Should only contain allowed keys
        assert "sub" in entry.claim_snapshot
        assert "org_id" in entry.claim_snapshot
        assert "org_role" in entry.claim_snapshot
        assert "sid" in entry.claim_snapshot
        assert "iss" in entry.claim_snapshot
        assert "session_id" in entry.claim_snapshot
        # Should NOT contain unallowed keys
        assert "unallowed_key" not in entry.claim_snapshot
        assert "another_bad" not in entry.claim_snapshot
    
    def test_log_claim_mismatch_handles_none_claim_snapshot(
        self,
        db_session: Session,
        create_user,
    ):
        """Test log_claim_mismatch handles None claim snapshot."""
        user = create_user(email="user@example.com")
        
        entry = log_claim_mismatch(
            db_session,
            actor_user_id=user.id,
            organization_id=str(user.organization_id),
            detail="Test without claims",
            claim_snapshot=None,
        )

    def test_log_resource_scope_violation_emits_audit_event(
        self,
        db_session: Session,
        create_user,
    ):
        """Ensure resource scope violations trigger telemetry events."""
        actor = create_user(email="scope@example.com")
        intercepted: list[dict] = []
        set_audit_event_publisher(intercepted.append)
        try:
            entry = log_resource_scope_violation(
                db_session,
                actor_user_id=actor.id,
                organization_id=str(actor.organization_id),
                resource_type="document",
                resource_id="doc-123",
                detail="Attempted cross-tenant access",
            )
        finally:
            set_audit_event_publisher(None)

        assert entry.action == RBACAuditAction.RESOURCE_SCOPE_VIOLATION.value
        assert intercepted, "Expected telemetry event"
        event = intercepted[0]
        assert event["action"] == RBACAuditAction.RESOURCE_SCOPE_VIOLATION.value
        assert event["metadata"]["resource_type"] == "document"
        assert event["metadata"]["resource_id"] == "doc-123"

    def test_log_impersonation_records_scope(
        self,
        db_session: Session,
        create_user,
        create_organization,
    ):
        """Test log_impersonation records impersonation metadata."""
        master_admin = create_user(email="master@example.com")
        tenant_org = create_organization(name="Tenant 123")
        tenant_id = str(tenant_org.id)
        entry = log_impersonation(
            db_session,
            actor_user_id=master_admin.id,
            organization_id=tenant_id,
            tenant_id=tenant_id,
            customer_id="user-789",
        )

        assert entry.action == RBACAuditAction.IMPERSONATION.value
        assert entry.organization_id == tenant_id
        assert entry.detail is not None
        assert tenant_id in entry.detail
        assert "user-789" in entry.detail
    
    def test_log_claim_mismatch_handles_empty_claim_snapshot(
        self,
        db_session: Session,
        create_user,
    ):
        """Test log_claim_mismatch handles empty claim snapshot."""
        user = create_user(email="user@example.com")
        
        entry = log_claim_mismatch(
            db_session,
            actor_user_id=user.id,
            organization_id=str(user.organization_id),
            detail="Test with empty claims",
            claim_snapshot={},
        )
        
        assert entry is not None
        # Empty dict with no matching keys results in empty dict (or None if DB converts)
        # The key is that it doesn't crash
        assert entry.claim_snapshot is None or isinstance(entry.claim_snapshot, dict)

