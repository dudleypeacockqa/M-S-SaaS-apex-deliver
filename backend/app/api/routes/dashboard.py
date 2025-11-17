"""Tenant dashboard endpoints with cached metrics and summaries."""
from __future__ import annotations

import json
import logging
from datetime import datetime, timedelta, timezone
from decimal import Decimal
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends
from redis import asyncio as redis_async
from sqlalchemy import desc, func, or_, select
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.core.config import settings
from app.db.session import get_db
from app.models.deal import Deal, DealStage
from app.models.document import Document, DocumentAccessLog
from app.models.task import DealTask
from app.models.user import User

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

METRICS_CACHE_TTL = 300
RECENT_ACTIVITY_LIMIT = 20
UPCOMING_TASK_WINDOW_DAYS = 7

redis_client: Optional[redis_async.Redis] = None


async def _get_redis_client() -> Optional[redis_async.Redis]:
    """Return a shared Redis client if configuration is present."""

    global redis_client  # pylint: disable=global-statement

    if redis_client is not None:
        return redis_client

    if not settings.redis_url:
        return None

    try:
        redis_client = redis_async.from_url(
            settings.redis_url,
            encoding="utf-8",
            decode_responses=True,
        )
    except Exception as exc:  # pragma: no cover - driver/network failure
        logger.warning("Unable to initialize Redis client: %s", exc)
        redis_client = None
    return redis_client


def _serialize_decimal(value: Optional[Decimal]) -> float:
    return float(value or 0)


def _recent_activity_payload(db: Session, org_id: str, limit: int) -> List[Dict[str, Any]]:
    logs = (
        db.execute(
            select(DocumentAccessLog)
            .where(DocumentAccessLog.organization_id == org_id)
            .order_by(desc(DocumentAccessLog.created_at))
            .limit(limit)
        )
        .scalars()
        .all()
    )
    return [
        {
            "id": str(log.id),
            "document_id": str(log.document_id),
            "action": log.action,
            "user_id": log.user_id,
            "timestamp": log.created_at.isoformat() if log.created_at else None,
        }
        for log in logs
    ]


def _upcoming_tasks_payload(db: Session, org_id: str) -> List[Dict[str, Any]]:
    horizon = datetime.now(timezone.utc) + timedelta(days=UPCOMING_TASK_WINDOW_DAYS)
    tasks = (
        db.execute(
            select(DealTask)
            .where(DealTask.organization_id == org_id)
            .where(DealTask.status != "done")
            .where(or_(DealTask.due_date.is_(None), DealTask.due_date <= horizon))
            .order_by(DealTask.due_date.asc())
            .limit(25)
        )
        .scalars()
        .all()
    )
    return [
        {
            "id": task.id,
            "title": task.title,
            "status": task.status,
            "priority": task.priority,
            "deal_id": task.deal_id,
            "assignee_id": task.assignee_id,
            "due_date": task.due_date.isoformat() if task.due_date else None,
        }
        for task in tasks
    ]


def _metrics_payload(db: Session, org_id: str) -> Dict[str, Any]:
    deals_count = db.scalar(
        select(func.count()).where(Deal.organization_id == org_id, Deal.is_archived.is_(False))
    ) or 0
    documents_count = db.scalar(
        select(func.count()).where(Document.organization_id == org_id)
    ) or 0
    tasks_count = db.scalar(
        select(func.count()).where(DealTask.organization_id == org_id, DealTask.status != "done")
    ) or 0

    return {
        "deals_count": deals_count,
        "documents_count": documents_count,
        "tasks_count": tasks_count,
        "recent_activity": _recent_activity_payload(db, org_id, limit=10),
    }


def _financial_summary(db: Session, org_id: str) -> Dict[str, Any]:
    total_value = db.scalar(
        select(func.coalesce(func.sum(Deal.deal_size), 0)).where(Deal.organization_id == org_id)
    ) or Decimal("0")
    avg_value = db.scalar(
        select(func.coalesce(func.avg(Deal.deal_size), 0)).where(Deal.organization_id == org_id)
    ) or Decimal("0")
    open_deals = db.scalar(
        select(func.count()).where(
            Deal.organization_id == org_id,
            Deal.stage.in_(
                [
                    DealStage.sourcing,
                    DealStage.evaluation,
                    DealStage.due_diligence,
                    DealStage.negotiation,
                    DealStage.closing,
                ]
            ),
        )
    ) or 0
    won_deals = db.scalar(
        select(func.count()).where(Deal.organization_id == org_id, Deal.stage == DealStage.won)
    ) or 0

    return {
        "total_deal_value": _serialize_decimal(total_value),
        "average_deal_value": _serialize_decimal(avg_value),
        "active_deals": open_deals,
        "won_deals": won_deals,
    }


@router.get("/summary")
async def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return lightweight summary counts for the tenant dashboard."""

    org_id = str(current_user.organization_id)
    metrics = _metrics_payload(db, org_id)
    financials = _financial_summary(db, org_id)

    return {
        "deals": {
            "total": metrics["deals_count"],
            "active": financials["active_deals"],
            "won": financials["won_deals"],
        },
        "documents": metrics["documents_count"],
        "tasks": metrics["tasks_count"],
        "financial": financials,
    }


@router.get("/metrics")
async def get_dashboard_metrics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return cached dashboard metrics for the organization."""

    org_id = str(current_user.organization_id)
    cache_key = f"dashboard:metrics:{org_id}"
    redis = await _get_redis_client()

    if redis:
        cached = await redis.get(cache_key)
        if cached:
            try:
                return json.loads(cached)
            except json.JSONDecodeError:
                logger.debug("Discarding malformed cache payload for dashboard metrics")

    payload = _metrics_payload(db, org_id)

    if redis:
        try:
            await redis.setex(cache_key, METRICS_CACHE_TTL, json.dumps(payload))
        except Exception as exc:  # pragma: no cover - network failure guard
            logger.warning("Failed to cache dashboard metrics: %s", exc)

    return payload


@router.get("/recent-activity")
async def get_recent_activity(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = RECENT_ACTIVITY_LIMIT,
):
    """Return the latest document access events for the organization."""

    org_id = str(current_user.organization_id)
    capped_limit = max(1, min(limit, RECENT_ACTIVITY_LIMIT))
    return _recent_activity_payload(db, org_id, capped_limit)


@router.get("/tasks")
async def get_upcoming_tasks(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return upcoming tasks for the next week for the organization."""

    org_id = str(current_user.organization_id)
    return _upcoming_tasks_payload(db, org_id)


@router.get("/financial-summary")
async def get_financial_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Expose high-level financial metrics used on dashboards."""

    org_id = str(current_user.organization_id)
    return _financial_summary(db, org_id)
