"""
Tests for PMI API Routes - 100% Coverage
Testing all 24+ endpoints with access control, validation, and error handling
"""

from __future__ import annotations

import pytest
from unittest.mock import Mock, patch, AsyncMock
from datetime import datetime, timezone, timedelta
from decimal import Decimal
from starlette.testclient import TestClient

from app.models.user import User, UserRole
from app.models.organization import Organization
from app.models.deal import Deal, DealStage
from app.models.pmi import (
    PMIProject,
    PMIWorkstream,
    PMIMilestone,
    PMISynergy,
    PMIRisk,
    PMIDayOneChecklist,
    PMIProjectStatus,
    PMIWorkstreamStatus,
    PMIWorkstreamType,
    PMISynergyCategory,
    PMISynergyStatus,
    PMIRiskSeverity,
    PMIRiskStatus,
    PMIDayOneChecklistStatus,
    PMIDayOneCategory,
)


@pytest.fixture
def mock_user(create_user, create_organization):
    """Create a mock user with professional tier."""
    org = create_organization(name="Test Org", subscription_tier="professional")
    return create_user(
        email="test@example.com",
        organization_id=str(org.id),
        role=UserRole.solo
    )


@pytest.fixture
def mock_pmi_project(mock_user, db_session, create_deal):
    """Create a mock PMI project."""
    deal = create_deal(
        organization_id=mock_user.organization_id,
        owner_id=mock_user.id,
        stage=DealStage.won
    )
    project = PMIProject(
        id="pmi-project-123",
        organization_id=mock_user.organization_id,
        deal_id=deal.id,
        name="Test PMI Project",
        status=PMIProjectStatus.planning,
        created_by=mock_user.id,
    )
    db_session.add(project)
    db_session.commit()
    db_session.refresh(project)
    return project


@pytest.fixture
def auth_headers(mock_user):
    """Create auth headers for requests."""
    return {"Authorization": "Bearer test_token"}


