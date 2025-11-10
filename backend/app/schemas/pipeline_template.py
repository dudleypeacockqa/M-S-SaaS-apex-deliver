"""Pydantic schemas for pipeline templates."""
from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator
from pydantic_core import PydanticCustomError


class PipelineTemplateStageBase(BaseModel):
    """Base stage payload shared across create/response schemas."""

    name: str = Field(..., min_length=1, max_length=120)
    order_index: float = Field(..., ge=0)
    probability: Optional[float] = Field(None, ge=0, le=100)
    sla_hours: Optional[int] = Field(None, ge=0)
    color: Optional[str] = Field(None)

    model_config = ConfigDict(from_attributes=True)

    @field_validator("color", mode="before")
    @classmethod
    def normalize_and_validate_color(cls, value: Optional[str]) -> Optional[str]:
        """Ensure colors always include a leading # and are uppercase, then validate format."""
        import re

        if value is None:
            return value

        # Normalize: strip, uppercase, add # if missing
        normalized = value.strip().upper()
        if not normalized:
            return None
        if not normalized.startswith("#"):
            normalized = f"#{normalized}"

        # Validate format after normalization
        if not re.match(r"^#[0-9A-F]{6}$", normalized):
            raise ValueError(f"Color must be a valid hex color code (e.g., #FF0000), got: {value}")

        return normalized


class PipelineTemplateStageCreate(PipelineTemplateStageBase):
    """Stage definition for create/update payloads."""

    pass


class PipelineTemplateStageResponse(PipelineTemplateStageBase):
    """Stage returned from API responses."""

    id: str
    created_at: datetime
    updated_at: datetime


class PipelineTemplateBase(BaseModel):
    """Base template payload."""

    name: str = Field(..., min_length=1, max_length=150)
    description: Optional[str] = None
    is_default: bool = False

    model_config = ConfigDict(from_attributes=True)


class PipelineTemplateCreate(PipelineTemplateBase):
    """Template creation payload."""

    stages: List[PipelineTemplateStageCreate]

    @field_validator("stages")
    @classmethod
    def validate_stages(
        cls, stages: List[PipelineTemplateStageCreate]
    ) -> List[PipelineTemplateStageCreate]:
        if not stages:
            raise PydanticCustomError("stage_length", "At least one stage is required")
        return stages


class PipelineTemplateUpdate(PipelineTemplateBase):
    """Template update payload."""

    stages: Optional[List[PipelineTemplateStageCreate]] = None


class PipelineTemplateResponse(PipelineTemplateBase):
    """Template response schema."""

    id: str
    organization_id: str
    created_at: datetime
    updated_at: datetime
    stages: List[PipelineTemplateStageResponse]



