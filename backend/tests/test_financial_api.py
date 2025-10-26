"""
Tests for Financial Intelligence API - DEV-010
Testing the /financial API endpoints
"""

import pytest
from httpx import AsyncClient
from app.main import app


@pytest.mark.asyncio
async def test_calculate_financial_ratios_endpoint(test_deal, auth_headers):
    """Test POST /deals/{id}/financial/calculate-ratios endpoint"""
    async with AsyncClient(app=app, base_url="http://test") as client:
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
            f"/deals/{test_deal.id}/financial/calculate-ratios",
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
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            f"/deals/{test_deal.id}/financial/calculate-ratios",
            json={"revenue": 100000},
        )

        assert response.status_code == 401  # Unauthorized


@pytest.mark.asyncio
async def test_calculate_ratios_deal_not_found(auth_headers):
    """Test 404 when deal doesn't exist"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/deals/nonexistent-deal-id/financial/calculate-ratios",
            json={"revenue": 100000},
            headers=auth_headers,
        )

        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()


@pytest.mark.asyncio
async def test_calculate_ratios_with_partial_data(test_deal, auth_headers):
    """Test that calculation works with partial data"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        financial_data = {
            "revenue": 500000,
            "cogs": 300000,
            "net_income": 50000,
        }

        response = await client.post(
            f"/deals/{test_deal.id}/financial/calculate-ratios",
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
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get(
            f"/deals/{test_deal.id}/financial/connections",
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
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get(
            f"/deals/{test_deal.id}/financial/ratios",
            headers=auth_headers,
        )

        assert response.status_code == 404
        assert "calculated" in response.json()["detail"].lower()


@pytest.mark.asyncio
async def test_get_financial_narrative_not_found(test_deal, auth_headers):
    """Test GET /deals/{id}/financial/narrative returns 404 when no narrative exists"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get(
            f"/deals/{test_deal.id}/financial/narrative",
            headers=auth_headers,
        )

        assert response.status_code == 404
        assert "generated" in response.json()["detail"].lower()
