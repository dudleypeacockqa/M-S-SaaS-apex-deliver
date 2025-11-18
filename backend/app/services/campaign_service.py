"""
Campaign Service

Service for managing multi-channel outreach campaigns.
"""
from datetime import datetime, timedelta, timezone
from typing import Dict, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select, func, and_, or_

from app.models.master_admin import (
    AdminCampaign,
    CampaignTemplate,
    CampaignActivity,
    AdminProspect,
    AdminCampaignRecipient,
)
from app.models.enums import CampaignType, CampaignStatus
from app.models.user import User
from app.models.organization import Organization
from app.services.template_service import render_template
from app.services import master_admin_service


def create_campaign(
    campaign_data: Dict,
    user: User,
    db: Session
) -> AdminCampaign:
    """
    Create a new campaign.
    
    Args:
        campaign_data: Dictionary with campaign fields
        user: User creating the campaign
        db: Database session
        
    Returns:
        Created AdminCampaign instance
    """
    campaign = AdminCampaign(
        user_id=str(user.id),
        name=campaign_data["name"],
        type=campaign_data["type"],
        status=CampaignStatus.DRAFT,
        subject=campaign_data.get("subject"),
        content=campaign_data["content"],
        template_id=campaign_data.get("template_id"),
        settings=campaign_data.get("settings", {}),
    )
    
    db.add(campaign)
    db.commit()
    db.refresh(campaign)
    
    return campaign


def schedule_campaign(
    campaign_id: int,
    schedule_time: datetime,
    user: User,
    db: Session
) -> AdminCampaign:
    """
    Schedule a campaign for future execution.
    
    Args:
        campaign_id: Campaign ID
        schedule_time: When to execute the campaign
        user: User scheduling the campaign
        db: Database session
        
    Returns:
        Updated AdminCampaign instance
        
    Raises:
        ValueError: If schedule_time is in the past
    """
    schedule_dt = (
        schedule_time.astimezone(timezone.utc)
        if schedule_time.tzinfo
        else schedule_time.replace(tzinfo=timezone.utc)
    )
    now = datetime.now(timezone.utc)
    if schedule_dt < now:
        raise ValueError("Cannot schedule campaign in the past")
    
    result = db.execute(
        select(AdminCampaign).where(
            AdminCampaign.id == campaign_id,
            AdminCampaign.user_id == str(user.id)
        )
    )
    campaign = result.scalar_one_or_none()
    
    if not campaign:
        raise ValueError(f"Campaign {campaign_id} not found")
    
    campaign.schedule_at = schedule_dt
    campaign.status = CampaignStatus.SCHEDULED
    
    db.commit()
    db.refresh(campaign)
    
    return campaign


def execute_campaign(
    campaign_id: int,
    user: User,
    db: Session
) -> Dict:
    """
    Execute a campaign (send emails, initiate voice calls, etc.).
    
    Args:
        campaign_id: Campaign ID
        user: User executing the campaign
        db: Database session
        
    Returns:
        Dictionary with execution results
    """
    result = db.execute(
        select(AdminCampaign).where(
            AdminCampaign.id == campaign_id,
            AdminCampaign.user_id == str(user.id)
        )
    )
    campaign = result.scalar_one_or_none()
    
    if not campaign:
        raise ValueError(f"Campaign {campaign_id} not found")
    
    if campaign.status not in [CampaignStatus.DRAFT, CampaignStatus.SCHEDULED]:
        raise ValueError(f"Cannot execute campaign with status {campaign.status}")
    
    # Get organization from user
    org_result = db.execute(
        select(Organization).where(Organization.id == user.organization_id)
    )
    organization = org_result.scalar_one_or_none()
    
    if not organization:
        raise ValueError("User organization not found")
    
    # Update campaign status
    campaign.status = CampaignStatus.SENDING
    campaign.started_at = datetime.now(timezone.utc)
    db.commit()
    
    # Get recipients
    recipients_result = db.execute(
        select(AdminCampaignRecipient).where(
            AdminCampaignRecipient.campaign_id == campaign_id
        )
    )
    recipients = list(recipients_result.scalars().all())
    
    if not recipients:
        campaign.status = CampaignStatus.SENT
        campaign.completed_at = datetime.now(timezone.utc)
        db.commit()
        return {"sent_count": 0, "total_recipients": 0}
    
    sent_count = 0
    
    # Execute based on campaign type
    if campaign.type in [CampaignType.EMAIL, CampaignType.SMS]:
        sent_count = _execute_email_campaign(campaign, recipients, organization, db)
    elif campaign.type == CampaignType.VOICE:
        sent_count = _execute_voice_campaign(campaign, recipients, organization, db)
    elif campaign.type == CampaignType.MULTI_CHANNEL:
        # Execute multiple channels
        email_count = _execute_email_campaign(campaign, recipients, organization, db)
        voice_count = _execute_voice_campaign(campaign, recipients, organization, db)
        sent_count = email_count + voice_count
    
    # Update campaign
    campaign.sent_count = sent_count
    campaign.total_recipients = len(recipients)
    campaign.status = CampaignStatus.SENT
    campaign.sent_at = datetime.now(timezone.utc)
    campaign.completed_at = datetime.now(timezone.utc)
    db.commit()
    
    # Integrate with LeadCapture: Create lead capture records for new contacts
    # This ensures all campaign recipients are tracked in the lead capture system
    from app.models.master_admin import AdminLeadCapture
    
    for recipient in recipients:
        prospect_result = db.execute(
            select(AdminProspect).where(AdminProspect.id == recipient.prospect_id)
        )
        prospect = prospect_result.scalar_one_or_none()
        
        if prospect:
            # Check if lead capture already exists for this prospect
            # If not, create one linked to the campaign
            # This integration ensures campaign activities are tracked in the lead capture system
            from sqlalchemy import select as sql_select
            existing_capture_result = db.execute(
                sql_select(AdminLeadCapture).where(
                    AdminLeadCapture.user_id == campaign.user_id,
                    AdminLeadCapture.email == prospect.email
                )
            )
            existing_capture = existing_capture_result.scalar_one_or_none()
            
            if not existing_capture and prospect.email:
                # Create lead capture record for campaign tracking
                lead_capture = AdminLeadCapture(
                    user_id=campaign.user_id,
                    name=prospect.name or "Unknown",
                    email=prospect.email,
                    phone=prospect.phone,
                    company=prospect.company,
                    source=f"campaign_{campaign.id}",
                )
                db.add(lead_capture)
                db.commit()
    
    return {
        "sent_count": sent_count,
        "total_recipients": len(recipients),
    }


