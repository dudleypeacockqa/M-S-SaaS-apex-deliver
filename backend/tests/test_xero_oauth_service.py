"""
Tests for Xero OAuth Integration Service - DEV-010 (Phase 3)
Following TDD methodology (RED → GREEN → REFACTOR)
Tests OAuth 2.0 flow, token management, and data import from Xero

Phase 3 Update: RealXeroClient implemented, tests now using MockXeroClient fallback.
These tests validate the service layer logic with mocked Xero API responses.
"""

import pytest

# Tests now active - using MockXeroClient until xero-python SDK is installed
from unittest.mock import Mock, patch, MagicMock
from datetime import datetime, timezone, timedelta
from decimal import Decimal

from app.services.xero_oauth_service import (
    initiate_xero_oauth,
    handle_xero_callback,
    refresh_xero_token,
    fetch_xero_statements,
    disconnect_xero,
    get_xero_connection_status,
)
from app.models.financial_connection import FinancialConnection
from app.models.deal import Deal
from app.models.organization import Organization
from app.models.user import User


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def _create_org_user_deal(db_session, create_user, create_organization, org_name="Test Org", deal_id=None, user_id=None):
    """Helper to create org, user, and deal with valid foreign keys."""
    org = create_organization(name=org_name, subscription_tier="professional")
    user = create_user(organization_id=org.id, role="solo", email=f"{org_name.lower().replace(' ', '_')}@example.com")
    deal = Deal(
        id=deal_id or f"deal-{org.id}",
        organization_id=org.id,
        name=f"Deal for {org_name}",
        target_company="Target Company",
        owner_id=user.id
    )
    db_session.add(deal)
    db_session.commit()
    return org, user, deal


# ============================================================================
# OAUTH FLOW TESTS
# ============================================================================

def test_initiate_xero_oauth_generates_authorization_url(db_session, create_user, create_organization):
    """Test that initiating OAuth returns Xero authorization URL."""
    # Arrange - Create proper org, user, and deal with valid foreign keys
    org = create_organization(name="Test Org", subscription_tier="professional")
    user = create_user(organization_id=org.id, role="solo", email="test@example.com")
    deal = Deal(id="deal-1", organization_id=org.id, name="Test Deal",
                target_company="Target", owner_id=user.id)
    db_session.add(deal)
    db_session.commit()

    # Act
    result = initiate_xero_oauth(deal.id, db_session)

    # Assert
    assert "authorization_url" in result
    assert "state" in result
    assert "https://login.xero.com/identity/connect/authorize" in result["authorization_url"]
    assert "client_id" in result["authorization_url"]
    assert "redirect_uri" in result["authorization_url"]
    assert "scope" in result["authorization_url"]
    assert result["state"] is not None
    assert len(result["state"]) > 10  # State should be random string


def test_initiate_xero_oauth_with_invalid_deal(db_session):
    """Test that initiating OAuth with invalid deal raises error."""
    with pytest.raises(ValueError, match="Deal .* not found"):
        initiate_xero_oauth("invalid-deal-id", db_session)


@patch("app.services.xero_oauth_service.xero_client")
def test_handle_xero_callback_success(mock_xero_client, db_session, create_user, create_organization):
    """Test successful OAuth callback creates connection with tokens."""
    # Arrange - Create proper org, user, and deal with valid foreign keys
    org = create_organization(name="Org 2", subscription_tier="professional")
    user = create_user(organization_id=org.id, role="solo", email="test2@example.com")
    deal = Deal(id="deal-2", organization_id=org.id, name="Deal 2",
                target_company="Target 2", owner_id=user.id)
    db_session.add(deal)
    db_session.commit()

    # Mock Xero token exchange
    mock_token = {
        "access_token": "xero_access_token_123",
        "refresh_token": "xero_refresh_token_456",
        "expires_in": 1800,  # 30 minutes
        "token_type": "Bearer",
    }
    mock_xero_client.exchange_code_for_token.return_value = mock_token

    # Mock Xero connections API (tenant selection)
    mock_connections = [
        {"tenantId": "tenant-abc-123", "tenantName": "Test Company Ltd"}
    ]
    mock_xero_client.get_connections.return_value = mock_connections

    # Act
    connection = handle_xero_callback(
        deal_id=deal.id,
        code="oauth_code_xyz",
        state="state_token",
        db=db_session
    )

    # Assert
    assert connection is not None
    assert connection.deal_id == deal.id
    assert connection.organization_id == org.id
    assert connection.platform == "xero"
    assert connection.access_token == "xero_access_token_123"
    assert connection.refresh_token == "xero_refresh_token_456"
    assert connection.platform_organization_id == "tenant-abc-123"
    assert connection.platform_organization_name == "Test Company Ltd"
    assert connection.connection_status == "active"
    assert connection.token_expires_at is not None


