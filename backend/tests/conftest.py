"""Pytest fixtures for backend tests."""
from __future__ import annotations

import os
from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Configure environment before importing application modules
# Force override all settings for test environment
os.environ["ENVIRONMENT"] = "test"
os.environ["DATABASE_URL"] = "sqlite:///./test_app.db"
os.environ["CLERK_SECRET_KEY"] = "test_clerk_secret"
os.environ["CLERK_PUBLISHABLE_KEY"] = "test_clerk_pk"
os.environ["CLERK_WEBHOOK_SECRET"] = "test_webhook_secret"
os.environ["CLERK_JWT_ALGORITHM"] = "HS256"
os.environ["SECRET_KEY"] = "test_api_secret"
os.environ["DEBUG"] = "false"  # Disable init_db() in lifespan during tests

from app.core.config import get_settings, settings  # noqa: E402
from app.db import session as session_module  # noqa: E402
from app.db.base import Base  # noqa: E402
from app.db.session import get_db  # noqa: E402
from app.main import app  # noqa: E402

# Clear the settings cache to ensure test configuration is used
get_settings.cache_clear()


@pytest.fixture(scope="session")
def engine():
    """Create a shared SQLite engine for tests."""

    connect_args = {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}
    engine = create_engine(settings.database_url, future=True, connect_args=connect_args)
    Base.metadata.create_all(engine)
    session_module.engine = engine
    session_module.SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False, future=True)
    yield engine
    Base.metadata.drop_all(engine)
    engine.dispose()


@pytest.fixture(autouse=True)
def _reset_database(engine):
    """Ensure each test runs with a clean database state."""

    yield
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)


@pytest.fixture()
def client(engine) -> Iterator[TestClient]:
    """Return a FastAPI TestClient with database dependency override."""

    SessionTesting = sessionmaker(bind=engine, autocommit=False, autoflush=False, future=True)

    def _get_db_override():
        db = SessionTesting()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = _get_db_override
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.pop(get_db, None)


@pytest.fixture()
def db_session(engine):
    """Provide a raw SQLAlchemy session for direct database inspection."""

    SessionTesting = sessionmaker(bind=engine, autocommit=False, autoflush=False, future=True)
    session = SessionTesting()
    try:
        yield session
    finally:
        session.close()
