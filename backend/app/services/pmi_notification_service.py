"""
PMI Notification Service - Email notifications for PMI events
Uses SendGrid for email delivery
"""

from __future__ import annotations

import httpx
import logging
from datetime import datetime, timezone, timedelta
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.core.config import get_settings
from app.models.pmi import (
    PMIProject,
    PMIMilestone,
    PMIRisk,
    PMISynergy,
    PMIDayOneChecklist,
    PMIRiskSeverity,
)
from app.models.user import User
from app.models.organization import Organization

logger = logging.getLogger(__name__)
settings = get_settings()


async def send_milestone_reminder(
    milestone_id: str,
    organization_id: str,
    db: Session,
    days_until_due: int = 3,
) -> bool:
    """
    Send email reminder for upcoming milestone.
    
    Args:
        milestone_id: Milestone ID
        organization_id: Organization ID
        db: Database session
        days_until_due: Days until milestone is due
        
    Returns:
        True if email sent successfully
    """
    if not settings.sendgrid_api_key:
        logger.warning("SendGrid not configured, skipping milestone reminder")
        return False
    
    milestone = db.scalar(
        select(PMIMilestone).where(
            PMIMilestone.id == milestone_id,
            PMIMilestone.organization_id == organization_id,
        )
    )
    if not milestone or not milestone.target_date:
        return False
    
    # Check if milestone is due in specified days
    days_until = (milestone.target_date - datetime.now(timezone.utc)).days
    if days_until != days_until_due:
        return False
    
    # Get project and user info
    from app.models.pmi import PMIWorkstream
    workstream = db.scalar(select(PMIWorkstream).where(PMIWorkstream.id == milestone.workstream_id))
    if not workstream:
        return False
    
    project = db.scalar(select(PMIProject).where(PMIProject.id == workstream.project_id))
    if not project:
        return False
    
    # Get project owner
    owner = db.scalar(select(User).where(User.id == project.created_by))
    if not owner or not owner.email:
        return False
    
    subject = f"PMI Milestone Reminder: {milestone.name} due in {days_until_due} days"
    body = f"""
Hello {owner.email},

This is a reminder that the following PMI milestone is approaching:

Milestone: {milestone.name}
Workstream: {workstream.name}
Due Date: {milestone.target_date.strftime('%Y-%m-%d')}
Project: {project.name}

Please ensure all necessary preparations are in place.

Best regards,
ApexDeliver PMI System
"""
    
    return await _send_email(owner.email, subject, body)


async def send_risk_escalation_alert(
    risk_id: str,
    organization_id: str,
    db: Session,
) -> bool:
    """
    Send alert when risk severity increases or status changes to critical.
    
    Args:
        risk_id: Risk ID
        organization_id: Organization ID
        db: Database session
        
    Returns:
        True if email sent successfully
    """
    if not settings.sendgrid_api_key:
        logger.warning("SendGrid not configured, skipping risk alert")
        return False
    
    risk = db.scalar(
        select(PMIRisk).where(
            PMIRisk.id == risk_id,
            PMIRisk.organization_id == organization_id,
        )
    )
    if not risk:
        return False
    
    # Only send for high/critical severity risks
    if risk.severity.value not in ['high', 'critical']:
        return False
    
    project = db.scalar(select(PMIProject).where(PMIProject.id == risk.project_id))
    if not project:
        return False
    
    owner = db.scalar(select(User).where(User.id == project.created_by))
    if not owner or not owner.email:
        return False
    
    subject = f"PMI Risk Alert: {risk.title} - {risk.severity.value.upper()} Severity"
    body = f"""
URGENT: Risk Escalation Alert

A high-severity risk has been identified in your PMI project:

Risk: {risk.title}
Severity: {risk.severity.value.upper()}
Status: {risk.status.value}
Project: {project.name}

Description:
{risk.description or 'No description provided'}

Mitigation Plan:
{risk.mitigation_plan or 'No mitigation plan yet'}

Please review and take immediate action.

Best regards,
ApexDeliver PMI System
"""
    
    return await _send_email(owner.email, subject, body)


