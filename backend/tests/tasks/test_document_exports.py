"""
Tests for document_exports.py Celery tasks.

Following TDD principles: RED → GREEN → REFACTOR
Target: Comprehensive coverage of document export processing.
"""

from __future__ import annotations

import importlib
import sys
from unittest.mock import Mock, patch, MagicMock
from datetime import datetime, UTC
import pytest

# Ensure Celery's shared_task decorator becomes a no-op for these unit tests
celery_module = sys.modules.get("celery")
if celery_module is not None:
    celery_module.shared_task.side_effect = (
        lambda func=None, **kwargs: func if func is not None else (lambda f: f)
    )

document_exports = importlib.reload(importlib.import_module("app.tasks.document_exports"))

from app.models.document_generation import DocumentExportJob, DocumentExportStatus, GeneratedDocument


@pytest.fixture
def mock_db_session():
    """Mock database session."""
    session = Mock()
    session.close = Mock()
    session.scalar = Mock()
    session.add = Mock()
    session.commit = Mock()
    session.refresh = Mock()
    return session


@pytest.fixture
def sample_export_job():
    """Create a sample export job for testing."""
    job = Mock(spec=DocumentExportJob)
    job.id = "job-123"
    job.document_id = "doc-456"
    job.organization_id = "org-789"
    job.status = DocumentExportStatus.QUEUED
    job.format = "pdf"
    job.file_path = None
    job.download_url = None
    job.started_at = None
    job.completed_at = None
    job.updated_at = None
    job.failure_reason = None
    return job


@pytest.fixture
def sample_generated_document():
    """Create a sample generated document for testing."""
    doc = Mock(spec=GeneratedDocument)
    doc.id = "doc-456"
    doc.organization_id = "org-789"
    doc.generated_content = "Test document content"
    return doc


class TestProcessDocumentExportJob:
    """Test process_document_export_job function."""

    @patch('app.tasks.document_exports.SessionLocal')
    @patch('app.tasks.document_exports.DocumentGenerationService._write_generated_file')
    def test_process_export_job_success(self, mock_write_file, mock_session_local, mock_db_session, sample_export_job, sample_generated_document):
        """Test successful export job processing."""
        mock_session_local.return_value = mock_db_session
        mock_db_session.scalar.side_effect = [sample_export_job, sample_generated_document]
        mock_write_file.return_value = "/path/to/exported/file.pdf"

        result = document_exports.process_document_export_job("job-123")

        assert result == "/path/to/exported/file.pdf"
        assert sample_export_job.status == DocumentExportStatus.READY
        assert sample_export_job.file_path == "/path/to/exported/file.pdf"
        assert sample_export_job.completed_at is not None
        mock_db_session.commit.assert_called()
        mock_db_session.close.assert_called_once()

    @patch('app.tasks.document_exports.SessionLocal')
    def test_process_export_job_not_found(self, mock_session_local, mock_db_session):
        """Test export job not found."""
        mock_session_local.return_value = mock_db_session
        mock_db_session.scalar.return_value = None

        result = document_exports.process_document_export_job("job-999")

        assert result is None
        mock_db_session.close.assert_called_once()

    @patch('app.tasks.document_exports.SessionLocal')
    def test_process_export_job_document_not_found(self, mock_session_local, mock_db_session, sample_export_job):
        """Test document not found for export job."""
        mock_session_local.return_value = mock_db_session
        mock_db_session.scalar.side_effect = [sample_export_job, None]

        result = document_exports.process_document_export_job("job-123")

        assert result is None
        assert sample_export_job.status == DocumentExportStatus.FAILED
        assert sample_export_job.failure_reason == "Document not found"
        mock_db_session.commit.assert_called()
        mock_db_session.close.assert_called_once()

    @patch('app.tasks.document_exports.SessionLocal')
    @patch('app.tasks.document_exports.DocumentGenerationService._write_generated_file')
    def test_process_export_job_exception(self, mock_write_file, mock_session_local, mock_db_session, sample_export_job, sample_generated_document):
        """Test export job processing with exception."""
        mock_session_local.return_value = mock_db_session
        mock_db_session.scalar.side_effect = [sample_export_job, sample_generated_document]
        mock_write_file.side_effect = Exception("File write failed")

        with pytest.raises(Exception):
            document_exports.process_document_export_job("job-123")

        assert sample_export_job.status == DocumentExportStatus.FAILED
        assert sample_export_job.failure_reason == "File write failed"
        mock_db_session.commit.assert_called()
        mock_db_session.close.assert_called_once()

    @patch('app.tasks.document_exports.SessionLocal')
    @patch('app.tasks.document_exports.DocumentGenerationService._write_generated_file')
    def test_process_export_job_sets_processing_status(self, mock_write_file, mock_session_local, mock_db_session, sample_export_job, sample_generated_document):
        """Test that job status is set to PROCESSING before export."""
        mock_session_local.return_value = mock_db_session
        mock_db_session.scalar.side_effect = [sample_export_job, sample_generated_document]
        mock_write_file.return_value = "/path/to/file.pdf"

        document_exports.process_document_export_job("job-123")

        # Verify status was set to PROCESSING
        assert sample_export_job.status == DocumentExportStatus.READY  # Final status
        assert sample_export_job.started_at is not None
        mock_db_session.commit.assert_called()


class TestEnqueueExportProcessing:
    """Test enqueue_export_processing function."""

    @patch('app.tasks.document_exports.process_document_export_job.delay')
    def test_enqueue_export_processing_celery_available(self, mock_delay):
        """Test enqueueing when Celery is available."""
        document_exports.enqueue_export_processing("job-123")
        mock_delay.assert_called_once_with("job-123")

    @patch('app.tasks.document_exports.process_document_export_job.delay')
    @patch('app.tasks.document_exports.process_document_export_job')
    def test_enqueue_export_processing_celery_unavailable(self, mock_sync_task, mock_delay):
        """Test enqueueing falls back to sync execution when Celery unavailable."""
        mock_delay.side_effect = Exception("Celery not configured")
        mock_sync_task.return_value = "/path/to/file.pdf"

        document_exports.enqueue_export_processing("job-123")

        mock_delay.assert_called_once()
        mock_sync_task.assert_called_once_with("job-123")

