"""
Tests for campaign_tasks.py Celery tasks.

Following TDD principles: RED → GREEN → REFACTOR
Target: Comprehensive coverage of campaign execution and email sending.
"""

from __future__ import annotations

import importlib
import sys
from unittest.mock import Mock, patch, MagicMock
from datetime import datetime, timezone
import pytest
import asyncio

# Ensure Celery's shared_task decorator becomes a no-op for these unit tests
celery_module = sys.modules.get("celery")
if celery_module is not None:
    celery_module.shared_task.side_effect = (
        lambda func=None, **kwargs: func if func is not None else (lambda f: f)
    )

campaign_tasks = importlib.reload(importlib.import_module("app.tasks.campaign_tasks"))

from app.models.master_admin import AdminCampaign
from app.models.enums import CampaignStatus
from app.models.user import User


@pytest.fixture
def mock_db_session():
    """Mock database session."""
    session = Mock()
    session.close = Mock()
    session.execute = Mock()
    return session


@pytest.fixture
def sample_user():
    """Create a sample user for testing."""
    user = Mock(spec=User)
    user.id = "user-123"
    user.email = "test@example.com"
    user.first_name = "Test"
    user.last_name = "User"
    return user


@pytest.fixture
def sample_campaign():
    """Create a sample campaign for testing."""
    campaign = Mock(spec=AdminCampaign)
    campaign.id = 1
    campaign.user_id = "user-123"
    campaign.status = CampaignStatus.SCHEDULED
    campaign.schedule_at = datetime.now(timezone.utc)
    return campaign


class TestExecuteCampaignTask:
    """Test execute_campaign_task function."""

    @patch('app.tasks.campaign_tasks.SessionLocal')
    @patch('app.tasks.campaign_tasks.campaign_service.execute_campaign')
    def test_execute_campaign_success(self, mock_execute_campaign, mock_session_local, mock_db_session, sample_user):
        """Test successful campaign execution."""
        mock_session_local.return_value = mock_db_session
        mock_result = Mock()
        mock_result.scalar_one_or_none.return_value = sample_user
        mock_db_session.execute.return_value = mock_result
        mock_execute_campaign.return_value = {"status": "success", "sent": 10}

        result = campaign_tasks.execute_campaign_task(campaign_id=1, user_id="user-123")

        assert result["status"] == "success"
        mock_execute_campaign.assert_called_once_with(1, sample_user, mock_db_session)
        mock_db_session.close.assert_called_once()

    @patch('app.tasks.campaign_tasks.SessionLocal')
    def test_execute_campaign_user_not_found(self, mock_session_local, mock_db_session):
        """Test campaign execution when user not found."""
        mock_session_local.return_value = mock_db_session
        mock_result = Mock()
        mock_result.scalar_one_or_none.return_value = None
        mock_db_session.execute.return_value = mock_result

        with pytest.raises(ValueError, match="User user-123 not found"):
            campaign_tasks.execute_campaign_task(campaign_id=1, user_id="user-123")

        mock_db_session.close.assert_called_once()


class TestQueueCampaignEmailTask:
    """Test queue_campaign_email_task function."""

    @patch('app.tasks.campaign_tasks.SessionLocal')
    @patch('app.tasks.campaign_tasks.asyncio.run')
    @patch('app.tasks.campaign_tasks.queue_email')
    def test_queue_campaign_email_success(self, mock_queue_email, mock_asyncio_run, mock_session_local, mock_db_session):
        """Test successful email queueing."""
        mock_session_local.return_value = mock_db_session
        mock_asyncio_run.return_value = {"status": "queued", "email_id": "email-123"}

        result = campaign_tasks.queue_campaign_email_task(
            to_email="test@example.com",
            subject="Test Subject",
            content="<p>Test Content</p>",
            template_data={"name": "Test User"}
        )

        assert result["status"] == "queued"
        mock_asyncio_run.assert_called_once()
        mock_db_session.close.assert_called_once()

    @patch('app.tasks.campaign_tasks.SessionLocal')
    @patch('app.tasks.campaign_tasks.asyncio.run')
    def test_queue_campaign_email_exception(self, mock_asyncio_run, mock_session_local, mock_db_session):
        """Test email queueing with exception."""
        mock_session_local.return_value = mock_db_session
        mock_asyncio_run.side_effect = Exception("Email service unavailable")

        result = campaign_tasks.queue_campaign_email_task(
            to_email="test@example.com",
            subject="Test Subject",
            content="<p>Test Content</p>",
            template_data={}
        )

        assert result["status"] == "failed"
        assert "error" in result
        mock_db_session.close.assert_called_once()


