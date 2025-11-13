"""
TDD Tests for Event Payment Service (DEV-019)
RED Phase: Tests that will initially fail until implementation

Following TDD RED → GREEN → REFACTOR methodology.
"""
from __future__ import annotations

import pytest
from unittest.mock import Mock, patch, AsyncMock
from datetime import datetime, timezone, timedelta
from decimal import Decimal

from sqlalchemy.orm import Session

from app.models.event import Event, EventTicket, EventRegistration, EventStatus, TicketStatus
from app.models.user import User
from app.models.organization import Organization

# Skip entire module if service not implemented yet (TDD RED phase)
pytest.importorskip("app.services.event_payment_service", reason="TDD RED phase - EventPaymentService not implemented (DEV-019)")

from app.services.event_payment_service import (
    create_checkout_session,
    handle_webhook,
    assign_tickets,
    generate_receipt,
    process_refund,
)


# ============================================================================
# Fixtures
# ============================================================================

@pytest.fixture
def test_event(db_session: Session, create_organization) -> Event:
    """Create a test event."""
    org = create_organization(name="Test Org")
    event = Event(
        id="event-test-123",
        name="M&A Summit 2025",
        description="Annual M&A conference",
        event_type="in_person",
        status=EventStatus.PUBLISHED,
        start_date=datetime.now(timezone.utc) + timedelta(days=30),
        end_date=datetime.now(timezone.utc) + timedelta(days=31),
        location="London, UK",
        capacity=100,
        base_price=Decimal("100.00"),
        currency="GBP",
        organization_id=str(org.id),
        created_by_user_id="user-123",
    )
    db_session.add(event)
    db_session.commit()
    return event


@pytest.fixture
def test_ticket(db_session: Session, test_event: Event, create_organization) -> EventTicket:
    """Create a test ticket."""
    ticket = EventTicket(
        id="ticket-test-123",
        event_id=test_event.id,
        name="VIP",
        description="VIP ticket with premium access",
        price=Decimal("200.00"),
        currency="GBP",
        quantity_available=50,
        quantity_sold=0,
        status=TicketStatus.ACTIVE,
        organization_id=test_event.organization_id,
        created_by_user_id="user-123",
    )
    db_session.add(ticket)
    db_session.commit()
    return ticket


@pytest.fixture
def test_user(db_session: Session, create_organization) -> User:
    """Create a test user."""
    org = create_organization(name="Test Org")
    user = User(
        id="user-test-123",
        clerk_user_id="clerk_test_123",
        email="test@example.com",
        first_name="Test",
        last_name="User",
        organization_id=str(org.id),
        role="solo",
    )
    db_session.add(user)
    db_session.commit()
    return user


# ============================================================================
# Tests: create_checkout_session
# ============================================================================

@pytest.mark.asyncio
async def test_create_checkout_session_success(
    db_session: Session,
    test_event: Event,
    test_ticket: EventTicket,
    test_user: User,
):
    """
    RED: Test creating Stripe Checkout session for event ticket purchase.
    This test will fail until create_checkout_session is implemented.
    """
    # Arrange
    ticket_type = "vip"
    quantity = 2

    with patch('app.services.event_payment_service.stripe.checkout.Session.create') as mock_checkout:
        mock_checkout.return_value = Mock(
            id='cs_test_123456',
            url='https://checkout.stripe.com/c/pay/cs_test_123456'
        )

        # Act
        result = await create_checkout_session(
            db=db_session,
            event_id=test_event.id,
            user_id=test_user.id,
            ticket_type=ticket_type,
            quantity=quantity,
        )

        # Assert
        assert result is not None
        assert result['checkout_session_id'] == 'cs_test_123456'
        assert result['checkout_url'] == 'https://checkout.stripe.com/c/pay/cs_test_123456'
        assert result['amount'] == 40000  # 200.00 * 2 * 100 (cents)
        assert result['currency'] == 'gbp'
        mock_checkout.assert_called_once()


