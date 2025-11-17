"""Database connection and session management with lazy initialization."""
from __future__ import annotations

from collections.abc import AsyncIterator, Iterator
from typing import Callable

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings
from app.db.base import Base

# Module-level variables (lazy initialization to allow test config override)
engine = None
SessionLocal: sessionmaker | None = None
# Alias used by tests to patch session creation (see backend/tests/test_core_edge_cases.py)
AsyncSession: Callable[[], Session] | None = None  # type: ignore


def init_engine():
    """Initialize database engine (lazy).

    This allows tests to override settings before engine creation.
    """
    global engine, SessionLocal, AsyncSession
    if engine is None:
        connect_args = {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}
        engine = create_engine(settings.database_url, future=True, connect_args=connect_args)
        SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False, future=True)
        # Expose a patchable alias so tests can force failure modes without reaching into private state
        AsyncSession = SessionLocal
    return engine


async def get_db() -> AsyncIterator[Session]:
    """Provide a transactional database session that works in sync or async contexts."""
    init_engine()  # Ensure engine is initialized before use
    if SessionLocal is None:
        raise RuntimeError("Database session not initialized")

    session_factory = AsyncSession or SessionLocal
    db = session_factory()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def init_db() -> None:
    """Create database tables when running in development/debug mode."""
    init_engine()
    Base.metadata.create_all(bind=engine)


def close_db() -> None:
    """Dispose of the engine."""
    if engine:
        engine.dispose()
