"""
Celery Tasks for Voice Campaigns

Background tasks for voice call processing and webhook handling.
"""
from celery import shared_task
from typing import Dict

from app.db.session import SessionLocal
from app.services import voice_service


@shared_task(name="voice.make_voice_call")
def make_voice_call_task(call_data: Dict, contact_id: int, organization_id: str, campaign_id: int = None):
    """
    Make a voice call in the background.
    
    Args:
        call_data: Voice call configuration
        contact_id: Contact/Prospect ID
        organization_id: Organization ID
        campaign_id: Optional campaign ID
    """
    db = SessionLocal()
    try:
        voice_call = voice_service.make_voice_call(
            call_data,
            contact_id,
            organization_id,
            db,
            campaign_id=campaign_id
        )
        return {"voice_call_id": voice_call.id, "status": voice_call.status}
    finally:
        db.close()


@shared_task(name="voice.process_voice_webhook")
def process_voice_webhook_task(webhook_data: Dict):
    """
    Process incoming voice webhook in the background.
    
    Args:
        webhook_data: Webhook payload from Synthflow
    """
    db = SessionLocal()
    try:
        result = voice_service.handle_voice_webhook(webhook_data, db)
        return result
    finally:
        db.close()

