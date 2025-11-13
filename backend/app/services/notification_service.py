"""
Notification Service (DEV-020)
Handles notification sending with preference checking.
"""
from __future__ import annotations

import logging
from typing import Optional, Dict, Any

from sqlalchemy.orm import Session

from app.models.user_notification_preferences import UserNotificationPreferences
from app.services import email_service

logger = logging.getLogger(__name__)

# Notification type mapping to preference fields
NOTIFICATION_PREFERENCE_MAP = {
    "event_ticket_confirmation": "event_ticket_confirmation",
    "ticket_confirmation": "event_ticket_confirmation",
    "event_reminder_24h": "event_reminders",
    "reminder_24h": "event_reminders",
    "event_reminder_1h": "event_reminders",
    "reminder_1h": "event_reminders",
    "event_cancelled": "event_reminders",
    "event_updated": "event_reminders",
    "new_comment": "community_comments",
    "new_reaction": "community_reactions",
    "mention": "community_mentions",
    "system_update": "system_updates",
    "security_alert": "security_alerts",
}


# ============================================================================
# Notification Sending
# ============================================================================

async def send_notification(
    db: Session,
    notification_type: str,
    user_id: str,
    data: Dict[str, Any],
    channel: str = "email",
) -> Dict[str, Any]:
    """
    Send notification to user (respecting preferences).
    
    Args:
        db: Database session
        notification_type: Type of notification
        user_id: User ID to notify
        data: Notification data
        channel: Notification channel (email, sms, etc.)
        
    Returns:
        Dict with notification status
    """
    # Check preferences
    allowed = await check_preferences(
        db=db,
        user_id=user_id,
        notification_type=notification_type,
    )
    
    if not allowed:
        logger.info(f"Notification skipped for user {user_id}, type {notification_type} (preference disabled)")
        return {
            'status': 'skipped',
            'reason': 'User preference disabled',
            'notification_type': notification_type,
        }
    
    # Send via appropriate channel
    if channel == "email":
        return await _send_email_notification(
            db=db,
            user_id=user_id,
            notification_type=notification_type,
            data=data,
        )
    else:
        logger.warning(f"Unsupported notification channel: {channel}")
        return {
            'status': 'failed',
            'error': f'Unsupported channel: {channel}',
        }


async def _send_email_notification(
    db: Session,
    user_id: str,
    notification_type: str,
    data: Dict[str, Any],
) -> Dict[str, Any]:
    """Send email notification."""
    from app.models.user import User
    
    # Get user
    user = db.get(User, user_id)
    if not user:
        raise ValueError(f"User not found: {user_id}")
    
    # Determine template name
    template_name = _get_template_name(notification_type)
    
    # Prepare template data
    template_data = {
        "user_name": f"{user.first_name} {user.last_name}".strip() or user.email,
        "user_email": user.email,
        **data,
    }
    
    # Render template
    try:
        rendered = await email_service.render_template(
            template_name=template_name,
            template_data=template_data,
        )
    except ValueError as e:
        logger.error(f"Failed to render template {template_name}: {e}")
        return {
            'status': 'failed',
            'error': f'Template error: {str(e)}',
        }
    
    # Send email
    result = await email_service.send_email(
        to_email=user.email,
        subject=_get_email_subject(notification_type, data),
        html_content=rendered['html_content'],
        text_content=rendered.get('text_content'),
    )
    
    return result


def _get_template_name(notification_type: str) -> str:
    """Get template name for notification type."""
    template_map = {
        "event_ticket_confirmation": "event_ticket_confirmation",
        "event_reminder_24h": "event_reminder_24h",
        "event_reminder_1h": "event_reminder_1h",
        "event_cancelled": "event_cancelled",
        "event_updated": "event_updated",
        "new_comment": "community_comment",
        "new_reaction": "community_reaction",
        "mention": "community_mention",
        "system_update": "system_update",
        "security_alert": "security_alert",
        "ticket_confirmation": "event_ticket_confirmation",
        "reminder_24h": "event_reminder_24h",
        "reminder_1h": "event_reminder_1h",
    }
    return template_map.get(notification_type, "event_ticket_confirmation")


