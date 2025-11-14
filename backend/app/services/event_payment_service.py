"""Event payment service for Stripe (DEV-019)."""
from __future__ import annotations

import json
import logging
import os
from datetime import datetime, timezone
from decimal import Decimal
from typing import Any, Dict, Optional
from uuid import uuid4

from sqlalchemy.orm import Session

from app.models.event import (
    Event,
    EventTicket,
    EventRegistration,
    RegistrationStatus,
    TicketStatus,
)
from app.models.event_payment import EventPayment, EventPaymentReceipt, PaymentStatus
from app.models.user import User

logger = logging.getLogger(__name__)

STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY") or os.getenv("STRIPE_API_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

try:  # pragma: no cover - import guard for environments without stripe package
    import stripe  # type: ignore
    from stripe.error import StripeError, SignatureVerificationError  # type: ignore[attr-defined]

    if STRIPE_SECRET_KEY:
        stripe.api_key = STRIPE_SECRET_KEY
except Exception:  # pragma: no cover
    class StripeError(Exception):
        """Fallback Stripe error when SDK is unavailable."""

    class SignatureVerificationError(Exception):
        """Fallback signature error when SDK is unavailable."""

    class _StripeStub:
        class checkout:
            class Session:
                @staticmethod
                def create(*args, **kwargs):
                    raise StripeError("Stripe SDK is not available")

        class Refund:
            @staticmethod
            def create(*args, **kwargs):
                raise StripeError("Stripe SDK is not available")

        class Webhook:
            @staticmethod
            def construct_event(*args, **kwargs):
                raise SignatureVerificationError("Invalid Stripe webhook signature")

    stripe = _StripeStub()  # type: ignore


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _require_event(db: Session, event_id: str) -> Event:
    event = db.get(Event, event_id)
    if not event:
        raise ValueError(f"Event not found: {event_id}")
    return event


def _require_user(db: Session, user_id: str) -> User:
    user = db.get(User, user_id)
    if not user:
        raise ValueError(f"User not found: {user_id}")
    return user


def _find_ticket(db: Session, event_id: str, ticket_type: str) -> Optional[EventTicket]:
    return (
        db.query(EventTicket)
        .filter(
            EventTicket.event_id == event_id,
            EventTicket.name.ilike(f"%{ticket_type}%"),
        )
        .first()
    )


def _get_payment_by_identifier(db: Session, identifier: str) -> Optional[EventPayment]:
    payment = db.get(EventPayment, identifier)
    if payment:
        return payment
    return (
        db.query(EventPayment)
        .filter(EventPayment.payment_intent_id == identifier)
        .one_or_none()
    )


# ---------------------------------------------------------------------------
# Checkout Session Creation
# ---------------------------------------------------------------------------

async def create_checkout_session(
    db: Session,
    event_id: str,
    user_id: str,
    ticket_type: str,
    quantity: int,
) -> Dict[str, Any]:
    event = _require_event(db, event_id)
    user = _require_user(db, user_id)
    ticket = _find_ticket(db, event_id, ticket_type.lower())
    if not ticket:
        raise ValueError("Invalid ticket type")
    if ticket.status != TicketStatus.ACTIVE:
        raise ValueError("Ticket type is not available")

    available = None
    if ticket.quantity_available is not None:
        available = ticket.quantity_available - ticket.quantity_sold
        if available < quantity:
            raise ValueError("Ticket sold out")

    amount_cents = int(Decimal(ticket.price) * 100) * quantity

    metadata = {
        'event_id': event_id,
        'user_id': user_id,
        'ticket_type': ticket_type,
        'quantity': str(quantity),
        'ticket_id': ticket.id,
    }

    if stripe and STRIPE_SECRET_KEY:
        try:
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': ticket.currency.lower(),
                        'product_data': {
                            'name': f"{event.name} - {ticket.name}",
                            'description': ticket.description or f"{ticket.name} ticket",
                        },
                        'unit_amount': int(Decimal(ticket.price) * 100),
                    },
                    'quantity': quantity,
                }],
                mode='payment',
                success_url=os.getenv('FRONTEND_URL', 'http://localhost:5173')
                + f'/events/{event_id}/payment/success?session_id={{CHECKOUT_SESSION_ID}}',
                cancel_url=os.getenv('FRONTEND_URL', 'http://localhost:5173')
                + f'/events/{event_id}/payment/cancel',
                metadata=metadata,
                customer_email=user.email,
            )
        except StripeError as exc:  # pragma: no cover
            logger.error("Stripe error creating checkout session: %s", exc)
            raise ValueError("Failed to create checkout session") from exc
    else:
        class _DummySession:
            def __init__(self) -> None:
                self.payment_intent = f"pi_test_{uuid4().hex[:10]}"
                self.id = f"cs_test_{uuid4().hex[:10]}"
                self.url = f"https://checkout.apexdeliver.test/{self.id}"

        checkout_session = _DummySession()

    raw_intent = getattr(checkout_session, 'payment_intent', None) or checkout_session.id
    payment = EventPayment(
        payment_intent_id=str(raw_intent),
        event_id=event_id,
        user_id=user_id,
        organization_id=event.organization_id,
        amount=amount_cents,
        currency=ticket.currency.upper(),
        status=PaymentStatus.PENDING,
        ticket_type=ticket_type.lower(),
        quantity=quantity,
    )
    db.add(payment)
    db.commit()

    return {
        'checkout_session_id': checkout_session.id,
        'checkout_url': checkout_session.url,
        'amount': amount_cents,
        'currency': ticket.currency.lower(),
    }


