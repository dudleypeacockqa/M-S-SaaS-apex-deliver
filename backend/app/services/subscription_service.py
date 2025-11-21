"""Subscription service layer for DEV-009: Subscription & Billing Management.

Handles Stripe integration, subscription lifecycle, and billing operations.
"""
from __future__ import annotations

import os
from datetime import datetime, timezone, timedelta
from decimal import Decimal
from typing import Optional

import stripe
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.organization import Organization
from app.models.subscription import (
    Invoice,
    Subscription,
    SubscriptionStatus,
    SubscriptionTier,
)

# Initialize Stripe
stripe.api_key = settings.stripe_secret_key or os.getenv("STRIPE_SECRET_KEY")


# ============================================================================
# Tier Configuration
# ============================================================================

TIER_CONFIG = {
    SubscriptionTier.STARTER: {
        "name": "Starter Plan",
        "price_monthly": Decimal("279.00"),
        "price_annual": Decimal("2790.00"),
        "description": "Perfect for solo dealmakers and entrepreneurs",
        "stripe_price_id_monthly": os.getenv("STRIPE_PRICE_STARTER_MONTHLY", "price_starter_monthly"),
        "stripe_price_id_annual": os.getenv("STRIPE_PRICE_STARTER_ANNUAL", "price_starter_annual"),
        "features": {
            "max_deals": 10,
            "max_users": 3,
            "max_documents_per_deal": 50,
            "storage_gb": 5,
            "financial_intelligence": False,
            "deal_matching": False,
            "api_access": False,
            "priority_support": False,
            "custom_branding": False,
        },
    },
    SubscriptionTier.PROFESSIONAL: {
        "name": "Professional Plan",
        "price_monthly": Decimal("598.00"),
        "price_annual": Decimal("5980.00"),
        "description": "For growing M&A advisory firms",
        "stripe_price_id_monthly": os.getenv("STRIPE_PRICE_PROFESSIONAL_MONTHLY", "price_professional_monthly"),
        "stripe_price_id_annual": os.getenv("STRIPE_PRICE_PROFESSIONAL_ANNUAL", "price_professional_annual"),
        "features": {
            "max_deals": 50,
            "max_users": 10,
            "max_documents_per_deal": 200,
            "storage_gb": 50,
            "financial_intelligence": True,
            "deal_matching": True,
            "api_access": False,
            "priority_support": True,
            "custom_branding": False,
        },
    },
    SubscriptionTier.ENTERPRISE: {
        "name": "Enterprise Plan",
        "price_monthly": Decimal("1598.00"),
        "price_annual": Decimal("15980.00"),
        "description": "For large investment banks and corporate dev teams",
        "stripe_price_id_monthly": os.getenv("STRIPE_PRICE_ENTERPRISE_MONTHLY", "price_enterprise_monthly"),
        "stripe_price_id_annual": os.getenv("STRIPE_PRICE_ENTERPRISE_ANNUAL", "price_enterprise_annual"),
        "features": {
            "max_deals": 999,
            "max_users": 100,
            "max_documents_per_deal": 1000,
            "storage_gb": 500,
            "financial_intelligence": True,
            "deal_matching": True,
            "api_access": True,
            "priority_support": True,
            "custom_branding": True,
        },
    },
    SubscriptionTier.COMMUNITY: {
        "name": "Community Plan",
        "price_monthly": Decimal("2997.00"),
        "price_annual": Decimal("29970.00"),
        "description": "For industry influencers and event organizers",
        "stripe_price_id_monthly": os.getenv("STRIPE_PRICE_COMMUNITY_MONTHLY", "price_community_monthly"),
        "stripe_price_id_annual": os.getenv("STRIPE_PRICE_COMMUNITY_ANNUAL", "price_community_annual"),
        "features": {
            "max_deals": 999,
            "max_users": 999,
            "max_documents_per_deal": 2000,
            "storage_gb": 1000,
            "financial_intelligence": True,
            "deal_matching": True,
            "api_access": True,
            "priority_support": True,
            "custom_branding": True,
        },
    },
}


def _execute(db: Session, statement):
    return db.execute(statement)


