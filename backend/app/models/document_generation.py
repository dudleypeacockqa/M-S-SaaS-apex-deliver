"""
Document Generation Models
Feature: F-009 Automated Document Generation
"""
from datetime import datetime, UTC
from sqlalchemy import Column, String, Text, JSON, ForeignKey, Integer, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
import uuid
import enum

from app.db.base import Base, GUID


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

class DocumentExportStatus(str, enum.Enum):
    """Document export job status"""
    QUEUED = "queued"
    PROCESSING = "processing"
    READY = "ready"
    FAILED = "failed"


class DocumentTemplate(Base):
    """Document template for automated generation"""
    __tablename__ = "document_templates"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(Text)
    template_type = Column(String)  # legal, proposal, report, etc.
    content = Column(Text, nullable=False)  # Template content with {{variables}}
    variables = Column(JSON, default=list)  # List of variable names
    status = Column(SQLEnum(TemplateStatus), default=TemplateStatus.ACTIVE, nullable=False)
    version = Column(Integer, default=1)

    # Multi-tenancy
    organization_id = Column(GUID, ForeignKey("organizations.id"), nullable=False)

    # Audit fields
    created_by_user_id = Column(GUID, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime(timezone=True), onupdate=lambda: datetime.now(UTC))

    # Relationships
    generated_documents = relationship("GeneratedDocument", back_populates="template")

    def __repr__(self):
        return f"<DocumentTemplate(id={self.id}, name={self.name})>"


class GeneratedDocument(Base):
    """Generated document from a template"""
    __tablename__ = "generated_documents"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    template_id = Column(GUID, ForeignKey("document_templates.id"), nullable=False)
    generated_content = Column(Text, nullable=False)
    variable_values = Column(JSON, default=dict)  # Actual values used for variables
    file_path = Column(String)  # Path to generated PDF/DOCX (stores file_key|format)
    status = Column(SQLEnum(DocumentStatus), default=DocumentStatus.GENERATED, nullable=False)

    # Multi-tenancy
    organization_id = Column(GUID, ForeignKey("organizations.id"), nullable=False)

    # Audit fields
    generated_by_user_id = Column(GUID, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime(timezone=True), onupdate=lambda: datetime.now(UTC))

    # Relationships
    template = relationship("DocumentTemplate", back_populates="generated_documents")
    ai_suggestions = relationship("DocumentAISuggestion", back_populates="document", cascade="all, delete-orphan")
    versions = relationship("DocumentVersion", back_populates="document", cascade="all, delete-orphan")
    export_jobs = relationship("DocumentExportJob", back_populates="document", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<GeneratedDocument(id={self.id}, template_id={self.template_id}, status={self.status})>"


class SuggestionStatus(str, enum.Enum):
    """AI suggestion status"""
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    APPLIED = "applied"


class DocumentAISuggestion(Base):
    """AI suggestion for a generated document"""
    __tablename__ = "document_ai_suggestions"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    document_id = Column(GUID, ForeignKey("generated_documents.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    confidence = Column(Integer)  # Confidence score (0-100)
    reasoning = Column(Text)  # AI reasoning for the suggestion
    status = Column(SQLEnum(SuggestionStatus), default=SuggestionStatus.PENDING, nullable=False)

    # Multi-tenancy
    organization_id = Column(GUID, ForeignKey("organizations.id"), nullable=False)

    # Audit fields
    created_by_user_id = Column(GUID, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime(timezone=True), onupdate=lambda: datetime.now(UTC))
    applied_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    document = relationship("GeneratedDocument", back_populates="ai_suggestions")

    def __repr__(self):
        return f"<DocumentAISuggestion(id={self.id}, document_id={self.document_id}, status={self.status})>"


class DocumentVersion(Base):
    """Version history for a generated document"""
    __tablename__ = "document_versions"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    document_id = Column(GUID, ForeignKey("generated_documents.id", ondelete="CASCADE"), nullable=False)
    version_number = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    label = Column(String)  # Optional version label (e.g., "v1.0", "Final")
    summary = Column(Text)  # Optional version summary

    # Multi-tenancy
    organization_id = Column(GUID, ForeignKey("organizations.id"), nullable=False)

    # Audit fields
    created_by_user_id = Column(GUID, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))

    # Relationships
    document = relationship("GeneratedDocument", back_populates="versions")

    def __repr__(self):
        return f"<DocumentVersion(id={self.id}, document_id={self.document_id}, version_number={self.version_number})>"


# Type alias for template variables
TemplateVariable = dict  # {name: str, type: str, required: bool, default: Any}


class DocumentExportJob(Base):
    """Tracks asynchronous document export jobs"""

    __tablename__ = "document_export_jobs"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    document_id = Column(GUID, ForeignKey("generated_documents.id", ondelete="CASCADE"), nullable=False)
    organization_id = Column(GUID, ForeignKey("organizations.id"), nullable=False)
    requested_by_user_id = Column(GUID, nullable=False)
    format = Column(String, nullable=False)
    options = Column(JSON, default=dict)
    status = Column(SQLEnum(DocumentExportStatus), default=DocumentExportStatus.QUEUED, nullable=False)
    file_path = Column(String)
    download_url = Column(String)
    failure_reason = Column(Text)
    queued_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    started_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    updated_at = Column(DateTime(timezone=True), onupdate=lambda: datetime.now(UTC))

    document = relationship("GeneratedDocument", back_populates="export_jobs")

    def __repr__(self):
        return f"<DocumentExportJob(id={self.id}, document_id={self.document_id}, status={self.status})>"

