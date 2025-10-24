"""Admin-only routes."""
from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.dependencies.auth import get_current_admin_user
from app.models.user import User

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/dashboard")
def admin_dashboard(current_admin: User = Depends(get_current_admin_user)):
    """
    Admin dashboard endpoint.
    Only accessible by users with admin role.
    """
    return {
        "message": "Welcome to admin dashboard",
        "admin_email": current_admin.email,
        "admin_id": current_admin.id,
    }


@router.get("/stats")
def admin_stats(current_admin: User = Depends(get_current_admin_user)):
    """
    Admin statistics endpoint.
    Only accessible by admins.
    """
    return {
        "total_users": 0,  # Placeholder
        "active_users": 0,  # Placeholder
        "admin_name": current_admin.email,
    }
