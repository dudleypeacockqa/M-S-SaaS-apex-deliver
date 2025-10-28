"""Pytest fixtures for backend tests."""
from __future__ import annotations

import os
import sys
from collections.abc import Callable, Iterator
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

import pytest
from unittest.mock import MagicMock
from fastapi.testclient import TestClient
from httpx import AsyncClient
from jose import jwt
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from _pytest.fixtures import FixtureLookupError

# Ensure the backend directory is on sys.path for "app" imports
BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:  # pragma: no cover - import guard
    sys.path.insert(0, str(BACKEND_ROOT))

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

from app.core.config import get_settings, settings  # noqa: E402
from app.db import session as session_module  # noqa: E402
from app.db.base import Base  # noqa: E402
from app.db.session import get_db  # noqa: E402
stripe_mock = MagicMock()
stripe_module = stripe_mock
sys.modules.setdefault("stripe", stripe_module)

import importlib

from app.main import app  # noqa: E402
from app.models.user import User, UserRole  # noqa: E402
from app.models.organization import Organization  # noqa: E402
from app.models.document import Document, Folder, DocumentPermission, DocumentAccessLog  # noqa: E402, F401
from app.models.deal import Deal, DealStage  # noqa: E402, F401
from app.models.valuation import ValuationModel, ComparableCompany, PrecedentTransaction, ValuationScenario, ValuationExportLog
from app.models.podcast import PodcastEpisode, PodcastTranscript, PodcastAnalytics

# Clear the settings cache to ensure test configuration is used
get_settings.cache_clear()


@pytest.fixture(scope="session")
def engine():
    """Create a shared SQLite engine for tests."""

    connect_args = {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}

    if settings.database_url.startswith("sqlite"):
        db_path = settings.database_url.replace("sqlite:///", "")
        db_path = Path(db_path)
        if not db_path.is_absolute():
            db_path = Path.cwd() / db_path
        if db_path.exists():
            try:
                db_path.unlink()
            except PermissionError:
                # On Windows the previous connection may still be closing; ignore and reuse file
                pass

    engine = create_engine(settings.database_url, future=True, connect_args=connect_args)
    Base.metadata.drop_all(engine, checkfirst=True)
    Base.metadata.create_all(engine, checkfirst=True)
    session_module.engine = engine
    session_module.SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False, future=True)
    yield engine
    Base.metadata.drop_all(engine, checkfirst=True)
    engine.dispose()


@pytest.fixture(autouse=True)
def _reset_database(engine):
    """Ensure each test runs with a clean database state."""

    yield
    Base.metadata.drop_all(engine, checkfirst=True)
    Base.metadata.create_all(engine, checkfirst=True)


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
        slug = (name or f"org-{uuid4().hex[:8]}").lower().replace(" ", "-")
        org = Organization(
            name=name or f"Organization {uuid4().hex[:6]}",
            slug=slug,
            subscription_tier=subscription_tier,
        )
        db_session.add(org)
        db_session.commit()
        db_session.refresh(org)
        return org

    return _create_org


@pytest.fixture()
def auth_headers_admin(create_user) -> dict[str, str]:
    admin_user = create_user(role=UserRole.admin, email="admin@example.com")
    token = _make_token(admin_user.clerk_user_id)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture()
def auth_headers_solo(create_user) -> dict[str, str]:
    solo_user = create_user(role=UserRole.solo, email="solo@example.com")
    token = _make_token(solo_user.clerk_user_id)
    return {"Authorization": f"Bearer {token}"}


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


@pytest.fixture()
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
        owner: User | None = None,
        name: str = "Test Deal",
        stage: DealStage | str = DealStage.sourcing,
        target_company: str = "Target Co",
        currency: str = "GBP",
    ):
        owner_user = owner
        if owner_user is None:
            try:
                owner_user = request.getfixturevalue("growth_user")
            except FixtureLookupError:
                owner_user = None

        if owner_user is not None:
            org = organization
            if org is None:
                org = db_session.query(Organization).filter(Organization.id == owner_user.organization_id).first()
            if org is None:
                org = create_organization(subscription_tier="growth")
                owner_user.organization_id = org.id
                db_session.add(owner_user)
                db_session.commit()
        else:
            org = organization or create_organization()
            owner_user = create_user(role=UserRole.growth, organization_id=org.id)

        stage_value = stage if isinstance(stage, DealStage) else DealStage(stage)

        deal = Deal(
            id=f"deal-{uuid4()}",
            organization_id=org.id,
            name=name,
            stage=stage_value,
            owner_id=owner_user.id,
            target_company=target_company,
            currency=currency,
        )
        db_session.add(deal)
        db_session.commit()
        db_session.refresh(deal)
        return deal, owner_user, org

    return _create
