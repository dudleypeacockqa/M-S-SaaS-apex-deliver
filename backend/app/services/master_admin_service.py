"""Service layer for Master Admin Portal operations."""
from __future__ import annotations

from datetime import date, datetime, timedelta, timezone
from typing import Optional

from sqlalchemy import select, and_, or_, func, desc
from sqlalchemy.orm import Session

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
    AdminCampaign,
    AdminCampaignRecipient,
    AdminContentScript,
    AdminContentPiece,
    AdminLeadCapture,
    AdminCollateral,
    AdminCollateralUsage,
)
from app.models.enums import (
    ActivityType,
    ActivityStatus,
    ProspectStatus,
    AdminDealStage,
    CampaignStatus,
)
from app.schemas.master_admin import (
    AdminGoalCreate,
    AdminGoalUpdate,
    AdminActivityCreate,
    AdminActivityUpdate,
    AdminScoreCreate,
    AdminScoreUpdate,
    AdminFocusSessionCreate,
    AdminFocusSessionUpdate,
    AdminNudgeCreate,
    AdminNudgeUpdate,
    AdminMeetingCreate,
    AdminMeetingUpdate,
    AdminProspectCreate,
    AdminProspectUpdate,
    AdminDealCreate,
    AdminDealUpdate,
    AdminCampaignCreate,
    AdminCampaignUpdate,
    AdminContentScriptCreate,
    AdminContentScriptUpdate,
    AdminContentPieceCreate,
    AdminContentPieceUpdate,
    AdminLeadCaptureCreate,
    AdminLeadCaptureUpdate,
    AdminCollateralCreate,
    AdminCollateralUpdate,
)


# ============================================================================
# Activity Tracker Services
# ============================================================================

