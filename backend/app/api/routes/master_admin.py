"""Master Admin Portal API routes."""
from __future__ import annotations

from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_master_admin_user
from app.db.session import get_db
from app.models.user import User
from app.models.master_admin import (
    AdminGoal,
    AdminActivity,
    AdminScore,
    AdminFocusSession,
    AdminNudge,
    AdminMeeting,
    AdminProspect,
    AdminDeal,
    ActivityType,
)
from app.schemas.master_admin import (
    AdminGoalCreate,
    AdminGoalUpdate,
    AdminGoalResponse,
    AdminActivityCreate,
    AdminActivityUpdate,
    AdminActivityResponse,
    AdminActivityListResponse,
    AdminScoreResponse,
    AdminScoreListResponse,
    AdminFocusSessionCreate,
    AdminFocusSessionUpdate,
    AdminFocusSessionResponse,
    AdminFocusSessionListResponse,
    AdminNudgeCreate,
    AdminNudgeUpdate,
    AdminNudgeResponse,
    AdminNudgeListResponse,
    AdminMeetingCreate,
    AdminMeetingUpdate,
    AdminMeetingResponse,
    AdminMeetingListResponse,
    AdminProspectCreate,
    AdminProspectUpdate,
    AdminProspectResponse,
    AdminProspectListResponse,
    AdminDealCreate,
    AdminDealUpdate,
    AdminDealResponse,
    AdminDealListResponse,
    AdminCampaignCreate,
    AdminCampaignUpdate,
    AdminCampaignResponse,
    AdminCampaignListResponse,
    AdminCampaignRecipientCreate,
    AdminCampaignRecipientUpdate,
    AdminCampaignRecipientResponse,
    AdminCampaignRecipientListResponse,
    AdminContentScriptCreate,
    AdminContentScriptUpdate,
    AdminContentScriptResponse,
    AdminContentScriptListResponse,
    AdminContentPieceCreate,
    AdminContentPieceUpdate,
    AdminContentPieceResponse,
    AdminContentPieceListResponse,
    AdminLeadCaptureCreate,
    AdminLeadCaptureUpdate,
    AdminLeadCaptureResponse,
    AdminLeadCaptureListResponse,
    AdminCollateralCreate,
    AdminCollateralUpdate,
    AdminCollateralResponse,
    AdminCollateralListResponse,
)
from app.services import master_admin_service

router = APIRouter(prefix="/master-admin", tags=["master-admin"])


# ============================================================================
# Dashboard & Stats Endpoints
# ============================================================================

@router.get("/dashboard", response_model=dict)
def get_dashboard_stats(
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Get dashboard statistics for the current user.
    
    Returns current score, streak, weekly activities, active prospects,
    open deals, and unread nudges count.
    """
    stats = master_admin_service.get_dashboard_stats(str(current_user.id), db)
    return stats


# ============================================================================
# Activity Tracker - Goals Endpoints
# ============================================================================

@router.post("/goals", response_model=AdminGoalResponse, status_code=status.HTTP_201_CREATED)
def create_goal(
    goal: AdminGoalCreate,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Create a new weekly goal.
    
    Goals are set per week and define targets for discoveries, emails,
    videos, and calls.
    """
    # Check if goal already exists for this week
    existing_goal = master_admin_service.get_admin_goal_by_week(
        str(current_user.id), goal.week_start, db
    )
    if existing_goal:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Goal already exists for week starting {goal.week_start}"
        )
    
    created_goal = master_admin_service.create_admin_goal(goal, current_user, db)
    return created_goal


@router.get("/goals/current", response_model=AdminGoalResponse)
def get_current_week_goal(
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Get the goal for the current week.
    
    Returns 404 if no goal is set for the current week.
    """
    goal = master_admin_service.get_current_week_goal(str(current_user.id), db)
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No goal set for current week"
        )
    return goal


@router.get("/goals/{week_start}", response_model=AdminGoalResponse)
def get_goal_by_week(
    week_start: date,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Get the goal for a specific week.
    
    week_start should be a Monday (YYYY-MM-DD format).
    """
    goal = master_admin_service.get_admin_goal_by_week(str(current_user.id), week_start, db)
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No goal found for week starting {week_start}"
        )
    return goal


