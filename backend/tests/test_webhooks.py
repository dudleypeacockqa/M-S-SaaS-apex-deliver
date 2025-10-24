"""Tests for Clerk webhook handling."""
from __future__ import annotations

import hashlib
import hmac
import json
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.user import User


def _sign_payload(payload: dict) -> tuple[str, bytes]:
    body = json.dumps(payload).encode()
    signature = hmac.new(settings.clerk_webhook_secret.encode(), body, hashlib.sha256).hexdigest()
    return signature, body


def test_webhook_creates_user(client, db_session: Session) -> None:
    payload = {
        "type": "user.created",
        "data": {
            "id": "user_123",
            "email_addresses": [{"email_address": "demo@example.com"}],
            "first_name": "Demo",
            "last_name": "User",
            "public_metadata": {"role": "growth"},
        },
    }
    signature, body = _sign_payload(payload)

    response = client.post(
        "/api/webhooks/clerk",
        data=body,
        headers={"svix-signature": signature, "content-type": "application/json"},
    )

    assert response.status_code == 200

    user = db_session.query(User).filter_by(clerk_user_id="user_123").one()
    assert user.email == "demo@example.com"
    assert user.role.value == "growth"


def test_webhook_rejects_invalid_signature(client) -> None:
    payload = {"type": "user.created", "data": {"id": "user_bad"}}
    body = json.dumps(payload).encode()

    response = client.post(
        "/api/webhooks/clerk",
        data=body,
        headers={"svix-signature": "invalid", "content-type": "application/json"},
    )

    assert response.status_code == 400


def test_webhook_updates_user(client, db_session: Session) -> None:
    user = User(
        clerk_user_id="user_456",
        email="start@example.com",
        first_name="Start",
        last_name="User",
    )
    db_session.add(user)
    db_session.commit()

    payload = {
        "type": "user.updated",
        "data": {
            "id": "user_456",
            "email_addresses": [{"email_address": "updated@example.com"}],
            "first_name": "Updated",
            "public_metadata": {"role": "enterprise"},
        },
    }
    signature, body = _sign_payload(payload)

    response = client.post(
        "/api/webhooks/clerk",
        data=body,
        headers={"svix-signature": signature, "content-type": "application/json"},
    )

    assert response.status_code == 200

    db_session.refresh(user)
    assert user.email == "updated@example.com"
    assert user.first_name == "Updated"
    assert user.role.value == "enterprise"


def test_webhook_soft_deletes_user(client, db_session: Session) -> None:
    user = User(
        clerk_user_id="user_del",
        email="delete@example.com",
    )
    db_session.add(user)
    db_session.commit()

    payload = {"type": "user.deleted", "data": {"id": "user_del"}}
    signature, body = _sign_payload(payload)

    response = client.post(
        "/api/webhooks/clerk",
        data=body,
        headers={"svix-signature": signature, "content-type": "application/json"},
    )

    assert response.status_code == 200

    db_session.refresh(user)
    assert user.is_active is False


def test_webhook_updates_last_login(client, db_session: Session) -> None:
    user = User(
        clerk_user_id="user_login",
        email="login@example.com",
    )
    db_session.add(user)
    db_session.commit()

    timestamp = datetime(2025, 2, 14, 12, 0, tzinfo=timezone.utc).isoformat()
    payload = {
        "type": "session.created",
        "data": {"user_id": "user_login", "last_active_at": timestamp},
    }
    signature, body = _sign_payload(payload)

    response = client.post(
        "/api/webhooks/clerk",
        data=body,
        headers={"svix-signature": signature, "content-type": "application/json"},
    )

    assert response.status_code == 200

    db_session.refresh(user)
    assert user.last_login_at is not None
    assert user.last_login_at.isoformat().startswith("2025-02-14T12:00:00")
