"""Tenant Dashboard Endpoints.

Provides dashboard metrics and summaries for organization members.
All endpoints are tenant-scoped (filtered by organization_id).
"""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.db.session import get_db
from app.models.user import User

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary")
def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get tenant dashboard summary metrics.

    Returns:
    - Deal counts and pipeline value
    - Recent activity summary
    - Quick stats

    Tenant-scoped: Only shows data for current user's organization
    """
    org_id = current_user.organization_id
    now = datetime.now(timezone.utc)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    # For MVP: Return placeholder data
    # TODO: Implement real metrics when Deal and Document models are available

    return {
        "deals": {
            "total": 0,
            "active": 0,
            "this_month": 0,
            "pipeline_value": 0
        },
        "activity": {
            "deals_created_this_week": 0,
            "documents_uploaded_this_week": 0,
            "tasks_due_this_week": 0
        },
        "quick_stats": {
            "avg_deal_size": 0,
            "conversion_rate": 0,
            "active_users": 1  # At least the current user
        }
    }


@router.get("/recent-activity")
def get_recent_activity(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 10
):
    """
    Get recent activity feed for the organization.

    Returns recent actions like:
    - Deals created/updated
    - Documents uploaded
    - Tasks completed

    Tenant-scoped
    """
    # TODO: Implement when activity logging is available
    return {
        "items": [],
        "total": 0
    }


@router.get("/tasks")
def get_upcoming_tasks(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get upcoming tasks for the user.

    Returns tasks due in the next 7 days

    User-scoped
    """
    # TODO: Implement when Task model is available
    return {
        "items": [],
        "total": 0
    }


@router.get("/financial-insights")
def get_financial_insights(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get quick financial insights summary.

    Returns high-level financial metrics across active deals

    Tenant-scoped
    """
    # TODO: Implement when financial data is available
    return {
        "total_deal_value": 0,
        "avg_deal_size": 0,
        "deals_with_financials": 0,
        "insights": []
    }
