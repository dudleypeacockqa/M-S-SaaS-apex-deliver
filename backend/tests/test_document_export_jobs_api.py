"""
Test Document Export Job Queue API Endpoints
TDD: RED → GREEN → REFACTOR
Feature: F-009 Automated Document Generation - Export Job Polling
"""
import pytest
from sqlalchemy.orm import Session

from app.models.document_generation import (
    GeneratedDocument,
    DocumentStatus,
    DocumentExportJob,
    DocumentExportStatus,
)


class TestDocumentExportJobEndpoints:
    """Test document export job queue endpoints (TDD RED phase)"""

    def test_queue_export_job(
        self,
        client,
        create_user,
        create_organization,
        db_session: Session,
    ):
        """RED: Test queueing an export job returns job ID and status"""
        org = create_organization(name="Export Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))

        from app.api.dependencies.auth import get_current_user
        from app.main import app
        app.dependency_overrides[get_current_user] = lambda: user

        # Create a document first
        document = GeneratedDocument(
            id="doc-export-test-123",
            template_id="template-123",
            generated_content="Test content",
            variable_values={},
            status=DocumentStatus.DRAFT,
            organization_id=str(org.id),
            generated_by_user_id=user.id,
        )
        db_session.add(document)
        db_session.commit()

        export_request = {
            "format": "application/pdf",
            "options": {"margin": 20},
        }

        response = client.post(
            f"/api/document-generation/documents/{document.id}/export-jobs",
            json=export_request,
        )

        assert response.status_code == 201
        data = response.json()
        assert "task_id" in data
        assert data["status"] == "queued"
        assert data["format"] == "application/pdf"

        app.dependency_overrides.pop(get_current_user, None)

    def test_get_export_job_status(
        self,
        client,
        create_user,
        create_organization,
        db_session: Session,
    ):
        """RED: Test getting export job status"""
        org = create_organization(name="Export Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))

        from app.api.dependencies.auth import get_current_user
        from app.main import app
        app.dependency_overrides[get_current_user] = lambda: user

        # Create document and export job
        document = GeneratedDocument(
            id="doc-export-test-456",
            template_id="template-123",
            generated_content="Test content",
            variable_values={},
            status=DocumentStatus.DRAFT,
            organization_id=str(org.id),
            generated_by_user_id=user.id,
        )
        db_session.add(document)
        db_session.commit()

        export_job = DocumentExportJob(
            id="job-test-123",
            document_id=document.id,
            organization_id=str(org.id),
            requested_by_user_id=user.id,
            format="application/pdf",
            status=DocumentExportStatus.PROCESSING,
        )
        db_session.add(export_job)
        db_session.commit()

        response = client.get(
            f"/api/document-generation/documents/{document.id}/export-jobs/{export_job.id}",
        )

        assert response.status_code == 200
        data = response.json()
        assert data["task_id"] == str(export_job.id)
        assert data["status"] == "processing"
        assert data["format"] == "application/pdf"

        app.dependency_overrides.pop(get_current_user, None)

    def test_list_export_jobs(
        self,
        client,
        create_user,
        create_organization,
        db_session: Session,
    ):
        """RED: Test listing export jobs for a document"""
        org = create_organization(name="Export Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))

        from app.api.dependencies.auth import get_current_user
        from app.main import app
        app.dependency_overrides[get_current_user] = lambda: user

        # Create document and multiple export jobs
        document = GeneratedDocument(
            id="doc-export-test-789",
            template_id="template-123",
            generated_content="Test content",
            variable_values={},
            status=DocumentStatus.DRAFT,
            organization_id=str(org.id),
            generated_by_user_id=user.id,
        )
        db_session.add(document)
        db_session.commit()

        job1 = DocumentExportJob(
            id="job-test-1",
            document_id=document.id,
            organization_id=str(org.id),
            requested_by_user_id=user.id,
            format="application/pdf",
            status=DocumentExportStatus.READY,
        )
        job2 = DocumentExportJob(
            id="job-test-2",
            document_id=document.id,
            organization_id=str(org.id),
            requested_by_user_id=user.id,
            format="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            status=DocumentExportStatus.QUEUED,
        )
        db_session.add_all([job1, job2])
        db_session.commit()

        response = client.get(
            f"/api/document-generation/documents/{document.id}/export-jobs",
        )

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 2
        job_ids = [job["task_id"] for job in data]
        assert "job-test-1" in job_ids
        assert "job-test-2" in job_ids

        app.dependency_overrides.pop(get_current_user, None)

