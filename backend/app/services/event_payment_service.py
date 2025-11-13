"""Event payment service for handling Stripe payments."""
from __future__ import annotations

import json
from typing import Any, Dict

from app.core.config import settings
from app.models.event import EventPayment
from app.services.email_service import email_service

USE_STRIPE = settings.STRIPE_SECRET_KEY is not None

if USE_STRIPE:
    import stripe
    from stripe.error import StripeError, SignatureVerificationError  # type: ignore[attr-defined]

    stripe.api_key = settings.STRIPE_SECRET_KEY


class EventPaymentError(Exception):
    """Custom exception for event payments."""


def verify_signature(payload: str, sig_header: str, secret: str):
    """Verify webhook signature or skip when Stripe not configured."""
    if not USE_STRIPE:
        return None
    try:
        return stripe.Webhook.construct_event(
            payload=payload,
            sig_header=sig_header,
            secret=secret,
        )
    except SignatureVerificationError as exc:  # type: ignore[attr-defined]
        raise EventPaymentError("Invalid Stripe webhook signature") from exc


# ... rest of file ...
