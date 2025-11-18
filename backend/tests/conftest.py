"""Pytest fixtures for backend tests."""
from __future__ import annotations

import os
import sys
from collections.abc import Callable, Iterator
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

import asyncio
import pytest
import pytest_asyncio
from unittest.mock import MagicMock
from fastapi.testclient import TestClient
from httpx import AsyncClient
from jose import jwt
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.exc import OperationalError, ProgrammingError
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from _pytest.fixtures import FixtureLookupError
from sqlalchemy.dialects.postgresql import JSONB, ARRAY, INET
from sqlalchemy.ext.compiler import compiles


@compiles(JSONB, "sqlite")
def _jsonb_sqlite(element, compiler, **kwargs):
    """Render JSONB columns as SQLite JSON for in-memory tests."""
    return "JSON"


@compiles(ARRAY, "sqlite")
def _array_sqlite(element, compiler, **kwargs):
    """Render ARRAY columns as SQLite TEXT (JSON encoded) for tests."""
    return "TEXT"


@compiles(INET, "sqlite")
def _inet_sqlite(element, compiler, **kwargs):
    """Render INET columns as TEXT for tests."""
    return "TEXT"

# Ensure repository and backend directories are on sys.path for "app" imports
REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_ROOT = Path(__file__).resolve().parents[1]
for path in (REPO_ROOT, BACKEND_ROOT):  # pragma: no cover - import guard
    if str(path) not in sys.path:
        sys.path.insert(0, str(path))

# Configure environment before importing application modules
# Force override all settings for test environment
os.environ["ENVIRONMENT"] = "test"
os.environ["DATABASE_URL"] = "sqlite+pysqlite:///:memory:"
os.environ["CLERK_SECRET_KEY"] = "test_clerk_secret"
os.environ["CLERK_PUBLISHABLE_KEY"] = "test_clerk_pk"
os.environ["CLERK_WEBHOOK_SECRET"] = "test_webhook_secret"
os.environ["CLERK_JWT_ALGORITHM"] = "HS256"
os.environ["SECRET_KEY"] = "test_api_secret"
os.environ["DEBUG"] = "false"  # Disable init_db() in lifespan during tests
os.environ.setdefault("STRIPE_API_KEY", "sk_test_dummy")
os.environ.setdefault("STRIPE_SECRET_KEY", "sk_test_dummy")
os.environ.setdefault("STRIPE_PUBLISHABLE_KEY", "pk_test_dummy")
os.environ.setdefault("STRIPE_WEBHOOK_SECRET", "whsec_dummy")
os.environ.setdefault("STRIPE_PRICE_STARTER_MONTHLY", "price_starter_monthly")
os.environ.setdefault("STRIPE_PRICE_STARTER_ANNUAL", "price_starter_annual")
os.environ.setdefault("STRIPE_PRICE_PROFESSIONAL_MONTHLY", "price_professional_monthly")
os.environ.setdefault("STRIPE_PRICE_PROFESSIONAL_ANNUAL", "price_professional_annual")
os.environ.setdefault("STRIPE_PRICE_ENTERPRISE_MONTHLY", "price_enterprise_monthly")
os.environ.setdefault("STRIPE_PRICE_ENTERPRISE_ANNUAL", "price_enterprise_annual")
os.environ.setdefault("STRIPE_PRICE_COMMUNITY_MONTHLY", "price_community_monthly")
os.environ.setdefault("STRIPE_PRICE_COMMUNITY_ANNUAL", "price_community_annual")
os.environ.setdefault("CELERY_BROKER_URL", "memory://")
os.environ.setdefault("CELERY_RESULT_BACKEND", "cache+memory://")
os.environ.setdefault("CELERY_TASK_ALWAYS_EAGER", "true")
os.environ.setdefault("CELERY_TASK_EAGER_PROPAGATES", "true")
os.environ.setdefault("SYNTHFLOW_API_KEY", "sk_test_synthflow_dummy")

from tests import path_safety  # pytest namespace package (PEP 420)

from app.core.config import get_settings, settings  # noqa: E402
from app.db import session as session_module  # noqa: E402
from app.db.base import Base  # noqa: E402
from app.db.session import get_db  # noqa: E402

# Create fresh mocks per test to avoid shared state
# These will be reset in the autouse fixture below
# Store references to the actual MagicMock objects for proper reset
stripe_mock = MagicMock()
stripe_module = stripe_mock
sys.modules.setdefault("stripe", stripe_module)

celery_mock = MagicMock()
sys.modules.setdefault("celery", celery_mock)

