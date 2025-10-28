"""
Tests for Financial Intelligence API - DEV-010
Testing the /financial API endpoints
"""

import pytest
from unittest.mock import Mock, patch
from datetime import datetime, timedelta
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


def test_get_financial_connections_endpoint(client, test_deal, solo_user):
    """Test GET /deals/{id}/financial/connections endpoint"""
    app.dependency_overrides[get_current_user] = lambda: solo_user

    try:
        response = client.get(
            f"/api/deals/{test_deal.id}/financial/connections",
        )

        assert response.status_code == 200
        data = response.json()

        # Should return empty list (no connections yet)
        assert isinstance(data, list)
        assert len(data) == 0
    finally:
        app.dependency_overrides.pop(get_current_user, None)


def test_get_financial_ratios_not_found(client, test_deal, solo_user):
    """Test GET /deals/{id}/financial/ratios returns 404 when no ratios exist"""
    app.dependency_overrides[get_current_user] = lambda: solo_user

    try:
        response = client.get(
            f"/api/deals/{test_deal.id}/financial/ratios",
        )

        assert response.status_code == 404
        assert "calculated" in response.json()["detail"].lower()
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
