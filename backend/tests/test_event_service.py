"""
Event Service Tests
TDD: RED → GREEN → REFACTOR
Feature: F-012 Event Management Hub
"""

import pytest
from datetime import datetime, timedelta, UTC
from decimal import Decimal
from uuid import uuid4

from app.models.event import (
    Event,
    EventSession,
    EventTicket,
    EventRegistration,
    EventAnalytics,
    EventType,
    EventStatus,
    TicketStatus,
    RegistrationStatus,
)
from app.schemas.event import (
    EventCreate,
    EventUpdate,
    EventSessionCreate,
    EventTicketCreate,
    EventRegistrationCreate,
)
from app.services.event_service import EventService


class TestEventService:
    """Test EventService business logic"""

    def test_create_event(self, db_session, solo_user):
        """Test creating an event via service"""
        event_data = EventCreate(
            name="M&A Summit 2025",
            description="Annual summit",
            event_type="virtual",
            status="draft",
            start_date=datetime.now(UTC) + timedelta(days=30),
            end_date=datetime.now(UTC) + timedelta(days=31),
            location="https://zoom.us/test",
            capacity=100,
            base_price=Decimal("50.00"),
            currency="GBP",
            organization_id=solo_user.organization_id,
            created_by_user_id=solo_user.id,
        )

        event = EventService.create_event(db_session, event_data)

        assert event.id is not None
        assert event.name == "M&A Summit 2025"
        assert event.organization_id == solo_user.organization_id

    def test_get_event(self, db_session, solo_user):
        """Test retrieving an event by ID"""
        event = Event(
            id=str(uuid4()),
            name="Test Event",
            start_date=datetime.now(UTC) + timedelta(days=30),
            end_date=datetime.now(UTC) + timedelta(days=31),
            event_type=EventType.VIRTUAL,
            organization_id=solo_user.organization_id,
            created_by_user_id=solo_user.id,
        )
        db_session.add(event)
        db_session.commit()

        retrieved = EventService.get_event(
            db_session, event.id, solo_user.organization_id
        )

        assert retrieved is not None
        assert retrieved.id == event.id

    def test_get_event_wrong_organization(self, db_session, solo_user):
        """Test that event cannot be retrieved from different organization"""
        event = Event(
            id=str(uuid4()),
            name="Test Event",
            start_date=datetime.now(UTC) + timedelta(days=30),
            end_date=datetime.now(UTC) + timedelta(days=31),
            event_type=EventType.VIRTUAL,
            organization_id=solo_user.organization_id,
            created_by_user_id=solo_user.id,
        )
        db_session.add(event)
        db_session.commit()

        retrieved = EventService.get_event(db_session, event.id, str(uuid4()))

        assert retrieved is None

    def test_list_events_pagination(self, db_session, solo_user):
        """Test event listing with pagination"""
        # Create multiple events
        for i in range(10):
            event = Event(
                id=str(uuid4()),
                name=f"Event {i}",
                start_date=datetime.now(UTC) + timedelta(days=30 + i),
                end_date=datetime.now(UTC) + timedelta(days=31 + i),
                event_type=EventType.VIRTUAL,
                organization_id=solo_user.organization_id,
                created_by_user_id=solo_user.id,
            )
            db_session.add(event)
        db_session.commit()

        # Test pagination
        page1 = EventService.list_events(
            db_session, solo_user.organization_id, skip=0, limit=5
        )
        page2 = EventService.list_events(
            db_session, solo_user.organization_id, skip=5, limit=5
        )

        assert len(page1) == 5
        assert len(page2) == 5

    def test_update_event(self, db_session, solo_user):
        """Test updating an event"""
        event = Event(
            id=str(uuid4()),
            name="Original Name",
            start_date=datetime.now(UTC) + timedelta(days=30),
            end_date=datetime.now(UTC) + timedelta(days=31),
            event_type=EventType.VIRTUAL,
            organization_id=solo_user.organization_id,
            created_by_user_id=solo_user.id,
        )
        db_session.add(event)
        db_session.commit()

        update_data = EventUpdate(name="Updated Name", status="published")

        updated = EventService.update_event(
            db_session, event.id, solo_user.organization_id, update_data
        )

        assert updated.name == "Updated Name"
        assert updated.status == EventStatus.PUBLISHED

    def test_delete_event_soft_delete(self, db_session, solo_user):
        """Test that delete performs soft delete (sets status to cancelled)"""
        event = Event(
            id=str(uuid4()),
            name="Test Event",
            start_date=datetime.now(UTC) + timedelta(days=30),
            end_date=datetime.now(UTC) + timedelta(days=31),
            event_type=EventType.VIRTUAL,
            organization_id=solo_user.organization_id,
            created_by_user_id=solo_user.id,
        )
        db_session.add(event)
        db_session.commit()

        result = EventService.delete_event(
            db_session, event.id, solo_user.organization_id
        )

        assert result is True
        db_session.refresh(event)
        assert event.status == EventStatus.CANCELLED


