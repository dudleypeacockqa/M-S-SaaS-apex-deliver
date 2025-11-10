"""Pipeline template service."""
from __future__ import annotations

from typing import List, Optional

from sqlalchemy import select, delete
from sqlalchemy.orm import Session

from app.models.pipeline_template import PipelineTemplate, PipelineTemplateStage


def list_templates(db: Session, organization_id: str) -> List[PipelineTemplate]:
    stmt = select(PipelineTemplate).where(PipelineTemplate.organization_id == organization_id).order_by(
        PipelineTemplate.is_default.desc(), PipelineTemplate.created_at.asc()
    )
    return list(db.scalars(stmt).all())


def get_template(db: Session, template_id: str, organization_id: str) -> Optional[PipelineTemplate]:
    return db.scalar(
        select(PipelineTemplate).where(
            PipelineTemplate.id == template_id,
            PipelineTemplate.organization_id == organization_id,
        )
    )


def _apply_stage_changes(template: PipelineTemplate, stage_payloads):
    template.stages.clear()
    for stage in sorted(stage_payloads, key=lambda s: s.order_index):
        template.stages.append(
            PipelineTemplateStage(
                name=stage.name,
                order_index=stage.order_index,
                probability=stage.probability,
                sla_hours=stage.sla_hours,
                color=stage.color,
            )
        )


def _clear_default(db: Session, organization_id: str):
    db.query(PipelineTemplate).filter(
        PipelineTemplate.organization_id == organization_id,
        PipelineTemplate.is_default.is_(True),
    ).update({"is_default": False})


def create_template(
    *,
    db: Session,
    organization_id: str,
    created_by: str | None,
    data,
) -> PipelineTemplate:
    template = PipelineTemplate(
        organization_id=organization_id,
        name=data.name,
        description=data.description,
        is_default=data.is_default,
        created_by=created_by,
    )
    _apply_stage_changes(template, data.stages)
    if template.is_default:
        _clear_default(db, organization_id)
    db.add(template)
    db.commit()
    db.refresh(template)
    return template


def update_template(
    *,
    db: Session,
    template: PipelineTemplate,
    data,
) -> PipelineTemplate:
    template.name = data.name
    template.description = data.description
    if data.is_default and not template.is_default:
        _clear_default(db, template.organization_id)
    template.is_default = data.is_default
    if data.stages is not None:
        _apply_stage_changes(template, data.stages)
    db.commit()
    db.refresh(template)
    return template


def delete_template(db: Session, template: PipelineTemplate) -> None:
    db.delete(template)
    db.commit()
