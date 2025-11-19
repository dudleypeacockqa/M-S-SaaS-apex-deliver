from __future__ import annotations

import importlib
import sys
from unittest.mock import AsyncMock, patch

import pytest
from sqlalchemy.orm import Session

from app.models.email_queue import EmailQueue
from app.services.email_service import MAX_RETRY_ATTEMPTS

# Ensure Celery's shared_task decorator becomes a no-op for these unit tests
celery_module = sys.modules.get("celery")
if celery_module is not None:
    celery_module.shared_task.side_effect = (
        lambda func=None, **kwargs: func if func is not None else (lambda f: f)
    )

email_tasks = importlib.reload(importlib.import_module("app.tasks.email_tasks"))


def test_process_email_queue_task_sends_pending_messages(db_session: Session) -> None:
    pending = EmailQueue(
        to_email="queue@example.com",
        subject="Queued Message",
        template_name="test_template",
        template_data='{"user_name": "Queue"}',
        status="pending",
    )
    db_session.add(pending)
    db_session.commit()

    with patch(
        "app.services.email_service.render_template",
        new=AsyncMock(return_value={"html_content": "<p>Hi</p>", "text_content": "Hi"}),
    ), patch(
        "app.services.email_service.send_email",
        new=AsyncMock(return_value={"status": "sent"}),
    ) as send_mock:
        summary = email_tasks.process_email_queue_task(batch_size=10)

    db_session.refresh(pending)
    assert summary == {"processed": 1, "sent": 1, "failed": 0, "skipped": 0}
    assert pending.status == "sent"
    assert pending.retry_count == 1
    assert pending.error_message is None
    send_mock.assert_called_once()


def test_retry_failed_emails_task_skips_maxed_entries(db_session: Session) -> None:
    retriable = EmailQueue(
        to_email="retry@example.com",
        subject="Retry Me",
        template_name="test_template",
        template_data='{"user_name": "Retry"}',
        status="failed",
        retry_count=MAX_RETRY_ATTEMPTS - 1,
        error_message="provider unavailable",
    )
    exhausted = EmailQueue(
        to_email="skip@example.com",
        subject="Skip Me",
        template_name="test_template",
        template_data='{"user_name": "Skip"}',
        status="failed",
        retry_count=MAX_RETRY_ATTEMPTS,
        error_message="permanent failure",
    )
    db_session.add_all([retriable, exhausted])
    db_session.commit()

    render_patch = patch(
        "app.services.email_service.render_template",
        new=AsyncMock(return_value={"html_content": "<p>Hi</p>", "text_content": "Hi"}),
    )
    send_patch = patch(
        "app.services.email_service.send_email",
        new=AsyncMock(return_value={"status": "failed", "error": "provider down"}),
    )

    with render_patch, send_patch:
        summary = email_tasks.retry_failed_emails_task(batch_size=10)

    db_session.refresh(retriable)
    db_session.refresh(exhausted)

    assert summary["processed"] == 1
    assert summary["failed"] == 1
    assert summary["sent"] == 0
    assert summary["skipped"] == 1
    assert retriable.retry_count == MAX_RETRY_ATTEMPTS
    assert retriable.error_message == "provider down"
    assert exhausted.retry_count == MAX_RETRY_ATTEMPTS
    assert exhausted.error_message == "permanent failure"

