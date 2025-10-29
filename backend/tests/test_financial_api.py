"""
Tests for Financial Intelligence API - DEV-010
Testing the /financial API endpoints
"""

import pytest
from unittest.mock import Mock, patch
from datetime import datetime, timedelta, timezone
from decimal import Decimal

from app.main import app
from app.api.dependencies.auth import get_current_user
from app.models.financial_connection import FinancialConnection
from app.models.financial_narrative import FinancialNarrative


def test_calculate_financial_ratios_endpoint(client, test_deal, solo_user):
    """Test POST /deals/{id}/financial/calculate-ratios endpoint"""
    app.dependency_overrides[get_current_user] = lambda: solo_user

    try:
        financial_data = {
            "current_assets": 100000,
            "current_liabilities": 50000,
            "inventory": 20000,
            "cash": 30000,
            "total_assets": 500000,
            "total_debt": 200000,
            "total_equity": 250000,
            "shareholders_equity": 250000,
            "revenue": 500000,
            "cogs": 300000,
            "operating_income": 75000,
            "ebit": 75000,
            "ebitda": 100000,
            "net_income": 50000,
            "interest_expense": 15000,
            "operating_cash_flow": 60000,
        }

        response = client.post(
            f"/api/deals/{test_deal.id}/financial/calculate-ratios",
            json=financial_data,
        )

        assert response.status_code == 200
        data = response.json()

        # Verify response structure
        assert data["deal_id"] == test_deal.id
        assert data["organization_id"] == test_deal.organization_id
        assert "calculated_at" in data
        assert data["data_quality"] == "complete"  # 18 fields provided

        # Verify key ratios calculated correctly
        assert data["current_ratio"] == 2.0  # 100k / 50k
        assert data["quick_ratio"] == 1.6  # (100k - 20k) / 50k
        assert data["cash_ratio"] == 0.6  # 30k / 50k
        assert data["gross_profit_margin"] == 40.0  # (500k - 300k) / 500k * 100
        assert data["net_profit_margin"] == 10.0  # 50k / 500k * 100
        assert data["return_on_equity"] == 20.0  # 50k / 250k * 100
        assert data["debt_to_equity"] == 0.8  # 200k / 250k
    finally:
        app.dependency_overrides.pop(get_current_user, None)


def test_calculate_ratios_requires_authentication(client, test_deal):
    """Test that calculating ratios requires authentication"""
    response = client.post(
        f"/api/deals/{test_deal.id}/financial/calculate-ratios",
        json={"revenue": 100000},
    )

    assert response.status_code == 401  # Unauthorized


def test_calculate_ratios_deal_not_found(client, solo_user):
    """Test 404 when deal doesn't exist"""
    app.dependency_overrides[get_current_user] = lambda: solo_user

    try:
        response = client.post(
            "/api/deals/nonexistent-deal-id/financial/calculate-ratios",
            json={"revenue": 100000},
        )

        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()
    finally:
        app.dependency_overrides.pop(get_current_user, None)


def test_calculate_ratios_with_partial_data(client, test_deal, solo_user):
    """Test that calculation works with partial data"""
    app.dependency_overrides[get_current_user] = lambda: solo_user

    try:
        financial_data = {
            "revenue": 500000,
            "cogs": 300000,
            "net_income": 50000,
        }

        response = client.post(
            f"/api/deals/{test_deal.id}/financial/calculate-ratios",
            json=financial_data,
        )

        assert response.status_code == 200
        data = response.json()

        # With only 3 fields, data quality should be minimal
        assert data["data_quality"] == "minimal"

        # Ratios that can be calculated should have values
        assert data["gross_profit_margin"] == 40.0

        # Ratios that need missing data should be None
        assert data["current_ratio"] is None  # Missing current assets/liabilities
        assert data["return_on_assets"] is None  # Missing total assets
    finally:
        app.dependency_overrides.pop(get_current_user, None)


