"""
Event Payment Service (DEV-019)
Handles Stripe payment processing for event ticket purchases.
"""
from __future__ import annotations

import os
import json
import logging
from datetime import datetime, timezone
from decimal import Decimal
from typing import Optional, Dict, Any

import stripe
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.event import Event, EventTicket, EventRegistration, RegistrationStatus
from app.models.event_payment import EventPayment, EventPaymentReceipt, PaymentStatus
from app.models.user import User
from app.models.organization import Organization

# Initialize Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", os.getenv("STRIPE_API_KEY"))

logger = logging.getLogger(__name__)


# ============================================================================
# Checkout Session Creation
# ============================================================================

async def create_checkout_session(
    db: Session,
    event_id: str,
    user_id: str,
    ticket_type: str,
    quantity: int,
) -> Dict[str, Any]:
    """
    Create a Stripe Checkout session for event ticket purchase.
    
    Args:
        db: Database session
        event_id: Event ID
        user_id: User ID purchasing tickets
        ticket_type: Type of ticket (e.g., "vip", "standard", "early_bird")
        quantity: Number of tickets to purchase
        
    Returns:
        Dict with checkout_session_id, checkout_url, amount, currency
        
    Raises:
        ValueError: If event not found, ticket type invalid, or ticket sold out
    """
    # Get event
    event = db.get(Event, event_id)
    if not event:
        raise ValueError(f"Event not found: {event_id}")
    
    # Get user
    user = db.get(User, user_id)
    if not user:
        raise ValueError(f"User not found: {user_id}")
    
    # Get ticket by type (match ticket name to ticket_type)
    ticket = db.query(EventTicket).filter(
        EventTicket.event_id == event_id,
        EventTicket.name.ilike(f"%{ticket_type}%")
    ).first()
    
    if not ticket:
        raise ValueError(f"Invalid ticket type: {ticket_type}")
    
    # Check if ticket is sold out
    if ticket.quantity_available is not None:
        available = ticket.quantity_available - ticket.quantity_sold
        if available < quantity:
            raise ValueError(f"Ticket sold out. Only {available} tickets available.")
    
    # Calculate amount in cents
    amount_cents = int(ticket.price * 100 * quantity)
    
    # Create Stripe Checkout session
    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': ticket.currency.lower(),
                    'product_data': {
                        'name': f"{event.name} - {ticket.name}",
                        'description': ticket.description or f"{ticket.name} ticket for {event.name}",
                    },
                    'unit_amount': int(ticket.price * 100),  # Convert to cents
                },
                'quantity': quantity,
            }],
            mode='payment',
            success_url=os.getenv('FRONTEND_URL', 'http://localhost:5173') + f'/events/{event_id}/payment/success?session_id={{CHECKOUT_SESSION_ID}}',
            cancel_url=os.getenv('FRONTEND_URL', 'http://localhost:5173') + f'/events/{event_id}/payment/cancel',
            metadata={
                'event_id': event_id,
                'user_id': user_id,
                'ticket_type': ticket_type,
                'quantity': str(quantity),
                'ticket_id': ticket.id,
            },
            customer_email=user.email,
        )
        
        # Create payment record (pending status)
        payment = EventPayment(
            payment_intent_id=checkout_session.payment_intent or checkout_session.id,
            event_id=event_id,
            user_id=user_id,
            organization_id=event.organization_id,
            amount=amount_cents,
            currency=ticket.currency.upper(),
            status=PaymentStatus.PENDING,
            ticket_type=ticket_type,
            quantity=quantity,
        )
        db.add(payment)
        db.commit()
        db.refresh(payment)
        
        logger.info(f"Created checkout session {checkout_session.id} for event {event_id}, user {user_id}")
        
        return {
            'checkout_session_id': checkout_session.id,
            'checkout_url': checkout_session.url,
            'amount': amount_cents,
            'currency': ticket.currency.lower(),
        }
        
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error creating checkout session: {e}")
        raise ValueError(f"Failed to create checkout session: {str(e)}")


# ============================================================================
# Webhook Handling
# ============================================================================