def _execute_email_campaign(
    campaign: AdminCampaign,
    recipients: List[AdminCampaignRecipient],
    organization: Organization,
    db: Session
) -> int:
    """
    Execute email campaign by sending emails to recipients.
    
    This is a placeholder - actual email sending would be done via
    background tasks (Celery) or email service integration.
    
    Args:
        campaign: Campaign instance
        recipients: List of recipient instances
        organization: Organization instance
        db: Database session
        
    Returns:
        Number of emails sent
    """
    sent_count = 0
    
    # Get template if exists
    template = None
    if campaign.template_id:
        template_result = db.execute(
            select(CampaignTemplate).where(CampaignTemplate.id == campaign.template_id)
        )
        template = template_result.scalar_one_or_none()
    
    for recipient in recipients:
        # Get prospect
        prospect_result = db.execute(
            select(AdminProspect).where(AdminProspect.id == recipient.prospect_id)
        )
        prospect = prospect_result.scalar_one_or_none()
        
        if not prospect or not prospect.email:
            continue
        
        # Render template if exists
        subject = campaign.subject
        content = campaign.content
        
        if template:
            try:
                contact_data = {
                    "first_name": prospect.name.split()[0] if prospect.name else "",
                    "last_name": prospect.name.split()[-1] if prospect.name and len(prospect.name.split()) > 1 else "",
                    "name": prospect.name or "",
                    "company": prospect.company or "",
                    "email": prospect.email or "",
                }
                rendered = render_template(template.id, contact_data, db)
                subject = rendered["subject"]
                content = rendered["content"]
            except Exception as e:
                # Log error but continue
                print(f"Error rendering template: {e}")
        
        # Send email via email service (queue for async processing)
        if prospect.email:
            try:
                # Use Celery task for email queuing (better for production)
                from app.tasks.campaign_tasks import queue_campaign_email_task
                
                # Queue email via Celery task
                queue_campaign_email_task.delay(
                    to_email=prospect.email,
                    subject=subject,
                    content=content,
                    template_data={
                        "subject": subject,
                        "content": content,
                        "first_name": contact_data.get("first_name", ""),
                        "last_name": contact_data.get("last_name", ""),
                        "company": contact_data.get("company", ""),
                    }
                )
                
                # Mark as queued (will be marked as sent when email is actually sent)
                recipient.sent = True
                recipient.sent_at = datetime.now(timezone.utc)
            except Exception as e:
                # Log error but continue with other recipients
                print(f"Error queuing email for {prospect.email}: {e}")
                # Mark as failed but don't stop campaign
                recipient.sent = False
        else:
            # No email address, mark as skipped
            recipient.sent = False
        
        # Track activity
        activity = CampaignActivity(
            organization_id=str(organization.id),
            campaign_id=campaign.id,
            contact_id=prospect.id,
            activity_type="email_sent",
            status="sent",
            activity_metadata={"subject": subject},
        )
        db.add(activity)
        
        sent_count += 1
    
    db.commit()
    return sent_count


