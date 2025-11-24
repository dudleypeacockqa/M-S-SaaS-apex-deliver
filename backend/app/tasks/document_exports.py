"""Celery tasks for document export processing."""
from __future__ import annotations

from datetime import datetime, UTC
from typing import Optional, Callable, TypeVar

from celery import shared_task
from sqlalchemy import select

from app.db import session as session_module
from app.models.document_generation import (
    DocumentExportJob,
    DocumentExportStatus,
    GeneratedDocument,
)
from app.services.document_generation_service import DocumentGenerationService


TaskFunc = TypeVar("TaskFunc", bound=Callable)

SessionLocal = None  # legacy alias for existing tests to override


def _ensure_task_delay(task: TaskFunc) -> TaskFunc:
    """
    Guarantee a `.delay` attribute even when Celery's decorator is stubbed.

    Tests replace `celery.shared_task` with a no-op, so the decorated function
    no longer exposes `.delay`. Attaching a shim allows code paths that expect
    celery's API to keep working (e.g., enqueue_export_processing).
    """
    if not hasattr(task, "delay"):
        setattr(task, "delay", lambda *args, **kwargs: task(*args, **kwargs))
    return task


def _create_db_session():
    """
    Return a database session using the latest SessionLocal factory.

    During tests the session factory is swapped on the fly; relying on the
    imported symbol alone would capture the pre-fixture value (often None).
    This helper always pulls the current factory from the session module and
    initializes the engine if necessary.
    """
    session_factory = SessionLocal or session_module.SessionLocal
    if session_factory is None:
        session_module.init_engine()
        session_factory = session_module.SessionLocal
    if session_factory is None:
        raise RuntimeError("Database session factory is not initialized")
    return session_factory()


@shared_task(name="documents.process_export_job")
def process_document_export_job(job_id: str) -> Optional[str]:
    """Process a queued document export job."""
    db = _create_db_session()
    try:
        job = db.scalar(
            select(DocumentExportJob).where(DocumentExportJob.id == job_id)
        )
        if not job:
            return None

        document = db.scalar(
            select(GeneratedDocument).where(
                GeneratedDocument.id == job.document_id,
                GeneratedDocument.organization_id == job.organization_id,
            )
        )
        if not document:
            job.status = DocumentExportStatus.FAILED
            job.failure_reason = "Document not found"
            db.commit()
            return None

        job.status = DocumentExportStatus.PROCESSING
        job.started_at = datetime.now(UTC)
        db.commit()
        db.refresh(job)

        file_path = DocumentGenerationService._write_generated_file(  # pylint: disable=protected-access
            organization_id=str(job.organization_id),
            document_id=str(document.id),
            content=document.generated_content,
            file_format=job.format,
        )

        job.status = DocumentExportStatus.READY
        job.file_path = file_path
        job.download_url = file_path  # Placeholder until signed URLs implemented
        job.completed_at = datetime.now(UTC)
        job.updated_at = job.completed_at
        db.commit()
        return file_path
    except Exception as exc:  # pragma: no cover - logged for observability
        if "job" in locals() and job:  # type: ignore[has-type]
            job.status = DocumentExportStatus.FAILED
            job.failure_reason = str(exc)
            job.updated_at = datetime.now(UTC)
            db.commit()
        raise
    finally:
        db.close()


_ensure_task_delay(process_document_export_job)


def enqueue_export_processing(job_id: str) -> None:
    """Queue export processing task with eager fallback."""
    try:
        process_document_export_job.delay(job_id)
    except Exception:
        # If Celery isn't configured, run synchronously
        process_document_export_job(job_id)

