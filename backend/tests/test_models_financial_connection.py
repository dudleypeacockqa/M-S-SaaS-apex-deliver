"""
Tests for FinancialConnection model - DEV-010
Following TDD RED phase: Write failing tests first
"""

import pytest
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.financial_connection import FinancialConnection
from app.models.deal import Deal
from app.models.organization import Organization


@pytest.mark.asyncio
async def test_create_financial_connection(db_session: AsyncSession):
    """Test creating a financial connection with all required fields."""
    # Arrange
    org = Organization(id="org-123", name="Test Org", email="test@test.com")
    deal = Deal(
        id="deal-123",
        organization_id=org.id,
        name="Test Deal",
        target_company="Target Co",
        owner_id="user-123"
    )
    db_session.add(org)
    db_session.add(deal)
    await db_session.commit()

    # Act
    connection = FinancialConnection(
        deal_id=deal.id,
        organization_id=org.id,
        platform="xero",
        access_token="test_token_123",
        connection_status="active"
    )
    db_session.add(connection)
    await db_session.commit()
    await db_session.refresh(connection)

    # Assert
    assert connection.id is not None
    assert connection.deal_id == "deal-123"
    assert connection.organization_id == "org-123"
    assert connection.platform == "xero"
    assert connection.access_token == "test_token_123"
    assert connection.connection_status == "active"
    assert connection.created_at is not None
    assert connection.updated_at is not None


@pytest.mark.asyncio
async def test_financial_connection_with_optional_fields(db_session: AsyncSession):
    """Test creating a connection with all optional fields populated."""
    org = Organization(id="org-456", name="Test Org 2", email="test2@test.com")
    deal = Deal(
        id="deal-456",
        organization_id=org.id,
        name="Test Deal 2",
        target_company="Target Co 2",
        owner_id="user-456"
    )
    db_session.add(org)
    db_session.add(deal)
    await db_session.commit()

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
    await db_session.commit()
    await db_session.refresh(connection)

    assert connection.platform_organization_id == "qb-org-789"
    assert connection.platform_organization_name == "QB Test Org"
    assert connection.refresh_token == "refresh_xyz"
    assert connection.token_expires_at.year == 2025
    assert connection.last_sync_status == "success"


@pytest.mark.asyncio
async def test_financial_connection_cascade_delete_with_deal(db_session: AsyncSession):
    """Test that deleting a deal cascades to delete financial connections."""
    org = Organization(id="org-789", name="Test Org 3", email="test3@test.com")
    deal = Deal(
        id="deal-789",
        organization_id=org.id,
        name="Test Deal 3",
        target_company="Target Co 3",
        owner_id="user-789"
    )
    db_session.add(org)
    db_session.add(deal)
    await db_session.commit()

    connection = FinancialConnection(
        deal_id=deal.id,
        organization_id=org.id,
        platform="xero",
        access_token="token_to_delete",
        connection_status="active"
    )
    db_session.add(connection)
    await db_session.commit()

    connection_id = connection.id

    # Delete the deal
    await db_session.delete(deal)
    await db_session.commit()

    # Verify connection was cascade deleted
    from sqlalchemy import select
    result = await db_session.execute(
        select(FinancialConnection).where(FinancialConnection.id == connection_id)
    )
    deleted_connection = result.scalar_one_or_none()
    assert deleted_connection is None


@pytest.mark.asyncio
async def test_financial_connection_relationship_to_deal(db_session: AsyncSession):
    """Test that financial connection has proper relationship to deal."""
    org = Organization(id="org-rel-1", name="Rel Test Org", email="rel@test.com")
    deal = Deal(
        id="deal-rel-1",
        organization_id=org.id,
        name="Relationship Deal",
        target_company="Rel Target",
        owner_id="user-rel-1"
    )
    db_session.add(org)
    db_session.add(deal)
    await db_session.commit()

    connection = FinancialConnection(
        deal_id=deal.id,
        organization_id=org.id,
        platform="xero",
        access_token="rel_token",
        connection_status="active"
    )
    db_session.add(connection)
    await db_session.commit()
    await db_session.refresh(connection)

    # Test relationship
    from sqlalchemy import select
    from sqlalchemy.orm import selectinload
    result = await db_session.execute(
        select(FinancialConnection)
        .where(FinancialConnection.id == connection.id)
        .options(selectinload(FinancialConnection.deal))
    )
    loaded_connection = result.scalar_one()

    assert loaded_connection.deal is not None
    assert loaded_connection.deal.id == "deal-rel-1"
    assert loaded_connection.deal.name == "Relationship Deal"


@pytest.mark.asyncio
async def test_financial_connection_soft_delete(db_session: AsyncSession):
    """Test soft delete functionality with deleted_at timestamp."""
    org = Organization(id="org-soft", name="Soft Del Org", email="soft@test.com")
    deal = Deal(
        id="deal-soft",
        organization_id=org.id,
        name="Soft Del Deal",
        target_company="Soft Target",
        owner_id="user-soft"
    )
    db_session.add(org)
    db_session.add(deal)
    await db_session.commit()

    connection = FinancialConnection(
        deal_id=deal.id,
        organization_id=org.id,
        platform="xero",
        access_token="soft_token",
        connection_status="active"
    )
    db_session.add(connection)
    await db_session.commit()
    await db_session.refresh(connection)

    assert connection.deleted_at is None

    # Soft delete
    connection.deleted_at = datetime.now(timezone.utc)
    await db_session.commit()
    await db_session.refresh(connection)

    assert connection.deleted_at is not None
    assert isinstance(connection.deleted_at, datetime)


@pytest.mark.asyncio
async def test_financial_connection_status_values(db_session: AsyncSession):
    """Test different connection status values."""
    org = Organization(id="org-status", name="Status Org", email="status@test.com")
    deal = Deal(
        id="deal-status",
        organization_id=org.id,
        name="Status Deal",
        target_company="Status Target",
        owner_id="user-status"
    )
    db_session.add(org)
    db_session.add(deal)
    await db_session.commit()

    statuses = ["active", "expired", "revoked", "error"]

    for idx, status in enumerate(statuses):
        connection = FinancialConnection(
            id=f"conn-{idx}",
            deal_id=deal.id,
            organization_id=org.id,
            platform="xero",
            access_token=f"token_{idx}",
            connection_status=status
        )
        db_session.add(connection)

    await db_session.commit()

    # Verify all statuses were saved
    from sqlalchemy import select
    result = await db_session.execute(
        select(FinancialConnection).where(FinancialConnection.deal_id == "deal-status")
    )
    connections = result.scalars().all()

    assert len(connections) == 4
    saved_statuses = [c.connection_status for c in connections]
    assert set(saved_statuses) == set(statuses)
