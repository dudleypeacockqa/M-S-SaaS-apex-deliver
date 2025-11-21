"""Tests for centralized permission helpers."""
from fastapi import HTTPException

from app.core.permissions import Permission, check_permission, require_permission
from app.models.rbac_audit_log import RBACAuditLog, RBACAuditAction


def test_check_permission_allows_authorized_roles(admin_user):
    assert check_permission(admin_user, Permission.BILLING_VIEW) is True


def test_check_permission_denies_unlisted_roles(solo_user):
    assert check_permission(solo_user, Permission.BILLING_MANAGE) is False


def test_require_permission_returns_user_when_allowed(master_admin_user, db_session):
    dependency = require_permission(Permission.BILLING_MANAGE)
    result = dependency(current_user=master_admin_user, db=db_session)
    assert result.id == master_admin_user.id


def test_require_permission_raises_for_missing_permission(solo_user, db_session):
    dependency = require_permission(Permission.BILLING_MANAGE)
    try:
        dependency(current_user=solo_user, db=db_session)
    except HTTPException as exc:
        assert exc.status_code == 403
        assert Permission.BILLING_MANAGE.value in exc.detail
    else:  # pragma: no cover - guard
        raise AssertionError("Expected HTTPException for missing permission")


def test_permission_denial_is_audited(db_session, create_user):
    solo = create_user(email="audit@example.com", role="solo")
    dependency = require_permission(Permission.BILLING_MANAGE)

    try:
        dependency(current_user=solo, db=db_session)
    except HTTPException:
        pass
    else:  # pragma: no cover
        raise AssertionError("Expected permission failure")

    logs = (
        db_session.query(RBACAuditLog)
        .filter(RBACAuditLog.actor_user_id == solo.id, RBACAuditLog.action == RBACAuditAction.PERMISSION_DENIED.value)
        .all()
    )
    assert len(logs) == 1
    assert Permission.BILLING_MANAGE.value in (logs[0].detail or "")
