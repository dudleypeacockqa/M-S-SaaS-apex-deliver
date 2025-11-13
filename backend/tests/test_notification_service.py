"""
TDD Tests for Notification Service (DEV-020)
RED Phase: Tests that will initially fail until implementation

Following TDD RED → GREEN → REFACTOR methodology.
"""
from __future__ import annotations

import pytest
from unittest.mock import Mock, patch, AsyncMock
from datetime import datetime, timezone, timedelta

from sqlalchemy.orm import Session

from app.services.notification_service import (
    send_notification,
    check_preferences,
    trigger_event_notification,
    trigger_community_notification,
)


# ============================================================================
# Fixtures
# ============================================================================

@pytest.fixture
def test_user(db_session: Session, create_organization):
    """Create a test user."""
    org = create_organization(name="Test Org")
    from app.models.user import User, UserRole
    user = User(
        id="user-test-123",
        clerk_user_id="clerk_test_123",
        email="test@example.com",
        first_name="Test",
        last_name="User",
        organization_id=str(org.id),
        role=UserRole.solo,
    )
    db_session.add(user)
    db_session.commit()
    return user


@pytest.fixture
def test_event(db_session: Session, create_organization, test_user):
    """Create a test event."""
    from app.models.event import Event, EventStatus, EventType
    import uuid
    org = create_organization(name=f"Test Org {uuid.uuid4().hex[:8]}")
    event = Event(
        id="event-test-123",
        name="M&A Summit 2025",
        description="Annual M&A conference",
        event_type=EventType.IN_PERSON,
        status=EventStatus.PUBLISHED,
        start_date=datetime.now(timezone.utc) + timedelta(days=30),
        end_date=datetime.now(timezone.utc) + timedelta(days=31),
        location="London, UK",
        organization_id=str(org.id),
        created_by_user_id=test_user.id,
    )
    db_session.add(event)
    db_session.commit()
    return event


# ============================================================================
# Tests: send_notification
# ============================================================================

@pytest.mark.asyncio
async def test_send_notification_email_enabled(
    db_session: Session,
    test_user,
):
    """
    RED: Test sending notification when email is enabled.
    This test will fail until send_notification is implemented.
    """
    # Arrange
    notification_type = "event_ticket_confirmation"
    user_id = test_user.id
    data = {"event_name": "Test Event"}

    # Create notification preferences (email enabled)
    from app.models.user_notification_preferences import UserNotificationPreferences
    prefs = UserNotificationPreferences(
        user_id=user_id,
        email_enabled=True,
        event_ticket_confirmation=True,
    )
    db_session.add(prefs)
    db_session.commit()

    with patch('app.services.notification_service.email_service.send_email') as mock_send:
        mock_send.return_value = {'status': 'sent'}

        # Act
        result = await send_notification(
            db=db_session,
            notification_type=notification_type,
            user_id=user_id,
            data=data,
        )

        # Assert
        assert result is not None
        assert result['status'] == 'sent'
        mock_send.assert_called_once()


@pytest.mark.asyncio
async def test_send_notification_email_disabled(
    db_session: Session,
    test_user,
):
    """
    RED: Test notification skipped when email is disabled.
    This test will fail until preference checking is implemented.
    """
    # Arrange
    notification_type = "event_ticket_confirmation"
    user_id = test_user.id
    data = {"event_name": "Test Event"}

    # Create notification preferences (email disabled)
    from app.models.user_notification_preferences import UserNotificationPreferences
    prefs = UserNotificationPreferences(
        user_id=user_id,
        email_enabled=False,
        event_ticket_confirmation=False,
    )
    db_session.add(prefs)
    db_session.commit()

    # Act
    result = await send_notification(
        db=db_session,
        notification_type=notification_type,
        user_id=user_id,
        data=data,
    )

    # Assert
    assert result is not None
    assert result['status'] == 'skipped'
    assert 'reason' in result
    assert 'preference' in result['reason'].lower()


# ============================================================================
# Tests: check_preferences
# ============================================================================

@pytest.mark.asyncio
async def test_check_preferences_allows_notification(
    db_session: Session,
    test_user,
):
    """
    RED: Test checking preferences allows notification.
    This test will fail until check_preferences is implemented.
    """
    # Arrange
    notification_type = "event_ticket_confirmation"
    user_id = test_user.id

    # Create notification preferences
    from app.models.user_notification_preferences import UserNotificationPreferences
    prefs = UserNotificationPreferences(
        user_id=user_id,
        email_enabled=True,
        event_ticket_confirmation=True,
    )
    db_session.add(prefs)
    db_session.commit()

    # Act
    result = await check_preferences(
        db=db_session,
        user_id=user_id,
        notification_type=notification_type,
    )

    # Assert
    assert result is True


