"""Clerk webhook endpoints."""
from __future__ import annotations

import json
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.security import verify_webhook_signature
from app.core.subscription import clear_tier_cache
from app.db.session import get_db
from app.services import organization_service, user_service

router = APIRouter(prefix="/webhooks", tags=["webhooks"])


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

    if event_type in {"user.created", "user.updated", "user.deleted"}:
        clerk_user_id = data.get("id")
        if not clerk_user_id:
            raise HTTPException(status_code=500, detail="Clerk webhook payload missing user id")

        if event_type == "user.created":
            user_service.create_user_from_clerk(db, data)
        elif event_type == "user.updated":
            try:
                user_service.update_user_from_clerk(db, clerk_user_id, data)
            except ValueError:
                user_service.create_user_from_clerk(db, data)
        else:
            user_service.delete_user(db, clerk_user_id)
    elif event_type in {"organization.created", "organization.updated"}:
        try:
            organization = organization_service.upsert_from_clerk(db, data)
        except ValueError as exc:
            raise HTTPException(status_code=500, detail=str(exc)) from exc

        clear_tier_cache(organization.id)
    elif event_type == "organization.deleted":
        organization_id = data.get("id")
        if not organization_id:
            raise HTTPException(status_code=500, detail="Clerk webhook payload missing organization id")

        organization_service.deactivate_organization(db, organization_id)
        clear_tier_cache(organization_id)
    elif event_type in {"session.created", "session.ended"}:
        user_service.update_last_login(
            db,
            data.get("user_id", ""),
            _parse_datetime(data.get("last_active_at")),
        )

    return {"status": "processed"}
