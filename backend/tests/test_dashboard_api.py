"""
Tests for Dashboard API Routes - Critical Path (Phase 3.2)
TDD: RED → GREEN → REFACTOR
Feature: Tenant dashboard metrics and summaries
"""
import pytest
from fastapi.testclient import TestClient

from app.api.dependencies.auth import get_current_user

dependency_overrides = None


@pytest.fixture(autouse=True)
def _bind_dependency_overrides_fixture(dependency_overrides):
    globals()["dependency_overrides"] = dependency_overrides
    yield
    globals()["dependency_overrides"] = None


class TestDashboardAPI:
    """Test dashboard API endpoints"""
    
    def test_get_dashboard_summary(
        self,
        client: TestClient,
        create_user,
        create_organization,
        auth_headers,
    ):
        """Test GET /dashboard/summary returns aggregate metrics."""
        org = create_organization(name="Test Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))
        
        dependency_overrides(get_current_user, lambda: user)
        
        response = client.get("/api/dashboard/summary", headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        
        assert set(data.keys()) == {"deals", "documents", "tasks", "financial"}

        # Verify deals section
        assert {"total", "active", "won"} == set(data["deals"].keys())
        assert isinstance(data["deals"]["total"], int)

        # Documents/tasks should be integers
        assert isinstance(data["documents"], int)
        assert isinstance(data["tasks"], int)

        # Financial block contains summary metrics
        assert {
            "total_deal_value",
            "average_deal_value",
            "active_deals",
            "won_deals",
        } == set(data["financial"].keys())
        
    
    def test_get_recent_activity(
        self,
        client: TestClient,
        create_user,
        create_organization,
        auth_headers,
    ):
        """Test GET /dashboard/recent-activity returns empty list."""
        org = create_organization(name="Test Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))
        
        dependency_overrides(get_current_user, lambda: user)
        
        response = client.get("/api/dashboard/recent-activity", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()

        # Returns list of activity entries
        assert isinstance(data, list)
        
    
    def test_get_recent_activity_with_limit(
        self,
        client: TestClient,
        create_user,
        create_organization,
        auth_headers,
    ):
        """Test GET /dashboard/recent-activity accepts limit parameter."""
        org = create_organization(name="Test Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))
        
        dependency_overrides(get_current_user, lambda: user)
        
        response = client.get("/api/dashboard/recent-activity?limit=20", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        
    
    def test_get_upcoming_tasks(
        self,
        client: TestClient,
        create_user,
        create_organization,
        auth_headers,
    ):
        """Test GET /dashboard/tasks returns empty list."""
        org = create_organization(name="Test Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))
        
        dependency_overrides(get_current_user, lambda: user)
        
        response = client.get("/api/dashboard/tasks", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


    def test_get_financial_insights(
        self,
        client: TestClient,
        create_user,
        create_organization,
        auth_headers,
    ):
        """Test GET /dashboard/financial-summary returns aggregate data."""
        org = create_organization(name="Test Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))
        
        dependency_overrides(get_current_user, lambda: user)
        
        response = client.get("/api/dashboard/financial-summary", headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify structure
        assert {
            "total_deal_value",
            "average_deal_value",
            "active_deals",
            "won_deals",
        } == set(data.keys())
        
    
    def test_dashboard_endpoints_require_authentication(
        self,
        client: TestClient,
    ):
        """Test all dashboard endpoints require authentication."""
        endpoints = [
            "/api/dashboard/summary",
            "/api/dashboard/recent-activity",
            "/api/dashboard/tasks",
            "/api/dashboard/financial-summary",
            "/api/dashboard/metrics",
        ]
        
        for endpoint in endpoints:
            response = client.get(endpoint)
            assert response.status_code == 401