def test_get_financial_connections_endpoint_returns_empty_list_when_no_connections(client, test_deal, solo_user):
    """Test GET /deals/{id}/financial/connections endpoint returns empty list when no connections exist."""
    app.dependency_overrides[get_current_user] = lambda: solo_user

    try:
        response = client.get(
            f"/api/deals/{test_deal.id}/financial/connections",
        )

        assert response.status_code == 200
        data = response.json()

        assert isinstance(data, list)
        assert len(data) == 0
    finally:
        app.dependency_overrides.pop(get_current_user, None)


def test_get_financial_connections_endpoint_returns_connections(client, test_deal, db_session, solo_user):
    """Test financial connections endpoint returns persisted connections."""
    app.dependency_overrides[get_current_user] = lambda: solo_user

    connection = FinancialConnection(
        id="conn-qbo-1",
        deal_id=test_deal.id,
        organization_id=test_deal.organization_id,
        platform="quickbooks",
        access_token="token",
        refresh_token="refresh",
        token_expires_at=datetime.now(timezone.utc) + timedelta(hours=1),
        platform_organization_name="QuickBooks Demo Co",
        connection_status="active",
    )
    db_session.add(connection)
    db_session.commit()

    try:
        response = client.get(
            f"/api/deals/{test_deal.id}/financial/connections",
        )

        assert response.status_code == 200
        data = response.json()

        assert len(data) == 1
        assert data[0]["platform"] == "quickbooks"
        assert data[0]["platform_organization_name"] == "QuickBooks Demo Co"
    finally:
        app.dependency_overrides.pop(get_current_user, None)


def test_get_financial_ratios_not_found(client, test_deal, solo_user):
    """Test GET /deals/{id}/financial/ratios returns empty list when no ratios exist"""
    app.dependency_overrides[get_current_user] = lambda: solo_user

    try:
        response = client.get(
            f"/api/deals/{test_deal.id}/financial/ratios",
        )

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 0
    finally:
        app.dependency_overrides.pop(get_current_user, None)


def test_get_financial_narrative_not_found(client, test_deal, solo_user):
    """Test GET /deals/{id}/financial/narrative returns 404 when no narrative exists"""
    app.dependency_overrides[get_current_user] = lambda: solo_user

    try:
        response = client.get(
            f"/api/deals/{test_deal.id}/financial/narrative",
        )

        assert response.status_code == 404
        assert "generated" in response.json()["detail"].lower()
    finally:
        app.dependency_overrides.pop(get_current_user, None)


# ============================================================================
# NEW ENDPOINTS - DEV-010 Phase 1.2
# ============================================================================

# Test POST /deals/{deal_id}/financial/connect/xero
def test_connect_xero_initiates_oauth_flow(client, test_deal, solo_user):
    """Test that connecting Xero initiates OAuth flow and returns authorization URL."""
    app.dependency_overrides[get_current_user] = lambda: solo_user

    try:
        with patch('app.api.routes.financial.initiate_xero_oauth') as mock_initiate:
            mock_initiate.return_value = {
                "authorization_url": "https://login.xero.com/identity/connect/authorize?...",
                "state": "random_state_token"
            }

            response = client.post(
                f"/api/deals/{test_deal.id}/financial/connect/xero",
            )

            assert response.status_code == 200
            data = response.json()
            assert "authorization_url" in data
            assert "state" in data
            assert data["authorization_url"].startswith("https://login.xero.com")
    finally:
        app.dependency_overrides.pop(get_current_user, None)


def test_connect_xero_with_invalid_deal(client, solo_user):
    """Test connecting Xero with non-existent deal returns 404."""
    app.dependency_overrides[get_current_user] = lambda: solo_user

    try:
        response = client.post(
            "/api/deals/nonexistent-deal-id/financial/connect/xero",
        )

        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()
    finally:
        app.dependency_overrides.pop(get_current_user, None)


