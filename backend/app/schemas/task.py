"""Pydantic schemas for task management (DEV-012)."""

from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field, ConfigDict


class TaskCreate(BaseModel):
    title: str = Field(..., max_length=255)
    description: Optional[str] = None
    status: str = Field(default="todo", max_length=32)
    priority: str = Field(default="normal", max_length=32)
    stage_gate: Optional[str] = Field(default=None, max_length=64)
    assignee_id: Optional[str] = Field(default=None, max_length=36)
    due_date: Optional[datetime] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(default=None, max_length=255)
    description: Optional[str] = None
    status: Optional[str] = Field(default=None, max_length=32)
    priority: Optional[str] = Field(default=None, max_length=32)
    stage_gate: Optional[str] = Field(default=None, max_length=64)
    assignee_id: Optional[str] = Field(default=None, max_length=36)
    due_date: Optional[datetime] = None
    completed_at: Optional[datetime] = None


class TaskResponse(BaseModel):
    id: str
    deal_id: str
    organization_id: str
    title: str
    description: Optional[str]
    status: str
    priority: str
    stage_gate: Optional[str]
    assignee_id: Optional[str]
    due_date: Optional[datetime]
    created_by: str
    created_at: datetime
    updated_at: Optional[datetime]
    completed_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)


class TaskListResponse(BaseModel):
    total: int
    items: List[TaskResponse]


class TaskTemplateTask(BaseModel):
    title: str = Field(..., max_length=255)
    description: Optional[str] = None
    priority: str = Field(default="normal", max_length=32)
    stage_gate: Optional[str] = Field(default=None, max_length=64)


class TaskTemplateCreate(BaseModel):
    name: str = Field(..., max_length=255)
    description: Optional[str] = None
    tasks: List[TaskTemplateTask]


class TaskTemplateResponse(BaseModel):
    id: str
    organization_id: str
    name: str
    description: Optional[str]
    tasks: List[TaskTemplateTask]
    created_by: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TaskAutomationRuleCreate(BaseModel):
    name: str = Field(..., max_length=255)
    trigger: str = Field(..., max_length=64)
    action: str = Field(..., max_length=64)
    template_id: str = Field(..., max_length=36)
    suppress_minutes: int = Field(default=0, ge=0)


class TaskAutomationRuleResponse(BaseModel):
    id: str
    deal_id: str
    organization_id: str
    template_id: str
    name: str
    trigger: str
    action: str
    suppress_minutes: int
    created_by: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TaskAutomationLogResponse(BaseModel):
    id: str
    deal_id: str
    organization_id: str
    rule_id: str
    status: str
    message: Optional[str]
    triggered_by: str
    triggered_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TaskAutomationLogList(BaseModel):
    items: List[TaskAutomationLogResponse]

