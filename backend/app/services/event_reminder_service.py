"""Event reminder scheduling/dispatch helpers (DEV-020)."""
from __future__ import annotations

from datetime import datetime, timedelta, UTC
from typing import List
import asyncio
import logging

from sqlalchemy.orm import Session

from app.models.event import Event
from app.models.event_reminder import EventReminder
from app.services import notification_service

logger = logging.getLogger(__name__)

REMINDER_OFFSETS = (
    ("24h", timedelta(hours=24), "event_reminder_24h"),
    ("1h", timedelta(hours=1), "event_reminder_1h"),
)


def schedule_event_reminders(*, db: Session, event: Event, user_id: str) -> List[EventReminder]:
    """Create reminder entries for the attendee if the event is far enough in the future."""
    reminders: List[EventReminder] = []
    if not event.start_date:
        return reminders

    now = datetime.now(UTC)
    for reminder_type, offset, _ in REMINDER_OFFSETS:
        scheduled_for = event.start_date - offset
        if scheduled_for <= now:
            continue
        reminder = EventReminder(
            event_id=event.id,
            user_id=user_id,
            organization_id=event.organization_id,
            reminder_type=reminder_type,
            scheduled_for=scheduled_for,
            status="pending",
        )
        db.add(reminder)
        reminders.append(reminder)

    if reminders:
        db.commit()
        for reminder in reminders:
            db.refresh(reminder)
    return reminders


def send_due_event_reminders(db: Session, limit: int = 50) -> int:
    """Send reminder emails for reminders whose scheduled time has passed."""
    now = datetime.now(UTC)
    due_reminders = (
        db.query(EventReminder)
        .filter(
            EventReminder.status == "pending",
            EventReminder.scheduled_for <= now,
        )
        .order_by(EventReminder.scheduled_for)
        .limit(limit)
        .all()
    )

    processed = 0
    for reminder in due_reminders:
        try:
            event = db.get(Event, reminder.event_id)
            if not event:
                reminder.status = "skipped"
                reminder.error_message = "event missing"
                continue

            notification_type = _notification_type_for(reminder.reminder_type)
            if not notification_type:
                reminder.status = "skipped"
                reminder.error_message = "unknown reminder type"
                continue

            data = {
                "event_name": getattr(event, "name", "Event"),
                "event_start": event.start_date.isoformat() if event.start_date else None,
                "event_location": event.location or event.virtual_link or "Online",
            }
            asyncio.run(
                notification_service.send_notification(
                    db=db,
                    notification_type=notification_type,
                    user_id=reminder.user_id,
                    data=data,
                )
            )
            reminder.status = "sent"
            reminder.sent_at = datetime.now(UTC)
            processed += 1
        except Exception as exc:  # pragma: no cover
            reminder.status = "failed"
            reminder.error_message = str(exc)
            logger.exception("Failed to send reminder %s", reminder.id)
        finally:
            reminder.attempts += 1
            reminder.last_attempt_at = datetime.now(UTC)
            db.add(reminder)

    if due_reminders:
        db.commit()
    return processed


def _notification_type_for(reminder_type: str) -> str | None:
    mapping = {
        "24h": "event_reminder_24h",
        "1h": "event_reminder_1h",
    }
    return mapping.get(reminder_type)