# Test GET /deals/{deal_id}/financial/connect/xero/callback
def test_xero_oauth_callback_success(client, test_deal, solo_user):
    """Test successful Xero OAuth callback creates connection."""
    app.dependency_overrides[get_current_user] = lambda: solo_user

    try:
        with patch('app.api.routes.financial.handle_xero_callback') as mock_callback:
            # Mock connection object with required attributes
            mock_connection = Mock()
            mock_connection.id = "conn-api-1"
            mock_connection.deal_id = test_deal.id
            mock_connection.organization_id = test_deal.organization_id
            mock_connection.platform = "xero"
            mock_connection.connection_status = "active"
            mock_connection.platform_organization_name = "Test Company"
            mock_connection.last_sync_at = None
            mock_connection.created_at = datetime.now()

            mock_callback.return_value = mock_connection

            response = client.get(
                f"/api/deals/{test_deal.id}/financial/connect/xero/callback?code=auth_code_123&state=state_token",
            )

            assert response.status_code == 200
            data = response.json()
            assert data["platform"] == "xero"
            assert data["connection_status"] == "active"
    finally:
        app.dependency_overrides.pop(get_current_user, None)


def test_xero_oauth_callback_missing_code(client, test_deal, solo_user):
    """Test Xero callback without code parameter returns 422 (validation error)."""
    app.dependency_overrides[get_current_user] = lambda: solo_user

    try:
        response = client.get(
            f"/api/deals/{test_deal.id}/financial/connect/xero/callback",
        )

        # FastAPI returns 422 for missing required query parameters (validation error)
        assert response.status_code == 422
    finally:
        app.dependency_overrides.pop(get_current_user, None)


# Test POST /deals/{deal_id}/financial/sync
def test_sync_financial_data_success(client, test_deal, db_session, solo_user):
    """Test manual financial data sync from Xero."""
    app.dependency_overrides[get_current_user] = lambda: solo_user

    try:
        # Create connection
        connection = FinancialConnection(
            id="conn-api-2",
            deal_id=test_deal.id,
            organization_id=test_deal.organization_id,
            platform="xero",
            access_token="token",
            connection_status="active",
            token_expires_at=datetime.now() + timedelta(hours=1)
        )
        db_session.add(connection)
        db_session.commit()

        with patch('app.api.routes.financial.fetch_xero_statements') as mock_fetch:
            mock_statement = Mock()
            mock_statement.id = "stmt-api-1"
            mock_fetch.return_value = [mock_statement]

            response = client.post(
                f"/api/deals/{test_deal.id}/financial/sync",
            )

            assert response.status_code == 200
            data = response.json()
            assert data["success"] is True
            assert data["statements_synced"] == 1
    finally:
        app.dependency_overrides.pop(get_current_user, None)


def test_sync_financial_data_no_connection(client, test_deal, solo_user):
    """Test syncing without connection returns 404."""
    app.dependency_overrides[get_current_user] = lambda: solo_user

    try:
        response = client.post(
            f"/api/deals/{test_deal.id}/financial/sync",
        )

        assert response.status_code == 404
        assert "connection" in response.json()["detail"].lower()
    finally:
        app.dependency_overrides.pop(get_current_user, None)


def test_connect_quickbooks_initiates_oauth_flow(client, test_deal, solo_user):
    """QuickBooks connection initiates OAuth flow."""
    app.dependency_overrides[get_current_user] = lambda: solo_user

    try:
        with patch('app.api.routes.financial.initiate_quickbooks_oauth') as mock_initiate:
            mock_initiate.return_value = {
                "authorization_url": "https://appcenter.intuit.com/connect/oauth2?client_id=real",
                "state": "state-token",
            }

            response = client.post(
                f"/api/deals/{test_deal.id}/financial/connect/quickbooks",
            )

            assert response.status_code == 200
            data = response.json()
            assert data["authorization_url"].startswith("https://appcenter.intuit.com")
            assert data["state"] == "state-token"
    finally:
        app.dependency_overrides.pop(get_current_user, None)


def test_connect_quickbooks_with_invalid_deal(client, solo_user):
    """Connecting QuickBooks with invalid deal returns 404."""
    app.dependency_overrides[get_current_user] = lambda: solo_user

    try:
        response = client.post(
            "/api/deals/invalid-id/financial/connect/quickbooks",
        )

        assert response.status_code == 404
    finally:
        app.dependency_overrides.pop(get_current_user, None)