class TestEventTicketService:
    """Test EventTicket service logic"""

    def test_create_ticket(self, db_session, solo_user):
        """Test creating a ticket tier"""
        event = Event(
            id=str(uuid4()),
            name="Test Event",
            start_date=datetime.now(UTC) + timedelta(days=30),
            end_date=datetime.now(UTC) + timedelta(days=31),
            event_type=EventType.VIRTUAL,
            organization_id=solo_user.organization_id,
            created_by_user_id=solo_user.id,
        )
        db_session.add(event)
        db_session.commit()

        ticket_data = EventTicketCreate(
            event_id=event.id,
            name="Early Bird",
            price=Decimal("50.00"),
            currency="GBP",
            quantity_available=100,
            status="active",
            organization_id=solo_user.organization_id,
            created_by_user_id=solo_user.id,
        )

        ticket = EventService.create_ticket(db_session, ticket_data)

        assert ticket.id is not None
        assert ticket.name == "Early Bird"
        assert ticket.price == Decimal("50.00")

    def test_create_ticket_invalid_event(self, db_session, solo_user):
        """Test creating ticket for non-existent event raises error"""
        ticket_data = EventTicketCreate(
            event_id=str(uuid4()),
            name="Early Bird",
            price=Decimal("50.00"),
            currency="GBP",
            organization_id=solo_user.organization_id,
            created_by_user_id=solo_user.id,
        )

        with pytest.raises(ValueError):
            EventService.create_ticket(db_session, ticket_data)


class TestEventRegistrationService:
    """Test EventRegistration service logic"""

    def test_create_registration(self, db_session, solo_user):
        """Test creating a registration"""
        event = Event(
            id=str(uuid4()),
            name="Test Event",
            start_date=datetime.now(UTC) + timedelta(days=30),
            end_date=datetime.now(UTC) + timedelta(days=31),
            event_type=EventType.VIRTUAL,
            base_price=Decimal("50.00"),
            organization_id=solo_user.organization_id,
            created_by_user_id=solo_user.id,
        )
        db_session.add(event)
        db_session.commit()

        registration_data = EventRegistrationCreate(
            event_id=event.id,
            attendee_name="John Doe",
            attendee_email="john@example.com",
            organization_id=solo_user.organization_id,
        )

        registration = EventService.create_registration(db_session, registration_data)

        assert registration.id is not None
        assert registration.attendee_name == "John Doe"
        assert registration.payment_amount == Decimal("50.00")

    def test_create_registration_with_ticket(self, db_session, solo_user):
        """Test creating registration with ticket tier"""
        event = Event(
            id=str(uuid4()),
            name="Test Event",
            start_date=datetime.now(UTC) + timedelta(days=30),
            end_date=datetime.now(UTC) + timedelta(days=31),
            event_type=EventType.VIRTUAL,
            organization_id=solo_user.organization_id,
            created_by_user_id=solo_user.id,
        )
        ticket = EventTicket(
            id=str(uuid4()),
            event_id=event.id,
            name="VIP",
            price=Decimal("200.00"),
            quantity_available=10,
            organization_id=solo_user.organization_id,
            created_by_user_id=solo_user.id,
        )
        db_session.add_all([event, ticket])
        db_session.commit()

        registration_data = EventRegistrationCreate(
            event_id=event.id,
            ticket_id=ticket.id,
            attendee_name="Jane Doe",
            attendee_email="jane@example.com",
            organization_id=solo_user.organization_id,
        )

        registration = EventService.create_registration(db_session, registration_data)

        assert registration.payment_amount == Decimal("200.00")
        assert registration.ticket_id == ticket.id

        # Verify ticket quantity updated
        db_session.refresh(ticket)
        assert ticket.quantity_sold == 1

    def test_create_registration_sold_out_ticket(self, db_session, solo_user):
        """Test that registration fails when ticket is sold out"""
        event = Event(
            id=str(uuid4()),
            name="Test Event",
            start_date=datetime.now(UTC) + timedelta(days=30),
            end_date=datetime.now(UTC) + timedelta(days=31),
            event_type=EventType.VIRTUAL,
            organization_id=solo_user.organization_id,
            created_by_user_id=solo_user.id,
        )
        ticket = EventTicket(
            id=str(uuid4()),
            event_id=event.id,
            name="VIP",
            price=Decimal("200.00"),
            quantity_available=1,
            quantity_sold=1,  # Already sold out
            organization_id=solo_user.organization_id,
            created_by_user_id=solo_user.id,
        )
        db_session.add_all([event, ticket])
        db_session.commit()

        registration_data = EventRegistrationCreate(
            event_id=event.id,
            ticket_id=ticket.id,
            attendee_name="John Doe",
            attendee_email="john@example.com",
            organization_id=solo_user.organization_id,
        )

        with pytest.raises(ValueError, match="sold out"):
            EventService.create_registration(db_session, registration_data)

    def test_cancel_registration_updates_ticket(self, db_session, solo_user):
        """Test that cancelling registration updates ticket quantity"""
        event = Event(
            id=str(uuid4()),
            name="Test Event",
            start_date=datetime.now(UTC) + timedelta(days=30),
            end_date=datetime.now(UTC) + timedelta(days=31),
            event_type=EventType.VIRTUAL,
            organization_id=solo_user.organization_id,
            created_by_user_id=solo_user.id,
        )
        ticket = EventTicket(
            id=str(uuid4()),
            event_id=event.id,
            name="VIP",
            price=Decimal("200.00"),
            quantity_available=10,
            quantity_sold=1,
            organization_id=solo_user.organization_id,
            created_by_user_id=solo_user.id,
        )
        registration = EventRegistration(
            id=str(uuid4()),
            event_id=event.id,
            ticket_id=ticket.id,
            attendee_name="John Doe",
            attendee_email="john@example.com",
            organization_id=solo_user.organization_id,
        )
        db_session.add_all([event, ticket, registration])
        db_session.commit()

        result = EventService.delete_registration(
            db_session, registration.id, solo_user.organization_id
        )

        assert result is True
        db_session.refresh(ticket)
        assert ticket.quantity_sold == 0


