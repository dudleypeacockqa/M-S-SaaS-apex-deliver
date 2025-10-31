"""
Test Master Admin Portal Models (TDD - RED Phase)

This test file is written BEFORE implementing the models.
All tests should FAIL initially, then pass after implementation.

Test Coverage:
- AdminGoal model
- AdminActivity model  
- AdminScore model
- AdminFocusSession model
- AdminNudge model
- AdminMeeting model
"""
import pytest
from datetime import date, datetime, timedelta
from sqlalchemy.exc import IntegrityError

from app.models.master_admin import (
    AdminGoal,
    AdminActivity,
    AdminScore,
    AdminFocusSession,
    AdminNudge,
    AdminMeeting,
    ActivityType,
    ActivityStatus,
    NudgeType,
    NudgePriority,
    MeetingType
)


class TestAdminGoalModel:
    """Test AdminGoal model."""
    
    def test_create_admin_goal(self, db_session, test_user):
        """Test creating an admin goal."""
        goal = AdminGoal(
            user_id=test_user.id,
            week_start=date(2025, 11, 1),
            target_discoveries=10,
            target_emails=20,
            target_videos=5,
            target_calls=15
        )
        db_session.add(goal)
        db_session.commit()
        
        assert goal.id is not None
        assert goal.user_id == test_user.id
        assert goal.week_start == date(2025, 11, 1)
        assert goal.target_discoveries == 10
        assert goal.target_emails == 20
        assert goal.target_videos == 5
        assert goal.target_calls == 15
        assert goal.created_at is not None
        assert goal.updated_at is not None
    
    def test_admin_goal_unique_constraint(self, db_session, test_user):
        """Test that user can only have one goal per week."""
        goal1 = AdminGoal(
            user_id=test_user.id,
            week_start=date(2025, 11, 1),
            target_discoveries=10
        )
        db_session.add(goal1)
        db_session.commit()
        
        goal2 = AdminGoal(
            user_id=test_user.id,
            week_start=date(2025, 11, 1),
            target_discoveries=15
        )
        db_session.add(goal2)
        
        with pytest.raises(IntegrityError):
            db_session.commit()
    
    def test_admin_goal_defaults(self, db_session, test_user):
        """Test default values for admin goal."""
        goal = AdminGoal(
            user_id=test_user.id,
            week_start=date(2025, 11, 1)
        )
        db_session.add(goal)
        db_session.commit()
        
        assert goal.target_discoveries == 0
        assert goal.target_emails == 0
        assert goal.target_videos == 0
        assert goal.target_calls == 0
    
    def test_admin_goal_repr(self, db_session, test_user):
        """Test string representation of admin goal."""
        goal = AdminGoal(
            user_id=test_user.id,
            week_start=date(2025, 11, 1)
        )
        db_session.add(goal)
        db_session.commit()
        
        repr_str = repr(goal)
        assert "AdminGoal" in repr_str
        assert str(goal.id) in repr_str
        assert str(test_user.id) in repr_str


