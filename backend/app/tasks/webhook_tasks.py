"""
Celery Tasks for Webhook Delivery

Background tasks for delivering webhooks with retry logic.
"""
from celery import shared_task
import requests
from typing import Dict, Callable, TypeVar
from datetime import datetime, timedelta

from app.db import session as session_module
from app.models.master_admin import Webhook, WebhookDelivery


TaskFunc = TypeVar("TaskFunc", bound=Callable)

SessionLocal = None  # legacy alias retained for tests to override


def _ensure_task_delay(task: TaskFunc) -> TaskFunc:
    """
    Attach a `.delay` shim when Celery's decorator has been stubbed out.

    When tests patch `celery.shared_task` to become a no-op, the decorated
    function will not expose `.delay`, causing AttributeError in code paths
    that expect it. This helper mirrors Celery's API by falling back to a
    direct call when the attribute is missing.
    """
    if not hasattr(task, "delay"):
        setattr(task, "delay", lambda *args, **kwargs: task(*args, **kwargs))
    return task


def _schedule_retry(delivery: WebhookDelivery) -> None:
    """Increment retry counters safely even when defaults are unset."""
    current_retries = delivery.retry_count or 0
    delivery.retry_count = current_retries + 1
    delivery.next_retry_at = datetime.utcnow() + timedelta(minutes=2 ** delivery.retry_count)


def _create_db_session():
    """Return a Session, ensuring engine/session factory exist even when patched in tests."""
    session_factory = SessionLocal or session_module.SessionLocal
    if session_factory is None:
        session_module.init_engine()
        session_factory = session_module.SessionLocal
    if session_factory is None:
        raise RuntimeError("Database session factory is not initialized")
    return session_factory()


@shared_task(name="webhooks.deliver_webhook")
def deliver_webhook_task(webhook_id: int, event_type: str, payload: Dict):
    """
    Deliver a webhook with retry logic.
    
    Args:
        webhook_id: Webhook ID
        event_type: Event type
        payload: Webhook payload
    """
    db = _create_db_session()
    try:
        from sqlalchemy import select
        
        # Get webhook
        result = db.execute(select(Webhook).where(Webhook.id == webhook_id))
        webhook = result.scalar_one_or_none()
        
        if not webhook or not webhook.is_active:
            return {"status": "skipped", "reason": "webhook_not_active"}
        
        # Check if event type is subscribed
        if event_type not in (webhook.events or []):
            return {"status": "skipped", "reason": "event_not_subscribed"}
        
        # Create delivery record
        delivery = WebhookDelivery(
            webhook_id=webhook_id,
            organization_id=webhook.organization_id,
            event_type=event_type,
            payload=payload,
        )
        db.add(delivery)
        db.commit()
        db.refresh(delivery)
        
        # Prepare request
        headers = {
            "Content-Type": "application/json",
            **(webhook.headers or {}),
        }
        
        if webhook.secret_key:
            # Add signature header (simplified - should use HMAC in production)
            headers["X-Webhook-Signature"] = webhook.secret_key
        
        # Make request
        try:
            response = requests.post(
                webhook.url,
                json=payload,
                headers=headers,
                timeout=30
            )
            
            # Update delivery record
            delivery.response_status = response.status_code
            delivery.response_body = response.text[:1000]  # Limit response body size
            delivery.response_headers = dict(response.headers)
            
            if response.status_code >= 200 and response.status_code < 300:
                delivery.delivered_at = datetime.utcnow()
                status = "delivered"
            else:
                # Schedule retry
                _schedule_retry(delivery)
                status = "failed"
            
            db.commit()
            return {"status": status, "response_status": response.status_code}
            
        except requests.RequestException as e:
            # Update delivery record with error
            delivery.error_message = str(e)
            _schedule_retry(delivery)
            db.commit()
            
            return {"status": "error", "error": str(e)}
    finally:
        db.close()


_ensure_task_delay(deliver_webhook_task)


@shared_task(name="webhooks.retry_failed_deliveries")
def retry_failed_deliveries_task():
    """
    Retry failed webhook deliveries that are due for retry.
    
    This task should be run periodically to retry failed webhook deliveries.
    """
    db = _create_db_session()
    try:
        from sqlalchemy import select, and_
        
        now = datetime.utcnow()
        
        # Find deliveries that need retrying
        query = select(WebhookDelivery).where(
            and_(
                WebhookDelivery.delivered_at.is_(None),
                WebhookDelivery.next_retry_at <= now,
                WebhookDelivery.retry_count < 5  # Max 5 retries
            )
        )
        
        result = db.execute(query)
        deliveries = list(result.scalars().all())
        
        retried = []
        for delivery in deliveries:
            # Get webhook
            result = db.execute(select(Webhook).where(Webhook.id == delivery.webhook_id))
            webhook = result.scalar_one_or_none()
            
            if webhook and webhook.is_active:
                # Retry delivery
                deliver_webhook_task.delay(
                    delivery.webhook_id,
                    delivery.event_type,
                    delivery.payload
                )
                retried.append(delivery.id)
        
        return {"retried_count": len(retried), "delivery_ids": retried}
    finally:
        db.close()


_ensure_task_delay(retry_failed_deliveries_task)