def create_checkout_session(
    organization_id: str,
    tier: SubscriptionTier,
    billing_period: str = "monthly",
    success_url: str | None = None,
    cancel_url: str | None = None,
    db: Session | None = None,
) -> dict:
    if db is None:  # pragma: no cover - defensive guard
        raise ValueError("Database session is required")

    result = _execute(db, select(Organization).where(Organization.id == organization_id))
    organization = result.scalar_one_or_none()
    if not organization:
        raise ValueError("Organization not found")

    tier_config = TIER_CONFIG.get(tier)
    if not tier_config:
        raise ValueError(f"Invalid tier: {tier}")

    price_id = (
        tier_config["stripe_price_id_annual"]
        if billing_period == "annual"
        else tier_config["stripe_price_id_monthly"]
    )

    if not success_url:
        success_url = f"{os.getenv('FRONTEND_URL', 'http://localhost:5173')}/dashboard?subscription=success"
    if not cancel_url:
        cancel_url = f"{os.getenv('FRONTEND_URL', 'http://localhost:5173')}/pricing?subscription=canceled"

    result = _execute(
        db,
        select(Subscription).where(Subscription.organization_id == organization_id)
    )
    existing_subscription = result.scalar_one_or_none()

    if existing_subscription and existing_subscription.stripe_customer_id:
        customer_id = existing_subscription.stripe_customer_id
    else:
        customer = stripe.Customer.create(
            email=f"org-{organization_id}@placeholder.com",
            metadata={"organization_id": organization_id, "organization_name": organization.name},
        )
        customer_id = customer.id

    session = stripe.checkout.Session.create(
        customer=customer_id,
        payment_method_types=["card"],
        line_items=[{"price": price_id, "quantity": 1}],
        mode="subscription",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={"organization_id": organization_id, "tier": tier.value, "billing_period": billing_period},
        subscription_data={
            "trial_period_days": 14,
            "metadata": {"organization_id": organization_id, "tier": tier.value},
        },
    )

    if existing_subscription:
        existing_subscription.stripe_customer_id = customer_id
        existing_subscription.tier = tier
        existing_subscription.status = SubscriptionStatus.TRIALING
        existing_subscription.trial_start = datetime.now(timezone.utc)
        existing_subscription.trial_end = datetime.now(timezone.utc) + timedelta(days=14)
        existing_subscription.updated_at = datetime.now(timezone.utc)
    else:
        existing_subscription = Subscription(
            organization_id=organization_id,
            stripe_customer_id=customer_id,
            tier=tier,
            status=SubscriptionStatus.TRIALING,
            trial_start=datetime.now(timezone.utc),
            trial_end=datetime.now(timezone.utc) + timedelta(days=14),
        )
        db.add(existing_subscription)

    db.commit()

    return {"checkout_url": session.url, "session_id": session.id}


def create_billing_portal_session(
    organization_id: str,
    return_url: str | None = None,
    db: Session | None = None,
) -> dict:
    """
    Create a Stripe Billing Portal session so customers can manage payment methods.
    """
    if db is None:  # pragma: no cover - defensive guard
        raise ValueError("Database session is required")

    subscription = get_organization_subscription(organization_id, db)
    if not subscription:
        raise ValueError("No active subscription found")
    if not subscription.stripe_customer_id:
        raise ValueError("Subscription does not have a Stripe customer ID")

    portal_session = stripe.billing_portal.Session.create(
        customer=subscription.stripe_customer_id,
        return_url=return_url or f"{os.getenv('FRONTEND_URL', 'http://localhost:5173')}/dashboard/billing",
    )

    return {"url": portal_session.url}


def get_organization_subscription(
    organization_id: str,
    db: Session | AsyncSession,
) -> Optional[Subscription]:
    result = _execute(
        db,
        select(Subscription)
        .where(Subscription.organization_id == organization_id)
        .options(selectinload(Subscription.organization)),
    )
    return result.scalar_one_or_none()


def update_subscription_tier(
    organization_id: str,
    new_tier: SubscriptionTier,
    prorate: bool = True,
    db: Session | AsyncSession | None = None,
) -> Subscription:
    if db is None:  # pragma: no cover - defensive guard
        raise ValueError("Database session is required")
    subscription = get_organization_subscription(organization_id, db)
    if not subscription:
        raise ValueError("No active subscription found")
    if not subscription.stripe_subscription_id:
        raise ValueError("Subscription not yet activated")

    new_tier_config = TIER_CONFIG.get(new_tier)
    if not new_tier_config:
        raise ValueError(f"Invalid tier: {new_tier}")

    stripe_subscription = stripe.Subscription.retrieve(subscription.stripe_subscription_id)
    stripe.Subscription.modify(
        subscription.stripe_subscription_id,
        items=[{"id": stripe_subscription["items"]["data"][0].id, "price": new_tier_config["stripe_price_id_monthly"]}],
        proration_behavior="create_prorations" if prorate else "none",
    )

    subscription.tier = new_tier
    subscription.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(subscription)
    return subscription


