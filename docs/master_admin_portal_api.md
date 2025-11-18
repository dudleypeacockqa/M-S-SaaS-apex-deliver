# Master Admin Portal API

## Overview
All endpoints live under the /master-admin prefix, require Clerk authenticated users, and scope results to the caller's organization. Responses use the Pydantic schemas in backend/app/schemas/master_admin.py. Unless otherwise stated, timestamps follow ISO 8601 and identifiers are integers referencing the master admin tables.

## Conventions
- Authentication header: Authorization: Bearer <Clerk session token>.
- Default pagination: page=1, per_page=50, with maximum per_page=100.
- 404 indicates the requested entity does not exist or is not owned by the current user.
- 400 is returned when validation fails (for example, duplicate weekly goal).

## Dashboard
- GET /master-admin/dashboard – Returns current score, streak, activity counts, active prospect totals, open deal totals, and unread nudges for the authenticated user.

## Goals
- POST /master-admin/goals – Create a weekly goal using AdminGoalCreate (week_start, target_discoveries, target_emails, target_videos, target_calls). Rejects duplicates for the same week.
- GET /master-admin/goals/current – Fetch the active week's goal or 404 if none exists.
- GET /master-admin/goals/{week_start} – Retrieve the goal that starts on the supplied Monday date.
- PUT /master-admin/goals/{goal_id} – Update target numbers with AdminGoalUpdate. Only provided fields are changed.

## Activities
- POST /master-admin/activities – Log a new activity with AdminActivityCreate (type, status, date, amount, notes, optional prospect_id). Automatically updates score.
- GET /master-admin/activities – Paginated activities with optional filters: start_date, end_date, activity_type. Returns AdminActivityListResponse (items, total).
- GET /master-admin/activities/{activity_id} – Retrieve a specific activity.
- PUT /master-admin/activities/{activity_id} – Update type, status, dates, amount, or notes.
- DELETE /master-admin/activities/{activity_id} – Soft delete the activity.

## Scores
- GET /master-admin/scores/today – Latest AdminScoreResponse for the current day.
- GET /master-admin/scores/{score_date} – Score snapshot for a specific date.
- GET /master-admin/scores/week/{week_start} – Weekly rollup returning AdminScoreListResponse with scores and total count.
- GET /master-admin/scores/streak – JSON payload with current streak_days and longest_streak_days.

## Focus Sessions
- POST /master-admin/focus-sessions – Start a session with AdminFocusSessionCreate (start_time, duration_minutes, optional notes).
- GET /master-admin/focus-sessions/active – Return the current running session if one exists.
- PUT /master-admin/focus-sessions/{session_id}/complete – Mark a session complete or interrupted using AdminFocusSessionUpdate fields (end_time, completed, interrupted, notes).

## Nudges
- POST /master-admin/nudges – Create a nudge with AdminNudgeCreate (type, message, priority, optional action_url, expires_at).
- GET /master-admin/nudges/unread – List unread nudges with AdminNudgeListResponse.
- PUT /master-admin/nudges/{nudge_id}/read – Mark a nudge as read, returning the updated AdminNudgeResponse.

## Meetings
- POST /master-admin/meetings – Record a templated meeting using AdminMeetingCreate (meeting_type, prospect_id, scheduled_at, duration_minutes, notes, outcome).
- GET /master-admin/meetings/type/{meeting_type} – List meetings filtered by type; returns AdminMeetingListResponse.

## Prospects
- POST /master-admin/prospects – Create a prospect via AdminProspectCreate (name, company, email, phone, status, source, notes).
- GET /master-admin/prospects – Paginated list filtered by status, owner, or created date; returns AdminProspectListResponse.
- GET /master-admin/prospects/{prospect_id} – Retrieve a single prospect record.
- PUT /master-admin/prospects/{prospect_id} – Update prospect attributes with AdminProspectUpdate.
- DELETE /master-admin/prospects/{prospect_id} – Remove the prospect and cascade to dependent activities.

## Deals
- POST /master-admin/deals – Create a pipeline entry with AdminDealCreate (prospect_id, name, stage, value, close_probability, expected_close_date, notes).
- GET /master-admin/deals – Paginated deals with optional filters stage, min_value, max_value; returns AdminDealListResponse.
- GET /master-admin/deals/{deal_id} – Retrieve a specific deal with related prospect summary.
- PUT /master-admin/deals/{deal_id} – Update stage progression or financial details using AdminDealUpdate.