@patch("app.services.xero_oauth_service.xero_client")
def test_handle_xero_callback_token_exchange_failure(mock_xero_client, db_session, create_user, create_organization):
    """Test OAuth callback when Xero token exchange fails."""
    org, user, deal = _create_org_user_deal(db_session, create_user, create_organization, "Org 3", "deal-3")

    # Mock Xero API error
    mock_xero_client.exchange_code_for_token.side_effect = Exception("Invalid authorization code")

    # Act & Assert
    with pytest.raises(Exception, match="Invalid authorization code"):
        handle_xero_callback(
            deal_id=deal.id,
            code="invalid_code",
            state="state_token",
            db=db_session
        )


# ============================================================================
# TOKEN REFRESH TESTS
# ============================================================================

@patch("app.services.xero_oauth_service.xero_client")
def test_refresh_xero_token_success(mock_xero_client, db_session, create_user, create_organization):
    """Test successful token refresh updates connection."""
    # Arrange
    org, user, deal = _create_org_user_deal(db_session, create_user, create_organization, "Org 4", "deal-4")

    # Create existing connection with expired token
    connection = FinancialConnection(
        id="conn-1",
        deal_id=deal.id,
        organization_id=org.id,
        platform="xero",
        access_token="old_access_token",
        refresh_token="old_refresh_token",
        platform_organization_id="tenant-123",
        connection_status="active",
        token_expires_at=datetime.now(timezone.utc) - timedelta(hours=1)  # Expired
    )

    db_session.add(connection)
    db_session.commit()

    # Mock Xero refresh token response
    mock_new_tokens = {
        "access_token": "new_access_token_789",
        "refresh_token": "new_refresh_token_101",
        "expires_in": 1800,
    }
    mock_xero_client.refresh_access_token.return_value = mock_new_tokens

    # Act
    refreshed = refresh_xero_token(connection.id, db_session)

    # Assert
    assert refreshed.access_token == "new_access_token_789"
    assert refreshed.refresh_token == "new_refresh_token_101"
    # SQLite strips timezone info from datetimes, so compare with naive datetime
    assert refreshed.token_expires_at > datetime.now()
    assert refreshed.last_sync_at is not None


@patch("app.services.xero_oauth_service.xero_client")
def test_refresh_xero_token_when_refresh_fails(mock_xero_client, db_session, create_user, create_organization):
    """Test token refresh failure marks connection as expired."""
    org, user, deal = _create_org_user_deal(db_session, create_user, create_organization, "Org 5", "deal-5")

    connection = FinancialConnection(
        id="conn-2",
        deal_id=deal.id,
        organization_id=org.id,
        platform="xero",
        access_token="token",
        refresh_token="refresh",
        platform_organization_id="tenant",
        connection_status="active"
    )

    db_session.add(connection)
    db_session.commit()

    # Mock refresh failure (revoked token)
    mock_xero_client.refresh_access_token.side_effect = Exception("Invalid grant")

    # Act & Assert
    with pytest.raises(Exception, match="Invalid grant"):
        refresh_xero_token(connection.id, db_session)

    # Verify connection status updated
    db_session.refresh(connection)
    assert connection.connection_status == "expired"


# ============================================================================
# DATA IMPORT TESTS
# ============================================================================

@patch("app.services.xero_oauth_service.xero_client")
def test_fetch_xero_statements_imports_balance_sheet(mock_xero_client, db_session, create_user, create_organization):
    """Test fetching statements from Xero imports balance sheet data."""
    org, user, deal = _create_org_user_deal(db_session, create_user, create_organization, "Org 6", "deal-6")

    connection = FinancialConnection(
        id="conn-3",
        deal_id=deal.id,
        organization_id=org.id,
        platform="xero",
        access_token="valid_token",
        refresh_token="refresh",
        platform_organization_id="tenant-456",
        connection_status="active",
        token_expires_at=datetime.now(timezone.utc) + timedelta(hours=1)
    )

    db_session.add(connection)
    db_session.commit()

    # Mock Xero API balance sheet response
    mock_balance_sheet = {
        "Reports": [{
            "ReportID": "BalanceSheet",
            "ReportName": "Balance Sheet",
            "ReportDate": "2024-12-31",
            "Rows": [
                {
                    "RowType": "Section",
                    "Title": "Assets",
                    "Rows": [
                        {"Cells": [{"Value": "Current Assets"}, {"Value": "500000.00"}]},
                        {"Cells": [{"Value": "Total Assets"}, {"Value": "1000000.00"}]},
                    ]
                },
                {
                    "RowType": "Section",
                    "Title": "Liabilities",
                    "Rows": [
                        {"Cells": [{"Value": "Current Liabilities"}, {"Value": "200000.00"}]},
                        {"Cells": [{"Value": "Total Liabilities"}, {"Value": "400000.00"}]},
                    ]
                },
                {
                    "RowType": "Section",
                    "Title": "Equity",
                    "Rows": [
                        {"Cells": [{"Value": "Total Equity"}, {"Value": "600000.00"}]},
                    ]
                }
            ]
        }]
    }
    mock_xero_client.get_report.return_value = mock_balance_sheet

    # Act
    statements = fetch_xero_statements(connection.id, db_session)

    # Assert
    assert statements is not None
    assert len(statements) >= 1

    balance_sheet = statements[0]
    assert balance_sheet.connection_id == connection.id
    assert balance_sheet.deal_id == deal.id
    assert balance_sheet.statement_type == "balance_sheet"
    assert balance_sheet.total_assets == Decimal("1000000.00")
    assert balance_sheet.total_liabilities == Decimal("400000.00")
    assert balance_sheet.total_equity == Decimal("600000.00")
    assert balance_sheet.current_assets == Decimal("500000.00")
    assert balance_sheet.current_liabilities == Decimal("200000.00")


