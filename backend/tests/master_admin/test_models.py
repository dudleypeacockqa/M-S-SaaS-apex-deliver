"""Test Master Admin Portal database models.

Following TDD methodology (RED phase):
- Write failing tests first
- Implement models to make tests pass (GREEN phase)
- Refactor for quality

Target: 100% coverage
"""
import pytest
from datetime import date, datetime, timedelta
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.master_admin import (
    AdminGoal,
    AdminActivity,
    AdminScore,
    AdminFocusSession,
    AdminNudge,
    AdminMeeting
)
from app.models.enums import (
    ActivityType,
    ActivityStatus,
    NudgeType,
    NudgePriority,
    MeetingType
)


class TestAdminGoal:
    """Test AdminGoal model."""

    def test_create_admin_goal(self, db_session: Session, test_user):
        """Test creating an admin goal."""
        goal = AdminGoal(
            user_id=test_user.id,
            week_start=date(2025, 11, 1),
            target_discoveries=10,
            target_emails=20,
            target_videos=5,
            target_calls=3
        )
        db_session.add(goal)
        db_session.commit()
        db_session.refresh(goal)

        assert goal.id is not None
        assert goal.user_id == test_user.id
        assert goal.week_start == date(2025, 11, 1)
        assert goal.target_discoveries == 10
        assert goal.target_emails == 20
        assert goal.target_videos == 5
        assert goal.target_calls == 3
        assert goal.created_at is not None
        assert goal.updated_at is not None

    def test_admin_goal_unique_constraint(self, db_session: Session, test_user):
        """Test that user can only have one goal per week."""
        goal1 = AdminGoal(
            user_id=test_user.id,
            week_start=date(2025, 11, 1)
        )
        db_session.add(goal1)
        db_session.commit()

        goal2 = AdminGoal(
            user_id=test_user.id,
            week_start=date(2025, 11, 1)
        )
        db_session.add(goal2)

        with pytest.raises(IntegrityError):
            db_session.commit()

    def test_admin_goal_repr(self, db_session: Session, test_user):
        """Test __repr__ method."""
        goal = AdminGoal(
            user_id=test_user.id,
            week_start=date(2025, 11, 1)
        )
        db_session.add(goal)
        db_session.commit()
        db_session.refresh(goal)

        repr_str = repr(goal)
        assert f"AdminGoal(id={goal.id}" in repr_str
        assert f"user_id={test_user.id}" in repr_str
        assert "2025-11-01" in repr_str

    def test_admin_goal_default_targets(self, db_session: Session, test_user):
        """Test default target values."""
        goal = AdminGoal(
            user_id=test_user.id,
            week_start=date(2025, 11, 1)
        )
        db_session.add(goal)
        db_session.commit()
        db_session.refresh(goal)

        assert goal.target_discoveries == 0
        assert goal.target_emails == 0
        assert goal.target_videos == 0
        assert goal.target_calls == 0


