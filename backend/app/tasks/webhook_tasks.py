"""
Celery Tasks for Webhook Delivery

Background tasks for delivering webhooks with retry logic.
"""
from celery import shared_task
import requests
from typing import Dict
from datetime import datetime, timedelta

from app.db.session import SessionLocal
from app.models.master_admin import Webhook, WebhookDelivery


@shared_task(name="webhooks.deliver_webhook")
def deliver_webhook_task(webhook_id: int, event_type: str, payload: Dict):
    """
    Deliver a webhook with retry logic.
    
    Args:
        webhook_id: Webhook ID
        event_type: Event type
        payload: Webhook payload
    """
    db = SessionLocal()
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
                delivery.retry_count += 1
                delivery.next_retry_at = datetime.utcnow() + timedelta(minutes=2 ** delivery.retry_count)
                status = "failed"
            
            db.commit()
            return {"status": status, "response_status": response.status_code}
            
        except requests.RequestException as e:
            # Update delivery record with error
            delivery.error_message = str(e)
            delivery.retry_count += 1
            delivery.next_retry_at = datetime.utcnow() + timedelta(minutes=2 ** delivery.retry_count)
            db.commit()
            
            return {"status": "error", "error": str(e)}
    finally:
        db.close()


@shared_task(name="webhooks.retry_failed_deliveries")
def retry_failed_deliveries_task():
    """
    Retry failed webhook deliveries that are due for retry.
    
    This task should be run periodically to retry failed webhook deliveries.
    """
    db = SessionLocal()
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
        
        deliveries = list(db.scalars(query).all())
        
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

