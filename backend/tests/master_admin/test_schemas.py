"""Tests for Master Admin Portal Pydantic schemas."""
from datetime import date, datetime
from decimal import Decimal

import pytest
from pydantic import ValidationError

from app.models.enums import (
    ActivityType,
    ActivityStatus,
    NudgeType,
    NudgePriority,
    MeetingType,
    ProspectStatus,
    AdminDealStage,
    CampaignType,
    CampaignStatus,
    ContentType,
    ContentStatus,
)
from app.schemas.master_admin import (
    AdminGoalCreate,
    AdminGoalUpdate,
    AdminGoalResponse,
    AdminActivityCreate,
    AdminActivityUpdate,
    AdminActivityResponse,
    AdminScoreCreate,
    AdminScoreUpdate,
    AdminScoreResponse,
    AdminFocusSessionCreate,
    AdminFocusSessionUpdate,
    AdminFocusSessionResponse,
    AdminNudgeCreate,
    AdminNudgeUpdate,
    AdminNudgeResponse,
    AdminMeetingCreate,
    AdminMeetingUpdate,
    AdminMeetingResponse,
)


class TestAdminGoalSchemas:
    """Test AdminGoal schema validation."""

    def test_goal_create_valid(self):
        """Test creating a valid goal."""
        goal = AdminGoalCreate(
            week_start=date(2025, 11, 1),
            target_discoveries=10,
            target_emails=20,
            target_videos=5,
            target_calls=3,
        )
        assert goal.week_start == date(2025, 11, 1)
        assert goal.target_discoveries == 10
        assert goal.target_emails == 20
        assert goal.target_videos == 5
        assert goal.target_calls == 3

    def test_goal_create_defaults(self):
        """Test goal creation with default values."""
        goal = AdminGoalCreate(week_start=date(2025, 11, 1))
        assert goal.target_discoveries == 0
        assert goal.target_emails == 0
        assert goal.target_videos == 0
        assert goal.target_calls == 0

    def test_goal_create_negative_targets(self):
        """Test that negative target values are rejected."""
        with pytest.raises(ValidationError) as exc_info:
            AdminGoalCreate(
                week_start=date(2025, 11, 1),
                target_discoveries=-1,
            )
        assert "greater than or equal to 0" in str(exc_info.value)

    def test_goal_update_partial(self):
        """Test partial goal updates."""
        update = AdminGoalUpdate(target_discoveries=15)
        assert update.target_discoveries == 15
        assert update.target_emails is None

    def test_goal_response_from_dict(self):
        """Test creating response from dictionary."""
        data = {
            "id": 1,
            "user_id": "user-123",
            "week_start": date(2025, 11, 1),
            "target_discoveries": 10,
            "target_emails": 20,
            "target_videos": 5,
            "target_calls": 3,
            "created_at": datetime(2025, 11, 1, 10, 0, 0),
            "updated_at": datetime(2025, 11, 1, 10, 0, 0),
        }
        response = AdminGoalResponse(**data)
        assert response.id == 1
        assert response.user_id == "user-123"


class TestAdminActivitySchemas:
    """Test AdminActivity schema validation."""

    def test_activity_create_valid(self):
        """Test creating a valid activity."""
        activity = AdminActivityCreate(
            activity_type=ActivityType.DISCOVERY,
            status=ActivityStatus.DONE,
            date=date(2025, 11, 1),
            amount=2,
            notes="Found 2 prospects",
        )
        assert activity.activity_type == ActivityType.DISCOVERY
        assert activity.status == ActivityStatus.DONE
        assert activity.amount == 2

    def test_activity_create_type_alias(self):
        """Test activity creation with 'type' field alias."""
        activity = AdminActivityCreate(
            type=ActivityType.EMAIL,
            status=ActivityStatus.PENDING,
            date=date(2025, 11, 1),
        )
        assert activity.activity_type == ActivityType.EMAIL

    def test_activity_create_default_amount(self):
        """Test default amount is 1."""
        activity = AdminActivityCreate(
            activity_type=ActivityType.CALL,
            status=ActivityStatus.DONE,
            date=date(2025, 11, 1),
        )
        assert activity.amount == 1

    def test_activity_create_invalid_amount(self):
        """Test that amount < 1 is rejected."""
        with pytest.raises(ValidationError) as exc_info:
            AdminActivityCreate(
                activity_type=ActivityType.VIDEO,
                status=ActivityStatus.DONE,
                date=date(2025, 11, 1),
                amount=0,
            )
        assert "greater than or equal to 1" in str(exc_info.value)

    def test_activity_update_partial(self):
        """Test partial activity updates."""
        update = AdminActivityUpdate(status=ActivityStatus.DONE, notes="Completed")
        assert update.status == ActivityStatus.DONE
        assert update.notes == "Completed"
        assert update.activity_type is None

    def test_activity_response_serialization(self):
        """Test activity response serialization."""
        data = {
            "id": 1,
            "user_id": "user-123",
            "activity_type": ActivityType.DISCOVERY,
            "status": ActivityStatus.DONE,
            "date": date(2025, 11, 1),
            "amount": 2,
            "notes": "Test notes",
            "prospect_id": None,
            "created_at": datetime(2025, 11, 1, 10, 0, 0),
            "updated_at": datetime(2025, 11, 1, 10, 0, 0),
        }
        response = AdminActivityResponse(**data)
        # Verify serialization_alias works for 'type' field
        assert response.activity_type == ActivityType.DISCOVERY


