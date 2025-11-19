"""
Tests for master admin cross-tenant access scope.

Validates that master admins can impersonate tenant organizations via headers
while non-master users are rejected. These tests drive the implementation of
the tenant scope dependency used by the master admin portal.
"""
from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from fastapi.testclient import TestClient

from app.api.dependencies.auth import get_current_user
from app.models.deal import Deal, DealStage
from app.models.subscription import Subscription, SubscriptionStatus, SubscriptionTier
from app.models.user import UserRole


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

