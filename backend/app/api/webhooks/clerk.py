"""Clerk webhook endpoints."""
from __future__ import annotations

import json
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session

from app.core.security import verify_webhook_signature
from app.db.session import get_db
from app.services import user_service

router = APIRouter(prefix="/api/webhooks", tags=["webhooks"])


def _parse_datetime(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value)
    except ValueError:
        return None


@router.post("/clerk", status_code=status.HTTP_200_OK)
async def handle_clerk_webhook(request: Request, db: Session = Depends(get_db)) -> dict[str, str]:
    body = await request.body()
    signature = request.headers.get("svix-signature")
    verify_webhook_signature(signature, body)

    payload = json.loads(body)
    event_type: str = payload.get("type", "")
    data: dict = payload.get("data") or {}

    if event_type == "user.created":
        user_service.create_user_from_clerk(db, data)
    elif event_type == "user.updated":
        user_service.update_user_from_clerk(db, data["id"], data)
    elif event_type == "user.deleted":
        user_service.delete_user(db, data.get("id", ""))
    elif event_type in {"session.created", "session.ended"}:
        user_service.update_last_login(db, data.get("user_id", ""), _parse_datetime(data.get("last_active_at")))

    return {"status": "processed"}