class TestAdminScoreSchemas:
    """Test AdminScore schema validation."""

    def test_score_create_valid(self):
        """Test creating a valid score."""
        score = AdminScoreCreate(
            date=date(2025, 11, 1),
            score=85,
            streak_days=5,
            activities_count=10,
        )
        assert score.score == 85
        assert score.streak_days == 5
        assert score.activities_count == 10

    def test_score_create_boundaries(self):
        """Test score boundaries (0-100)."""
        # Valid boundaries
        AdminScoreCreate(date=date(2025, 11, 1), score=0)
        AdminScoreCreate(date=date(2025, 11, 1), score=100)

        # Invalid boundaries
        with pytest.raises(ValidationError):
            AdminScoreCreate(date=date(2025, 11, 1), score=-1)

        with pytest.raises(ValidationError):
            AdminScoreCreate(date=date(2025, 11, 1), score=101)

    def test_score_create_defaults(self):
        """Test score creation with defaults."""
        score = AdminScoreCreate(date=date(2025, 11, 1), score=50)
        assert score.streak_days == 0
        assert score.activities_count == 0

    def test_score_update_partial(self):
        """Test partial score updates."""
        update = AdminScoreUpdate(score=90, streak_days=6)
        assert update.score == 90
        assert update.streak_days == 6
        assert update.activities_count is None


class TestAdminFocusSessionSchemas:
    """Test AdminFocusSession schema validation."""

    def test_focus_session_create_valid(self):
        """Test creating a valid focus session."""
        start = datetime(2025, 11, 1, 10, 0, 0)
        session = AdminFocusSessionCreate(
            start_time=start,
            duration_minutes=50,
            notes="Deep work session",
        )
        assert session.start_time == start
        assert session.duration_minutes == 50
        assert session.notes == "Deep work session"

    def test_focus_session_create_default_duration(self):
        """Test default duration is 50 minutes."""
        start = datetime(2025, 11, 1, 10, 0, 0)
        session = AdminFocusSessionCreate(start_time=start)
        assert session.duration_minutes == 50

    def test_focus_session_create_invalid_duration(self):
        """Test that duration < 1 is rejected."""
        with pytest.raises(ValidationError):
            AdminFocusSessionCreate(
                start_time=datetime(2025, 11, 1, 10, 0, 0),
                duration_minutes=0,
            )

    def test_focus_session_update_completion(self):
        """Test updating focus session completion status."""
        end = datetime(2025, 11, 1, 10, 50, 0)
        update = AdminFocusSessionUpdate(
            end_time=end,
            completed=True,
            interrupted=False,
        )
        assert update.end_time == end
        assert update.completed is True
        assert update.interrupted is False

    def test_focus_session_response(self):
        """Test focus session response."""
        data = {
            "id": 1,
            "user_id": "user-123",
            "start_time": datetime(2025, 11, 1, 10, 0, 0),
            "end_time": datetime(2025, 11, 1, 10, 50, 0),
            "duration_minutes": 50,
            "completed": True,
            "interrupted": False,
            "notes": "Productive session",
            "created_at": datetime(2025, 11, 1, 10, 0, 0),
        }
        response = AdminFocusSessionResponse(**data)
        assert response.completed is True


class TestAdminNudgeSchemas:
    """Test AdminNudge schema validation."""

    def test_nudge_create_valid(self):
        """Test creating a valid nudge."""
        nudge = AdminNudgeCreate(
            nudge_type=NudgeType.REMINDER,
            message="Time to follow up with leads",
            priority=NudgePriority.HIGH,
            action_url="/admin/activities",
        )
        assert nudge.nudge_type == NudgeType.REMINDER
        assert nudge.message == "Time to follow up with leads"
        assert nudge.priority == NudgePriority.HIGH

    def test_nudge_create_type_alias(self):
        """Test nudge creation with 'type' field alias."""
        nudge = AdminNudgeCreate(
            type=NudgeType.SUGGESTION,
            message="Consider creating content today",
        )
        assert nudge.nudge_type == NudgeType.SUGGESTION

    def test_nudge_create_default_priority(self):
        """Test default priority is NORMAL."""
        nudge = AdminNudgeCreate(
            nudge_type=NudgeType.ALERT,
            message="System notification",
        )
        assert nudge.priority == NudgePriority.NORMAL

    def test_nudge_create_empty_message(self):
        """Test that empty message is rejected."""
        with pytest.raises(ValidationError):
            AdminNudgeCreate(
                nudge_type=NudgeType.REMINDER,
                message="",
            )

    def test_nudge_update_read_status(self):
        """Test updating nudge read status."""
        update = AdminNudgeUpdate(read=True)
        assert update.read is True

    def test_nudge_response_expiration(self):
        """Test nudge response with expiration."""
        expires = datetime(2025, 11, 2, 0, 0, 0)
        data = {
            "id": 1,
            "user_id": "user-123",
            "nudge_type": NudgeType.CELEBRATION,
            "message": "5-day streak achieved!",
            "priority": NudgePriority.LOW,
            "read": False,
            "action_url": None,
            "expires_at": expires,
            "created_at": datetime(2025, 11, 1, 10, 0, 0),
        }
        response = AdminNudgeResponse(**data)
        assert response.expires_at == expires


