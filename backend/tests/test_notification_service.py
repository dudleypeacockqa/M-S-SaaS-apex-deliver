"""
Tests for Notification Service - Critical Path (Phase 3.2)
TDD: RED → GREEN → REFACTOR
Feature: DEV-020 Notification sending with preference checking
"""
import pytest
from unittest.mock import Mock, patch, AsyncMock

from app.services import notification_service
from app.models.user_notification_preferences import UserNotificationPreferences
from app.models.user import User


# Test check_preferences()
@pytest.mark.asyncio
async def test_check_preferences_returns_true_when_no_prefs_exist(db_session):
    """Test check_preferences creates default prefs and returns True."""
    # Create user
    from app.models.organization import Organization
    org = Organization(id="org-prefs-1", name="Test Org", slug="test-org")
    user = User(
        id="user-prefs-1",
        clerk_user_id="user-1-clerk",
        email="user@example.com",
        first_name="Test",
        last_name="User",
        role="solo",
        organization_id=org.id,
        is_active=True,
    )
    
    db_session.add(org)
    db_session.add(user)
    db_session.commit()
    
    # Check preferences (should create defaults)
    allowed = await notification_service.check_preferences(
        db=db_session,
        user_id=user.id,
        notification_type="event_ticket_confirmation",
    )
    
    assert allowed is True
    
    # Verify preferences were created
    prefs = db_session.query(UserNotificationPreferences).filter(
        UserNotificationPreferences.user_id == user.id
    ).first()
    assert prefs is not None
    assert prefs.email_enabled is True


