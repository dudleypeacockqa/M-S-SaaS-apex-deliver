"""
Tests for Valuation API Error Paths - Critical Path (Phase 3.2)
TDD: RED → GREEN → REFACTOR
Feature: DEV-011 Error handling and edge cases for valuation endpoints
"""
import pytest
from fastapi.testclient import TestClient
from fastapi import status


VALUATION_PAYLOAD = {
    "forecast_years": 5,
    "discount_rate": 0.12,
    "terminal_growth_rate": 0.03,
    "terminal_method": "gordon_growth",
    "cash_flows": [500000, 650000, 800000, 950000, 1100000],
    "terminal_cash_flow": 1200000,
    "net_debt": 2000000,
    "shares_outstanding": 1000000,
}


class TestValuationAPIErrorPaths:
    """Test error paths in valuation API endpoints"""
    
    def test_list_valuations_deal_not_found(
        self,
        client: TestClient,
        create_deal_for_org,
        auth_headers_growth,
    ):
        """Test GET /deals/{deal_id}/valuations returns 404 when deal not found."""
        deal, owner, org = create_deal_for_org()
        
        # Try to list valuations for non-existent deal
        response = client.get(
            f"/api/deals/non-existent-deal/valuations",
            headers=auth_headers_growth,
        )
        
        assert response.status_code == 404
        detail = response.json()["detail"]
        assert detail["code"] == "DEAL_NOT_FOUND"
    
    def test_list_valuations_deal_from_other_org(
        self,
        client: TestClient,
        create_deal_for_org,
        create_organization,
        create_user,
        auth_headers_growth,
        dependency_overrides,
    ):
        """Test GET /deals/{deal_id}/valuations returns 404 when deal belongs to another org."""
        deal1, owner1, org1 = create_deal_for_org()
        org2 = create_organization(name="Other Org")
        user2 = create_user(email="other@example.com", organization_id=str(org2.id), role="growth")
        
        from app.api.dependencies.auth import get_current_user
        dependency_overrides(get_current_user, lambda: user2)
        
        # Try to list valuations for deal from org1
        response = client.get(
            f"/api/deals/{deal1.id}/valuations",
            headers=auth_headers_growth,
        )
        
        assert response.status_code == 404
        detail = response.json()["detail"]
        assert detail["code"] == "DEAL_NOT_FOUND"
        
    def test_get_valuation_not_found(
        self,
        client: TestClient,
        create_deal_for_org,
        auth_headers_growth,
    ):
        """Test GET /deals/{deal_id}/valuations/{valuation_id} returns 404 when valuation not found."""
        deal, owner, org = create_deal_for_org()
        
        response = client.get(
            f"/api/deals/{deal.id}/valuations/non-existent-valuation",
            headers=auth_headers_growth,
        )
        
        assert response.status_code == 404
        detail = response.json()["detail"]
        assert detail["code"] == "VALUATION_NOT_FOUND"
    
    def test_get_valuation_deal_mismatch(
        self,
        client: TestClient,
        create_deal_for_org,
        auth_headers_growth,
    ):
        """Test GET /deals/{deal_id}/valuations/{valuation_id} returns 403 when deal mismatch."""
        deal1, owner1, org1 = create_deal_for_org()
        deal2, owner2, org2 = create_deal_for_org()
        
        # Create valuation in deal1
        create_resp = client.post(
            f"/api/deals/{deal1.id}/valuations",
            json=VALUATION_PAYLOAD,
            headers=auth_headers_growth,
        )
        valuation_id = create_resp.json()["id"]
        
        # Try to get it via deal2 endpoint
        response = client.get(
            f"/api/deals/{deal2.id}/valuations/{valuation_id}",
            headers=auth_headers_growth,
        )
        
        assert response.status_code == 403
        detail = response.json()["detail"]
        assert detail["code"] == "DEAL_MISMATCH"
    
    def test_update_valuation_not_found(
        self,
        client: TestClient,
        create_deal_for_org,
        auth_headers_growth,
    ):
        """Test PUT /deals/{deal_id}/valuations/{valuation_id} returns 404 when valuation not found."""
        deal, owner, org = create_deal_for_org()
        
        response = client.put(
            f"/api/deals/{deal.id}/valuations/non-existent-valuation",
            json={"discount_rate": 0.1},
            headers=auth_headers_growth,
        )
        
        assert response.status_code == 404
        detail = response.json()["detail"]
        assert detail["code"] == "VALUATION_NOT_FOUND"
    
    def test_delete_valuation_not_found(
        self,
        client: TestClient,
        create_deal_for_org,
        auth_headers_growth,
    ):
        """Test DELETE /deals/{deal_id}/valuations/{valuation_id} returns 404 when valuation not found."""
        deal, owner, org = create_deal_for_org()
        
        response = client.delete(
            f"/api/deals/{deal.id}/valuations/non-existent-valuation",
            headers=auth_headers_growth,
        )
        
        assert response.status_code == 404
        detail = response.json()["detail"]
        assert detail["code"] == "VALUATION_NOT_FOUND"
    
    def test_add_comparable_valuation_not_found(
        self,
        client: TestClient,
        create_deal_for_org,
        auth_headers_growth,
    ):
        """Test POST /deals/{deal_id}/valuations/{valuation_id}/comparables returns 404 when valuation not found."""
        deal, owner, org = create_deal_for_org()
        
        comparable_data = {
            "company_name": "Test Company",
            "revenue": 1000000,
            "ebitda": 200000,
            "enterprise_value": 5000000,
        }
        
        response = client.post(
            f"/api/deals/{deal.id}/valuations/non-existent-valuation/comparables",
            json=comparable_data,
            headers=auth_headers_growth,
        )
        
        assert response.status_code == 404
        detail = response.json()["detail"]
        assert detail["code"] == "VALUATION_NOT_FOUND"
    
    def test_list_exports_valuation_not_found(
        self,
        client: TestClient,
        create_deal_for_org,
        auth_headers_growth,
    ):
        """Test GET /deals/{deal_id}/valuations/{valuation_id}/exports returns 404 when valuation not found."""
        deal, owner, org = create_deal_for_org()
        
        response = client.get(
            f"/api/deals/{deal.id}/valuations/non-existent-valuation/exports",
            headers=auth_headers_growth,
        )
        
        assert response.status_code == 404
        detail = response.json()["detail"]
        assert detail["code"] == "VALUATION_NOT_FOUND"
    
    def test_get_export_status_not_found(
        self,
        client: TestClient,
        create_deal_for_org,
        auth_headers_growth,
    ):
        """Test GET /deals/{deal_id}/valuations/{valuation_id}/exports/{task_id} returns 404 when export not found."""
        deal, owner, org = create_deal_for_org()
        
        # Create valuation first
        create_resp = client.post(
            f"/api/deals/{deal.id}/valuations",
            json=VALUATION_PAYLOAD,
            headers=auth_headers_growth,
        )
        valuation_id = create_resp.json()["id"]
        
        # Try to get non-existent export
        response = client.get(
            f"/api/deals/{deal.id}/valuations/{valuation_id}/exports/non-existent-task",
            headers=auth_headers_growth,
        )
        
        assert response.status_code == 404
        detail = response.json()["detail"]
        assert detail["code"] == "EXPORT_NOT_FOUND"
    
    def test_monte_carlo_invalid_parameters(
        self,
        client: TestClient,
        create_deal_for_org,
        auth_headers_growth,
    ):
        """Test POST /deals/{deal_id}/valuations/{valuation_id}/monte-carlo returns 422 for invalid parameters."""
        deal, owner, org = create_deal_for_org()
        
        # Create valuation first
        create_resp = client.post(
            f"/api/deals/{deal.id}/valuations",
            json=VALUATION_PAYLOAD,
            headers=auth_headers_growth,
        )
        valuation_id = create_resp.json()["id"]
        
        # Try Monte Carlo with invalid iterations (negative)
        response = client.post(
            f"/api/deals/{deal.id}/valuations/{valuation_id}/monte-carlo",
            json={"iterations": -1, "seed": 12345},
            headers=auth_headers_growth,
        )
        
        # Should fail validation (422) or raise ValueError (422)
        assert response.status_code in (400, 422)