## Campaigns
- POST /master-admin/campaigns – Create a campaign via AdminCampaignCreate (name, campaign_type, status, scheduled_at, notes).
- GET /master-admin/campaigns – Paginated campaigns with optional status/type filters; returns AdminCampaignListResponse.
- GET /master-admin/campaigns/{campaign_id} – Fetch campaign details and recipients.
- PUT /master-admin/campaigns/{campaign_id} – Update scheduling, status, or template content.
- DELETE /master-admin/campaigns/{campaign_id} – Remove a campaign and orphaned recipients.
- POST /master-admin/campaigns/{campaign_id}/schedule – Store a future send timestamp.
- POST /master-admin/campaigns/{campaign_id}/execute – Trigger the multi-channel execution workflow immediately; validates quotas before updating status.
- GET /master-admin/campaigns/{campaign_id}/analytics – Return delivery/engagement metrics (open rate, click rate, activity counts).
- GET /master-admin/campaigns/{campaign_id}/activities – Paginated log of tracked campaign events (email_opened, email_clicked, etc.).

## Templates
- POST /master-admin/templates – Create a reusable content template with CampaignTemplateCreate (name, type, subject, content, is_default).
- GET /master-admin/templates – List templates scoped to the requester’s organization; supports type/is_default filters.
- GET /master-admin/templates/{template_id} – Fetch a specific template.
- PUT /master-admin/templates/{template_id} – Update template metadata/content via CampaignTemplateUpdate.
- DELETE /master-admin/templates/{template_id} – Remove the template.
- POST /master-admin/templates/{template_id}/preview – Render a template with contact_data using the template service’s variable substitution.

## Voice Campaigns
- POST /master-admin/voice/agents – Provision a Synthflow agent via VoiceAgentCreate (name, instructions, optional phone/webhook metadata).
- GET /master-admin/voice/agents – List configured agents for the organization.
- POST /master-admin/voice/calls – Initiate a voice call via VoiceCallCreate (agent_id, phone_number, contact_id, optional campaign_id/metadata).
- GET /master-admin/voice/calls/{call_id} – Retrieve the latest status/transcript/duration for a call.
- POST /webhooks/voice/incoming – Receive Synthflow webhook callbacks (call.started, call.completed, etc.) and persist updates.

## Content
- POST /master-admin/content/scripts – Create a content script using AdminContentScriptCreate (title, script_body, distribution_channel).
- GET /master-admin/content/scripts – Paginated scripts; returns AdminContentScriptListResponse.
- GET /master-admin/content/scripts/{script_id} – Retrieve a script.
- PUT /master-admin/content/scripts/{script_id} – Update script details with AdminContentScriptUpdate.
- DELETE /master-admin/content/scripts/{script_id} – Remove the script.
- POST /master-admin/content/pieces – Create a content asset with AdminContentPieceCreate (title, content_type, status, publish_at, url, notes).
- GET /master-admin/content/pieces – Paginated assets; returns AdminContentPieceListResponse.
- GET /master-admin/content/pieces/{content_id} – Retrieve an asset record.
- PUT /master-admin/content/pieces/{content_id} – Update metadata with AdminContentPieceUpdate.
- DELETE /master-admin/content/pieces/{content_id} – Remove the asset.

## Lead Capture
- POST /master-admin/lead-captures – Insert a lead capture form submission using AdminLeadCaptureCreate (name, email, company, message, source).
- GET /master-admin/lead-captures – Paginated captures; returns AdminLeadCaptureListResponse.
- GET /master-admin/lead-captures/{lead_id} – Retrieve a specific capture.
- PUT /master-admin/lead-captures/{lead_id} – Update lead notes or status with AdminLeadCaptureUpdate.
- DELETE /master-admin/lead-captures/{lead_id} – Remove the capture.
- POST /master-admin/lead-captures/{lead_id}/sync-ghl – Invoke the GoHighLevel sync workflow and return the updated record.

## Collateral
- POST /master-admin/collateral – Create collateral with AdminCollateralCreate (title, asset_type, url, tags, description).
- GET /master-admin/collateral – Paginated collateral library; returns AdminCollateralListResponse.
- GET /master-admin/collateral/{collateral_id} – Retrieve a collateral entry.
- PUT /master-admin/collateral/{collateral_id} – Update collateral metadata using AdminCollateralUpdate.
- DELETE /master-admin/collateral/{collateral_id} – Remove the collateral record.
- POST /master-admin/collateral/{collateral_id}/track-usage – Record a usage event taking parameters consumer, deal_id, and context; response includes new usage_count.

## Error Handling
Common error responses follow the standard structure:
- 400 – detail string explaining validation failure.
- 401 – authentication missing or invalid.
- 403 – user lacks access to the requested record.
- 404 – entity not found under current user.
- 422 – request body failed schema validation (FastAPI default).

Refer to backend/tests/test_master_admin_api.py for canonical examples and regression coverage. Update this document whenever routes, schemas, or query parameters change.
