"""
Tests for Event Management API endpoints (F-012, DEV-020).

Following TDD RED → GREEN → REFACTOR methodology.

Test Coverage:
- Event CRUD operations (5 endpoints)
- Event Session management (4 endpoints)
- Event Ticket management (4 endpoints)
- Event Registration management (4 endpoints)
- Event Analytics (1 endpoint)
- Registration CSV export (1 endpoint)

Total: 19 API endpoints
"""
import pytest
import io
import csv
from datetime import datetime, timedelta
from starlette.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.event import Event, EventSession, EventTicket, EventRegistration
from app.models.user import User
from app.models.organization import Organization


# ============================================================================
# Fixtures
# ============================================================================

@pytest.fixture
def test_organization(db_session: Session) -> Organization:
    """Create a test organization."""
    org = Organization(
        id="org-test-123",
        name="Test Organization",
        slug="test-org",
    )
    db_session.add(org)
    db_session.commit()
    db_session.refresh(org)
    return org


@pytest.fixture
def test_user(db_session: Session, test_organization: Organization) -> User:
    """Create a test user."""
    user = User(
        id="user-test-123",
        clerk_user_id="clerk_user_123",
        email="test@example.com",
        first_name="Test",
        last_name="User",
        organization_id=test_organization.id,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def test_event(db_session: Session, test_organization: Organization, test_user: User) -> Event:
    """Create a test event."""
    event = Event(
        id="event-test-123",
        organization_id=test_organization.id,
        created_by_user_id=test_user.id,
        name="Test M&A Conference 2025",
        description="Annual M&A conference for dealmakers",
        event_type="in_person",
        status="draft",
        start_date=datetime.now() + timedelta(days=30),
        end_date=datetime.now() + timedelta(days=32),
        location="Hilton Convention Center, 123 Main St, New York, NY 10001",
    )
    db_session.add(event)
    db_session.commit()
    db_session.refresh(event)
    return event


@pytest.fixture
def test_session(db_session: Session, test_event: Event, test_organization: Organization, test_user: User) -> EventSession:
    """Create a test event session."""
    session = EventSession(
        id="session-test-123",
        event_id=test_event.id,
        organization_id=test_organization.id,
        created_by_user_id=test_user.id,
        name="Opening Keynote",
        description="Welcome and introduction to the conference",
        speaker_name="Jane Smith",
        speaker_bio="CEO of MergerCo",
        start_time=test_event.start_date + timedelta(hours=1),
        end_time=test_event.start_date + timedelta(hours=2),
        location="Main Ballroom",
    )
    db_session.add(session)
    db_session.commit()
    db_session.refresh(session)
    return session


@pytest.fixture
def test_ticket(db_session: Session, test_event: Event, test_organization: Organization, test_user: User) -> EventTicket:
    """Create a test event ticket."""
    ticket = EventTicket(
        id="ticket-test-123",
        event_id=test_event.id,
        organization_id=test_organization.id,
        created_by_user_id=test_user.id,
        name="Early Bird Pass",
        description="Discounted early registration",
        price=299.00,
        currency="USD",
        quantity_available=100,
        quantity_sold=0,
        status="active",
    )
    db_session.add(ticket)
    db_session.commit()
    db_session.refresh(ticket)
    return ticket


@pytest.fixture
def test_registration(
    db_session: Session,
    test_event: Event,
    test_ticket: EventTicket,
    test_organization: Organization,
    test_user: User,
) -> EventRegistration:
    """Create a test event registration."""
    registration = EventRegistration(
        id="reg-test-123",
        event_id=test_event.id,
        ticket_id=test_ticket.id,
        organization_id=test_organization.id,
        registered_by_user_id=test_user.id,
        attendee_name="John Doe",
        attendee_email="john@example.com",
        attendee_phone="+1-555-0100",
        status="confirmed",
        payment_status="paid",
        payment_amount=299.00,
        currency="USD",
    )
    db_session.add(registration)
    db_session.commit()
    db_session.refresh(registration)
    return registration


# ============================================================================
# Event CRUD Tests
# ============================================================================

def test_create_event_returns_201(
    client: TestClient,
    test_user: User,
    test_organization: Organization,
):
    """Test creating a new event returns 201 Created."""
    event_data = {
        "organization_id": test_organization.id,
        "created_by_user_id": test_user.id,
        "name": "New M&A Summit",
        "description": "Strategic M&A conference",
        "event_type": "virtual",
        "status": "draft",
        "start_date": (datetime.now() + timedelta(days=60)).isoformat(),
        "end_date": (datetime.now() + timedelta(days=62)).isoformat(),
    }

    response = client.post("/api/events/", json=event_data)

    assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.text}"
    data = response.json()
    assert data["name"] == "New M&A Summit"
    assert data["event_type"] == "virtual"
    assert "id" in data
    assert data["created_by_user_id"] == test_user.id


