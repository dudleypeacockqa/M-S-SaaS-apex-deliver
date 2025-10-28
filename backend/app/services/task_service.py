"""Service layer for DEV-012 task management."""

from __future__ import annotations

import uuid
from typing import List, Tuple

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.task import DealTask


def _ensure_task_belongs_to_org(task: DealTask, organization_id: str) -> None:
    if task.organization_id != organization_id:
        raise PermissionError("Task does not belong to organization")


def create_task(
    *,
    db: Session,
    deal_id: str,
    organization_id: str,
    created_by: str,
    payload: dict,
) -> DealTask:
    task = DealTask(
        id=str(uuid.uuid4()),
        deal_id=deal_id,
        organization_id=organization_id,
        created_by=created_by,
        **payload,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def list_tasks(
    *,
    db: Session,
    deal_id: str,
    organization_id: str,
) -> Tuple[List[DealTask], int]:
    stmt = (
        select(DealTask)
        .where(
            DealTask.deal_id == deal_id,
            DealTask.organization_id == organization_id,
        )
        .order_by(DealTask.created_at.asc())
    )
    tasks = list(db.scalars(stmt).all())
    return tasks, len(tasks)


def get_task(
    *,
    db: Session,
    task_id: str,
    organization_id: str,
) -> DealTask | None:
    task = db.get(DealTask, task_id)
    if not task or task.organization_id != organization_id:
        return None
    return task


def update_task(
    *,
    db: Session,
    task: DealTask,
    updates: dict,
) -> DealTask:
    for field, value in updates.items():
        if value is not None and hasattr(task, field):
            setattr(task, field, value)

    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def delete_task(
    *,
    db: Session,
    task: DealTask,
) -> None:
    db.delete(task)
    db.commit()

