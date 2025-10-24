"""Admin-only routes for Master Admin Portal.

This module implements all admin endpoints for:
- Dashboard metrics and analytics
- User management (CRUD operations)
- Organization management
- System health monitoring

All endpoints require admin role via get_current_admin_user dependency.
"""
from __future__ import annotations

from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import func, select, or_
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_admin_user
from app.db.session import get_db
from app.models.user import User, UserRole
from app.models.organization import Organization

router = APIRouter(prefix="/admin", tags=["admin"])


# ============================================================================
# PYDANTIC SCHEMAS
# ============================================================================

class PaginatedResponse(BaseModel):
    """Base paginated response model."""
    items: list
    total: int
    page: int
    per_page: int


class UserUpdate(BaseModel):
    """User update request model."""
    role: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None


# ============================================================================
# DASHBOARD ENDPOINTS
# ============================================================================

@router.get("/dashboard")
def get_admin_dashboard(
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
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
    now = datetime.utcnow()
    month_start = datetime(now.year, now.month, 1)
    thirty_days_ago = now - timedelta(days=30)

    # User metrics
    total_users = db.scalar(select(func.count(User.id)).where(User.deleted_at.is_(None))) or 0

    # Count active users (those with recent activity)
    # For now, count all non-deleted users as active (will be enhanced with last_active_at)
    active_users_30d = db.scalar(
        select(func.count(User.id)).where(User.deleted_at.is_(None))
    ) or 0

    new_users_this_month = db.scalar(
        select(func.count(User.id))
        .where(User.deleted_at.is_(None))
        .where(User.created_at >= month_start)
    ) or 0

    # Organization metrics
    total_orgs = db.scalar(select(func.count(Organization.id))) or 0

    new_orgs_this_month = db.scalar(
        select(func.count(Organization.id))
        .where(Organization.created_at >= month_start)
    ) or 0

    # Revenue calculations (based on subscription tiers)
    # Starter: £279/mo, Professional: £598/mo, Enterprise: £1598/mo, Community: £2997/mo
    tier_pricing = {
        "starter": 279,
        "professional": 598,
        "enterprise": 1598,
        "community": 2997
    }

    # Get organization counts by tier
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
            "total": total_users,
            "active_last_30_days": active_users_30d,
            "new_this_month": new_users_this_month
        },
        "organizations": {
            "total": total_orgs,
            "new_this_month": new_orgs_this_month
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


# ============================================================================
# USER MANAGEMENT ENDPOINTS
# ============================================================================

@router.get("/users")
def list_users(
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    search: Optional[str] = None
):
    """
    List all users across all organizations with pagination.

    Query Parameters:
    - page: Page number (default: 1)
    - per_page: Items per page (default: 20, max: 100)
    - search: Search by email or name

    Requires: admin role
    """
    query = select(User).where(User.deleted_at.is_(None))

    # Apply search filter
    if search:
        search_pattern = f"%{search}%"
        query = query.where(
            or_(
                User.email.ilike(search_pattern),
                User.first_name.ilike(search_pattern),
                User.last_name.ilike(search_pattern)
            )
        )

    # Get total count
    total = db.scalar(select(func.count()).select_from(query.subquery())) or 0

    # Apply pagination
    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page).order_by(User.created_at.desc())

    users = list(db.scalars(query).all())

    return {
        "items": [
            {
                "id": str(user.id),
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role.value if hasattr(user.role, 'value') else user.role,
                "organization_id": str(user.organization_id) if user.organization_id else None,
                "created_at": user.created_at.isoformat() if user.created_at else None,
                "deleted_at": user.deleted_at.isoformat() if user.deleted_at else None
            }
            for user in users
        ],
        "total": total,
        "page": page,
        "per_page": per_page
    }