def test_create_event_wrong_organization_returns_403(
    client: TestClient,
    test_organization: Organization,
    test_user: User,
):
    """Test creating event for different organization returns 403 Forbidden."""
    event_data = {
        "organization_id": "different-org-id",
        "created_by_user_id": test_user.id,
        "name": "Unauthorized Event",
        "description": "Should fail",
        "event_type": "virtual",
        "status": "draft",
        "start_date": (datetime.now() + timedelta(days=60)).isoformat(),
        "end_date": (datetime.now() + timedelta(days=62)).isoformat(),
    }

    response = client.post("/api/events/", json=event_data)

    assert response.status_code == 403, f"Expected 403, got {response.status_code}"
    assert "another organization" in response.text.lower()


def test_list_events_returns_200(client: TestClient, test_event: Event):
    """Test listing events returns 200 OK."""
    response = client.get("/api/events/")

    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    data = response.json()
    assert isinstance(data, list), "Response should be a list of events"
    assert len(data) >= 1, "Should return at least the test event"


def test_list_events_with_status_filter(
    client: TestClient,
    db_session: Session,
    test_organization: Organization,
    test_user: User,
):
    """Test filtering events by status."""
    # Create events with different statuses
    draft_event = Event(
        organization_id=test_organization.id,
        created_by_user_id=test_user.id,
        name="Draft Event",
        event_type="virtual",
        status="draft",
        start_date=datetime.now() + timedelta(days=30),
        end_date=datetime.now() + timedelta(days=31),
    )
    published_event = Event(
        organization_id=test_organization.id,
        created_by_user_id=test_user.id,
        name="Published Event",
        event_type="virtual",
        status="published",
        start_date=datetime.now() + timedelta(days=40),
        end_date=datetime.now() + timedelta(days=41),
    )
    db_session.add_all([draft_event, published_event])
    db_session.commit()

    response = client.get("/api/events/?status=published")

    assert response.status_code == 200
    data = response.json()
    for event in data:
        assert event["status"] == "published", f"Expected published, got {event['status']}"


def test_get_event_returns_200(client: TestClient, test_event: Event):
    """Test getting a single event returns 200 OK."""
    response = client.get(f"/api/events/{test_event.id}")

    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    data = response.json()
    assert data["id"] == test_event.id
    assert data["name"] == test_event.name
    assert data["event_type"] == test_event.event_type


def test_get_event_not_found_returns_404(client: TestClient):
    """Test getting non-existent event returns 404."""
    response = client.get("/api/events/nonexistent-id")

    assert response.status_code == 404, f"Expected 404, got {response.status_code}"


def test_update_event_returns_200(client: TestClient, test_event: Event):
    """Test updating an event returns 200 OK."""
    update_data = {
        "name": "Updated Conference Title",
        "description": "Updated description",
    }

    response = client.put(f"/api/events/{test_event.id}", json=update_data)

    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    data = response.json()
    assert data["name"] == "Updated Conference Title"
    assert data["description"] == "Updated description"


def test_delete_event_returns_204(client: TestClient, test_event: Event):
    """Test deleting an event returns 204 No Content."""
    response = client.delete(f"/api/events/{test_event.id}")

    assert response.status_code == 204, f"Expected 204, got {response.status_code}"

    # Verify event is deleted
    get_response = client.get(f"/api/events/{test_event.id}")
    assert get_response.status_code == 404


# ============================================================================
# Event Session Tests
# ============================================================================

def test_create_event_session_returns_201(client: TestClient, test_event: Event):
    """Test creating a new event session returns 201 Created."""
    session_data = {
        "name": "Breakout Session: Deal Sourcing",
        "description": "Strategies for finding quality deals",
        "speaker_name": "Bob Johnson",
        "speaker_bio": "VP of Corporate Development",
        "start_time": (test_event.start_date + timedelta(hours=3)).isoformat(),
        "end_time": (test_event.start_date + timedelta(hours=4)).isoformat(),
        "location": "Room 201",
    }

    response = client.post(f"/api/events/{test_event.id}/sessions", json=session_data)

    assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.text}"
    data = response.json()
    assert data["name"] == "Breakout Session: Deal Sourcing"
    assert data["event_id"] == test_event.id
    assert "id" in data


