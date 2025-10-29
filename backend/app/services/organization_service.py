from __future__ import annotations

import re
import uuid
from typing import Any, Optional

from sqlalchemy.orm import Session

from app.core.subscription import SubscriptionTier
from app.models.organization import Organization


def _slugify(name: str) -> str:
    """Convert name into a URL-friendly slug."""

    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return slug or f"org-{uuid.uuid4().hex[:8]}"


def _ensure_unique_slug(db: Session, desired_slug: str, *, exclude_id: Optional[str] = None) -> str:
    """Ensure slug is unique within organizations table."""

    base_slug = desired_slug
    suffix = 1

    query = db.query(Organization).filter(Organization.slug == desired_slug)
    if exclude_id:
        query = query.filter(Organization.id != exclude_id)

    while query.first() is not None:
        desired_slug = f"{base_slug}-{suffix}"
        suffix += 1
        query = db.query(Organization).filter(Organization.slug == desired_slug)
        if exclude_id:
            query = query.filter(Organization.id != exclude_id)

    return desired_slug


def _normalize_subscription_tier(value: Any) -> str:
    """Normalize subscription tier values from Clerk metadata."""

    if isinstance(value, SubscriptionTier):
        return value.value

    if isinstance(value, str):
        candidate = value.strip().lower()
        if candidate in {tier.value for tier in SubscriptionTier}:
            return candidate

    return SubscriptionTier.STARTER.value


def _coerce_metadata(data: dict[str, Any]) -> tuple[str, str, str]:
    """Extract name, slug, subscription tier from Clerk payload with fallbacks."""

    name = data.get("name") or "Untitled Organization"
    slug = data.get("slug") or _slugify(name)
    public_metadata = data.get("public_metadata") or {}
    tier = _normalize_subscription_tier(public_metadata.get("subscription_tier"))
    return name, slug, tier


def upsert_from_clerk(db: Session, clerk_data: dict[str, Any]) -> Organization:
    """Create or update an organization based on Clerk webhook payload."""

    org_id = clerk_data.get("id")
    if not org_id:
        raise ValueError("Clerk webhook data missing required 'id' field for organization")

    name, slug, tier = _coerce_metadata(clerk_data)

    organization = db.get(Organization, org_id)
    if organization:
        organization.name = name
        if slug != organization.slug:
            organization.slug = _ensure_unique_slug(db, slug, exclude_id=org_id)
        organization.subscription_tier = tier
        organization.is_active = True
    else:
        unique_slug = _ensure_unique_slug(db, slug)
        organization = Organization(
            id=org_id,
            name=name,
            slug=unique_slug,
            subscription_tier=tier,
            is_active=True,
        )
        db.add(organization)

    db.commit()
    db.refresh(organization)
    return organization


def deactivate_organization(db: Session, organization_id: str) -> Optional[Organization]:
    """Mark an organization as inactive."""

    organization = db.get(Organization, organization_id)
    if organization is None:
        return None

    organization.is_active = False
    db.commit()
    db.refresh(organization)
    return organization


__all__ = ["upsert_from_clerk", "deactivate_organization"]
