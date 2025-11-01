"""Pydantic schemas for Master Admin Portal CRUD operations."""
from __future__ import annotations

from datetime import date as date_type, datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict, EmailStr
from pydantic.aliases import AliasChoices

from app.models.master_admin import (
    ActivityType,
    ActivityStatus,
    NudgeType,
    NudgePriority,
    MeetingType,
    ProspectStatus,
    DealStage as AdminDealStage,
    CampaignType,
    CampaignStatus,
    ContentType,
    ContentStatus,
)


# ============================================================================
# Activity Tracker Schemas
# ============================================================================

class AdminGoalBase(BaseModel):
    """Base schema for admin goals."""
    week_start: date_type = Field(..., description="Start date of the week (Monday)")
    target_discoveries: int = Field(0, ge=0, description="Target number of discoveries")
    target_emails: int = Field(0, ge=0, description="Target number of emails")
    target_videos: int = Field(0, ge=0, description="Target number of videos")
    target_calls: int = Field(0, ge=0, description="Target number of calls")


class AdminGoalCreate(AdminGoalBase):
    """Schema for creating a new admin goal."""
    pass


class AdminGoalUpdate(BaseModel):
    """Schema for updating an admin goal (all fields optional)."""
    target_discoveries: Optional[int] = Field(None, ge=0)
    target_emails: Optional[int] = Field(None, ge=0)
    target_videos: Optional[int] = Field(None, ge=0)
    target_calls: Optional[int] = Field(None, ge=0)


class AdminGoalResponse(AdminGoalBase):
    """Schema for admin goal responses."""
    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminActivityBase(BaseModel):
    """Base schema for admin activities."""
    activity_type: ActivityType = Field(
        ...,
        description="Activity type",
        validation_alias=AliasChoices("type", "activity_type"),
        serialization_alias="type",
    )
    status: ActivityStatus = Field(..., description="Activity status")
    date: date_type = Field(..., description="Activity date")
    amount: int = Field(1, ge=1, description="Number of activities")
    notes: Optional[str] = Field(None, description="Activity notes")
    prospect_id: Optional[int] = Field(None, description="Related prospect ID")

    model_config = ConfigDict(populate_by_name=True)


class AdminActivityCreate(AdminActivityBase):
    """Schema for creating a new admin activity."""
    pass


class AdminActivityUpdate(BaseModel):
    """Schema for updating an admin activity (all fields optional)."""
    activity_type: Optional[ActivityType] = Field(
        None,
        validation_alias=AliasChoices("type", "activity_type"),
        serialization_alias="type",
    )
    status: Optional[ActivityStatus] = None
    date: Optional[date_type] = None
    amount: Optional[int] = Field(None, ge=1)
    notes: Optional[str] = None
    prospect_id: Optional[int] = None

    model_config = ConfigDict(populate_by_name=True)


class AdminActivityResponse(AdminActivityBase):
    """Schema for admin activity responses."""
    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class AdminScoreBase(BaseModel):
    """Base schema for admin scores."""
    date: date_type = Field(..., description="Score date")
    score: int = Field(..., ge=0, le=100, description="Daily score (0-100)")
    streak_days: int = Field(0, ge=0, description="Current streak in days")
    activities_count: int = Field(0, ge=0, description="Number of activities")


class AdminScoreCreate(AdminScoreBase):
    """Schema for creating a new admin score."""
    pass


class AdminScoreUpdate(BaseModel):
    """Schema for updating an admin score (all fields optional)."""
    score: Optional[int] = Field(None, ge=0, le=100)
    streak_days: Optional[int] = Field(None, ge=0)
    activities_count: Optional[int] = Field(None, ge=0)


class AdminScoreResponse(AdminScoreBase):
    """Schema for admin score responses."""
    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminScoreListResponse(BaseModel):
    """Schema for list of admin scores."""
    items: list[AdminScoreResponse]
    total: int


class AdminFocusSessionBase(BaseModel):
    """Base schema for admin focus sessions."""
    start_time: datetime = Field(..., description="Session start time")
    end_time: Optional[datetime] = Field(None, description="Session end time")
    duration_minutes: int = Field(50, ge=1, description="Planned duration in minutes")
    completed: bool = Field(False, description="Whether session was completed")
    interrupted: bool = Field(False, description="Whether session was interrupted")
    notes: Optional[str] = Field(None, description="Session notes")


