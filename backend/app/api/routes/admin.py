"""Admin-only routes for Master Admin Portal.

This module implements all admin endpoints for:
- Dashboard metrics and analytics
- User management (CRUD operations)
- Organization management
- System health monitoring

All endpoints require admin role via get_current_admin_user dependency.
"""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Optional, Iterable, Dict
import logging

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, EmailStr
from sqlalchemy import func, select, or_
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_admin_user
from app.db.session import get_db
from app.models.user import User, UserRole
from app.models.organization import Organization
from app.models.rbac_audit_log import RBACAuditAction
from app.services.rbac_audit_service import (
    log_role_change,
    log_user_status_change,
)
from app.services import invite_service
from app.services.invite_service import InvitationError

router = APIRouter(prefix="/admin", tags=["admin"])
logger = logging.getLogger(__name__)


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


class OrganizationInviteRequest(BaseModel):
    """Create organization invitation request."""

    email: EmailStr
    role: str = "basic_member"
    redirect_url: Optional[str] = None
    playbook_focus: Optional[str] = None
    note: Optional[str] = None


class OrganizationInviteResponse(BaseModel):
    id: str
    email: EmailStr
    role: str
    status: str
    created_at: datetime
    organization_id: str


class OrganizationInviteList(BaseModel):
    items: list[OrganizationInviteResponse]
    total: int


class OrganizationHealthCheck(BaseModel):
    key: str
    label: str
    status: bool
    detail: str


class OrganizationHealthResponse(BaseModel):
    status: str
    summary: str
    checks: list[OrganizationHealthCheck]


