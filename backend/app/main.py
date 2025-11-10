"""FastAPI application entry point.

Migration fix applied: 2025-11-10
- alembic_version table corrected to dc2c0f69c1b1
- Pre-Deploy Command configured: alembic upgrade head
"""
from __future__ import annotations

from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import api_router
from app.core.config import settings
from app.core.database import close_db, init_db


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan events."""
    # Startup
    if settings.debug:
        init_db()  # Create tables in development
    yield
    # Shutdown
    close_db()


def create_application() -> FastAPI:
    """Instantiate and configure the FastAPI application."""
    application = FastAPI(
        title=settings.app_name,
        debug=settings.debug,
        lifespan=lifespan,
    )

    # CORS middleware
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include API router
    application.include_router(api_router)

    return application


app = create_application()


@app.get("/")
async def read_root() -> dict[str, str]:
    """Root endpoint."""
    return {
        "message": "M&A Intelligence Platform API",
        "version": "2.0.0",
        "status": "running",
    }


@app.get("/health")
async def health_check() -> dict[str, str | bool]:
    """Health check endpoint for Render."""
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "clerk_configured": bool(settings.clerk_secret_key),
        "database_configured": bool(settings.database_url),
        "webhook_configured": bool(settings.clerk_webhook_secret),
    }