# ---------------------------------------------------------------------------
# Webhook Handling
# ---------------------------------------------------------------------------

async def handle_webhook(
    db: Session,
    webhook_payload: Dict[str, Any],
    signature: Optional[str] = None,
) -> Dict[str, Any]:
    if signature:
        if not STRIPE_WEBHOOK_SECRET or not stripe:
            raise ValueError("Invalid webhook signature")
        try:
            stripe.Webhook.construct_event(
                json.dumps(webhook_payload),
                signature,
                STRIPE_WEBHOOK_SECRET,
            )
        except (ValueError, SignatureVerificationError) as exc:
            logger.error("Invalid webhook signature: %s", exc)
            raise ValueError("Invalid webhook signature") from exc

    event_type = webhook_payload.get('type')
    payload = webhook_payload.get('data', {}).get('object', {})

    if event_type == 'payment_intent.succeeded':
        payment_intent_id = payload.get('id')
        metadata = payload.get('metadata', {})
        payment = _get_payment_by_identifier(db, payment_intent_id)
        if not payment and metadata:
            event_id = metadata.get('event_id')
            user_id = metadata.get('user_id')
            ticket_type = metadata.get('ticket_type', 'general')
            quantity = int(metadata.get('quantity', 1))
            event = _require_event(db, event_id)
            payment = EventPayment(
                payment_intent_id=payment_intent_id,
                event_id=event_id,
                user_id=user_id,
                organization_id=event.organization_id,
                amount=payload.get('amount', 0),
                currency=payload.get('currency', 'USD').upper(),
                status=PaymentStatus.SUCCEEDED,
                ticket_type=ticket_type,
                quantity=quantity,
            )
            db.add(payment)
            db.commit()

        if payment:
            payment.status = PaymentStatus.SUCCEEDED
            db.commit()
            await assign_tickets(
                db=db,
                payment_intent_id=payment.payment_intent_id,
                event_id=payment.event_id,
                user_id=payment.user_id,
                ticket_type=payment.ticket_type,
                quantity=payment.quantity,
            )
            return {'status': 'processed', 'payment_id': payment.id}
        logger.warning("Payment record not found for payment_intent %s", payment_intent_id)
        return {'status': 'payment_not_found'}

    if event_type == 'payment_intent.payment_failed':
        payment_intent_id = payload.get('id')
        payment = _get_payment_by_identifier(db, payment_intent_id)
        if payment:
            payment.status = PaymentStatus.FAILED
            db.commit()
        return {'status': 'failed', 'payment_intent_id': payment_intent_id}

    return {'status': 'unhandled', 'event_type': event_type}


# ---------------------------------------------------------------------------
# Ticket Assignment & Receipts
# ---------------------------------------------------------------------------

async def assign_tickets(
    db: Session,
    payment_intent_id: str,
    event_id: str,
    user_id: str,
    ticket_type: str,
    quantity: int,
) -> Dict[str, Any]:
    event = _require_event(db, event_id)
    user = _require_user(db, user_id)
    ticket = _find_ticket(db, event_id, ticket_type)
    if not ticket:
        raise ValueError("Invalid ticket type")

    registrations = []
    for _ in range(quantity):
        registration = EventRegistration(
            id=str(uuid4()),
            event_id=event.id,
            ticket_id=ticket.id,
            attendee_name=(f"{user.first_name} {user.last_name}".strip() or user.email),
            attendee_email=user.email,
            payment_status='paid',
            payment_amount=Decimal(ticket.price),
            currency=ticket.currency.upper(),
            stripe_payment_intent_id=payment_intent_id,
            status=RegistrationStatus.CONFIRMED,
            organization_id=event.organization_id,
            registered_by_user_id=user_id,
        )
        db.add(registration)
        registrations.append(registration)

    ticket.quantity_sold = (ticket.quantity_sold or 0) + quantity
    db.commit()

    return {
        'registrations': [
            {
                'id': reg.id,
                'attendee_email': reg.attendee_email,
                'status': reg.status.value,
            }
            for reg in registrations
        ]
    }