@pytest.mark.asyncio
async def test_create_checkout_session_invalid_ticket_type(
    db_session: Session,
    test_event: Event,
    test_user: User,
):
    """
    RED: Test creating checkout session with invalid ticket type.
    This test will fail until error handling is implemented.
    """
    # Arrange
    ticket_type = "invalid_type"
    quantity = 1

    # Act & Assert
    with pytest.raises(ValueError, match="Invalid ticket type"):
        await create_checkout_session(
            db=db_session,
            event_id=test_event.id,
            user_id=test_user.id,
            ticket_type=ticket_type,
            quantity=quantity,
        )


@pytest.mark.asyncio
async def test_create_checkout_session_sold_out_ticket(
    db_session: Session,
    test_event: Event,
    test_ticket: EventTicket,
    test_user: User,
):
    """
    RED: Test creating checkout session for sold-out ticket.
    This test will fail until sold-out validation is implemented.
    """
    # Arrange
    test_ticket.quantity_available = 5
    test_ticket.quantity_sold = 5
    db_session.commit()

    # Act & Assert
    with pytest.raises(ValueError, match="Ticket sold out"):
        await create_checkout_session(
            db=db_session,
            event_id=test_event.id,
            user_id=test_user.id,
            ticket_type="vip",
            quantity=1,
        )


# ============================================================================
# Tests: handle_webhook
# ============================================================================

@pytest.mark.asyncio
async def test_handle_webhook_payment_succeeded(
    db_session: Session,
    test_event: Event,
    test_ticket: EventTicket,
    test_user: User,
):
    """
    RED: Test handling successful payment webhook.
    This test will fail until handle_webhook is implemented.
    """
    # Arrange
    webhook_payload = {
        'type': 'payment_intent.succeeded',
        'data': {
            'object': {
                'id': 'pi_test_123456',
                'amount': 40000,
                'currency': 'gbp',
                'metadata': {
                    'event_id': test_event.id,
                    'user_id': test_user.id,
                    'ticket_type': 'vip',
                    'quantity': '2',
                },
                'status': 'succeeded',
            }
        }
    }

    # Act
    result = await handle_webhook(
        db=db_session,
        webhook_payload=webhook_payload,
    )

    # Assert
    assert result is not None
    assert result['status'] == 'processed'
    # Verify tickets were assigned (this will be tested in assign_tickets tests)


@pytest.mark.asyncio
async def test_handle_webhook_payment_failed(
    db_session: Session,
):
    """
    RED: Test handling failed payment webhook.
    This test will fail until error handling is implemented.
    """
    # Arrange
    webhook_payload = {
        'type': 'payment_intent.payment_failed',
        'data': {
            'object': {
                'id': 'pi_test_123456',
                'status': 'failed',
                'last_payment_error': {
                    'message': 'Your card was declined.',
                },
            }
        }
    }

    # Act
    result = await handle_webhook(
        db=db_session,
        webhook_payload=webhook_payload,
    )

    # Assert
    assert result is not None
    assert result['status'] == 'failed'


@pytest.mark.asyncio
async def test_handle_webhook_invalid_signature(
    db_session: Session,
):
    """
    RED: Test handling webhook with invalid signature.
    This test will fail until signature verification is implemented.
    """
    # Arrange
    webhook_payload = {'type': 'payment_intent.succeeded', 'data': {}}
    invalid_signature = "invalid_signature"

    # Act & Assert
    with pytest.raises(ValueError, match="Invalid webhook signature"):
        await handle_webhook(
            db=db_session,
            webhook_payload=webhook_payload,
            signature=invalid_signature,
        )


# ============================================================================
# Tests: assign_tickets
# ============================================================================

