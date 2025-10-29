"""
Admin Dashboard Metrics Endpoint

Provides platform-wide analytics and KPIs for admin users.
"""

from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.models.organization import Organization
from app.api.dependencies.auth import get_current_admin_user

router = APIRouter()


@router.get("/dashboard")
def get_admin_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Get platform-wide dashboard metrics.

    Returns:
    - User statistics (total, active, new this month)
    - Organization statistics (total, new this month)
    - Revenue metrics (MRR, ARR projection)
    - Activity metrics (deals, documents this month)

    Requires: admin role
    """
    now = datetime.now(timezone.utc)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    thirty_days_ago = now - timedelta(days=30)

    # User metrics
    total_users = db.scalar(select(func.count(User.id)).where(User.deleted_at.is_(None)))

    active_users_30d = db.scalar(
        select(func.count(User.id))
        .where(User.deleted_at.is_(None))
        .where(User.last_login_at >= thirty_days_ago)
    )

    new_users_this_month = db.scalar(
        select(func.count(User.id))
        .where(User.deleted_at.is_(None))
        .where(User.created_at >= month_start)
    )

    # Organization metrics
    total_orgs = db.scalar(select(func.count(Organization.id)))

    new_orgs_this_month = db.scalar(
        select(func.count(Organization.id))
        .where(Organization.created_at >= month_start)
    )

    # Revenue calculations (based on subscription tiers)
    # Starter: £279/mo, Professional: £598/mo, Enterprise: £1598/mo, Community: £2997/mo
    tier_pricing = {
        "starter": 279,
        "professional": 598,
        "enterprise": 1598,
        "community": 2997
    }

    org_tiers_result = db.execute(
        select(Organization.subscription_tier, func.count(Organization.id))
        .group_by(Organization.subscription_tier)
    )
    org_tiers = dict(org_tiers_result.all())

    mrr = sum(org_tiers.get(tier, 0) * price for tier, price in tier_pricing.items())
    arr_projection = mrr * 12

    # Activity metrics (placeholder - will be implemented with deal/document features)
    deals_this_month = 0  # TODO: Implement when deals feature is added
    documents_this_month = 0  # TODO: Implement when documents feature is added

    return {
        "users": {
            "total": total_users or 0,
            "active_last_30_days": active_users_30d or 0,
            "new_this_month": new_users_this_month or 0
        },
        "organizations": {
            "total": total_orgs or 0,
            "new_this_month": new_orgs_this_month or 0
        },
        "revenue": {
            "mrr": mrr,
            "arr_projection": arr_projection
        },
        "activity": {
            "deals_created_this_month": deals_this_month,
            "documents_uploaded_this_month": documents_this_month
        }
    }
