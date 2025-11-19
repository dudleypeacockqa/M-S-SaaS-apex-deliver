"""Seed the Digital Growth Equity tenant and admin account."""
from __future__ import annotations

import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

POSSIBLE_BACKEND_ROOTS = (
    Path(__file__).resolve().parents[1],
    Path.cwd() / "backend",
    Path("/app/backend"),
)
for backend_root in POSSIBLE_BACKEND_ROOTS:
    if backend_root.exists():
        sys.path.insert(0, str(backend_root))
        break

from app.db.base import Base  # noqa: E402
from app.models.user import UserRole  # noqa: E402
from app.services.seed_service import TenantSeedConfig, ensure_tenant_admin  # noqa: E402

DEFAULT_ORG_ID = "5d8c8fe8-2dd2-4d0f-b6eb-5c22a2d6d9e0"
DEFAULT_ORG_NAME = "Digital Growth Equity"
DEFAULT_ORG_SLUG = "digital-growth-equity"
DEFAULT_SUBSCRIPTION_TIER = "professional"
DEFAULT_ADMIN_CLERK_ID = "clerk_digital_growth_equity_admin"
DEFAULT_ADMIN_EMAIL = "dudley.peacock@icloud.com"
DEFAULT_ADMIN_FIRST_NAME = "Dudley"
DEFAULT_ADMIN_LAST_NAME = "Peacock"


def get_session() -> Session:
    load_dotenv()
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL environment variable is not set")

    engine = create_engine(database_url)
    Base.metadata.bind = engine
    return sessionmaker(bind=engine)()


def build_config() -> TenantSeedConfig:
    return TenantSeedConfig(
        organization_id=os.getenv("DIGITAL_GROWTH_EQUITY_ORG_ID", DEFAULT_ORG_ID),
        organization_name=os.getenv("DIGITAL_GROWTH_EQUITY_NAME", DEFAULT_ORG_NAME),
        organization_slug=os.getenv("DIGITAL_GROWTH_EQUITY_SLUG", DEFAULT_ORG_SLUG),
        subscription_tier=os.getenv("DIGITAL_GROWTH_EQUITY_TIER", DEFAULT_SUBSCRIPTION_TIER),
        admin_clerk_user_id=os.getenv("DIGITAL_GROWTH_EQUITY_CLERK_ID", DEFAULT_ADMIN_CLERK_ID),
        admin_email=os.getenv("DIGITAL_GROWTH_EQUITY_ADMIN_EMAIL", DEFAULT_ADMIN_EMAIL),
        admin_first_name=os.getenv("DIGITAL_GROWTH_EQUITY_ADMIN_FIRST_NAME", DEFAULT_ADMIN_FIRST_NAME),
        admin_last_name=os.getenv("DIGITAL_GROWTH_EQUITY_ADMIN_LAST_NAME", DEFAULT_ADMIN_LAST_NAME),
        admin_role=UserRole.admin,
    )


def run_seed() -> None:
    config = build_config()
    session = get_session()
    try:
        organization, user = ensure_tenant_admin(session, config)
        print(
            f"[SUCCESS] Tenant '{organization.name}' ensured with admin {user.email}."
        )
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


if __name__ == "__main__":
    run_seed()