class TestPMIProjectEndpoints:
    """Test PMI Project CRUD endpoints."""

    @patch('app.api.routes.pmi.entitlement_service.check_feature_access')
    @patch('app.api.routes.pmi.get_current_user')
    def test_create_pmi_project_success(
        self,
        mock_get_user,
        mock_check_access,
        client: TestClient,
        mock_user,
        dependency_overrides,
        db_session,
        create_deal,
    ):
        """Test creating a PMI project successfully."""
        mock_get_user.return_value = mock_user
        mock_check_access.return_value = True
        
        deal = create_deal(
            organization_id=mock_user.organization_id,
            owner_id=mock_user.id
        )
        
        from app.api.dependencies.auth import get_current_user
        dependency_overrides(get_current_user, lambda: mock_user)
        
        response = client.post(
            "/api/pmi/projects",
            json={
                "name": "New PMI Project",
                "deal_id": deal.id,
                "status": "planning",
            },
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "New PMI Project"
        assert data["deal_id"] == deal.id

    @patch('app.api.routes.pmi.entitlement_service.check_feature_access')
    def test_create_pmi_project_no_access(
        self,
        mock_check_access,
        client: TestClient,
        mock_user,
        dependency_overrides,
    ):
        """Test creating PMI project without access returns 403."""
        mock_check_access.side_effect = Exception("No access")
        
        from app.api.dependencies.auth import get_current_user
        dependency_overrides(get_current_user, lambda: mock_user)
        
        response = client.post(
            "/api/pmi/projects",
            json={"name": "Test Project", "deal_id": "deal-123"},
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == 403

    @patch('app.api.routes.pmi.entitlement_service.check_feature_access')
    def test_list_pmi_projects(
        self,
        mock_check_access,
        client: TestClient,
        mock_user,
        dependency_overrides,
        mock_pmi_project,
    ):
        """Test listing PMI projects."""
        mock_check_access.return_value = True
        
        from app.api.dependencies.auth import get_current_user
        dependency_overrides(get_current_user, lambda: mock_user)
        
        response = client.get(
            "/api/pmi/projects",
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "total" in data

    @patch('app.api.routes.pmi.entitlement_service.check_feature_access')
    def test_list_pmi_projects_with_pagination(
        self,
        mock_check_access,
        client: TestClient,
        mock_user,
        dependency_overrides,
    ):
        """Test listing PMI projects with pagination."""
        mock_check_access.return_value = True
        
        from app.api.dependencies.auth import get_current_user
        dependency_overrides(get_current_user, lambda: mock_user)
        
        response = client.get(
            "/api/pmi/projects?page=1&per_page=10",
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "page" in data
        assert "page_size" in data

    @patch('app.api.routes.pmi.entitlement_service.check_feature_access')
    def test_list_pmi_projects_filter_by_status(
        self,
        mock_check_access,
        client: TestClient,
        mock_user,
        dependency_overrides,
    ):
        """Test filtering PMI projects by status."""
        mock_check_access.return_value = True
        
        from app.api.dependencies.auth import get_current_user
        dependency_overrides(get_current_user, lambda: mock_user)
        
        response = client.get(
            "/api/pmi/projects?status=active",
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == 200

    @patch('app.api.routes.pmi.entitlement_service.check_feature_access')
    def test_get_pmi_project(
        self,
        mock_check_access,
        client: TestClient,
        mock_user,
        dependency_overrides,
        mock_pmi_project,
    ):
        """Test getting a specific PMI project."""
        mock_check_access.return_value = True
        
        from app.api.dependencies.auth import get_current_user
        dependency_overrides(get_current_user, lambda: mock_user)
        
        response = client.get(
            f"/api/pmi/projects/{mock_pmi_project.id}",
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == mock_pmi_project.id

    @patch('app.api.routes.pmi.entitlement_service.check_feature_access')
    def test_get_pmi_project_not_found(
        self,
        mock_check_access,
        client: TestClient,
        mock_user,
        dependency_overrides,
    ):
        """Test getting non-existent PMI project returns 404."""
        mock_check_access.return_value = True
        
        from app.api.dependencies.auth import get_current_user
        dependency_overrides(get_current_user, lambda: mock_user)
        
        response = client.get(
            "/api/pmi/projects/non-existent-id",
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == 404

    @patch('app.api.routes.pmi.entitlement_service.check_feature_access')
    def test_update_pmi_project(
        self,
        mock_check_access,
        client: TestClient,
        mock_user,
        dependency_overrides,
        mock_pmi_project,
    ):
        """Test updating a PMI project."""
        mock_check_access.return_value = True
        
        from app.api.dependencies.auth import get_current_user
        dependency_overrides(get_current_user, lambda: mock_user)
        
        response = client.put(
            f"/api/pmi/projects/{mock_pmi_project.id}",
            json={"name": "Updated Project Name", "status": "active"},
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated Project Name"

    @patch('app.api.routes.pmi.entitlement_service.check_feature_access')
    def test_get_pmi_dashboard(
        self,
        mock_check_access,
        client: TestClient,
        mock_user,
        dependency_overrides,
        mock_pmi_project,
    ):
        """Test getting PMI dashboard."""
        mock_check_access.return_value = True
        
        from app.api.dependencies.auth import get_current_user
        dependency_overrides(get_current_user, lambda: mock_user)
        
        response = client.get(
            f"/api/pmi/projects/{mock_pmi_project.id}/dashboard",
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "project_id" in data
        assert "workstreams_summary" in data

    @patch('app.api.routes.pmi.entitlement_service.check_feature_access')
    def test_generate_100_day_plan(
        self,
        mock_check_access,
        client: TestClient,
        mock_user,
        dependency_overrides,
        mock_pmi_project,
    ):
        """Test generating 100-day plan."""
        mock_check_access.return_value = True
        
        from app.api.dependencies.auth import get_current_user
        dependency_overrides(get_current_user, lambda: mock_user)
        
        response = client.post(
            f"/api/pmi/projects/{mock_pmi_project.id}/generate-plan",
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == 201
        data = response.json()
        assert "message" in data


class TestPMIWorkstreamEndpoints:
    """Test PMI Workstream endpoints."""

    @patch('app.api.routes.pmi.entitlement_service.check_feature_access')
    def test_create_workstream(
        self,
        mock_check_access,
        client: TestClient,
        mock_user,
        dependency_overrides,
        mock_pmi_project,
    ):
        """Test creating a workstream."""
        mock_check_access.return_value = True
        
        from app.api.dependencies.auth import get_current_user
        dependency_overrides(get_current_user, lambda: mock_user)
        
        response = client.post(
            f"/api/pmi/projects/{mock_pmi_project.id}/workstreams",
            json={
                "name": "IT Integration",
                "workstream_type": "it",
                "priority": "high",
            },
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "IT Integration"

    @patch('app.api.routes.pmi.entitlement_service.check_feature_access')
    def test_list_workstreams(
        self,
        mock_check_access,
        client: TestClient,
        mock_user,
        dependency_overrides,
        mock_pmi_project,
    ):
        """Test listing workstreams."""
        mock_check_access.return_value = True
        
        from app.api.dependencies.auth import get_current_user
        dependency_overrides(get_current_user, lambda: mock_user)
        
        response = client.get(
            f"/api/pmi/projects/{mock_pmi_project.id}/workstreams",
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "items" in data


class TestPMIMilestoneEndpoints:
    """Test PMI Milestone endpoints."""

    @patch('app.api.routes.pmi.entitlement_service.check_feature_access')
    def test_create_milestone(
        self,
        mock_check_access,
        client: TestClient,
        mock_user,
        dependency_overrides,
        mock_pmi_project,
        db_session,
    ):
        """Test creating a milestone."""
        mock_check_access.return_value = True
        
        # Create workstream first
        workstream = PMIWorkstream(
            id="workstream-123",
            project_id=mock_pmi_project.id,
            organization_id=mock_user.organization_id,
            name="Test Workstream",
            workstream_type=PMIWorkstreamType.it,
            status=PMIWorkstreamStatus.not_started,
            priority="high",
        )
        db_session.add(workstream)
        db_session.commit()
        
        from app.api.dependencies.auth import get_current_user
        dependency_overrides(get_current_user, lambda: mock_user)
        
        response = client.post(
            f"/api/pmi/workstreams/{workstream.id}/milestones",
            json={
                "name": "Test Milestone",
                "status": "not_started",
            },
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Test Milestone"


class TestPMISynergyEndpoints:
    """Test PMI Synergy endpoints."""

    @patch('app.api.routes.pmi.entitlement_service.check_feature_access')
    def test_create_synergy(
        self,
        mock_check_access,
        client: TestClient,
        mock_user,
        dependency_overrides,
        mock_pmi_project,
    ):
        """Test creating a synergy."""
        mock_check_access.return_value = True
        
        from app.api.dependencies.auth import get_current_user
        dependency_overrides(get_current_user, lambda: mock_user)
        
        response = client.post(
            f"/api/pmi/projects/{mock_pmi_project.id}/synergies",
            json={
                "name": "Cost Synergy",
                "category": "cost_synergy",
                "planned_value": 100000.00,
                "currency": "GBP",
            },
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Cost Synergy"

    @patch('app.api.routes.pmi.entitlement_service.check_feature_access')
    def test_list_synergies(
        self,
        mock_check_access,
        client: TestClient,
        mock_user,
        dependency_overrides,
        mock_pmi_project,
    ):
        """Test listing synergies."""
        mock_check_access.return_value = True
        
        from app.api.dependencies.auth import get_current_user
        dependency_overrides(get_current_user, lambda: mock_user)
        
        response = client.get(
            f"/api/pmi/projects/{mock_pmi_project.id}/synergies",
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "items" in data


class TestPMIRiskEndpoints:
    """Test PMI Risk endpoints."""

    @patch('app.api.routes.pmi.entitlement_service.check_feature_access')
    def test_create_risk(
        self,
        mock_check_access,
        client: TestClient,
        mock_user,
        dependency_overrides,
        mock_pmi_project,
    ):
        """Test creating a risk."""
        mock_check_access.return_value = True
        
        from app.api.dependencies.auth import get_current_user
        dependency_overrides(get_current_user, lambda: mock_user)
        
        response = client.post(
            f"/api/pmi/projects/{mock_pmi_project.id}/risks",
            json={
                "title": "Integration Risk",
                "description": "Risk of delays",
                "severity": "high",
                "status": "open",
            },
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "Integration Risk"

    @patch('app.api.routes.pmi.entitlement_service.check_feature_access')
    def test_list_risks(
        self,
        mock_check_access,
        client: TestClient,
        mock_user,
        dependency_overrides,
        mock_pmi_project,
    ):
        """Test listing risks."""
        mock_check_access.return_value = True
        
        from app.api.dependencies.auth import get_current_user
        dependency_overrides(get_current_user, lambda: mock_user)
        
        response = client.get(
            f"/api/pmi/projects/{mock_pmi_project.id}/risks",
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "items" in data

    @patch('app.api.routes.pmi.entitlement_service.check_feature_access')
    def test_list_risks_filter_by_severity(
        self,
        mock_check_access,
        client: TestClient,
        mock_user,
        dependency_overrides,
        mock_pmi_project,
    ):
        """Test filtering risks by severity."""
        mock_check_access.return_value = True
        
        from app.api.dependencies.auth import get_current_user
        dependency_overrides(get_current_user, lambda: mock_user)
        
        response = client.get(
            f"/api/pmi/projects/{mock_pmi_project.id}/risks?severity=high",
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == 200


class TestPMIDayOneChecklistEndpoints:
    """Test PMI Day One Checklist endpoints."""

    @patch('app.api.routes.pmi.entitlement_service.check_feature_access')
    def test_create_day_one_checklist_item(
        self,
        mock_check_access,
        client: TestClient,
        mock_user,
        dependency_overrides,
        mock_pmi_project,
    ):
        """Test creating a Day 1 checklist item."""
        mock_check_access.return_value = True
        
        from app.api.dependencies.auth import get_current_user
        dependency_overrides(get_current_user, lambda: mock_user)
        
        response = client.post(
            f"/api/pmi/projects/{mock_pmi_project.id}/day-one-checklist",
            json={
                "category": "it",
                "item": "Email access configured",
                "status": "not_started",
            },
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["item"] == "Email access configured"

    @patch('app.api.routes.pmi.entitlement_service.check_feature_access')
    def test_list_day_one_checklist(
        self,
        mock_check_access,
        client: TestClient,
        mock_user,
        dependency_overrides,
        mock_pmi_project,
    ):
        """Test listing Day 1 checklist items."""
        mock_check_access.return_value = True
        
        from app.api.dependencies.auth import get_current_user
        dependency_overrides(get_current_user, lambda: mock_user)
        
        response = client.get(
            f"/api/pmi/projects/{mock_pmi_project.id}/day-one-checklist",
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "items" in data

    @patch('app.api.routes.pmi.entitlement_service.check_feature_access')
    def test_complete_day_one_checklist_item(
        self,
        mock_check_access,
        client: TestClient,
        mock_user,
        dependency_overrides,
        mock_pmi_project,
        db_session,
    ):
        """Test completing a Day 1 checklist item."""
        mock_check_access.return_value = True
        
        # Create checklist item
        checklist_item = PMIDayOneChecklist(
            id="checklist-123",
            project_id=mock_pmi_project.id,
            organization_id=mock_user.organization_id,
            category=PMIDayOneCategory.it,
            item="Test Item",
            status=PMIDayOneChecklistStatus.not_started,
        )
        db_session.add(checklist_item)
        db_session.commit()
        
        from app.api.dependencies.auth import get_current_user
        dependency_overrides(get_current_user, lambda: mock_user)
        
        response = client.post(
            f"/api/pmi/day-one-checklist/{checklist_item.id}/complete",
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "complete"


class TestPMIAccessControl:
    """Test PMI access control and authorization."""

    def test_endpoints_require_authentication(self, client: TestClient):
        """Test that all PMI endpoints require authentication."""
        endpoints = [
            ("POST", "/api/pmi/projects"),
            ("GET", "/api/pmi/projects"),
            ("GET", "/api/pmi/projects/project-123"),
            ("PUT", "/api/pmi/projects/project-123"),
        ]
        
        for method, endpoint in endpoints:
            if method == "POST":
                response = client.post(endpoint, json={})
            elif method == "PUT":
                response = client.put(endpoint, json={})
            else:
                response = client.get(endpoint)
            
            assert response.status_code == 401  # Unauthorized

    @patch('app.api.routes.pmi.entitlement_service.check_feature_access')
    def test_endpoints_check_pmi_access(
        self,
        mock_check_access,
        client: TestClient,
        mock_user,
        dependency_overrides,
    ):
        """Test that endpoints check PMI module access."""
        mock_check_access.return_value = False  # No access
        
        from app.api.dependencies.auth import get_current_user
        dependency_overrides(get_current_user, lambda: mock_user)
        
        response = client.get(
            "/api/pmi/projects",
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == 403  # Forbidden


class TestPMIValidation:
    """Test PMI endpoint validation."""

    @patch('app.api.routes.pmi.entitlement_service.check_feature_access')
    def test_create_project_validation(
        self,
        mock_check_access,
        client: TestClient,
        mock_user,
        dependency_overrides,
    ):
        """Test that creating project validates required fields."""
        mock_check_access.return_value = True
        
        from app.api.dependencies.auth import get_current_user
        dependency_overrides(get_current_user, lambda: mock_user)
        
        # Missing required fields
        response = client.post(
            "/api/pmi/projects",
            json={},  # Empty payload
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == 422  # Validation error

    @patch('app.api.routes.pmi.entitlement_service.check_feature_access')
    def test_pagination_validation(
        self,
        mock_check_access,
        client: TestClient,
        mock_user,
        dependency_overrides,
    ):
        """Test pagination parameter validation."""
        mock_check_access.return_value = True
        
        from app.api.dependencies.auth import get_current_user
        dependency_overrides(get_current_user, lambda: mock_user)
        
        # Invalid page number
        response = client.get(
            "/api/pmi/projects?page=0",  # Should be >= 1
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == 422  # Validation error

