"""Email service implementation (DEV-020).

Provides outbound email sending, template rendering, and queue helpers that
back the tests in `backend/tests/test_email_service.py`.
"""
from __future__ import annotations

import json
import logging
import asyncio
import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Optional

import httpx
from sqlalchemy.orm import Session

from app.models.email_queue import EmailQueue

logger = logging.getLogger(__name__)


class EmailServiceError(Exception):
    """Raised when the email service fails."""


EMAIL_TEMPLATES_DIR = Path(__file__).resolve().parent.parent / "templates" / "emails"
MAX_RETRY_ATTEMPTS = 3


async def send_email(
    *,
    to_email: str,
    subject: str,
    html_content: str,
    text_content: Optional[str] = None,
) -> Dict[str, Any]:
    """Send an email via SendGrid/Resend (stubbed for TDD)."""

    api_key = os.getenv("SENDGRID_API_KEY") or os.getenv("RESEND_API_KEY")
    api_url = os.getenv("EMAIL_PROVIDER_URL", "https://api.sendgrid.com/v3/mail/send")

    payload = {
        "personalizations": [
            {
                "to": [{"email": to_email}],
                "subject": subject,
            }
        ],
        "from": {"email": "notifications@apexdeliver.com", "name": "ApexDeliver"},
        "content": [
            {"type": "text/html", "value": html_content},
        ],
    }

    if text_content:
        payload["content"].append({"type": "text/plain", "value": text_content})

    headers = {
        "Content-Type": "application/json",
    }
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"

    try:
        response = await asyncio.get_running_loop().run_in_executor(None, lambda: httpx.post(api_url, headers=headers, json=payload, timeout=10))
        response.raise_for_status()
        return {
            "status": "sent",
            "to_email": to_email,
            "subject": subject,
            "provider_status": response.status_code,
        }
    except Exception as exc:  # pragma: no cover
        logger.exception("Failed to send email", exc_info=exc)
        return {
            "status": "failed",
            "error": str(exc),
            "to_email": to_email,
            "subject": subject,
        }


async def render_template(*, template_name: str, template_data: Dict[str, Any]) -> Dict[str, str]:
    """Render an email template from disk using naive replacement."""

    template_path_html = EMAIL_TEMPLATES_DIR / f"{template_name}.html"
    template_path_txt = EMAIL_TEMPLATES_DIR / f"{template_name}.txt"

    if not template_path_html.exists():
        raise ValueError("Template not found")

    html_content = template_path_html.read_text(encoding="utf-8")
    text_content = template_path_txt.read_text(encoding="utf-8") if template_path_txt.exists() else ""

    template_dict: Dict[str, Any]
    if isinstance(template_data, str):
        template_dict = json.loads(template_data) if template_data else {}
    else:
        template_dict = template_data or {}

    def apply(template: str) -> str:
        rendered = template
        for key, value in template_dict.items():
            # Replace {{ { key } }} pattern (with spaces)
            # Need to match literal: {{ { event_name } }}
            pattern = "{{ { " + key + " } }}"
            rendered = rendered.replace(pattern, str(value))
        return rendered

    return {
        "html_content": apply(html_content),
        "text_content": apply(text_content),
    }


def queue_email(
    *,
    db: Session,
    to_email: str,
    subject: str,
    template_name: str,
    template_data: Dict[str, Any],
) -> Dict[str, Any]:
    """Queue an email for asynchronous sending.
    
    Note: This function is synchronous as it only performs database operations.
    The actual email sending happens asynchronously via Celery tasks.
    """

    queued_email = EmailQueue(
        to_email=to_email,
        subject=subject,
        template_name=template_name,
        status="pending",
    )
    if isinstance(template_data, str):
        queued_email.template_data = template_data
    else:
        queued_email.set_template_data(template_data)
    db.add(queued_email)
    db.commit()
    db.refresh(queued_email)

    return {
        "status": "queued",
        "email_id": str(queued_email.id),
    }


async def retry_failed_email(*, db: Session, email_id: str) -> Dict[str, Any]:
    """Retry a failed email by re-rendering and re-sending."""

    email = db.query(EmailQueue).filter(EmailQueue.id == email_id).first()
    if not email:
        raise ValueError("Email not found")

    if email.retry_count >= MAX_RETRY_ATTEMPTS:
        raise ValueError("Max retries exceeded")

    rendered = await render_template(
        template_name=email.template_name,
        template_data=email.get_template_data(),
    )
    result = await send_email(
        to_email=email.to_email,
        subject=email.subject,
        html_content=rendered["html_content"],
        text_content=rendered.get("text_content"),
    )

    email.retry_count += 1
    email.updated_at = datetime.now(timezone.utc)
    email.status = result["status"]
    if result["status"] == "failed":
        email.error_message = result.get("error")
    else:
        email.sent_at = datetime.now(timezone.utc)
    db.add(email)
    db.commit()

    return result