openai_mock = MagicMock()
openai_mock.AsyncOpenAI = MagicMock()
sys.modules.setdefault("openai", openai_mock)

import importlib

from app.main import app  # noqa: E402
from app.models.user import User, UserRole  # noqa: E402
from app.models.organization import Organization  # noqa: E402
from app.models.document import Document, Folder, DocumentPermission, DocumentAccessLog  # noqa: E402, F401
from app.models.deal import Deal, DealStage  # noqa: E402, F401
from app.models.valuation import ValuationModel, ComparableCompany, PrecedentTransaction, ValuationScenario, ValuationExportLog
from app.models.podcast import PodcastEpisode, PodcastTranscript, PodcastAnalytics

# Ensure Base metadata is populated with all models and ready for schema ops
from app import models as _models  # noqa: E402,F401
if not Base.metadata.tables:  # pragma: no cover - sanity check
    raise RuntimeError("SQLAlchemy metadata did not register application tables")

# Clear the settings cache to ensure test configuration is used
get_settings.cache_clear()



@pytest.fixture()
def engine():
    """Create an in-memory SQLite engine per test."""

    engine = create_engine(
        "sqlite+pysqlite:///:memory:",
        future=True,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)

    session_factory = sessionmaker(bind=engine, autocommit=False, autoflush=False, future=True)
    session_module.engine = engine
    session_module.SessionLocal = session_factory

    try:
        yield engine
    finally:
        _safe_drop_schema(engine)
        engine.dispose()


@pytest.fixture(autouse=True)
def _cleanup_dependency_overrides():
    """Ensure all FastAPI dependency overrides are cleared after each test."""
    yield
    # Clear all dependency overrides to prevent test pollution
    app.dependency_overrides.clear()


@pytest.fixture
def dependency_overrides():
    """
    Helper fixture to register dependency overrides that are always cleaned up.

    Usage:
        def test_something(dependency_overrides):
            dependency_overrides(get_current_user, lambda: fake_user)
    """
    applied: list[Callable[..., object]] = []

    def _override(dependency: Callable[..., object], provider: Callable[..., object]) -> None:
        app.dependency_overrides[dependency] = provider
        applied.append(dependency)

    try:
        yield _override
    finally:
        for dependency in reversed(applied):
            app.dependency_overrides.pop(dependency, None)


@pytest.fixture(autouse=True)
def _reset_database(engine):
    """Ensure a clean database state between tests."""
    # Ensure clean state before test
    _reset_metadata(engine)
    yield
    # Clean up after test
    _reset_metadata(engine)


@pytest.fixture(autouse=True)
def _reset_mocks():
    """Reset all module-level mocks between tests to prevent shared state."""
    yield
    # Reset mocks to clean state - use the actual MagicMock objects
    stripe_mock.reset_mock()
    celery_mock.reset_mock()
    openai_mock.reset_mock()
    if hasattr(openai_mock, "AsyncOpenAI"):
        openai_mock.AsyncOpenAI.reset_mock()
    
    # Also reset any nested mocks that may have been created
    if "stripe" in sys.modules and hasattr(sys.modules["stripe"], "reset_mock"):
        try:
            sys.modules["stripe"].reset_mock()
        except AttributeError:
            pass
    if "celery" in sys.modules and hasattr(sys.modules["celery"], "reset_mock"):
        try:
            sys.modules["celery"].reset_mock()
        except AttributeError:
            pass
    if "openai" in sys.modules and hasattr(sys.modules["openai"], "reset_mock"):
        try:
            sys.modules["openai"].reset_mock()
        except AttributeError:
            pass


@pytest.fixture(autouse=True)
def _cleanup_async_resources():
    """Clean up async resources between tests to prevent resource leaks."""
    yield
    # Cancel any pending asyncio tasks
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            # If loop is running, schedule cleanup
            pending = asyncio.all_tasks(loop)
            for task in pending:
                if not task.done():
                    task.cancel()
        else:
            # If loop is not running, we can clean up directly
            pending = asyncio.all_tasks(loop)
            for task in pending:
                if not task.done():
                    task.cancel()
            # Wait for cancellations to complete
            if pending:
                loop.run_until_complete(asyncio.gather(*pending, return_exceptions=True))
    except RuntimeError:
        # No event loop exists, nothing to clean up
        pass


def _reset_metadata(engine) -> None:
    """Drop all tables/views and recreate metadata from ORM mappings."""

    _safe_drop_schema(engine)
    Base.metadata.create_all(engine, checkfirst=True)


