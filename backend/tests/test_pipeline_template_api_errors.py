"""
Tests for Pipeline Template API Error Paths - Phase 3.5
TDD: RED → GREEN → REFACTOR
Feature: Multi-tenant isolation and error handling for pipeline template endpoints
"""
import pytest
from contextlib import contextmanager
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.models.pipeline_template import PipelineTemplate


class TestPipelineTemplateAPIErrorPaths:
    """Test error paths in pipeline template API endpoints for multi-tenant isolation"""
    
    def test_get_template_returns_404_when_not_found(
        self,
        client: TestClient,
        create_organization,
        create_user,
        dependency_overrides,
    ):
        """Test GET /pipeline-templates/{template_id} returns 404 when template doesn't exist."""
        org = create_organization(name="Test Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))

        dependency_overrides(get_current_user, lambda: user)
        response = client.get(
            "/api/pipeline-templates/non-existent-template-id",
        )

        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()

    
    def test_update_template_returns_404_when_not_found(
        self,
        client: TestClient,
        create_organization,
        create_user,
        dependency_overrides,
    ):
        """Test PUT /pipeline-templates/{template_id} returns 404 when template doesn't exist."""
        org = create_organization(name="Test Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))

        dependency_overrides(get_current_user, lambda: user)
        update_data = {
            "name": "Updated Name",
            "description": "Updated description",
            "is_default": False,
            "stages": [],
        }

        response = client.put(
            "/api/pipeline-templates/non-existent-template-id",
            json=update_data,
        )

        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()

    
    def test_delete_template_returns_404_when_not_found(
        self,
        client: TestClient,
        create_organization,
        create_user,
        dependency_overrides,
    ):
        """Test DELETE /pipeline-templates/{template_id} returns 404 when template doesn't exist."""
        org = create_organization(name="Test Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))

        dependency_overrides(get_current_user, lambda: user)
        response = client.delete(
            "/api/pipeline-templates/non-existent-template-id",
        )

        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()

    
    def test_get_template_returns_404_when_from_other_org(
        self,
        client: TestClient,
        create_organization,
        create_user,
        db_session: Session,
        dependency_overrides,
    ):
        """Test GET /pipeline-templates/{template_id} returns 404 when template belongs to another organization."""
        org1 = create_organization(name="Org 1")
        user1 = create_user(email="user1@example.com", organization_id=str(org1.id))

        org2 = create_organization(name="Org 2")
        user2 = create_user(email="user2@example.com", organization_id=str(org2.id))

        # Create template in org2
        template = PipelineTemplate(
            organization_id=str(org2.id),
            name="Org 2 Template",
            is_default=False,
        )
        db_session.add(template)
        db_session.commit()
        db_session.refresh(template)

        # Try to access from org1 user
        dependency_overrides(get_current_user, lambda: user1)
        response = client.get(
            f"/api/pipeline-templates/{template.id}",
        )

        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()

    
    def test_update_template_returns_404_when_from_other_org(
        self,
        client: TestClient,
        create_organization,
        create_user,
        db_session: Session,
        dependency_overrides,
    ):
        """Test PUT /pipeline-templates/{template_id} returns 404 when template belongs to another organization."""
        org1 = create_organization(name="Org 1")
        user1 = create_user(email="user1@example.com", organization_id=str(org1.id))

        org2 = create_organization(name="Org 2")
        user2 = create_user(email="user2@example.com", organization_id=str(org2.id))

        # Create template in org2
        template = PipelineTemplate(
            organization_id=str(org2.id),
            name="Org 2 Template",
            is_default=False,
        )
        db_session.add(template)
        db_session.commit()
        db_session.refresh(template)

        # Try to update from org1 user
        dependency_overrides(get_current_user, lambda: user1)
        update_data = {
            "name": "Hacked Name",
            "description": "Hacked description",
            "is_default": False,
            "stages": [],
        }

        response = client.put(
            f"/api/pipeline-templates/{template.id}",
            json=update_data,
        )

        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()

    
    def test_delete_template_returns_404_when_from_other_org(
        self,
        client: TestClient,
        create_organization,
        create_user,
        db_session: Session,
        dependency_overrides,
    ):
        """Test DELETE /pipeline-templates/{template_id} returns 404 when template belongs to another organization."""
        org1 = create_organization(name="Org 1")
        user1 = create_user(email="user1@example.com", organization_id=str(org1.id))

        org2 = create_organization(name="Org 2")
        user2 = create_user(email="user2@example.com", organization_id=str(org2.id))

        # Create template in org2
        template = PipelineTemplate(
            organization_id=str(org2.id),
            name="Org 2 Template",
            is_default=False,
        )
        db_session.add(template)
        db_session.commit()
        db_session.refresh(template)

        # Try to delete from org1 user
        dependency_overrides(get_current_user, lambda: user1)
        response = client.delete(
            f"/api/pipeline-templates/{template.id}",
        )

        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()

    
    def test_list_templates_only_shows_own_org(
        self,
        client: TestClient,
        create_organization,
        create_user,
        db_session: Session,
        dependency_overrides,
    ):
        """Test GET /pipeline-templates only returns templates from user's organization."""
        org1 = create_organization(name="Org 1")
        user1 = create_user(email="user1@example.com", organization_id=str(org1.id))

        org2 = create_organization(name="Org 2")
        user2 = create_user(email="user2@example.com", organization_id=str(org2.id))

        # Create templates in both orgs
        template1 = PipelineTemplate(
            organization_id=str(org1.id),
            name="Org 1 Template",
            is_default=False,
        )
        template2 = PipelineTemplate(
            organization_id=str(org2.id),
            name="Org 2 Template",
            is_default=False,
        )
        db_session.add_all([template1, template2])
        db_session.commit()

        # List from org1 user
        dependency_overrides(get_current_user, lambda: user1)
        response = client.get("/api/pipeline-templates")

        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["name"] == "Org 1 Template"
        assert data[0]["organization_id"] == str(org1.id)


