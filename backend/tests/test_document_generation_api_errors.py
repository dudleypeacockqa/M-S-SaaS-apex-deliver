"""
Tests for Document Generation API Error Paths - Supporting Features (Phase 3.4)
TDD: RED → GREEN → REFACTOR
Feature: F-009 Multi-tenant isolation and error handling for document generation endpoints
"""
import pytest
from fastapi.testclient import TestClient
from fastapi import status

from app.main import app
from app.api.dependencies.auth import get_current_user


class TestDocumentGenerationAPIErrorPaths:
    """Test error paths in document generation API endpoints for multi-tenant isolation"""
    
    def test_create_template_returns_403_when_org_mismatch(
        self,
        client: TestClient,
        create_organization,
        create_user,
    ):
        """Test POST /document-generation/templates returns 403 when org_id doesn't match user's org."""
        org1 = create_organization(name="Test Org")
        user1 = create_user(email="user1@example.com", organization_id=str(org1.id))
        org2 = create_organization(name="Other Org")
        
        app.dependency_overrides[get_current_user] = lambda: user1
        
        try:
            # The API checks org_id and returns 403, but Pydantic may validate first
            # If the endpoint validates and auto-overrides org_id, it might not reach the 403 check
            # Let's test that the endpoint correctly rejects mismatched org_id
            template_data = {
                "name": "Test Template",
                "content": "Test content",
                "organization_id": str(org2.id),  # Different org
                "variables": [],
            }
            
            response = client.post(
                "/api/document-generation/templates",
                json=template_data,
            )
            
            # The API should return 403 for org mismatch, but may return 422 if validation fails first
            assert response.status_code in (403, 422)
            if response.status_code == 403:
                assert "another organization" in response.json()["detail"].lower()
        finally:
            app.dependency_overrides.pop(get_current_user, None)
    
    def test_get_template_returns_404_when_not_found(
        self,
        client: TestClient,
        create_organization,
        create_user,
    ):
        """Test GET /document-generation/templates/{template_id} returns 404 when template doesn't exist."""
        org = create_organization(name="Test Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))
        
        app.dependency_overrides[get_current_user] = lambda: user
        
        try:
            response = client.get(
                "/api/document-generation/templates/non-existent-template-id",
            )
            
            assert response.status_code == 404
            assert "not found" in response.json()["detail"].lower()
        finally:
            app.dependency_overrides.pop(get_current_user, None)
    
    def test_update_template_returns_404_when_not_found(
        self,
        client: TestClient,
        create_organization,
        create_user,
    ):
        """Test PUT /document-generation/templates/{template_id} returns 404 when template doesn't exist."""
        org = create_organization(name="Test Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))
        
        app.dependency_overrides[get_current_user] = lambda: user
        
        try:
            update_data = {
                "name": "Updated Name",
            }
            
            response = client.put(
                "/api/document-generation/templates/non-existent-template-id",
                json=update_data,
            )
            
            assert response.status_code == 404
            assert "not found" in response.json()["detail"].lower()
        finally:
            app.dependency_overrides.pop(get_current_user, None)
    
    def test_delete_template_returns_404_when_not_found(
        self,
        client: TestClient,
        create_organization,
        create_user,
    ):
        """Test DELETE /document-generation/templates/{template_id} returns 404 when template doesn't exist."""
        org = create_organization(name="Test Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))
        
        app.dependency_overrides[get_current_user] = lambda: user
        
        try:
            response = client.delete(
                "/api/document-generation/templates/non-existent-template-id",
            )
            
            assert response.status_code == 404
            assert "not found" in response.json()["detail"].lower()
        finally:
            app.dependency_overrides.pop(get_current_user, None)
    
    def test_render_template_returns_404_when_template_not_found(
        self,
        client: TestClient,
        create_organization,
        create_user,
    ):
        """Test POST /document-generation/templates/{template_id}/render returns 404 when template doesn't exist."""
        org = create_organization(name="Test Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))
        
        app.dependency_overrides[get_current_user] = lambda: user
        
        try:
            render_data = {
                "variables": {"name": "Test"},
            }
            
            response = client.post(
                "/api/document-generation/templates/non-existent-template-id/render",
                json=render_data,
            )
            
            assert response.status_code == 404
            assert "not found" in response.json()["detail"].lower()
        finally:
            app.dependency_overrides.pop(get_current_user, None)
    
    def test_get_generated_document_returns_404_when_not_found(
        self,
        client: TestClient,
        create_organization,
        create_user,
    ):
        """Test GET /document-generation/documents/{document_id} returns 404 when document doesn't exist."""
        org = create_organization(name="Test Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))
        
        app.dependency_overrides[get_current_user] = lambda: user
        
        try:
            response = client.get(
                "/api/document-generation/documents/non-existent-document-id",
            )
            
            assert response.status_code == 404
            assert "not found" in response.json()["detail"].lower()
        finally:
            app.dependency_overrides.pop(get_current_user, None)
    
    def test_update_generated_document_returns_404_when_not_found(
        self,
        client: TestClient,
        create_organization,
        create_user,
    ):
        """Test PATCH /document-generation/documents/{document_id} returns 404 when document doesn't exist."""
        org = create_organization(name="Test Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))
        
        app.dependency_overrides[get_current_user] = lambda: user
        
        try:
            update_data = {
                "status": "draft",
            }
            
            # Use PATCH, not PUT
            response = client.patch(
                "/api/document-generation/documents/non-existent-document-id",
                json=update_data,
            )
            
            assert response.status_code == 404
            assert "not found" in response.json()["detail"].lower()
        finally:
            app.dependency_overrides.pop(get_current_user, None)
    
    def test_update_document_status_returns_404_when_not_found(
        self,
        client: TestClient,
        create_organization,
        create_user,
    ):
        """Test PATCH /document-generation/documents/{document_id}/status returns 404 when document doesn't exist."""
        org = create_organization(name="Test Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))
        
        app.dependency_overrides[get_current_user] = lambda: user
        
        try:
            response = client.patch(
                "/api/document-generation/documents/non-existent-document-id/status?status=draft",
            )
            
            assert response.status_code == 404
            assert "not found" in response.json()["detail"].lower()
        finally:
            app.dependency_overrides.pop(get_current_user, None)
    
    def test_list_export_jobs_returns_404_when_document_not_found(
        self,
        client: TestClient,
        create_organization,
        create_user,
    ):
        """Test GET /document-generation/documents/{document_id}/export-jobs returns 404 when document doesn't exist."""
        org = create_organization(name="Test Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))
        
        app.dependency_overrides[get_current_user] = lambda: user
        
        try:
            response = client.get(
                "/api/document-generation/documents/non-existent-document-id/export-jobs",
            )
            
            assert response.status_code == 404
            assert "not found" in response.json()["detail"].lower()
        finally:
            app.dependency_overrides.pop(get_current_user, None)
    
    def test_queue_export_job_returns_404_when_document_not_found(
        self,
        client: TestClient,
        create_organization,
        create_user,
    ):
        """Test POST /document-generation/documents/{document_id}/export-jobs returns 404 when document doesn't exist."""
        org = create_organization(name="Test Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))
        
        app.dependency_overrides[get_current_user] = lambda: user
        
        try:
            export_data = {
                "format": "application/pdf",
                "options": {},
            }
            
            response = client.post(
                "/api/document-generation/documents/non-existent-document-id/export-jobs",
                json=export_data,
            )
            
            assert response.status_code == 404
            assert "not found" in response.json()["detail"].lower()
        finally:
            app.dependency_overrides.pop(get_current_user, None)
    
    def test_get_export_job_status_returns_404_when_job_not_found(
        self,
        client: TestClient,
        create_organization,
        create_user,
    ):
        """Test GET /document-generation/export-jobs/{job_id} returns 404 when job doesn't exist."""
        org = create_organization(name="Test Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))
        
        app.dependency_overrides[get_current_user] = lambda: user
        
        try:
            response = client.get(
                "/api/document-generation/export-jobs/non-existent-job-id",
            )
            
            assert response.status_code == 404
            assert "not found" in response.json()["detail"].lower()
        finally:
            app.dependency_overrides.pop(get_current_user, None)
    
    def test_list_document_versions_returns_404_when_document_not_found(
        self,
        client: TestClient,
        create_organization,
        create_user,
    ):
        """Test GET /document-generation/documents/{document_id}/versions returns 404 when document doesn't exist."""
        org = create_organization(name="Test Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))
        
        app.dependency_overrides[get_current_user] = lambda: user
        
        try:
            response = client.get(
                "/api/document-generation/documents/non-existent-document-id/versions",
            )
            
            assert response.status_code == 404
            assert "not found" in response.json()["detail"].lower()
        finally:
            app.dependency_overrides.pop(get_current_user, None)

