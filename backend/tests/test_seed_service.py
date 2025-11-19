"""Tests for tenant seeding helpers."""
from __future__ import annotations

from sqlalchemy.orm import Session

from app.models.user import UserRole
from app.services.seed_service import TenantSeedConfig, ensure_tenant_admin


def test_ensure_tenant_admin_creates_org_and_user(db_session: Session):
    config = TenantSeedConfig(
        organization_id="org-dge",
        organization_name="Digital Growth Equity",
        organization_slug="digital-growth-equity",
        subscription_tier="professional",
        admin_clerk_user_id="clerk-dge-admin",
        admin_email="dge.admin@example.com",
        admin_first_name="Digital",
        admin_last_name="Admin",
        admin_role=UserRole.admin,
    )

    organization, user = ensure_tenant_admin(db_session, config)

    assert organization.id == config.organization_id
    assert organization.name == config.organization_name
    assert organization.subscription_tier == config.subscription_tier
    assert user.email == config.admin_email
    assert user.role == UserRole.admin
    assert user.organization_id == config.organization_id


def test_ensure_tenant_admin_is_idempotent(db_session: Session):
    initial = TenantSeedConfig(
        organization_id="org-dge",
        organization_name="Digital Growth Equity",
        organization_slug="digital-growth-equity",
        subscription_tier="professional",
        admin_clerk_user_id="clerk-dge-admin",
        admin_email="dge.admin@example.com",
        admin_first_name="Digital",
        admin_last_name="Admin",
    )
    ensure_tenant_admin(db_session, initial)

    # Run again with updated fields to ensure updates propagate
    updated = TenantSeedConfig(
        organization_id="org-dge",
        organization_name="Digital Growth Equity Holdings",
        organization_slug="digital-growth-equity",
        subscription_tier="enterprise",
        admin_clerk_user_id="clerk-dge-admin",
        admin_email="dge.updated@example.com",
        admin_first_name="Dudley",
        admin_last_name="Peacock",
        admin_role=UserRole.admin,
    )
    organization, user = ensure_tenant_admin(db_session, updated)

    assert organization.name == "Digital Growth Equity Holdings"
    assert organization.subscription_tier == "enterprise"
    assert user.email == "dge.updated@example.com"
    assert user.first_name == "Dudley"
    assert user.last_name == "Peacock"
    assert user.organization_id == updated.organization_id
