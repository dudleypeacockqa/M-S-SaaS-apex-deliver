from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user, require_min_role
from app.db.session import get_db
from app.models.user import User, UserRole
from app.schemas import (
    TaskCreate,
    TaskUpdate,
    TaskResponse,
    TaskListResponse,
    TaskTemplateCreate,
    TaskTemplateResponse,
    TaskAutomationRuleCreate,
    TaskAutomationRuleResponse,
    TaskAutomationLogResponse,
    TaskAutomationLogList,
)
from app.services import task_service, task_template_service
from app.tasks.task_automation import enqueue_manual_rule_run

router = APIRouter(prefix="/api/deals/{deal_id}", tags=["tasks"])


@router.post(
    "/tasks",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_min_role(UserRole.growth))],
)
def create_task_endpoint(
    deal_id: str,
    payload: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TaskResponse:
    task = task_service.create_task(
        db=db,
        deal_id=deal_id,
        organization_id=current_user.organization_id,
        created_by=current_user.id,
        payload=payload.model_dump(),
    )
    return TaskResponse.model_validate(task)


@router.get(
    "/tasks",
    response_model=TaskListResponse,
    dependencies=[Depends(require_min_role(UserRole.growth))],
)
def list_tasks_endpoint(
    deal_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TaskListResponse:
    tasks, total = task_service.list_tasks(
        db=db,
        deal_id=deal_id,
        organization_id=current_user.organization_id,
    )
    return TaskListResponse(total=total, items=[TaskResponse.model_validate(task) for task in tasks])


@router.patch(
    "/tasks/{task_id}",
    response_model=TaskResponse,
    dependencies=[Depends(require_min_role(UserRole.growth))],
)
def update_task_endpoint(
    deal_id: str,
    task_id: str,
    payload: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TaskResponse:
    task = task_service.get_task(
        db=db,
        task_id=task_id,
        organization_id=current_user.organization_id,
    )

    if task is None or task.deal_id != deal_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    updated = task_service.update_task(db=db, task=task, updates=payload.model_dump(exclude_unset=True))
    return TaskResponse.model_validate(updated)


@router.delete(
    "/tasks/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_min_role(UserRole.growth))],
)
def delete_task_endpoint(
    deal_id: str,
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    task = task_service.get_task(
        db=db,
        task_id=task_id,
        organization_id=current_user.organization_id,
    )

    if task is None or task.deal_id != deal_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    task_service.delete_task(db=db, task=task)
    return None


@router.post(
    "/task-templates",
    response_model=TaskTemplateResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_min_role(UserRole.growth))],
)
def create_task_template(
    deal_id: str,
    payload: TaskTemplateCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TaskTemplateResponse:
    template = task_template_service.create_template(
        db=db,
        organization_id=current_user.organization_id,
        created_by=current_user.id,
        payload=payload.model_dump(),
    )
    return TaskTemplateResponse(
        id=template.id,
        organization_id=template.organization_id,
        name=template.name,
        description=template.description,
        tasks=payload.tasks,
        created_by=template.created_by,
        created_at=template.created_at,
    )


@router.get(
    "/task-templates",
    response_model=list[TaskTemplateResponse],
    dependencies=[Depends(require_min_role(UserRole.growth))],
)
def list_task_templates(
    deal_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[TaskTemplateResponse]:
    templates = task_template_service.list_templates(
        db=db,
        organization_id=current_user.organization_id,
    )
    return [
        TaskTemplateResponse(
            id=template.id,
            organization_id=template.organization_id,
            name=template.name,
            description=template.description,
            tasks=template.tasks_definition,
            created_by=template.created_by,
            created_at=template.created_at,
        )
        for template in templates
    ]


@router.post(
    "/automation/rules",
    response_model=TaskAutomationRuleResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_min_role(UserRole.growth))],
)
def create_automation_rule(
    deal_id: str,
    payload: TaskAutomationRuleCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TaskAutomationRuleResponse:
    template = task_template_service.get_template(
        db=db,
        template_id=payload.template_id,
        organization_id=current_user.organization_id,
    )
    if template is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template not found")

    rule = task_template_service.create_rule(
        db=db,
        deal_id=deal_id,
        organization_id=current_user.organization_id,
        created_by=current_user.id,
        payload=payload.model_dump(),
    )
    return TaskAutomationRuleResponse.model_validate(rule)


@router.get(
    "/automation/rules",
    response_model=list[TaskAutomationRuleResponse],
    dependencies=[Depends(require_min_role(UserRole.growth))],
)
def list_automation_rules(
    deal_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[TaskAutomationRuleResponse]:
    rules = task_template_service.list_rules(
        db=db,
        deal_id=deal_id,
        organization_id=current_user.organization_id,
    )
    return [TaskAutomationRuleResponse.model_validate(rule) for rule in rules]


@router.post(
    "/automation/rules/{rule_id}/run",
    status_code=status.HTTP_202_ACCEPTED,
    dependencies=[Depends(require_min_role(UserRole.growth))],
)
def run_automation_rule(
    deal_id: str,
    rule_id: str,
    payload: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    rules = task_template_service.list_rules(
        db=db,
        deal_id=deal_id,
        organization_id=current_user.organization_id,
    )
    rule = next((r for r in rules if r.id == rule_id), None)
    if rule is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rule not found")

    log = task_template_service.log_execution(
        db=db,
        deal_id=deal_id,
        organization_id=current_user.organization_id,
        rule_id=rule_id,
        triggered_by=current_user.id,
        status="queued",
        message="Manual run queued",
    )
    enqueue_manual_rule_run.delay(log.id)
    return {"status": "queued", "log_id": log.id}


@router.get(
    "/automation/logs",
    response_model=TaskAutomationLogList,
    dependencies=[Depends(require_min_role(UserRole.growth))],
)
def list_automation_logs(
    deal_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TaskAutomationLogList:
    logs, total = task_template_service.list_logs(
        db=db,
        deal_id=deal_id,
        organization_id=current_user.organization_id,
    )
    return TaskAutomationLogList(
        items=[TaskAutomationLogResponse.model_validate(log) for log in logs]
    )