async def handle_webhook(
    db: Session,
    webhook_payload: Dict[str, Any],
    signature: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Handle Stripe webhook events for payments.
    
    Args:
        db: Database session
        webhook_payload: Stripe webhook payload
        signature: Webhook signature for verification
        
    Returns:
        Dict with status and details
        
    Raises:
        ValueError: If signature is invalid
    """
    # Verify webhook signature if provided
    if signature:
        webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
        if webhook_secret:
            try:
                stripe.Webhook.construct_event(
                    json.dumps(webhook_payload),
                    signature,
                    webhook_secret
                )
            except ValueError as e:
                logger.error(f"Invalid webhook signature: {e}")
                raise ValueError("Invalid webhook signature")
    
    event_type = webhook_payload.get('type')
    event_data = webhook_payload.get('data', {}).get('object', {})
    
    if event_type == 'payment_intent.succeeded':
        payment_intent_id = event_data.get('id')
        metadata = event_data.get('metadata', {})
        
        # Get payment record
        payment = db.query(EventPayment).filter(
            EventPayment.payment_intent_id == payment_intent_id
        ).first()
        
        if payment:
            # Update payment status
            payment.status = PaymentStatus.SUCCEEDED
            db.commit()
            
            # Assign tickets
            await assign_tickets(
                db=db,
                payment_intent_id=payment_intent_id,
                event_id=metadata.get('event_id') or payment.event_id,
                user_id=metadata.get('user_id') or payment.user_id,
                ticket_type=metadata.get('ticket_type') or payment.ticket_type,
                quantity=int(metadata.get('quantity', payment.quantity)),
            )
            
            logger.info(f"Payment succeeded: {payment_intent_id}")
            return {'status': 'processed', 'payment_id': payment.id}
        else:
            logger.warning(f"Payment record not found for payment_intent: {payment_intent_id}")
            return {'status': 'payment_not_found'}
            
    elif event_type == 'payment_intent.payment_failed':
        payment_intent_id = event_data.get('id')
        
        # Get payment record
        payment = db.query(EventPayment).filter(
            EventPayment.payment_intent_id == payment_intent_id
        ).first()
        
        if payment:
            payment.status = PaymentStatus.FAILED
            db.commit()
            logger.info(f"Payment failed: {payment_intent_id}")
        
        return {'status': 'failed', 'payment_intent_id': payment_intent_id}
    
    else:
        logger.info(f"Unhandled webhook event type: {event_type}")
        return {'status': 'unhandled', 'event_type': event_type}


# ============================================================================
# Ticket Assignment
# ============================================================================

async def assign_tickets(
    db: Session,
    payment_intent_id: str,
    event_id: str,
    user_id: str,
    ticket_type: str,
    quantity: int,
) -> Dict[str, Any]:
    """
    Assign tickets to user after successful payment.
    
    Args:
        db: Database session
        payment_intent_id: Stripe payment intent ID
        event_id: Event ID
        user_id: User ID
        ticket_type: Type of ticket
        quantity: Number of tickets
        
    Returns:
        Dict with registrations list
    """
    # Get event
    event = db.get(Event, event_id)
    if not event:
        raise ValueError(f"Event not found: {event_id}")
    
    # Get ticket
    ticket = db.query(EventTicket).filter(
        EventTicket.event_id == event_id,
        EventTicket.name.ilike(f"%{ticket_type}%")
    ).first()
    
    if not ticket:
        raise ValueError(f"Ticket not found for type: {ticket_type}")
    
    # Get user
    user = db.get(User, user_id)
    if not user:
        raise ValueError(f"User not found: {user_id}")
    
    # Create registrations
    registrations = []
    for i in range(quantity):
        registration = EventRegistration(
            event_id=event_id,
            ticket_id=ticket.id,
            attendee_email=user.email,
            attendee_name=f"{user.first_name} {user.last_name}".strip(),
            status=RegistrationStatus.CONFIRMED,
            registered_by_user_id=user_id,
        )
        db.add(registration)
        registrations.append(registration)
    
    # Update ticket quantity_sold
    ticket.quantity_sold = (ticket.quantity_sold or 0) + quantity
    db.commit()
    
    # Refresh registrations
    for reg in registrations:
        db.refresh(reg)
    
    logger.info(f"Assigned {quantity} tickets for event {event_id} to user {user_id}")
    
    return {
        'registrations': [{'id': reg.id, 'status': reg.status.value} for reg in registrations]
    }


# ============================================================================
# Receipt Generation
# ============================================================================

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
    """
    Generate receipt for payment.
    
    Args:
        db: Database session
        payment_id: Payment ID
        event_id: Event ID
        user_id: User ID
        amount: Amount in cents
        currency: Currency code
        ticket_type: Type of ticket
        quantity: Number of tickets
        
    Returns:
        Dict with receipt information
    """
    # Get event
    event = db.get(Event, event_id)
    if not event:
        raise ValueError(f"Event not found: {event_id}")
    
    # Get user
    user = db.get(User, user_id)
    if not user:
        raise ValueError(f"User not found: {user_id}")
    
    # Get payment
    payment = db.get(EventPayment, payment_id)
    if not payment:
        raise ValueError(f"Payment not found: {payment_id}")
    
    # Generate receipt number
    receipt_number = f"RCP-{datetime.now(timezone.utc).strftime('%Y-%m%d')}-{payment_id[:8].upper()}"
    
    # Create receipt data
    receipt_data = {
        'receipt_number': receipt_number,
        'payment_id': payment_id,
        'event_name': event.name,
        'event_date': event.start_date.isoformat() if event.start_date else None,
        'attendee_name': f"{user.first_name} {user.last_name}".strip(),
        'attendee_email': user.email,
        'amount': amount,
        'currency': currency.upper(),
        'ticket_type': ticket_type,
        'quantity': quantity,
        'purchased_at': datetime.now(timezone.utc).isoformat(),
    }
    
    # Create receipt record
    receipt = EventPaymentReceipt(
        payment_id=payment_id,
        receipt_number=receipt_number,
        receipt_data=json.dumps(receipt_data),
        pdf_path=None,  # PDF generation can be added later
    )
    db.add(receipt)
    
    # Link receipt to payment
    payment.receipt_id = receipt.id
    db.commit()
    db.refresh(receipt)
    
    logger.info(f"Generated receipt {receipt_number} for payment {payment_id}")
    
    return {
        'receipt_number': receipt_number,
        'payment_id': payment_id,
        'event_name': event.name,
        'amount': amount,
        'currency': currency.lower(),
        'ticket_type': ticket_type,
        'quantity': quantity,
        'purchased_at': datetime.now(timezone.utc).isoformat(),
        'pdf_url': f'/api/payments/{payment_id}/receipt.pdf' if receipt.pdf_path else None,
    }


# ============================================================================
# Refund Processing
# ============================================================================

async def process_refund(
    db: Session,
    payment_id: str,
    refund_amount: Optional[int] = None,
) -> Dict[str, Any]:
    """
    Process refund for payment.
    
    Args:
        db: Database session
        payment_id: Payment ID
        refund_amount: Refund amount in cents (None for full refund)
        
    Returns:
        Dict with refund information
    """
    # Get payment
    payment = db.get(EventPayment, payment_id)
    if not payment:
        raise ValueError(f"Payment not found: {payment_id}")
    
    if payment.status != PaymentStatus.SUCCEEDED:
        raise ValueError(f"Cannot refund payment with status: {payment.status}")
    
    # Determine refund amount
    if refund_amount is None:
        refund_amount = payment.amount
    
    if refund_amount > payment.amount:
        raise ValueError(f"Refund amount ({refund_amount}) exceeds payment amount ({payment.amount})")
    
    # Process Stripe refund
    try:
        refund = stripe.Refund.create(
            payment_intent=payment.payment_intent_id,
            amount=refund_amount,
        )
        
        # Update payment status
        if refund_amount == payment.amount:
            payment.status = PaymentStatus.REFUNDED
        else:
            payment.status = PaymentStatus.PARTIALLY_REFUNDED
        
        db.commit()
        
        logger.info(f"Processed refund {refund.id} for payment {payment_id}: {refund_amount} cents")
        
        return {
            'refund_id': refund.id,
            'status': refund.status,
            'amount': refund.amount,
            'payment_id': payment_id,
        }
        
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error processing refund: {e}")
        raise ValueError(f"Failed to process refund: {str(e)}")


# ============================================================================
# Helper Functions
# ============================================================================

async def get_receipt(
    db: Session,
    payment_id: str,
) -> Dict[str, Any]:
    """
    Get receipt for payment.
    
    Args:
        db: Database session
        payment_id: Payment ID
        
    Returns:
        Dict with receipt information
    """
    payment = db.get(EventPayment, payment_id)
    if not payment:
        raise ValueError(f"Payment not found: {payment_id}")
    
    if not payment.receipt_id:
        # Generate receipt if it doesn't exist
        return await generate_receipt(
            db=db,
            payment_id=payment_id,
            event_id=payment.event_id,
            user_id=payment.user_id,
            amount=payment.amount,
            currency=payment.currency,
            ticket_type=payment.ticket_type,
            quantity=payment.quantity,
        )
    
    receipt = db.get(EventPaymentReceipt, payment.receipt_id)
    if not receipt:
        raise ValueError(f"Receipt not found for payment: {payment_id}")
    
    receipt_data = json.loads(receipt.receipt_data)
    receipt_data['pdf_url'] = f'/api/payments/{payment_id}/receipt.pdf' if receipt.pdf_path else None
    
    return receipt_data