def test_quickbooks_oauth_callback_success(client, test_deal, solo_user):
    """QuickBooks callback returns FinancialConnection response."""
    app.dependency_overrides[get_current_user] = lambda: solo_user

    mock_connection = Mock()
    mock_connection.id = "conn-qbo-2"
    mock_connection.deal_id = test_deal.id
    mock_connection.organization_id = test_deal.organization_id
    mock_connection.platform = "quickbooks"
    mock_connection.connection_status = "active"
    mock_connection.platform_organization_name = "QuickBooks Demo Co"
    mock_connection.last_sync_at = None
    mock_connection.last_sync_status = None
    mock_connection.created_at = datetime.now(timezone.utc)

    try:
        with patch('app.api.routes.financial.handle_quickbooks_callback') as mock_callback:
            mock_callback.return_value = mock_connection

            response = client.get(
                f"/api/deals/{test_deal.id}/financial/connect/quickbooks/callback",
                params={
                    "code": "auth-code",
                    "state": "state-token",
                    "realm_id": "realm-123",
                },
            )

            assert response.status_code == 200
            data = response.json()
            assert data["platform"] == "quickbooks"
            assert data["connection_status"] == "active"
            assert data["platform_organization_name"] == "QuickBooks Demo Co"
    finally:
        app.dependency_overrides.pop(get_current_user, None)


def test_quickbooks_oauth_callback_missing_params(client, test_deal, solo_user):
    """QuickBooks callback requires code/state/realm_id."""
    app.dependency_overrides[get_current_user] = lambda: solo_user

    try:
        response = client.get(
            f"/api/deals/{test_deal.id}/financial/connect/quickbooks/callback",
        )

        assert response.status_code == 422
    finally:
        app.dependency_overrides.pop(get_current_user, None)


def test_sync_quickbooks_financial_data_success(client, test_deal, db_session, solo_user):
    """Synchronise QuickBooks statements successfully."""
    app.dependency_overrides[get_current_user] = lambda: solo_user

    connection = FinancialConnection(
        id="conn-qbo-sync",
        deal_id=test_deal.id,
        organization_id=test_deal.organization_id,
        platform="quickbooks",
        access_token="token",
        refresh_token="refresh",
        token_expires_at=datetime.now(timezone.utc) + timedelta(hours=1),
        connection_status="active",
    )
    db_session.add(connection)
    db_session.commit()

    try:
        with patch('app.api.routes.financial.fetch_quickbooks_statements') as mock_fetch:
            mock_statement = Mock()
            mock_statement.id = "stmt-qbo-1"
            mock_fetch.return_value = [mock_statement]

            response = client.post(
                f"/api/deals/{test_deal.id}/financial/sync/quickbooks",
            )

            assert response.status_code == 200
            data = response.json()
            assert data["success"] is True
            assert data["statements_synced"] == 1
            assert data["platform"] == "quickbooks"
    finally:
        app.dependency_overrides.pop(get_current_user, None)


def test_sync_quickbooks_financial_data_no_connection(client, test_deal, solo_user):
    """Attempting QuickBooks sync without connection returns 404."""
    app.dependency_overrides[get_current_user] = lambda: solo_user

    try:
        response = client.post(
            f"/api/deals/{test_deal.id}/financial/sync/quickbooks",
        )

        assert response.status_code == 404
        assert "quickbooks" in response.json()["detail"].lower()
    finally:
        app.dependency_overrides.pop(get_current_user, None)


def test_quickbooks_connection_status(client, test_deal, db_session, solo_user):
    """QuickBooks status endpoint returns connection information."""
    app.dependency_overrides[get_current_user] = lambda: solo_user

    connection = FinancialConnection(
        id="conn-qbo-status",
        deal_id=test_deal.id,
        organization_id=test_deal.organization_id,
        platform="quickbooks",
        access_token="token",
        refresh_token="refresh",
        token_expires_at=datetime.now(timezone.utc) + timedelta(hours=1),
        connection_status="active",
        platform_organization_name="QuickBooks Demo Co",
    )
    db_session.add(connection)
    db_session.commit()

    try:
        response = client.get(
            f"/api/deals/{test_deal.id}/financial/connect/quickbooks/status",
        )

        assert response.status_code == 200
        data = response.json()
        assert data["connected"] is True
        assert data["platform"] == "quickbooks"
        assert data["platform_organization_name"] == "QuickBooks Demo Co"
    finally:
        app.dependency_overrides.pop(get_current_user, None)