class TestAdminMeetingSchemas:
    """Test AdminMeeting schema validation."""

    def test_meeting_create_valid(self):
        """Test creating a valid meeting template."""
        meeting = AdminMeetingCreate(
            title="Discovery Call Template",
            meeting_type=MeetingType.DISCOVERY,
            duration_minutes=30,
            agenda="Introduction, pain points, solution overview",
            questions="What's your biggest challenge?",
        )
        assert meeting.title == "Discovery Call Template"
        assert meeting.meeting_type == MeetingType.DISCOVERY
        assert meeting.duration_minutes == 30

    def test_meeting_create_type_alias(self):
        """Test meeting creation with 'type' field alias."""
        meeting = AdminMeetingCreate(
            title="Demo Meeting",
            type=MeetingType.DEMO,
        )
        assert meeting.meeting_type == MeetingType.DEMO

    def test_meeting_create_default_duration(self):
        """Test default duration is 60 minutes."""
        meeting = AdminMeetingCreate(
            title="Generic Meeting",
            meeting_type=MeetingType.NEGOTIATION,
        )
        assert meeting.duration_minutes == 60

    def test_meeting_create_invalid_title(self):
        """Test that empty title is rejected."""
        with pytest.raises(ValidationError):
            AdminMeetingCreate(
                title="",
                meeting_type=MeetingType.CLOSING,
            )

    def test_meeting_create_long_title(self):
        """Test that title > 255 chars is rejected."""
        with pytest.raises(ValidationError):
            AdminMeetingCreate(
                title="A" * 256,
                meeting_type=MeetingType.DISCOVERY,
            )

    def test_meeting_update_partial(self):
        """Test partial meeting updates."""
        update = AdminMeetingUpdate(
            agenda="Updated agenda",
            questions="Updated questions",
        )
        assert update.agenda == "Updated agenda"
        assert update.questions == "Updated questions"
        assert update.title is None
        assert update.meeting_type is None

    def test_meeting_response(self):
        """Test meeting template response."""
        data = {
            "id": 1,
            "user_id": "user-123",
            "title": "Closing Call",
            "meeting_type": MeetingType.CLOSING,
            "duration_minutes": 45,
            "agenda": "Review terms, address objections, close",
            "questions": None,
            "follow_up_tasks": "Send contract, schedule kickoff",
            "created_at": datetime(2025, 11, 1, 10, 0, 0),
            "updated_at": datetime(2025, 11, 1, 10, 0, 0),
        }
        response = AdminMeetingResponse(**data)
        assert response.title == "Closing Call"
        assert response.follow_up_tasks == "Send contract, schedule kickoff"


class TestSchemaValidationEdgeCases:
    """Test edge cases and validation rules across all schemas."""

    def test_date_field_validation(self):
        """Test date field accepts datetime.date objects."""
        goal = AdminGoalCreate(week_start=date.today())
        assert isinstance(goal.week_start, date)

    def test_datetime_field_validation(self):
        """Test datetime field accepts datetime objects."""
        session = AdminFocusSessionCreate(
            start_time=datetime.now(),
        )
        assert isinstance(session.start_time, datetime)

    def test_enum_validation(self):
        """Test that invalid enum values are rejected."""
        with pytest.raises(ValidationError):
            AdminActivityCreate(
                activity_type="invalid_type",
                status=ActivityStatus.DONE,
                date=date.today(),
            )

    def test_optional_fields_as_none(self):
        """Test that optional fields can be None."""
        activity = AdminActivityCreate(
            activity_type=ActivityType.EMAIL,
            status=ActivityStatus.PENDING,
            date=date.today(),
            notes=None,
            prospect_id=None,
        )
        assert activity.notes is None
        assert activity.prospect_id is None

    def test_model_config_from_attributes(self):
        """Test that response schemas support from_attributes."""
        # Create a mock ORM object
        class MockGoal:
            id = 1
            user_id = "user-123"
            week_start = date(2025, 11, 1)
            target_discoveries = 10
            target_emails = 20
            target_videos = 5
            target_calls = 3
            created_at = datetime(2025, 11, 1, 10, 0, 0)
            updated_at = datetime(2025, 11, 1, 10, 0, 0)

        # Should work with from_attributes=True
        response = AdminGoalResponse.model_validate(MockGoal())
        assert response.id == 1
        assert response.target_discoveries == 10
