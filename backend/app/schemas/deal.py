"""Pydantic schemas for Deal CRUD operations."""
from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict

from app.models.deal import DealStage


class DealBase(BaseModel):
    """Base schema with common Deal fields."""

    name: str = Field(..., min_length=1, max_length=255, description="Deal name")
    target_company: str = Field(..., min_length=1, max_length=255, description="Target company name")
    industry: Optional[str] = Field(None, max_length=100, description="Industry sector")
    deal_size: Optional[Decimal] = Field(None, ge=0, description="Deal size (monetary value)")
    currency: str = Field("GBP", min_length=3, max_length=3, description="Currency code (ISO 4217)")
    stage: DealStage = Field(DealStage.sourcing, description="Current pipeline stage")
    description: Optional[str] = Field(None, description="Deal description/notes")


class DealCreate(DealBase):
    """Schema for creating a new deal."""

    pass  # Inherits all fields from DealBase


class DealUpdate(BaseModel):
    """Schema for updating an existing deal (all fields optional for partial updates)."""

    name: Optional[str] = Field(None, min_length=1, max_length=255)
    target_company: Optional[str] = Field(None, min_length=1, max_length=255)
    industry: Optional[str] = Field(None, max_length=100)
    deal_size: Optional[Decimal] = Field(None, ge=0)
    currency: Optional[str] = Field(None, min_length=3, max_length=3)
    stage: Optional[DealStage] = None
    description: Optional[str] = None


class DealResponse(DealBase):
    """Schema for deal responses (includes all fields)."""

    id: str
    organization_id: str
    owner_id: str
    created_at: datetime
    updated_at: datetime
    archived_at: Optional[datetime] = None
    is_archived: bool

    model_config = ConfigDict(from_attributes=True)


class DealListResponse(BaseModel):
    """Schema for paginated list of deals."""

    items: list[DealResponse]
    total: int
    page: int
    per_page: int


class DealStageUpdate(BaseModel):
    """Schema for updating only the deal stage."""

    stage: DealStage
