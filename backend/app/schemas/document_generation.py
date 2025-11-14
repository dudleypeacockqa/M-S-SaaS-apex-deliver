"""
Document Generation Pydantic Schemas
Feature: F-009 Automated Document Generation
"""
from datetime import datetime
from typing import Optional, List, Dict, Any, Union
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict, field_serializer


# ============================================================================
# Template Schemas
# ============================================================================

class DocumentTemplateBase(BaseModel):
    """Base schema for document templates"""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    template_type: Optional[str] = Field(None, description="legal, proposal, report, etc.")
    content: str = Field(..., min_length=1, description="Template content with {{variables}}")
    variables: List[str] = Field(default_factory=list, description="List of variable names")


class DocumentTemplateCreate(DocumentTemplateBase):
    """Schema for creating a new document template"""
    organization_id: str = Field(..., min_length=36, max_length=36)
    created_by_user_id: str = Field(..., min_length=1)


class DocumentTemplateUpdate(BaseModel):
    """Schema for updating an existing document template"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    template_type: Optional[str] = None
    content: Optional[str] = Field(None, min_length=1)
    variables: Optional[List[str]] = None
    status: Optional[str] = Field(None, pattern="^(draft|active|archived)$")
    version: Optional[int] = Field(None, ge=1)

    model_config = ConfigDict(from_attributes=True)


class DocumentTemplateResponse(DocumentTemplateBase):
    """Schema for document template responses"""
    id: Union[str, UUID]
    status: str
    version: int
    organization_id: Union[str, UUID]
    created_by_user_id: Union[str, UUID]
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

    @field_serializer('id', 'organization_id', 'created_by_user_id')
    def serialize_uuid(self, value: Union[str, UUID]) -> str:
        """Convert UUID to string for JSON serialization"""
        return str(value) if value else None


# ============================================================================
# Generated Document Schemas
# ============================================================================

class GeneratedDocumentBase(BaseModel):
    """Base schema for generated documents"""
    generated_content: str = Field(..., min_length=1)
    variable_values: Dict[str, Any] = Field(default_factory=dict)
    file_path: Optional[str] = None


class GeneratedDocumentCreate(GeneratedDocumentBase):
    """Schema for creating a generated document"""
    template_id: str = Field(..., min_length=36, max_length=36)
    organization_id: str = Field(..., min_length=36, max_length=36)
    generated_by_user_id: str = Field(..., min_length=1)


class GeneratedDocumentUpdate(BaseModel):
    """Schema for updating a generated document"""
    generated_content: Optional[str] = Field(None, min_length=1)
    status: Optional[str] = Field(None, pattern="^(draft|generated|finalized|sent)$")
    file_path: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class GeneratedDocumentResponse(GeneratedDocumentBase):
    """Schema for generated document responses"""
    id: Union[str, UUID]
    template_id: Union[str, UUID]
    status: str
    organization_id: Union[str, UUID]
    generated_by_user_id: Union[str, UUID]
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

    @field_serializer('id', 'template_id', 'organization_id', 'generated_by_user_id')
    def serialize_uuid(self, value: Union[str, UUID]) -> str:
        """Convert UUID to string for JSON serialization"""
        return str(value) if value else None


# ============================================================================
# Template Rendering Schemas
# ============================================================================

class TemplateRenderRequest(BaseModel):
    """Schema for rendering a template with variable values"""
    variable_values: Dict[str, Any] = Field(..., description="Variable name to value mapping")
    generate_file: bool = Field(default=False, description="Whether to generate PDF/DOCX file")
    file_format: Optional[str] = Field(default="pdf", pattern="^(pdf|docx)$")


class TemplateRenderResponse(BaseModel):
    """Schema for template rendering response"""
    generated_document_id: Union[str, UUID]
    generated_content: str
    file_path: Optional[str] = None
    status: str

    model_config = ConfigDict(from_attributes=True)

    @field_serializer('generated_document_id')
    def serialize_uuid(self, value: Union[str, UUID]) -> str:
        """Convert UUID to string for JSON serialization"""
        return str(value) if value else None


# ============================================================================
# AI Suggestion Schemas
# ============================================================================

class AISuggestionBase(BaseModel):
    """Base schema for AI suggestions"""
    title: str = Field(..., min_length=1, max_length=255)
    content: str = Field(..., min_length=1)
    confidence: Optional[int] = Field(None, ge=0, le=100, description="Confidence score (0-100)")
    reasoning: Optional[str] = None


class AISuggestionCreate(AISuggestionBase):
    """Schema for creating an AI suggestion"""
    document_id: str = Field(..., min_length=36, max_length=36)
    organization_id: str = Field(..., min_length=36, max_length=36)
    created_by_user_id: str = Field(..., min_length=1)


class AISuggestionResponse(AISuggestionBase):
    """Schema for AI suggestion responses"""
    id: Union[str, UUID]
    document_id: Union[str, UUID]
    status: str
    organization_id: Union[str, UUID]
    created_by_user_id: Union[str, UUID]
    created_at: datetime
    updated_at: Optional[datetime] = None
    applied_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

    @field_serializer('id', 'document_id', 'organization_id', 'created_by_user_id')
    def serialize_uuid(self, value: Union[str, UUID]) -> str:
        """Convert UUID to string for JSON serialization"""
        return str(value) if value else None


class FetchSuggestionRequest(BaseModel):
    """Schema for fetching AI suggestions"""
    context: Optional[str] = None
    content: Optional[str] = None
    tone: Optional[str] = Field(None, pattern="^(professional|casual|formal|friendly)$")


# ============================================================================
# Version History Schemas
# ============================================================================

class DocumentVersionBase(BaseModel):
    """Base schema for document versions"""
    version_number: int = Field(..., ge=1)
    content: str = Field(..., min_length=1)
    label: Optional[str] = Field(None, max_length=100)
    summary: Optional[str] = None


class DocumentVersionCreate(DocumentVersionBase):
    """Schema for creating a document version"""
    document_id: str = Field(..., min_length=36, max_length=36)
    organization_id: str = Field(..., min_length=36, max_length=36)
    created_by_user_id: str = Field(..., min_length=1)


class DocumentVersionResponse(DocumentVersionBase):
    """Schema for document version responses"""
    id: Union[str, UUID]
    document_id: Union[str, UUID]
    organization_id: Union[str, UUID]
    created_by_user_id: Union[str, UUID]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @field_serializer('id', 'document_id', 'organization_id', 'created_by_user_id')
    def serialize_uuid(self, value: Union[str, UUID]) -> str:
        """Convert UUID to string for JSON serialization"""
        return str(value) if value else None


class DocumentVersionSummary(BaseModel):
    """Schema for document version summary (list view)"""
    id: Union[str, UUID]
    label: str
    created_at: datetime
    created_by: Optional[str] = None
    summary: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

    @field_serializer('id')
    def serialize_uuid(self, value: Union[str, UUID]) -> str:
        """Convert UUID to string for JSON serialization"""
        return str(value) if value else None


# ============================================================================
# Export Job Schemas
# ============================================================================

class ExportJobCreate(BaseModel):
    """Schema for creating an export job"""
    format: str = Field(..., description="Export format: application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/html")
    options: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Export options (margin, font_family, etc.)")


class ExportJobResponse(BaseModel):
    """Schema for export job responses"""
    task_id: Union[str, UUID] = Field(..., description="Export job ID")
    document_id: Union[str, UUID]
    status: str = Field(..., description="Job status: queued, processing, ready, failed")
    format: str
    file_path: Optional[str] = None
    download_url: Optional[str] = None
    failure_reason: Optional[str] = None
    queued_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

    @field_serializer('task_id', 'document_id')
    def serialize_uuid(self, value: Union[str, UUID]) -> str:
        """Convert UUID to string for JSON serialization"""
        return str(value) if value else None
