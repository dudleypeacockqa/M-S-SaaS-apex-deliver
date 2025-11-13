# DEV-020: Email Notifications

**STATUS: 🟠 IN PROGRESS**
**Priority**: P0 (High)
**Epic**: Platform Communication
**Started**: 2025-11-15
**Target Completion**: 2025-11-21
**Estimated Effort**: 4-6 days (TDD)
**Methodology**: BMAD v6-alpha + TDD

> 2025-11-15 Update: Event registration confirmations implemented via SendGrid (`backend/app/services/event_notification_service.py`). Reminder scheduler and dashboard preferences UI now live (`frontend/src/pages/dashboard/Settings.tsx`).

---

## Story Description

Implement a comprehensive email notification system for events, community interactions, and system updates, with support for transactional emails and user notification preferences.

---

## Acceptance Criteria

### Functional Requirements
- [ ] Email service integrated (SendGrid/Resend)
- [ ] Event ticket confirmation emails sent upon purchase
- [ ] Event reminder emails sent (24h before, 1h before)
- [ ] Community notification emails (new comments, reactions, mentions)
- [ ] System notification emails (account updates, security alerts)
- [ ] User notification preferences respected
- [ ] Email templates with branding
- [ ] Email delivery tracking and retry logic

### Technical Requirements
- [ ] Backend coverage ≥90% for email service
- [ ] Frontend coverage ≥85% for notification preferences UI
- [ ] Email templates stored and versioned
- [ ] Email queue for reliable delivery
- [ ] Delivery status tracking

### User Experience
- [ ] Clear notification preferences UI
- [ ] Users can opt-in/opt-out of different notification types
- [ ] Professional email templates with branding
- [ ] Mobile-responsive email templates

---

## TDD Implementation Plan

### Phase 1: RED - Test Creation
1. **Backend Tests** (`backend/tests/test_email_service.py`):
   - Test email sending (success, failure)
   - Test template rendering
   - Test email queue processing
   - Test retry logic

2. **Backend Tests** (`backend/tests/test_notification_service.py`):
   - Test notification preference checking
   - Test notification triggering
   - Test notification queuing

3. **Frontend Tests** (`frontend/src/pages/settings/NotificationSettings.test.tsx`):
   - Test notification preferences UI
   - Test preference saving
   - Test preference loading

### Phase 2: GREEN - Implementation
1. **Backend Services**:
   - `backend/app/services/email_service.py`:
     - `send_email()` - Send email via provider
     - `render_template()` - Render email template
     - `queue_email()` - Queue email for async sending
     - `retry_failed_email()` - Retry failed emails

   - `backend/app/services/notification_service.py`:
     - `send_notification()` - Send notification (email/SMS)
     - `check_preferences()` - Check user notification preferences
     - `trigger_event_notification()` - Trigger event-related notifications
     - `trigger_community_notification()` - Trigger community notifications

2. **Backend Models**:
   - `backend/app/models/user_notification_preferences.py`:
     - `UserNotificationPreferences` model

   - `backend/app/models/email_queue.py`:
     - `EmailQueue` model (for async email sending)

3. **Backend API Routes**:
   - `backend/app/api/routes/notifications.py`:
     - `GET /api/notifications/preferences` - Get user preferences
     - `PUT /api/notifications/preferences` - Update preferences

4. **Frontend Components**:
   - `frontend/src/components/notifications/NotificationPreferences.tsx`:
     - Notification preferences UI
     - Preference toggles
     - Save functionality

5. **Email Templates**:
   - `backend/app/templates/emails/event_ticket_confirmation.html`
   - `backend/app/templates/emails/event_reminder_24h.html`
   - `backend/app/templates/emails/event_reminder_1h.html`
   - `backend/app/templates/emails/community_comment.html`
   - `backend/app/templates/emails/community_reaction.html`
   - `backend/app/templates/emails/system_update.html`

### Phase 3: REFACTOR - Code Quality
1. Extract email utilities
2. Improve template management
3. Add comprehensive logging
4. Optimize email queue processing
5. Improve error handling

---

## Database Schema

### New Tables