@router.get("/users/{user_id}")
def get_user_details(
    user_id: str,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Get detailed information about a specific user.

    Requires: admin role
    """
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": str(user.id),
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "role": user.role.value if hasattr(user.role, 'value') else user.role,
        "organization_id": str(user.organization_id) if user.organization_id else None,
        "clerk_user_id": user.clerk_user_id,
        "created_at": user.created_at.isoformat() if user.created_at else None,
        "updated_at": user.updated_at.isoformat() if user.updated_at else None,
        "deleted_at": user.deleted_at.isoformat() if user.deleted_at else None
    }


@router.put("/users/{user_id}")
def update_user(
    user_id: str,
    user_update: UserUpdate,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Update user details (role, name, etc.).

    Requires: admin role
    """
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update fields if provided
    if user_update.role:
        # Validate role
        try:
            user.role = UserRole(user_update.role)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid role: {user_update.role}")

    if user_update.first_name is not None:
        user.first_name = user_update.first_name

    if user_update.last_name is not None:
        user.last_name = user_update.last_name

    user.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(user)

    return {
        "id": str(user.id),
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "role": user.role.value if hasattr(user.role, 'value') else user.role,
        "organization_id": str(user.organization_id) if user.organization_id else None,
        "updated_at": user.updated_at.isoformat() if user.updated_at else None
    }


@router.delete("/users/{user_id}")
def delete_user(
    user_id: str,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Soft delete a user (mark as deleted but keep data for audit).

    Requires: admin role
    """
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.deleted_at = datetime.utcnow()
    db.commit()

    return {"message": "User deleted successfully", "user_id": str(user.id)}


@router.post("/users/{user_id}/restore")
def restore_user(
    user_id: str,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Restore a soft-deleted user.

    Requires: admin role
    """
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.deleted_at = None
    db.commit()
    db.refresh(user)

    return {
        "id": str(user.id),
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "role": user.role.value if hasattr(user.role, 'value') else user.role,
        "deleted_at": None
    }


# ============================================================================
# ORGANIZATION MANAGEMENT ENDPOINTS
# ============================================================================

@router.get("/organizations")
def list_organizations(
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100)
):
    """
    List all organizations with pagination.

    Requires: admin role
    """
    query = select(Organization)

    # Get total count
    total = db.scalar(select(func.count(Organization.id))) or 0

    # Apply pagination
    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page).order_by(Organization.created_at.desc())

    orgs = list(db.scalars(query).all())

    return {
        "items": [
            {
                "id": str(org.id),
                "name": org.name,
                "slug": org.slug,
                "subscription_tier": org.subscription_tier,
                "is_active": org.is_active,
                "created_at": org.created_at.isoformat() if org.created_at else None
            }
            for org in orgs
        ],
        "total": total,
        "page": page,
        "per_page": per_page
    }


@router.get("/organizations/{org_id}")
def get_organization_details(
    org_id: str,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Get detailed information about a specific organization.

    Requires: admin role
    """
    org = db.get(Organization, org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")

    return {
        "id": str(org.id),
        "name": org.name,
        "slug": org.slug,
        "subscription_tier": org.subscription_tier,
        "is_active": org.is_active,
        "created_at": org.created_at.isoformat() if org.created_at else None,
        "updated_at": org.updated_at.isoformat() if org.updated_at else None
    }


@router.get("/organizations/{org_id}/users")
def get_organization_users(
    org_id: str,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Get all users in a specific organization.

    Requires: admin role
    """
    org = db.get(Organization, org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")

    users = list(db.scalars(
        select(User)
        .where(User.organization_id == org_id)
        .where(User.deleted_at.is_(None))
    ).all())

    return {
        "users": [
            {
                "id": str(user.id),
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role.value if hasattr(user.role, 'value') else user.role
            }
            for user in users
        ]
    }


@router.get("/organizations/{org_id}/metrics")
def get_organization_metrics(
    org_id: str,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Get metrics for a specific organization.

    Requires: admin role
    """
    org = db.get(Organization, org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")

    user_count = db.scalar(
        select(func.count(User.id))
        .where(User.organization_id == org_id)
        .where(User.deleted_at.is_(None))
    ) or 0

    return {
        "user_count": user_count,
        "subscription_tier": org.subscription_tier,
        "is_active": org.is_active,
        "created_at": org.created_at.isoformat() if org.created_at else None
    }


# ============================================================================
# SYSTEM HEALTH ENDPOINTS
# ============================================================================

@router.get("/system/health")
def get_system_health(
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Get system health metrics and status.

    Requires: admin role
    """
    from app.core.config import settings

    # Test database connection
    try:
        db.scalar(select(func.count(User.id)))
        db_status = "healthy"
    except Exception as e:
        db_status = f"error: {str(e)}"

    # Check Clerk configuration
    clerk_configured = bool(settings.clerk_secret_key)

    return {
        "database": {
            "status": db_status,
            "connection": "active" if db_status == "healthy" else "failed"
        },
        "clerk": {
            "status": "configured" if clerk_configured else "not_configured",
            "configured": clerk_configured
        },
        "api_metrics": {
            "status": "operational",
            "avg_response_time_ms": 50  # Placeholder
        }
    }