class TestEventAnalyticsService:
    """Test EventAnalytics service logic"""

    def test_get_event_analytics(self, db_session, solo_user):
        """Test calculating event analytics"""
        event = Event(
            id=str(uuid4()),
            name="Test Event",
            start_date=datetime.now(UTC) + timedelta(days=30),
            end_date=datetime.now(UTC) + timedelta(days=31),
            event_type=EventType.VIRTUAL,
            organization_id=solo_user.organization_id,
            created_by_user_id=solo_user.id,
        )
        # Create registrations with different statuses
        reg1 = EventRegistration(
            id=str(uuid4()),
            event_id=event.id,
            attendee_name="Alice",
            attendee_email="alice@example.com",
            payment_status="paid",
            payment_amount=Decimal("50.00"),
            status=RegistrationStatus.CONFIRMED,
            organization_id=solo_user.organization_id,
        )
        reg2 = EventRegistration(
            id=str(uuid4()),
            event_id=event.id,
            attendee_name="Bob",
            attendee_email="bob@example.com",
            payment_status="paid",
            payment_amount=Decimal("50.00"),
            status=RegistrationStatus.ATTENDED,
            organization_id=solo_user.organization_id,
        )
        reg3 = EventRegistration(
            id=str(uuid4()),
            event_id=event.id,
            attendee_name="Charlie",
            attendee_email="charlie@example.com",
            payment_status="paid",
            payment_amount=Decimal("50.00"),
            status=RegistrationStatus.ATTENDED,
            organization_id=solo_user.organization_id,
        )
        db_session.add_all([event, reg1, reg2, reg3])
        db_session.commit()

        analytics = EventService.get_event_analytics(
            db_session, event.id, solo_user.organization_id
        )

        assert analytics is not None
        assert analytics.total_registrations == 3
        assert analytics.total_attendees == 2  # Only Bob and Charlie attended
        assert analytics.total_revenue == Decimal("150.00")

    def test_analytics_with_sessions(self, db_session, solo_user):
        """Test analytics calculation with session-specific metrics"""
        event = Event(
            id=str(uuid4()),
            name="Test Event",
            start_date=datetime.now(UTC) + timedelta(days=30),
            end_date=datetime.now(UTC) + timedelta(days=31),
            event_type=EventType.VIRTUAL,
            organization_id=solo_user.organization_id,
            created_by_user_id=solo_user.id,
        )
        session1 = EventSession(
            id=str(uuid4()),
            event_id=event.id,
            name="Session 1",
            start_time=datetime.now(UTC) + timedelta(days=30, hours=9),
            end_time=datetime.now(UTC) + timedelta(days=30, hours=10),
            organization_id=solo_user.organization_id,
            created_by_user_id=solo_user.id,
        )
        session2 = EventSession(
            id=str(uuid4()),
            event_id=event.id,
            name="Session 2",
            start_time=datetime.now(UTC) + timedelta(days=30, hours=11),
            end_time=datetime.now(UTC) + timedelta(days=30, hours=12),
            organization_id=solo_user.organization_id,
            created_by_user_id=solo_user.id,
        )
        reg1 = EventRegistration(
            id=str(uuid4()),
            event_id=event.id,
            session_id=session1.id,
            attendee_name="Alice",
            attendee_email="alice@example.com",
            payment_status="paid",
            payment_amount=Decimal("50.00"),
            status=RegistrationStatus.ATTENDED,
            organization_id=solo_user.organization_id,
        )
        reg2 = EventRegistration(
            id=str(uuid4()),
            event_id=event.id,
            session_id=session2.id,
            attendee_name="Bob",
            attendee_email="bob@example.com",
            payment_status="paid",
            payment_amount=Decimal("50.00"),
            status=RegistrationStatus.ATTENDED,
            organization_id=solo_user.organization_id,
        )
        db_session.add_all([event, session1, session2, reg1, reg2])
        db_session.commit()

        analytics = EventService.get_event_analytics(
            db_session, event.id, solo_user.organization_id
        )

        assert analytics is not None
        assert len(analytics.session_metrics) == 2
        assert analytics.session_metrics[str(session1.id)]["registrations"] == 1
        assert analytics.session_metrics[str(session2.id)]["registrations"] == 1