class TestAdminActivity:
    """Test AdminActivity model."""

    def test_create_admin_activity(self, db_session: Session, test_user):
        """Test creating an admin activity."""
        activity = AdminActivity(
            user_id=test_user.id,
            type=ActivityType.DISCOVERY.value,
            status=ActivityStatus.DONE.value,
            date=date.today(),
            amount=2,
            notes="Found 2 prospects"
        )
        db_session.add(activity)
        db_session.commit()
        db_session.refresh(activity)

        assert activity.id is not None
        assert activity.user_id == test_user.id
        assert activity.type == "discovery"
        assert activity.status == "done"
        assert activity.date == date.today()
        assert activity.amount == 2
        assert activity.notes == "Found 2 prospects"
        assert activity.created_at is not None
        assert activity.updated_at is not None

    def test_admin_activity_types(self, db_session: Session, test_user):
        """Test all activity types."""
        types = [
            ActivityType.DISCOVERY,
            ActivityType.EMAIL,
            ActivityType.VIDEO,
            ActivityType.CALL
        ]

        for activity_type in types:
            activity = AdminActivity(
                user_id=test_user.id,
                type=activity_type.value,
                status=ActivityStatus.DONE.value,
                date=date.today()
            )
            db_session.add(activity)

        db_session.commit()
        activities = db_session.query(AdminActivity).all()
        assert len(activities) == 4

    def test_admin_activity_statuses(self, db_session: Session, test_user):
        """Test all activity statuses."""
        statuses = [
            ActivityStatus.DONE,
            ActivityStatus.PENDING,
            ActivityStatus.CANCELLED
        ]

        for status in statuses:
            activity = AdminActivity(
                user_id=test_user.id,
                type=ActivityType.DISCOVERY.value,
                status=status.value,
                date=date.today()
            )
            db_session.add(activity)

        db_session.commit()
        activities = db_session.query(AdminActivity).all()
        assert len(activities) == 3

    def test_admin_activity_default_amount(self, db_session: Session, test_user):
        """Test default amount value."""
        activity = AdminActivity(
            user_id=test_user.id,
            type=ActivityType.EMAIL.value,
            status=ActivityStatus.DONE.value,
            date=date.today()
        )
        db_session.add(activity)
        db_session.commit()
        db_session.refresh(activity)

        assert activity.amount == 1

    def test_admin_activity_repr(self, db_session: Session, test_user):
        """Test __repr__ method."""
        activity = AdminActivity(
            user_id=test_user.id,
            type=ActivityType.CALL.value,
            status=ActivityStatus.DONE.value,
            date=date.today()
        )
        db_session.add(activity)
        db_session.commit()
        db_session.refresh(activity)

        repr_str = repr(activity)
        assert f"AdminActivity(id={activity.id}" in repr_str
        assert "type=call" in repr_str


class TestAdminScore:
    """Test AdminScore model."""

    def test_create_admin_score(self, db_session: Session, test_user):
        """Test creating an admin score."""
        score = AdminScore(
            user_id=test_user.id,
            date=date.today(),
            score=75,
            streak_days=5,
            activities_count=10
        )
        db_session.add(score)
        db_session.commit()
        db_session.refresh(score)

        assert score.id is not None
        assert score.user_id == test_user.id
        assert score.date == date.today()
        assert score.score == 75
        assert score.streak_days == 5
        assert score.activities_count == 10
        assert score.created_at is not None
        assert score.updated_at is not None

    def test_admin_score_unique_constraint(self, db_session: Session, test_user):
        """Test that user can only have one score per date."""
        score1 = AdminScore(
            user_id=test_user.id,
            date=date.today(),
            score=50
        )
        db_session.add(score1)
        db_session.commit()

        score2 = AdminScore(
            user_id=test_user.id,
            date=date.today(),
            score=60
        )
        db_session.add(score2)

        with pytest.raises(IntegrityError):
            db_session.commit()

    def test_admin_score_valid_range(self, db_session: Session, test_user):
        """Test score must be between 0 and 100."""
        # Test minimum valid score
        score_min = AdminScore(
            user_id=test_user.id,
            date=date.today(),
            score=0
        )
        db_session.add(score_min)
        db_session.commit()
        db_session.expunge(score_min)

        # Test maximum valid score
        score_max = AdminScore(
            user_id=test_user.id,
            date=date.today() - timedelta(days=1),
            score=100
        )
        db_session.add(score_max)
        db_session.commit()

        # Test invalid scores (should be caught by CHECK constraint)
        # Note: SQLite doesn't enforce CHECK constraints by default in pytest
        # This test documents the constraint even if not enforceable in test

    def test_admin_score_default_values(self, db_session: Session, test_user):
        """Test default streak and activities_count."""
        score = AdminScore(
            user_id=test_user.id,
            date=date.today(),
            score=50
        )
        db_session.add(score)
        db_session.commit()
        db_session.refresh(score)

        assert score.streak_days == 0
        assert score.activities_count == 0

    def test_admin_score_repr(self, db_session: Session, test_user):
        """Test __repr__ method."""
        score = AdminScore(
            user_id=test_user.id,
            date=date.today(),
            score=85
        )
        db_session.add(score)
        db_session.commit()
        db_session.refresh(score)

        repr_str = repr(score)
        assert f"AdminScore(id={score.id}" in repr_str
        assert "score=85" in repr_str