class TestSendEmailBatchTask:
    """Test send_email_batch_task function."""

    @patch('app.tasks.campaign_tasks.asyncio.run')
    @patch('app.tasks.campaign_tasks.send_email')
    def test_send_email_batch_success(self, mock_send_email, mock_asyncio_run):
        """Test successful batch email sending."""
        mock_asyncio_run.side_effect = [
            {"status": "sent"},
            {"status": "sent"},
            {"status": "sent"}
        ]

        emails = [
            {"to": "user1@example.com", "subject": "Test 1", "html_content": "<p>Content 1</p>"},
            {"to": "user2@example.com", "subject": "Test 2", "html_content": "<p>Content 2</p>"},
            {"to": "user3@example.com", "subject": "Test 3", "html_content": "<p>Content 3</p>"}
        ]

        result = campaign_tasks.send_email_batch_task(emails)

        assert result["sent_count"] == 3
        assert result["total"] == 3
        assert len(result["failures"]) == 0
        assert mock_asyncio_run.call_count == 3

    @patch('app.tasks.campaign_tasks.asyncio.run')
    def test_send_email_batch_partial_failure(self, mock_asyncio_run):
        """Test batch email sending with partial failures."""
        mock_asyncio_run.side_effect = [
            {"status": "sent"},
            Exception("SMTP error"),
            {"status": "sent"}
        ]

        emails = [
            {"to": "user1@example.com", "subject": "Test 1", "html_content": "<p>Content 1</p>"},
            {"to": "user2@example.com", "subject": "Test 2", "html_content": "<p>Content 2</p>"},
            {"to": "user3@example.com", "subject": "Test 3", "html_content": "<p>Content 3</p>"}
        ]

        result = campaign_tasks.send_email_batch_task(emails)

        assert result["sent_count"] == 2
        assert result["total"] == 3
        assert len(result["failures"]) == 1
        assert "user2@example.com" in result["failures"][0]

    @patch('app.tasks.campaign_tasks.asyncio.run')
    @patch('app.tasks.campaign_tasks.render_template')
    def test_send_email_batch_with_template(self, mock_render_template, mock_asyncio_run):
        """Test batch email sending with template rendering."""
        mock_render_template.return_value = {"html_content": "<p>Rendered</p>", "text_content": "Rendered"}
        mock_asyncio_run.side_effect = [
            {"status": "sent"},
            {"status": "sent"}
        ]

        emails = [
            {"to": "user1@example.com", "subject": "Test 1", "template_name": "test_template", "template_data": {"name": "User 1"}},
            {"to": "user2@example.com", "subject": "Test 2", "template_name": "test_template", "template_data": {"name": "User 2"}}
        ]

        result = campaign_tasks.send_email_batch_task(emails)

        assert result["sent_count"] == 2
        assert mock_asyncio_run.call_count == 2


class TestUpdateCampaignAnalyticsTask:
    """Test update_campaign_analytics_task function."""

    @patch('app.tasks.campaign_tasks.SessionLocal')
    @patch('app.tasks.campaign_tasks.campaign_service.get_campaign_analytics')
    def test_update_campaign_analytics_success(self, mock_get_analytics, mock_session_local, mock_db_session):
        """Test successful campaign analytics update."""
        mock_session_local.return_value = mock_db_session
        mock_get_analytics.return_value = {
            "campaign_id": 1,
            "sent": 100,
            "opened": 50,
            "clicked": 25,
            "converted": 5
        }

        result = campaign_tasks.update_campaign_analytics_task(campaign_id=1)

        assert result["campaign_id"] == 1
        assert result["sent"] == 100
        mock_get_analytics.assert_called_once_with(1, mock_db_session)
        mock_db_session.close.assert_called_once()


