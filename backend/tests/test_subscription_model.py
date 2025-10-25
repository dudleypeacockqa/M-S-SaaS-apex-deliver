"""Tests for Subscription and Invoice models.

Following TDD methodology (RED phase):
- Write tests first
- Tests should fail initially
- Then implement model logic to make tests pass
"""
import pytest
from datetime import datetime, timezone, timedelta
from decimal import Decimal
from sqlalchemy import text

from app.models.subscription import Subscription, Invoice, SubscriptionTier, SubscriptionStatus
from app.models.organization import Organization


def test_create_subscription(db_session, test_organization):
    """Test creating a subscription for an organization."""
    subscription = Subscription(
        organization_id=test_organization.id,
        stripe_customer_id="cus_test123",
        stripe_subscription_id="sub_test123",
        tier=SubscriptionTier.PROFESSIONAL,
        status=SubscriptionStatus.ACTIVE,
        current_period_start=datetime.now(timezone.utc),
        current_period_end=datetime.now(timezone.utc) + timedelta(days=30),
    )

    db_session.add(subscription)
    db_session.commit()
    db_session.refresh(subscription)

    assert subscription.id is not None
    assert subscription.organization_id == test_organization.id
    assert subscription.tier == SubscriptionTier.PROFESSIONAL
    assert subscription.status == SubscriptionStatus.ACTIVE
    assert subscription.created_at is not None


def test_subscription_defaults(db_session, test_organization):
    """Test subscription default values."""
    subscription = Subscription(
        organization_id=test_organization.id,
        stripe_customer_id="cus_test456",
        tier=SubscriptionTier.STARTER,
    )

    db_session.add(subscription)
    db_session.commit()
    db_session.refresh(subscription)

    # Default status should be TRIALING
    assert subscription.status == SubscriptionStatus.TRIALING
    assert subscription.cancel_at_period_end is False
    assert subscription.canceled_at is None


def test_subscription_tier_enum_values(db_session):
    """Test all subscription tier enum values are valid."""
    from uuid import uuid4

    tiers = [
        SubscriptionTier.STARTER,
        SubscriptionTier.PROFESSIONAL,
        SubscriptionTier.ENTERPRISE,
        SubscriptionTier.COMMUNITY,
    ]

    # Create separate organization for each tier since org_id must be unique
    for tier in tiers:
        org = Organization(
            id=f"test-org-{tier.value}",
            name=f"{tier.value.title()} Tier Org",
            slug=f"{tier.value}-org-{uuid4().hex[:6]}",
            subscription_tier=tier.value,
        )
        db_session.add(org)

        subscription = Subscription(
            organization_id=org.id,
            stripe_customer_id=f"cus_{tier.value}_{uuid4().hex[:6]}",
            tier=tier,
        )
        db_session.add(subscription)

    db_session.commit()

    # Verify all tiers were created successfully
    result = db_session.execute(text("SELECT COUNT(*) FROM subscriptions"))
    count = result.scalar()
    assert count >= 4  # At least 4 (may be more from other tests)


def test_subscription_status_transitions(db_session, test_organization):
    """Test subscription status can transition through valid states."""
    subscription = Subscription(
        organization_id=test_organization.id,
        stripe_customer_id="cus_transition",
        tier=SubscriptionTier.STARTER,
        status=SubscriptionStatus.TRIALING,
    )

    db_session.add(subscription)
    db_session.commit()

    # Transition from TRIALING to ACTIVE
    subscription.status = SubscriptionStatus.ACTIVE
    db_session.commit()
    db_session.refresh(subscription)
    assert subscription.status == SubscriptionStatus.ACTIVE

    # Transition to PAST_DUE (payment failed)
    subscription.status = SubscriptionStatus.PAST_DUE
    db_session.commit()
    db_session.refresh(subscription)
    assert subscription.status == SubscriptionStatus.PAST_DUE

    # Transition to CANCELED
    subscription.status = SubscriptionStatus.CANCELED
    subscription.canceled_at = datetime.now(timezone.utc)
    db_session.commit()
    db_session.refresh(subscription)
    assert subscription.status == SubscriptionStatus.CANCELED
    assert subscription.canceled_at is not None


def test_subscription_cancellation_scheduling(db_session, test_organization):
    """Test scheduling subscription cancellation at period end."""
    subscription = Subscription(
        organization_id=test_organization.id,
        stripe_customer_id="cus_cancel",
        tier=SubscriptionTier.PROFESSIONAL,
        status=SubscriptionStatus.ACTIVE,
        current_period_end=datetime.now(timezone.utc) + timedelta(days=15),
    )

    db_session.add(subscription)
    db_session.commit()

    # Schedule cancellation at period end
    subscription.cancel_at_period_end = True
    db_session.commit()
    db_session.refresh(subscription)

    # Status should still be ACTIVE until period end
    assert subscription.status == SubscriptionStatus.ACTIVE
    assert subscription.cancel_at_period_end is True
    assert subscription.canceled_at is None  # Not canceled yet


def test_subscription_trial_period(db_session, test_organization):
    """Test subscription trial period tracking."""
    trial_start = datetime.now(timezone.utc)
    trial_end = trial_start + timedelta(days=14)

    subscription = Subscription(
        organization_id=test_organization.id,
        stripe_customer_id="cus_trial",
        tier=SubscriptionTier.STARTER,
        status=SubscriptionStatus.TRIALING,
        trial_start=trial_start,
        trial_end=trial_end,
    )

    db_session.add(subscription)
    db_session.commit()
    db_session.refresh(subscription)

    assert subscription.trial_start is not None
    assert subscription.trial_end is not None
    assert (subscription.trial_end - subscription.trial_start).days == 14


