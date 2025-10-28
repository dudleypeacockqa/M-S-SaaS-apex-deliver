"""
Tests for Financial Intelligence API - DEV-010
Testing the /financial API endpoints
"""

import pytest
from httpx import AsyncClient, ASGITransport

from app.main import app


@pytest.mark.asyncio
async def test_calculate_financial_ratios_endpoint(test_deal, auth_headers):
    """Test POST /deals/{id}/financial/calculate-ratios endpoint"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
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

        response = await client.post(
            f"/api/deals/{test_deal.id}/financial/calculate-ratios",
            json=financial_data,
            headers=auth_headers,
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


@pytest.mark.asyncio
async def test_calculate_ratios_requires_authentication(test_deal):
    """Test that calculating ratios requires authentication"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            f"/api/deals/{test_deal.id}/financial/calculate-ratios",
            json={"revenue": 100000},
        )

        assert response.status_code == 401  # Unauthorized


@pytest.mark.asyncio
async def test_calculate_ratios_deal_not_found(auth_headers):
    """Test 404 when deal doesn't exist"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/deals/nonexistent-deal-id/financial/calculate-ratios",
            json={"revenue": 100000},
            headers=auth_headers,
        )

        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()


@pytest.mark.asyncio
async def test_calculate_ratios_with_partial_data(test_deal, auth_headers):
    """Test that calculation works with partial data"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        financial_data = {
            "revenue": 500000,
            "cogs": 300000,
            "net_income": 50000,
        }

        response = await client.post(
            f"/api/deals/{test_deal.id}/financial/calculate-ratios",
            json=financial_data,
            headers=auth_headers,
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


@pytest.mark.asyncio
async def test_get_financial_connections_endpoint(test_deal, auth_headers):
    """Test GET /deals/{id}/financial/connections endpoint"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get(
            f"/api/deals/{test_deal.id}/financial/connections",
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()

        # Should return empty list (no connections yet)
        assert isinstance(data, list)
        assert len(data) == 0


@pytest.mark.asyncio
async def test_get_financial_ratios_not_found(test_deal, auth_headers):
    """Test GET /deals/{id}/financial/ratios returns 404 when no ratios exist"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get(
            f"/api/deals/{test_deal.id}/financial/ratios",
            headers=auth_headers,
        )

        assert response.status_code == 404
        assert "calculated" in response.json()["detail"].lower()


@pytest.mark.asyncio
async def test_get_financial_narrative_not_found(test_deal, auth_headers):
    """Test GET /deals/{id}/financial/narrative returns 404 when no narrative exists"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get(
            f"/api/deals/{test_deal.id}/financial/narrative",
            headers=auth_headers,
        )

        assert response.status_code == 404
        assert "generated" in response.json()["detail"].lower()


# ============================================================================
# NEW ENDPOINTS - DEV-010 Phase 1.2
# ============================================================================

# Test POST /deals/{deal_id}/financial/connect/xero
@pytest.mark.asyncio
async def test_connect_xero_initiates_oauth_flow(test_deal, auth_headers):
    """Test that connecting Xero initiates OAuth flow and returns authorization URL."""
    from unittest.mock import patch

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        with patch('app.api.routes.financial.initiate_xero_oauth') as mock_initiate:
            mock_initiate.return_value = {
                "authorization_url": "https://login.xero.com/identity/connect/authorize?...",
                "state": "random_state_token"
            }

            response = await client.post(
                f"/api/deals/{test_deal.id}/financial/connect/xero",
                headers=auth_headers
            )

            assert response.status_code == 200
            data = response.json()
            assert "authorization_url" in data
            assert "state" in data
            assert data["authorization_url"].startswith("https://login.xero.com")


@pytest.mark.asyncio
async def test_connect_xero_with_invalid_deal(auth_headers):
    """Test connecting Xero with non-existent deal returns 404."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/deals/nonexistent-deal-id/financial/connect/xero",
            headers=auth_headers
        )

        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()


# Test GET /deals/{deal_id}/financial/connect/xero/callback
@pytest.mark.asyncio
async def test_xero_oauth_callback_success(test_deal, auth_headers):
    """Test successful Xero OAuth callback creates connection."""
    from unittest.mock import patch, Mock

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        with patch('app.api.routes.financial.handle_xero_callback') as mock_callback:
            # Mock connection object with required attributes
            from datetime import datetime
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

            response = await client.get(
                f"/api/deals/{test_deal.id}/financial/connect/xero/callback?code=auth_code_123&state=state_token",
                headers=auth_headers
            )

            assert response.status_code == 200
            data = response.json()
            assert data["platform"] == "xero"
            assert data["connection_status"] == "active"


@pytest.mark.asyncio
async def test_xero_oauth_callback_missing_code(test_deal, auth_headers):
    """Test Xero callback without code parameter returns 422 (validation error)."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get(
            f"/api/deals/{test_deal.id}/financial/connect/xero/callback",
            headers=auth_headers
        )

        # FastAPI returns 422 for missing required query parameters (validation error)
        assert response.status_code == 422


# Test POST /deals/{deal_id}/financial/sync
@pytest.mark.asyncio
async def test_sync_financial_data_success(test_deal, db_session, auth_headers):
    """Test manual financial data sync from Xero."""
    from unittest.mock import patch, Mock
    from app.models.financial_connection import FinancialConnection
    from datetime import datetime, timedelta

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

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        with patch('app.api.routes.financial.fetch_xero_statements') as mock_fetch:
            mock_statement = Mock()
            mock_statement.id = "stmt-api-1"
            mock_fetch.return_value = [mock_statement]

            response = await client.post(
                f"/api/deals/{test_deal.id}/financial/sync",
                headers=auth_headers
            )

            assert response.status_code == 200
            data = response.json()
            assert data["success"] is True
            assert data["statements_synced"] == 1


@pytest.mark.asyncio
async def test_sync_financial_data_no_connection(test_deal, auth_headers):
    """Test syncing without connection returns 404."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            f"/api/deals/{test_deal.id}/financial/sync",
            headers=auth_headers
        )

        assert response.status_code == 404
        assert "connection" in response.json()["detail"].lower()


# Test GET /deals/{deal_id}/financial/readiness-score
@pytest.mark.asyncio
async def test_get_readiness_score_success(test_deal, db_session, auth_headers):
    """Test retrieving Deal Readiness Score."""
    from app.models.financial_narrative import FinancialNarrative
    from decimal import Decimal

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

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get(
            f"/api/deals/{test_deal.id}/financial/readiness-score",
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert data["score"] == 82.5
        assert data["data_quality_score"] == 22.0
        assert data["financial_health_score"] == 35.0
        assert data["growth_trajectory_score"] == 18.5
        assert data["risk_assessment_score"] == 7.0


@pytest.mark.asyncio
async def test_get_readiness_score_no_narrative(test_deal, auth_headers):
    """Test getting readiness score when no narrative exists returns 404."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get(
            f"/api/deals/{test_deal.id}/financial/readiness-score",
            headers=auth_headers
        )

        assert response.status_code == 404
        assert "narrative" in response.json()["detail"].lower()