class AdminFocusSessionCreate(BaseModel):
    """Schema for creating a new focus session."""
    start_time: datetime = Field(..., description="Session start time")
    duration_minutes: int = Field(50, ge=1, description="Planned duration in minutes")
    notes: Optional[str] = None


class AdminFocusSessionUpdate(BaseModel):
    """Schema for updating a focus session (all fields optional)."""
    end_time: Optional[datetime] = None
    completed: Optional[bool] = None
    interrupted: Optional[bool] = None
    notes: Optional[str] = None


class AdminFocusSessionResponse(AdminFocusSessionBase):
    """Schema for focus session responses."""
    id: int
    user_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminFocusSessionListResponse(BaseModel):
    """Schema for list of admin focus sessions."""
    items: list[AdminFocusSessionResponse]
    total: int


class AdminNudgeBase(BaseModel):
    """Base schema for admin nudges."""
    nudge_type: NudgeType = Field(
        ...,
        description="Nudge type",
        validation_alias=AliasChoices("type", "nudge_type"),
        serialization_alias="type",
    )
    message: str = Field(..., min_length=1, description="Nudge message")
    priority: NudgePriority = Field(NudgePriority.NORMAL, description="Nudge priority")
    read: bool = Field(False, description="Whether nudge has been read")
    action_url: Optional[str] = Field(None, description="Action URL")
    expires_at: Optional[datetime] = Field(None, description="Expiration time")

    model_config = ConfigDict(populate_by_name=True)


class AdminNudgeCreate(BaseModel):
    """Schema for creating a new nudge."""
    nudge_type: NudgeType = Field(
        ...,
        validation_alias=AliasChoices("type", "nudge_type"),
        serialization_alias="type",
    )
    message: str = Field(..., min_length=1)
    priority: NudgePriority = NudgePriority.NORMAL
    action_url: Optional[str] = None
    expires_at: Optional[datetime] = None

    model_config = ConfigDict(populate_by_name=True)


class AdminNudgeUpdate(BaseModel):
    """Schema for updating a nudge (all fields optional)."""
    read: Optional[bool] = None


class AdminNudgeResponse(AdminNudgeBase):
    """Schema for nudge responses."""
    id: int
    user_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class AdminNudgeListResponse(BaseModel):
    """Schema for list of admin nudges."""
    items: list[AdminNudgeResponse]
    total: int


class AdminMeetingBase(BaseModel):
    """Base schema for admin meetings."""
    title: str = Field(..., min_length=1, max_length=255, description="Meeting title")
    meeting_type: MeetingType = Field(
        ...,
        description="Meeting type",
        validation_alias=AliasChoices("type", "meeting_type"),
        serialization_alias="type",
    )
    duration_minutes: int = Field(60, ge=1, description="Meeting duration in minutes")
    agenda: Optional[str] = Field(None, description="Meeting agenda")
    questions: Optional[str] = Field(None, description="Questions to ask")
    follow_up_tasks: Optional[str] = Field(None, description="Follow-up tasks")

    model_config = ConfigDict(populate_by_name=True)


class AdminMeetingCreate(AdminMeetingBase):
    """Schema for creating a new meeting template."""
    pass


class AdminMeetingUpdate(BaseModel):
    """Schema for updating a meeting template (all fields optional)."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    meeting_type: Optional[MeetingType] = Field(
        None,
        validation_alias=AliasChoices("type", "meeting_type"),
        serialization_alias="type",
    )
    duration_minutes: Optional[int] = Field(None, ge=1)
    agenda: Optional[str] = None
    questions: Optional[str] = None
    follow_up_tasks: Optional[str] = None

    model_config = ConfigDict(populate_by_name=True)


class AdminMeetingResponse(AdminMeetingBase):
    """Schema for meeting template responses."""
    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class AdminMeetingListResponse(BaseModel):
    """Schema for list of admin meetings."""
    items: list[AdminMeetingResponse]
    total: int


# ============================================================================
# Prospect & Pipeline Schemas
# ============================================================================

class AdminProspectBase(BaseModel):
    """Base schema for admin prospects."""
    name: str = Field(..., min_length=1, max_length=255, description="Prospect name")
    email: Optional[EmailStr] = Field(None, description="Prospect email")
    phone: Optional[str] = Field(None, max_length=50, description="Prospect phone")
    company: Optional[str] = Field(None, max_length=255, description="Company name")
    title: Optional[str] = Field(None, max_length=255, description="Job title")
    status: ProspectStatus = Field(ProspectStatus.NEW, description="Prospect status")
    source: Optional[str] = Field(None, max_length=100, description="Lead source")
    tags: Optional[str] = Field(None, description="Tags (JSON array)")
    notes: Optional[str] = Field(None, description="Prospect notes")
    voice_notes_url: Optional[str] = Field(None, description="Voice notes URL")
    ghl_contact_id: Optional[str] = Field(None, max_length=100, description="GoHighLevel contact ID")


class AdminProspectCreate(AdminProspectBase):
    """Schema for creating a new prospect."""
    pass


class AdminProspectUpdate(BaseModel):
    """Schema for updating a prospect (all fields optional)."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=50)
    company: Optional[str] = Field(None, max_length=255)
    title: Optional[str] = Field(None, max_length=255)
    status: Optional[ProspectStatus] = None
    source: Optional[str] = Field(None, max_length=100)
    tags: Optional[str] = None
    notes: Optional[str] = None
    voice_notes_url: Optional[str] = None
    ghl_contact_id: Optional[str] = Field(None, max_length=100)
    last_contacted: Optional[datetime] = None


