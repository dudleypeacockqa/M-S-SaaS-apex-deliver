"""Celery tasks for document export processing."""
from __future__ import annotations

from datetime import datetime, UTC
from typing import Optional

from celery import shared_task
from sqlalchemy import select

from app.db.session import SessionLocal
from app.models.document_generation import (
    DocumentExportJob,
    DocumentExportStatus,
    GeneratedDocument,
)
from app.services.document_generation_service import DocumentGenerationService


@shared_task(name="documents.process_export_job")
def process_document_export_job(job_id: str) -> Optional[str]:
    """Process a queued document export job."""
    db = SessionLocal()
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


def enqueue_export_processing(job_id: str) -> None:
    """Queue export processing task with eager fallback."""
    try:
        process_document_export_job.delay(job_id)
    except Exception:
        # If Celery isn't configured, run synchronously
        process_document_export_job(job_id)

