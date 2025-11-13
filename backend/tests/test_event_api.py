"""
Event API Tests
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


class TestEventAPI:
    """Test Event CRUD API endpoints"""

    def test_create_event(self, client, auth_headers, solo_user):
        """Test POST /api/events - Create a new event"""
        event_data = {
            "name": "M&A Summit 2025",
            "description": "Annual M&A summit",
            "event_type": "virtual",
            "status": "draft",
            "start_date": (datetime.now(UTC) + timedelta(days=30)).isoformat(),
            "end_date": (datetime.now(UTC) + timedelta(days=31)).isoformat(),
            "location": "https://zoom.us/test",
            "virtual_link": "https://zoom.us/j/123456",
            "capacity": 100,
            "base_price": 50.00,
            "currency": "GBP",
            "organization_id": solo_user.organization_id,
            "created_by_user_id": solo_user.id,
        }

        response = client.post("/api/events/", json=event_data, headers=auth_headers)

        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "M&A Summit 2025"
        assert data["event_type"] == "virtual"
        assert data["organization_id"] == solo_user.organization_id
        assert "id" in data

    def test_create_event_requires_auth(self, client):
        """Test that creating an event requires authentication"""
        event_data = {
            "name": "Test Event",
            "event_type": "virtual",
            "start_date": (datetime.now(UTC) + timedelta(days=30)).isoformat(),
            "end_date": (datetime.now(UTC) + timedelta(days=31)).isoformat(),
        }

        response = client.post("/api/events/", json=event_data)

        assert response.status_code in [401, 403]  # Unauthorized or Forbidden

    def test_create_event_validates_organization(self, client, auth_headers, solo_user):
        """Test that user can only create events for their organization"""
        event_data = {
            "name": "Test Event",
            "event_type": "virtual",
            "start_date": (datetime.now(UTC) + timedelta(days=30)).isoformat(),
            "end_date": (datetime.now(UTC) + timedelta(days=31)).isoformat(),
            "organization_id": str(uuid4()),  # Different organization
            "created_by_user_id": solo_user.id,
        }

        response = client.post("/api/events/", json=event_data, headers=auth_headers)

        assert response.status_code == 403

    def test_list_events(self, client, auth_headers, solo_user, db_session):
        """Test GET /api/events - List events for organization"""
        # Create test events
        event1 = Event(
            id=str(uuid4()),
            name="Event 1",
            start_date=datetime.now(UTC) + timedelta(days=30),
            end_date=datetime.now(UTC) + timedelta(days=31),
            event_type=EventType.VIRTUAL,
            organization_id=solo_user.organization_id,
            created_by_user_id=solo_user.id,
        )
        event2 = Event(
            id=str(uuid4()),
            name="Event 2",
            start_date=datetime.now(UTC) + timedelta(days=40),
            end_date=datetime.now(UTC) + timedelta(days=41),
            event_type=EventType.IN_PERSON,
            status=EventStatus.PUBLISHED,
            organization_id=solo_user.organization_id,
            created_by_user_id=solo_user.id,
        )
        db_session.add_all([event1, event2])
        db_session.commit()

        response = client.get("/api/events/", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert data[0]["name"] in ["Event 1", "Event 2"]

    def test_list_events_filter_by_status(self, client, auth_headers, solo_user, db_session):
        """Test filtering events by status"""
        event1 = Event(
            id=str(uuid4()),
            name="Draft Event",
            start_date=datetime.now(UTC) + timedelta(days=30),
            end_date=datetime.now(UTC) + timedelta(days=31),
            event_type=EventType.VIRTUAL,
            status=EventStatus.DRAFT,
            organization_id=solo_user.organization_id,
            created_by_user_id=solo_user.id,
        )
        event2 = Event(
            id=str(uuid4()),
            name="Published Event",
            start_date=datetime.now(UTC) + timedelta(days=40),
            end_date=datetime.now(UTC) + timedelta(days=41),
            event_type=EventType.VIRTUAL,
            status=EventStatus.PUBLISHED,
            organization_id=solo_user.organization_id,
            created_by_user_id=solo_user.id,
        )
        db_session.add_all([event1, event2])
        db_session.commit()

        response = client.get("/api/events/?status=published", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["name"] == "Published Event"

    def test_get_event(self, client, auth_headers, solo_user, db_session):
        """Test GET /api/events/{event_id} - Get specific event"""
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

        response = client.get(f"/api/events/{event.id}", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == event.id
        assert data["name"] == "Test Event"

    def test_get_event_not_found(self, client, auth_headers):
        """Test getting non-existent event returns 404"""
        response = client.get(f"/api/events/{uuid4()}", headers=auth_headers)

        assert response.status_code == 404

    def test_update_event(self, client, auth_headers, solo_user, db_session):
        """Test PUT /api/events/{event_id} - Update event"""
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

        update_data = {
            "name": "Updated Name",
            "status": "published",
        }

        response = client.put(
            f"/api/events/{event.id}", json=update_data, headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated Name"
        assert data["status"] == "published"

    def test_delete_event(self, client, auth_headers, solo_user, db_session):
        """Test DELETE /api/events/{event_id} - Cancel event (soft delete)"""
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

        response = client.delete(f"/api/events/{event.id}", headers=auth_headers)

        assert response.status_code == 204

        # Verify event is cancelled (not deleted)
        db_session.refresh(event)
        assert event.status == EventStatus.CANCELLED


class TestEventSessionAPI:
    """Test Event Session API endpoints"""

    def test_create_session(self, client, auth_headers, solo_user, db_session):
        """Test POST /api/events/{event_id}/sessions - Create session"""
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

        session_data = {
            "name": "Keynote Session",
            "description": "Opening keynote",
            "start_time": (datetime.now(UTC) + timedelta(days=30, hours=9)).isoformat(),
            "end_time": (datetime.now(UTC) + timedelta(days=30, hours=10)).isoformat(),
            "speaker_name": "John Doe",
            "capacity": 50,
            "event_id": event.id,
            "organization_id": solo_user.organization_id,
            "created_by_user_id": solo_user.id,
        }

        response = client.post(
            f"/api/events/{event.id}/sessions", json=session_data, headers=auth_headers
        )

        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Keynote Session"
        assert data["event_id"] == event.id

    def test_list_sessions(self, client, auth_headers, solo_user, db_session):
        """Test GET /api/events/{event_id}/sessions - List sessions"""
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
        db_session.add_all([event, session1, session2])
        db_session.commit()

        response = client.get(f"/api/events/{event.id}/sessions", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2


class TestEventTicketAPI:
    """Test Event Ticket API endpoints"""

    def test_create_ticket(self, client, auth_headers, solo_user, db_session):
        """Test POST /api/events/{event_id}/tickets - Create ticket"""
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

        ticket_data = {
            "name": "Early Bird",
            "description": "Early bird pricing",
            "price": 50.00,
            "currency": "GBP",
            "quantity_available": 100,
            "status": "active",
            "event_id": event.id,
            "organization_id": solo_user.organization_id,
            "created_by_user_id": solo_user.id,
        }

        response = client.post(
            f"/api/events/{event.id}/tickets", json=ticket_data, headers=auth_headers
        )

        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Early Bird"
        assert float(data["price"]) == 50.00

    def test_list_tickets(self, client, auth_headers, solo_user, db_session):
        """Test GET /api/events/{event_id}/tickets - List tickets"""
        event = Event(
            id=str(uuid4()),
            name="Test Event",
            start_date=datetime.now(UTC) + timedelta(days=30),
            end_date=datetime.now(UTC) + timedelta(days=31),
            event_type=EventType.VIRTUAL,
            organization_id=solo_user.organization_id,
            created_by_user_id=solo_user.id,
        )
        ticket1 = EventTicket(
            id=str(uuid4()),
            event_id=event.id,
            name="Early Bird",
            price=Decimal("50.00"),
            organization_id=solo_user.organization_id,
            created_by_user_id=solo_user.id,
        )
        ticket2 = EventTicket(
            id=str(uuid4()),
            event_id=event.id,
            name="Standard",
            price=Decimal("100.00"),
            organization_id=solo_user.organization_id,
            created_by_user_id=solo_user.id,
        )
        db_session.add_all([event, ticket1, ticket2])
        db_session.commit()

        response = client.get(f"/api/events/{event.id}/tickets", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2

    def test_update_ticket(self, client, auth_headers, solo_user, db_session):
        """Test PUT /api/events/{event_id}/tickets/{ticket_id} - Update ticket"""
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
            name="Early Bird",
            price=Decimal("50.00"),
            organization_id=solo_user.organization_id,
            created_by_user_id=solo_user.id,
        )
        db_session.add_all([event, ticket])
        db_session.commit()

        update_data = {"price": 75.00}

        response = client.put(
            f"/api/events/{event.id}/tickets/{ticket.id}",
            json=update_data,
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert float(data["price"]) == 75.00


class TestEventRegistrationAPI:
    """Test Event Registration API endpoints"""

    def test_create_registration(self, client, auth_headers, solo_user, db_session):
        """Test POST /api/events/{event_id}/registrations - Create registration"""
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

        registration_data = {
            "attendee_name": "John Doe",
            "attendee_email": "john@example.com",
            "attendee_phone": "+44 123 456 7890",
            "event_id": event.id,
            "organization_id": solo_user.organization_id,
        }

        response = client.post(
            f"/api/events/{event.id}/registrations",
            json=registration_data,
            headers=auth_headers,
        )

        assert response.status_code == 201
        data = response.json()
        assert data["attendee_name"] == "John Doe"
        assert data["attendee_email"] == "john@example.com"

    def test_create_registration_with_ticket(
        self, client, auth_headers, solo_user, db_session
    ):
        """Test registration with ticket tier"""
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

        registration_data = {
            "attendee_name": "Jane Doe",
            "attendee_email": "jane@example.com",
            "ticket_id": ticket.id,
            "event_id": event.id,
            "organization_id": solo_user.organization_id,
        }

        response = client.post(
            f"/api/events/{event.id}/registrations",
            json=registration_data,
            headers=auth_headers,
        )

        assert response.status_code == 201
        data = response.json()
        assert float(data["payment_amount"]) == 200.00
        assert data["ticket_id"] == ticket.id

    def test_list_registrations(self, client, auth_headers, solo_user, db_session):
        """Test GET /api/events/{event_id}/registrations - List registrations"""
        event = Event(
            id=str(uuid4()),
            name="Test Event",
            start_date=datetime.now(UTC) + timedelta(days=30),
            end_date=datetime.now(UTC) + timedelta(days=31),
            event_type=EventType.VIRTUAL,
            organization_id=solo_user.organization_id,
            created_by_user_id=solo_user.id,
        )
        reg1 = EventRegistration(
            id=str(uuid4()),
            event_id=event.id,
            attendee_name="Alice",
            attendee_email="alice@example.com",
            organization_id=solo_user.organization_id,
        )
        reg2 = EventRegistration(
            id=str(uuid4()),
            event_id=event.id,
            attendee_name="Bob",
            attendee_email="bob@example.com",
            organization_id=solo_user.organization_id,
        )
        db_session.add_all([event, reg1, reg2])
        db_session.commit()

        response = client.get(
            f"/api/events/{event.id}/registrations", headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2

    def test_update_registration(self, client, auth_headers, solo_user, db_session):
        """Test PUT /api/events/{event_id}/registrations/{registration_id} - Update registration"""
        event = Event(
            id=str(uuid4()),
            name="Test Event",
            start_date=datetime.now(UTC) + timedelta(days=30),
            end_date=datetime.now(UTC) + timedelta(days=31),
            event_type=EventType.VIRTUAL,
            organization_id=solo_user.organization_id,
            created_by_user_id=solo_user.id,
        )
        registration = EventRegistration(
            id=str(uuid4()),
            event_id=event.id,
            attendee_name="John Doe",
            attendee_email="john@example.com",
            status=RegistrationStatus.PENDING,
            organization_id=solo_user.organization_id,
        )
        db_session.add_all([event, registration])
        db_session.commit()

        update_data = {"status": "confirmed", "checked_in": True}

        response = client.put(
            f"/api/events/{event.id}/registrations/{registration.id}",
            json=update_data,
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "confirmed"
        assert data["checked_in"] is True


class TestEventAnalyticsAPI:
    """Test Event Analytics API endpoints"""

    def test_get_event_analytics(self, client, auth_headers, solo_user, db_session):
        """Test GET /api/events/{event_id}/analytics - Get analytics"""
        event = Event(
            id=str(uuid4()),
            name="Test Event",
            start_date=datetime.now(UTC) + timedelta(days=30),
            end_date=datetime.now(UTC) + timedelta(days=31),
            event_type=EventType.VIRTUAL,
            organization_id=solo_user.organization_id,
            created_by_user_id=solo_user.id,
        )
        # Create some registrations
        reg1 = EventRegistration(
            id=str(uuid4()),
            event_id=event.id,
            attendee_name="Alice",
            attendee_email="alice@example.com",
            payment_status="paid",
            payment_amount=Decimal("50.00"),
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
        db_session.add_all([event, reg1, reg2])
        db_session.commit()

        response = client.get(f"/api/events/{event.id}/analytics", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()
        assert data["total_registrations"] == 2
        assert data["total_attendees"] == 1  # Only Bob attended
        assert float(data["total_revenue"]) == 100.00


class TestEventExportAPI:
    """Test Event Export API endpoints"""

    def test_export_registrations_csv(self, client, auth_headers, solo_user, db_session):
        """Test GET /api/events/{event_id}/registrations/export?format=csv"""
        event = Event(
            id=str(uuid4()),
            name="Test Event",
            start_date=datetime.now(UTC) + timedelta(days=30),
            end_date=datetime.now(UTC) + timedelta(days=31),
            event_type=EventType.VIRTUAL,
            organization_id=solo_user.organization_id,
            created_by_user_id=solo_user.id,
        )
        registration = EventRegistration(
            id=str(uuid4()),
            event_id=event.id,
            attendee_name="John Doe",
            attendee_email="john@example.com",
            organization_id=solo_user.organization_id,
        )
        db_session.add_all([event, registration])
        db_session.commit()

        response = client.get(
            f"/api/events/{event.id}/registrations/export?format=csv",
            headers=auth_headers,
        )

        assert response.status_code == 200
        assert response.headers["content-type"] == "text/csv; charset=utf-8"
        assert "John Doe" in response.text
        assert "john@example.com" in response.text

    def test_export_registrations_json(
        self, client, auth_headers, solo_user, db_session
    ):
        """Test GET /api/events/{event_id}/registrations/export?format=json"""
        event = Event(
            id=str(uuid4()),
            name="Test Event",
            start_date=datetime.now(UTC) + timedelta(days=30),
            end_date=datetime.now(UTC) + timedelta(days=31),
            event_type=EventType.VIRTUAL,
            organization_id=solo_user.organization_id,
            created_by_user_id=solo_user.id,
        )
        registration = EventRegistration(
            id=str(uuid4()),
            event_id=event.id,
            attendee_name="Jane Doe",
            attendee_email="jane@example.com",
            organization_id=solo_user.organization_id,
        )
        db_session.add_all([event, registration])
        db_session.commit()

        response = client.get(
            f"/api/events/{event.id}/registrations/export?format=json",
            headers=auth_headers,
        )

        assert response.status_code == 200
        assert response.headers["content-type"] == "application/json"
        assert "Jane Doe" in response.text
        assert "jane@example.com" in response.text
