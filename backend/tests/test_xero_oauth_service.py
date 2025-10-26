"""
Tests for Xero OAuth Integration Service - DEV-010
Following TDD methodology (RED → GREEN → REFACTOR)
Tests OAuth 2.0 flow, token management, and data import from Xero
"""

import pytest
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


# ============================================================================
# OAUTH FLOW TESTS
# ============================================================================

def test_initiate_xero_oauth_generates_authorization_url(db_session):
    """Test that initiating OAuth returns Xero authorization URL."""
    # Arrange
    org = Organization(id="org-1", name="Test Org", slug="test-org")
    deal = Deal(id="deal-1", organization_id=org.id, name="Test Deal",
                target_company="Target", owner_id="user-1")
    db_session.add(org)
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
def test_handle_xero_callback_success(mock_xero_client, db_session):
    """Test successful OAuth callback creates connection with tokens."""
    # Arrange
    org = Organization(id="org-2", name="Org 2", slug="org-2")
    deal = Deal(id="deal-2", organization_id=org.id, name="Deal 2",
                target_company="Target 2", owner_id="user-2")
    db_session.add(org)
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
def test_handle_xero_callback_token_exchange_failure(mock_xero_client, db_session):
    """Test OAuth callback when Xero token exchange fails."""
    org = Organization(id="org-3", name="Org 3", slug="org-3")
    deal = Deal(id="deal-3", organization_id=org.id, name="Deal 3",
                target_company="Target 3", owner_id="user-3")
    db_session.add(org)
    db_session.add(deal)
    db_session.commit()

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
def test_refresh_xero_token_success(mock_xero_client, db_session):
    """Test successful token refresh updates connection."""
    # Arrange
    org = Organization(id="org-4", name="Org 4", slug="org-4")
    deal = Deal(id="deal-4", organization_id=org.id, name="Deal 4",
                target_company="Target 4", owner_id="user-4")

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

    db_session.add(org)
    db_session.add(deal)
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
    assert refreshed.token_expires_at > datetime.now(timezone.utc)
    assert refreshed.last_sync_at is not None


@patch("app.services.xero_oauth_service.xero_client")
def test_refresh_xero_token_when_refresh_fails(mock_xero_client, db_session):
    """Test token refresh failure marks connection as expired."""
    org = Organization(id="org-5", name="Org 5", slug="org-5")
    deal = Deal(id="deal-5", organization_id=org.id, name="Deal 5",
                target_company="Target 5", owner_id="user-5")

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

    db_session.add(org)
    db_session.add(deal)
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
def test_fetch_xero_statements_imports_balance_sheet(mock_xero_client, db_session):
    """Test fetching statements from Xero imports balance sheet data."""
    org = Organization(id="org-6", name="Org 6", slug="org-6")
    deal = Deal(id="deal-6", organization_id=org.id, name="Deal 6",
                target_company="Target 6", owner_id="user-6")

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

    db_session.add(org)
    db_session.add(deal)
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
def test_fetch_xero_statements_with_expired_token(mock_xero_client, db_session):
    """Test fetching statements auto-refreshes expired token."""
    org = Organization(id="org-7", name="Org 7", slug="org-7")
    deal = Deal(id="deal-7", organization_id=org.id, name="Deal 7",
                target_company="Target 7", owner_id="user-7")

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

    db_session.add(org)
    db_session.add(deal)
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

def test_disconnect_xero_removes_connection(db_session):
    """Test disconnecting Xero deletes connection record."""
    org = Organization(id="org-8", name="Org 8", slug="org-8")
    deal = Deal(id="deal-8", organization_id=org.id, name="Deal 8",
                target_company="Target 8", owner_id="user-8")

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

    db_session.add(org)
    db_session.add(deal)
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


def test_get_xero_connection_status_active(db_session):
    """Test getting connection status for active Xero connection."""
    org = Organization(id="org-9", name="Org 9", slug="org-9")
    deal = Deal(id="deal-9", organization_id=org.id, name="Deal 9",
                target_company="Target 9", owner_id="user-9")

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

    db_session.add(org)
    db_session.add(deal)
    db_session.add(connection)
    db_session.commit()

    # Act
    status = get_xero_connection_status(deal.id, db_session)

    # Assert
    assert status["connected"] is True
    assert status["platform"] == "xero"
    assert status["tenant_name"] == "Company ABC"
    assert status["status"] == "active"
    assert "last_sync" in status


def test_get_xero_connection_status_not_connected(db_session):
    """Test getting connection status when no Xero connection exists."""
    org = Organization(id="org-10", name="Org 10", slug="org-10")
    deal = Deal(id="deal-10", organization_id=org.id, name="Deal 10",
                target_company="Target 10", owner_id="user-10")

    db_session.add(org)
    db_session.add(deal)
    db_session.commit()

    # Act
    status = get_xero_connection_status(deal.id, db_session)

    # Assert
    assert status["connected"] is False
    assert status["platform"] is None