class AdminProspectResponse(AdminProspectBase):
    """Schema for prospect responses."""
    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime
    last_contacted: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class AdminDealBase(BaseModel):
    """Base schema for admin deals."""
    prospect_id: int = Field(..., description="Related prospect ID")
    title: str = Field(..., min_length=1, max_length=255, description="Deal title")
    stage: AdminDealStage = Field(AdminDealStage.DISCOVERY, description="Deal stage")
    value: Optional[Decimal] = Field(None, ge=0, description="Deal value")
    probability: int = Field(0, ge=0, le=100, description="Win probability (0-100%)")
    expected_close_date: Optional[date_type] = Field(None, description="Expected close date")
    actual_close_date: Optional[date_type] = Field(None, description="Actual close date")
    notes: Optional[str] = Field(None, description="Deal notes")


class AdminDealCreate(AdminDealBase):
    """Schema for creating a new deal."""
    pass


class AdminDealUpdate(BaseModel):
    """Schema for updating a deal (all fields optional)."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    stage: Optional[AdminDealStage] = None
    value: Optional[Decimal] = Field(None, ge=0)
    probability: Optional[int] = Field(None, ge=0, le=100)
    expected_close_date: Optional[date_type] = None
    actual_close_date: Optional[date_type] = None
    notes: Optional[str] = None


class AdminDealResponse(AdminDealBase):
    """Schema for deal responses."""
    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# Campaign Management Schemas
# ============================================================================

class AdminCampaignBase(BaseModel):
    """Base schema for admin campaigns."""
    name: str = Field(..., min_length=1, max_length=255, description="Campaign name")
    campaign_type: CampaignType = Field(
        ...,
        description="Campaign type",
        validation_alias=AliasChoices("type", "campaign_type"),
        serialization_alias="type",
    )
    status: CampaignStatus = Field(CampaignStatus.DRAFT, description="Campaign status")
    subject: Optional[str] = Field(None, max_length=500, description="Email subject or SMS preview")
    content: str = Field(..., min_length=1, description="Campaign content")
    scheduled_at: Optional[datetime] = Field(None, description="Scheduled send time")

    model_config = ConfigDict(populate_by_name=True)


class AdminCampaignCreate(AdminCampaignBase):
    """Schema for creating a new campaign."""
    pass


class AdminCampaignUpdate(BaseModel):
    """Schema for updating a campaign (all fields optional)."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    status: Optional[CampaignStatus] = None
    subject: Optional[str] = Field(None, max_length=500)
    content: Optional[str] = Field(None, min_length=1)
    scheduled_at: Optional[datetime] = None


class AdminCampaignResponse(AdminCampaignBase):
    """Schema for campaign responses."""
    id: int
    user_id: str
    sent_at: Optional[datetime] = None
    total_recipients: int
    sent_count: int
    opened_count: int
    clicked_count: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class AdminCampaignRecipientBase(BaseModel):
    """Base schema for campaign recipients."""
    campaign_id: int = Field(..., description="Campaign ID")
    prospect_id: int = Field(..., description="Prospect ID")


class AdminCampaignRecipientCreate(AdminCampaignRecipientBase):
    """Schema for adding a recipient to a campaign."""
    pass


class AdminCampaignRecipientUpdate(BaseModel):
    """Schema for updating campaign recipient delivery metrics."""
    sent: Optional[bool] = None
    opened: Optional[bool] = None
    clicked: Optional[bool] = None
    bounced: Optional[bool] = None