async def send_synergy_target_alert(
    synergy_id: str,
    organization_id: str,
    db: Session,
) -> bool:
    """
    Send alert when synergy targets are at risk.
    
    Args:
        synergy_id: Synergy ID
        organization_id: Organization ID
        db: Database session
        
    Returns:
        True if email sent successfully
    """
    if not settings.sendgrid_api_key:
        logger.warning("SendGrid not configured, skipping synergy alert")
        return False
    
    synergy = db.scalar(
        select(PMISynergy).where(
            PMISynergy.id == synergy_id,
            PMISynergy.organization_id == organization_id,
        )
    )
    if not synergy:
        return False
    
    # Check if synergy is behind schedule
    if synergy.target_date and synergy.target_date < datetime.now(timezone.utc):
        if synergy.status.value not in ['realized', 'cancelled']:
            project = db.scalar(select(PMIProject).where(PMIProject.id == synergy.project_id))
            if not project:
                return False
            
            owner = db.scalar(select(User).where(User.id == project.created_by))
            if not owner or not owner.email:
                return False
            
            subject = f"PMI Synergy Alert: {synergy.name} - Target Date Passed"
            body = f"""
Synergy Target Alert

The following synergy has passed its target date without being realized:

Synergy: {synergy.name}
Category: {synergy.category.value}
Planned Value: £{synergy.planned_value:,.2f}
Target Date: {synergy.target_date.strftime('%Y-%m-%d')}
Status: {synergy.status.value}
Project: {project.name}

Please review the status and update the realization plan.

Best regards,
ApexDeliver PMI System
"""
            return await _send_email(owner.email, subject, body)
    
    return False


async def send_day_one_warning(
    project_id: str,
    organization_id: str,
    db: Session,
    days_before: int = 1,
) -> bool:
    """
    Send warning for incomplete Day 1 checklist items.
    
    Args:
        project_id: PMI project ID
        organization_id: Organization ID
        db: Database session
        days_before: Days before Day 1 to send warning
        
    Returns:
        True if email sent successfully
    """
    if not settings.sendgrid_api_key:
        logger.warning("SendGrid not configured, skipping Day 1 warning")
        return False
    
    project = db.scalar(
        select(PMIProject).where(
            PMIProject.id == project_id,
            PMIProject.organization_id == organization_id,
        )
    )
    if not project or not project.day_one_date:
        return False
    
    # Check if Day 1 is approaching
    days_until = (project.day_one_date - datetime.now(timezone.utc)).days
    if days_until != days_before:
        return False
    
    # Get incomplete checklist items
    checklist_items = db.scalars(
        select(PMIDayOneChecklist).where(
            PMIDayOneChecklist.project_id == project_id,
            PMIDayOneChecklist.status != 'complete',
        )
    ).all()
    
    if not checklist_items:
        return False  # All items complete, no warning needed
    
    owner = db.scalar(select(User).where(User.id == project.created_by))
    if not owner or not owner.email:
        return False
    
    incomplete_items = "\n".join([f"- {item.item} ({item.category.value})" for item in checklist_items])
    
    subject = f"PMI Day 1 Warning: {len(checklist_items)} incomplete items"
    body = f"""
Day 1 Readiness Warning

Your PMI project's Day 1 is approaching in {days_before} day(s), but the following checklist items are not yet complete:

{incomplete_items}

Project: {project.name}
Day 1 Date: {project.day_one_date.strftime('%Y-%m-%d')}

Please complete these items before Day 1 to ensure a smooth transition.

Best regards,
ApexDeliver PMI System
"""
    
    return await _send_email(owner.email, subject, body)


async def _send_email(to_email: str, subject: str, body: str) -> bool:
    """Send email via SendGrid."""
    if not settings.sendgrid_api_key:
        return False
    
    payload = {
        "personalizations": [
            {
                "to": [{"email": to_email}],
                "subject": subject,
            }
        ],
        "from": {
            "email": settings.sendgrid_from_email,
            "name": settings.sendgrid_from_name,
        },
        "content": [
            {
                "type": "text/plain",
                "value": body,
            }
        ],
    }
    
    try:
        response = httpx.post(
            "https://api.sendgrid.com/v3/mail/send",
            headers={
                "Authorization": f"Bearer {settings.sendgrid_api_key}",
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=10,
        )
        response.raise_for_status()
        logger.info(f"SendGrid notification sent to {to_email}: {subject}")
        return True
    except httpx.HTTPError as exc:
        logger.error(f"Failed to send SendGrid notification: {exc}")
        return False

