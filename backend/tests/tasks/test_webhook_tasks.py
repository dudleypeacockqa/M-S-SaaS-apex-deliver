"""
Tests for webhook_tasks.py Celery tasks.

Following TDD principles: RED → GREEN → REFACTOR
Target: Comprehensive coverage of webhook delivery and retry logic.
"""

from __future__ import annotations

import importlib
import sys
from unittest.mock import Mock, patch, MagicMock
from datetime import datetime, timedelta, timezone
import pytest
import requests

# Ensure Celery's shared_task decorator becomes a no-op for these unit tests
celery_module = sys.modules.get("celery")
if celery_module is not None:
    celery_module.shared_task.side_effect = (
        lambda func=None, **kwargs: func if func is not None else (lambda f: f)
    )

webhook_tasks = importlib.reload(importlib.import_module("app.tasks.webhook_tasks"))

from app.models.master_admin import Webhook, WebhookDelivery


@pytest.fixture
def mock_db_session():
    """Mock database session."""
    session = Mock()
    session.close = Mock()
    return session


@pytest.fixture
def sample_webhook():
    """Create a sample webhook for testing."""
    webhook = Mock(spec=Webhook)
    webhook.id = 1
    webhook.organization_id = "org-123"
    webhook.url = "https://example.com/webhook"
    webhook.is_active = True
    webhook.events = ["deal.created", "deal.updated"]
    webhook.headers = {"X-Custom-Header": "value"}
    webhook.secret_key = "secret-123"
    return webhook


@pytest.fixture
def sample_webhook_delivery():
    """Create a sample webhook delivery for testing."""
    delivery = Mock(spec=WebhookDelivery)
    delivery.id = 1
    delivery.webhook_id = 1
    delivery.organization_id = "org-123"
    delivery.event_type = "deal.created"
    delivery.payload = {"deal_id": "deal-123"}
    delivery.delivered_at = None
    delivery.retry_count = 0
    delivery.next_retry_at = None
    delivery.response_status = None
    delivery.response_body = None
    delivery.response_headers = None
    delivery.error_message = None
    return delivery


