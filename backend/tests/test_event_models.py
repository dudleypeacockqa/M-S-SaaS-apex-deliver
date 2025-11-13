"""
Event Models Tests
TDD: RED → GREEN → REFACTOR
Feature: F-012 Event Management Hub
"""

import pytest
from datetime import datetime, timedelta
from uuid import uuid4

from app.models.event import (
    Event,
    EventTicket,
    EventRegistration,
    EventSession,
    EventAnalytics,
    EventType,
    EventStatus,
    RegistrationStatus,
)
from app.models.organization import Organization
from app.models.user import User


@pytest.fixture
def sample_organization(db_session):
    """Create a sample organization for testing"""
    org = Organization(
        id=str(uuid4()),
        name="Test Organization",
        slug="test-org",
    )
    db_session.add(org)
    db_session.commit()
    db_session.refresh(org)
    return org


@pytest.fixture
def sample_user(db_session, sample_organization):
    """Create a sample user for testing"""
    user = User(
        id=str(uuid4()),
        clerk_user_id="user_test_123",
        email="test@example.com",
        organization_id=sample_organization.id,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def sample_event(db_session, sample_organization, sample_user):
    """Create a sample event for testing"""
    event = Event(
        id=str(uuid4()),
        name="Test Event",
        description="A test event",
        start_date=datetime.now() + timedelta(days=30),
        end_date=datetime.now() + timedelta(days=31),
        event_type=EventType.VIRTUAL,
        location="https://zoom.us/test",
        capacity=100,
        organization_id=sample_organization.id,
        created_by_user_id=sample_user.id,
    )
    db_session.add(event)
    db_session.commit()
    db_session.refresh(event)
    return event


class TestEventModel:
    """Test Event model"""

    def test_create_event(self, db_session, sample_organization, sample_user):
        """Test creating an event"""
        event = Event(
            id=str(uuid4()),
            name="M&A Conference 2025",
            description="Annual M&A conference",
            start_date=datetime.now() + timedelta(days=60),
            end_date=datetime.now() + timedelta(days=61),
            event_type=EventType.IN_PERSON,
            location="London, UK",
            capacity=500,
            organization_id=sample_organization.id,
            created_by_user_id=sample_user.id,
        )
        db_session.add(event)
        db_session.commit()
        db_session.refresh(event)

        assert event.id is not None
        assert event.name == "M&A Conference 2025"
        assert event.organization_id == sample_organization.id
        assert event.created_by_user_id == sample_user.id

    def test_event_requires_organization(self, db_session, sample_user):
        """Test that event requires organization_id"""
        event = Event(
            id=str(uuid4()),
            name="Test Event",
            start_date=datetime.now() + timedelta(days=30),
            end_date=datetime.now() + timedelta(days=31),
            event_type=EventType.VIRTUAL,
            organization_id=None,  # Missing organization
            created_by_user_id=sample_user.id,
        )
        db_session.add(event)
        with pytest.raises(Exception):  # Should raise integrity error
            db_session.commit()

    def test_event_location_types(self, db_session, sample_organization, sample_user):
        """Test event location types"""
        virtual_event = Event(
            id=str(uuid4()),
            name="Virtual Event",
            start_date=datetime.now() + timedelta(days=30),
            end_date=datetime.now() + timedelta(days=31),
            event_type=EventType.VIRTUAL,
            location="https://zoom.us/test",
            organization_id=sample_organization.id,
            created_by_user_id=sample_user.id,
        )
        in_person_event = Event(
            id=str(uuid4()),
            name="In-Person Event",
            start_date=datetime.now() + timedelta(days=30),
            end_date=datetime.now() + timedelta(days=31),
            event_type=EventType.IN_PERSON,
            location="London, UK",
            organization_id=sample_organization.id,
            created_by_user_id=sample_user.id,
        )
        db_session.add_all([virtual_event, in_person_event])
        db_session.commit()

        assert virtual_event.event_type == EventType.VIRTUAL
        assert in_person_event.event_type == EventType.IN_PERSON


class TestEventTicketModel:
    """Test EventTicket model"""

    def test_create_event_ticket(self, db_session, sample_event):
        """Test creating an event ticket"""
        ticket = EventTicket(
            id=str(uuid4()),
            event_id=sample_event.id,
            name="Early Bird",
            description="Early bird pricing",
            price=50.00,
            currency="GBP",
            quantity_available=50,
            sale_start_date=datetime.now(),
            sale_end_date=datetime.now() + timedelta(days=14),
            organization_id=sample_event.organization_id,
            created_by_user_id=sample_event.created_by_user_id,
        )
        db_session.add(ticket)
        db_session.commit()
        db_session.refresh(ticket)

        assert ticket.id is not None
        assert ticket.event_id == sample_event.id
        assert ticket.price == 50.00

    def test_ticket_requires_event(self, db_session):
        """Test that ticket requires event_id"""
        ticket = EventTicket(
            id=str(uuid4()),
            event_id=None,  # Missing event
            name="Test Ticket",
            price=50.00,
            currency="GBP",
            organization_id=str(uuid4()),
            created_by_user_id=str(uuid4()),
        )
        db_session.add(ticket)
        with pytest.raises(Exception):
            db_session.commit()


class TestEventRegistrationModel:
    """Test EventRegistration model"""

    def test_create_registration(self, db_session, sample_event, sample_user):
        """Test creating an event registration"""
        registration = EventRegistration(
            id=str(uuid4()),
            event_id=sample_event.id,
            attendee_name="Test User",
            attendee_email="test@example.com",
            ticket_id=None,  # Free event
            status=RegistrationStatus.CONFIRMED,
            organization_id=sample_event.organization_id,
            registered_by_user_id=sample_user.id,
        )
        db_session.add(registration)
        db_session.commit()
        db_session.refresh(registration)

        assert registration.id is not None
        assert registration.event_id == sample_event.id
        assert registration.registered_by_user_id == sample_user.id
        assert registration.status == "confirmed"

    def test_registration_requires_event_and_user(self, db_session):
        """Test that registration requires event_id and user_id"""
        registration = EventRegistration(
            id=str(uuid4()),
            event_id=None,  # Missing event
            attendee_name="Test User",
            attendee_email="test@example.com",
            status=RegistrationStatus.CONFIRMED,
            organization_id=str(uuid4()),
        )
        db_session.add(registration)
        with pytest.raises(Exception):
            db_session.commit()


class TestEventSessionModel:
    """Test EventSession model"""

    def test_create_event_session(self, db_session, sample_event):
        """Test creating an event session"""
        session = EventSession(
            id=str(uuid4()),
            event_id=sample_event.id,
            name="Keynote Address",
            description="Opening keynote",
            start_time=datetime.now() + timedelta(days=30, hours=9),
            end_time=datetime.now() + timedelta(days=30, hours=10),
            location="Main Hall",
            capacity=200,
            organization_id=sample_event.organization_id,
            created_by_user_id=sample_event.created_by_user_id,
        )
        db_session.add(session)
        db_session.commit()
        db_session.refresh(session)

        assert session.id is not None
        assert session.event_id == sample_event.id
        assert session.name == "Keynote Address"

    def test_session_requires_event(self, db_session):
        """Test that session requires event_id"""
        session = EventSession(
            id=str(uuid4()),
            event_id=None,  # Missing event
            name="Test Session",
            start_time=datetime.now(),
            end_time=datetime.now() + timedelta(hours=1),
            organization_id=str(uuid4()),
            created_by_user_id=str(uuid4()),
        )
        db_session.add(session)
        with pytest.raises(Exception):
            db_session.commit()


class TestEventAnalyticsModel:
    """Test EventAnalytics model"""

    def test_create_event_analytics(self, db_session, sample_event):
        """Test creating event analytics"""
        analytics = EventAnalytics(
            id=str(uuid4()),
            event_id=sample_event.id,
            total_registrations=50,
            total_revenue=2500.00,
            currency="GBP",
            organization_id=sample_event.organization_id,
        )
        db_session.add(analytics)
        db_session.commit()
        db_session.refresh(analytics)

        assert analytics.id is not None
        assert analytics.event_id == sample_event.id
        assert analytics.total_registrations == 50
        assert analytics.total_revenue == 2500.00

