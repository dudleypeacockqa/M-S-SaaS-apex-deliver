"""Event notification helpers (DEV-020)."""
from __future__ import annotations

from typing import Dict, Any
from datetime import datetime
import logging

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)
SENDGRID_URL = "https://api.sendgrid.com/v3/mail/send"


def _format_event_datetime(value: str | None) -> str:
    """Return a friendly event datetime string."""
    if not value:
        return ""
    try:
        sanitized = value.replace("Z", "+00:00")
        dt = datetime.fromisoformat(sanitized)
        return dt.strftime("%B %d, %Y at %I:%M %p %Z").strip()
    except ValueError:
        return value


def send_registration_confirmation_email(email_payload: Dict[str, Any]) -> None:
    """Send a registration confirmation email via SendGrid."""
    api_key = settings.sendgrid_api_key
    if not api_key:
        logger.warning(
            "Skipping registration confirmation email for %s; SendGrid not configured",
            email_payload.get("attendee_email"),
        )
        return

    attendee_email = email_payload.get("attendee_email")
    if not attendee_email:
        logger.warning("Registration confirmation payload missing attendee_email")
        return

    attendee_name = email_payload.get("attendee_name") or "there"
    event_name = email_payload.get("event_name") or "your event"
    event_start = _format_event_datetime(email_payload.get("event_start"))
    event_location = email_payload.get("event_location") or "Online"
    ticket_name = email_payload.get("ticket_name") or "General Admission"
    payment_amount = email_payload.get("payment_amount") or "0.00"
    currency = (email_payload.get("currency") or "USD").upper()

    subject = f"You're registered for {event_name}!"
    text_lines = [
        f"Hi {attendee_name},",
        "",
        f"You're confirmed for {event_name}.",
    ]
    if event_start:
        text_lines.append(f"Date: {event_start}")
    text_lines.append(f"Location: {event_location}")
    text_lines.append(f"Ticket: {ticket_name}")
    if payment_amount:
        text_lines.append(f"Amount: {currency} {payment_amount}")
    text_lines.extend([
        "",
        "Save this email for your records. We'll send reminders as the event approaches.",
        "",
        "Best regards,",
        settings.app_name,
    ])
    text_content = "\n".join(text_lines)

    html_content = f"""
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <p>Hi {attendee_name},</p>
          <p>You're confirmed for <strong>{event_name}</strong>.</p>
          <ul>
            <li><strong>Date:</strong> {event_start or 'TBA'}</li>
            <li><strong>Location:</strong> {event_location}</li>
            <li><strong>Ticket:</strong> {ticket_name}</li>
            <li><strong>Amount:</strong> {currency} {payment_amount}</li>
          </ul>
          <p>Save this email for your records. We'll send reminders as the event approaches.</p>
          <p>Best regards,<br/>{settings.app_name}</p>
        </div>
    """

    body = {
        "personalizations": [
            {
                "to": [{"email": attendee_email, "name": attendee_name}],
                "subject": subject,
            }
        ],
        "from": {
            "email": settings.sendgrid_from_email,
            "name": settings.sendgrid_from_name,
        },
        "content": [
            {"type": "text/plain", "value": text_content},
            {"type": "text/html", "value": html_content},
        ],
    }

    try:
        response = httpx.post(
            SENDGRID_URL,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json=body,
            timeout=10,
        )
        response.raise_for_status()
        logger.info(
            "Registration confirmation email sent to %s for %s",
            attendee_email,
            event_name,
        )
    except httpx.HTTPError as exc:
        logger.error(
            "Failed to send registration confirmation email to %s: %s",
            attendee_email,
            exc,
        )
