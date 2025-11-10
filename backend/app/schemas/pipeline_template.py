"""Pydantic schemas for pipeline templates."""
from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field, validator


class PipelineTemplateStageBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    order_index: float = Field(..., ge=0)
    probability: Optional[float] = Field(None, ge=0, le=100)
    sla_hours: Optional[int] = Field(None, ge=0)
    color: Optional[str] = Field(None, pattern=r"^#?[0-9a-fA-F]{6}$")

    @validator("color")
    def normalize_color(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return value
        if not value.startswith("#"):
            return f"#{value}"
        return value


class PipelineTemplateStageCreate(PipelineTemplateStageBase):
    pass


class PipelineTemplateStageResponse(PipelineTemplateStageBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class PipelineTemplateBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=150)
    description: Optional[str] = None
    is_default: bool = False


class PipelineTemplateCreate(PipelineTemplateBase):
    stages: List[PipelineTemplateStageCreate]

    @validator("stages")
    def validate_stages(cls, stages: List[PipelineTemplateStageCreate]) -> List[PipelineTemplateStageCreate]:
        if not stages:
            raise ValueError("At least one stage is required")
        return stages


class PipelineTemplateUpdate(PipelineTemplateBase):
    stages: Optional[List[PipelineTemplateStageCreate]] = None


class PipelineTemplateResponse(PipelineTemplateBase):
    id: str
    organization_id: str
    created_at: datetime
    updated_at: datetime
    stages: List[PipelineTemplateStageResponse]

    class Config:
        orm_mode = True