@patch("app.services.xero_oauth_service.xero_client")
def test_fetch_xero_statements_with_expired_token(mock_xero_client, db_session, create_user, create_organization):
    """Test fetching statements auto-refreshes expired token."""
    org, user, deal = _create_org_user_deal(db_session, create_user, create_organization, "Org 7", "deal-7")

    connection = FinancialConnection(
        id="conn-4",
        deal_id=deal.id,
        organization_id=org.id,
        platform="xero",
        access_token="expired_token",
        refresh_token="refresh",
        platform_organization_id="tenant",
        connection_status="active",
        token_expires_at=datetime.now(timezone.utc) - timedelta(hours=1)  # Expired
    )

    db_session.add(connection)
    db_session.commit()

    # Mock token refresh
    mock_new_tokens = {
        "access_token": "refreshed_token",
        "refresh_token": "new_refresh",
        "expires_in": 1800,
    }
    mock_xero_client.refresh_access_token.return_value = mock_new_tokens

    # Mock successful API call after refresh
    mock_xero_client.get_report.return_value = {"Reports": [{"Rows": []}]}

    # Act
    statements = fetch_xero_statements(connection.id, db_session)

    # Assert
    mock_xero_client.refresh_access_token.assert_called_once()
    db_session.refresh(connection)
    assert connection.access_token == "refreshed_token"


# ============================================================================
# CONNECTION MANAGEMENT TESTS
# ============================================================================

def test_disconnect_xero_removes_connection(db_session, create_user, create_organization):
    """Test disconnecting Xero deletes connection record."""
    org, user, deal = _create_org_user_deal(db_session, create_user, create_organization, "Org 8", "deal-8")

    connection = FinancialConnection(
        id="conn-5",
        deal_id=deal.id,
        organization_id=org.id,
        platform="xero",
        access_token="token",
        refresh_token="refresh",
        platform_organization_id="tenant",
        connection_status="active"
    )

    db_session.add(connection)
    db_session.commit()

    # Act
    disconnect_xero(deal.id, db_session)

    # Assert
    from sqlalchemy import select
    result = db_session.execute(
        select(FinancialConnection).where(FinancialConnection.id == "conn-5")
    )
    assert result.scalar_one_or_none() is None


def test_get_xero_connection_status_active(db_session, create_user, create_organization):
    """Test getting connection status for active Xero connection."""
    org, user, deal = _create_org_user_deal(db_session, create_user, create_organization, "Org 9", "deal-9")

    connection = FinancialConnection(
        id="conn-6",
        deal_id=deal.id,
        organization_id=org.id,
        platform="xero",
        access_token="token",
        refresh_token="refresh",
        platform_organization_id="tenant-789",
        platform_organization_name="Company ABC",
        connection_status="active",
        last_sync_at=datetime.now(timezone.utc) - timedelta(hours=2)
    )

    db_session.add(connection)
    db_session.commit()

    # Act
    status = get_xero_connection_status(deal.id, db_session)

    # Assert
    assert status["connected"] is True
    assert status["platform"] == "xero"
    assert status["platform_organization_name"] == "Company ABC"
    assert status["status"] == "active"
    assert "last_sync" in status


def test_get_xero_connection_status_not_connected(db_session, create_user, create_organization):
    """Test getting connection status when no Xero connection exists."""
    org, user, deal = _create_org_user_deal(db_session, create_user, create_organization, "Org 10", "deal-10")

    # Act
    status = get_xero_connection_status(deal.id, db_session)

    # Assert
    assert status["connected"] is False
    assert status["platform"] is None
