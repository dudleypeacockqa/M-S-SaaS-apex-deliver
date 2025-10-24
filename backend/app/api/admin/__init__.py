"""
Admin Portal API Router

This module provides admin-only endpoints for platform management:
- Dashboard metrics and analytics
- User management (CRUD operations)
- Organization management
- System health monitoring

All endpoints require admin role
"""

from fastapi import APIRouter

from .dashboard import router as dashboard_router
from .users import router as users_router
from .organizations import router as organizations_router
from .system import router as system_router

router = APIRouter(prefix="/admin", tags=["admin"])

# Include all admin sub-routers
router.include_router(dashboard_router)
router.include_router(users_router)
router.include_router(organizations_router)
router.include_router(system_router)

__all__ = ["router"]
