"""Tests for event notification helpers (DEV-020)."""
from __future__ import annotations

import httpx
import types
from typing import Dict

from app.services import event_notification_service as notification_service
from app.core.config import settings


def test_send_registration_confirmation_email_no_sendgrid(monkeypatch):
    """Should skip sending when SendGrid is not configured."""
    called = {}

    def fake_post(*_, **__):  # pragma: no cover - should not be called
        called["hit"] = True

    monkeypatch.setattr(httpx, "post", fake_post)
    monkeypatch.setattr(settings, "sendgrid_api_key", "")

    notification_service.send_registration_confirmation_email(
        {
            "attendee_email": "attendee@example.com",
            "attendee_name": "Test Attendee",
            "event_name": "Test Event",
            "event_start": "2025-12-01T09:00:00Z",
            "event_location": "Virtual",
            "ticket_name": "VIP",
            "payment_amount": "199.00",
            "currency": "GBP",
        }
    )

    assert "hit" not in called, "SendGrid should not be called without API key"


def test_send_registration_confirmation_email_sends_payload(monkeypatch):
    """Should call SendGrid when configured and include expected payload."""
    captured: Dict[str, Dict] = {}

    class DummyResponse:
        def raise_for_status(self):
            return None

    def fake_post(url, headers=None, json=None, timeout=None):
        captured["url"] = url
        captured["headers"] = headers
        captured["json"] = json
        captured["timeout"] = timeout
        return DummyResponse()

    monkeypatch.setattr(httpx, "post", fake_post)
    monkeypatch.setattr(settings, "sendgrid_api_key", "sg_test_key")
    monkeypatch.setattr(settings, "sendgrid_from_email", "noreply@example.com")
    monkeypatch.setattr(settings, "sendgrid_from_name", "M&A Platform")

    payload = {
        "attendee_email": "attendee@example.com",
        "attendee_name": "Test Attendee",
        "event_name": "Test Event",
        "event_start": "2025-12-01T09:00:00Z",
        "event_location": "Virtual",
        "ticket_name": "VIP",
        "payment_amount": "199.00",
        "currency": "GBP",
    }

    notification_service.send_registration_confirmation_email(payload)

    assert captured["url"] == "https://api.sendgrid.com/v3/mail/send"
    assert captured["headers"]["Authorization"] == "Bearer sg_test_key"
    body = captured["json"]
    assert body["personalizations"][0]["to"][0]["email"] == "attendee@example.com"
    assert "Test Event" in body["personalizations"][0]["subject"]
    assert "attendee@example.com" in body["content"][0]["value"]
