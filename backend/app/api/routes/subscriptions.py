"""Subscription and billing API endpoints for DEV-009.

Implements:
- US-9.1: Select subscription tier (checkout session creation)
- US-9.2: View subscription status
- US-9.3: Upgrade/downgrade subscription
- US-9.4: Cancel subscription
- US-9.5: Stripe webhook handling
"""
import os
import math
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Request, Header
from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.api.dependencies.tenant_scope import AccessScope, get_access_scope
from app.core.permissions import Permission, require_permission
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
    CustomerPortalResponse,
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


@router.post("/create-checkout-session", response_model=CheckoutSessionResponse)
def create_checkout_session(
    subscription_data: SubscriptionCreate,
    scope: AccessScope = Depends(get_access_scope),
    _: User = Depends(require_permission(Permission.BILLING_VIEW)),
    db: Session = Depends(get_db),
):
    """Create a Stripe Checkout Session for subscription purchase."""
    organization_id = scope.require_organization_id()
    try:
        result = subscription_service.create_checkout_session(
            organization_id=organization_id,
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


@router.get("/customer-portal", response_model=CustomerPortalResponse)
def create_customer_portal_session(
    scope: AccessScope = Depends(get_access_scope),
    _: User = Depends(require_permission(Permission.BILLING_VIEW)),
    db: Session = Depends(get_db),
):
    """Create a Stripe Billing Portal session so customers can manage payment methods."""
    organization_id = scope.require_organization_id()
    try:
        session = subscription_service.create_billing_portal_session(
            organization_id=organization_id,
            return_url=f"{os.getenv('FRONTEND_URL', 'http://localhost:5173')}/dashboard/billing",
            db=db,
        )
        return CustomerPortalResponse(**session)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create billing portal session: {str(e)}")


@router.get("/me", response_model=SubscriptionResponse)
def get_my_subscription(
    scope: AccessScope = Depends(get_access_scope),
    _: User = Depends(require_permission(Permission.BILLING_VIEW)),
    db: Session = Depends(get_db),
):
    """Get current user's subscription details."""
    organization_id = scope.require_organization_id()
    subscription = subscription_service.get_organization_subscription(organization_id, db)
    if not subscription:
        raise HTTPException(status_code=404, detail="No subscription found for your organization")
    return SubscriptionResponse.model_validate(subscription)


@router.get("/billing-dashboard", response_model=BillingDashboardResponse)
def get_billing_dashboard(
    scope: AccessScope = Depends(get_access_scope),
    _: User = Depends(require_permission(Permission.BILLING_VIEW)),
    db: Session = Depends(get_db),
):
    """Get complete billing dashboard data."""
    organization_id = scope.require_organization_id()
    subscription = subscription_service.get_organization_subscription(organization_id, db)
    if not subscription:
        raise HTTPException(status_code=404, detail="No subscription found")
    result = db.execute(
        select(func.count(Deal.id)).filter(
            Deal.organization_id == organization_id,
            Deal.archived_at.is_(None),
        )
    )
    deals_count = result.scalar()

    result = db.execute(
        select(func.count(User.id)).filter(
            User.organization_id == organization_id,
            User.deleted_at.is_(None),
        )
    )
    users_count = result.scalar()

    result = db.execute(
        select(func.count(Document.id)).filter(
            Document.organization_id == organization_id,
            Document.archived_at.is_(None),
        )
    )
    documents_count = result.scalar()

    storage_bytes_result = db.execute(
        select(func.coalesce(func.sum(Document.file_size), 0)).filter(
            Document.organization_id == organization_id,
            Document.archived_at.is_(None),
        )
    )
    storage_bytes = storage_bytes_result.scalar() or 0
    storage_used_mb = math.ceil(int(storage_bytes) / (1024 * 1024)) if storage_bytes else 0

    usage = UsageMetrics(
        deals_count=deals_count or 0,
        users_count=users_count or 0,
        documents_count=documents_count or 0,
        storage_used_mb=storage_used_mb,
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


@router.put("/change-tier", response_model=SubscriptionResponse)
def change_subscription_tier(
    tier_update: SubscriptionUpdate,
    scope: AccessScope = Depends(get_access_scope),
    _: User = Depends(require_permission(Permission.BILLING_MANAGE)),
    db: Session = Depends(get_db),
):
    """Change subscription tier (upgrade or downgrade)."""
    organization_id = scope.require_organization_id()
    try:
        updated_subscription = subscription_service.update_subscription_tier(
            organization_id=organization_id,
            new_tier=tier_update.new_tier,
            prorate=tier_update.prorate,
            db=db,
        )
        return SubscriptionResponse.model_validate(updated_subscription)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update subscription: {str(e)}")


@router.post("/cancel", response_model=SubscriptionResponse)
def cancel_my_subscription(
    cancel_request: CancelSubscriptionRequest,
    scope: AccessScope = Depends(get_access_scope),
    _: User = Depends(require_permission(Permission.BILLING_MANAGE)),
    db: Session = Depends(get_db),
):
    """Cancel the current subscription."""
    organization_id = scope.require_organization_id()
    try:
        canceled_subscription = subscription_service.cancel_subscription(
            organization_id=organization_id,
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
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(None, alias="stripe-signature"),
    db: Session = Depends(get_db),
):
    """Handle Stripe webhook events."""
    import stripe
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
    if not webhook_secret:
        raise HTTPException(status_code=500, detail="Stripe webhook secret not configured")
    body_bytes = await request.body()
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