def test_disconnect_quickbooks_connection(client, test_deal, db_session, solo_user):
    """Disconnect QuickBooks removes connection."""
    app.dependency_overrides[get_current_user] = lambda: solo_user

    connection = FinancialConnection(
        id="conn-qbo-delete",
        deal_id=test_deal.id,
        organization_id=test_deal.organization_id,
        platform="quickbooks",
        access_token="token",
        refresh_token="refresh",
        token_expires_at=datetime.now(timezone.utc) + timedelta(hours=1),
        connection_status="active",
    )
    db_session.add(connection)
    db_session.commit()

    try:
        response = client.delete(
            f"/api/deals/{test_deal.id}/financial/connect/quickbooks",
        )

        assert response.status_code == 200
        assert response.json()["success"] is True

        remaining = db_session.query(FinancialConnection).filter_by(id="conn-qbo-delete").first()
        assert remaining is None
    finally:
        app.dependency_overrides.pop(get_current_user, None)


# Test GET /deals/{deal_id}/financial/readiness-score
def test_get_readiness_score_success(client, test_deal, db_session, solo_user):
    """Test retrieving Deal Readiness Score."""
    app.dependency_overrides[get_current_user] = lambda: solo_user

    try:
        narrative = FinancialNarrative(
            id="narr-api-1",
            deal_id=test_deal.id,
            organization_id=test_deal.organization_id,
            summary="Strong financial health",
            readiness_score=Decimal("82.5"),
            data_quality_score=Decimal("22.0"),
            financial_health_score=Decimal("35.0"),
            growth_trajectory_score=Decimal("18.5"),
            risk_assessment_score=Decimal("7.0"),
            ai_model="gpt-4",
            version=1
        )
        db_session.add(narrative)
        db_session.commit()

        response = client.get(
            f"/api/deals/{test_deal.id}/financial/readiness-score",
        )

        assert response.status_code == 200
        data = response.json()
        assert data["score"] == 82.5
        assert data["data_quality_score"] == 22.0
        assert data["financial_health_score"] == 35.0
        assert data["growth_trajectory_score"] == 18.5
        assert data["risk_assessment_score"] == 7.0
    finally:
        app.dependency_overrides.pop(get_current_user, None)


def test_get_readiness_score_no_narrative(client, test_deal, solo_user):
    """Test getting readiness score when no narrative exists returns 404."""
    app.dependency_overrides[get_current_user] = lambda: solo_user

    try:
        response = client.get(
            f"/api/deals/{test_deal.id}/financial/readiness-score",
        )

        assert response.status_code == 404
        assert "narrative" in response.json()["detail"].lower()
    finally:
        app.dependency_overrides.pop(get_current_user, None)


# ============================================================================
# RATIO PERSISTENCE TESTS (Task 1.1 - TDD RED Phase)
# ============================================================================

def test_calculate_ratios_persists_to_database(client, test_deal, solo_user, db_session):
    """Test that calculate endpoint persists ratios to FinancialRatio table"""
    from app.models.financial_ratio import FinancialRatio

    app.dependency_overrides[get_current_user] = lambda: solo_user

    try:
        financial_data = {
            "current_assets": 100000,
            "current_liabilities": 50000,
            "revenue": 500000,
            "net_income": 50000,
            "period": "2024-Q4",
        }

        response = client.post(
            f"/api/deals/{test_deal.id}/financial/calculate-ratios",
            json=financial_data,
        )

        assert response.status_code == 200

        # Verify ratios were persisted to database
        saved_ratios = db_session.query(FinancialRatio).filter(
            FinancialRatio.deal_id == test_deal.id,
            FinancialRatio.period == "2024-Q4"
        ).all()

        assert len(saved_ratios) > 0, "No ratios persisted to database"

        # Verify key fields are saved
        ratio = saved_ratios[0]
        assert ratio.current_ratio == Decimal("2.0")
        assert ratio.net_profit_margin == Decimal("10.0")
        assert ratio.calculated_at is not None
    finally:
        app.dependency_overrides.pop(get_current_user, None)