class TestDeliverWebhookTask:
    """Test deliver_webhook_task function."""

    @patch('app.tasks.webhook_tasks.SessionLocal')
    @patch('app.tasks.webhook_tasks.requests.post')
    def test_deliver_webhook_success(self, mock_post, mock_session_local, mock_db_session, sample_webhook):
        """Test successful webhook delivery."""
        # Setup mocks
        mock_session_local.return_value = mock_db_session
        # Create a real WebhookDelivery instance for the add() call
        from app.models.master_admin import WebhookDelivery
        delivery_instance = WebhookDelivery()
        mock_db_session.add = Mock()
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.text = "OK"
        mock_response.headers = {"Content-Type": "application/json"}
        mock_post.return_value = mock_response

        # Mock database query
        mock_result = Mock()
        mock_result.scalar_one_or_none.return_value = sample_webhook
        mock_db_session.execute.return_value = mock_result
        mock_db_session.add = Mock()
        mock_db_session.commit = Mock()
        mock_db_session.refresh = Mock()

        # Execute task
        result = webhook_tasks.deliver_webhook_task(
            webhook_id=1,
            event_type="deal.created",
            payload={"deal_id": "deal-123"}
        )

        # Assertions
        assert result["status"] == "delivered"
        assert result["response_status"] == 200
        mock_post.assert_called_once()
        mock_db_session.commit.assert_called()
        mock_db_session.close.assert_called_once()

    @patch('app.tasks.webhook_tasks.SessionLocal')
    def test_deliver_webhook_not_found(self, mock_session_local, mock_db_session):
        """Test webhook not found."""
        mock_session_local.return_value = mock_db_session
        mock_result = Mock()
        mock_result.scalar_one_or_none.return_value = None
        mock_db_session.execute.return_value = mock_result

        result = webhook_tasks.deliver_webhook_task(
            webhook_id=999,
            event_type="deal.created",
            payload={}
        )

        assert result["status"] == "skipped"
        assert result["reason"] == "webhook_not_active"
        mock_db_session.close.assert_called_once()

    @patch('app.tasks.webhook_tasks.SessionLocal')
    def test_deliver_webhook_not_active(self, mock_session_local, mock_db_session, sample_webhook):
        """Test inactive webhook."""
        mock_session_local.return_value = mock_db_session
        sample_webhook.is_active = False
        mock_result = Mock()
        mock_result.scalar_one_or_none.return_value = sample_webhook
        mock_db_session.execute.return_value = mock_result

        result = webhook_tasks.deliver_webhook_task(
            webhook_id=1,
            event_type="deal.created",
            payload={}
        )

        assert result["status"] == "skipped"
        assert result["reason"] == "webhook_not_active"
        mock_db_session.close.assert_called_once()

    @patch('app.tasks.webhook_tasks.SessionLocal')
    def test_deliver_webhook_event_not_subscribed(self, mock_session_local, mock_db_session, sample_webhook):
        """Test event type not subscribed."""
        mock_session_local.return_value = mock_db_session
        sample_webhook.events = ["deal.created"]  # Not subscribed to deal.updated
        mock_result = Mock()
        mock_result.scalar_one_or_none.return_value = sample_webhook
        mock_db_session.execute.return_value = mock_result

        result = webhook_tasks.deliver_webhook_task(
            webhook_id=1,
            event_type="deal.updated",  # Not in events list
            payload={}
        )

        assert result["status"] == "skipped"
        assert result["reason"] == "event_not_subscribed"
        mock_db_session.close.assert_called_once()

    @patch('app.tasks.webhook_tasks.SessionLocal')
    @patch('app.tasks.webhook_tasks.requests.post')
    def test_deliver_webhook_http_error(self, mock_post, mock_session_local, mock_db_session, sample_webhook):
        """Test webhook delivery with HTTP error response."""
        mock_session_local.return_value = mock_db_session
        mock_response = Mock()
        mock_response.status_code = 500
        mock_response.text = "Internal Server Error"
        mock_response.headers = {}
        mock_post.return_value = mock_response

        mock_result = Mock()
        mock_result.scalar_one_or_none.return_value = sample_webhook
        mock_db_session.execute.return_value = mock_result
        mock_db_session.add = Mock()
        mock_db_session.commit = Mock()
        mock_db_session.refresh = Mock()

        result = webhook_tasks.deliver_webhook_task(
            webhook_id=1,
            event_type="deal.created",
            payload={}
        )

        assert result["status"] == "failed"
        assert result["response_status"] == 500
        mock_db_session.commit.assert_called()
        mock_db_session.close.assert_called_once()

    @patch('app.tasks.webhook_tasks.SessionLocal')
    @patch('app.tasks.webhook_tasks.requests.post')
    def test_deliver_webhook_request_exception(self, mock_post, mock_session_local, mock_db_session, sample_webhook):
        """Test webhook delivery with request exception."""
        mock_session_local.return_value = mock_db_session
        mock_post.side_effect = requests.RequestException("Connection error")

        mock_result = Mock()
        mock_result.scalar_one_or_none.return_value = sample_webhook
        mock_db_session.execute.return_value = mock_result
        mock_db_session.add = Mock()
        mock_db_session.commit = Mock()
        mock_db_session.refresh = Mock()

        result = webhook_tasks.deliver_webhook_task(
            webhook_id=1,
            event_type="deal.created",
            payload={}
        )

        assert result["status"] == "error"
        assert "error" in result
        mock_db_session.commit.assert_called()
        mock_db_session.close.assert_called_once()

    @patch('app.tasks.webhook_tasks.SessionLocal')
    @patch('app.tasks.webhook_tasks.requests.post')
    def test_deliver_webhook_with_secret_key(self, mock_post, mock_session_local, mock_db_session, sample_webhook):
        """Test webhook delivery includes signature header when secret_key is set."""
        mock_session_local.return_value = mock_db_session
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.text = "OK"
        mock_response.headers = {}
        mock_post.return_value = mock_response

        mock_result = Mock()
        mock_result.scalar_one_or_none.return_value = sample_webhook
        mock_db_session.execute.return_value = mock_result
        mock_db_session.add = Mock()
        mock_db_session.commit = Mock()
        mock_db_session.refresh = Mock()

        webhook_tasks.deliver_webhook_task(
            webhook_id=1,
            event_type="deal.created",
            payload={}
        )

        # Verify signature header was added
        call_args = mock_post.call_args
        assert "X-Webhook-Signature" in call_args.kwargs["headers"]
        assert call_args.kwargs["headers"]["X-Webhook-Signature"] == "secret-123"

    @patch('app.tasks.webhook_tasks.SessionLocal')
    @patch('app.tasks.webhook_tasks.requests.post')
    def test_deliver_webhook_without_secret_key(self, mock_post, mock_session_local, mock_db_session, sample_webhook):
        """Test webhook delivery without secret_key."""
        mock_session_local.return_value = mock_db_session
        sample_webhook.secret_key = None
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.text = "OK"
        mock_response.headers = {}
        mock_post.return_value = mock_response

        mock_result = Mock()
        mock_result.scalar_one_or_none.return_value = sample_webhook
        mock_db_session.execute.return_value = mock_result
        mock_db_session.add = Mock()
        mock_db_session.commit = Mock()
        mock_db_session.refresh = Mock()

        webhook_tasks.deliver_webhook_task(
            webhook_id=1,
            event_type="deal.created",
            payload={}
        )

        # Verify signature header was not added
        call_args = mock_post.call_args
        assert "X-Webhook-Signature" not in call_args.kwargs["headers"]