def _get_email_subject(notification_type: str, data: Dict[str, Any]) -> str:
    """Get email subject for notification type."""
    subject_map = {
        "event_ticket_confirmation": f"Ticket Confirmation: {data.get('event_name', 'Event')}",
        "event_reminder_24h": f"Event Reminder: {data.get('event_name', 'Event')} starts in 24 hours",
        "reminder_24h": f"Event Reminder: {data.get('event_name', 'Event')} starts in 24 hours",
        "event_reminder_1h": f"Event Reminder: {data.get('event_name', 'Event')} starts in 1 hour",
        "reminder_1h": f"Event Reminder: {data.get('event_name', 'Event')} starts in 1 hour",
        "event_cancelled": f"Event Cancelled: {data.get('event_name', 'Event')}",
        "event_updated": f"Event Updated: {data.get('event_name', 'Event')}",
        "new_comment": f"New comment on your post",
        "new_reaction": f"New reaction on your post",
        "mention": f"You were mentioned in a comment",
        "system_update": "Platform Update",
        "security_alert": "Security Alert",
    }
    return subject_map.get(notification_type, "Notification from M&A Intelligence Platform")


# ============================================================================
# Preference Checking
# ============================================================================

async def check_preferences(
    db: Session,
    user_id: str,
    notification_type: str,
) -> bool:
    """
    Check if user has enabled notifications for this type.
    
    Args:
        db: Database session
        user_id: User ID
        notification_type: Type of notification
        
    Returns:
        True if notification is allowed, False otherwise
    """
    # Get or create preferences
    prefs = db.query(UserNotificationPreferences).filter(
        UserNotificationPreferences.user_id == user_id
    ).first()
    
    if not prefs:
        # Create default preferences (all enabled)
        prefs = UserNotificationPreferences(
            user_id=user_id,
            email_enabled=True,
            event_ticket_confirmation=True,
            event_reminders=True,
            community_comments=True,
            community_reactions=True,
            community_mentions=True,
            system_updates=True,
            security_alerts=True,
        )
        db.add(prefs)
        db.commit()
        db.refresh(prefs)
    
    # Check global email setting
    if not prefs.email_enabled:
        return False
    
    # Check specific notification type preference
    preference_field = NOTIFICATION_PREFERENCE_MAP.get(notification_type)
    if not preference_field:
        # Unknown notification type, default to allowed
        logger.warning(f"Unknown notification type: {notification_type}, allowing by default")
        return True
    
    # Get preference value
    preference_value = getattr(prefs, preference_field, True)
    return preference_value


# ============================================================================
# Event Notifications
# ============================================================================

async def trigger_event_notification(
    db: Session,
    notification_type: str,
    user_id: str,
    event_id: str,
    data: Dict[str, Any],
) -> Dict[str, Any]:
    """
    Trigger event-related notification.
    
    Args:
        db: Database session
        notification_type: Type of event notification
        user_id: User ID to notify
        event_id: Event ID
        data: Additional notification data
        
    Returns:
        Dict with notification status
    """
    from app.models.event import Event
    
    # Get event
    event = db.get(Event, event_id)
    if not event:
        raise ValueError(f"Event not found: {event_id}")
    
    # Add event data
    notification_data = {
        "event_id": event_id,
        "event_name": event.name,
        "event_date": event.start_date.isoformat() if event.start_date else None,
        "event_location": event.location,
        **data,
    }
    
    return await send_notification(
        db=db,
        notification_type=notification_type,
        user_id=user_id,
        data=notification_data,
    )


# ============================================================================
# Community Notifications
# ============================================================================

async def trigger_community_notification(
    db: Session,
    notification_type: str,
    user_id: str,
    data: Dict[str, Any],
) -> Dict[str, Any]:
    """
    Trigger community-related notification.
    
    Args:
        db: Database session
        notification_type: Type of community notification
        user_id: User ID to notify
        data: Notification data
        
    Returns:
        Dict with notification status
    """
    return await send_notification(
        db=db,
        notification_type=notification_type,
        user_id=user_id,
        data=data,
    )


