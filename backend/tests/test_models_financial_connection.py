"""
Tests for FinancialConnection model - DEV-010
Testing the database model, relationships, and cascade behavior
"""

import pytest
from datetime import datetime, timezone

from app.models.financial_connection import FinancialConnection
from app.models.deal import Deal
from app.models.organization import Organization


def test_create_financial_connection(db_session):
    """Test creating a financial connection with all required fields."""
    # Arrange
    org = Organization(id="org-fc-123", name="Test Org FC", slug="testfc-org")
    deal = Deal(
        id="deal-fc-123",
        organization_id=org.id,
        name="Test Deal FC",
        target_company="Target Co FC",
        owner_id="user-fc-123"
    )
    db_session.add(org)
    db_session.add(deal)
    db_session.commit()

    # Act
    connection = FinancialConnection(
        deal_id=deal.id,
        organization_id=org.id,
        platform="xero",
        access_token="test_token_123",
        connection_status="active"
    )
    db_session.add(connection)
    db_session.commit()
    db_session.refresh(connection)

    # Assert
    assert connection.id is not None
    assert connection.deal_id == "deal-fc-123"
    assert connection.organization_id == "org-fc-123"
    assert connection.platform == "xero"
    assert connection.access_token == "test_token_123"
    assert connection.connection_status == "active"
    assert connection.created_at is not None
    assert connection.updated_at is not None


def test_financial_connection_with_optional_fields(db_session):
    """Test creating a connection with all optional fields populated."""
    org = Organization(id="org-fc-456", name="Test Org FC 2", slug="testfc-org")
    deal = Deal(
        id="deal-fc-456",
        organization_id=org.id,
        name="Test Deal FC 2",
        target_company="Target Co FC 2",
        owner_id="user-fc-456"
    )
    db_session.add(org)
    db_session.add(deal)
    db_session.commit()

    connection = FinancialConnection(
        deal_id=deal.id,
        organization_id=org.id,
        platform="quickbooks",
        platform_organization_id="qb-org-789",
        platform_organization_name="QB Test Org",
        access_token="access_xyz",
        refresh_token="refresh_xyz",
        token_expires_at=datetime(2025, 12, 31, tzinfo=timezone.utc),
        connection_status="active",
        last_sync_at=datetime(2025, 10, 25, tzinfo=timezone.utc),
        last_sync_status="success"
    )
    db_session.add(connection)
    db_session.commit()
    db_session.refresh(connection)

    assert connection.platform_organization_id == "qb-org-789"
    assert connection.platform_organization_name == "QB Test Org"
    assert connection.refresh_token == "refresh_xyz"
    assert connection.token_expires_at.year == 2025
    assert connection.last_sync_status == "success"


def test_financial_connection_cascade_delete_with_deal(db_session):
    """Test that deleting a deal cascades to delete financial connections."""
    org = Organization(id="org-fc-789", name="Test Org FC 3", slug="testfc-org")
    deal = Deal(
        id="deal-fc-789",
        organization_id=org.id,
        name="Test Deal FC 3",
        target_company="Target Co FC 3",
        owner_id="user-fc-789"
    )
    connection = FinancialConnection(
        deal_id=deal.id,
        organization_id=org.id,
        platform="xero",
        access_token="token_cascade",
        connection_status="active"
    )

    db_session.add(org)
    db_session.add(deal)
    db_session.add(connection)
    db_session.commit()

    connection_id = connection.id

    # Delete the deal
    db_session.delete(deal)
    db_session.commit()

    # Verify connection was deleted via cascade
    deleted_connection = db_session.query(FinancialConnection).filter_by(id=connection_id).first()
    assert deleted_connection is None


def test_financial_connection_relationship_to_deal(db_session):
    """Test the relationship between FinancialConnection and Deal."""
    org = Organization(id="org-fc-rel", name="Test Org FC Rel", slug="testfc-org")
    deal = Deal(
        id="deal-fc-rel",
        organization_id=org.id,
        name="Test Deal FC Rel",
        target_company="Target Co FC Rel",
        owner_id="user-fc-rel"
    )
    connection = FinancialConnection(
        deal_id=deal.id,
        organization_id=org.id,
        platform="xero",
        access_token="token_rel",
        connection_status="active"
    )

    db_session.add(org)
    db_session.add(deal)
    db_session.add(connection)
    db_session.commit()
    db_session.refresh(connection)
    db_session.refresh(deal)

    # Test relationship from connection to deal
    assert connection.deal is not None
    assert connection.deal.id == "deal-fc-rel"
    assert connection.deal.name == "Test Deal FC Rel"

    # Test relationship from deal to connections
    assert len(deal.financial_connections) == 1
    assert deal.financial_connections[0].id == connection.id


def test_financial_connection_soft_delete(db_session):
    """Test soft delete functionality via deleted_at field."""
    org = Organization(id="org-fc-soft", name="Test Org FC Soft", slug="testfc-org")
    deal = Deal(
        id="deal-fc-soft",
        organization_id=org.id,
        name="Test Deal FC Soft",
        target_company="Target Co FC Soft",
        owner_id="user-fc-soft"
    )
    connection = FinancialConnection(
        deal_id=deal.id,
        organization_id=org.id,
        platform="xero",
        access_token="token_soft",
        connection_status="active"
    )

    db_session.add(org)
    db_session.add(deal)
    db_session.add(connection)
    db_session.commit()

    # Soft delete by setting deleted_at
    connection.deleted_at = datetime.now(timezone.utc)
    db_session.commit()
    db_session.refresh(connection)

    assert connection.deleted_at is not None
    # Connection still exists in DB but is marked as deleted
    assert db_session.query(FinancialConnection).filter_by(id=connection.id).first() is not None


def test_financial_connection_status_values(db_session):
    """Test different connection status values."""
    org = Organization(id="org-fc-status", name="Test Org FC Status", slug="testfc-org")
    deal = Deal(
        id="deal-fc-status",
        organization_id=org.id,
        name="Test Deal FC Status",
        target_company="Target Co FC Status",
        owner_id="user-fc-status"
    )

    db_session.add(org)
    db_session.add(deal)
    db_session.commit()

    # Test each status value
    statuses = ["active", "expired", "revoked", "error"]

    for status in statuses:
        connection = FinancialConnection(
            deal_id=deal.id,
            organization_id=org.id,
            platform="xero",
            access_token=f"token_{status}",
            connection_status=status
        )
        db_session.add(connection)
        db_session.commit()
        db_session.refresh(connection)

        assert connection.connection_status == status
        assert connection.id is not None
