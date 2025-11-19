"""Helpers for seeding default organizations and admin users."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Tuple

from sqlalchemy.exc import SQLAlchemyError, OperationalError
from sqlalchemy.orm import Session

from app.models.organization import Organization
from app.models.user import User, UserRole
from app.services import organization_service, user_service


@dataclass(slots=True)
class TenantSeedConfig:
    """Configuration for seeding a tenant + admin user."""

    organization_id: str
    organization_name: str
    organization_slug: str
    subscription_tier: str
    admin_clerk_user_id: str
    admin_email: str
    admin_first_name: str
    admin_last_name: str
    admin_role: UserRole = UserRole.admin


def ensure_tenant_admin(db: Session, config: TenantSeedConfig) -> Tuple[Organization, User]:
    """Ensure a tenant organization and its admin user exist.

    Args:
        db: Active database session
        config: Tenant seed configuration

    Returns:
        Tuple of (Organization, User)
    """
    org_payload = {
        "id": config.organization_id,
        "name": config.organization_name,
        "slug": config.organization_slug,
        "public_metadata": {"subscription_tier": config.subscription_tier},
    }
    try:
        organization = organization_service.upsert_from_clerk(db, org_payload)

        user_payload = {
            "id": config.admin_clerk_user_id,
            "email": config.admin_email,
            "first_name": config.admin_first_name,
            "last_name": config.admin_last_name,
            "organization_id": config.organization_id,
            "public_metadata": {"role": config.admin_role.value},
        }
        user = user_service.create_user_from_clerk(db, user_payload)
    except OperationalError as exc:  # pragma: no cover - handled in tests with sqlite memory
        raise RuntimeError(
            "Database schema is missing required tables. Run migrations before seeding tenants."
        ) from exc
    except SQLAlchemyError:
        raise

    if user.organization_id != config.organization_id:
        user.organization_id = config.organization_id
        db.commit()
        db.refresh(user)
    return organization, user


__all__ = ["TenantSeedConfig", "ensure_tenant_admin"]