class AdminCampaignRecipientResponse(AdminCampaignRecipientBase):
    """Schema for campaign recipient responses."""
    id: int
    sent: bool
    opened: bool
    clicked: bool
    bounced: bool
    sent_at: Optional[datetime] = None
    opened_at: Optional[datetime] = None
    clicked_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# Content Creation Schemas
# ============================================================================

class AdminContentScriptBase(BaseModel):
    """Base schema for content scripts."""
    title: str = Field(..., min_length=1, max_length=255, description="Script title")
    content_type: ContentType = Field(
        ...,
        description="Content type",
        validation_alias=AliasChoices("type", "content_type"),
        serialization_alias="type",
    )
    script_text: str = Field(..., min_length=1, description="Script content")
    duration_minutes: Optional[int] = Field(None, ge=1, description="Estimated duration")
    keywords: Optional[str] = Field(None, description="Keywords (JSON array)")

    model_config = ConfigDict(populate_by_name=True)


class AdminContentScriptCreate(AdminContentScriptBase):
    """Schema for creating a new content script."""
    pass


class AdminContentScriptUpdate(BaseModel):
    """Schema for updating a content script (all fields optional)."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    script_text: Optional[str] = Field(None, min_length=1)
    duration_minutes: Optional[int] = Field(None, ge=1)
    keywords: Optional[str] = None


class AdminContentScriptResponse(AdminContentScriptBase):
    """Schema for content script responses."""
    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminContentScriptListResponse(BaseModel):
    """Schema for list of content scripts."""
    items: list[AdminContentScriptResponse]
    total: int


class AdminContentPieceBase(BaseModel):
    """Base schema for content pieces."""
    title: str = Field(..., min_length=1, max_length=500, description="Content title")
    content_type: ContentType = Field(
        ...,
        description="Content type",
        validation_alias=AliasChoices("type", "content_type"),
        serialization_alias="type",
    )
    status: ContentStatus = Field(ContentStatus.IDEA, description="Content status")
    script_id: Optional[int] = Field(None, description="Related script ID")
    recording_url: Optional[str] = Field(None, description="Recording URL")
    edited_url: Optional[str] = Field(None, description="Edited content URL")
    thumbnail_url: Optional[str] = Field(None, description="Thumbnail URL")
    description: Optional[str] = Field(None, description="Content description")
    tags: Optional[str] = Field(None, description="Tags (JSON array)")
    youtube_url: Optional[str] = Field(None, description="YouTube URL")
    spotify_url: Optional[str] = Field(None, description="Spotify URL")
    rss_url: Optional[str] = Field(None, description="RSS feed URL")

    model_config = ConfigDict(populate_by_name=True)


class AdminContentPieceCreate(AdminContentPieceBase):
    """Schema for creating a new content piece."""
    pass


class AdminContentPieceUpdate(BaseModel):
    """Schema for updating a content piece (all fields optional)."""
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    status: Optional[ContentStatus] = None
    script_id: Optional[int] = None
    recording_url: Optional[str] = None
    edited_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[str] = None
    youtube_url: Optional[str] = None
    spotify_url: Optional[str] = None
    rss_url: Optional[str] = None
    views_count: Optional[int] = Field(None, ge=0)
    published_at: Optional[datetime] = None


class AdminContentPieceResponse(AdminContentPieceBase):
    """Schema for content piece responses."""
    id: int
    user_id: str
    views_count: int
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


# ============================================================================
# Lead Capture Schemas
# ============================================================================

class AdminLeadCaptureBase(BaseModel):
    """Base schema for lead captures."""
    name: str = Field(..., min_length=1, max_length=255, description="Lead name")
    email: Optional[EmailStr] = Field(None, description="Lead email")
    phone: Optional[str] = Field(None, max_length=50, description="Lead phone")
    company: Optional[str] = Field(None, max_length=255, description="Company name")
    event_name: Optional[str] = Field(None, max_length=255, description="Event name")
    event_date: Optional[date_type] = Field(None, description="Event date")
    interest_level: Optional[str] = Field(None, max_length=50, description="Interest level (hot/warm/cold)")
    follow_up_type: Optional[str] = Field(None, max_length=100, description="Follow-up type")
    notes: Optional[str] = Field(None, description="Lead notes")
    voice_notes_url: Optional[str] = Field(None, description="Voice notes URL")
    ghl_contact_id: Optional[str] = Field(None, max_length=100, description="GoHighLevel contact ID")


class AdminLeadCaptureCreate(AdminLeadCaptureBase):
    """Schema for creating a new lead capture."""
    pass


class AdminLeadCaptureUpdate(BaseModel):
    """Schema for updating a lead capture (all fields optional)."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=50)
    company: Optional[str] = Field(None, max_length=255)
    event_name: Optional[str] = Field(None, max_length=255)
    event_date: Optional[date_type] = None
    interest_level: Optional[str] = Field(None, max_length=50)
    follow_up_type: Optional[str] = Field(None, max_length=100)
    notes: Optional[str] = None
    voice_notes_url: Optional[str] = None
    synced_to_ghl: Optional[bool] = None
    ghl_contact_id: Optional[str] = Field(None, max_length=100)


