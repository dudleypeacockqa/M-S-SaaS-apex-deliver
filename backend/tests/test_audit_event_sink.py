"""Unit tests for audit event sink telemetry."""
from __future__ import annotations

from typing import Any

from httpx import Response
from pytest import MonkeyPatch

from app.services.audit_event_sink import emit_audit_event, set_audit_event_publisher
from app.core.config import settings


def test_emit_audit_event_uses_custom_publisher(monkeypatch: MonkeyPatch):
    captured: list[dict[str, Any]] = []
    set_audit_event_publisher(captured.append)
    try:
        emit_audit_event("resource_scope_violation", actor_user_id="user-1")
    finally:
        set_audit_event_publisher(None)

    assert captured
    assert captured[0]["action"] == "resource_scope_violation"
    assert captured[0]["actor_user_id"] == "user-1"


def test_emit_audit_event_posts_to_webhook(monkeypatch: MonkeyPatch):
    events: list[dict[str, Any]] = []

    def fake_post(url: str, json: dict[str, Any], timeout: float) -> Response:
        events.append({"url": url, "payload": json, "timeout": timeout})

        class _DummyResponse:
            def raise_for_status(self) -> None:
                return None

        return _DummyResponse()  # type: ignore[return-value]

    monkeypatch.setattr(settings, "audit_event_webhook_url", "https://example.com/audit")
    monkeypatch.setattr("app.services.audit_event_sink.httpx.post", fake_post)
    set_audit_event_publisher(None)

    emit_audit_event(
        "resource_scope_violation",
        actor_user_id="user-123",
        metadata={"resource_type": "document", "resource_id": "doc-1"},
    )

    assert events
    payload = events[0]["payload"]
    assert payload["metadata"]["resource_type"] == "document"
    assert events[0]["url"] == "https://example.com/audit"
