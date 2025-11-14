"""
Tests for Notification API Routes - Critical Path (Phase 3.2)
TDD: RED → GREEN → REFACTOR
Feature: DEV-020 Notification preferences and settings
"""
import pytest
from unittest.mock import Mock, patch

from fastapi.testclient import TestClient

from app.api.dependencies.auth import get_current_user
from app.models.user_notification_preferences import UserNotificationPreferences
from app.models.user import User


class TestNotificationPreferencesAPI:
    """Test notification preferences API endpoints"""
    
    def test_get_preferences_returns_defaults_when_none_exist(
        self,
        client: TestClient,
        create_user,
        create_organization,
        dependency_overrides,
    ):
        """Test GET /preferences returns default preferences when user has none."""
        org = create_organization(name="Test Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))
        
        dependency_overrides(get_current_user, lambda: user)
        
        response = client.get("/api/notifications/preferences")
        
        assert response.status_code == 200
        data = response.json()
        
        # Should return all defaults (True)
        assert data["email_enabled"] is True
        assert data["event_ticket_confirmation"] is True
        assert data["event_reminders"] is True
        assert data["community_comments"] is True
        assert data["community_reactions"] is True
        assert data["community_mentions"] is True
        assert data["system_updates"] is True
        assert data["security_alerts"] is True
        
    
    def test_get_preferences_returns_user_preferences(
        self,
        client: TestClient,
        create_user,
        create_organization,
        db_session,
        dependency_overrides,
    ):
        """Test GET /preferences returns user's saved preferences."""
        org = create_organization(name="Test Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))
        
        # Create preferences
        prefs = UserNotificationPreferences(
            user_id=user.id,
            email_enabled=False,
            event_ticket_confirmation=True,
            event_reminders=False,
            community_comments=True,
            community_reactions=False,
            community_mentions=True,
            system_updates=False,
            security_alerts=True,
        )
        db_session.add(prefs)
        db_session.commit()
        
        dependency_overrides(get_current_user, lambda: user)
        
        response = client.get("/api/notifications/preferences")
        
        assert response.status_code == 200
        data = response.json()
        
        # Should return saved preferences
        assert data["email_enabled"] is False
        assert data["event_ticket_confirmation"] is True
        assert data["event_reminders"] is False
        assert data["community_comments"] is True
        assert data["community_reactions"] is False
        assert data["community_mentions"] is True
        assert data["system_updates"] is False
        assert data["security_alerts"] is True
        
    
    def test_update_preferences_creates_new_preferences(
        self,
        client: TestClient,
        create_user,
        create_organization,
        db_session,
        dependency_overrides,
    ):
        """Test PUT /preferences creates preferences if they don't exist."""
        org = create_organization(name="Test Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))
        
        dependency_overrides(get_current_user, lambda: user)
        
        update_data = {
            "email_enabled": False,
            "event_reminders": False,
            "security_alerts": True,
        }
        
        response = client.put("/api/notifications/preferences", json=update_data)
        
        assert response.status_code == 200
        data = response.json()
        
        # Should create with specified values, defaults for others
        assert data["email_enabled"] is False
        assert data["event_reminders"] is False
        assert data["security_alerts"] is True
        assert data["event_ticket_confirmation"] is True  # Default
        assert data["community_comments"] is True  # Default
        
        # Verify in database
        prefs = db_session.query(UserNotificationPreferences).filter(
            UserNotificationPreferences.user_id == user.id
        ).first()
        assert prefs is not None
        assert prefs.email_enabled is False
        assert prefs.event_reminders is False
        
    
    def test_update_preferences_updates_existing_preferences(
        self,
        client: TestClient,
        create_user,
        create_organization,
        db_session,
        dependency_overrides,
    ):
        """Test PUT /preferences updates existing preferences."""
        org = create_organization(name="Test Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))
        
        # Create existing preferences
        prefs = UserNotificationPreferences(
            user_id=user.id,
            email_enabled=True,
            event_ticket_confirmation=True,
            event_reminders=True,
            community_comments=True,
            community_reactions=True,
            community_mentions=True,
            system_updates=True,
            security_alerts=True,
        )
        db_session.add(prefs)
        db_session.commit()
        
        dependency_overrides(get_current_user, lambda: user)
        
        update_data = {
            "email_enabled": False,
            "event_reminders": False,
        }
        
        response = client.put("/api/notifications/preferences", json=update_data)
        
        assert response.status_code == 200
        data = response.json()
        
        # Should update specified fields
        assert data["email_enabled"] is False
        assert data["event_reminders"] is False
        # Other fields should remain unchanged
        assert data["event_ticket_confirmation"] is True
        assert data["community_comments"] is True
        
        # Verify in database
        db_session.refresh(prefs)
        assert prefs.email_enabled is False
        assert prefs.event_reminders is False
        assert prefs.event_ticket_confirmation is True
        
    
    def test_update_preferences_partial_update(
        self,
        client: TestClient,
        create_user,
        create_organization,
        db_session,
        dependency_overrides,
    ):
        """Test PUT /preferences with partial update (only some fields)."""
        org = create_organization(name="Test Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))
        
        # Create existing preferences
        prefs = UserNotificationPreferences(
            user_id=user.id,
            email_enabled=True,
            event_ticket_confirmation=True,
            event_reminders=True,
            community_comments=False,
            community_reactions=True,
            community_mentions=False,
            system_updates=True,
            security_alerts=True,
        )
        db_session.add(prefs)
        db_session.commit()
        
        dependency_overrides(get_current_user, lambda: user)
        
        # Only update one field
        update_data = {
            "community_comments": True,
        }
        
        response = client.put("/api/notifications/preferences", json=update_data)
        
        assert response.status_code == 200
        data = response.json()
        
        # Only specified field should change
        assert data["community_comments"] is True
        # Other fields should remain unchanged
        assert data["email_enabled"] is True
        assert data["event_reminders"] is True
        assert data["community_mentions"] is False
        
    
    def test_update_preferences_all_fields(
        self,
        client: TestClient,
        create_user,
        create_organization,
        db_session,
        dependency_overrides,
    ):
        """Test PUT /preferences with all fields updated."""
        org = create_organization(name="Test Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))
        
        dependency_overrides(get_current_user, lambda: user)
        
        update_data = {
            "email_enabled": False,
            "event_ticket_confirmation": False,
            "event_reminders": False,
            "community_comments": False,
            "community_reactions": False,
            "community_mentions": False,
            "system_updates": False,
            "security_alerts": False,
        }
        
        response = client.put("/api/notifications/preferences", json=update_data)
        
        assert response.status_code == 200
        data = response.json()
        
        # All fields should be False
        assert data["email_enabled"] is False
        assert data["event_ticket_confirmation"] is False
        assert data["event_reminders"] is False
        assert data["community_comments"] is False
        assert data["community_reactions"] is False
        assert data["community_mentions"] is False
        assert data["system_updates"] is False
        assert data["security_alerts"] is False
        