@pytest.mark.asyncio
async def test_check_preferences_returns_false_when_email_disabled(db_session):
    """Test check_preferences returns False when email is globally disabled."""
    from app.models.organization import Organization
    org = Organization(id="org-prefs-2", name="Test Org", slug="test-org")
    user = User(
        id="user-prefs-2",
        clerk_user_id="user-2-clerk",
        email="user@example.com",
        first_name="Test",
        last_name="User",
        role="solo",
        organization_id=org.id,
        is_active=True,
    )
    
    db_session.add(org)
    db_session.add(user)
    db_session.commit()
    
    # Create preferences with email disabled
    prefs = UserNotificationPreferences(
        user_id=user.id,
        email_enabled=False,
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
    
    # Check preferences
    allowed = await notification_service.check_preferences(
        db=db_session,
        user_id=user.id,
        notification_type="event_ticket_confirmation",
    )
    
    assert allowed is False


@pytest.mark.asyncio
async def test_check_preferences_returns_false_when_type_disabled(db_session):
    """Test check_preferences returns False when specific type is disabled."""
    from app.models.organization import Organization
    org = Organization(id="org-prefs-3", name="Test Org", slug="test-org")
    user = User(
        id="user-prefs-3",
        clerk_user_id="user-3-clerk",
        email="user@example.com",
        first_name="Test",
        last_name="User",
        role="solo",
        organization_id=org.id,
        is_active=True,
    )
    
    db_session.add(org)
    db_session.add(user)
    db_session.commit()
    
    # Create preferences with specific type disabled
    prefs = UserNotificationPreferences(
        user_id=user.id,
        email_enabled=True,
        event_ticket_confirmation=False,  # Disabled
        event_reminders=True,
        community_comments=True,
        community_reactions=True,
        community_mentions=True,
        system_updates=True,
        security_alerts=True,
    )
    db_session.add(prefs)
    db_session.commit()
    
    # Check preferences for disabled type
    allowed = await notification_service.check_preferences(
        db=db_session,
        user_id=user.id,
        notification_type="event_ticket_confirmation",
    )
    
    assert allowed is False


@pytest.mark.asyncio
async def test_check_preferences_returns_true_when_type_enabled(db_session):
    """Test check_preferences returns True when specific type is enabled."""
    from app.models.organization import Organization
    org = Organization(id="org-prefs-4", name="Test Org", slug="test-org")
    user = User(
        id="user-prefs-4",
        clerk_user_id="user-4-clerk",
        email="user@example.com",
        first_name="Test",
        last_name="User",
        role="solo",
        organization_id=org.id,
        is_active=True,
    )
    
    db_session.add(org)
    db_session.add(user)
    db_session.commit()
    
    # Create preferences with specific type enabled
    prefs = UserNotificationPreferences(
        user_id=user.id,
        email_enabled=True,
        event_ticket_confirmation=True,
        event_reminders=False,
        community_comments=True,
        community_reactions=True,
        community_mentions=True,
        system_updates=True,
        security_alerts=True,
    )
    db_session.add(prefs)
    db_session.commit()
    
    # Check preferences for enabled type
    allowed = await notification_service.check_preferences(
        db=db_session,
        user_id=user.id,
        notification_type="event_ticket_confirmation",
    )
    
    assert allowed is True


@pytest.mark.asyncio
async def test_check_preferences_unknown_type_defaults_to_allowed(db_session):
    """Test check_preferences returns True for unknown notification types."""
    from app.models.organization import Organization
    org = Organization(id="org-prefs-5", name="Test Org", slug="test-org")
    user = User(
        id="user-prefs-5",
        clerk_user_id="user-5-clerk",
        email="user@example.com",
        first_name="Test",
        last_name="User",
        role="solo",
        organization_id=org.id,
        is_active=True,
    )
    
    db_session.add(org)
    db_session.add(user)
    db_session.commit()
    
    # Check preferences for unknown type
    allowed = await notification_service.check_preferences(
        db=db_session,
        user_id=user.id,
        notification_type="unknown_type",
    )
    
    # Should default to allowed for unknown types
    assert allowed is True


# Test send_notification()
@pytest.mark.asyncio
async def test_send_notification_skips_when_preference_disabled(db_session):
    """Test send_notification skips sending when preference is disabled."""
    from app.models.organization import Organization
    org = Organization(id="org-notif-1", name="Test Org", slug="test-org")
    user = User(
        id="user-notif-1",
        clerk_user_id="user-1-clerk",
        email="user@example.com",
        first_name="Test",
        last_name="User",
        role="solo",
        organization_id=org.id,
        is_active=True,
    )
    
    db_session.add(org)
    db_session.add(user)
    db_session.commit()
    
    # Create preferences with email disabled
    prefs = UserNotificationPreferences(
        user_id=user.id,
        email_enabled=False,
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
    
    # Send notification
    result = await notification_service.send_notification(
        db=db_session,
        notification_type="event_ticket_confirmation",
        user_id=user.id,
        data={"event_name": "Test Event"},
    )
    
    assert result["status"] == "skipped"
    assert result["reason"] == "User preference disabled"
    assert result["notification_type"] == "event_ticket_confirmation"


@pytest.mark.asyncio
@patch("app.services.notification_service.email_service.send_email")
@patch("app.services.notification_service.email_service.render_template")
async def test_send_notification_sends_email_when_allowed(
    mock_render_template,
    mock_send_email,
    db_session,
):
    """Test send_notification sends email when preference is enabled."""
    from app.models.organization import Organization
    org = Organization(id="org-notif-2", name="Test Org", slug="test-org")
    user = User(
        id="user-notif-2",
        clerk_user_id="user-2-clerk",
        email="user@example.com",
        first_name="Test",
        last_name="User",
        role="solo",
        organization_id=org.id,
        is_active=True,
    )
    
    db_session.add(org)
    db_session.add(user)
    db_session.commit()
    
    # Setup mocks
    mock_render_template.return_value = {
        "html_content": "<html>Test</html>",
        "text_content": "Test",
    }
    mock_send_email.return_value = {"status": "sent", "message_id": "msg-123"}
    
    # Send notification
    result = await notification_service.send_notification(
        db=db_session,
        notification_type="event_ticket_confirmation",
        user_id=user.id,
        data={"event_name": "Test Event"},
    )
    
    assert result["status"] == "sent"
    mock_render_template.assert_called_once()
    mock_send_email.assert_called_once()


@pytest.mark.asyncio
async def test_send_notification_unsupported_channel(db_session):
    """Test send_notification returns error for unsupported channel."""
    from app.models.organization import Organization
    org = Organization(id="org-notif-3", name="Test Org", slug="test-org")
    user = User(
        id="user-notif-3",
        clerk_user_id="user-3-clerk",
        email="user@example.com",
        first_name="Test",
        last_name="User",
        role="solo",
        organization_id=org.id,
        is_active=True,
    )
    
    db_session.add(org)
    db_session.add(user)
    db_session.commit()
    
    # Send notification with unsupported channel
    result = await notification_service.send_notification(
        db=db_session,
        notification_type="event_ticket_confirmation",
        user_id=user.id,
        data={"event_name": "Test Event"},
        channel="sms",  # Unsupported
    )
    
    assert result["status"] == "failed"
    assert "Unsupported channel" in result["error"]


@pytest.mark.asyncio
@patch("app.services.notification_service.email_service.render_template")
async def test_send_notification_template_error(
    mock_render_template,
    db_session,
):
    """Test send_notification handles template rendering errors."""
    from app.models.organization import Organization
    org = Organization(id="org-notif-4", name="Test Org", slug="test-org")
    user = User(
        id="user-notif-4",
        clerk_user_id="user-4-clerk",
        email="user@example.com",
        first_name="Test",
        last_name="User",
        role="solo",
        organization_id=org.id,
        is_active=True,
    )
    
    db_session.add(org)
    db_session.add(user)
    db_session.commit()
    
    # Setup mock to raise ValueError
    mock_render_template.side_effect = ValueError("Template not found")
    
    # Send notification
    result = await notification_service.send_notification(
        db=db_session,
        notification_type="event_ticket_confirmation",
        user_id=user.id,
        data={"event_name": "Test Event"},
    )
    
    assert result["status"] == "failed"
    assert "Template error" in result["error"]


@pytest.mark.asyncio
async def test_send_notification_user_not_found(db_session):
    """Test send_notification raises IntegrityError when user not found (FK constraint)."""
    from sqlalchemy.exc import IntegrityError
    
    # Send notification for non-existent user
    # check_preferences will try to create preferences, which fails due to FK constraint
    with pytest.raises(IntegrityError):
        await notification_service.send_notification(
            db=db_session,
            notification_type="event_ticket_confirmation",
            user_id="non-existent-user",
            data={"event_name": "Test Event"},
        )


# Test _get_template_name()
def test_get_template_name_maps_correctly():
    """Test _get_template_name maps notification types to template names."""
    assert notification_service._get_template_name("event_ticket_confirmation") == "event_ticket_confirmation"
    assert notification_service._get_template_name("event_reminder_24h") == "event_reminder_24h"
    assert notification_service._get_template_name("new_comment") == "community_comment"
    assert notification_service._get_template_name("new_reaction") == "community_reaction"
    assert notification_service._get_template_name("mention") == "community_mention"
    assert notification_service._get_template_name("security_alert") == "security_alert"


def test_get_template_name_defaults_for_unknown():
    """Test _get_template_name defaults to event_ticket_confirmation for unknown types."""
    result = notification_service._get_template_name("unknown_type")
    assert result == "event_ticket_confirmation"


# Test _get_email_subject()
def test_get_email_subject_maps_correctly():
    """Test _get_email_subject maps notification types to subjects."""
    data = {"event_name": "Test Event"}
    
    assert "Ticket Confirmation: Test Event" in notification_service._get_email_subject("event_ticket_confirmation", data)
    assert "Event Reminder: Test Event starts in 24 hours" in notification_service._get_email_subject("event_reminder_24h", data)
    assert "New comment on your post" in notification_service._get_email_subject("new_comment", data)
    assert "Security Alert" in notification_service._get_email_subject("security_alert", data)


def test_get_email_subject_defaults_for_unknown():
    """Test _get_email_subject defaults for unknown types."""
    result = notification_service._get_email_subject("unknown_type", {})
    assert "Notification from M&A Intelligence Platform" in result


def test_get_email_subject_handles_missing_event_name():
    """Test _get_email_subject handles missing event_name in data."""
    data = {}
    result = notification_service._get_email_subject("event_ticket_confirmation", data)
    assert "Ticket Confirmation: Event" in result