def _safe_drop_schema(engine) -> None:
    """Drop tables/views gracefully, ignoring missing objects."""
    try:
        with engine.begin() as connection:
            inspector = inspect(connection)

            if engine.dialect.name == "sqlite":
                # Disable foreign keys to allow dropping tables in any order
                connection.exec_driver_sql("PRAGMA foreign_keys=OFF")

            # Get all table names before dropping
            table_names = inspector.get_table_names()
            
            # Drop all tables
            for table_name in table_names:
                try:
                    connection.execute(text(f'DROP TABLE IF EXISTS "{table_name}"'))
                except (OperationalError, ProgrammingError):
                    # Table might already be dropped or have dependencies
                    pass

            # Drop all views
            for view_name in inspector.get_view_names():
                try:
                    connection.execute(text(f'DROP VIEW IF EXISTS "{view_name}"'))
                except (OperationalError, ProgrammingError):
                    pass

            if engine.dialect.name == "sqlite":
                # Re-enable foreign keys
                connection.exec_driver_sql("PRAGMA foreign_keys=ON")

        # Also use SQLAlchemy's drop_all as a fallback
        try:
            Base.metadata.drop_all(engine, checkfirst=True)
        except (OperationalError, ProgrammingError):
            # Some SQLite schemas may still reference missing tables; best-effort only.
            pass
    except Exception:
        # Best-effort cleanup - if it fails, the next test will create fresh schema
        pass


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
    try:
        with TestClient(app) as test_client:
            yield test_client
    finally:
        app.dependency_overrides.pop(get_db, None)


@pytest.fixture()
def db_session(engine):
    """Provide a SQLAlchemy session for direct database inspection."""

    SessionTesting = sessionmaker(bind=engine, autocommit=False, autoflush=False, future=True)
    session = SessionTesting()
    try:
        yield session
    finally:
        session.rollback()
        session.close()


__all__ = [
    "engine",
    "client",
    "db_session",
    "create_user",
    "create_organization",
    "auth_headers_solo",
    "auth_headers_growth",
    "auth_headers_professional",
    "auth_headers_admin",
    "_reset_database",
    "_reset_metadata",
    "_safe_drop_schema",
]


def pytest_ignore_collect(path, config):
    """Skip collecting reserved Windows device paths (e.g., `nul`)."""

    return path_safety.should_ignore_path(path)

def _make_token(clerk_user_id: str) -> str:
    payload = {
        "sub": clerk_user_id,
        "iat": int(datetime.now(timezone.utc).timestamp()),
    }
    return jwt.encode(payload, settings.clerk_secret_key, algorithm=settings.clerk_jwt_algorithm)


@pytest.fixture()
def create_user(db_session) -> Callable[..., User]:
    """Factory fixture to create a user record."""

    def _create_user(
        *,
        clerk_user_id: str | None = None,
        email: str | None = None,
        role: UserRole | str = UserRole.solo,
        first_name: str | None = None,
        last_name: str | None = None,
        organization_id: str | None = None,
        last_login_at: datetime | None = None,
        created_at_override: datetime | None = None,
    ) -> User:
        if isinstance(role, str):
            role_value = UserRole(role)
        else:
            role_value = role

        user = User(
            clerk_user_id=clerk_user_id or f"clerk_{uuid4()}",
            email=email or f"user_{uuid4()}@example.com",
            first_name=first_name,
            last_name=last_name,
            role=role_value,
            organization_id=organization_id,
            last_login_at=last_login_at,
        )
        if created_at_override:
            user.created_at = created_at_override
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
        return user

    return _create_user


@pytest.fixture()
def create_organization(db_session) -> Callable[..., Organization]:
    """Factory fixture to create an organization record."""

    def _create_org(
        *,
        name: str | None = None,
        subscription_tier: str = "starter",
    ) -> Organization:
        base_name = name or f"Organization {uuid4().hex[:6]}"
        slug_base = base_name.lower().replace(" ", "-")
        slug = f"{slug_base}-{uuid4().hex[:6]}"
        org = Organization(
            name=base_name,
            slug=slug,
            subscription_tier=subscription_tier,
        )
        db_session.add(org)
        db_session.commit()
        db_session.refresh(org)
        return org

    return _create_org