class TestAdminActivityModel:
    """Test AdminActivity model."""
    
    def test_create_admin_activity(self, db_session, test_user):
        """Test creating an admin activity."""
        activity = AdminActivity(
            user_id=test_user.id,
            type=ActivityType.DISCOVERY,
            status=ActivityStatus.DONE,
            date=date.today(),
            amount=2,
            notes="Called 2 prospects"
        )
        db_session.add(activity)
        db_session.commit()
        
        assert activity.id is not None
        assert activity.user_id == test_user.id
        assert activity.type == ActivityType.DISCOVERY
        assert activity.status == ActivityStatus.DONE
        assert activity.date == date.today()
        assert activity.amount == 2
        assert activity.notes == "Called 2 prospects"
        assert activity.created_at is not None
    
    def test_admin_activity_type_constraint(self, db_session, test_user):
        """Test activity type constraint."""
        activity = AdminActivity(
            user_id=test_user.id,
            type="invalid_type",  # Should fail constraint
            status=ActivityStatus.DONE,
            date=date.today()
        )
        db_session.add(activity)
        
        with pytest.raises(Exception):  # Should raise constraint error
            db_session.commit()
    
    def test_admin_activity_status_constraint(self, db_session, test_user):
        """Test activity status constraint."""
        activity = AdminActivity(
            user_id=test_user.id,
            type=ActivityType.EMAIL,
            status="invalid_status",  # Should fail constraint
            date=date.today()
        )
        db_session.add(activity)
        
        with pytest.raises(Exception):  # Should raise constraint error
            db_session.commit()
    
    def test_admin_activity_default_amount(self, db_session, test_user):
        """Test default amount is 1."""
        activity = AdminActivity(
            user_id=test_user.id,
            type=ActivityType.VIDEO,
            status=ActivityStatus.DONE,
            date=date.today()
        )
        db_session.add(activity)
        db_session.commit()
        
        assert activity.amount == 1
    
    def test_admin_activity_with_prospect(self, db_session, test_user, test_prospect):
        """Test activity linked to prospect."""
        activity = AdminActivity(
            user_id=test_user.id,
            type=ActivityType.CALL,
            status=ActivityStatus.DONE,
            date=date.today(),
            prospect_id=test_prospect.id
        )
        db_session.add(activity)
        db_session.commit()
        
        assert activity.prospect_id == test_prospect.id
        assert activity.prospect is not None


class TestAdminScoreModel:
    """Test AdminScore model."""
    
    def test_create_admin_score(self, db_session, test_user):
        """Test creating an admin score."""
        score = AdminScore(
            user_id=test_user.id,
            date=date.today(),
            score=75,
            streak_days=5,
            activities_count=8
        )
        db_session.add(score)
        db_session.commit()
        
        assert score.id is not None
        assert score.user_id == test_user.id
        assert score.date == date.today()
        assert score.score == 75
        assert score.streak_days == 5
        assert score.activities_count == 8
    
    def test_admin_score_range_constraint(self, db_session, test_user):
        """Test score must be between 0 and 100."""
        score = AdminScore(
            user_id=test_user.id,
            date=date.today(),
            score=150  # Should fail constraint
        )
        db_session.add(score)
        
        with pytest.raises(Exception):  # Should raise constraint error
            db_session.commit()
    
    def test_admin_score_unique_constraint(self, db_session, test_user):
        """Test user can only have one score per date."""
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
            score=75
        )
        db_session.add(score2)
        
        with pytest.raises(IntegrityError):
            db_session.commit()
    
    def test_admin_score_defaults(self, db_session, test_user):
        """Test default values for admin score."""
        score = AdminScore(
            user_id=test_user.id,
            date=date.today(),
            score=50
        )
        db_session.add(score)
        db_session.commit()
        
        assert score.streak_days == 0
        assert score.activities_count == 0


class TestAdminFocusSessionModel:
    """Test AdminFocusSession model."""
    
    def test_create_focus_session(self, db_session, test_user):
        """Test creating a focus session."""
        session = AdminFocusSession(
            user_id=test_user.id,
            start_time=datetime.utcnow(),
            duration_minutes=50
        )
        db_session.add(session)
        db_session.commit()
        
        assert session.id is not None
        assert session.user_id == test_user.id
        assert session.start_time is not None
        assert session.duration_minutes == 50
        assert session.completed is False
        assert session.interrupted is False
    
    def test_complete_focus_session(self, db_session, test_user):
        """Test completing a focus session."""
        start = datetime.utcnow()
        session = AdminFocusSession(
            user_id=test_user.id,
            start_time=start,
            duration_minutes=50
        )
        db_session.add(session)
        db_session.commit()
        
        # Complete the session
        session.completed = True
        session.end_time = start + timedelta(minutes=50)
        db_session.commit()
        
        assert session.completed is True
        assert session.end_time is not None
        assert (session.end_time - session.start_time).total_seconds() == 3000  # 50 minutes
    
    def test_interrupted_focus_session(self, db_session, test_user):
        """Test interrupted focus session."""
        session = AdminFocusSession(
            user_id=test_user.id,
            start_time=datetime.utcnow(),
            interrupted=True,
            notes="Phone call interrupted"
        )
        db_session.add(session)
        db_session.commit()
        
        assert session.interrupted is True
        assert session.notes == "Phone call interrupted"


