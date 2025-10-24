"""
Admin System Health Monitoring Endpoints

Provides system health metrics and service status for admin users.
"""

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.api.dependencies.auth import get_current_admin_user
from app.core.config import get_settings

router = APIRouter()


@router.get("/system/health")
def get_system_health(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Get system health status and metrics.

    Returns:
    - Database connection status
    - Clerk configuration status
    - API performance metrics (placeholder)

    Requires: admin role
    """
    settings = get_settings()

    # Database health check
    database_status = "unknown"
    database_connections = 0

    try:
        # Test database connection
        result = db.execute(text("SELECT 1"))
        result.scalar()
        database_status = "healthy"

        # Get active connection count (PostgreSQL specific, will fail on SQLite)
        try:
            conn_result = db.execute(
                text("SELECT count(*) FROM pg_stat_activity WHERE datname = current_database()")
            )
            database_connections = conn_result.scalar() or 0
        except Exception:
            # If we can't get connection count (like with SQLite), it's not critical
            database_connections = -1

    except Exception as e:
        database_status = f"unhealthy: {str(e)}"

    # Clerk configuration check
    clerk_configured = bool(
        settings.clerk_secret_key and
        settings.clerk_publishable_key
    )
    clerk_status = "healthy" if clerk_configured else "not_configured"

    # API metrics (placeholder - would be implemented with monitoring tools like Prometheus)
    api_metrics = {
        "avg_response_time_ms": "not_implemented",
        "requests_last_hour": "not_implemented",
        "error_rate": "not_implemented",
        "status": "metrics_not_yet_implemented"
    }

    return {
        "database": {
            "status": database_status,
            "connections": database_connections
        },
        "clerk": {
            "status": clerk_status,
            "configured": clerk_configured
        },
        "api_metrics": api_metrics,
        "environment": settings.environment if hasattr(settings, 'environment') else "unknown",
        "debug_mode": settings.debug
    }