def _execute_voice_campaign(
    campaign: AdminCampaign,
    recipients: List[AdminCampaignRecipient],
    organization: Organization,
    db: Session
) -> int:
    """
    Execute voice campaign by initiating voice calls.
    
    This is a placeholder - actual voice calls would be made via
    voice service integration (Synthflow).
    
    Args:
        campaign: Campaign instance
        recipients: List of recipient instances
        organization: Organization instance
        db: Database session
        
    Returns:
        Number of calls initiated
    """
    # Import here to avoid circular dependency
    from app.services.voice_service import make_voice_call
    
    initiated_count = 0
    
    for recipient in recipients:
        # Get prospect
        prospect_result = db.execute(
            select(AdminProspect).where(AdminProspect.id == recipient.prospect_id)
        )
        prospect = prospect_result.scalar_one_or_none()
        
        if not prospect or not prospect.phone:
            continue
        
        # Get agent ID from campaign settings
        agent_id = campaign.settings.get("agent_id") if campaign.settings else None
        if not agent_id:
            continue  # Skip if no agent configured
        
        try:
            # Initiate voice call
            call_data = {
                "agent_id": agent_id,
                "phone_number": prospect.phone,
                "metadata": {
                    "campaign_id": campaign.id,
                    "prospect_id": prospect.id,
                },
            }
            
            voice_call = make_voice_call(
                call_data,
                prospect.id,
                str(organization.id),
                db,
                campaign_id=campaign.id
            )
            
            initiated_count += 1
        except Exception as e:
            # Log error but continue
            print(f"Error initiating voice call: {e}")
    
    return initiated_count


def track_activity(
    campaign_id: int,
    contact_id: int,
    activity_data: Dict,
    organization_id: str,
    db: Session
) -> CampaignActivity:
    """
    Record a campaign activity.
    
    Args:
        campaign_id: Campaign ID
        contact_id: Contact/Prospect ID
        activity_data: Dictionary with activity fields
        organization_id: Organization ID
        db: Database session
        
    Returns:
        Created CampaignActivity instance
    """
    activity = CampaignActivity(
        organization_id=organization_id,
        campaign_id=campaign_id,
        contact_id=contact_id,
        activity_type=activity_data["activity_type"],
        status=activity_data["status"],
        activity_metadata=activity_data.get("metadata", {}),
        ip_address=activity_data.get("ip_address"),
        user_agent=activity_data.get("user_agent"),
    )
    
    db.add(activity)
    db.commit()
    db.refresh(activity)
    
    # Update campaign counts based on activity type
    campaign_result = db.execute(
        select(AdminCampaign).where(AdminCampaign.id == campaign_id)
    )
    campaign = campaign_result.scalar_one_or_none()
    
    if campaign:
        if activity_data["activity_type"] == "email_opened" and activity_data["status"] == "opened":
            campaign.opened_count = (campaign.opened_count or 0) + 1
        elif activity_data["activity_type"] == "email_clicked" and activity_data["status"] == "clicked":
            campaign.clicked_count = (campaign.clicked_count or 0) + 1
        db.commit()
    
    return activity


def get_campaign_analytics(campaign_id: int, db: Session) -> Dict:
    """
    Calculate campaign analytics metrics.
    
    Args:
        campaign_id: Campaign ID
        db: Database session
        
    Returns:
        Dictionary with analytics metrics
    """
    result = db.execute(
        select(AdminCampaign).where(AdminCampaign.id == campaign_id)
    )
    campaign = result.scalar_one_or_none()
    
    if not campaign:
        raise ValueError(f"Campaign {campaign_id} not found")
    
    total_recipients = campaign.total_recipients or 0
    sent_count = campaign.sent_count or 0
    opened_count = campaign.opened_count or 0
    clicked_count = campaign.clicked_count or 0
    
    # Calculate rates
    open_rate = (opened_count / sent_count) if sent_count > 0 else 0.0
    click_rate = (clicked_count / sent_count) if sent_count > 0 else 0.0
    click_to_open_rate = (clicked_count / opened_count) if opened_count > 0 else 0.0
    
    # Get activity counts from activities table
    activities_result = db.execute(
        select(func.count(CampaignActivity.id)).where(
            CampaignActivity.campaign_id == campaign_id
        )
    )
    total_activities = activities_result.scalar() or 0
    
    return {
        "total_recipients": total_recipients,
        "sent_count": sent_count,
        "opened_count": opened_count,
        "clicked_count": clicked_count,
        "open_rate": round(open_rate, 4),
        "click_rate": round(click_rate, 4),
        "click_to_open_rate": round(click_to_open_rate, 4),
        "total_activities": total_activities,
    }

