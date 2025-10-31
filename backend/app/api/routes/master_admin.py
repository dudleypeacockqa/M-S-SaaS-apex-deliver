"""Master Admin Portal API routes."""
from __future__ import annotations

from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
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
)
from app.services import master_admin_service

router = APIRouter(prefix="/master-admin", tags=["master-admin"])


# ============================================================================
# Dashboard & Stats Endpoints
# ============================================================================

@router.get("/dashboard", response_model=dict)
def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
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
    current_user: User = Depends(get_current_user),
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
    current_user: User = Depends(get_current_user),
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
    current_user: User = Depends(get_current_user),
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
    current_user: User = Depends(get_current_user),
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
    current_user: User = Depends(get_current_user),
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
    current_user: User = Depends(get_current_user),
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
    current_user: User = Depends(get_current_user),
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
    current_user: User = Depends(get_current_user),
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
    current_user: User = Depends(get_current_user),
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
    current_user: User = Depends(get_current_user),
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


@router.get("/scores/{score_date}", response_model=AdminScoreResponse)
def get_score_by_date(
    score_date: date,
    current_user: User = Depends(get_current_user),
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
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get scores for a specific week.
    
    week_start should be a Monday (YYYY-MM-DD format).
    Returns scores for Monday through Sunday.
    """
    scores = master_admin_service.get_weekly_scores(str(current_user.id), week_start, db)
    return {"items": scores, "total": len(scores)}


@router.get("/scores/streak", response_model=dict)
def get_current_streak(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get the current streak in days.
    
    Returns the number of consecutive days with score > 0.
    """
    streak = master_admin_service.get_current_streak(str(current_user.id), db)
    return {"streak_days": streak}


# ============================================================================
# Activity Tracker - Focus Sessions Endpoints
# ============================================================================

@router.post("/focus-sessions", response_model=AdminFocusSessionResponse, status_code=status.HTTP_201_CREATED)
def create_focus_session(
    session: AdminFocusSessionCreate,
    current_user: User = Depends(get_current_user),
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
    current_user: User = Depends(get_current_user),
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
    current_user: User = Depends(get_current_user),
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
    current_user: User = Depends(get_current_user),
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
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get all unread nudges for the current user.
    
    Returns nudges that haven't been read and haven't expired.
    """
    nudges = master_admin_service.get_unread_nudges(str(current_user.id), db)
    return {"items": nudges, "total": len(nudges)}


@router.put("/nudges/{nudge_id}/read", response_model=AdminNudgeResponse)
def mark_nudge_as_read(
    nudge_id: int,
    current_user: User = Depends(get_current_user),
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
    current_user: User = Depends(get_current_user),
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
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get meeting templates by type.
    
    Types: discovery, demo, closing, follow_up
    """
    templates = master_admin_service.get_meeting_templates_by_type(
        str(current_user.id), meeting_type, db
    )
    return {"items": templates, "total": len(templates)}


# ============================================================================
# Prospect & Pipeline - Prospects Endpoints
# ============================================================================

@router.post("/prospects", response_model=AdminProspectResponse, status_code=status.HTTP_201_CREATED)
def create_prospect(
    prospect: AdminProspectCreate,
    current_user: User = Depends(get_current_user),
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
    current_user: User = Depends(get_current_user),
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
    current_user: User = Depends(get_current_user),
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
    current_user: User = Depends(get_current_user),
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
    current_user: User = Depends(get_current_user),
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
    current_user: User = Depends(get_current_user),
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
    current_user: User = Depends(get_current_user),
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
    current_user: User = Depends(get_current_user),
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
    current_user: User = Depends(get_current_user),
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