@router.put("/goals/{goal_id}", response_model=AdminGoalResponse)
def update_goal(
    goal_id: int,
    goal_update: AdminGoalUpdate,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Update an existing goal.
    
    Supports partial updates - only provided fields will be updated.
    """
    # Get goal and verify ownership
    goal = db.get(AdminGoal, goal_id)
    if not goal or goal.user_id != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )
    
    updated_goal = master_admin_service.update_admin_goal(goal, goal_update, db)
    return updated_goal


# ============================================================================
# Activity Tracker - Activities Endpoints
# ============================================================================

@router.post("/activities", response_model=AdminActivityResponse, status_code=status.HTTP_201_CREATED)
def create_activity(
    activity: AdminActivityCreate,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Create a new activity.
    
    Activities are logged with type (discovery, email, video, call),
    status (done, pending, cancelled), and amount.
    Creating an activity automatically updates the daily score.
    """
    created_activity = master_admin_service.create_admin_activity(activity, current_user, db)
    return created_activity


@router.get("/activities", response_model=AdminActivityListResponse)
def list_activities(
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(50, ge=1, le=100, description="Items per page"),
    start_date: Optional[date] = Query(None, description="Filter by start date"),
    end_date: Optional[date] = Query(None, description="Filter by end date"),
    activity_type: Optional[ActivityType] = Query(None, description="Filter by activity type"),
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    List all activities for the current user.
    
    Supports pagination and filtering by date range and activity type.
    """
    activities, total = master_admin_service.list_admin_activities(
        user_id=str(current_user.id),
        db=db,
        page=page,
        per_page=per_page,
        start_date=start_date,
        end_date=end_date,
        activity_type=activity_type,
    )
    
    return {
        "items": activities,
        "total": total,
        "page": page,
        "per_page": per_page,
    }


@router.get("/activities/{activity_id}", response_model=AdminActivityResponse)
def get_activity(
    activity_id: int,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Get activity details by ID.
    """
    activity = db.get(AdminActivity, activity_id)
    if not activity or activity.user_id != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found"
        )
    return activity


@router.put("/activities/{activity_id}", response_model=AdminActivityResponse)
def update_activity(
    activity_id: int,
    activity_update: AdminActivityUpdate,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Update an existing activity.
    
    Updating an activity automatically recalculates the daily score.
    """
    activity = db.get(AdminActivity, activity_id)
    if not activity or activity.user_id != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found"
        )
    
    updated_activity = master_admin_service.update_admin_activity(activity, activity_update, db)
    return updated_activity


@router.delete("/activities/{activity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_activity(
    activity_id: int,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Delete an activity.
    
    Deleting an activity automatically recalculates the daily score.
    """
    activity = db.get(AdminActivity, activity_id)
    if not activity or activity.user_id != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found"
        )
    
    master_admin_service.delete_admin_activity(activity, db)


# ============================================================================
# Activity Tracker - Scores Endpoints
# ============================================================================

@router.get("/scores/today", response_model=AdminScoreResponse)
def get_today_score(
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Get the score for today.
    
    Returns 404 if no activities logged today.
    """
    today = date.today()
    score = master_admin_service.get_admin_score_by_date(str(current_user.id), today, db)
    if not score:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No score for today yet"
        )
    return score


@router.get("/scores/streak", response_model=dict)
def get_current_streak(
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Get the current streak in days.

    Returns the number of consecutive days with score > 0.
    """
    streak = master_admin_service.get_current_streak(str(current_user.id), db)
    return {"streak_days": streak}


@router.get("/scores/{score_date}", response_model=AdminScoreResponse)
def get_score_by_date(
    score_date: date,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Get the score for a specific date.
    """
    score = master_admin_service.get_admin_score_by_date(str(current_user.id), score_date, db)
    if not score:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No score found for {score_date}"
        )
    return score


@router.get("/scores/week/{week_start}", response_model=AdminScoreListResponse)
def get_weekly_scores(
    week_start: date,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Get scores for a specific week.
    
    week_start should be a Monday (YYYY-MM-DD format).
    Returns scores for Monday through Sunday.
    """
    scores = master_admin_service.get_weekly_scores(str(current_user.id), week_start, db)
    return {"items": scores, "total": len(scores), "page": 1, "per_page": len(scores)}


# ============================================================================
# Activity Tracker - Focus Sessions Endpoints
# ============================================================================

@router.post("/focus-sessions", response_model=AdminFocusSessionResponse, status_code=status.HTTP_201_CREATED)
def create_focus_session(
    session: AdminFocusSessionCreate,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Create a new focus session.
    
    Focus sessions are 50-minute blocks of concentrated work.
    """
    created_session = master_admin_service.create_admin_focus_session(session, current_user, db)
    return created_session


@router.get("/focus-sessions/active", response_model=AdminFocusSessionResponse)
def get_active_focus_session(
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Get the currently active focus session.
    
    Returns 404 if no active session.
    """
    session = master_admin_service.get_active_focus_session(str(current_user.id), db)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active focus session"
        )
    return session


@router.put("/focus-sessions/{session_id}/complete", response_model=AdminFocusSessionResponse)
def complete_focus_session(
    session_id: int,
    interrupted: bool = Query(False, description="Whether the session was interrupted"),
    notes: Optional[str] = Query(None, description="Completion notes"),
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Complete a focus session.
    
    Mark the session as completed or interrupted.
    """
    session = db.get(AdminFocusSession, session_id)
    if not session or session.user_id != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Focus session not found"
        )
    
    if session.completed or session.end_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Focus session already completed"
        )
    
    updated_session = master_admin_service.complete_focus_session(session, interrupted, notes, db)
    return updated_session


# ============================================================================
# Activity Tracker - Nudges Endpoints
# ============================================================================

@router.post("/nudges", response_model=AdminNudgeResponse, status_code=status.HTTP_201_CREATED)
def create_nudge(
    nudge: AdminNudgeCreate,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Create a new nudge/notification.
    
    Nudges are system-generated reminders and alerts.
    """
    created_nudge = master_admin_service.create_admin_nudge(nudge, current_user, db)
    return created_nudge


@router.get("/nudges/unread", response_model=AdminNudgeListResponse)
def get_unread_nudges(
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Get all unread nudges for the current user.
    
    Returns nudges that haven't been read and haven't expired.
    """
    nudges = master_admin_service.get_unread_nudges(str(current_user.id), db)
    return {"items": nudges, "total": len(nudges), "page": 1, "per_page": len(nudges)}


@router.put("/nudges/{nudge_id}/read", response_model=AdminNudgeResponse)
def mark_nudge_as_read(
    nudge_id: int,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Mark a nudge as read.
    """
    nudge = db.get(AdminNudge, nudge_id)
    if not nudge or nudge.user_id != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nudge not found"
        )
    
    updated_nudge = master_admin_service.mark_nudge_as_read(nudge, db)
    return updated_nudge


# ============================================================================
# Activity Tracker - Meeting Templates Endpoints
# ============================================================================

@router.post("/meetings", response_model=AdminMeetingResponse, status_code=status.HTTP_201_CREATED)
def create_meeting_template(
    meeting: AdminMeetingCreate,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Create a new meeting template.
    
    Meeting templates define agenda, questions, and follow-up tasks
    for different types of meetings (discovery, demo, closing).
    """
    created_meeting = master_admin_service.create_admin_meeting_template(meeting, current_user, db)
    return created_meeting


@router.get("/meetings/type/{meeting_type}", response_model=AdminMeetingListResponse)
def get_meeting_templates_by_type(
    meeting_type: str,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Get meeting templates by type.
    
    Types: discovery, demo, closing, follow_up
    """
    templates = master_admin_service.get_meeting_templates_by_type(
        str(current_user.id), meeting_type, db
    )
    return {"items": templates, "total": len(templates), "page": 1, "per_page": len(templates)}


# ============================================================================
# Prospect & Pipeline - Prospects Endpoints
# ============================================================================

@router.post("/prospects", response_model=AdminProspectResponse, status_code=status.HTTP_201_CREATED)
def create_prospect(
    prospect: AdminProspectCreate,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Create a new prospect.
    
    Prospects are leads captured from networking events or other sources.
    """
    created_prospect = master_admin_service.create_admin_prospect(prospect, current_user, db)
    return created_prospect


@router.get("/prospects", response_model=AdminProspectListResponse)
def list_prospects(
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(50, ge=1, le=100, description="Items per page"),
    status: Optional[str] = Query(None, description="Filter by prospect status"),
    search: Optional[str] = Query(None, description="Search by name, email, or company"),
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    List all prospects for the current user.
    
    Supports pagination, filtering by status, and search.
    """
    prospects, total = master_admin_service.list_admin_prospects(
        user_id=str(current_user.id),
        db=db,
        page=page,
        per_page=per_page,
        status=status,
        search=search,
    )
    
    return {
        "items": prospects,
        "total": total,
        "page": page,
        "per_page": per_page,
    }


@router.get("/prospects/{prospect_id}", response_model=AdminProspectResponse)
def get_prospect(
    prospect_id: int,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Get prospect details by ID.
    """
    prospect = master_admin_service.get_admin_prospect_by_id(prospect_id, str(current_user.id), db)
    if not prospect:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prospect not found"
        )
    return prospect


@router.put("/prospects/{prospect_id}", response_model=AdminProspectResponse)
def update_prospect(
    prospect_id: int,
    prospect_update: AdminProspectUpdate,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Update an existing prospect.
    
    Supports partial updates - only provided fields will be updated.
    """
    prospect = master_admin_service.get_admin_prospect_by_id(prospect_id, str(current_user.id), db)
    if not prospect:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prospect not found"
        )
    
    updated_prospect = master_admin_service.update_admin_prospect(prospect, prospect_update, db)
    return updated_prospect


@router.delete("/prospects/{prospect_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_prospect(
    prospect_id: int,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Delete a prospect.
    """
    prospect = master_admin_service.get_admin_prospect_by_id(prospect_id, str(current_user.id), db)
    if not prospect:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prospect not found"
        )
    
    master_admin_service.delete_admin_prospect(prospect, db)


# ============================================================================
# Prospect & Pipeline - Deals Endpoints
# ============================================================================

@router.post("/deals", response_model=AdminDealResponse, status_code=status.HTTP_201_CREATED)
def create_deal(
    deal: AdminDealCreate,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Create a new deal.
    
    Deals represent sales opportunities in the pipeline.
    """
    created_deal = master_admin_service.create_admin_deal(deal, current_user, db)
    return created_deal


@router.get("/deals", response_model=AdminDealListResponse)
def list_deals(
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(50, ge=1, le=100, description="Items per page"),
    stage: Optional[str] = Query(None, description="Filter by deal stage"),
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    List all deals for the current user.
    
    Supports pagination and filtering by stage.
    """
    deals, total = master_admin_service.list_admin_deals(
        user_id=str(current_user.id),
        db=db,
        page=page,
        per_page=per_page,
        stage=stage,
    )
    
    return {
        "items": deals,
        "total": total,
        "page": page,
        "per_page": per_page,
    }


@router.get("/deals/{deal_id}", response_model=AdminDealResponse)
def get_deal(
    deal_id: int,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Get deal details by ID.
    """
    deal = db.get(AdminDeal, deal_id)
    if not deal or deal.user_id != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deal not found"
        )
    return deal


@router.put("/deals/{deal_id}", response_model=AdminDealResponse)
def update_deal(
    deal_id: int,
    deal_update: AdminDealUpdate,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Update an existing deal.
    
    Supports partial updates - only provided fields will be updated.
    """
    deal = db.get(AdminDeal, deal_id)
    if not deal or deal.user_id != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deal not found"
        )
    
    updated_deal = master_admin_service.update_admin_deal(deal, deal_update, db)
    return updated_deal



# ============================================================================
# Campaign Management Endpoints
# ============================================================================

@router.post("/legacy/campaigns", response_model=AdminCampaignResponse, status_code=status.HTTP_201_CREATED)
def create_campaign(
    campaign_data: AdminCampaignCreate,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Create a new email/SMS campaign.
    """
    campaign = master_admin_service.create_admin_campaign(campaign_data, current_user, db)
    return campaign


@router.get("/legacy/campaigns", response_model=AdminCampaignListResponse)
def list_campaigns(
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=100),
    status: Optional[str] = None,
    campaign_type: Optional[str] = None,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    List all campaigns with pagination and filtering.
    """
    campaigns, total = master_admin_service.list_admin_campaigns(
        user_id=str(current_user.id),
        db=db,
        page=page,
        per_page=per_page,
        status=status,
        campaign_type=campaign_type,
    )
    
    return {
        "items": campaigns,
        "total": total,
        "page": page,
        "per_page": per_page,
    }


@router.get("/legacy/campaigns/{campaign_id}", response_model=AdminCampaignResponse)
def get_campaign(
    campaign_id: int,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Get campaign details by ID.
    """
    campaign = master_admin_service.get_admin_campaign_by_id(campaign_id, str(current_user.id), db)
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    return campaign


@router.put("/legacy/campaigns/{campaign_id}", response_model=AdminCampaignResponse)
def update_campaign(
    campaign_id: int,
    campaign_update: AdminCampaignUpdate,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Update an existing campaign.
    """
    campaign = master_admin_service.get_admin_campaign_by_id(campaign_id, str(current_user.id), db)
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    
    updated_campaign = master_admin_service.update_admin_campaign(campaign, campaign_update, db)
    return updated_campaign


@router.delete("/legacy/campaigns/{campaign_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_campaign(
    campaign_id: int,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Delete a campaign.
    """
    campaign = master_admin_service.get_admin_campaign_by_id(campaign_id, str(current_user.id), db)
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    
    master_admin_service.delete_admin_campaign(campaign, db)
    return None


@router.post("/legacy/campaigns/{campaign_id}/send", response_model=AdminCampaignResponse)
def send_campaign(
    campaign_id: int,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Send a campaign (update status to sent).
    """
    campaign = master_admin_service.get_admin_campaign_by_id(campaign_id, str(current_user.id), db)
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    
    sent_campaign = master_admin_service.send_admin_campaign(campaign, db)
    return sent_campaign


@router.post(
    "/legacy/campaigns/{campaign_id}/recipients",
    response_model=AdminCampaignRecipientResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_campaign_recipient(
    campaign_id: int,
    recipient_data: AdminCampaignRecipientCreate,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """Attach a prospect to the campaign recipient list."""

    campaign = master_admin_service.get_admin_campaign_by_id(campaign_id, str(current_user.id), db)
    if not campaign:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")

    if recipient_data.campaign_id and recipient_data.campaign_id != campaign_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Campaign id mismatch")

    try:
        recipient = master_admin_service.add_admin_campaign_recipient(
            campaign,
            prospect_id=recipient_data.prospect_id,
            db=db,
        )
    except ValueError as exc:  # Duplicate recipient
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    return recipient


@router.get(
    "/legacy/campaigns/{campaign_id}/recipients",
    response_model=AdminCampaignRecipientListResponse,
)
def list_campaign_recipients(
    campaign_id: int,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """Return all recipients for a campaign."""

    campaign = master_admin_service.get_admin_campaign_by_id(campaign_id, str(current_user.id), db)
    if not campaign:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")

    recipients = master_admin_service.list_admin_campaign_recipients(
        campaign_id=campaign_id,
        user_id=str(current_user.id),
        db=db,
    )
    return {"items": recipients, "total": len(recipients), "page": 1, "per_page": len(recipients)}


@router.put(
    "/legacy/campaigns/{campaign_id}/recipients/{recipient_id}",
    response_model=AdminCampaignRecipientResponse,
)
def update_campaign_recipient(
    campaign_id: int,
    recipient_id: int,
    recipient_update: AdminCampaignRecipientUpdate,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """Update recipient engagement state."""

    campaign = master_admin_service.get_admin_campaign_by_id(campaign_id, str(current_user.id), db)
    if not campaign:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")

    recipient = master_admin_service.get_admin_campaign_recipient(
        recipient_id=recipient_id,
        campaign_id=campaign_id,
        user_id=str(current_user.id),
        db=db,
    )
    if not recipient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipient not found")

    updated = master_admin_service.update_admin_campaign_recipient(
        recipient,
        recipient_update,
        campaign,
        db,
    )
    return updated


@router.delete(
    "/legacy/campaigns/{campaign_id}/recipients/{recipient_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_campaign_recipient(
    campaign_id: int,
    recipient_id: int,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """Remove a prospect from the campaign recipient list."""

    campaign = master_admin_service.get_admin_campaign_by_id(campaign_id, str(current_user.id), db)
    if not campaign:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")

    recipient = master_admin_service.get_admin_campaign_recipient(
        recipient_id=recipient_id,
        campaign_id=campaign_id,
        user_id=str(current_user.id),
        db=db,
    )
    if not recipient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipient not found")

    master_admin_service.delete_admin_campaign_recipient(recipient, campaign, db)


# ============================================================================
# Content Studio Endpoints
# ============================================================================

@router.post("/content/scripts", response_model=AdminContentScriptResponse, status_code=status.HTTP_201_CREATED)
def create_content_script(
    script_data: AdminContentScriptCreate,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Create a new content script (YouTube/Podcast).
    """
    script = master_admin_service.create_admin_content_script(script_data, current_user, db)
    return script


@router.get("/content/scripts", response_model=AdminContentScriptListResponse)
def list_content_scripts(
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=100),
    script_type: Optional[str] = None,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    List all content scripts with pagination and filtering.
    """
    scripts, total = master_admin_service.list_admin_content_scripts(
        user_id=str(current_user.id),
        db=db,
        page=page,
        per_page=per_page,
        script_type=script_type,
    )
    
    return {
        "items": scripts,
        "total": total,
        "page": page,
        "per_page": per_page,
    }


@router.get("/content/scripts/{script_id}", response_model=AdminContentScriptResponse)
def get_content_script(
    script_id: int,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Get content script details by ID.
    """
    script = master_admin_service.get_admin_content_script_by_id(script_id, str(current_user.id), db)
    if not script:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Content script not found"
        )
    return script


@router.put("/content/scripts/{script_id}", response_model=AdminContentScriptResponse)
def update_content_script(
    script_id: int,
    script_update: AdminContentScriptUpdate,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Update an existing content script.
    """
    script = master_admin_service.get_admin_content_script_by_id(script_id, str(current_user.id), db)
    if not script:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Content script not found"
        )
    
    updated_script = master_admin_service.update_admin_content_script(script, script_update, db)
    return updated_script


@router.delete("/content/scripts/{script_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_content_script(
    script_id: int,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Delete a content script.
    """
    script = master_admin_service.get_admin_content_script_by_id(script_id, str(current_user.id), db)
    if not script:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Content script not found"
        )
    
    master_admin_service.delete_admin_content_script(script, db)
    return None


@router.post("/content/pieces", response_model=AdminContentPieceResponse, status_code=status.HTTP_201_CREATED)
def create_content_piece(
    content_data: AdminContentPieceCreate,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Create a new content piece (YouTube video/Podcast episode).
    """
    content = master_admin_service.create_admin_content_piece(content_data, current_user, db)
    return content


@router.get("/content/pieces", response_model=AdminContentPieceListResponse)
def list_content_pieces(
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=100),
    content_type: Optional[str] = None,
    status: Optional[str] = None,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    List all content pieces with pagination and filtering.
    """
    content_pieces, total = master_admin_service.list_admin_content_pieces(
        user_id=str(current_user.id),
        db=db,
        page=page,
        per_page=per_page,
        content_type=content_type,
        status=status,
    )
    
    return {
        "items": content_pieces,
        "total": total,
        "page": page,
        "per_page": per_page,
    }


@router.get("/content/pieces/{content_id}", response_model=AdminContentPieceResponse)
def get_content_piece(
    content_id: int,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Get content piece details by ID.
    """
    content = master_admin_service.get_admin_content_piece_by_id(content_id, str(current_user.id), db)
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Content piece not found"
        )
    return content


@router.put("/content/pieces/{content_id}", response_model=AdminContentPieceResponse)
def update_content_piece(
    content_id: int,
    content_update: AdminContentPieceUpdate,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Update an existing content piece.
    """
    content = master_admin_service.get_admin_content_piece_by_id(content_id, str(current_user.id), db)
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Content piece not found"
        )
    
    updated_content = master_admin_service.update_admin_content_piece(content, content_update, db)
    return updated_content


@router.delete("/content/pieces/{content_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_content_piece(
    content_id: int,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Delete a content piece.
    """
    content = master_admin_service.get_admin_content_piece_by_id(content_id, str(current_user.id), db)
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Content piece not found"
        )
    
    master_admin_service.delete_admin_content_piece(content, db)
    return None


# ============================================================================
# Lead Capture Endpoints
# ============================================================================

@router.post("/lead-captures", response_model=AdminLeadCaptureResponse, status_code=status.HTTP_201_CREATED)
def create_lead_capture(
    lead_data: AdminLeadCaptureCreate,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Create a new lead capture from networking event.
    """
    lead = master_admin_service.create_admin_lead_capture(lead_data, current_user, db)
    return lead


@router.get("/lead-captures", response_model=AdminLeadCaptureListResponse)
def list_lead_captures(
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=100),
    event_name: Optional[str] = None,
    interest_level: Optional[str] = None,
    follow_up_sent: Optional[bool] = None,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    List all lead captures with pagination and filtering.
    """
    leads, total = master_admin_service.list_admin_lead_captures(
        user_id=str(current_user.id),
        db=db,
        page=page,
        per_page=per_page,
        event_name=event_name,
        interest_level=interest_level,
        follow_up_sent=follow_up_sent,
    )
    
    return {
        "items": leads,
        "total": total,
        "page": page,
        "per_page": per_page,
    }


@router.get("/lead-captures/{lead_id}", response_model=AdminLeadCaptureResponse)
def get_lead_capture(
    lead_id: int,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Get lead capture details by ID.
    """
    lead = master_admin_service.get_admin_lead_capture_by_id(lead_id, str(current_user.id), db)
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead capture not found"
        )
    return lead


@router.put("/lead-captures/{lead_id}", response_model=AdminLeadCaptureResponse)
def update_lead_capture(
    lead_id: int,
    lead_update: AdminLeadCaptureUpdate,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Update an existing lead capture.
    """
    lead = master_admin_service.get_admin_lead_capture_by_id(lead_id, str(current_user.id), db)
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead capture not found"
        )
    
    updated_lead = master_admin_service.update_admin_lead_capture(lead, lead_update, db)
    return updated_lead


@router.delete("/lead-captures/{lead_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lead_capture(
    lead_id: int,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Delete a lead capture.
    """
    lead = master_admin_service.get_admin_lead_capture_by_id(lead_id, str(current_user.id), db)
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead capture not found"
        )
    
    master_admin_service.delete_admin_lead_capture(lead, db)
    return None


@router.post("/lead-captures/{lead_id}/sync-ghl", response_model=AdminLeadCaptureResponse)
def sync_lead_to_gohighlevel(
    lead_id: int,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Sync lead capture to GoHighLevel CRM.
    """
    lead = master_admin_service.get_admin_lead_capture_by_id(lead_id, str(current_user.id), db)
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead capture not found"
        )
    
    synced_lead = master_admin_service.sync_lead_to_ghl(lead, db)
    return synced_lead


# ============================================================================
# Collateral Management Endpoints
# ============================================================================

@router.post("/collateral", response_model=AdminCollateralResponse, status_code=status.HTTP_201_CREATED)
def create_collateral(
    collateral_data: AdminCollateralCreate,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Create a new sales collateral item.
    """
    collateral = master_admin_service.create_admin_collateral(collateral_data, current_user, db)
    return collateral


@router.get("/collateral", response_model=AdminCollateralListResponse)
def list_collateral(
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=100),
    collateral_type: Optional[str] = None,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    List all sales collateral with pagination and filtering.
    """
    collateral_items, total = master_admin_service.list_admin_collateral(
        user_id=str(current_user.id),
        db=db,
        page=page,
        per_page=per_page,
        collateral_type=collateral_type,
        search=search,
    )
    
    return {
        "items": collateral_items,
        "total": total,
        "page": page,
        "per_page": per_page,
    }


@router.get("/collateral/{collateral_id}", response_model=AdminCollateralResponse)
def get_collateral(
    collateral_id: int,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Get collateral details by ID.
    """
    collateral = master_admin_service.get_admin_collateral_by_id(collateral_id, str(current_user.id), db)
    if not collateral:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collateral not found"
        )
    return collateral


@router.put("/collateral/{collateral_id}", response_model=AdminCollateralResponse)
def update_collateral(
    collateral_id: int,
    collateral_update: AdminCollateralUpdate,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Update an existing collateral item.
    """
    collateral = master_admin_service.get_admin_collateral_by_id(collateral_id, str(current_user.id), db)
    if not collateral:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collateral not found"
        )
    
    updated_collateral = master_admin_service.update_admin_collateral(collateral, collateral_update, db)
    return updated_collateral


@router.delete("/collateral/{collateral_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_collateral(
    collateral_id: int,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Delete a collateral item.
    """
    collateral = master_admin_service.get_admin_collateral_by_id(collateral_id, str(current_user.id), db)
    if not collateral:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collateral not found"
        )
    
    master_admin_service.delete_admin_collateral(collateral, db)
    return None


@router.post("/collateral/{collateral_id}/track-usage", response_model=dict)
def track_collateral_usage_endpoint(
    collateral_id: int,
    prospect_id: Optional[int] = None,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Track collateral usage.
    """
    collateral = master_admin_service.get_admin_collateral_by_id(collateral_id, str(current_user.id), db)
    if not collateral:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collateral not found"
        )
    
    usage = master_admin_service.track_collateral_usage(
        collateral_id=collateral_id,
        user_id=str(current_user.id),
        prospect_id=prospect_id,
        db=db,
    )
    
    return {"message": "Usage tracked successfully", "usage_id": usage.id}