async def generate_receipt(
    db: Session,
    payment_id: str,
    event_id: str,
    user_id: str,
    amount: int,
    currency: str,
    ticket_type: str,
    quantity: int,
) -> Dict[str, Any]:
    event = _require_event(db, event_id)
    user = _require_user(db, user_id)

    payment = _get_payment_by_identifier(db, payment_id)
    if not payment:
        payment = EventPayment(
            id=payment_id,
            payment_intent_id=payment_id,
            event_id=event_id,
            user_id=user_id,
            organization_id=event.organization_id,
            amount=amount,
            currency=currency.upper(),
            status=PaymentStatus.SUCCEEDED,
            ticket_type=ticket_type,
            quantity=quantity,
        )
        db.add(payment)
        db.commit()

    receipt_number = f"RCP-{datetime.now(timezone.utc).strftime('%Y%m%d')}-{payment_id[:6].upper()}"
    receipt_data = {
        'receipt_number': receipt_number,
        'payment_id': payment_id,
        'event_name': event.name,
        'event_date': event.start_date.isoformat() if event.start_date else None,
        'attendee_name': (f"{user.first_name} {user.last_name}".strip() or user.email),
        'attendee_email': user.email,
        'amount': amount,
        'currency': currency.lower(),
        'ticket_type': ticket_type,
        'quantity': quantity,
        'purchased_at': datetime.now(timezone.utc).isoformat(),
    }

    receipt = EventPaymentReceipt(
        payment_id=payment.id,
        receipt_number=receipt_number,
        receipt_data=json.dumps(receipt_data),
        pdf_path=None,
    )
    db.add(receipt)
    payment.receipt_id = receipt.id
    db.commit()

    logger.info("Generated receipt %s for payment %s", receipt_number, payment_id)
    return {
        **receipt_data,
        'pdf_url': f"/api/payments/{payment_id}/receipt.pdf" if receipt.pdf_path else None,
    }


async def process_refund(
    db: Session,
    payment_id: str,
    refund_amount: Optional[int] = None,
) -> Dict[str, Any]:
    payment = _get_payment_by_identifier(db, payment_id)
    payment_intent_id = payment.payment_intent_id if payment else payment_id

    if payment and payment.status not in (PaymentStatus.SUCCEEDED, PaymentStatus.PARTIALLY_REFUNDED):
        raise ValueError(f"Cannot refund payment with status: {payment.status}")

    if refund_amount is None:
        if not payment:
            raise ValueError("Refund amount required when payment record is missing")
        refund_amount = payment.amount

    if payment and refund_amount > payment.amount:
        raise ValueError("Refund amount exceeds payment amount")

    if stripe and STRIPE_SECRET_KEY:
        try:
            refund = stripe.Refund.create(payment_intent=payment_intent_id, amount=refund_amount)
        except StripeError as exc:  # pragma: no cover
            logger.error("Stripe error processing refund: %s", exc)
            raise ValueError("Failed to process refund") from exc
    else:
        class _DummyRefund:
            def __init__(self) -> None:
                self.id = f"re_test_{uuid4().hex[:8]}"
                self.amount = refund_amount
                self.status = 'succeeded'

        refund = _DummyRefund()

    if payment:
        payment.status = (
            PaymentStatus.REFUNDED
            if refund_amount == payment.amount
            else PaymentStatus.PARTIALLY_REFUNDED
        )
        db.commit()

    return {
        'refund_id': refund.id,
        'status': refund.status,
        'amount': refund.amount,
        'payment_id': payment_id,
    }


async def get_receipt(
    db: Session,
    payment_id: str,
    user_id: str | None = None,
) -> Dict[str, Any]:
    payment = _get_payment_by_identifier(db, payment_id)
    if not payment:
        raise ValueError(f"Payment not found: {payment_id}")

    if user_id and payment.user_id != user_id:
        raise ValueError("Access denied")

    if payment.receipt_id:
        receipt = db.get(EventPaymentReceipt, payment.receipt_id)
        if receipt:
            data = json.loads(receipt.receipt_data)
            data['pdf_url'] = f"/api/payments/{payment_id}/receipt.pdf" if receipt.pdf_path else None
            return data

    return await generate_receipt(
        db=db,
        payment_id=payment.id,
        event_id=payment.event_id,
        user_id=payment.user_id,
        amount=payment.amount,
        currency=payment.currency,
        ticket_type=payment.ticket_type,
        quantity=payment.quantity,
    )