def create_admin_goal(goal_data: AdminGoalCreate, user: User, db: Session) -> AdminGoal:
    """
    Create a new weekly goal.

    Args:
        goal_data: Goal creation data
        user: User creating the goal
        db: Database session

    Returns:
        Created goal instance
    """
    goal = AdminGoal(
        user_id=str(user.id),
        week_start=goal_data.week_start,
        target_discoveries=goal_data.target_discoveries,
        target_emails=goal_data.target_emails,
        target_videos=goal_data.target_videos,
        target_calls=goal_data.target_calls,
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal


def get_admin_goal_by_week(user_id: str, week_start: date, db: Session) -> Optional[AdminGoal]:
    """
    Get goal for a specific week.

    Args:
        user_id: User ID
        week_start: Week start date
        db: Database session

    Returns:
        Goal instance or None if not found
    """
    return db.scalar(
        select(AdminGoal).where(
            AdminGoal.user_id == user_id,
            AdminGoal.week_start == week_start
        )
    )


def get_current_week_goal(user_id: str, db: Session) -> Optional[AdminGoal]:
    """
    Get goal for the current week.

    Args:
        user_id: User ID
        db: Database session

    Returns:
        Goal instance or None if not found
    """
    today = date.today()
    # Calculate Monday of current week
    week_start = today - timedelta(days=today.weekday())
    return get_admin_goal_by_week(user_id, week_start, db)


def update_admin_goal(goal: AdminGoal, goal_data: AdminGoalUpdate, db: Session) -> AdminGoal:
    """
    Update an existing goal.

    Args:
        goal: Goal instance to update
        goal_data: Update data
        db: Database session

    Returns:
        Updated goal instance
    """
    if goal_data.target_discoveries is not None:
        goal.target_discoveries = goal_data.target_discoveries
    if goal_data.target_emails is not None:
        goal.target_emails = goal_data.target_emails
    if goal_data.target_videos is not None:
        goal.target_videos = goal_data.target_videos
    if goal_data.target_calls is not None:
        goal.target_calls = goal_data.target_calls
    
    goal.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(goal)
    return goal


def create_admin_activity(activity_data: AdminActivityCreate, user: User, db: Session) -> AdminActivity:
    """
    Create a new activity and update daily score.

    Args:
        activity_data: Activity creation data
        user: User creating the activity
        db: Database session

    Returns:
        Created activity instance
    """
    activity = AdminActivity(
        user_id=str(user.id),
        type=activity_data.activity_type,
        status=activity_data.status,
        date=activity_data.date,
        amount=activity_data.amount,
        notes=activity_data.notes,
        prospect_id=activity_data.prospect_id,
    )
    db.add(activity)
    db.commit()
    db.refresh(activity)
    
    # Update daily score
    _update_daily_score(str(user.id), activity_data.date, db)
    
    return activity


def list_admin_activities(
    user_id: str,
    db: Session,
    page: int = 1,
    per_page: int = 50,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    activity_type: Optional[ActivityType] = None,
) -> tuple[list[AdminActivity], int]:
    """
    List activities with pagination and filtering.

    Args:
        user_id: User ID
        db: Database session
        page: Page number (1-indexed)
        per_page: Items per page
        start_date: Filter by start date
        end_date: Filter by end date
        activity_type: Filter by activity type

    Returns:
        Tuple of (activities list, total count)
    """
    query = select(AdminActivity).where(AdminActivity.user_id == user_id)
    
    if start_date:
        query = query.where(AdminActivity.date >= start_date)
    if end_date:
        query = query.where(AdminActivity.date <= end_date)
    if activity_type:
        query = query.where(AdminActivity.type == activity_type)
    
    # Get total count
    total = db.scalar(select(func.count()).select_from(query.subquery()))
    
    # Apply pagination and sorting
    query = query.order_by(desc(AdminActivity.date), desc(AdminActivity.created_at))
    query = query.offset((page - 1) * per_page).limit(per_page)
    
    activities = list(db.scalars(query))
    return activities, total or 0


def update_admin_activity(activity: AdminActivity, activity_data: AdminActivityUpdate, db: Session) -> AdminActivity:
    """
    Update an existing activity.

    Args:
        activity: Activity instance to update
        activity_data: Update data
        db: Database session

    Returns:
        Updated activity instance
    """
    if activity_data.activity_type is not None:
        activity.type = activity_data.activity_type
    if activity_data.status is not None:
        activity.status = activity_data.status
    if activity_data.date is not None:
        activity.date = activity_data.date
    if activity_data.amount is not None:
        activity.amount = activity_data.amount
    if activity_data.notes is not None:
        activity.notes = activity_data.notes
    if activity_data.prospect_id is not None:
        activity.prospect_id = activity_data.prospect_id
    
    activity.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(activity)
    
    # Update daily score
    _update_daily_score(activity.user_id, activity.date, db)
    
    return activity


def delete_admin_activity(activity: AdminActivity, db: Session) -> None:
    """
    Delete an activity.

    Args:
        activity: Activity instance to delete
        db: Database session
    """
    user_id = activity.user_id
    activity_date = activity.date
    
    db.delete(activity)
    db.commit()
    
    # Update daily score
    _update_daily_score(user_id, activity_date, db)


def get_admin_score_by_date(user_id: str, score_date: date, db: Session) -> Optional[AdminScore]:
    """
    Get score for a specific date.

    Args:
        user_id: User ID
        score_date: Score date
        db: Database session

    Returns:
        Score instance or None if not found
    """
    return db.scalar(
        select(AdminScore).where(
            AdminScore.user_id == user_id,
            AdminScore.date == score_date
        )
    )


def get_current_streak(user_id: str, db: Session) -> int:
    """
    Calculate current streak for a user.

    Args:
        user_id: User ID
        db: Database session

    Returns:
        Current streak in days
    """
    today = date.today()
    score = get_admin_score_by_date(user_id, today, db)
    return score.streak_days if score else 0


def get_weekly_scores(user_id: str, week_start: date, db: Session) -> list[AdminScore]:
    """
    Get scores for a specific week.

    Args:
        user_id: User ID
        week_start: Week start date (Monday)
        db: Database session

    Returns:
        List of score instances for the week
    """
    week_end = week_start + timedelta(days=6)
    query = select(AdminScore).where(
        AdminScore.user_id == user_id,
        AdminScore.date >= week_start,
        AdminScore.date <= week_end
    ).order_by(AdminScore.date)
    
    return list(db.scalars(query))


def _update_daily_score(user_id: str, score_date: date, db: Session) -> None:
    """
    Internal function to update or create daily score based on activities.

    Args:
        user_id: User ID
        score_date: Date to calculate score for
        db: Database session
    """
    # Get all activities for the date
    activities = db.scalars(
        select(AdminActivity).where(
            AdminActivity.user_id == user_id,
            AdminActivity.date == score_date,
            AdminActivity.status == "done"
        )
    ).all()
    
    # Calculate score (weighted by activity type)
    score_weights = {
        ActivityType.DISCOVERY: 25,
        ActivityType.EMAIL: 5,
        ActivityType.VIDEO: 15,
        ActivityType.CALL: 20,
    }
    
    total_score = 0
    for activity in activities:
        weight = score_weights.get(activity.type, 5)
        total_score += weight * activity.amount
    
    # Cap at 100
    total_score = min(total_score, 100)
    
    # Calculate streak
    yesterday = score_date - timedelta(days=1)
    yesterday_score = get_admin_score_by_date(user_id, yesterday, db)
    
    if yesterday_score and yesterday_score.score > 0:
        streak_days = yesterday_score.streak_days + (1 if total_score > 0 else 0)
    else:
        streak_days = 1 if total_score > 0 else 0
    
    # Update or create score
    score = get_admin_score_by_date(user_id, score_date, db)
    if score:
        score.score = total_score
        score.streak_days = streak_days
        score.activities_count = len(activities)
        score.updated_at = datetime.now(timezone.utc)
    else:
        score = AdminScore(
            user_id=user_id,
            date=score_date,
            score=total_score,
            streak_days=streak_days,
            activities_count=len(activities),
        )
        db.add(score)
    
    db.commit()


def create_admin_focus_session(session_data: AdminFocusSessionCreate, user: User, db: Session) -> AdminFocusSession:
    """
    Create a new focus session.

    Args:
        session_data: Session creation data
        user: User creating the session
        db: Database session

    Returns:
        Created session instance
    """
    session = AdminFocusSession(
        user_id=str(user.id),
        start_time=session_data.start_time,
        duration_minutes=session_data.duration_minutes,
        notes=session_data.notes,
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def get_active_focus_session(user_id: str, db: Session) -> Optional[AdminFocusSession]:
    """
    Get the currently active focus session for a user.

    Args:
        user_id: User ID
        db: Database session

    Returns:
        Active session instance or None
    """
    return db.scalar(
        select(AdminFocusSession).where(
            AdminFocusSession.user_id == user_id,
            AdminFocusSession.end_time.is_(None),
            AdminFocusSession.completed == False
        ).order_by(desc(AdminFocusSession.start_time))
    )


def complete_focus_session(session: AdminFocusSession, interrupted: bool, notes: Optional[str], db: Session) -> AdminFocusSession:
    """
    Complete a focus session.

    Args:
        session: Session instance to complete
        interrupted: Whether the session was interrupted
        notes: Optional completion notes
        db: Database session

    Returns:
        Updated session instance
    """
    session.end_time = datetime.now(timezone.utc)
    session.completed = not interrupted
    session.interrupted = interrupted
    if notes:
        session.notes = notes
    
    db.commit()
    db.refresh(session)
    return session


def create_admin_nudge(nudge_data: AdminNudgeCreate, user: User, db: Session) -> AdminNudge:
    """
    Create a new nudge/notification.

    Args:
        nudge_data: Nudge creation data
        user: User to receive the nudge
        db: Database session

    Returns:
        Created nudge instance
    """
    nudge = AdminNudge(
        user_id=str(user.id),
        type=nudge_data.nudge_type,
        message=nudge_data.message,
        priority=nudge_data.priority,
        action_url=nudge_data.action_url,
        expires_at=nudge_data.expires_at,
    )
    db.add(nudge)
    db.commit()
    db.refresh(nudge)
    return nudge


def get_unread_nudges(user_id: str, db: Session) -> list[AdminNudge]:
    """
    Get all unread nudges for a user.

    Args:
        user_id: User ID
        db: Database session

    Returns:
        List of unread nudge instances
    """
    now = datetime.now(timezone.utc)
    query = select(AdminNudge).where(
        AdminNudge.user_id == user_id,
        AdminNudge.read == False,
        or_(AdminNudge.expires_at.is_(None), AdminNudge.expires_at > now)
    ).order_by(desc(AdminNudge.priority), desc(AdminNudge.created_at))
    
    return list(db.scalars(query))


def mark_nudge_as_read(nudge: AdminNudge, db: Session) -> AdminNudge:
    """
    Mark a nudge as read.

    Args:
        nudge: Nudge instance to mark as read
        db: Database session

    Returns:
        Updated nudge instance
    """
    nudge.read = True
    db.commit()
    db.refresh(nudge)
    return nudge


def create_admin_meeting_template(meeting_data: AdminMeetingCreate, user: User, db: Session) -> AdminMeeting:
    """
    Create a new meeting template.

    Args:
        meeting_data: Meeting template data
        user: User creating the template
        db: Database session

    Returns:
        Created meeting template instance
    """
    meeting = AdminMeeting(
        user_id=str(user.id),
        title=meeting_data.title,
        type=meeting_data.meeting_type,
        duration_minutes=meeting_data.duration_minutes,
        agenda=meeting_data.agenda,
        questions=meeting_data.questions,
        follow_up_tasks=meeting_data.follow_up_tasks,
    )
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    return meeting


def get_meeting_templates_by_type(user_id: str, meeting_type, db: Session) -> list[AdminMeeting]:
    """
    Get meeting templates by type.

    Args:
        user_id: User ID
        meeting_type: Meeting type enum
        db: Database session

    Returns:
        List of meeting template instances
    """
    query = select(AdminMeeting).where(
        AdminMeeting.user_id == user_id,
        AdminMeeting.type == meeting_type
    ).order_by(desc(AdminMeeting.created_at))
    
    return list(db.scalars(query))


# ============================================================================
# Prospect & Pipeline Services
# ============================================================================

def create_admin_prospect(prospect_data: AdminProspectCreate, user: User, db: Session) -> AdminProspect:
    """
    Create a new prospect.

    Args:
        prospect_data: Prospect creation data
        user: User creating the prospect
        db: Database session

    Returns:
        Created prospect instance
    """
    prospect = AdminProspect(
        user_id=str(user.id),
        name=prospect_data.name,
        email=prospect_data.email,
        phone=prospect_data.phone,
        company=prospect_data.company,
        title=prospect_data.title,
        status=prospect_data.status,
        source=prospect_data.source,
        tags=prospect_data.tags,
        notes=prospect_data.notes,
        voice_notes_url=prospect_data.voice_notes_url,
        ghl_contact_id=prospect_data.ghl_contact_id,
    )
    db.add(prospect)
    db.commit()
    db.refresh(prospect)
    return prospect


def get_admin_prospect_by_id(prospect_id: int, user_id: str, db: Session) -> Optional[AdminProspect]:
    """
    Get prospect by ID (user-scoped).

    Args:
        prospect_id: Prospect ID
        user_id: User ID for isolation
        db: Database session

    Returns:
        Prospect instance or None if not found
    """
    return db.scalar(
        select(AdminProspect).where(
            AdminProspect.id == prospect_id,
            AdminProspect.user_id == user_id
        )
    )


def list_admin_prospects(
    user_id: str,
    db: Session,
    page: int = 1,
    per_page: int = 50,
    status: Optional[str] = None,
    search: Optional[str] = None,
) -> tuple[list[AdminProspect], int]:
    """
    List prospects with pagination and filtering.

    Args:
        user_id: User ID
        db: Database session
        page: Page number (1-indexed)
        per_page: Items per page
        status: Filter by prospect status
        search: Search by name, email, or company

    Returns:
        Tuple of (prospects list, total count)
    """
    query = select(AdminProspect).where(AdminProspect.user_id == user_id)
    
    if status:
        query = query.where(AdminProspect.status == status)
    if search:
        search_term = f"%{search}%"
        query = query.where(
            or_(
                AdminProspect.name.ilike(search_term),
                AdminProspect.email.ilike(search_term),
                AdminProspect.company.ilike(search_term)
            )
        )
    
    # Get total count
    total = db.scalar(select(func.count()).select_from(query.subquery()))
    
    # Apply pagination and sorting
    query = query.order_by(desc(AdminProspect.created_at))
    query = query.offset((page - 1) * per_page).limit(per_page)
    
    prospects = list(db.scalars(query))
    return prospects, total or 0


def update_admin_prospect(prospect: AdminProspect, prospect_data: AdminProspectUpdate, db: Session) -> AdminProspect:
    """
    Update an existing prospect.

    Args:
        prospect: Prospect instance to update
        prospect_data: Update data
        db: Database session

    Returns:
        Updated prospect instance
    """
    update_fields = prospect_data.model_dump(exclude_unset=True, by_alias=True)
    for field, value in update_fields.items():
        setattr(prospect, field, value)
    
    prospect.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(prospect)
    return prospect


def delete_admin_prospect(prospect: AdminProspect, db: Session) -> None:
    """
    Delete a prospect.

    Args:
        prospect: Prospect instance to delete
        db: Database session
    """
    db.delete(prospect)
    db.commit()


def create_admin_deal(deal_data: AdminDealCreate, user: User, db: Session) -> AdminDeal:
    """
    Create a new deal.

    Args:
        deal_data: Deal creation data
        user: User creating the deal
        db: Database session

    Returns:
        Created deal instance
    """
    deal = AdminDeal(
        user_id=str(user.id),
        prospect_id=deal_data.prospect_id,
        title=deal_data.title,
        stage=deal_data.stage,
        value=deal_data.value,
        probability=deal_data.probability,
        expected_close_date=deal_data.expected_close_date,
        actual_close_date=deal_data.actual_close_date,
        notes=deal_data.notes,
    )
    db.add(deal)
    db.commit()
    db.refresh(deal)
    return deal


def list_admin_deals(
    user_id: str,
    db: Session,
    page: int = 1,
    per_page: int = 50,
    stage: Optional[str] = None,
) -> tuple[list[AdminDeal], int]:
    """
    List deals with pagination and filtering.

    Args:
        user_id: User ID
        db: Database session
        page: Page number (1-indexed)
        per_page: Items per page
        stage: Filter by deal stage

    Returns:
        Tuple of (deals list, total count)
    """
    query = select(AdminDeal).where(AdminDeal.user_id == user_id)
    
    if stage:
        query = query.where(AdminDeal.stage == stage)
    
    # Get total count
    total = db.scalar(select(func.count()).select_from(query.subquery()))
    
    # Apply pagination and sorting
    query = query.order_by(desc(AdminDeal.created_at))
    query = query.offset((page - 1) * per_page).limit(per_page)
    
    deals = list(db.scalars(query))
    return deals, total or 0


def update_admin_deal(deal: AdminDeal, deal_data: AdminDealUpdate, db: Session) -> AdminDeal:
    """
    Update an existing deal.

    Args:
        deal: Deal instance to update
        deal_data: Update data
        db: Database session

    Returns:
        Updated deal instance
    """
    update_fields = deal_data.model_dump(exclude_unset=True, by_alias=True)
    for field, value in update_fields.items():
        setattr(deal, field, value)
    
    deal.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(deal)
    return deal


# ============================================================================
# Helper Functions
# ============================================================================

def get_dashboard_stats(user_id: str, db: Session) -> dict:
    """
    Get dashboard statistics for the user.

    Args:
        user_id: User ID
        db: Database session

    Returns:
        Dictionary with dashboard stats
    """
    today = date.today()
    week_start = today - timedelta(days=today.weekday())
    
    # Get current score and streak
    today_score = get_admin_score_by_date(user_id, today, db)
    current_score = today_score.score if today_score else 0
    current_streak = today_score.streak_days if today_score else 0
    
    # Get weekly activities count
    weekly_activities = db.scalar(
        select(func.count()).where(
            AdminActivity.user_id == user_id,
            AdminActivity.date >= week_start,
            AdminActivity.status == ActivityStatus.DONE,
        )
    ) or 0
    
    # Get active prospects count
    active_prospects = db.scalar(
        select(func.count()).where(
            AdminProspect.user_id == user_id,
            AdminProspect.status.in_(
                [
                    ProspectStatus.QUALIFIED,
                    ProspectStatus.ENGAGED,
                    ProspectStatus.PROPOSAL,
                    ProspectStatus.NEGOTIATION,
                ]
            ),
        )
    ) or 0
    
    # Get open deals count
    open_deals = db.scalar(
        select(func.count()).where(
            AdminDeal.user_id == user_id,
            AdminDeal.stage.in_(
                [
                    AdminDealStage.DISCOVERY,
                    AdminDealStage.QUALIFICATION,
                    AdminDealStage.PROPOSAL,
                    AdminDealStage.NEGOTIATION,
                    AdminDealStage.CLOSING,
                ]
            ),
        )
    ) or 0
    
    # Get unread nudges count
    unread_nudges_count = len(get_unread_nudges(user_id, db))
    
    return {
        "current_score": current_score,
        "current_streak": current_streak,
        "weekly_activities": weekly_activities,
        "active_prospects": active_prospects,
        "open_deals": open_deals,
        "unread_nudges": unread_nudges_count,
    }


# ============================================================================
# Campaign Management Services
# ============================================================================

def create_admin_campaign(campaign_data: AdminCampaignCreate, user: User, db: Session) -> AdminCampaign:
    """
    Create a new campaign.

    Args:
        campaign_data: Campaign creation data
        user: User creating the campaign
        db: Database session

    Returns:
        Created campaign instance
    """
    campaign = AdminCampaign(
        user_id=str(user.id),
        name=campaign_data.name,
        type=campaign_data.campaign_type,
        status=campaign_data.status,
        subject=campaign_data.subject,
        content=campaign_data.content,
        scheduled_at=campaign_data.scheduled_at,
    )
    db.add(campaign)
    db.commit()
    db.refresh(campaign)
    return campaign


def get_admin_campaign_by_id(campaign_id: int, user_id: str, db: Session) -> Optional[AdminCampaign]:
    """
    Get campaign by ID (user-scoped).

    Args:
        campaign_id: Campaign ID
        user_id: User ID for isolation
        db: Database session

    Returns:
        Campaign instance or None if not found
    """
    return db.scalar(
        select(AdminCampaign).where(
            AdminCampaign.id == campaign_id,
            AdminCampaign.user_id == user_id
        )
    )


def list_admin_campaigns(
    user_id: str,
    db: Session,
    page: int = 1,
    per_page: int = 50,
    status: Optional[str] = None,
    campaign_type: Optional[str] = None,
) -> tuple[list[AdminCampaign], int]:
    """
    List campaigns with pagination and filtering.

    Args:
        user_id: User ID
        db: Database session
        page: Page number (1-indexed)
        per_page: Items per page
        status: Filter by campaign status
        campaign_type: Filter by campaign type

    Returns:
        Tuple of (campaigns list, total count)
    """
    query = select(AdminCampaign).where(AdminCampaign.user_id == user_id)
    
    if status:
        query = query.where(AdminCampaign.status == status)
    if campaign_type:
        query = query.where(AdminCampaign.type == campaign_type)
    
    # Get total count
    total = db.scalar(select(func.count()).select_from(query.subquery()))
    
    # Apply pagination and sorting
    query = query.order_by(desc(AdminCampaign.created_at))
    query = query.offset((page - 1) * per_page).limit(per_page)
    
    campaigns = list(db.scalars(query))
    return campaigns, total or 0


def update_admin_campaign(campaign: AdminCampaign, campaign_data: AdminCampaignUpdate, db: Session) -> AdminCampaign:
    """
    Update an existing campaign.

    Args:
        campaign: Campaign instance to update
        campaign_data: Update data
        db: Database session

    Returns:
        Updated campaign instance
    """
    update_fields = campaign_data.model_dump(exclude_unset=True, by_alias=True)
    for field, value in update_fields.items():
        setattr(campaign, field, value)
    
    campaign.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(campaign)
    return campaign


def delete_admin_campaign(campaign: AdminCampaign, db: Session) -> None:
    """
    Delete a campaign.

    Args:
        campaign: Campaign instance to delete
        db: Database session
    """
    db.delete(campaign)
    db.commit()


def send_admin_campaign(campaign: AdminCampaign, db: Session) -> AdminCampaign:
    """
    Send a campaign (update status to sent).

    Args:
        campaign: Campaign instance to send
        db: Database session

    Returns:
        Updated campaign instance
    """
    campaign.status = CampaignStatus.SENT
    campaign.sent_at = datetime.now(timezone.utc)
    campaign.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(campaign)
    return campaign


def _refresh_campaign_recipient_stats(campaign: AdminCampaign, db: Session) -> None:
    """Recalculate recipient engagement counters and persist them on the campaign."""

    totals = db.scalar(
        select(func.count()).where(AdminCampaignRecipient.campaign_id == campaign.id)
    ) or 0
    sent_count = db.scalar(
        select(func.count()).where(
            AdminCampaignRecipient.campaign_id == campaign.id,
            AdminCampaignRecipient.sent.is_(True),
        )
    ) or 0
    opened_count = db.scalar(
        select(func.count()).where(
            AdminCampaignRecipient.campaign_id == campaign.id,
            AdminCampaignRecipient.opened.is_(True),
        )
    ) or 0
    clicked_count = db.scalar(
        select(func.count()).where(
            AdminCampaignRecipient.campaign_id == campaign.id,
            AdminCampaignRecipient.clicked.is_(True),
        )
    ) or 0

    campaign.total_recipients = totals
    campaign.sent_count = sent_count
    campaign.opened_count = opened_count
    campaign.clicked_count = clicked_count
    campaign.updated_at = datetime.now(timezone.utc)


def add_admin_campaign_recipient(
    campaign: AdminCampaign,
    prospect_id: int,
    db: Session,
) -> AdminCampaignRecipient:
    """Attach a prospect to a campaign recipient list."""

    existing = db.scalar(
        select(AdminCampaignRecipient).where(
            AdminCampaignRecipient.campaign_id == campaign.id,
            AdminCampaignRecipient.prospect_id == prospect_id,
        )
    )
    if existing:
        raise ValueError("Prospect already added to this campaign")

    recipient = AdminCampaignRecipient(
        campaign_id=campaign.id,
        prospect_id=prospect_id,
    )
    db.add(recipient)
    db.flush()
    _refresh_campaign_recipient_stats(campaign, db)
    db.commit()
    db.refresh(recipient)
    db.refresh(campaign)
    return recipient


def list_admin_campaign_recipients(
    campaign_id: int,
    user_id: str,
    db: Session,
) -> list[AdminCampaignRecipient]:
    """Return all recipients for a given campaign owned by the user."""

    query = (
        select(AdminCampaignRecipient)
        .join(AdminCampaign, AdminCampaign.id == AdminCampaignRecipient.campaign_id)
        .where(
            AdminCampaign.id == campaign_id,
            AdminCampaign.user_id == user_id,
        )
        .order_by(AdminCampaignRecipient.id)
    )
    return list(db.scalars(query))


def get_admin_campaign_recipient(
    recipient_id: int,
    campaign_id: int,
    user_id: str,
    db: Session,
) -> Optional[AdminCampaignRecipient]:
    """Fetch a single campaign recipient ensuring it belongs to the user."""

    return db.scalar(
        select(AdminCampaignRecipient)
        .join(AdminCampaign, AdminCampaign.id == AdminCampaignRecipient.campaign_id)
        .where(
            AdminCampaignRecipient.id == recipient_id,
            AdminCampaign.id == campaign_id,
            AdminCampaign.user_id == user_id,
        )
    )


def update_admin_campaign_recipient(
    recipient: AdminCampaignRecipient,
    recipient_data: AdminCampaignRecipientUpdate,
    campaign: AdminCampaign,
    db: Session,
) -> AdminCampaignRecipient:
    """Update recipient engagement attributes and refresh campaign metrics."""

    update_fields = recipient_data.model_dump(exclude_unset=True)
    for field, value in update_fields.items():
        setattr(recipient, field, value)
        if field == "sent" and value and recipient.sent_at is None:
            recipient.sent_at = datetime.now(timezone.utc)
        if field == "opened" and value and recipient.opened_at is None:
            recipient.opened_at = datetime.now(timezone.utc)
        if field == "clicked" and value and recipient.clicked_at is None:
            recipient.clicked_at = datetime.now(timezone.utc)

    db.flush()
    _refresh_campaign_recipient_stats(campaign, db)
    db.commit()
    db.refresh(recipient)
    db.refresh(campaign)
    return recipient


def delete_admin_campaign_recipient(
    recipient: AdminCampaignRecipient,
    campaign: AdminCampaign,
    db: Session,
) -> None:
    """Remove a recipient from a campaign and update aggregate counters."""

    db.delete(recipient)
    db.flush()
    _refresh_campaign_recipient_stats(campaign, db)
    db.commit()
    db.refresh(campaign)


# ============================================================================
# Content Studio Services
# ============================================================================

def create_admin_content_script(script_data: AdminContentScriptCreate, user: User, db: Session) -> AdminContentScript:
    """
    Create a new content script.

    Args:
        script_data: Script creation data
        user: User creating the script
        db: Database session

    Returns:
        Created script instance
    """
    script = AdminContentScript(
        user_id=str(user.id),
        title=script_data.title,
        content_type=script_data.content_type,
        script_text=script_data.script_text,
        duration_minutes=script_data.duration_minutes,
        keywords=script_data.keywords,
    )
    db.add(script)
    db.commit()
    db.refresh(script)
    return script


def get_admin_content_script_by_id(script_id: int, user_id: str, db: Session) -> Optional[AdminContentScript]:
    """
    Get content script by ID (user-scoped).

    Args:
        script_id: Script ID
        user_id: User ID for isolation
        db: Database session

    Returns:
        Script instance or None if not found
    """
    return db.scalar(
        select(AdminContentScript).where(
            AdminContentScript.id == script_id,
            AdminContentScript.user_id == user_id
        )
    )


def list_admin_content_scripts(
    user_id: str,
    db: Session,
    page: int = 1,
    per_page: int = 50,
    script_type: Optional[str] = None,
) -> tuple[list[AdminContentScript], int]:
    """
    List content scripts with pagination and filtering.

    Args:
        user_id: User ID
        db: Database session
        page: Page number (1-indexed)
        per_page: Items per page
        script_type: Filter by script type

    Returns:
        Tuple of (scripts list, total count)
    """
    query = select(AdminContentScript).where(AdminContentScript.user_id == user_id)
    
    if script_type:
        query = query.where(AdminContentScript.content_type == script_type)
    
    # Get total count
    total = db.scalar(select(func.count()).select_from(query.subquery()))
    
    # Apply pagination and sorting
    query = query.order_by(desc(AdminContentScript.created_at))
    query = query.offset((page - 1) * per_page).limit(per_page)
    
    scripts = list(db.scalars(query))
    return scripts, total or 0


def update_admin_content_script(script: AdminContentScript, script_data: AdminContentScriptUpdate, db: Session) -> AdminContentScript:
    """
    Update an existing content script.

    Args:
        script: Script instance to update
        script_data: Update data
        db: Database session

    Returns:
        Updated script instance
    """
    update_fields = script_data.model_dump(exclude_unset=True, by_alias=True)
    for field, value in update_fields.items():
        setattr(script, field, value)
    
    script.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(script)
    return script


def delete_admin_content_script(script: AdminContentScript, db: Session) -> None:
    """
    Delete a content script.

    Args:
        script: Script instance to delete
        db: Database session
    """
    db.delete(script)
    db.commit()


def create_admin_content_piece(content_data: AdminContentPieceCreate, user: User, db: Session) -> AdminContentPiece:
    """Create a new content piece (video, podcast, blog, etc.)."""

    content = AdminContentPiece(
        user_id=str(user.id),
        script_id=content_data.script_id,
        title=content_data.title,
        type=content_data.content_type,
        status=content_data.status,
        recording_url=content_data.recording_url,
        edited_url=content_data.edited_url,
        thumbnail_url=content_data.thumbnail_url,
        description=content_data.description,
        tags=content_data.tags,
        youtube_url=content_data.youtube_url,
        spotify_url=content_data.spotify_url,
        rss_url=content_data.rss_url,
    )
    db.add(content)
    db.commit()
    db.refresh(content)
    return content


def get_admin_content_piece_by_id(content_id: int, user_id: str, db: Session) -> Optional[AdminContentPiece]:
    """
    Get content piece by ID (user-scoped).

    Args:
        content_id: Content ID
        user_id: User ID for isolation
        db: Database session

    Returns:
        Content instance or None if not found
    """
    return db.scalar(
        select(AdminContentPiece).where(
            AdminContentPiece.id == content_id,
            AdminContentPiece.user_id == user_id
        )
    )


def list_admin_content_pieces(
    user_id: str,
    db: Session,
    page: int = 1,
    per_page: int = 50,
    content_type: Optional[str] = None,
    status: Optional[str] = None,
) -> tuple[list[AdminContentPiece], int]:
    """
    List content pieces with pagination and filtering.

    Args:
        user_id: User ID
        db: Database session
        page: Page number (1-indexed)
        per_page: Items per page
        content_type: Filter by content type
        status: Filter by status

    Returns:
        Tuple of (content list, total count)
    """
    query = select(AdminContentPiece).where(AdminContentPiece.user_id == user_id)
    
    if content_type:
        query = query.where(AdminContentPiece.type == content_type)
    if status:
        query = query.where(AdminContentPiece.status == status)
    
    # Get total count
    total = db.scalar(select(func.count()).select_from(query.subquery()))
    
    # Apply pagination and sorting
    query = query.order_by(desc(AdminContentPiece.created_at))
    query = query.offset((page - 1) * per_page).limit(per_page)
    
    content_pieces = list(db.scalars(query))
    return content_pieces, total or 0


def update_admin_content_piece(content: AdminContentPiece, content_data: AdminContentPieceUpdate, db: Session) -> AdminContentPiece:
    """
    Update an existing content piece.

    Args:
        content: Content instance to update
        content_data: Update data
        db: Database session

    Returns:
        Updated content instance
    """
    update_fields = content_data.model_dump(exclude_unset=True, by_alias=True)
    for field, value in update_fields.items():
        setattr(content, field, value)
    
    content.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(content)
    return content


def delete_admin_content_piece(content: AdminContentPiece, db: Session) -> None:
    """
    Delete a content piece.

    Args:
        content: Content instance to delete
        db: Database session
    """
    db.delete(content)
    db.commit()


# ============================================================================
# Lead Capture Services
# ============================================================================

def create_admin_lead_capture(lead_data: AdminLeadCaptureCreate, user: User, db: Session) -> AdminLeadCapture:
    """Create a new networking lead capture."""

    lead = AdminLeadCapture(
        user_id=str(user.id),
        name=lead_data.name,
        email=lead_data.email,
        phone=lead_data.phone,
        company=lead_data.company,
        event_name=lead_data.event_name,
        event_date=lead_data.event_date,
        interest_level=lead_data.interest_level,
        follow_up_type=lead_data.follow_up_type,
        notes=lead_data.notes,
        voice_notes_url=lead_data.voice_notes_url,
        synced_to_ghl=False,
        ghl_contact_id=getattr(lead_data, "ghl_contact_id", None),
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead


def get_admin_lead_capture_by_id(lead_id: int, user_id: str, db: Session) -> Optional[AdminLeadCapture]:
    """
    Get lead capture by ID (user-scoped).

    Args:
        lead_id: Lead ID
        user_id: User ID for isolation
        db: Database session

    Returns:
        Lead capture instance or None if not found
    """
    return db.scalar(
        select(AdminLeadCapture).where(
            AdminLeadCapture.id == lead_id,
            AdminLeadCapture.user_id == user_id
        )
    )


def list_admin_lead_captures(
    user_id: str,
    db: Session,
    page: int = 1,
    per_page: int = 50,
    event_name: Optional[str] = None,
    interest_level: Optional[str] = None,
    follow_up_sent: Optional[bool] = None,
) -> tuple[list[AdminLeadCapture], int]:
    """
    List lead captures with pagination and filtering.

    Args:
        user_id: User ID
        db: Database session
        page: Page number (1-indexed)
        per_page: Items per page
        event_name: Filter by event name
        interest_level: Filter by interest level
        follow_up_sent: Filter by follow-up status

    Returns:
        Tuple of (leads list, total count)
    """
    query = select(AdminLeadCapture).where(AdminLeadCapture.user_id == user_id)
    
    if event_name:
        query = query.where(AdminLeadCapture.event_name.ilike(f"%{event_name}%"))
    if interest_level:
        query = query.where(AdminLeadCapture.interest_level == interest_level)
    if follow_up_sent is not None:
        query = query.where(AdminLeadCapture.synced_to_ghl == follow_up_sent)
    
    # Get total count
    total = db.scalar(select(func.count()).select_from(query.subquery()))
    
    # Apply pagination and sorting
    query = query.order_by(desc(AdminLeadCapture.created_at))
    query = query.offset((page - 1) * per_page).limit(per_page)
    
    leads = list(db.scalars(query))
    return leads, total or 0


def update_admin_lead_capture(lead: AdminLeadCapture, lead_data: AdminLeadCaptureUpdate, db: Session) -> AdminLeadCapture:
    """Apply partial updates to a lead capture."""

    update_fields = lead_data.model_dump(exclude_unset=True, by_alias=True)
    for field, value in update_fields.items():
        setattr(lead, field, value)

    db.commit()
    db.refresh(lead)
    return lead


def delete_admin_lead_capture(lead: AdminLeadCapture, db: Session) -> None:
    """
    Delete a lead capture.

    Args:
        lead: Lead capture instance to delete
        db: Database session
    """
    db.delete(lead)
    db.commit()


def sync_lead_to_ghl(lead: AdminLeadCapture, db: Session) -> AdminLeadCapture:
    """Mark a lead capture as synced to GoHighLevel and assign a mock contact id."""

    lead.synced_to_ghl = True
    if not lead.ghl_contact_id:
        lead.ghl_contact_id = f"ghl-{lead.id}"

    db.commit()
    db.refresh(lead)
    return lead


# ============================================================================
# Collateral Services
# ============================================================================

def create_admin_collateral(collateral_data: AdminCollateralCreate, user: User, db: Session) -> AdminCollateral:
    """
    Create a new collateral item.

    Args:
        collateral_data: Collateral creation data
        user: User creating the collateral
        db: Database session

    Returns:
        Created collateral instance
    """
    collateral = AdminCollateral(
        user_id=str(user.id),
        title=collateral_data.title,
        type=collateral_data.collateral_type,
        description=collateral_data.description,
        file_url=collateral_data.file_url,
        file_size=collateral_data.file_size,
        mime_type=collateral_data.mime_type,
        tags=collateral_data.tags,
    )
    db.add(collateral)
    db.commit()
    db.refresh(collateral)
    return collateral


def get_admin_collateral_by_id(collateral_id: int, user_id: str, db: Session) -> Optional[AdminCollateral]:
    """
    Get collateral by ID (user-scoped).

    Args:
        collateral_id: Collateral ID
        user_id: User ID for isolation
        db: Database session

    Returns:
        Collateral instance or None if not found
    """
    return db.scalar(
        select(AdminCollateral).where(
            AdminCollateral.id == collateral_id,
            AdminCollateral.user_id == user_id
        )
    )


def list_admin_collateral(
    user_id: str,
    db: Session,
    page: int = 1,
    per_page: int = 50,
    collateral_type: Optional[str] = None,
    search: Optional[str] = None,
) -> tuple[list[AdminCollateral], int]:
    """
    List collateral with pagination and filtering.

    Args:
        user_id: User ID
        db: Database session
        page: Page number (1-indexed)
        per_page: Items per page
        collateral_type: Filter by collateral type
        search: Search by name or description

    Returns:
        Tuple of (collateral list, total count)
    """
    query = select(AdminCollateral).where(AdminCollateral.user_id == user_id)
    
    if collateral_type:
        query = query.where(AdminCollateral.type == collateral_type)
    if search:
        search_term = f"%{search}%"
        query = query.where(
            or_(
                AdminCollateral.title.ilike(search_term),
                AdminCollateral.description.ilike(search_term),
            )
        )
    
    # Get total count
    total = db.scalar(select(func.count()).select_from(query.subquery()))
    
    # Apply pagination and sorting
    query = query.order_by(desc(AdminCollateral.created_at))
    query = query.offset((page - 1) * per_page).limit(per_page)
    
    collateral_items = list(db.scalars(query))
    return collateral_items, total or 0


def update_admin_collateral(collateral: AdminCollateral, collateral_data: AdminCollateralUpdate, db: Session) -> AdminCollateral:
    """
    Update an existing collateral item.

    Args:
        collateral: Collateral instance to update
        collateral_data: Update data
        db: Database session

    Returns:
        Updated collateral instance
    """
    update_fields = collateral_data.model_dump(exclude_unset=True, by_alias=True)
    for field, value in update_fields.items():
        setattr(collateral, field, value)
    
    collateral.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(collateral)
    return collateral


def delete_admin_collateral(collateral: AdminCollateral, db: Session) -> None:
    """
    Delete a collateral item.

    Args:
        collateral: Collateral instance to delete
        db: Database session
    """
    db.delete(collateral)
    db.commit()


def track_collateral_usage(collateral_id: int, user_id: str, prospect_id: Optional[int], db: Session) -> AdminCollateralUsage:
    """
    Track collateral usage.

    Args:
        collateral_id: Collateral ID
        user_id: User ID
        prospect_id: Optional prospect ID
        db: Database session

    Returns:
        Created usage tracking instance
    """
    usage = AdminCollateralUsage(
        collateral_id=collateral_id,
        prospect_id=prospect_id,
        used_at=datetime.utcnow(),
    )
    db.add(usage)
    db.commit()
    db.refresh(usage)
    return usage