def test_get_ratios_returns_latest_calculation(client, test_deal, solo_user, db_session):
    """Test GET /deals/{id}/financial/ratios returns persisted ratios"""
    from app.models.financial_ratio import FinancialRatio

    app.dependency_overrides[get_current_user] = lambda: solo_user

    try:
        # Create test ratio record
        test_ratio = FinancialRatio(
            deal_id=test_deal.id,
            organization_id=test_deal.organization_id,
            period="2024-Q3",
            current_ratio=Decimal("1.5"),
            net_profit_margin=Decimal("12.5"),
            return_on_equity=Decimal("18.0"),
            calculated_at=datetime.now(timezone.utc),
        )
        db_session.add(test_ratio)
        db_session.commit()

        response = client.get(f"/api/deals/{test_deal.id}/financial/ratios")

        assert response.status_code == 200
        data = response.json()

        assert isinstance(data, list)
        assert len(data) >= 1

        latest = data[0]
        assert latest["period"] == "2024-Q3"
        assert float(latest["current_ratio"]) == 1.5
        assert float(latest["net_profit_margin"]) == 12.5
    finally:
        app.dependency_overrides.pop(get_current_user, None)


def test_get_ratios_filters_by_period(client, test_deal, solo_user, db_session):
    """Test GET /ratios with period query param returns filtered results"""
    from app.models.financial_ratio import FinancialRatio

    app.dependency_overrides[get_current_user] = lambda: solo_user

    try:
        # Create ratios for different periods
        for period in ["2024-Q1", "2024-Q2", "2024-Q3"]:
            ratio = FinancialRatio(
                deal_id=test_deal.id,
                organization_id=test_deal.organization_id,
                period=period,
                current_ratio=Decimal("1.0"),
                calculated_at=datetime.now(timezone.utc),
            )
            db_session.add(ratio)
        db_session.commit()

        # Query for specific period
        response = client.get(
            f"/api/deals/{test_deal.id}/financial/ratios",
            params={"period": "2024-Q2"}
        )

        assert response.status_code == 200
        data = response.json()

        assert len(data) == 1
        assert data[0]["period"] == "2024-Q2"
    finally:
        app.dependency_overrides.pop(get_current_user, None)


def test_get_ratios_returns_empty_when_none_exist(client, test_deal, solo_user):
    """Test GET /ratios returns empty list when no calculations exist"""
    app.dependency_overrides[get_current_user] = lambda: solo_user

    try:
        response = client.get(f"/api/deals/{test_deal.id}/financial/ratios")

        assert response.status_code == 200
        data = response.json()

        assert isinstance(data, list)
        assert len(data) == 0
    finally:
        app.dependency_overrides.pop(get_current_user, None)


def test_get_ratios_limits_results(client, test_deal, solo_user, db_session):
    """Test GET /ratios respects limit query parameter"""
    from app.models.financial_ratio import FinancialRatio

    app.dependency_overrides[get_current_user] = lambda: solo_user

    try:
        # Create 5 ratio records
        for i in range(5):
            ratio = FinancialRatio(
                deal_id=test_deal.id,
                organization_id=test_deal.organization_id,
                period=f"2024-Q{i+1}",
                current_ratio=Decimal("1.0"),
                calculated_at=datetime.now(timezone.utc) - timedelta(days=i),
            )
            db_session.add(ratio)
        db_session.commit()

        # Request with limit
        response = client.get(
            f"/api/deals/{test_deal.id}/financial/ratios",
            params={"limit": 2}
        )

        assert response.status_code == 200
        data = response.json()

        assert len(data) == 2
    finally:
        app.dependency_overrides.pop(get_current_user, None)
