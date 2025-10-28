"""Celery tasks for task automation rules."""

from __future__ import annotations

from celery import shared_task
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.services import task_template_service


@shared_task
def enqueue_manual_rule_run(log_id: str) -> None:
    db: Session = SessionLocal()
    try:
        log = task_template_service.get_log(db=db, log_id=log_id)
        if not log:
            return
        rule = task_template_service.get_rule(db=db, rule_id=log.rule_id, organization_id=log.organization_id)
        if not rule:
            task_template_service.update_log_status(db=db, log=log, status="failed", message="Rule missing")
            return
        template = task_template_service.get_template(db=db, template_id=rule.template_id, organization_id=rule.organization_id)
        if not template:
            task_template_service.update_log_status(db=db, log=log, status="failed", message="Template missing")
            return
        task_template_service.execute_rule(
            db=db,
            rule=rule,
            template=template,
            triggered_by=log.triggered_by,
        )
        task_template_service.update_log_status(db=db, log=log, status="completed", message="Tasks created")
    except Exception as exc:  # pragma: no cover - ensures errors logged
        task_template_service.update_log_status(db=db, log=log, status="failed", message=str(exc))
        raise
    finally:
        db.close()

