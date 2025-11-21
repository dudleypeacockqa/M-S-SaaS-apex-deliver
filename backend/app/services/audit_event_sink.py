"""Lightweight sink for emitting audit events to monitoring pipelines."""
from __future__ import annotations

import json
import logging
from datetime import datetime, timezone
from typing import Any, Callable, Dict, Optional

import httpx

from app.core.config import settings

logger = logging.getLogger("audit.events")

AuditEvent = Dict[str, Any]
Publisher = Callable[[AuditEvent], None]

_publisher: Optional[Publisher] = None


def set_audit_event_publisher(publisher: Publisher | None) -> None:
    """Override the default audit event publisher (primarily for tests)."""

    global _publisher
    _publisher = publisher


def emit_audit_event(
    action: str,
    *,
    actor_user_id: str | None = None,
    organization_id: str | None = None,
    detail: str | None = None,
    metadata: Optional[Dict[str, Any]] = None,
) -> None:
    """Emit an audit event; defaults to JSON logging or webhook posting."""

    event: AuditEvent = {
        "action": action,
        "actor_user_id": actor_user_id,
        "organization_id": organization_id,
        "detail": detail,
        "metadata": metadata or {},
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

    publisher = _publisher or _default_publisher()
    publisher(event)


def _default_publisher() -> Publisher:
    if settings.audit_event_webhook_url:
        return _post_event_to_webhook
    return _log_event


def _post_event_to_webhook(event: AuditEvent) -> None:
    """Send audit events to the configured webhook, falling back to logging on failure."""

    try:
        response = httpx.post(
            settings.audit_event_webhook_url,
            json=event,
            timeout=2.0,
        )
        response.raise_for_status()
    except Exception:
        logger.warning("audit_event_webhook_failure", exc_info=True)
        _log_event(event)


def _log_event(event: AuditEvent) -> None:
    """Default publisher that logs structured events for log aggregation."""

    logger.info("audit_event %s", json.dumps(event, sort_keys=True))


__all__ = ["emit_audit_event", "set_audit_event_publisher"]