@pytest.mark.asyncio
async def test_check_preferences_blocks_notification(
    db_session: Session,
    test_user,
):
    """
    RED: Test checking preferences blocks notification.
    This test will fail until check_preferences is implemented.
    """
    # Arrange
    notification_type = "event_ticket_confirmation"
    user_id = test_user.id

    # Create notification preferences (disabled)
    from app.models.user_notification_preferences import UserNotificationPreferences
    prefs = UserNotificationPreferences(
        user_id=user_id,
        email_enabled=True,
        event_ticket_confirmation=False,  # Disabled
    )
    db_session.add(prefs)
    db_session.commit()

    # Act
    result = await check_preferences(
        db=db_session,
        user_id=user_id,
        notification_type=notification_type,
    )

    # Assert
    assert result is False


# ============================================================================
# Tests: trigger_event_notification
# ============================================================================

@pytest.mark.asyncio
async def test_trigger_event_ticket_confirmation(
    db_session: Session,
    test_user,
    test_event,
):
    """
    RED: Test triggering event ticket confirmation notification.
    This test will fail until trigger_event_notification is implemented.
    """
    # Arrange
    ticket_data = {
        "ticket_type": "VIP",
        "quantity": 2,
        "amount": 40000,
    }

    with patch('app.services.notification_service.email_service.send_email') as mock_send:
        mock_send.return_value = {'status': 'sent'}

        # Act
        result = await trigger_event_notification(
            db=db_session,
            notification_type="ticket_confirmation",
            user_id=test_user.id,
            event_id=test_event.id,
            data=ticket_data,
        )

        # Assert
        assert result is not None
        assert result['status'] == 'sent'
        mock_send.assert_called_once()


@pytest.mark.asyncio
async def test_trigger_event_reminder_24h(
    db_session: Session,
    test_user,
    test_event,
):
    """
    RED: Test triggering 24h event reminder notification.
    This test will fail until trigger_event_notification is implemented.
    """
    # Arrange
    reminder_data = {
        "reminder_type": "24h",
        "event_date": test_event.start_date.isoformat(),
    }

    with patch('app.services.notification_service.email_service.send_email') as mock_send:
        mock_send.return_value = {'status': 'sent'}

        # Act
        result = await trigger_event_notification(
            db=db_session,
            notification_type="reminder_24h",
            user_id=test_user.id,
            event_id=test_event.id,
            data=reminder_data,
        )

        # Assert
        assert result is not None
        assert result['status'] == 'sent'


# ============================================================================
# Tests: trigger_community_notification
# ============================================================================

@pytest.mark.asyncio
async def test_trigger_community_comment_notification(
    db_session: Session,
    test_user,
):
    """
    RED: Test triggering community comment notification.
    This test will fail until trigger_community_notification is implemented.
    """
    # Arrange
    comment_data = {
        "post_id": "post-123",
        "comment_id": "comment-456",
        "commenter_name": "John Doe",
        "comment_content": "Great post!",
    }

    with patch('app.services.notification_service.email_service.send_email') as mock_send:
        mock_send.return_value = {'status': 'sent'}

        # Act
        result = await trigger_community_notification(
            db=db_session,
            notification_type="new_comment",
            user_id=test_user.id,
            data=comment_data,
        )

        # Assert
        assert result is not None
        assert result['status'] == 'sent'
        mock_send.assert_called_once()


@pytest.mark.asyncio
async def test_trigger_community_reaction_notification(
    db_session: Session,
    test_user,
):
    """
    RED: Test triggering community reaction notification.
    This test will fail until trigger_community_notification is implemented.
    """
    # Arrange
    reaction_data = {
        "post_id": "post-123",
        "reaction_type": "like",
        "reactor_name": "Jane Doe",
    }

    with patch('app.services.notification_service.email_service.send_email') as mock_send:
        mock_send.return_value = {'status': 'sent'}

        # Act
        result = await trigger_community_notification(
            db=db_session,
            notification_type="new_reaction",
            user_id=test_user.id,
            data=reaction_data,
        )

        # Assert
        assert result is not None
        assert result['status'] == 'sent'


