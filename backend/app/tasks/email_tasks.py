"""Celery tasks for processing the email queue."""
from __future__ import annotations

import asyncio
from typing import Dict, List

from celery import shared_task
from sqlalchemy.orm import Session

from app.db import session as session_module
from app.models.email_queue import EmailQueue
from app.services.email_service import MAX_RETRY_ATTEMPTS, retry_failed_email


def _get_session() -> Session:
    """Create a database session using the latest SessionLocal factory."""

    session_factory = session_module.SessionLocal
    if session_factory is None:
        from app.core.database import init_engine

        init_engine()
        session_factory = session_module.SessionLocal

    if session_factory is None:
        raise RuntimeError("Database session factory is not initialized")

    return session_factory()


def _run_async(coro):
    """Execute an async coroutine within a fresh event loop."""

    try:
        return asyncio.run(coro)
    except RuntimeError:
        loop = asyncio.new_event_loop()
        try:
            return loop.run_until_complete(coro)
        finally:
            loop.close()


def _deliver_batch(db: Session, emails: List[EmailQueue]) -> Dict[str, int]:
    """Process a list of queued emails and summarize the outcomes."""

    summary = {"processed": 0, "sent": 0, "failed": 0, "skipped": 0}

    for email in emails:
        if email.retry_count >= MAX_RETRY_ATTEMPTS:
            summary["skipped"] += 1
            continue

        summary["processed"] += 1
        try:
            result = _run_async(retry_failed_email(db=db, email_id=email.id))
        except ValueError:
            summary["skipped"] += 1
            continue

        if result.get("status") == "sent":
            summary["sent"] += 1
        else:
            summary["failed"] += 1

    return summary


@shared_task(name="emails.process_queue")
def process_email_queue_task(batch_size: int = 50) -> Dict[str, int]:
    """Send pending queued emails in FIFO order."""

    db = _get_session()
    try:
        pending_emails = (
            db.query(EmailQueue)
            .filter(EmailQueue.status == "pending")
            .order_by(EmailQueue.created_at)
            .limit(batch_size)
            .all()
        )
        return _deliver_batch(db, pending_emails)
    finally:
        db.close()


@shared_task(name="emails.retry_failed")
def retry_failed_emails_task(batch_size: int = 50) -> Dict[str, int]:
    """Retry previously failed emails respecting the max retry threshold."""

    db = _get_session()
    try:
        failed_emails = (
            db.query(EmailQueue)
            .filter(EmailQueue.status == "failed")
            .order_by(EmailQueue.updated_at)
            .limit(batch_size)
            .all()
        )
        return _deliver_batch(db, failed_emails)
    finally:
        db.close()



