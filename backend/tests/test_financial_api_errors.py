"""
Tests for Financial API Error Paths - Core Business Logic (Phase 3.3)
TDD: RED → GREEN → REFACTOR
Feature: Multi-tenant isolation and error handling for financial endpoints
"""
import pytest
from contextlib import contextmanager
from fastapi.testclient import TestClient
from fastapi import status

from app.api.dependencies.auth import get_current_user

dependency_overrides = None


@pytest.fixture(autouse=True)
def _bind_dependency_overrides_fixture(dependency_overrides):
    globals()["dependency_overrides"] = dependency_overrides
    yield
    globals()["dependency_overrides"] = None


@contextmanager
def override_current_user(user):
    dependency_overrides(get_current_user, lambda: user)
    yield


class TestFinancialAPIErrorPaths:
    """Test error paths in financial API endpoints for multi-tenant isolation"""
    
    def test_calculate_ratios_returns_403_when_deal_in_other_org(
        self,
        client: TestClient,
        create_deal_for_org,
        create_organization,
        create_user,
    ):
        """Test POST /deals/{deal_id}/financial/calculate-ratios returns 403 when deal belongs to another org."""
        deal1, owner1, org1 = create_deal_for_org()
        org2 = create_organization(name="Other Org")
        user2 = create_user(email="other@example.com", organization_id=str(org2.id))
        
        with override_current_user(user2):
            financial_data = {
                "revenue": 500000,
                "cogs": 300000,
                "net_income": 50000,
            }
            
            response = client.post(
                f"/api/deals/{deal1.id}/financial/calculate-ratios",
                json=financial_data,
            )
            
            assert response.status_code == 403
            assert "organization" in response.json()["detail"].lower()

    
    def test_get_ratios_returns_403_when_deal_in_other_org(
        self,
        client: TestClient,
        create_deal_for_org,
        create_organization,
        create_user,
    ):
        """Test GET /deals/{deal_id}/financial/ratios returns 403 when deal belongs to another org."""
        deal1, owner1, org1 = create_deal_for_org()
        org2 = create_organization(name="Other Org")
        user2 = create_user(email="other@example.com", organization_id=str(org2.id))
        
        with override_current_user(user2):
            response = client.get(
                f"/api/deals/{deal1.id}/financial/ratios",
            )
            
            assert response.status_code == 403
            assert "organization" in response.json()["detail"].lower()

    
    def test_get_connections_returns_403_when_deal_in_other_org(
        self,
        client: TestClient,
        create_deal_for_org,
        create_organization,
        create_user,
    ):
        """Test GET /deals/{deal_id}/financial/connections returns 403 when deal belongs to another org."""
        deal1, owner1, org1 = create_deal_for_org()
        org2 = create_organization(name="Other Org")
        user2 = create_user(email="other@example.com", organization_id=str(org2.id))
        
        with override_current_user(user2):
            response = client.get(
                f"/api/deals/{deal1.id}/financial/connections",
            )
            
            assert response.status_code == 403
            assert "organization" in response.json()["detail"].lower()

    
    def test_get_narrative_returns_403_when_deal_in_other_org(
        self,
        client: TestClient,
        create_deal_for_org,
        create_organization,
        create_user,
    ):
        """Test GET /deals/{deal_id}/financial/narrative returns 403 when deal belongs to another org."""
        deal1, owner1, org1 = create_deal_for_org()
        org2 = create_organization(name="Other Org")
        user2 = create_user(email="other@example.com", organization_id=str(org2.id))
        
        with override_current_user(user2):
            response = client.get(
                f"/api/deals/{deal1.id}/financial/narrative",
            )
            
            assert response.status_code == 403
            assert "organization" in response.json()["detail"].lower()

    
    def test_get_readiness_score_returns_403_when_deal_in_other_org(
        self,
        client: TestClient,
        create_deal_for_org,
        create_organization,
        create_user,
    ):
        """Test GET /deals/{deal_id}/financial/readiness-score returns 403 when deal belongs to another org."""
        deal1, owner1, org1 = create_deal_for_org()
        org2 = create_organization(name="Other Org")
        user2 = create_user(email="other@example.com", organization_id=str(org2.id))
        
        with override_current_user(user2):
            response = client.get(
                f"/api/deals/{deal1.id}/financial/readiness-score",
            )
            
            assert response.status_code == 403
            assert "organization" in response.json()["detail"].lower()

    
    def test_connect_xero_returns_403_when_deal_in_other_org(
        self,
        client: TestClient,
        create_deal_for_org,
        create_organization,
        create_user,
    ):
        """Test POST /deals/{deal_id}/financial/connect/xero returns 403 when deal belongs to another org."""
        deal1, owner1, org1 = create_deal_for_org()
        org2 = create_organization(name="Other Org")
        user2 = create_user(email="other@example.com", organization_id=str(org2.id))
        
        with override_current_user(user2):
            response = client.post(
                f"/api/deals/{deal1.id}/financial/connect/xero",
            )
            
            assert response.status_code == 403
            assert "organization" in response.json()["detail"].lower()

    
    def test_sync_financial_data_returns_403_when_deal_in_other_org(
        self,
        client: TestClient,
        create_deal_for_org,
        create_organization,
        create_user,
    ):
        """Test POST /deals/{deal_id}/financial/sync returns 403 when deal belongs to another org."""
        deal1, owner1, org1 = create_deal_for_org()
        org2 = create_organization(name="Other Org")
        user2 = create_user(email="other@example.com", organization_id=str(org2.id))
        
        with override_current_user(user2):
            response = client.post(
                f"/api/deals/{deal1.id}/financial/sync",
            )
            
            assert response.status_code == 403
            assert "organization" in response.json()["detail"].lower()

    
    def test_disconnect_quickbooks_returns_403_when_deal_in_other_org(
        self,
        client: TestClient,
        create_deal_for_org,
        create_organization,
        create_user,
    ):
        """Test DELETE /deals/{deal_id}/financial/connect/quickbooks returns 403 when deal belongs to another org."""
        deal1, owner1, org1 = create_deal_for_org()
        org2 = create_organization(name="Other Org")
        user2 = create_user(email="other@example.com", organization_id=str(org2.id))
        
        with override_current_user(user2):
            response = client.delete(
                f"/api/deals/{deal1.id}/financial/connect/quickbooks",
            )
            
            assert response.status_code == 403
            assert "organization" in response.json()["detail"].lower()


