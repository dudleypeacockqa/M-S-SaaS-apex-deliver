"""Pydantic schemas for subscription and billing endpoints.

Implements DEV-009: Subscription & Billing Management
"""
from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.subscription import SubscriptionStatus, SubscriptionTier


# ============================================================================
# Subscription Schemas
# ============================================================================


class SubscriptionBase(BaseModel):
    """Base subscription schema."""

    tier: SubscriptionTier
    status: SubscriptionStatus


class SubscriptionCreate(BaseModel):
    """Schema for creating a checkout session."""

    tier: SubscriptionTier = Field(..., description="Subscription tier to purchase")
    success_url: Optional[str] = Field(None, description="URL to redirect after successful payment")
    cancel_url: Optional[str] = Field(None, description="URL to redirect if payment canceled")


class CheckoutSessionResponse(BaseModel):
    """Response from creating a Stripe checkout session."""

    checkout_url: str = Field(..., description="Stripe Checkout Session URL")
    session_id: str = Field(..., description="Stripe Session ID")


class SubscriptionResponse(BaseModel):
    """Response schema for subscription details."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    organization_id: str
    tier: SubscriptionTier
    status: SubscriptionStatus
    stripe_customer_id: str
    stripe_subscription_id: Optional[str] = None
    current_period_start: Optional[datetime] = None
    current_period_end: Optional[datetime] = None
    cancel_at_period_end: bool = False
    canceled_at: Optional[datetime] = None
    trial_start: Optional[datetime] = None
    trial_end: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None


class SubscriptionUpdate(BaseModel):
    """Schema for updating subscription (tier changes)."""

    new_tier: SubscriptionTier = Field(..., description="New subscription tier")
    prorate: bool = Field(True, description="Whether to prorate the tier change")


class CancelSubscriptionRequest(BaseModel):
    """Schema for canceling a subscription."""

    immediately: bool = Field(False, description="Cancel immediately (true) or at period end (false)")
    reason: Optional[str] = Field(None, description="Cancellation reason for retention analysis")


# ============================================================================
# Invoice Schemas
# ============================================================================


class InvoiceBase(BaseModel):
    """Base invoice schema."""

    amount: Decimal
    currency: str
    status: str


class InvoiceResponse(BaseModel):
    """Response schema for invoice details."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    organization_id: str
    subscription_id: Optional[str] = None
    stripe_invoice_id: str
    amount: Decimal
    currency: str
    status: str
    paid_at: Optional[datetime] = None
    due_date: Optional[datetime] = None
    invoice_pdf: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None


# ============================================================================
# Subscription Tier Details (for UI display)
# ============================================================================


class TierFeatures(BaseModel):
    """Features included in a subscription tier."""

    max_deals: int = Field(..., description="Maximum number of active deals")
    max_users: int = Field(..., description="Maximum number of users in organization")
    max_documents_per_deal: int = Field(..., description="Maximum documents per deal")
    storage_gb: int = Field(..., description="Storage limit in GB")
    financial_intelligence: bool = Field(..., description="Access to Financial Intelligence Engine")
    deal_matching: bool = Field(..., description="Access to AI Deal Matching")
    api_access: bool = Field(..., description="API access for integrations")
    priority_support: bool = Field(..., description="Priority customer support")
    custom_branding: bool = Field(..., description="Custom branding options")


class TierDetails(BaseModel):
    """Complete details for a subscription tier."""

    tier: SubscriptionTier
    name: str = Field(..., description="Display name (e.g., 'Professional Plan')")
    price_monthly: Decimal = Field(..., description="Monthly price in GBP")
    price_annual: Decimal = Field(..., description="Annual price in GBP")
    description: str = Field(..., description="Tier description")
    features: TierFeatures
    stripe_price_id_monthly: str = Field(..., description="Stripe Price ID for monthly billing")
    stripe_price_id_annual: str = Field(..., description="Stripe Price ID for annual billing")


# ============================================================================
# Stripe Webhook Schemas
# ============================================================================


class StripeWebhookEvent(BaseModel):
    """Schema for Stripe webhook events."""

    id: str
    type: str
    data: dict


# ============================================================================
# Usage Metrics (for billing page)
# ============================================================================


class UsageMetrics(BaseModel):
    """Current usage metrics for the organization."""

    deals_count: int = Field(..., description="Number of active deals")
    users_count: int = Field(..., description="Number of users in organization")
    documents_count: int = Field(..., description="Total documents uploaded")
    storage_used_mb: int = Field(..., description="Storage used in MB")


class BillingDashboardResponse(BaseModel):
    """Complete billing dashboard data."""

    subscription: SubscriptionResponse
    usage: UsageMetrics
    tier_details: TierDetails
    recent_invoices: list[InvoiceResponse] = Field(default_factory=list, description="Last 3 invoices")
    upcoming_invoice_amount: Optional[Decimal] = Field(None, description="Next invoice amount estimate")