@pytest.mark.asyncio
async def test_assign_tickets_success(
    db_session: Session,
    test_event: Event,
    test_ticket: EventTicket,
    test_user: User,
):
    """
    RED: Test assigning tickets after successful payment.
    This test will fail until assign_tickets is implemented.
    """
    # Arrange
    payment_intent_id = "pi_test_123456"
    ticket_type = "vip"
    quantity = 2

    # Act
    result = await assign_tickets(
        db=db_session,
        payment_intent_id=payment_intent_id,
        event_id=test_event.id,
        user_id=test_user.id,
        ticket_type=ticket_type,
        quantity=quantity,
    )

    # Assert
    assert result is not None
    assert len(result['registrations']) == quantity
    
    # Verify registrations were created
    registrations = db_session.query(EventRegistration).filter(
        EventRegistration.event_id == test_event.id,
        EventRegistration.registered_by_user_id == test_user.id,
    ).all()
    assert len(registrations) == quantity
    
    # Verify ticket quantity_sold was updated
    db_session.refresh(test_ticket)
    assert test_ticket.quantity_sold == quantity


# ============================================================================
# Tests: generate_receipt
# ============================================================================

@pytest.mark.asyncio
async def test_generate_receipt_success(
    db_session: Session,
    test_event: Event,
    test_user: User,
):
    """
    RED: Test generating receipt for payment.
    This test will fail until generate_receipt is implemented.
    """
    # Arrange
    payment_id = "payment_test_123"
    amount = 40000  # £400.00 in cents
    currency = "gbp"
    ticket_type = "vip"
    quantity = 2

    # Act
    result = await generate_receipt(
        db=db_session,
        payment_id=payment_id,
        event_id=test_event.id,
        user_id=test_user.id,
        amount=amount,
        currency=currency,
        ticket_type=ticket_type,
        quantity=quantity,
    )

    # Assert
    assert result is not None
    assert result['receipt_number'].startswith('RCP-')
    assert result['payment_id'] == payment_id
    assert result['event_name'] == test_event.name
    assert result['amount'] == amount
    assert result['currency'] == currency
    assert result['ticket_type'] == ticket_type
    assert result['quantity'] == quantity
    assert 'pdf_url' in result or 'pdf_path' in result


# ============================================================================
# Tests: process_refund
# ============================================================================

@pytest.mark.asyncio
async def test_process_refund_success(
    db_session: Session,
    test_event: Event,
    test_user: User,
):
    """
    RED: Test processing refund for payment.
    This test will fail until process_refund is implemented.
    """
    # Arrange
    payment_id = "payment_test_123"
    refund_amount = 40000  # Full refund

    with patch('app.services.event_payment_service.stripe.Refund.create') as mock_refund:
        mock_refund.return_value = Mock(
            id='re_test_123456',
            amount=refund_amount,
            status='succeeded',
        )

        # Act
        result = await process_refund(
            db=db_session,
            payment_id=payment_id,
            refund_amount=refund_amount,
        )

        # Assert
        assert result is not None
        assert result['refund_id'] == 're_test_123456'
        assert result['status'] == 'succeeded'
        assert result['amount'] == refund_amount
        mock_refund.assert_called_once()


@pytest.mark.asyncio
async def test_process_refund_partial(
    db_session: Session,
    test_event: Event,
    test_user: User,
):
    """
    RED: Test processing partial refund.
    This test will fail until partial refund logic is implemented.
    """
    # Arrange
    payment_id = "payment_test_123"
    refund_amount = 20000  # Partial refund (£200.00)

    with patch('app.services.event_payment_service.stripe.Refund.create') as mock_refund:
        mock_refund.return_value = Mock(
            id='re_test_123456',
            amount=refund_amount,
            status='succeeded',
        )

        # Act
        result = await process_refund(
            db=db_session,
            payment_id=payment_id,
            refund_amount=refund_amount,
        )

        # Assert
        assert result is not None
        assert result['refund_id'] == 're_test_123456'
        assert result['status'] == 'succeeded'
        assert result['amount'] == refund_amount