```sql
-- User Notification Preferences
CREATE TABLE user_notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id),
    email_enabled BOOLEAN NOT NULL DEFAULT true,
    event_ticket_confirmation BOOLEAN NOT NULL DEFAULT true,
    event_reminders BOOLEAN NOT NULL DEFAULT true,
    community_comments BOOLEAN NOT NULL DEFAULT true,
    community_reactions BOOLEAN NOT NULL DEFAULT true,
    community_mentions BOOLEAN NOT NULL DEFAULT true,
    system_updates BOOLEAN NOT NULL DEFAULT true,
    security_alerts BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email Queue
CREATE TABLE email_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    to_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    template_name VARCHAR(100) NOT NULL,
    template_data JSONB NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, sent, failed
    retry_count INTEGER NOT NULL DEFAULT 0,
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## API Endpoints

### GET /api/notifications/preferences
**Response**:
```json
{
  "email_enabled": true,
  "event_ticket_confirmation": true,
  "event_reminders": true,
  "community_comments": true,
  "community_reactions": true,
  "community_mentions": true,
  "system_updates": true,
  "security_alerts": true
}
```

### PUT /api/notifications/preferences
**Request**:
```json
{
  "email_enabled": true,
  "event_ticket_confirmation": true,
  "event_reminders": false,
  "community_comments": true,
  "community_reactions": false,
  "community_mentions": true,
  "system_updates": true,
  "security_alerts": true
}
```

**Response**: 200 OK

---

## Email Templates

### Template Structure
- HTML templates with inline CSS (for email client compatibility)
- Text fallback versions
- Branding consistent with platform
- Mobile-responsive design

### Template Variables
- `user_name` - User's name
- `event_name` - Event name (for event emails)
- `event_date` - Event date/time
- `ticket_details` - Ticket information (for confirmation emails)
- `comment_content` - Comment content (for community emails)
- `platform_name` - Platform name
- `support_email` - Support email address

---

## Notification Types

### Event Notifications
1. **Ticket Confirmation**: Sent immediately after ticket purchase
2. **Event Reminder (24h)**: Sent 24 hours before event
3. **Event Reminder (1h)**: Sent 1 hour before event
4. **Event Cancelled**: Sent if event is cancelled
5. **Event Updated**: Sent if event details change

### Community Notifications
1. **New Comment**: Sent when user's post receives a comment
2. **New Reaction**: Sent when user's post receives a reaction
3. **Mention**: Sent when user is mentioned in a comment/post

### System Notifications
1. **Account Updates**: Password changes, email changes
2. **Security Alerts**: Login from new device, suspicious activity
3. **System Updates**: Platform updates, new features

---

## Testing Checklist

### Backend Tests
- [ ] Test email sending (success)
- [ ] Test email sending (failure)
- [ ] Test template rendering
- [ ] Test email queue processing
- [ ] Test retry logic
- [ ] Test notification preference checking
- [ ] Test notification triggering
- [ ] Test error handling

### Frontend Tests
- [ ] Test notification preferences UI
- [ ] Test preference saving
- [ ] Test preference loading
- [ ] Test preference validation

### Integration Tests
- [ ] Test email delivery end-to-end
- [ ] Test notification triggering
- [ ] Test email queue processing

---

## Dependencies

- SendGrid/Resend Python SDK (NEW)
- Jinja2 (for template rendering - already installed)
- Celery (for async email sending - already installed)
- Redis (for email queue - already installed)

---

## Notes

- Use email service test mode for development
- Implement email retry logic (max 3 retries)
- Store email delivery status for debugging
- Consider implementing email batching for bulk notifications
- Ensure GDPR compliance (opt-in/opt-out)

---

**Status**: ✅ GREEN PHASE - COMPLETE (ALL TESTS PASSING)
**Latest Update (2025-11-15)**: GREEN phase complete - all implementation done, all 15 tests passing
- ✅ RED phase complete - 15 tests created (7 email service, 8 notification service)
- ✅ Models created (user_notification_preferences, email_queue)
- ✅ Services implemented (email_service, notification_service)
- ✅ Routes implemented (notifications API)
- ✅ Email templates created (5 templates)
- ✅ Migration created
- ✅ **All tests passing (15/15) - 7/7 email service, 8/8 notification service**
- ✅ Template rendering fixed
- ✅ Notification type mapping complete
- ✅ Test fixture isolation fixed
- 🔄 Next: REFACTOR phase (optional) or integration with event/community services
**Owner**: Development Team
