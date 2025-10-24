"""
Admin Organization Management Endpoints

Provides organization viewing and management capabilities for admin users.
"""

from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.models.organization import Organization
from app.api.dependencies.auth import get_current_admin_user

router = APIRouter()


@router.get("/organizations")
def list_organizations(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    List all organizations with pagination.

    Query Parameters:
    - page: Page number (default: 1)
    - per_page: Items per page (default: 20, max: 100)

    Requires: admin role
    """
    # Build base query
    query = select(Organization)

    # Get total count
    total_query = select(func.count()).select_from(Organization)
    total = db.scalar(total_query) or 0

    # Apply pagination
    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page).order_by(Organization.created_at.desc())

    # Execute query
    result = db.execute(query)
    orgs = result.scalars().all()

    # Format response
    org_list = [
        {
            "id": str(org.id),
            "name": org.name,
            "subscription_tier": org.subscription_tier,
            "created_at": org.created_at.isoformat() if org.created_at else None,
            "updated_at": org.updated_at.isoformat() if org.updated_at else None
        }
        for org in orgs
    ]

    return {
        "items": org_list,
        "total": total,
        "page": page,
        "per_page": per_page
    }


@router.get("/organizations/{org_id}")
def get_organization_details(
    org_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Get detailed information about a specific organization.

    Path Parameters:
    - org_id: UUID of the organization

    Requires: admin role
    """
    org = db.get(Organization, org_id)

    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")

    # Get user count for this organization
    user_count = db.scalar(
        select(func.count(User.id))
        .where(User.organization_id == org_id)
        .where(User.deleted_at.is_(None))
    )

    return {
        "id": str(org.id),
        "name": org.name,
        "subscription_tier": org.subscription_tier,
        "created_at": org.created_at.isoformat() if org.created_at else None,
        "updated_at": org.updated_at.isoformat() if org.updated_at else None,
        "user_count": user_count or 0
    }


@router.get("/organizations/{org_id}/users")
def get_organization_users(
    org_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Get all users in a specific organization.

    Path Parameters:
    - org_id: UUID of the organization

    Requires: admin role
    """
    # Verify organization exists
    org = db.get(Organization, org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")

    # Get users
    query = select(User).where(User.organization_id == org_id).where(User.deleted_at.is_(None))
    result = db.execute(query)
    users = result.scalars().all()

    user_list = [
        {
            "id": str(user.id),
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role.value if hasattr(user.role, 'value') else user.role,
            "created_at": user.created_at.isoformat() if user.created_at else None,
            "last_active_at": user.last_login_at.isoformat() if user.last_login_at else None
        }
        for user in users
    ]

    return {
        "organization_id": str(org_id),
        "organization_name": org.name,
        "users": user_list,
        "total_users": len(user_list)
    }


@router.get("/organizations/{org_id}/metrics")
def get_organization_metrics(
    org_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Get activity metrics for a specific organization.

    Path Parameters:
    - org_id: UUID of the organization

    Requires: admin role
    """
    # Verify organization exists
    org = db.get(Organization, org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")

    # Get user count
    user_count = db.scalar(
        select(func.count(User.id))
        .where(User.organization_id == org_id)
        .where(User.deleted_at.is_(None))
    )

    # Placeholder metrics (will be implemented when deals/documents features are added)
    return {
        "organization_id": str(org_id),
        "organization_name": org.name,
        "user_count": user_count or 0,
        "subscription_tier": org.subscription_tier,
        "created_at": org.created_at.isoformat() if org.created_at else None,
        "deals_count": 0,  # TODO: Implement when deals feature is added
        "documents_count": 0,  # TODO: Implement when documents feature is added
        "active_users_last_30_days": 0  # TODO: Implement with last_active_at tracking
    }