class TestValuationAPISummaryEndpoints:
    """Test summary endpoints in valuation API"""
    
    def test_get_comparable_summary(
        self,
        client: TestClient,
        create_deal_for_org,
        auth_headers_growth,
    ):
        """Test GET /deals/{deal_id}/valuations/{valuation_id}/comparables/summary returns summary."""
        deal, owner, org = create_deal_for_org()
        
        # Create valuation
        create_resp = client.post(
            f"/api/deals/{deal.id}/valuations",
            json=VALUATION_PAYLOAD,
            headers=auth_headers_growth,
        )
        valuation_id = create_resp.json()["id"]
        
        # Add comparables (with proper fields for multiples calculation)
        comparable1 = {
            "company_name": "Company 1",
            "ev_revenue_multiple": 5.0,
            "ev_ebitda_multiple": 10.0,
            "weight": 1.0,
        }
        comparable2 = {
            "company_name": "Company 2",
            "ev_revenue_multiple": 6.0,
            "ev_ebitda_multiple": 12.0,
            "weight": 1.0,
        }
        
        client.post(
            f"/api/deals/{deal.id}/valuations/{valuation_id}/comparables",
            json=comparable1,
            headers=auth_headers_growth,
        )
        client.post(
            f"/api/deals/{deal.id}/valuations/{valuation_id}/comparables",
            json=comparable2,
            headers=auth_headers_growth,
        )
        
        # Get summary
        response = client.get(
            f"/api/deals/{deal.id}/valuations/{valuation_id}/comparables/summary",
            headers=auth_headers_growth,
        )
        
        assert response.status_code == 200
        data = response.json()
        # Summary should contain calculated multiples structure
        assert "ev_ebitda" in data or "ev_revenue" in data
        # Verify structure
        assert isinstance(data, dict)
    
    def test_get_transaction_summary(
        self,
        client: TestClient,
        create_deal_for_org,
        auth_headers_growth,
    ):
        """Test GET /deals/{deal_id}/valuations/{valuation_id}/transactions/summary returns summary."""
        deal, owner, org = create_deal_for_org()
        
        # Create valuation
        create_resp = client.post(
            f"/api/deals/{deal.id}/valuations",
            json=VALUATION_PAYLOAD,
            headers=auth_headers_growth,
        )
        valuation_id = create_resp.json()["id"]
        
        # Get summary (even without transactions, should return structure)
        response = client.get(
            f"/api/deals/{deal.id}/valuations/{valuation_id}/transactions/summary",
            headers=auth_headers_growth,
        )
        
        assert response.status_code == 200
        data = response.json()
        # Summary should be returned (may be empty if no transactions)
        assert isinstance(data, dict)
    
    def test_get_valuation_summary(
        self,
        client: TestClient,
        create_deal_for_org,
        auth_headers_growth,
    ):
        """Test GET /deals/{deal_id}/valuations/{valuation_id}/valuation-summary returns all valuations."""
        deal, owner, org = create_deal_for_org()
        
        # Create multiple valuations
        create_resp1 = client.post(
            f"/api/deals/{deal.id}/valuations",
            json=VALUATION_PAYLOAD,
            headers=auth_headers_growth,
        )
        valuation_id1 = create_resp1.json()["id"]
        
        create_resp2 = client.post(
            f"/api/deals/{deal.id}/valuations",
            json={**VALUATION_PAYLOAD, "discount_rate": 0.15},
            headers=auth_headers_growth,
        )
        valuation_id2 = create_resp2.json()["id"]
        
        # Get summary
        response = client.get(
            f"/api/deals/{deal.id}/valuations/{valuation_id1}/valuation-summary",
            headers=auth_headers_growth,
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "valuations" in data
        assert "count" in data
        assert data["count"] >= 2  # At least the 2 we created
        assert len(data["valuations"]) == data["count"]

