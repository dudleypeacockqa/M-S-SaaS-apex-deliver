"""
Admin User Management Endpoints

Provides full CRUD operations for managing users across all organizations.
"""

from datetime import datetime, timezone
from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, or_, func
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.session import get_db
from app.models.user import User
from app.api.dependencies.auth import get_current_admin_user

router = APIRouter()


class UserUpdate(BaseModel):
    """Schema for updating user fields"""
    role: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None


@router.get("/users")
def list_users(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    List all users across all organizations with pagination and search.

    Query Parameters:
    - page: Page number (default: 1)
    - per_page: Items per page (default: 20, max: 100)
    - search: Search by email, first name, or last name

    Requires: admin role
    """
    # Build base query
    query = select(User).where(User.deleted_at.is_(None))

    # Apply search filter if provided
    if search:
        search_filter = or_(
            User.email.ilike(f"%{search}%"),
            User.first_name.ilike(f"%{search}%"),
            User.last_name.ilike(f"%{search}%")
        )
        query = query.where(search_filter)

    # Get total count
    total_query = select(func.count()).select_from(query.subquery())
    total = db.scalar(total_query) or 0

    # Apply pagination
    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page).order_by(User.created_at.desc())

    # Execute query
    result = db.execute(query)
    users = result.scalars().all()

    # Format response
    user_list = [
        {
            "id": str(user.id),
            "clerk_user_id": user.clerk_user_id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role.value if hasattr(user.role, 'value') else user.role,
            "organization_id": str(user.organization_id) if user.organization_id else None,
            "created_at": user.created_at.isoformat() if user.created_at else None,
            "last_active_at": user.last_login_at.isoformat() if user.last_login_at else None,
            "deleted_at": None
        }
        for user in users
    ]

    return {
        "items": user_list,
        "total": total,
        "page": page,
        "per_page": per_page
    }


@router.get("/users/{user_id}")
def get_user_details(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Get detailed information about a specific user.

    Path Parameters:
    - user_id: UUID of the user

    Requires: admin role
    """
    user = db.get(User, user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": str(user.id),
        "clerk_user_id": user.clerk_user_id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "role": user.role.value if hasattr(user.role, 'value') else user.role,
        "organization_id": str(user.organization_id) if user.organization_id else None,
        "created_at": user.created_at.isoformat() if user.created_at else None,
        "updated_at": user.updated_at.isoformat() if user.updated_at else None,
        "last_active_at": user.last_login_at.isoformat() if user.last_login_at else None,
        "deleted_at": user.deleted_at.isoformat() if user.deleted_at else None
    }


@router.put("/users/{user_id}")
def update_user(
    user_id: str,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Update user details (role, name, etc.).

    Path Parameters:
    - user_id: UUID of the user

    Body:
    - role: New role (optional)
    - first_name: New first name (optional)
    - last_name: New last name (optional)

    Requires: admin role
    """
    user = db.get(User, user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Apply updates
    if user_update.role is not None:
        # Validate role
        from app.models.user import UserRole
        valid_roles = ["solo", "growth", "enterprise", "admin"]
        if user_update.role not in valid_roles:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid role. Must be one of: {', '.join(valid_roles)}"
            )
        user.role = UserRole[user_update.role]

    if user_update.first_name is not None:
        user.first_name = user_update.first_name

    if user_update.last_name is not None:
        user.last_name = user_update.last_name

    user.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(user)

    return {
        "id": str(user.id),
        "clerk_user_id": user.clerk_user_id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "role": user.role.value if hasattr(user.role, 'value') else user.role,
        "organization_id": str(user.organization_id) if user.organization_id else None,
        "created_at": user.created_at.isoformat() if user.created_at else None,
        "updated_at": user.updated_at.isoformat() if user.updated_at else None,
        "deleted_at": user.deleted_at.isoformat() if user.deleted_at else None
    }


@router.delete("/users/{user_id}")
def soft_delete_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Soft delete a user (marks as deleted, keeps data for audit).

    Path Parameters:
    - user_id: UUID of the user

    Requires: admin role
    """
    user = db.get(User, user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.deleted_at is not None:
        raise HTTPException(status_code=400, detail="User is already deleted")

    # Soft delete
    user.deleted_at = datetime.now(timezone.utc)
    db.commit()

    return {"message": "User soft deleted successfully", "user_id": str(user.id)}


@router.post("/users/{user_id}/restore")
def restore_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Restore a soft-deleted user.

    Path Parameters:
    - user_id: UUID of the user

    Requires: admin role
    """
    user = db.get(User, user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.deleted_at is None:
        raise HTTPException(status_code=400, detail="User is not deleted")

    # Restore user
    user.deleted_at = None
    db.commit()
    db.refresh(user)

    return {
        "id": str(user.id),
        "clerk_user_id": user.clerk_user_id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "role": user.role.value if hasattr(user.role, 'value') else user.role,
        "organization_id": str(user.organization_id) if user.organization_id else None,
        "created_at": user.created_at.isoformat() if user.created_at else None,
        "deleted_at": None
    }
