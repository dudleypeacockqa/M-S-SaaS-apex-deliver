"""
Tests for Deal API Error Paths - Core Business Logic (Phase 3.3)
TDD: RED → GREEN → REFACTOR
Feature: Multi-tenant isolation and error handling for deal endpoints
"""
import pytest
from fastapi.testclient import TestClient
from fastapi import status


class TestDealAPIErrorPaths:
    """Test error paths in deal API endpoints for multi-tenant isolation"""
    
    def test_update_deal_returns_403_when_deal_in_other_org(
        self,
        client: TestClient,
        create_deal_for_org,
        create_organization,
        create_user,
        auth_headers,
    ):
        """Test PUT /deals/{deal_id} returns 403 when deal belongs to another org."""
        deal1, owner1, org1 = create_deal_for_org()
        org2 = create_organization(name="Other Org")
        user2 = create_user(email="other@example.com", organization_id=str(org2.id))
        
        from app.api.dependencies.auth import get_current_user
        from app.main import app
        app.dependency_overrides[get_current_user] = lambda: user2
        
        # Try to update deal from org1
        response = client.put(
            f"/api/deals/{deal1.id}",
            headers=auth_headers,
            json={"name": "Updated Name"},
        )
        
        assert response.status_code == 403
        assert "permission" in response.json()["detail"].lower()
        
        app.dependency_overrides.pop(get_current_user, None)
    
    def test_update_deal_returns_404_when_deal_not_found(
        self,
        client: TestClient,
        create_organization,
        create_user,
        auth_headers,
    ):
        """Test PUT /deals/{deal_id} returns 404 when deal doesn't exist."""
        org = create_organization(name="Test Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))
        
        from app.api.dependencies.auth import get_current_user
        from app.main import app
        app.dependency_overrides[get_current_user] = lambda: user
        
        response = client.put(
            f"/api/deals/non-existent-deal",
            headers=auth_headers,
            json={"name": "Updated Name"},
        )
        
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()
        
        app.dependency_overrides.pop(get_current_user, None)
    
    def test_update_deal_stage_returns_403_when_deal_in_other_org(
        self,
        client: TestClient,
        create_deal_for_org,
        create_organization,
        create_user,
        auth_headers,
    ):
        """Test PUT /deals/{deal_id}/stage returns 403 when deal belongs to another org."""
        deal1, owner1, org1 = create_deal_for_org()
        org2 = create_organization(name="Other Org")
        user2 = create_user(email="other@example.com", organization_id=str(org2.id))
        
        from app.api.dependencies.auth import get_current_user
        from app.main import app
        app.dependency_overrides[get_current_user] = lambda: user2
        
        # Try to update stage for deal from org1
        response = client.put(
            f"/api/deals/{deal1.id}/stage",
            headers=auth_headers,
            json={"stage": "evaluation"},
        )
        
        assert response.status_code == 403
        assert "permission" in response.json()["detail"].lower()
        
        app.dependency_overrides.pop(get_current_user, None)
    
    def test_update_deal_stage_returns_404_when_deal_not_found(
        self,
        client: TestClient,
        create_organization,
        create_user,
        auth_headers,
    ):
        """Test PUT /deals/{deal_id}/stage returns 404 when deal doesn't exist."""
        org = create_organization(name="Test Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))
        
        from app.api.dependencies.auth import get_current_user
        from app.main import app
        app.dependency_overrides[get_current_user] = lambda: user
        
        response = client.put(
            f"/api/deals/non-existent-deal/stage",
            headers=auth_headers,
            json={"stage": "evaluation"},
        )
        
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()
        
        app.dependency_overrides.pop(get_current_user, None)
    
    def test_archive_deal_returns_403_when_deal_in_other_org(
        self,
        client: TestClient,
        create_deal_for_org,
        create_organization,
        create_user,
        auth_headers,
    ):
        """Test DELETE /deals/{deal_id} returns 403 when deal belongs to another org."""
        deal1, owner1, org1 = create_deal_for_org()
        org2 = create_organization(name="Other Org")
        user2 = create_user(email="other@example.com", organization_id=str(org2.id))
        
        from app.api.dependencies.auth import get_current_user
        from app.main import app
        app.dependency_overrides[get_current_user] = lambda: user2
        
        # Try to archive deal from org1
        response = client.delete(
            f"/api/deals/{deal1.id}",
            headers=auth_headers,
        )
        
        assert response.status_code == 403
        assert "permission" in response.json()["detail"].lower()
        
        app.dependency_overrides.pop(get_current_user, None)
    
    def test_archive_deal_returns_404_when_deal_not_found(
        self,
        client: TestClient,
        create_organization,
        create_user,
        auth_headers,
    ):
        """Test DELETE /deals/{deal_id} returns 404 when deal doesn't exist."""
        org = create_organization(name="Test Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))
        
        from app.api.dependencies.auth import get_current_user
        from app.main import app
        app.dependency_overrides[get_current_user] = lambda: user
        
        response = client.delete(
            f"/api/deals/non-existent-deal",
            headers=auth_headers,
        )
        
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()
        
        app.dependency_overrides.pop(get_current_user, None)
    
    def test_restore_deal_returns_403_when_deal_in_other_org(
        self,
        client: TestClient,
        create_deal_for_org,
        create_organization,
        create_user,
        auth_headers,
        db_session,
    ):
        """Test POST /deals/{deal_id}/restore returns 403 when deal belongs to another org."""
        deal1, owner1, org1 = create_deal_for_org()
        # Archive the deal first
        from app.services import deal_service
        deal_service.archive_deal(deal1.id, org1.id, db_session)
        
        org2 = create_organization(name="Other Org")
        user2 = create_user(email="other@example.com", organization_id=str(org2.id))
        
        from app.api.dependencies.auth import get_current_user
        from app.main import app
        app.dependency_overrides[get_current_user] = lambda: user2
        
        # Try to restore deal from org1
        response = client.post(
            f"/api/deals/{deal1.id}/restore",
            headers=auth_headers,
        )
        
        assert response.status_code == 403
        assert "permission" in response.json()["detail"].lower()
        
        app.dependency_overrides.pop(get_current_user, None)
    
    def test_restore_deal_returns_404_when_deal_not_found(
        self,
        client: TestClient,
        create_organization,
        create_user,
        auth_headers,
    ):
        """Test POST /deals/{deal_id}/restore returns 404 when deal doesn't exist."""
        org = create_organization(name="Test Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))
        
        from app.api.dependencies.auth import get_current_user
        from app.main import app
        app.dependency_overrides[get_current_user] = lambda: user
        
        response = client.post(
            f"/api/deals/non-existent-deal/restore",
            headers=auth_headers,
        )
        
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()
        
        app.dependency_overrides.pop(get_current_user, None)
    
    def test_list_deals_filters_by_organization(
        self,
        client: TestClient,
        create_deal_for_org,
        create_organization,
        create_user,
        auth_headers,
    ):
        """Test GET /deals only returns deals from user's organization."""
        deal1, owner1, org1 = create_deal_for_org()
        deal2, owner2, org2 = create_deal_for_org()
        
        # List deals as user from org1
        from app.api.dependencies.auth import get_current_user
        from app.main import app
        app.dependency_overrides[get_current_user] = lambda: owner1
        
        response = client.get("/api/deals", headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        deal_ids = {deal["id"] for deal in data["items"]}
        
        # Should only include deal1, not deal2
        assert deal1.id in deal_ids
        assert deal2.id not in deal_ids
        
        app.dependency_overrides.pop(get_current_user, None)
    
    def test_get_deal_returns_404_when_deal_not_found(
        self,
        client: TestClient,
        create_organization,
        create_user,
        auth_headers,
    ):
        """Test GET /deals/{deal_id} returns 404 when deal doesn't exist."""
        org = create_organization(name="Test Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))
        
        from app.api.dependencies.auth import get_current_user
        from app.main import app
        app.dependency_overrides[get_current_user] = lambda: user
        
        response = client.get(
            f"/api/deals/non-existent-deal",
            headers=auth_headers,
        )
        
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()
        
        app.dependency_overrides.pop(get_current_user, None)
    
    def test_get_deal_returns_404_when_deal_in_other_org(
        self,
        client: TestClient,
        create_deal_for_org,
        create_organization,
        create_user,
        auth_headers,
    ):
        """Test GET /deals/{deal_id} returns 404 when deal belongs to another org."""
        deal1, owner1, org1 = create_deal_for_org()
        org2 = create_organization(name="Other Org")
        user2 = create_user(email="other@example.com", organization_id=str(org2.id))
        
        from app.api.dependencies.auth import get_current_user
        from app.main import app
        app.dependency_overrides[get_current_user] = lambda: user2
        
        # Try to get deal from org1
        response = client.get(
            f"/api/deals/{deal1.id}",
            headers=auth_headers,
        )
        
        # get_deal_by_id filters by organization_id, so returns None (404)
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()
        
        app.dependency_overrides.pop(get_current_user, None)