class TestProcessScheduledCampaignsTask:
    """Test process_scheduled_campaigns_task function."""

    @patch('app.tasks.campaign_tasks.SessionLocal')
    @patch('app.tasks.campaign_tasks.campaign_service.execute_campaign')
    def test_process_scheduled_campaigns_success(self, mock_execute_campaign, mock_session_local, mock_db_session, sample_user, sample_campaign):
        """Test processing scheduled campaigns."""
        mock_session_local.return_value = mock_db_session
        
        # Mock campaign query
        mock_campaign_result = Mock()
        mock_campaign_result.scalars.return_value.all.return_value = [sample_campaign]
        
        # Mock user query
        mock_user_result = Mock()
        mock_user_result.scalar_one_or_none.return_value = sample_user
        
        mock_db_session.execute.side_effect = [mock_campaign_result, mock_user_result]
        mock_execute_campaign.return_value = {"status": "success"}

        result = campaign_tasks.process_scheduled_campaigns_task()

        assert result["executed_count"] == 1
        assert result["campaign_ids"] == [1]
        mock_execute_campaign.assert_called_once_with(1, sample_user, mock_db_session)
        mock_db_session.close.assert_called_once()

    @patch('app.tasks.campaign_tasks.SessionLocal')
    def test_process_scheduled_campaigns_none_scheduled(self, mock_session_local, mock_db_session):
        """Test when no campaigns are scheduled."""
        mock_session_local.return_value = mock_db_session
        mock_result = Mock()
        mock_result.scalars.return_value.all.return_value = []
        mock_db_session.execute.return_value = mock_result

        result = campaign_tasks.process_scheduled_campaigns_task()

        assert result["executed_count"] == 0
        assert result["campaign_ids"] == []
        mock_db_session.close.assert_called_once()

    @patch('app.tasks.campaign_tasks.SessionLocal')
    @patch('app.tasks.campaign_tasks.campaign_service.execute_campaign')
    def test_process_scheduled_campaigns_user_not_found(self, mock_execute_campaign, mock_session_local, mock_db_session, sample_campaign):
        """Test processing when user not found."""
        mock_session_local.return_value = mock_db_session
        
        mock_campaign_result = Mock()
        mock_campaign_result.scalars.return_value.all.return_value = [sample_campaign]
        mock_user_result = Mock()
        mock_user_result.scalar_one_or_none.return_value = None
        
        mock_db_session.execute.side_effect = [mock_campaign_result, mock_user_result]

        result = campaign_tasks.process_scheduled_campaigns_task()

        assert result["executed_count"] == 0
        mock_execute_campaign.assert_not_called()
        mock_db_session.close.assert_called_once()

    @patch('app.tasks.campaign_tasks.SessionLocal')
    @patch('app.tasks.campaign_tasks.campaign_service.execute_campaign')
    def test_process_scheduled_campaigns_execution_error(self, mock_execute_campaign, mock_session_local, mock_db_session, sample_user, sample_campaign):
        """Test handling execution errors."""
        mock_session_local.return_value = mock_db_session
        
        mock_campaign_result = Mock()
        mock_campaign_result.scalars.return_value.all.return_value = [sample_campaign]
        mock_user_result = Mock()
        mock_user_result.scalar_one_or_none.return_value = sample_user
        
        mock_db_session.execute.side_effect = [mock_campaign_result, mock_user_result]
        mock_execute_campaign.side_effect = Exception("Campaign execution failed")

        result = campaign_tasks.process_scheduled_campaigns_task()

        assert result["executed_count"] == 0
        assert result["campaign_ids"] == []
        mock_db_session.close.assert_called_once()

