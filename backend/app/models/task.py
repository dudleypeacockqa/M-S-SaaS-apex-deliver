"""Task models for DEV-012 task management & automation."""

from __future__ import annotations

from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, String, Text, func, JSON, Integer
from sqlalchemy.orm import relationship

from app.db.base import Base


class DealTask(Base):
    __tablename__ = "deal_tasks"

    id = Column(String(36), primary_key=True)
    deal_id = Column(String(36), ForeignKey("deals.id", ondelete="CASCADE"), nullable=False)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)

    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(32), nullable=False, default="todo")
    priority = Column(String(32), nullable=False, default="normal")
    stage_gate = Column(String(64), nullable=True)

    assignee_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    due_date = Column(DateTime(timezone=True), nullable=True)

    created_by = Column(String(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    deal = relationship("Deal", back_populates="tasks")
    organization = relationship("Organization")
    assignee = relationship("User", foreign_keys=[assignee_id])
    creator = relationship("User", foreign_keys=[created_by])


class TaskTemplate(Base):
    __tablename__ = "task_templates"

    id = Column(String(36), primary_key=True)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    tasks_definition = Column(JSON, nullable=False)
    created_by = Column(String(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    organization = relationship("Organization")
    creator = relationship("User", foreign_keys=[created_by])
    automation_rules = relationship("TaskAutomationRule", back_populates="template", cascade="all, delete-orphan")


class TaskAutomationRule(Base):
    __tablename__ = "task_automation_rules"

    id = Column(String(36), primary_key=True)
    deal_id = Column(String(36), ForeignKey("deals.id", ondelete="CASCADE"), nullable=False)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    template_id = Column(String(36), ForeignKey("task_templates.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    trigger = Column(String(64), nullable=False)
    action = Column(String(64), nullable=False)
    suppress_minutes = Column(Integer, default=0, nullable=False)
    created_by = Column(String(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    organization = relationship("Organization")
    deal = relationship("Deal", back_populates="task_automation_rules")
    template = relationship("TaskTemplate", back_populates="automation_rules")
    creator = relationship("User", foreign_keys=[created_by])
    logs = relationship("TaskAutomationLog", back_populates="rule", cascade="all, delete-orphan")


class TaskAutomationLog(Base):
    __tablename__ = "task_automation_logs"

    id = Column(String(36), primary_key=True)
    deal_id = Column(String(36), ForeignKey("deals.id", ondelete="CASCADE"), nullable=False)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    rule_id = Column(String(36), ForeignKey("task_automation_rules.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(32), nullable=False)
    message = Column(Text, nullable=True)
    triggered_by = Column(String(36), ForeignKey("users.id"), nullable=False)
    triggered_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    organization = relationship("Organization")
    deal = relationship("Deal", back_populates="task_automation_logs")
    rule = relationship("TaskAutomationRule", back_populates="logs")
    triggered_user = relationship("User", foreign_keys=[triggered_by])

