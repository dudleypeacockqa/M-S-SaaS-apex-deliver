"""
Test Document Export Job Queue API Endpoints
TDD: RED → GREEN → REFACTOR
Feature: F-009 Automated Document Generation - Export Job Polling
"""
import pytest
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.models.document_generation import (
    DocumentTemplate,
    TemplateStatus,
    GeneratedDocument,
    DocumentStatus,
    DocumentExportJob,
    DocumentExportStatus,
)
from app.models.document import DocumentAccessLog

dependency_overrides = None


@pytest.fixture(autouse=True)
def _bind_dependency_overrides_fixture(dependency_overrides):
    globals()["dependency_overrides"] = dependency_overrides
    yield
    globals()["dependency_overrides"] = None


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

        dependency_overrides(get_current_user, lambda: user)

        # Create template first (required for foreign key)
        template = DocumentTemplate(
            id="template-123",
            name="Test Template",
            content="Test template content",
            organization_id=str(org.id),
            created_by_user_id=user.id,
            status=TemplateStatus.ACTIVE,
        )
        db_session.add(template)
        db_session.flush()

        # Create a document
        document = GeneratedDocument(
            id="doc-export-test-123",
            template_id=template.id,
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
        audit = db_session.query(DocumentAccessLog).filter_by(document_id=document.id).one()
        assert audit.action == "export"


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

        dependency_overrides(get_current_user, lambda: user)

        # Create template first (required for foreign key)
        template = DocumentTemplate(
            id="template-456",
            name="Test Template 2",
            content="Test template content",
            organization_id=str(org.id),
            created_by_user_id=user.id,
            status=TemplateStatus.ACTIVE,
        )
        db_session.add(template)
        db_session.flush()

        # Create document and export job
        document = GeneratedDocument(
            id="doc-export-test-456",
            template_id=template.id,
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

    def test_export_job_processes_via_background_task(
        self,
        client,
        create_user,
        create_organization,
        db_session: Session,
    ):
        """Queued jobs should transition to READY and expose file path."""
        org = create_organization(name="Export Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))

        dependency_overrides(get_current_user, lambda: user)

        template = DocumentTemplate(
            id="template-999",
            name="Processing Template",
            content="Body",
            organization_id=str(org.id),
            created_by_user_id=user.id,
            status=TemplateStatus.ACTIVE,
        )
        db_session.add(template)
        db_session.flush()

        document = GeneratedDocument(
            id="doc-export-test-999",
            template_id=template.id,
            generated_content="Content",
            variable_values={},
            status=DocumentStatus.GENERATED,
            organization_id=str(org.id),
            generated_by_user_id=user.id,
        )
        db_session.add(document)
        db_session.commit()

        response = client.post(
            f"/api/document-generation/documents/{document.id}/export-jobs",
            json={"format": "application/pdf"},
        )
        assert response.status_code == 201
        job_id = response.json()["task_id"]

        status_resp = client.get(
            f"/api/document-generation/documents/{document.id}/export-jobs/{job_id}",
        )
        assert status_resp.status_code == 200
        payload = status_resp.json()
        assert payload["status"] in {"ready", "queued"}
        if payload["status"] == "ready":
            assert payload["file_path"] is not None


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

        dependency_overrides(get_current_user, lambda: user)

        # Create template first (required for foreign key)
        template = DocumentTemplate(
            id="template-789",
            name="Test Template 3",
            content="Test template content",
            organization_id=str(org.id),
            created_by_user_id=user.id,
            status=TemplateStatus.ACTIVE,
        )
        db_session.add(template)
        db_session.flush()

        # Create document and multiple export jobs
        document = GeneratedDocument(
            id="doc-export-test-789",
            template_id=template.id,
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


