"""
Document Generation Models
Feature: F-009 Automated Document Generation
"""
from datetime import datetime, UTC
from sqlalchemy import Column, String, Text, JSON, ForeignKey, Integer, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
import uuid
import enum

from app.db.base import Base


class TemplateStatus(str, enum.Enum):
    """Document template status"""
    DRAFT = "draft"
    ACTIVE = "active"
    ARCHIVED = "archived"


class DocumentStatus(str, enum.Enum):
    """Generated document status"""
    DRAFT = "draft"
    GENERATED = "generated"
    FINALIZED = "finalized"
    SENT = "sent"


class DocumentTemplate(Base):
    """Document template for automated generation"""
    __tablename__ = "document_templates"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    description = Column(Text)
    template_type = Column(String)  # legal, proposal, report, etc.
    content = Column(Text, nullable=False)  # Template content with {{variables}}
    variables = Column(JSON, default=list)  # List of variable names
    status = Column(SQLEnum(TemplateStatus), default=TemplateStatus.ACTIVE, nullable=False)
    version = Column(Integer, default=1)

    # Multi-tenancy
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)

    # Audit fields
    created_by_user_id = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime(timezone=True), onupdate=lambda: datetime.now(UTC))

    # Relationships
    generated_documents = relationship("GeneratedDocument", back_populates="template")

    def __repr__(self):
        return f"<DocumentTemplate(id={self.id}, name={self.name})>"


class GeneratedDocument(Base):
    """Generated document from a template"""
    __tablename__ = "generated_documents"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    template_id = Column(String(36), ForeignKey("document_templates.id"), nullable=False)
    generated_content = Column(Text, nullable=False)
    variable_values = Column(JSON, default=dict)  # Actual values used for variables
    file_path = Column(String)  # Path to generated PDF/DOCX
    status = Column(SQLEnum(DocumentStatus), default=DocumentStatus.GENERATED, nullable=False)

    # Multi-tenancy
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)

    # Audit fields
    generated_by_user_id = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime(timezone=True), onupdate=lambda: datetime.now(UTC))

    # Relationships
    template = relationship("DocumentTemplate", back_populates="generated_documents")

    def __repr__(self):
        return f"<GeneratedDocument(id={self.id}, template_id={self.template_id}, status={self.status})>"


# Type alias for template variables
TemplateVariable = dict  # {name: str, type: str, required: bool, default: Any}
