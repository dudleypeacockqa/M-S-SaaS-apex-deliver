"""Subscription and billing API endpoints for DEV-009.

Implements:
- US-9.1: Select subscription tier (checkout session creation)
- US-9.2: View subscription status
- US-9.3: Upgrade/downgrade subscription
- US-9.4: Cancel subscription
- US-9.5: Stripe webhook handling
"""
import os
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Request, Header
from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.db.session import get_db
from app.models.organization import Organization
from app.models.subscription import Invoice, Subscription, SubscriptionTier
from app.models.user import User
from app.models.deal import Deal
from app.models.document import Document
from app.schemas.subscription import (
    BillingDashboardResponse,
    CancelSubscriptionRequest,
    CheckoutSessionResponse,
    InvoiceResponse,
    SubscriptionCreate,
    SubscriptionResponse,
    SubscriptionUpdate,
    TierDetails,
    TierFeatures,
    UsageMetrics,
)
from app.services import subscription_service

router = APIRouter(prefix="/billing", tags=["billing", "subscriptions"])


def create_checkout_session(
    subscription_data: SubscriptionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a Stripe Checkout Session for subscription purchase."""
    try:
        result = subscription_service.create_checkout_session(
            organization_id=current_user.organization_id,
            tier=subscription_data.tier,
            billing_period="monthly",
            success_url=subscription_data.success_url,
            cancel_url=subscription_data.cancel_url,
            db=db,
        )
        return CheckoutSessionResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create checkout session: {str(e)}")


def get_my_subscription(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get current user's subscription details."""
    subscription = subscription_service.get_organization_subscription(
        current_user.organization_id, db
    )
    if not subscription:
        raise HTTPException(status_code=404, detail="No subscription found for your organization")
    return SubscriptionResponse.model_validate(subscription)


def get_billing_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get complete billing dashboard data."""
    subscription = subscription_service.get_organization_subscription(
        current_user.organization_id, db
    )
    if not subscription:
        raise HTTPException(status_code=404, detail="No subscription found")
    result = db.execute(
        select(func.count(Deal.id)).filter(
            Deal.organization_id == current_user.organization_id,
            Deal.archived_at.is_(None),
        )
    )
    deals_count = result.scalar()

    result = db.execute(
        select(func.count(User.id)).filter(
            User.organization_id == current_user.organization_id,
            User.deleted_at.is_(None),
        )
    )
    users_count = result.scalar()

    result = db.execute(
        select(func.count(Document.id)).filter(
            Document.organization_id == current_user.organization_id,
            Document.archived_at.is_(None),
        )
    )
    documents_count = result.scalar()
    usage = UsageMetrics(
        deals_count=deals_count or 0,
        users_count=users_count or 0,
        documents_count=documents_count or 0,
        storage_used_mb=0,
    )
    tier_config = subscription_service.TIER_CONFIG[subscription.tier]
    tier_details = TierDetails(
        tier=subscription.tier,
        name=tier_config["name"],
        price_monthly=tier_config["price_monthly"],
        price_annual=tier_config["price_annual"],
        description=tier_config["description"],
        features=TierFeatures(**tier_config["features"]),
        stripe_price_id_monthly=tier_config["stripe_price_id_monthly"],
        stripe_price_id_annual=tier_config["stripe_price_id_annual"],
    )
    result = db.execute(
        select(Invoice)
        .filter(Invoice.subscription_id == subscription.id)
        .order_by(Invoice.created_at.desc())
        .limit(3)
    )
    recent_invoices_objs = result.scalars().all()
    recent_invoices = [InvoiceResponse.model_validate(inv) for inv in recent_invoices_objs]
    return BillingDashboardResponse(
        subscription=SubscriptionResponse.model_validate(subscription),
        usage=usage,
        tier_details=tier_details,
        recent_invoices=recent_invoices,
        upcoming_invoice_amount=None,
    )


def change_subscription_tier(
    tier_update: SubscriptionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Change subscription tier (upgrade or downgrade)."""
    try:
        updated_subscription = subscription_service.update_subscription_tier(
            organization_id=current_user.organization_id,
            new_tier=tier_update.new_tier,
            prorate=tier_update.prorate,
            db=db,
        )
        return SubscriptionResponse.model_validate(updated_subscription)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update subscription: {str(e)}")


def cancel_my_subscription(
    cancel_request: CancelSubscriptionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Cancel the current subscription."""
    try:
        canceled_subscription = subscription_service.cancel_subscription(
            organization_id=current_user.organization_id,
            immediately=cancel_request.immediately,
            db=db,
        )
        return SubscriptionResponse.model_validate(canceled_subscription)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to cancel subscription: {str(e)}")


@router.get("/tiers", response_model=List[TierDetails])
def get_all_tiers():
    """Get information about all available subscription tiers."""
    tiers = []
    for tier, config in subscription_service.TIER_CONFIG.items():
        tiers.append(
            TierDetails(
                tier=tier,
                name=config["name"],
                price_monthly=config["price_monthly"],
                price_annual=config["price_annual"],
                description=config["description"],
                features=TierFeatures(**config["features"]),
                stripe_price_id_monthly=config["stripe_price_id_monthly"],
                stripe_price_id_annual=config["stripe_price_id_annual"],
            )
        )
    return tiers


@router.post("/webhooks/stripe")
def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(None, alias="stripe-signature"),
    db: Session = Depends(get_db),
):
    """Handle Stripe webhook events."""
    import stripe
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
    if not webhook_secret:
        raise HTTPException(status_code=500, detail="Stripe webhook secret not configured")
    body_bytes = request.body()
    try:
        event = stripe.Webhook.construct_event(body_bytes, stripe_signature, webhook_secret)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    event_type = event["type"]
    event_data = event["data"]
    try:
        if event_type == "checkout.session.completed":
            subscription_service.handle_checkout_completed(event_data, db)

        elif event_type == "invoice.paid":
            subscription_service.handle_invoice_paid(event_data, db)

        elif event_type == "customer.subscription.updated":
            subscription_service.handle_subscription_updated(event_data, db)

        elif event_type == "customer.subscription.deleted":
            subscription_service.handle_subscription_deleted(event_data, db)
    except Exception as e:
        print(f"Error processing webhook event {event_type}: {str(e)}")
    return {"status": "success"}