def test_list_event_sessions_returns_200(client: TestClient, test_event: Event, test_session: EventSession):
    """Test listing event sessions returns 200 OK."""
    response = client.get(f"/api/events/{test_event.id}/sessions")

    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    data = response.json()
    assert isinstance(data, list), "Response should be a list of sessions"
    assert len(data) >= 1, "Should return at least the test session"


def test_update_event_session_returns_200(
    client: TestClient,
    test_event: Event,
    test_session: EventSession,
):
    """Test updating an event session returns 200 OK."""
    update_data = {
        "name": "Updated Keynote Title",
        "speaker_name": "Jane Smith, PhD",
    }

    response = client.put(
        f"/api/events/{test_event.id}/sessions/{test_session.id}",
        json=update_data,
    )

    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    data = response.json()
    assert data["name"] == "Updated Keynote Title"
    assert data["speaker_name"] == "Jane Smith, PhD"


def test_delete_event_session_returns_204(
    client: TestClient,
    test_event: Event,
    test_session: EventSession,
):
    """Test deleting an event session returns 204 No Content."""
    response = client.delete(f"/api/events/{test_event.id}/sessions/{test_session.id}")

    assert response.status_code == 204, f"Expected 204, got {response.status_code}"


# ============================================================================
# Event Ticket Tests
# ============================================================================

def test_create_event_ticket_returns_201(client: TestClient, test_event: Event):
    """Test creating a new event ticket returns 201 Created."""
    ticket_data = {
        "name": "VIP Pass",
        "description": "Premium access with exclusive benefits",
        "price": 599.00,
        "currency": "USD",
        "quantity_total": 50,
        "is_available": True,
    }

    response = client.post(f"/api/events/{test_event.id}/tickets", json=ticket_data)

    assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.text}"
    data = response.json()
    assert data["name"] == "VIP Pass"
    assert data["price"] == 599.00
    assert data["event_id"] == test_event.id
    assert "id" in data


def test_list_event_tickets_returns_200(
    client: TestClient,
    test_event: Event,
    test_ticket: EventTicket,
):
    """Test listing event tickets returns 200 OK."""
    response = client.get(f"/api/events/{test_event.id}/tickets")

    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    data = response.json()
    assert isinstance(data, list), "Response should be a list of tickets"
    assert len(data) >= 1, "Should return at least the test ticket"


def test_update_event_ticket_returns_200(
    client: TestClient,
    test_event: Event,
    test_ticket: EventTicket,
):
    """Test updating an event ticket returns 200 OK."""
    update_data = {
        "price": 349.00,
        "is_available": False,
    }

    response = client.put(
        f"/api/events/{test_event.id}/tickets/{test_ticket.id}",
        json=update_data,
    )

    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    data = response.json()
    assert data["price"] == 349.00
    assert data["is_available"] is False


def test_delete_event_ticket_returns_204(
    client: TestClient,
    test_event: Event,
    test_ticket: EventTicket,
):
    """Test deleting an event ticket returns 204 No Content."""
    response = client.delete(f"/api/events/{test_event.id}/tickets/{test_ticket.id}")

    assert response.status_code == 204, f"Expected 204, got {response.status_code}"


# ============================================================================
# Event Registration Tests
# ============================================================================

def test_create_event_registration_returns_201(
    client: TestClient,
    test_event: Event,
    test_ticket: EventTicket,
):
    """Test creating a new event registration returns 201 Created."""
    registration_data = {
        "ticket_id": test_ticket.id,
        "attendee_first_name": "Sarah",
        "attendee_last_name": "Williams",
        "attendee_email": "sarah@example.com",
        "attendee_company": "Strategic Acquisitions LLC",
        "status": "pending",
        "payment_status": "pending",
    }

    response = client.post(
        f"/api/events/{test_event.id}/registrations",
        json=registration_data,
    )

    assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.text}"
    data = response.json()
    assert data["attendee_first_name"] == "Sarah"
    assert data["attendee_email"] == "sarah@example.com"
    assert data["event_id"] == test_event.id
    assert "id" in data


def test_list_event_registrations_returns_200(
    client: TestClient,
    test_event: Event,
    test_registration: EventRegistration,
):
    """Test listing event registrations returns 200 OK."""
    response = client.get(f"/api/events/{test_event.id}/registrations")

    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    data = response.json()
    assert isinstance(data, list), "Response should be a list of registrations"
    assert len(data) >= 1, "Should return at least the test registration"


