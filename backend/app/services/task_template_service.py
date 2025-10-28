"""Services for task templates and automation rules (DEV-012)."""

from __future__ import annotations

import uuid
from typing import List, Tuple

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.task import TaskTemplate, TaskAutomationRule, TaskAutomationLog
from app.services import task_service


def create_template(
    *,
    db: Session,
    organization_id: str,
    created_by: str,
    payload: dict,
) -> TaskTemplate:
    template = TaskTemplate(
        id=str(uuid.uuid4()),
        organization_id=organization_id,
        created_by=created_by,
        tasks_definition=payload["tasks"],
        name=payload["name"],
        description=payload.get("description"),
    )
    db.add(template)
    db.commit()
    db.refresh(template)
    return template


def list_templates(
    *,
    db: Session,
    organization_id: str,
) -> List[TaskTemplate]:
    stmt = select(TaskTemplate).where(TaskTemplate.organization_id == organization_id)
    return list(db.scalars(stmt).all())


def get_template(
    *,
    db: Session,
    template_id: str,
    organization_id: str,
) -> TaskTemplate | None:
    template = db.get(TaskTemplate, template_id)
    if not template or template.organization_id != organization_id:
        return None
    return template


def create_rule(
    *,
    db: Session,
    deal_id: str,
    organization_id: str,
    created_by: str,
    payload: dict,
) -> TaskAutomationRule:
    rule = TaskAutomationRule(
        id=str(uuid.uuid4()),
        deal_id=deal_id,
        organization_id=organization_id,
        template_id=payload["template_id"],
        name=payload["name"],
        trigger=payload["trigger"],
        action=payload["action"],
        suppress_minutes=payload.get("suppress_minutes", 0),
        created_by=created_by,
    )
    db.add(rule)
    db.commit()
    db.refresh(rule)
    return rule


def list_rules(
    *,
    db: Session,
    deal_id: str,
    organization_id: str,
) -> List[TaskAutomationRule]:
    stmt = select(TaskAutomationRule).where(
        TaskAutomationRule.deal_id == deal_id,
        TaskAutomationRule.organization_id == organization_id,
    )
    return list(db.scalars(stmt).all())


def get_rule(
    *,
    db: Session,
    rule_id: str,
    organization_id: str,
) -> TaskAutomationRule | None:
    rule = db.get(TaskAutomationRule, rule_id)
    if not rule or rule.organization_id != organization_id:
        return None
    return rule


def get_log(
    *,
    db: Session,
    log_id: str,
) -> TaskAutomationLog | None:
    return db.get(TaskAutomationLog, log_id)


def log_execution(
    *,
    db: Session,
    deal_id: str,
    organization_id: str,
    rule_id: str,
    triggered_by: str,
    status: str,
    message: str | None = None,
) -> TaskAutomationLog:
    log = TaskAutomationLog(
        id=str(uuid.uuid4()),
        deal_id=deal_id,
        organization_id=organization_id,
        rule_id=rule_id,
        status=status,
        message=message,
        triggered_by=triggered_by,
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


def list_logs(
    *,
    db: Session,
    deal_id: str,
    organization_id: str,
) -> Tuple[List[TaskAutomationLog], int]:
    stmt = select(TaskAutomationLog).where(
        TaskAutomationLog.deal_id == deal_id,
        TaskAutomationLog.organization_id == organization_id,
    ).order_by(TaskAutomationLog.triggered_at.desc())
    logs = list(db.scalars(stmt).all())
    return logs, len(logs)


def update_log_status(
    *,
    db: Session,
    log: TaskAutomationLog,
    status: str,
    message: str | None = None,
) -> TaskAutomationLog:
    log.status = status
    log.message = message
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


def execute_rule(
    *,
    db: Session,
    rule: TaskAutomationRule,
    template: TaskTemplate,
    triggered_by: str,
) -> List:
    created_tasks = []
    for task_def in template.tasks_definition:
        payload = {
            "title": task_def.get("title"),
            "description": task_def.get("description"),
            "status": task_def.get("status", "todo"),
            "priority": task_def.get("priority", "normal"),
            "stage_gate": task_def.get("stage_gate"),
            "assignee_id": task_def.get("assignee_id"),
            "due_date": task_def.get("due_date"),
        }
        task = task_service.create_task(
            db=db,
            deal_id=rule.deal_id,
            organization_id=rule.organization_id,
            created_by=triggered_by,
            payload=payload,
        )
        created_tasks.append(task)
    return created_tasks