class TestAdminNudgeModel:
    """Test AdminNudge model."""
    
    def test_create_nudge(self, db_session, test_user):
        """Test creating a nudge."""
        nudge = AdminNudge(
            user_id=test_user.id,
            type=NudgeType.REMINDER,
            message="Time to log your activities!",
            priority=NudgePriority.NORMAL
        )
        db_session.add(nudge)
        db_session.commit()
        
        assert nudge.id is not None
        assert nudge.user_id == test_user.id
        assert nudge.type == NudgeType.REMINDER
        assert nudge.message == "Time to log your activities!"
        assert nudge.priority == NudgePriority.NORMAL
        assert nudge.read is False
    
    def test_nudge_type_constraint(self, db_session, test_user):
        """Test nudge type constraint."""
        nudge = AdminNudge(
            user_id=test_user.id,
            type="invalid_type",  # Should fail constraint
            message="Test message"
        )
        db_session.add(nudge)
        
        with pytest.raises(Exception):  # Should raise constraint error
            db_session.commit()
    
    def test_nudge_priority_constraint(self, db_session, test_user):
        """Test nudge priority constraint."""
        nudge = AdminNudge(
            user_id=test_user.id,
            type=NudgeType.ALERT,
            message="Test message",
            priority="invalid_priority"  # Should fail constraint
        )
        db_session.add(nudge)
        
        with pytest.raises(Exception):  # Should raise constraint error
            db_session.commit()
    
    def test_mark_nudge_as_read(self, db_session, test_user):
        """Test marking nudge as read."""
        nudge = AdminNudge(
            user_id=test_user.id,
            type=NudgeType.SUGGESTION,
            message="Try focusing on discovery calls today"
        )
        db_session.add(nudge)
        db_session.commit()
        
        assert nudge.read is False
        
        # Mark as read
        nudge.read = True
        db_session.commit()
        
        assert nudge.read is True


class TestAdminMeetingModel:
    """Test AdminMeeting model."""
    
    def test_create_meeting_template(self, db_session, test_user):
        """Test creating a meeting template."""
        meeting = AdminMeeting(
            user_id=test_user.id,
            title="Discovery Call Template",
            type=MeetingType.DISCOVERY,
            duration_minutes=60,
            agenda="1. Introduction\n2. Pain points\n3. Solution overview",
            questions="What are your biggest challenges?"
        )
        db_session.add(meeting)
        db_session.commit()
        
        assert meeting.id is not None
        assert meeting.user_id == test_user.id
        assert meeting.title == "Discovery Call Template"
        assert meeting.type == MeetingType.DISCOVERY
        assert meeting.duration_minutes == 60
        assert meeting.agenda is not None
        assert meeting.questions is not None
    
    def test_meeting_type_constraint(self, db_session, test_user):
        """Test meeting type constraint."""
        meeting = AdminMeeting(
            user_id=test_user.id,
            title="Test Meeting",
            type="invalid_type",  # Should fail constraint
            duration_minutes=30
        )
        db_session.add(meeting)
        
        with pytest.raises(Exception):  # Should raise constraint error
            db_session.commit()
    
    def test_meeting_default_duration(self, db_session, test_user):
        """Test default meeting duration is 60 minutes."""
        meeting = AdminMeeting(
            user_id=test_user.id,
            title="Test Meeting",
            type=MeetingType.DEMO
        )
        db_session.add(meeting)
        db_session.commit()
        
        assert meeting.duration_minutes == 60


# Fixtures for testing (will be defined in conftest.py)
@pytest.fixture
def test_prospect(db_session, test_user):
    """Create a test prospect for activity linking."""
    from app.models.master_admin import AdminProspect
    
    prospect = AdminProspect(
        user_id=test_user.id,
        name="Test Prospect",
        email="prospect@example.com",
        company="Test Company"
    )
    db_session.add(prospect)
    db_session.commit()
    return prospect
