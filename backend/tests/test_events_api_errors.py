"""
Tests for Events API Error Paths - Phase 3.5
TDD: RED → GREEN → REFACTOR
Feature: Multi-tenant isolation and error handling for event endpoints
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.event import Event
from app.main import app
from app.api.dependencies.auth import get_current_user


class TestEventsAPIErrorPaths:
    """Test error paths in events API endpoints for multi-tenant isolation"""
    
    def test_get_event_returns_404_when_not_found(
        self,
        client: TestClient,
        create_organization,
        create_user,
    ):
        """Test GET /events/{event_id} returns 404 when event doesn't exist."""
        org = create_organization(name="Test Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))
        
        app.dependency_overrides[get_current_user] = lambda: user
        
        try:
            response = client.get(
                "/api/events/non-existent-event-id",
            )
            
            assert response.status_code == 404
            assert "not found" in response.json()["detail"].lower()
        finally:
            app.dependency_overrides.pop(get_current_user, None)
    
    def test_update_event_returns_404_when_not_found(
        self,
        client: TestClient,
        create_organization,
        create_user,
    ):
        """Test PUT /events/{event_id} returns 404 when event doesn't exist."""
        org = create_organization(name="Test Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))
        
        app.dependency_overrides[get_current_user] = lambda: user
        
        try:
            update_data = {
                "title": "Updated Event",
                "description": "Updated description",
            }
            
            response = client.put(
                "/api/events/non-existent-event-id",
                json=update_data,
            )
            
            assert response.status_code == 404
            assert "not found" in response.json()["detail"].lower()
        finally:
            app.dependency_overrides.pop(get_current_user, None)
    
    def test_delete_event_returns_404_when_not_found(
        self,
        client: TestClient,
        create_organization,
        create_user,
    ):
        """Test DELETE /events/{event_id} returns 404 when event doesn't exist."""
        org = create_organization(name="Test Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))
        
        app.dependency_overrides[get_current_user] = lambda: user
        
        try:
            response = client.delete(
                "/api/events/non-existent-event-id",
            )
            
            assert response.status_code == 404
            assert "not found" in response.json()["detail"].lower()
        finally:
            app.dependency_overrides.pop(get_current_user, None)
    
    def test_get_event_returns_404_when_from_other_org(
        self,
        client: TestClient,
        create_organization,
        create_user,
        db_session: Session,
    ):
        """Test GET /events/{event_id} returns 404 when event belongs to another organization."""
        org1 = create_organization(name="Org 1")
        user1 = create_user(email="user1@example.com", organization_id=str(org1.id))
        
        org2 = create_organization(name="Org 2")
        user2 = create_user(email="user2@example.com", organization_id=str(org2.id))
        
        # Create event in org2
        event = Event(
            organization_id=str(org2.id),
            title="Org 2 Event",
            description="Event in org2",
            created_by=user2.id,
        )
        db_session.add(event)
        db_session.commit()
        db_session.refresh(event)
        
        # Try to access from org1 user
        app.dependency_overrides[get_current_user] = lambda: user1
        
        try:
            response = client.get(
                f"/api/events/{event.id}",
            )
            
            assert response.status_code == 404
            assert "not found" in response.json()["detail"].lower()
        finally:
            app.dependency_overrides.pop(get_current_user, None)
    
    def test_update_event_returns_404_when_from_other_org(
        self,
        client: TestClient,
        create_organization,
        create_user,
        db_session: Session,
    ):
        """Test PUT /events/{event_id} returns 404 when event belongs to another organization."""
        org1 = create_organization(name="Org 1")
        user1 = create_user(email="user1@example.com", organization_id=str(org1.id))
        
        org2 = create_organization(name="Org 2")
        user2 = create_user(email="user2@example.com", organization_id=str(org2.id))
        
        # Create event in org2
        event = Event(
            organization_id=str(org2.id),
            title="Org 2 Event",
            description="Event in org2",
            created_by=user2.id,
        )
        db_session.add(event)
        db_session.commit()
        db_session.refresh(event)
        
        # Try to update from org1 user
        app.dependency_overrides[get_current_user] = lambda: user1
        
        try:
            update_data = {
                "title": "Hacked Event",
            }
            
            response = client.put(
                f"/api/events/{event.id}",
                json=update_data,
            )
            
            assert response.status_code == 404
            assert "not found" in response.json()["detail"].lower()
        finally:
            app.dependency_overrides.pop(get_current_user, None)
    
    def test_delete_event_returns_404_when_from_other_org(
        self,
        client: TestClient,
        create_organization,
        create_user,
        db_session: Session,
    ):
        """Test DELETE /events/{event_id} returns 404 when event belongs to another organization."""
        org1 = create_organization(name="Org 1")
        user1 = create_user(email="user1@example.com", organization_id=str(org1.id))
        
        org2 = create_organization(name="Org 2")
        user2 = create_user(email="user2@example.com", organization_id=str(org2.id))
        
        # Create event in org2
        event = Event(
            organization_id=str(org2.id),
            title="Org 2 Event",
            description="Event in org2",
            created_by=user2.id,
        )
        db_session.add(event)
        db_session.commit()
        db_session.refresh(event)
        
        # Try to delete from org1 user
        app.dependency_overrides[get_current_user] = lambda: user1
        
        try:
            response = client.delete(
                f"/api/events/{event.id}",
            )
            
            assert response.status_code == 404
            assert "not found" in response.json()["detail"].lower()
        finally:
            app.dependency_overrides.pop(get_current_user, None)
    
    def test_list_events_only_shows_own_org(
        self,
        client: TestClient,
        create_organization,
        create_user,
        db_session: Session,
    ):
        """Test GET /events only returns events from user's organization."""
        org1 = create_organization(name="Org 1")
        user1 = create_user(email="user1@example.com", organization_id=str(org1.id))
        
        org2 = create_organization(name="Org 2")
        user2 = create_user(email="user2@example.com", organization_id=str(org2.id))
        
        # Create events in both orgs
        event1 = Event(
            organization_id=str(org1.id),
            name="Org 1 Event",
            description="Event in org1",
            created_by_user_id=user1.id,
        )
        event2 = Event(
            organization_id=str(org2.id),
            name="Org 2 Event",
            description="Event in org2",
            created_by_user_id=user2.id,
        )
        db_session.add_all([event1, event2])
        db_session.commit()
        
        # List from org1 user
        app.dependency_overrides[get_current_user] = lambda: user1
        
        try:
            response = client.get("/api/events")
            
            assert response.status_code == 200
            data = response.json()
            # Should only see org1 events (response is a list)
            assert isinstance(data, list)
            event_names = [e.get("name") or e.get("title") for e in data]
            assert "Org 1 Event" in event_names
            assert "Org 2 Event" not in event_names
        finally:
            app.dependency_overrides.pop(get_current_user, None)

