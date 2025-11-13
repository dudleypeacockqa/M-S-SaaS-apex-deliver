"""Tests for EventReminderService (DEV-020)."""
from __future__ import annotations

from datetime import datetime, timedelta, UTC
from uuid import uuid4

from app.models.event import Event
from app.models.event_reminder import EventReminder
from app.services import event_reminder_service


class TestEventReminderService:
    """Event reminder scheduling tests."""

    def test_schedule_reminders_creates_entries(self, db_session, solo_user):
        event = Event(
            id=str(uuid4()),
            name="Reminder Test Event",
            start_date=datetime.now(UTC) + timedelta(days=2),
            end_date=datetime.now(UTC) + timedelta(days=2, hours=2),
            event_type="virtual",
            organization_id=solo_user.organization_id,
            created_by_user_id=solo_user.id,
        )
        db_session.add(event)
        db_session.commit()

        scheduled = event_reminder_service.schedule_event_reminders(
            db=db_session,
            event=event,
            user_id=solo_user.id,
        )

        assert len(scheduled) == 2
        reminder_types = sorted(r.reminder_type for r in scheduled)
        assert reminder_types == ["1h", "24h"]

    def test_send_due_reminders_triggers_notifications(self, db_session, solo_user, monkeypatch):
        event = Event(
            id=str(uuid4()),
            name="Due Reminder Event",
            start_date=datetime.now(UTC) + timedelta(hours=2),
            end_date=datetime.now(UTC) + timedelta(hours=4),
            event_type="virtual",
            organization_id=solo_user.organization_id,
            created_by_user_id=solo_user.id,
        )
        db_session.add(event)
        db_session.commit()

        reminder = EventReminder(
            event_id=event.id,
            user_id=solo_user.id,
            organization_id=solo_user.organization_id,
            reminder_type="24h",
            scheduled_for=datetime.now(UTC) - timedelta(minutes=5),
            status="pending",
        )
        db_session.add(reminder)
        db_session.commit()

        called = {}

        async def fake_send_notification(db, notification_type, user_id, data, channel="email"):
            called["args"] = (notification_type, user_id, data)
            return {"status": "sent"}

        monkeypatch.setattr(
            event_reminder_service.notification_service,
            "send_notification",
            fake_send_notification,
        )

        processed = event_reminder_service.send_due_event_reminders(db_session)

        assert processed == 1
        db_session.refresh(reminder)
        assert reminder.status == "sent"
        assert called["args"][0] == "event_reminder_24h"
