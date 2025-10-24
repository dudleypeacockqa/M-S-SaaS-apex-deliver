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


@pytest.fixture()
def admin_user(db_session):
    """Create and return a test admin user."""
    from app.models.user import User
    from app.models.organization import Organization

    # Create test organization
    org = Organization(
        id="test-org-admin",
        name="Admin Test Org",
        slug="admin-test-org",
        subscription_tier="enterprise"
    )
    db_session.add(org)

    # Create admin user
    admin_user = User(
        id="test-admin-user-id",
        clerk_user_id="test_clerk_admin_user",
        email="admin@test.com",
        first_name="Admin",
        last_name="User",
        role="admin",
        organization_id="test-org-admin"
    )
    db_session.add(admin_user)
    db_session.commit()
    db_session.refresh(admin_user)
    return admin_user


@pytest.fixture()
def solo_user(db_session):
    """Create and return a test solo user."""
    from app.models.user import User
    from app.models.organization import Organization

    # Create test organization
    org = Organization(
        id="test-org-solo",
        name="Solo Test Org",
        slug="solo-test-org",
        subscription_tier="starter"
    )
    db_session.add(org)

    # Create solo user
    solo_user = User(
        id="test-solo-user-id",
        clerk_user_id="test_clerk_solo_user",
        email="solo@test.com",
        first_name="Solo",
        last_name="User",
        role="solo",
        organization_id="test-org-solo"
    )
    db_session.add(solo_user)
    db_session.commit()
    db_session.refresh(solo_user)
    return solo_user


@pytest.fixture()
def auth_headers_admin(admin_user):
    """Provide authentication headers for an admin user."""
    from app.api.dependencies.auth import get_current_user

    # Override the dependency to return our test admin user
    def override_get_current_user():
        return admin_user

    app.dependency_overrides[get_current_user] = override_get_current_user

    # Return headers (actual token doesn't matter since we override dependency)
    headers = {"Authorization": "Bearer mock_admin_token"}
    yield headers

    # Clean up override after test
    app.dependency_overrides.pop(get_current_user, None)


@pytest.fixture()
def auth_headers_solo(solo_user):
    """Provide authentication headers for a solo (non-admin) user."""
    from app.api.dependencies.auth import get_current_user

    # Override the dependency to return our test solo user
    def override_get_current_user():
        return solo_user

    app.dependency_overrides[get_current_user] = override_get_current_user

    # Return headers
    headers = {"Authorization": "Bearer mock_solo_token"}
    yield headers

    # Clean up override after test
    app.dependency_overrides.pop(get_current_user, None)


@pytest.fixture()
def enterprise_user(db_session):
    """Create and return a test enterprise user."""
    from app.models.user import User
    from app.models.organization import Organization

    # Create test organization
    org = Organization(
        id="test-org-enterprise",
        name="Enterprise Test Org",
        slug="enterprise-test-org",
        subscription_tier="enterprise"
    )
    db_session.add(org)

    # Create enterprise user
    enterprise_user = User(
        id="test-enterprise-user-id",
        clerk_user_id="test_clerk_enterprise_user",
        email="enterprise@test.com",
        first_name="Enterprise",
        last_name="User",
        role="enterprise",
        organization_id="test-org-enterprise"
    )
    db_session.add(enterprise_user)
    db_session.commit()
    db_session.refresh(enterprise_user)
    return enterprise_user