def test_update_event_registration_returns_200(
    client: TestClient,
    test_event: Event,
    test_registration: EventRegistration,
):
    """Test updating an event registration returns 200 OK."""
    update_data = {
        "status": "confirmed",
        "payment_status": "paid",
        "payment_amount": 299.00,
    }

    response = client.put(
        f"/api/events/{test_event.id}/registrations/{test_registration.id}",
        json=update_data,
    )

    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    data = response.json()
    assert data["status"] == "confirmed"
    assert data["payment_status"] == "paid"


def test_delete_event_registration_returns_204(
    client: TestClient,
    test_event: Event,
    test_registration: EventRegistration,
):
    """Test deleting an event registration returns 204 No Content."""
    response = client.delete(
        f"/api/events/{test_event.id}/registrations/{test_registration.id}"
    )

    assert response.status_code == 204, f"Expected 204, got {response.status_code}"


# ============================================================================
# Event Analytics Tests
# ============================================================================

def test_get_event_analytics_returns_200(
    client: TestClient,
    test_event: Event,
    test_registration: EventRegistration,
):
    """Test getting event analytics returns 200 OK."""
    response = client.get(f"/api/events/{test_event.id}/analytics")

    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    data = response.json()
    assert "total_registrations" in data
    assert "confirmed_registrations" in data
    assert "total_revenue" in data
    assert "tickets_sold_by_type" in data
    assert data["total_registrations"] >= 1


# ============================================================================
# Registration Export Tests
# ============================================================================

def test_export_registrations_csv_returns_200(
    client: TestClient,
    test_event: Event,
    test_registration: EventRegistration,
):
    """Test exporting event registrations as CSV returns 200 OK."""
    response = client.get(f"/api/events/{test_event.id}/registrations/export")

    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    assert response.headers["content-type"] == "text/csv; charset=utf-8"
    assert "attachment" in response.headers.get("content-disposition", "")

    # Verify CSV structure
    csv_content = response.content.decode("utf-8")
    csv_reader = csv.DictReader(io.StringIO(csv_content))
    rows = list(csv_reader)

    assert len(rows) >= 1, "Should have at least one registration"
    first_row = rows[0]
    assert "attendee_first_name" in first_row
    assert "attendee_last_name" in first_row
    assert "attendee_email" in first_row
    assert "status" in first_row


def test_export_registrations_empty_event_returns_200(client: TestClient, test_event: Event):
    """Test exporting registrations from event with no registrations returns 200."""
    response = client.get(f"/api/events/{test_event.id}/registrations/export")

    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"

    # Verify CSV has headers but no data rows
    csv_content = response.content.decode("utf-8")
    csv_reader = csv.DictReader(io.StringIO(csv_content))
    rows = list(csv_reader)

    assert len(rows) == 0, "Should have no registrations"


# ============================================================================
# Authorization Tests
# ============================================================================

def test_list_events_requires_authentication(client: TestClient):
    """Test that listing events without authentication returns 401."""
    # Remove authentication headers
    client.headers.clear()

    response = client.get("/api/events/")

    assert response.status_code == 401, f"Expected 401, got {response.status_code}"


def test_create_event_requires_authentication(client: TestClient):
    """Test that creating an event without authentication returns 401."""
    client.headers.clear()

    event_data = {
        "organization_id": "org-123",
        "created_by_user_id": "user-123",
        "name": "Test Event",
        "event_type": "virtual",
        "status": "draft",
        "start_date": datetime.now().isoformat(),
        "end_date": datetime.now().isoformat(),
    }

    response = client.post("/api/events/", json=event_data)

    assert response.status_code == 401, f"Expected 401, got {response.status_code}"


# ============================================================================
# Authentication Fixture (autouse for all tests except auth-checking tests)
# ============================================================================

@pytest.fixture(autouse=True)
def setup_auth(request, solo_user):
    """Automatically setup authentication for all Event API tests except auth-checking tests."""
    # Skip auto-auth for tests that explicitly check authentication requirements
    if 'requires_authentication' in request.node.name:
        yield None
        return
    
    from app.api.dependencies.auth import get_current_user
    from app.main import app
    
    # Override the dependency to return our test solo user
    def override_get_current_user():
        return solo_user
    
    app.dependency_overrides[get_current_user] = override_get_current_user
    
    yield
    
    # Clean up override after test
    app.dependency_overrides.pop(get_current_user, None)
