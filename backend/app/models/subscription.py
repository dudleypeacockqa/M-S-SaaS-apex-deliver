"""Subscription and Invoice models for billing management."""
from __future__ import annotations

import enum
from datetime import datetime
from uuid import uuid4

from sqlalchemy import Boolean, Column, DateTime, Enum, ForeignKey, Numeric, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class SubscriptionTier(str, enum.Enum):
    """Subscription tier enum matching pricing tiers."""

    STARTER = "starter"
    PROFESSIONAL = "professional"
    ENTERPRISE = "enterprise"
    COMMUNITY = "community"


class SubscriptionStatus(str, enum.Enum):
    """Subscription status enum matching Stripe subscription states."""

    ACTIVE = "active"
    PAST_DUE = "past_due"
    CANCELED = "canceled"
    UNPAID = "unpaid"
    TRIALING = "trialing"


class Subscription(Base):
    """Subscription model representing organization's billing subscription."""

    __tablename__ = "subscriptions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    organization_id = Column(
        String(36), ForeignKey("organizations.id"), unique=True, nullable=False
    )

    # Stripe identifiers
    stripe_customer_id = Column(String, unique=True, nullable=False)
    stripe_subscription_id = Column(String, unique=True, nullable=True)

    # Subscription details
    tier = Column(Enum(SubscriptionTier), nullable=False)
    status = Column(Enum(SubscriptionStatus), default=SubscriptionStatus.TRIALING)

    # Billing period
    current_period_start = Column(DateTime(timezone=True), nullable=True)
    current_period_end = Column(DateTime(timezone=True), nullable=True)

    # Cancellation
    cancel_at_period_end = Column(Boolean, default=False)
    canceled_at = Column(DateTime(timezone=True), nullable=True)

    # Trial period
    trial_start = Column(DateTime(timezone=True), nullable=True)
    trial_end = Column(DateTime(timezone=True), nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    organization = relationship("Organization", back_populates="subscription")
    invoices = relationship("Invoice", back_populates="subscription", cascade="all, delete-orphan")


class Invoice(Base):
    """Invoice model representing billing invoices."""

    __tablename__ = "invoices"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)
    subscription_id = Column(String(36), ForeignKey("subscriptions.id"), nullable=True)

    # Stripe identifiers
    stripe_invoice_id = Column(String, unique=True, nullable=False)

    # Invoice details
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String, default="GBP", nullable=False)
    status = Column(String, nullable=False)  # open, paid, void, uncollectible

    # Payment details
    paid_at = Column(DateTime(timezone=True), nullable=True)
    due_date = Column(DateTime(timezone=True), nullable=True)

    # Invoice PDF
    invoice_pdf = Column(String, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    organization = relationship("Organization", back_populates="invoices")
    subscription = relationship("Subscription", back_populates="invoices")