class AdminLeadCaptureResponse(AdminLeadCaptureBase):
    """Schema for lead capture responses."""
    id: int
    user_id: str
    synced_to_ghl: bool
    ghl_contact_id: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# Sales Collateral Schemas
# ============================================================================

class AdminCollateralBase(BaseModel):
    """Base schema for sales collateral."""
    title: str = Field(..., min_length=1, max_length=255, description="Collateral title")
    collateral_type: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Collateral type",
        validation_alias=AliasChoices("type", "collateral_type"),
        serialization_alias="type",
    )
    description: Optional[str] = Field(None, description="Collateral description")
    file_url: str = Field(..., min_length=1, description="File URL")
    file_size: Optional[int] = Field(None, ge=0, description="File size in bytes")
    mime_type: Optional[str] = Field(None, max_length=100, description="MIME type")
    tags: Optional[str] = Field(None, description="Tags (JSON array)")

    model_config = ConfigDict(populate_by_name=True)


class AdminCollateralCreate(AdminCollateralBase):
    """Schema for creating new sales collateral."""
    pass


class AdminCollateralUpdate(BaseModel):
    """Schema for updating sales collateral (all fields optional)."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    collateral_type: Optional[str] = Field(
        None,
        min_length=1,
        max_length=100,
        validation_alias=AliasChoices("type", "collateral_type"),
        serialization_alias="type",
    )
    description: Optional[str] = None
    tags: Optional[str] = None

    model_config = ConfigDict(populate_by_name=True)


class AdminCollateralResponse(AdminCollateralBase):
    """Schema for sales collateral responses."""
    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class AdminCollateralUsageBase(BaseModel):
    """Base schema for collateral usage tracking."""
    collateral_id: int = Field(..., description="Collateral ID")
    prospect_id: Optional[int] = Field(None, description="Related prospect ID")
    context: Optional[str] = Field(None, max_length=255, description="Usage context")


class AdminCollateralUsageCreate(AdminCollateralUsageBase):
    """Schema for creating a collateral usage record."""
    pass


class AdminCollateralUsageResponse(AdminCollateralUsageBase):
    """Schema for collateral usage responses."""
    id: int
    used_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# List Response Schemas
# ============================================================================

class AdminActivityListResponse(BaseModel):
    """Schema for paginated list of activities."""
    items: list[AdminActivityResponse]
    total: int
    page: int
    per_page: int


class AdminProspectListResponse(BaseModel):
    """Schema for paginated list of prospects."""
    items: list[AdminProspectResponse]
    total: int
    page: int
    per_page: int


class AdminDealListResponse(BaseModel):
    """Schema for paginated list of deals."""
    items: list[AdminDealResponse]
    total: int
    page: int
    per_page: int


class AdminCampaignListResponse(BaseModel):
    """Schema for paginated list of campaigns."""
    items: list[AdminCampaignResponse]
    total: int
    page: int
    per_page: int


class AdminCampaignRecipientListResponse(BaseModel):
    """Schema for list of campaign recipients."""
    items: list[AdminCampaignRecipientResponse]
    total: int


class AdminContentPieceListResponse(BaseModel):
    """Schema for paginated list of content pieces."""
    items: list[AdminContentPieceResponse]
    total: int
    page: int
    per_page: int


class AdminLeadCaptureListResponse(BaseModel):
    """Schema for paginated list of lead captures."""
    items: list[AdminLeadCaptureResponse]
    total: int
    page: int
    per_page: int


class AdminCollateralListResponse(BaseModel):
    """Schema for paginated list of sales collateral."""
    items: list[AdminCollateralResponse]
    total: int
    page: int
    per_page: int
