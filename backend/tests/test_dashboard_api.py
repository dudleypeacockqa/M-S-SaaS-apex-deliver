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
        """Test GET /dashboard/summary returns placeholder summary."""
        org = create_organization(name="Test Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))
        
        dependency_overrides(get_current_user, lambda: user)
        
        response = client.get("/api/dashboard/summary", headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify structure
        assert "deals" in data
        assert "activity" in data
        assert "quick_stats" in data
        
        # Verify deals structure
        assert "total" in data["deals"]
        assert "active" in data["deals"]
        assert "this_month" in data["deals"]
        assert "pipeline_value" in data["deals"]
        
        # Verify activity structure
        assert "deals_created_this_week" in data["activity"]
        assert "documents_uploaded_this_week" in data["activity"]
        assert "tasks_due_this_week" in data["activity"]
        
        # Verify quick_stats structure
        assert "avg_deal_size" in data["quick_stats"]
        assert "conversion_rate" in data["quick_stats"]
        assert "active_users" in data["quick_stats"]
        
        # Verify placeholder values
        assert data["deals"]["total"] == 0
        assert data["deals"]["active"] == 0
        assert data["quick_stats"]["active_users"] == 1  # At least current user
        
    
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
        
        # Verify structure
        assert "items" in data
        assert "total" in data
        
        # Verify placeholder values
        assert data["items"] == []
        assert data["total"] == 0
        
    
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
        
        # Verify structure (limit parameter is accepted even if not used yet)
        assert "items" in data
        assert "total" in data
        
    
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
        
        # Verify structure
        assert "items" in data
        assert "total" in data
        
        # Verify placeholder values
        assert data["items"] == []
        assert data["total"] == 0
        
    
    def test_get_financial_insights(
        self,
        client: TestClient,
        create_user,
        create_organization,
        auth_headers,
    ):
        """Test GET /dashboard/financial-insights returns placeholder data."""
        org = create_organization(name="Test Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))
        
        dependency_overrides(get_current_user, lambda: user)
        
        response = client.get("/api/dashboard/financial-insights", headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify structure
        assert "total_deal_value" in data
        assert "avg_deal_size" in data
        assert "deals_with_financials" in data
        assert "insights" in data
        
        # Verify placeholder values
        assert data["total_deal_value"] == 0
        assert data["avg_deal_size"] == 0
        assert data["deals_with_financials"] == 0
        assert data["insights"] == []
        
    
    def test_dashboard_endpoints_require_authentication(
        self,
        client: TestClient,
    ):
        """Test all dashboard endpoints require authentication."""
        endpoints = [
            "/api/dashboard/summary",
            "/api/dashboard/recent-activity",
            "/api/dashboard/tasks",
            "/api/dashboard/financial-insights",
        ]
        
        for endpoint in endpoints:
            response = client.get(endpoint)
            assert response.status_code == 401