def cancel_subscription(
    organization_id: str,
    immediately: bool = False,
    db: Session | AsyncSession | None = None,
) -> Subscription:
    if db is None:  # pragma: no cover - defensive guard
        raise ValueError("Database session is required")
    subscription = get_organization_subscription(organization_id, db)
    if not subscription:
        raise ValueError("No active subscription found")
    if not subscription.stripe_subscription_id:
        raise ValueError("Subscription not yet activated")

    if immediately:
        stripe.Subscription.delete(subscription.stripe_subscription_id)
        subscription.status = SubscriptionStatus.CANCELED
        subscription.canceled_at = datetime.now(timezone.utc)
    else:
        stripe.Subscription.modify(subscription.stripe_subscription_id, cancel_at_period_end=True)
        subscription.cancel_at_period_end = True

    subscription.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(subscription)
    return subscription


def handle_checkout_completed(event_data: dict, db: Session | AsyncSession) -> None:
    session = event_data["object"]
    organization_id = session["metadata"]["organization_id"]
    stripe_subscription_id = session["subscription"]
    stripe_customer_id = session["customer"]

    stripe_subscription = stripe.Subscription.retrieve(stripe_subscription_id)
    result = _execute(db, select(Subscription).where(Subscription.organization_id == organization_id))
    subscription = result.scalar_one_or_none()
    if subscription:
        subscription.stripe_subscription_id = stripe_subscription_id
        subscription.stripe_customer_id = stripe_customer_id
        subscription.status = SubscriptionStatus.ACTIVE
        subscription.current_period_start = datetime.fromtimestamp(
            stripe_subscription["current_period_start"], tz=timezone.utc
        )
        subscription.current_period_end = datetime.fromtimestamp(
            stripe_subscription["current_period_end"], tz=timezone.utc
        )
        subscription.updated_at = datetime.now(timezone.utc)
        db.commit()


def handle_invoice_paid(event_data: dict, db: Session | AsyncSession) -> None:
    invoice_data = event_data["object"]
    stripe_invoice_id = invoice_data["id"]
    stripe_customer_id = invoice_data["customer"]

    result = _execute(db, select(Subscription).where(Subscription.stripe_customer_id == stripe_customer_id))
    subscription = result.scalar_one_or_none()
    if not subscription:
        return

    invoice = Invoice(
        organization_id=subscription.organization_id,
        subscription_id=subscription.id,
        stripe_invoice_id=stripe_invoice_id,
        amount=Decimal(str(invoice_data["amount_paid"] / 100)),
        currency=invoice_data["currency"].upper(),
        status="paid",
        paid_at=datetime.fromtimestamp(invoice_data["status_transitions"]["paid_at"], tz=timezone.utc),
        invoice_pdf=invoice_data.get("invoice_pdf"),
    )
    db.add(invoice)
    db.commit()


def handle_subscription_updated(event_data: dict, db: Session | AsyncSession) -> None:
    subscription_data = event_data["object"]
    stripe_subscription_id = subscription_data["id"]

    result = _execute(db, select(Subscription).where(Subscription.stripe_subscription_id == stripe_subscription_id))
    subscription = result.scalar_one_or_none()
    if not subscription:
        return

    subscription.status = SubscriptionStatus(subscription_data["status"])
    subscription.current_period_start = datetime.fromtimestamp(
        subscription_data["current_period_start"], tz=timezone.utc
    )
    subscription.current_period_end = datetime.fromtimestamp(
        subscription_data["current_period_end"], tz=timezone.utc
    )
    subscription.cancel_at_period_end = subscription_data.get("cancel_at_period_end", False)
    if subscription_data.get("canceled_at"):
        subscription.canceled_at = datetime.fromtimestamp(subscription_data["canceled_at"], tz=timezone.utc)
    subscription.updated_at = datetime.now(timezone.utc)
    db.commit()


def handle_subscription_deleted(event_data: dict, db: Session | AsyncSession) -> None:
    subscription_data = event_data["object"]
    stripe_subscription_id = subscription_data["id"]

    result = _execute(db, select(Subscription).where(Subscription.stripe_subscription_id == stripe_subscription_id))
    subscription = result.scalar_one_or_none()
    if not subscription:
        return

    subscription.status = SubscriptionStatus.CANCELED
    subscription.canceled_at = datetime.now(timezone.utc)
    subscription.updated_at = datetime.now(timezone.utc)
    db.commit()
