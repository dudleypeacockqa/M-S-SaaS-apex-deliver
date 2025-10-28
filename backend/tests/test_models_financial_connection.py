"""
Tests for FinancialConnection model - DEV-010
Testing the database model, relationships, and cascade behavior
"""

import pytest
from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.models.financial_connection import FinancialConnection
from app.models.organization import Organization
from app.models.deal import Deal
from app.models.user import User


def _seed_org_user_deal(
    session: Session,
    *,
    org_id: str,
    deal_id: str,
    owner_id: str,
) -> tuple[Organization, User, Deal]:
    organization = Organization(id=org_id, name=f"Org {org_id}", slug=org_id)
    user = User(
        id=owner_id,
        clerk_user_id=f"{owner_id}-clerk",
        email=f"{owner_id}@example.com",
        first_name="Test",
        last_name="User",
        role="solo",
        organization_id=organization.id,
        is_active=True,
    )
    deal = Deal(
        id=deal_id,
        organization_id=organization.id,
        name=f"Deal {deal_id}",
        target_company="Target",
        owner_id=user.id,
    )
    session.add_all([organization, user, deal])
    session.commit()
    return organization, user, deal


def test_create_financial_connection(db_session: Session):
    organization, user, deal = _seed_org_user_deal(
        db_session,
        org_id="org-fc-1",
        deal_id="deal-fc-1",
        owner_id="user-fc-123",
    )

    connection = FinancialConnection(
        organization_id=organization.id,
        deal_id=deal.id,
        platform="xero",
        access_token="token",
        connection_status="active",
    )
    db_session.add(connection)
    db_session.commit()
    db_session.refresh(connection)

    assert connection.platform == "xero"
    assert connection.deal_id == deal.id


def test_financial_connection_with_optional_fields(db_session: Session):
    organization, user, deal = _seed_org_user_deal(
        db_session,
        org_id="org-fc-2",
        deal_id="deal-fc-2",
        owner_id="user-fc-456",
    )

    connection = FinancialConnection(
        organization_id=organization.id,
        deal_id=deal.id,
        platform="quickbooks",
        access_token="token",
        connection_status="active",
        platform_organization_id="tenant_123",
        platform_organization_name="Tenant Name",
        last_sync_at=datetime.now(timezone.utc),
    )
    db_session.add(connection)
    db_session.commit()
    db_session.refresh(connection)

    assert connection.platform_organization_id == "tenant_123"
    assert connection.platform_organization_name == "Tenant Name"


def test_financial_connection_cascade_delete_with_deal(db_session: Session):
    organization, user, deal = _seed_org_user_deal(
        db_session,
        org_id="org-fc-3",
        deal_id="deal-fc-3",
        owner_id="user-fc-789",
    )

    connection = FinancialConnection(
        organization_id=organization.id,
        deal_id=deal.id,
        platform="sage",
        access_token="token",
        connection_status="active",
    )
    db_session.add(connection)
    db_session.commit()

    db_session.delete(deal)
    db_session.commit()

    assert db_session.get(FinancialConnection, connection.id) is None


def test_financial_connection_relationship_to_deal(db_session: Session):
    organization, user, deal = _seed_org_user_deal(
        db_session,
        org_id="org-fc-4",
        deal_id="deal-fc-4",
        owner_id="user-fc-rel",
    )

    connection = FinancialConnection(
        organization_id=organization.id,
        deal_id=deal.id,
        platform="netsuite",
        access_token="token",
        connection_status="active",
    )
    db_session.add(connection)
    db_session.commit()
    db_session.refresh(connection)

    assert connection.deal == deal
    assert connection.organization == organization


def test_financial_connection_soft_delete(db_session: Session):
    organization, user, deal = _seed_org_user_deal(
        db_session,
        org_id="org-fc-5",
        deal_id="deal-fc-5",
        owner_id="user-fc-soft",
    )

    connection = FinancialConnection(
        organization_id=organization.id,
        deal_id=deal.id,
        platform="sage",
        access_token="token",
        connection_status="active",
    )
    db_session.add(connection)
    db_session.commit()

    connection.soft_delete()
    db_session.commit()

    assert connection.deleted_at is not None


def test_financial_connection_status_values(db_session: Session):
    organization, user, deal = _seed_org_user_deal(
        db_session,
        org_id="org-fc-6",
        deal_id="deal-fc-6",
        owner_id="user-fc-status",
    )

    connection = FinancialConnection(
        organization_id=organization.id,
        deal_id=deal.id,
        platform="xero",
        access_token="token",
        connection_status="pending",
    )
    db_session.add(connection)
    db_session.commit()
    db_session.refresh(connection)

    assert connection.connection_status == "pending"