# Note: auth_headers_solo is defined later (line 389) with dependency override
# This earlier definition is kept for backward compatibility but may conflict
# The later definition (with dependency override) should be used


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
def master_admin_user(db_session):
    """Create and return a test master admin user."""
    from app.models.user import User
    from app.models.organization import Organization

    org = Organization(
        id="test-org-master-admin",
        name="Master Admin Test Org",
        slug="master-admin-test-org",
        subscription_tier="enterprise",
    )
    db_session.add(org)

    master_admin = User(
        id="test-master-admin-user-id",
        clerk_user_id="test_clerk_master_admin_user",
        email="master-admin@test.com",
        first_name="Master",
        last_name="Admin",
        role="master_admin",
        organization_id="test-org-master-admin",
    )
    db_session.add(master_admin)
    db_session.commit()
    db_session.refresh(master_admin)
    return master_admin


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
def auth_headers_master_admin(master_admin_user):
    """Provide authentication headers for a master admin user."""
    from app.api.dependencies.auth import (
        get_current_master_admin_user,
        get_current_user,
    )

    def override_user():
        return master_admin_user

    app.dependency_overrides[get_current_user] = override_user
    app.dependency_overrides[get_current_master_admin_user] = override_user

    headers = {"Authorization": "Bearer mock_master_admin_token"}
    try:
        yield headers
    finally:
        app.dependency_overrides.pop(get_current_user, None)
        app.dependency_overrides.pop(get_current_master_admin_user, None)


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


@pytest.fixture()
def test_deal(db_session, solo_user):
    """Create and return a test deal for document tests."""
    from app.models.deal import Deal

    deal = Deal(
        id="test-deal-id",
        name="Test M&A Deal",
        target_company="Acme Corp",
        stage="due_diligence",
        organization_id=solo_user.organization_id,
        owner_id=solo_user.id,
        deal_size=5000000,
        currency="USD"
    )
    db_session.add(deal)
    db_session.commit()
    db_session.refresh(deal)
    return deal


@pytest.fixture()
def test_user(solo_user):
    """Alias for solo_user to match test expectations."""
    return solo_user


@pytest.fixture()
def valuation_payload() -> dict:
    """Reusable valuation payload for valuation tests."""

    return {
        "forecast_years": 5,
        "discount_rate": 0.12,
        "terminal_growth_rate": 0.03,
        "terminal_method": "gordon_growth",
        "cash_flows": [500000, 650000, 800000, 950000, 1100000],
        "terminal_cash_flow": 1200000,
        "net_debt": 2000000,
        "shares_outstanding": 1000000,
    }


@pytest.fixture()
def auth_headers(solo_user):
    """Provide authentication headers using solo_user."""
    from app.api.dependencies.auth import get_current_user

    # Override the dependency to return our test solo user
    def override_get_current_user():
        return solo_user

    app.dependency_overrides[get_current_user] = override_get_current_user

    # Return headers (actual token doesn't matter since we override dependency)
    headers = {"Authorization": "Bearer mock_solo_token"}
    yield headers

    # Clean up override after test
    app.dependency_overrides.pop(get_current_user, None)


@pytest_asyncio.fixture()
async def async_client(engine):
    """Return an AsyncClient with overridden database dependency."""

    SessionTesting = sessionmaker(bind=engine, autocommit=False, autoflush=False, future=True)

    async def _get_db_override():
        db = SessionTesting()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = _get_db_override
    async with AsyncClient(app=app, base_url="http://testserver") as client:
        yield client
    app.dependency_overrides.pop(get_db, None)


@pytest.fixture()
def test_organization(db_session):
    """Create and return a test organization for subscription tests."""
    from app.models.organization import Organization

    org = Organization(
        id="test-org-subscription",
        name="Subscription Test Org",
        slug="subscription-test-org",
        subscription_tier="professional"
    )
    db_session.add(org)
    db_session.commit()
    db_session.refresh(org)
    return org


@pytest.fixture()
def test_org(test_organization):
    """Alias fixture expected by dashboard tests."""
    return test_organization


@pytest.fixture()
def test_subscription(db_session, test_organization):
    """Create and return a test subscription."""
    from app.models.subscription import Subscription, SubscriptionTier, SubscriptionStatus
    from datetime import datetime, timezone, timedelta

    subscription = Subscription(
        id="test-subscription-id",
        organization_id=test_organization.id,
        stripe_customer_id="cus_test_fixture",
        stripe_subscription_id="sub_test_fixture",
        tier=SubscriptionTier.PROFESSIONAL,
        status=SubscriptionStatus.ACTIVE,
        current_period_start=datetime.now(timezone.utc),
        current_period_end=datetime.now(timezone.utc) + timedelta(days=30),
    )
    db_session.add(subscription)
    db_session.commit()
    db_session.refresh(subscription)
    return subscription


@pytest.fixture()
def growth_user(create_user, create_organization, db_session):
    org = create_organization(subscription_tier="growth")
    user = create_user(role=UserRole.growth, organization_id=org.id)
    db_session.refresh(user)
    return user


