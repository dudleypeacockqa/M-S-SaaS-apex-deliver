"""
Celery Tasks for Campaign Management

Background tasks for campaign execution, email sending, and webhook delivery.
"""
from celery import shared_task
from datetime import datetime
from typing import Dict, List

from app.db.session import SessionLocal
from app.services import campaign_service
from app.models.user import User


@shared_task(name="campaigns.execute_campaign")
def execute_campaign_task(campaign_id: int, user_id: str):
    """
    Execute a campaign in the background.
    
    Args:
        campaign_id: Campaign ID to execute
        user_id: User ID executing the campaign
    """
    db = SessionLocal()
    try:
        # Get user
        from sqlalchemy import select
        from app.models.user import User
        
        result = db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        
        if not user:
            raise ValueError(f"User {user_id} not found")
        
        # Execute campaign
        result = campaign_service.execute_campaign(campaign_id, user, db)
        return result
    finally:
        db.close()


@shared_task(name="campaigns.send_email_batch")
def send_email_batch_task(emails: List[Dict]):
    """
    Send a batch of emails in the background.
    
    Args:
        emails: List of email dictionaries with 'to', 'subject', 'content', etc.
    """
    # This would integrate with your email service (SendGrid, AWS SES, etc.)
    # For now, this is a placeholder
    sent_count = 0
    for email in emails:
        try:
            # TODO: Actually send email via email service
            # send_email(email['to'], email['subject'], email['content'])
            sent_count += 1
        except Exception as e:
            print(f"Error sending email to {email.get('to')}: {e}")
    
    return {"sent_count": sent_count, "total": len(emails)}


@shared_task(name="campaigns.update_campaign_analytics")
def update_campaign_analytics_task(campaign_id: int):
    """
    Recalculate campaign analytics in the background.
    
    Args:
        campaign_id: Campaign ID
    """
    db = SessionLocal()
    try:
        analytics = campaign_service.get_campaign_analytics(campaign_id, db)
        return analytics
    finally:
        db.close()


@shared_task(name="campaigns.process_scheduled_campaigns")
def process_scheduled_campaigns_task():
    """
    Process all campaigns scheduled to run now.
    
    This task should be run periodically (e.g., every minute) to check for
    campaigns that need to be executed.
    """
    db = SessionLocal()
    try:
        from sqlalchemy import select, and_
        from app.models.master_admin import AdminCampaign
        from app.models.enums import CampaignStatus
        from app.models.user import User
        
        now = datetime.utcnow()
        
        # Find campaigns scheduled to run now (within the last minute)
        query = select(AdminCampaign).where(
            and_(
                AdminCampaign.status == CampaignStatus.SCHEDULED,
                AdminCampaign.schedule_at <= now,
                AdminCampaign.schedule_at >= datetime(now.year, now.month, now.day, now.hour, now.minute - 1)
            )
        )
        
        campaigns = list(db.scalars(query).all())
        
        executed = []
        for campaign in campaigns:
            try:
                result = db.execute(select(User).where(User.id == campaign.user_id))
                user = result.scalar_one_or_none()
                
                if user:
                    campaign_service.execute_campaign(campaign.id, user, db)
                    executed.append(campaign.id)
            except Exception as e:
                print(f"Error executing campaign {campaign.id}: {e}")
        
        return {"executed_count": len(executed), "campaign_ids": executed}
    finally:
        db.close()

