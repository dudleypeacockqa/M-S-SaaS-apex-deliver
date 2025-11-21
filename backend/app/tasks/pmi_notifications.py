"""
PMI Notification Tasks - Scheduled notification checks
Uses Celery for background task processing
"""

from __future__ import annotations

import asyncio
import logging
from datetime import datetime, timezone, timedelta
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import select

try:
    from celery import shared_task
except ModuleNotFoundError:  # pragma: no cover - allow tests without Celery
    from typing import Any, Callable, TypeVar
    F = TypeVar("F", bound=Callable[..., Any])

    def shared_task(func: F | None = None, **_kwargs: Any) -> F:
        if func is None:
            def decorator(inner: F) -> F:
                return inner
            return decorator  # type: ignore[return-value]
        return func

from app.db.session import SessionLocal
from app.models.pmi import (
    PMIProject,
    PMIMilestone,
    PMIRisk,
    PMISynergy,
    PMIDayOneChecklist,
    PMIRiskSeverity,
    PMIRiskStatus,
    PMIWorkstream,
)
from app.models.user_notification_preferences import UserNotificationPreferences
from app.services import pmi_notification_service

logger = logging.getLogger(__name__)


@shared_task
def check_milestone_due_dates_task() -> None:
    """Celery task wrapper for milestone due date checks."""
    asyncio.run(check_milestone_due_dates())


async def check_milestone_due_dates() -> None:
    """
    Daily check for milestones due in 3 or 7 days.
    Sends reminders to users who have milestone reminders enabled.
    """
    db: Session = SessionLocal()
    try:
        # Get all active PMI projects
        projects = db.scalars(
            select(PMIProject).where(PMIProject.status.in_(['planning', 'active']))
        ).all()
        
        for project in projects:
            # Get user notification preferences
            prefs = db.scalar(
                select(UserNotificationPreferences).where(
                    UserNotificationPreferences.user_id == project.created_by
                )
            )
            
            if not prefs or not prefs.pmi_milestone_reminders:
                continue
            
            # Get all milestones for this project's workstreams
            workstreams = db.scalars(
                select(PMIWorkstream).where(PMIWorkstream.project_id == project.id)
            ).all()
            
            for workstream in workstreams:
                milestones = db.scalars(
                    select(PMIMilestone).where(
                        PMIMilestone.workstream_id == workstream.id,
                        PMIMilestone.status != 'completed',
                    )
                ).all()
                
                for milestone in milestones:
                    if milestone.target_date:
                        # Check for 3-day and 7-day reminders
                        for days in [3, 7]:
                            try:
                                await pmi_notification_service.send_milestone_reminder(
                                    milestone.id,
                                    project.organization_id,
                                    db,
                                    days_until_due=days,
                                )
                            except Exception as e:
                                logger.error(f"Failed to send milestone reminder: {e}")
        
        db.commit()
    except Exception as e:
        logger.error(f"Error in check_milestone_due_dates: {e}")
        db.rollback()
    finally:
        db.close()


@shared_task
def check_risk_escalations_task() -> None:
    """Celery task wrapper for risk escalation checks."""
    asyncio.run(check_risk_escalations())


async def check_risk_escalations() -> None:
    """
    Hourly check for risk status changes that require alerts.
    Sends alerts for high/critical severity risks.
    """
    db: Session = SessionLocal()
    try:
        # Get all open high/critical risks
        risks = db.scalars(
            select(PMIRisk).where(
                PMIRisk.severity.in_([PMIRiskSeverity.high, PMIRiskSeverity.critical]),
                PMIRisk.status == PMIRiskStatus.open,
            )
        ).all()
        
        for risk in risks:
            project = db.scalar(select(PMIProject).where(PMIProject.id == risk.project_id))
            if not project:
                continue
            
            # Get user notification preferences
            prefs = db.scalar(
                select(UserNotificationPreferences).where(
                    UserNotificationPreferences.user_id == project.created_by
                )
            )
            
            if not prefs or not prefs.pmi_risk_alerts:
                continue
            
            try:
                await pmi_notification_service.send_risk_escalation_alert(
                    risk.id,
                    project.organization_id,
                    db,
                )
            except Exception as e:
                logger.error(f"Failed to send risk alert: {e}")
        
        db.commit()
    except Exception as e:
        logger.error(f"Error in check_risk_escalations: {e}")
        db.rollback()
    finally:
        db.close()


@shared_task
def check_synergy_targets_task() -> None:
    """Celery task wrapper for synergy target checks."""
    asyncio.run(check_synergy_targets())


async def check_synergy_targets() -> None:
    """
    Daily check for synergies behind schedule.
    Sends alerts when synergy target dates have passed.
    """
    db: Session = SessionLocal()
    try:
        # Get all synergies with passed target dates
        synergies = db.scalars(
            select(PMISynergy).where(
                PMISynergy.target_date < datetime.now(timezone.utc),
                PMISynergy.status.notin_(['realized', 'cancelled']),
            )
        ).all()
        
        for synergy in synergies:
            project = db.scalar(select(PMIProject).where(PMIProject.id == synergy.project_id))
            if not project:
                continue
            
            # Get user notification preferences
            prefs = db.scalar(
                select(UserNotificationPreferences).where(
                    UserNotificationPreferences.user_id == project.created_by
                )
            )
            
            if not prefs or not prefs.pmi_synergy_alerts:
                continue
            
            try:
                await pmi_notification_service.send_synergy_target_alert(
                    synergy.id,
                    project.organization_id,
                    db,
                )
            except Exception as e:
                logger.error(f"Failed to send synergy alert: {e}")
        
        db.commit()
    except Exception as e:
        logger.error(f"Error in check_synergy_targets: {e}")
        db.rollback()
    finally:
        db.close()


@shared_task
def check_day_one_readiness_task() -> None:
    """Celery task wrapper for Day 1 readiness checks."""
    asyncio.run(check_day_one_readiness())


async def check_day_one_readiness() -> None:
    """
    Daily check for Day 1 items approaching deadline.
    Sends warnings for incomplete Day 1 checklist items.
    """
    db: Session = SessionLocal()
    try:
        # Get all active PMI projects with Day 1 dates approaching
        projects = db.scalars(
            select(PMIProject).where(
                PMIProject.status.in_(['planning', 'active']),
                PMIProject.day_one_date.isnot(None),
            )
        ).all()
        
        for project in projects:
            if not project.day_one_date:
                continue
            
            days_until = (project.day_one_date - datetime.now(timezone.utc)).days
            
            # Check 1 day before Day 1
            if days_until == 1:
                # Get user notification preferences
                prefs = db.scalar(
                    select(UserNotificationPreferences).where(
                        UserNotificationPreferences.user_id == project.created_by
                    )
                )
                
                if not prefs or not prefs.pmi_day_one_warnings:
                    continue
                
                try:
                    await pmi_notification_service.send_day_one_warning(
                        project.id,
                        project.organization_id,
                        db,
                        days_before=1,
                    )
                except Exception as e:
                    logger.error(f"Failed to send Day 1 warning: {e}")
        
        db.commit()
    except Exception as e:
        logger.error(f"Error in check_day_one_readiness: {e}")
        db.rollback()
    finally:
        db.close()

