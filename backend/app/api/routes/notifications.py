"""
Notification API Routes (DEV-020)
Handles notification preferences and settings.
"""
from __future__ import annotations

from typing import Dict, Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.api.dependencies.auth import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.models.user_notification_preferences import UserNotificationPreferences

router = APIRouter(prefix="/notifications", tags=["notifications"])


# ============================================================================
# Schemas
# ============================================================================

class NotificationPreferencesResponse(BaseModel):
    """Notification preferences response schema"""
    email_enabled: bool
    event_ticket_confirmation: bool
    event_reminders: bool
    community_comments: bool
    community_reactions: bool
    community_mentions: bool
    system_updates: bool
    security_alerts: bool
    
    class Config:
        from_attributes = True


class NotificationPreferencesUpdate(BaseModel):
    """Notification preferences update schema"""
    email_enabled: bool | None = None
    event_ticket_confirmation: bool | None = None
    event_reminders: bool | None = None
    community_comments: bool | None = None
    community_reactions: bool | None = None
    community_mentions: bool | None = None
    system_updates: bool | None = None
    security_alerts: bool | None = None


# ============================================================================
# Routes
# ============================================================================

@router.get("/preferences", response_model=NotificationPreferencesResponse)
async def get_preferences(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get user notification preferences.
    
    Returns default preferences if user hasn't set any yet.
    """
    prefs = db.query(UserNotificationPreferences).filter(
        UserNotificationPreferences.user_id == current_user.id
    ).first()
    
    if not prefs:
        # Return default preferences
        return NotificationPreferencesResponse(
            email_enabled=True,
            event_ticket_confirmation=True,
            event_reminders=True,
            community_comments=True,
            community_reactions=True,
            community_mentions=True,
            system_updates=True,
            security_alerts=True,
        )
    
    return NotificationPreferencesResponse(
        email_enabled=prefs.email_enabled,
        event_ticket_confirmation=prefs.event_ticket_confirmation,
        event_reminders=prefs.event_reminders,
        community_comments=prefs.community_comments,
        community_reactions=prefs.community_reactions,
        community_mentions=prefs.community_mentions,
        system_updates=prefs.system_updates,
        security_alerts=prefs.security_alerts,
    )


@router.put("/preferences", response_model=NotificationPreferencesResponse)
async def update_preferences(
    preferences: NotificationPreferencesUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Update user notification preferences.
    
    Creates preferences if they don't exist.
    """
    prefs = db.query(UserNotificationPreferences).filter(
        UserNotificationPreferences.user_id == current_user.id
    ).first()
    
    if not prefs:
        # Create new preferences
        prefs = UserNotificationPreferences(
            user_id=current_user.id,
            email_enabled=preferences.email_enabled if preferences.email_enabled is not None else True,
            event_ticket_confirmation=preferences.event_ticket_confirmation if preferences.event_ticket_confirmation is not None else True,
            event_reminders=preferences.event_reminders if preferences.event_reminders is not None else True,
            community_comments=preferences.community_comments if preferences.community_comments is not None else True,
            community_reactions=preferences.community_reactions if preferences.community_reactions is not None else True,
            community_mentions=preferences.community_mentions if preferences.community_mentions is not None else True,
            system_updates=preferences.system_updates if preferences.system_updates is not None else True,
            security_alerts=preferences.security_alerts if preferences.security_alerts is not None else True,
        )
        db.add(prefs)
    else:
        # Update existing preferences
        if preferences.email_enabled is not None:
            prefs.email_enabled = preferences.email_enabled
        if preferences.event_ticket_confirmation is not None:
            prefs.event_ticket_confirmation = preferences.event_ticket_confirmation
        if preferences.event_reminders is not None:
            prefs.event_reminders = preferences.event_reminders
        if preferences.community_comments is not None:
            prefs.community_comments = preferences.community_comments
        if preferences.community_reactions is not None:
            prefs.community_reactions = preferences.community_reactions
        if preferences.community_mentions is not None:
            prefs.community_mentions = preferences.community_mentions
        if preferences.system_updates is not None:
            prefs.system_updates = preferences.system_updates
        if preferences.security_alerts is not None:
            prefs.security_alerts = preferences.security_alerts
    
    db.commit()
    db.refresh(prefs)
    
    return NotificationPreferencesResponse(
        email_enabled=prefs.email_enabled,
        event_ticket_confirmation=prefs.event_ticket_confirmation,
        event_reminders=prefs.event_reminders,
        community_comments=prefs.community_comments,
        community_reactions=prefs.community_reactions,
        community_mentions=prefs.community_mentions,
        system_updates=prefs.system_updates,
        security_alerts=prefs.security_alerts,
    )