def test_subscription_unique_per_organization(db_session, test_organization):
    """Test that organization can only have one subscription."""
    subscription1 = Subscription(
        organization_id=test_organization.id,
        stripe_customer_id="cus_unique1",
        tier=SubscriptionTier.STARTER,
    )

    db_session.add(subscription1)
    db_session.commit()

    # Attempt to create second subscription for same organization
    subscription2 = Subscription(
        organization_id=test_organization.id,  # Same org
        stripe_customer_id="cus_unique2",
        tier=SubscriptionTier.PROFESSIONAL,
    )

    db_session.add(subscription2)

    # Should raise IntegrityError due to unique constraint
    with pytest.raises(Exception):  # SQLAlchemy IntegrityError
        db_session.commit()


def test_subscription_relationship_to_organization(db_session, test_organization):
    """Test subscription relationship to organization."""
    subscription = Subscription(
        organization_id=test_organization.id,
        stripe_customer_id="cus_relationship",
        tier=SubscriptionTier.ENTERPRISE,
    )

    db_session.add(subscription)
    db_session.commit()
    db_session.refresh(subscription)

    # Access organization through relationship
    db_session.refresh(subscription, ["organization"])
    assert subscription.organization.id == test_organization.id
    assert subscription.organization.name == test_organization.name


# ============================================================================
# Invoice Model Tests
# ============================================================================


def test_create_invoice(db_session, test_organization, test_subscription):
    """Test creating an invoice."""
    invoice = Invoice(
        organization_id=test_organization.id,
        subscription_id=test_subscription.id,
        stripe_invoice_id="in_test123",
        amount=Decimal("598.00"),
        currency="GBP",
        status="paid",
        paid_at=datetime.now(timezone.utc),
    )

    db_session.add(invoice)
    db_session.commit()
    db_session.refresh(invoice)

    assert invoice.id is not None
    assert invoice.amount == Decimal("598.00")
    assert invoice.currency == "GBP"
    assert invoice.status == "paid"
    assert invoice.paid_at is not None


def test_invoice_statuses(db_session, test_organization, test_subscription):
    """Test different invoice status states."""
    statuses = ["open", "paid", "void", "uncollectible"]

    for status in statuses:
        invoice = Invoice(
            organization_id=test_organization.id,
            subscription_id=test_subscription.id,
            stripe_invoice_id=f"in_{status}",
            amount=Decimal("279.00"),
            currency="GBP",
            status=status,
        )
        db_session.add(invoice)

    db_session.commit()

    # Verify all invoices were created
    result = db_session.execute(text("SELECT COUNT(*) FROM invoices WHERE subscription_id = :sub_id"),
        {"sub_id": test_subscription.id}
    )
    count = result.scalar()
    assert count == 4


def test_invoice_relationship_to_subscription(db_session, test_organization, test_subscription):
    """Test invoice relationship to subscription."""
    invoice = Invoice(
        organization_id=test_organization.id,
        subscription_id=test_subscription.id,
        stripe_invoice_id="in_relationship",
        amount=Decimal("1598.00"),
        currency="GBP",
        status="paid",
    )

    db_session.add(invoice)
    db_session.commit()
    db_session.refresh(invoice)

    # Access subscription through relationship
    db_session.refresh(invoice, ["subscription"])
    assert invoice.subscription.id == test_subscription.id
    assert invoice.subscription.tier == test_subscription.tier


def test_invoice_pdf_url_storage(db_session, test_organization, test_subscription):
    """Test storing invoice PDF URL."""
    invoice = Invoice(
        organization_id=test_organization.id,
        subscription_id=test_subscription.id,
        stripe_invoice_id="in_pdf",
        amount=Decimal("598.00"),
        currency="GBP",
        status="paid",
        invoice_pdf="https://stripe.com/invoices/in_pdf.pdf",
    )

    db_session.add(invoice)
    db_session.commit()
    db_session.refresh(invoice)

    assert invoice.invoice_pdf == "https://stripe.com/invoices/in_pdf.pdf"


def test_subscription_cascade_delete_invoices(db_session, test_organization):
    """Test that deleting subscription cascades to delete invoices."""
    # Create subscription
    subscription = Subscription(
        organization_id=test_organization.id,
        stripe_customer_id="cus_cascade",
        tier=SubscriptionTier.PROFESSIONAL,
    )
    db_session.add(subscription)
    db_session.commit()
    db_session.refresh(subscription)

    # Create invoices
    for i in range(3):
        invoice = Invoice(
            organization_id=test_organization.id,
            subscription_id=subscription.id,
            stripe_invoice_id=f"in_cascade_{i}",
            amount=Decimal("598.00"),
            currency="GBP",
            status="paid",
        )
        db_session.add(invoice)

    db_session.commit()

    # Verify 3 invoices exist
    result = db_session.execute(text("SELECT COUNT(*) FROM invoices WHERE subscription_id = :sub_id"),
        {"sub_id": subscription.id}
    )
    assert result.scalar() == 3

    # Delete subscription
    db_session.delete(subscription)
    db_session.commit()

    # Verify invoices were cascade deleted
    result = db_session.execute(text("SELECT COUNT(*) FROM invoices WHERE subscription_id = :sub_id"),
        {"sub_id": subscription.id}
    )
    assert result.scalar() == 0