@pytest.fixture()
def auth_headers_growth(growth_user):
    """Provide authentication headers for a growth-tier user (valuation access)."""
    from app.api.dependencies.auth import get_current_user

    def override_get_current_user():
        return growth_user

    app.dependency_overrides[get_current_user] = override_get_current_user
    headers = {"Authorization": "Bearer mock_growth_token"}
    yield headers
    app.dependency_overrides.pop(get_current_user, None)


@pytest.fixture()
def create_deal_for_org(db_session, create_user, create_organization, request):
    """Factory to create a deal tied to an organization and owner."""

    def _create(
        *,
        organization: Organization | None = None,
        organization_id: str | None = None,
        org_id: str | None = None,
        owner: User | None = None,
        owner_id: str | None = None,
        user_id: str | None = None,
        name: str = "Test Deal",
        stage: DealStage | str = DealStage.sourcing,
        target_company: str = "Target Co",
        currency: str = "GBP",
        **extra_deal_fields,
    ):
        if organization_id is None:
            organization_id = extra_deal_fields.pop("organization_id", None)
        if org_id is None:
            org_id = extra_deal_fields.pop("org_id", None)

        if owner_id is None:
            owner_id = extra_deal_fields.pop("owner_id", None)
        if user_id is None:
            user_id = extra_deal_fields.pop("user_id", None)

        org_identifier = organization_id or org_id
        owner_identifier = owner_id or user_id

        owner_user = owner
        if owner_user is None and owner_identifier:
            owner_user = db_session.get(User, owner_identifier)

        if owner_user is None:
            try:
                owner_user = request.getfixturevalue("growth_user")
            except FixtureLookupError:
                owner_user = None

        org = organization
        if org is None and org_identifier:
            org = db_session.get(Organization, org_identifier)

        if owner_user is not None:
            if org is None and owner_user.organization_id:
                org = db_session.get(Organization, owner_user.organization_id)
            if org is None:
                org = create_organization(subscription_tier="growth")
                owner_user.organization_id = org.id
                db_session.add(owner_user)
                db_session.commit()
        else:
            org = org or create_organization()
            owner_user = create_user(role=UserRole.growth, organization_id=org.id)

        stage_value = stage if isinstance(stage, DealStage) else DealStage(stage)

        deal_kwargs = {
            "id": f"deal-{uuid4()}",
            "organization_id": org.id,
            "name": name,
            "stage": stage_value,
            "owner_id": owner_user.id,
            "target_company": target_company,
            "currency": currency,
        }
        deal_kwargs.update(extra_deal_fields)

        deal = Deal(**deal_kwargs)
        db_session.add(deal)
        db_session.commit()
        db_session.refresh(deal)
        return deal, owner_user, org

    return _create


@pytest.fixture()
def match_org(create_organization):
    """Create organization for matching tests (professional tier for DEV-018)."""
    return create_organization(name="Match Test Org", subscription_tier="professional")


@pytest.fixture()
def match_user(create_user, match_org):
    """Create user for matching tests."""
    return create_user(
        clerk_user_id="clerk-match-test-1",
        email="matchtest@example.com",
        organization_id=match_org.id,
    )


@pytest.fixture()
def match_deal(create_deal_for_org, match_org, match_user):
    """Create deal for matching tests."""
    deal, _, _ = create_deal_for_org(
        organization=match_org,
        owner=match_user,
        name="Test Acquisition Target",
        target_company="Acme SaaS Inc",
        stage="evaluation",
    )
    return deal


@pytest.fixture()
def auth_headers_match(match_user):
    """Provide auth headers for match_user (professional tier for DEV-018)."""
    from app.api.dependencies.auth import get_current_user

    def override_get_current_user():
        return match_user

    app.dependency_overrides[get_current_user] = override_get_current_user
    headers = {"Authorization": "Bearer mock_match_token"}
    yield headers
    app.dependency_overrides.pop(get_current_user, None)





# ============================================================================
# Master Admin Portal Fixtures
# ============================================================================

@pytest.fixture
def test_prospect(db_session, test_user):
    """Create a test prospect for Master Admin activity linking."""
    from app.models.master_admin import AdminProspect, ProspectStatus
    
    prospect = AdminProspect(
        user_id=test_user.id,
        name="Test Prospect",
        email="prospect@example.com",
        company="Test Company",
        status=ProspectStatus.NEW
    )
    db_session.add(prospect)
    db_session.commit()
    db_session.refresh(prospect)
    return prospect