def _serialize_invitation(invite) -> OrganizationInviteResponse:
    created = (
        datetime.fromtimestamp(invite.created_at, tz=timezone.utc)
        if getattr(invite, "created_at", None)
        else datetime.now(timezone.utc)
    )
    return OrganizationInviteResponse(
        id=str(getattr(invite, "id", "")),
        email=getattr(invite, "email_address", ""),
        role=getattr(invite, "role", ""),
        status=getattr(invite, "status", ""),
        organization_id=getattr(invite, "organization_id", ""),
        created_at=created,
    )


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
    now = datetime.now(timezone.utc)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
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
    per_page: int = Query(20, ge=1),
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
    # Cap per_page at 100 for performance (graceful degradation)
    per_page = min(per_page, 100)

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

    previous_role = user.role
    role_changed = False

    # Update fields if provided
    if user_update.role:
        # Validate role
        try:
            user.role = UserRole(user_update.role)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid role: {user_update.role}")
        else:
            role_changed = user.role != previous_role

    if user_update.first_name is not None:
        user.first_name = user_update.first_name

    if user_update.last_name is not None:
        user.last_name = user_update.last_name

    user.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(user)

    if role_changed:
        log_role_change(
            db,
            actor_user_id=current_admin.id,
            target_user_id=user.id,
            organization_id=user.organization_id,
            previous_role=previous_role.value if isinstance(previous_role, UserRole) else str(previous_role),
            new_role=user.role.value if isinstance(user.role, UserRole) else str(user.role),
        )

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

    user.deleted_at = datetime.now(timezone.utc)
    db.commit()
    log_user_status_change(
        db,
        actor_user_id=current_admin.id,
        target_user_id=user.id,
        organization_id=user.organization_id,
        action=RBACAuditAction.USER_DELETED,
        detail="User soft deleted via admin API",
    )

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
    log_user_status_change(
        db,
        actor_user_id=current_admin.id,
        target_user_id=user.id,
        organization_id=user.organization_id,
        action=RBACAuditAction.USER_RESTORED,
        detail="User restored via admin API",
    )

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
    per_page: int = Query(20, ge=1, le=100),
    search: str | None = Query(None),
):
    """
    List all organizations with pagination.

    Requires: admin role
    """
    query = select(Organization)
    if search:
        pattern = f"%{search.lower()}%"
        query = query.where(
            or_(
                func.lower(Organization.name).like(pattern),
                func.lower(Organization.slug).like(pattern),
            )
        )

    # Get total count
    total = db.scalar(select(func.count(Organization.id)).select_from(query.subquery())) or 0

    # Apply pagination
    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page).order_by(Organization.created_at.desc())

    orgs = list(db.scalars(query).all())
    org_ids = [org.id for org in orgs]
    user_counts: Dict[str, int] = {}
    if org_ids:
        counts = db.execute(
            select(User.organization_id, func.count(User.id))
            .where(User.organization_id.in_(org_ids))
            .where(User.deleted_at.is_(None))
            .group_by(User.organization_id)
        ).all()
        user_counts = {org_id: count for org_id, count in counts}

    return {
        "items": [
            {
                "id": str(org.id),
                "name": org.name,
                "slug": org.slug,
                "subscription_tier": org.subscription_tier,
                "is_active": org.is_active,
                "created_at": org.created_at.isoformat() if org.created_at else None,
                "user_count": user_counts.get(org.id, 0),
                "health_status": _calculate_health(org, user_counts.get(org.id, 0)).status,
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

    user_count = db.scalar(
        select(func.count(User.id))
        .where(User.organization_id == org_id)
        .where(User.deleted_at.is_(None))
    ) or 0
    health = _calculate_health(org, user_count)

    return {
        "id": str(org.id),
        "name": org.name,
        "slug": org.slug,
        "subscription_tier": org.subscription_tier,
        "is_active": org.is_active,
        "user_count": user_count,
        "created_at": org.created_at.isoformat() if org.created_at else None,
        "updated_at": org.updated_at.isoformat() if org.updated_at else None,
        "health": health.dict(),
    }


@router.get("/organizations/{org_id}/invites", response_model=OrganizationInviteList)
def list_organization_invites(
    org_id: str,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
) -> OrganizationInviteList:
    """List pending invitations for an organization."""

    org = db.get(Organization, org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")

    try:
        invites = invite_service.list_pending_invitations(organization_id=org_id, limit=50, offset=0)
    except InvitationError as exc:  # pragma: no cover - network failure path
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc

    invite_items = invites.data if invites else []
    total = invites.total_count if invites else 0
    return OrganizationInviteList(
        items=[_serialize_invitation(invite) for invite in invite_items],
        total=total,
    )


@router.post("/organizations/{org_id}/invites", response_model=OrganizationInviteResponse)
def create_organization_invite(
    org_id: str,
    invite: OrganizationInviteRequest,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
) -> OrganizationInviteResponse:
    """Create and send an organization invitation via Clerk."""

    org = db.get(Organization, org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")

    if not current_admin.organization_id:
        raise HTTPException(status_code=400, detail="Admin profile missing organization assignment")

    if current_admin.organization_id != org_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must belong to the organization to send invites",
        )

    public_metadata = {
        "playbook_focus": invite.playbook_focus or "pmi-stability-sprint",
        "toolkit": "post-merger-integration",
    }
    private_metadata = {k: v for k, v in {
        "note": invite.note,
        "source": "master-admin-console",
    }.items() if v}

    try:
        invitation = invite_service.create_invitation(
            organization_id=org_id,
            email_address=invite.email,
            role=invite.role,
            inviter_user_id=current_admin.clerk_user_id,
            public_metadata=public_metadata,
            private_metadata=private_metadata or None,
            redirect_url=invite.redirect_url,
        )
    except InvitationError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc

    return _serialize_invitation(invitation)


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


@router.get("/organizations/{org_id}/health", response_model=OrganizationHealthResponse)
def get_organization_health(
    org_id: str,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
) -> OrganizationHealthResponse:
    """Detailed health report for an organization aligned with PMI stages."""

    org = db.get(Organization, org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")

    user_count = db.scalar(
        select(func.count(User.id))
        .where(User.organization_id == org_id)
        .where(User.deleted_at.is_(None))
    ) or 0

    invite_count = 0
    try:
        invites = invite_service.list_pending_invitations(organization_id=org_id, limit=5, offset=0)
        invite_count = invites.total_count if invites else 0
    except InvitationError as exc:  # pragma: no cover
        logger.warning("Failed to load invites for org %s: %s", org_id, exc.message)
        invite_count = 0

    return _calculate_health(org, user_count, invite_count)


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
def _calculate_health(
    org: Organization,
    user_count: int,
    invite_count: int | None = None,
) -> OrganizationHealthResponse:
    """
    Heuristic health evaluation aligned with PMI toolkit guidance.
    """
    checks: list[OrganizationHealthCheck] = []

    # Stability sprint: org active & tier configured
    stability = org.is_active and org.subscription_tier is not None
    checks.append(
        OrganizationHealthCheck(
            key="stability",
            label="Sprint 0 · Stability & Protection",
            status=stability,
            detail="Org active with baseline subscription tier." if stability else "Activate tenant and align tier before proceeding.",
        )
    )

    # Quick wins: at least 3 users invited/onboarded
    quick_wins_ready = user_count >= 3
    checks.append(
        OrganizationHealthCheck(
            key="quick_wins",
            label="Sprint 1 · Quick-Win Crew Ready",
            status=quick_wins_ready,
            detail="Cross-functional team onboarded." if quick_wins_ready else "Invite ops/finance/security leads to reach minimum crew of 3.",
        )
    )

    # Revenue acceleration: professional+ tier
    revenue_ready = org.subscription_tier in {"professional", "premium", "enterprise"}
    checks.append(
        OrganizationHealthCheck(
            key="revenue_accel",
            label="Sprint 2 · Revenue Acceleration",
            status=revenue_ready,
            detail="Tier unlocks automation & valuation features." if revenue_ready else "Upgrade tier to unlock automation + valuation copilots.",
        )
    )

    # Enablement: outstanding invites guiding onboarding
    invite_available = (invite_count or 0) > 0
    checks.append(
        OrganizationHealthCheck(
            key="enablement",
            label="Sprint 3 · Enablement & Culture",
            status=invite_available,
            detail="Pending invites carrying PMI playbook." if invite_available else "Queue invites with PMI context for new leaders.",
        )
    )

    healthy_checks = sum(1 for c in checks if c.status)
    if healthy_checks == len(checks):
        overall = "green"
        summary = "Tenant is ready for PMI Sprint 3 enablement."
    elif healthy_checks >= 2:
        overall = "amber"
        summary = "Foundation set; complete quick wins + invites before deep builds."
    else:
        overall = "red"
        summary = "Stabilize tenant and onboard core team before advanced work."

    return OrganizationHealthResponse(status=overall, summary=summary, checks=checks)