class TestRetryFailedDeliveriesTask:
    """Test retry_failed_deliveries_task function."""

    @patch('app.tasks.webhook_tasks.SessionLocal')
    @patch('app.tasks.webhook_tasks.deliver_webhook_task')
    def test_retry_failed_deliveries_success(self, mock_deliver_task, mock_session_local, mock_db_session, sample_webhook, sample_webhook_delivery):
        """Test retrying failed deliveries."""
        mock_session_local.return_value = mock_db_session
        sample_webhook_delivery.next_retry_at = datetime.now(timezone.utc) - timedelta(minutes=1)
        sample_webhook_delivery.retry_count = 1

        # Mock database queries
        mock_delivery_result = Mock()
        mock_delivery_result.scalars.return_value.all.return_value = [sample_webhook_delivery]
        mock_webhook_result = Mock()
        mock_webhook_result.scalar_one_or_none.return_value = sample_webhook
        mock_db_session.execute.side_effect = [mock_delivery_result, mock_webhook_result]

        result = webhook_tasks.retry_failed_deliveries_task()

        assert result["retried_count"] == 1
        assert result["delivery_ids"] == [1]
        mock_deliver_task.delay.assert_called_once()
        mock_db_session.close.assert_called_once()

    @patch('app.tasks.webhook_tasks.SessionLocal')
    def test_retry_failed_deliveries_none_due(self, mock_session_local, mock_db_session):
        """Test when no deliveries are due for retry."""
        mock_session_local.return_value = mock_db_session
        mock_result = Mock()
        mock_result.scalars.return_value.all.return_value = []
        mock_db_session.execute.return_value = mock_result

        result = webhook_tasks.retry_failed_deliveries_task()

        assert result["retried_count"] == 0
        assert result["delivery_ids"] == []
        mock_db_session.close.assert_called_once()

    @patch('app.tasks.webhook_tasks.SessionLocal')
    @patch('app.tasks.webhook_tasks.deliver_webhook_task')
    def test_retry_failed_deliveries_max_retries(self, mock_deliver_task, mock_session_local, mock_db_session, sample_webhook_delivery):
        """Test that deliveries exceeding max retries are not retried."""
        mock_session_local.return_value = mock_db_session
        sample_webhook_delivery.retry_count = 5  # Max is 5, so this should be skipped
        sample_webhook_delivery.next_retry_at = datetime.now(timezone.utc) - timedelta(minutes=1)

        mock_result = Mock()
        mock_result.scalars.return_value.all.return_value = []
        mock_db_session.execute.return_value = mock_result

        result = webhook_tasks.retry_failed_deliveries_task()

        assert result["retried_count"] == 0
        mock_deliver_task.delay.assert_not_called()
        mock_db_session.close.assert_called_once()

    @patch('app.tasks.webhook_tasks.SessionLocal')
    @patch('app.tasks.webhook_tasks.deliver_webhook_task')
    def test_retry_failed_deliveries_inactive_webhook(self, mock_deliver_task, mock_session_local, mock_db_session, sample_webhook, sample_webhook_delivery):
        """Test that deliveries for inactive webhooks are not retried."""
        mock_session_local.return_value = mock_db_session
        sample_webhook.is_active = False
        sample_webhook_delivery.next_retry_at = datetime.now(timezone.utc) - timedelta(minutes=1)

        mock_delivery_result = Mock()
        mock_delivery_result.scalars.return_value.all.return_value = [sample_webhook_delivery]
        mock_webhook_result = Mock()
        mock_webhook_result.scalar_one_or_none.return_value = sample_webhook
        mock_db_session.execute.side_effect = [mock_delivery_result, mock_webhook_result]

        result = webhook_tasks.retry_failed_deliveries_task()

        assert result["retried_count"] == 0
        mock_deliver_task.delay.assert_not_called()
        mock_db_session.close.assert_called_once()

