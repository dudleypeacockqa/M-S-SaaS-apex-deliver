"""
Tests for master admin cross-tenant access scope.

Validates that master admins can impersonate tenant organizations via headers
while non-master users are rejected. These tests drive the implementation of
the tenant scope dependency used by the master admin portal.
"""
from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.api.dependencies.auth import get_current_user
from app.core.permissions import Permission, require_permission
from app.models.deal import Deal, DealStage
from app.models.subscription import Subscription, SubscriptionStatus, SubscriptionTier
from app.models.user import UserRole
from app.models.rbac_audit_log import RBACAuditLog, RBACAuditAction


def _create_subscription(db_session, organization_id: str) -> Subscription:
    subscription = Subscription(
        id=str(uuid4()),
        organization_id=organization_id,
        stripe_customer_id=f"cus_{uuid4().hex[:8]}",
        stripe_subscription_id=f"sub_{uuid4().hex[:8]}",
        tier=SubscriptionTier.PROFESSIONAL,
        status=SubscriptionStatus.ACTIVE,
        current_period_start=datetime.now(timezone.utc),
        current_period_end=datetime.now(timezone.utc),
    )
    db_session.add(subscription)
    db_session.commit()
    db_session.refresh(subscription)
    return subscription


def test_master_admin_can_scope_billing_to_any_tenant(
    client: TestClient,
    db_session,
    create_user,
    create_organization,
    dependency_overrides,
):
    """
    Master admin should be able to read subscription data for any tenant org
    when providing the X-Master-Tenant-Id header.
    """
    master_org = create_organization(name="Master Admin Org", subscription_tier="enterprise")
    master_admin = create_user(
        email="ma@example.com",
        role=UserRole.master_admin,
        organization_id=str(master_org.id),
    )

    tenant_org = create_organization(name="Scoped Tenant", subscription_tier="professional")
    _create_subscription(db_session, str(tenant_org.id))

    dependency_overrides(get_current_user, lambda: master_admin)

    response = client.get(
        "/api/billing/me",
        headers={
            "Authorization": "Bearer master_admin_token",
            "X-Master-Tenant-Id": str(tenant_org.id),
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["organization_id"] == str(tenant_org.id)
    assert payload["tier"] == "professional"


def test_non_master_admin_cannot_use_master_tenant_header(
    client: TestClient,
    create_user,
    create_organization,
    dependency_overrides,
    db_session,
):
    """
    Non-master users should be forbidden from scoping into other tenants even if
    they provide the impersonation header.
    """
    org = create_organization(name="Primary Org", subscription_tier="starter")
    intruder = create_user(
        email="intruder@example.com",
        role=UserRole.admin,
        organization_id=str(org.id),
    )
    other_org = create_organization(name="Victim Org", subscription_tier="enterprise")

    from app.core.permissions import require_permission
    from app.api.dependencies.auth import require_feature

    dependency_overrides(get_current_user, lambda: intruder)

    response = client.get(
        "/api/billing/me",
        headers={
            "Authorization": "Bearer admin_token",
            "X-Master-Tenant-Id": str(other_org.id),
        },
    )

    assert response.status_code == 403
    assert "Master admin access required" in response.json()["detail"]

def test_impersonation_attempt_by_non_master_is_audited(
    client: TestClient,
    create_user,
    create_organization,
    dependency_overrides,
    db_session,
):
    """
    Non-master attempts to impersonate should emit a permission_denied audit record.
    """
    org = create_organization(name="Primary Org", subscription_tier="starter")
    intruder = create_user(
        email="intruder-audit@example.com",
        role=UserRole.admin,
        organization_id=str(org.id),
    )
    other_org = create_organization(name="Blocked Org", subscription_tier="growth")

    dependency_overrides(get_current_user, lambda: intruder)

    response = client.get(
        "/api/billing/me",
        headers={
            "Authorization": "Bearer admin_token",
            "X-Master-Tenant-Id": str(other_org.id),
        },
    )

    assert response.status_code == 403

    logs = (
        db_session.query(RBACAuditLog)
        .filter(
            RBACAuditLog.actor_user_id == intruder.id,
            RBACAuditLog.action == RBACAuditAction.PERMISSION_DENIED.value,
        )
        .all()
    )
    assert len(logs) == 1
    assert "master:impersonate" in (logs[0].detail or "")


def test_master_admin_requires_scope_for_deal_access(
    client: TestClient,
    db_session,
    create_user,
    create_organization,
    dependency_overrides,
):
    """
    Master admins must supply a tenant header to interact with deal endpoints.
    """
    master_org = create_organization(name="Master Org")
    master_admin = create_user(
        email="scope-admin@example.com",
        role=UserRole.master_admin,
        organization_id=str(master_org.id),
    )
    tenant_org = create_organization(name="Deal Org")
    deal_owner = create_user(
        email="owner@example.com",
        role=UserRole.growth,
        organization_id=str(tenant_org.id),
    )

    deal = Deal(
        id=str(uuid4()),
        name="Scoped Deal",
        target_company="Scoped Co",
        organization_id=str(tenant_org.id),
        owner_id=deal_owner.id,
        stage=DealStage.sourcing,
        currency="GBP",
    )
    db_session.add(deal)
    db_session.commit()

    dependency_overrides(get_current_user, lambda: master_admin)

    no_scope = client.get(
        f"/api/deals/{deal.id}",
        headers={"Authorization": "Bearer master_admin_token"},
    )
    assert no_scope.status_code in (400, 404)

    scoped = client.get(
        f"/api/deals/{deal.id}",
        headers={
            "Authorization": "Bearer master_admin_token",
            "X-Master-Tenant-Id": str(tenant_org.id),
        },
    )
    assert scoped.status_code == 200
    assert scoped.json()["id"] == str(deal.id)


def test_impersonation_headers_generate_audit_log(
    client: TestClient,
    db_session,
    create_user,
    create_organization,
    dependency_overrides,
):
    master_org = create_organization(name="Audit Org")
    master_admin = create_user(
        email="audit-admin@example.com",
        role=UserRole.master_admin,
        organization_id=str(master_org.id),
    )
    tenant_org = create_organization(name="Scoped Org", subscription_tier="professional")
    _create_subscription(db_session, str(tenant_org.id))

    dependency_overrides(get_current_user, lambda: master_admin)

    response = client.get(
        "/api/billing/me",
        headers={
            "Authorization": "Bearer audit_token",
            "X-Master-Tenant-Id": str(tenant_org.id),
        },
    )
    assert response.status_code == 200

    logs = (
        db_session.query(RBACAuditLog)
        .filter(
            RBACAuditLog.actor_user_id == master_admin.id,
            RBACAuditLog.action == RBACAuditAction.IMPERSONATION.value,
        )
        .all()
    )
    assert len(logs) == 1
    assert str(tenant_org.id) in logs[0].detail


def test_no_impersonation_headers_produce_no_audit_log(
    client: TestClient,
    db_session,
    create_user,
    create_organization,
    dependency_overrides,
):
    org = create_organization(name="Self Org")
    master_admin = create_user(
        email="self-admin@example.com",
        role=UserRole.master_admin,
        organization_id=str(org.id),
    )
    dependency_overrides(get_current_user, lambda: master_admin)

    response = client.get(
        "/api/billing/me",
        headers={"Authorization": "Bearer self_token"},
    )

    assert response.status_code in (200, 404)

    logs = (
        db_session.query(RBACAuditLog)
        .filter(
            RBACAuditLog.actor_user_id == master_admin.id,
            RBACAuditLog.action == RBACAuditAction.IMPERSONATION.value,
        )
        .all()
    )
    assert logs == []


def test_master_impersonate_permission_dependency_blocks_non_master(
    create_user,
    create_organization,
    db_session,
):
    org = create_organization(name="Tenant Org")
    admin = create_user(email="notmaster@example.com", role=UserRole.admin, organization_id=str(org.id))

    guard = require_permission(Permission.MASTER_IMPERSONATE)
    try:
        guard(current_user=admin, db=db_session)
    except HTTPException as exc:
        assert exc.status_code == 403
        assert Permission.MASTER_IMPERSONATE.value in exc.detail
    else:  # pragma: no cover
        raise AssertionError("Expected HTTPException for non-master user")