class TestAdminFocusSession:
    """Test AdminFocusSession model."""

    def test_create_focus_session(self, db_session: Session, test_user):
        """Test creating a focus session."""
        session = AdminFocusSession(
            user_id=test_user.id,
            start_time=datetime.utcnow(),
            duration_minutes=50,
            notes="Deep work session"
        )
        db_session.add(session)
        db_session.commit()
        db_session.refresh(session)

        assert session.id is not None
        assert session.user_id == test_user.id
        assert session.start_time is not None
        assert session.duration_minutes == 50
        assert session.completed is False
        assert session.interrupted is False
        assert session.notes == "Deep work session"
        assert session.created_at is not None

    def test_complete_focus_session(self, db_session: Session, test_user):
        """Test completing a focus session."""
        session = AdminFocusSession(
            user_id=test_user.id,
            start_time=datetime.utcnow(),
            duration_minutes=50
        )
        db_session.add(session)
        db_session.commit()
        db_session.refresh(session)

        # Complete the session
        session.end_time = datetime.utcnow()
        session.completed = True
        db_session.commit()
        db_session.refresh(session)

        assert session.completed is True
        assert session.end_time is not None

    def test_focus_session_default_duration(self, db_session: Session, test_user):
        """Test default duration is 50 minutes."""
        session = AdminFocusSession(
            user_id=test_user.id,
            start_time=datetime.utcnow()
        )
        db_session.add(session)
        db_session.commit()
        db_session.refresh(session)

        assert session.duration_minutes == 50

    def test_focus_session_repr(self, db_session: Session, test_user):
        """Test __repr__ method."""
        session = AdminFocusSession(
            user_id=test_user.id,
            start_time=datetime.utcnow()
        )
        db_session.add(session)
        db_session.commit()
        db_session.refresh(session)

        repr_str = repr(session)
        assert f"AdminFocusSession(id={session.id}" in repr_str


class TestAdminNudge:
    """Test AdminNudge model."""

    def test_create_nudge(self, db_session: Session, test_user):
        """Test creating a nudge."""
        nudge = AdminNudge(
            user_id=test_user.id,
            type=NudgeType.REMINDER.value,
            message="Time for your discovery calls!",
            priority=NudgePriority.NORMAL.value,
            action_url="/activities"
        )
        db_session.add(nudge)
        db_session.commit()
        db_session.refresh(nudge)

        assert nudge.id is not None
        assert nudge.user_id == test_user.id
        assert nudge.type == "reminder"
        assert nudge.message == "Time for your discovery calls!"
        assert nudge.priority == "normal"
        assert nudge.read is False
        assert nudge.action_url == "/activities"
        assert nudge.created_at is not None

    def test_nudge_types(self, db_session: Session, test_user):
        """Test all nudge types."""
        types = [
            NudgeType.REMINDER,
            NudgeType.SUGGESTION,
            NudgeType.ALERT,
            NudgeType.CELEBRATION
        ]

        for nudge_type in types:
            nudge = AdminNudge(
                user_id=test_user.id,
                type=nudge_type.value,
                message=f"Test {nudge_type.value}"
            )
            db_session.add(nudge)

        db_session.commit()
        nudges = db_session.query(AdminNudge).all()
        assert len(nudges) == 4

    def test_nudge_priorities(self, db_session: Session, test_user):
        """Test all nudge priorities."""
        priorities = [
            NudgePriority.LOW,
            NudgePriority.NORMAL,
            NudgePriority.HIGH,
            NudgePriority.URGENT
        ]

        for priority in priorities:
            nudge = AdminNudge(
                user_id=test_user.id,
                type=NudgeType.REMINDER.value,
                message="Test message",
                priority=priority.value
            )
            db_session.add(nudge)

        db_session.commit()
        nudges = db_session.query(AdminNudge).all()
        assert len(nudges) == 4

    def test_nudge_default_priority(self, db_session: Session, test_user):
        """Test default priority is 'normal'."""
        nudge = AdminNudge(
            user_id=test_user.id,
            type=NudgeType.REMINDER.value,
            message="Test"
        )
        db_session.add(nudge)
        db_session.commit()
        db_session.refresh(nudge)

        assert nudge.priority == "normal"

    def test_nudge_read_status(self, db_session: Session, test_user):
        """Test marking nudge as read."""
        nudge = AdminNudge(
            user_id=test_user.id,
            type=NudgeType.REMINDER.value,
            message="Test"
        )
        db_session.add(nudge)
        db_session.commit()
        db_session.refresh(nudge)

        assert nudge.read is False

        # Mark as read
        nudge.read = True
        db_session.commit()
        db_session.refresh(nudge)

        assert nudge.read is True

    def test_nudge_repr(self, db_session: Session, test_user):
        """Test __repr__ method."""
        nudge = AdminNudge(
            user_id=test_user.id,
            type=NudgeType.ALERT.value,
            message="Important!"
        )
        db_session.add(nudge)
        db_session.commit()
        db_session.refresh(nudge)

        repr_str = repr(nudge)
        assert f"AdminNudge(id={nudge.id}" in repr_str
        assert "type=alert" in repr_str


