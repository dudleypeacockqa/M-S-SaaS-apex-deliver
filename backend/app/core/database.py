"""Database connection and session management with lazy initialization."""
from __future__ import annotations

from collections.abc import Iterator
from typing import Any, Callable

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


class _DBSessionContext:
    """Iterator that exposes DB sessions to sync and async callers alike."""

    def __init__(self) -> None:
        self._gen = self._session_generator()

    def _session_generator(self):
        init_engine()
        if SessionLocal is None:
            raise RuntimeError("Database session not initialized")

        session_factory = SessionLocal
        if AsyncSession is not None and AsyncSession is not SessionLocal:
            session_factory = AsyncSession
        if session_factory is None:
            raise RuntimeError("Database session factory is not initialized")

        db = session_factory()
        try:
            yield db
            db.commit()
        except Exception:
            db.rollback()
            raise
        finally:
            db.close()

    def __iter__(self) -> "_DBSessionContext":
        return self

    def __next__(self) -> Session:
        return next(self._gen)

    def __aiter__(self) -> "_DBSessionContext":
        return self

    async def __anext__(self) -> Session:
        try:
            return next(self._gen)
        except StopIteration as exc:  # pragma: no cover - standard iterator plumbing
            raise StopAsyncIteration from exc

    def throw(self, *args: Any, **kwargs: Any) -> Session:
        return self._gen.throw(*args, **kwargs)

    def close(self) -> Any:
        return self._gen.close()


def get_db() -> Iterator[Session]:
    """Provide a transactional database session supporting sync + async usage."""
    return _DBSessionContext()


def init_db() -> None:
    """Create database tables when running in development/debug mode."""
    init_engine()
    Base.metadata.create_all(bind=engine)


def close_db() -> None:
    """Dispose of the engine."""
    if engine:
        engine.dispose()