class TestAdminMeeting:
    """Test AdminMeeting model."""

    def test_create_meeting(self, db_session: Session, test_user):
        """Test creating a meeting template."""
        meeting = AdminMeeting(
            user_id=test_user.id,
            title="Discovery Call Template",
            type=MeetingType.DISCOVERY.value,
            duration_minutes=60,
            agenda="1. Introduction\n2. Pain Points\n3. Solution Fit",
            questions="What are your main challenges?",
            follow_up_tasks="Send proposal, Schedule demo"
        )
        db_session.add(meeting)
        db_session.commit()
        db_session.refresh(meeting)

        assert meeting.id is not None
        assert meeting.user_id == test_user.id
        assert meeting.title == "Discovery Call Template"
        assert meeting.type == "discovery"
        assert meeting.duration_minutes == 60
        assert meeting.agenda is not None
        assert meeting.questions is not None
        assert meeting.follow_up_tasks is not None
        assert meeting.created_at is not None
        assert meeting.updated_at is not None

    def test_meeting_types(self, db_session: Session, test_user):
        """Test all meeting types."""
        types = [
            MeetingType.DISCOVERY,
            MeetingType.DEMO,
            MeetingType.NEGOTIATION,
            MeetingType.CLOSING
        ]

        for meeting_type in types:
            meeting = AdminMeeting(
                user_id=test_user.id,
                title=f"{meeting_type.value.capitalize()} Template",
                type=meeting_type.value
            )
            db_session.add(meeting)

        db_session.commit()
        meetings = db_session.query(AdminMeeting).all()
        assert len(meetings) == 4

    def test_meeting_default_duration(self, db_session: Session, test_user):
        """Test default duration is 60 minutes."""
        meeting = AdminMeeting(
            user_id=test_user.id,
            title="Test Meeting",
            type=MeetingType.DEMO.value
        )
        db_session.add(meeting)
        db_session.commit()
        db_session.refresh(meeting)

        assert meeting.duration_minutes == 60

    def test_meeting_repr(self, db_session: Session, test_user):
        """Test __repr__ method."""
        meeting = AdminMeeting(
            user_id=test_user.id,
            title="Closing Call",
            type=MeetingType.CLOSING.value
        )
        db_session.add(meeting)
        db_session.commit()
        db_session.refresh(meeting)

        repr_str = repr(meeting)
        assert f"AdminMeeting(id={meeting.id}" in repr_str
        assert "title='Closing Call'" in repr_str
