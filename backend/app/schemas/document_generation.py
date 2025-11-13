"""
Document Generation Pydantic Schemas
Feature: F-009 Automated Document Generation
"""
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict


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
    id: str
    status: str
    version: int
    organization_id: str
    created_by_user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


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
    status: Optional[str] = Field(None, pattern="^(draft|generated|finalized|sent)$")
    file_path: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class GeneratedDocumentResponse(GeneratedDocumentBase):
    """Schema for generated document responses"""
    id: str
    template_id: str
    status: str
    organization_id: str
    generated_by_user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


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
    generated_document_id: str
    generated_content: str
    file_path: Optional[str] = None
    status: str

    model_config = ConfigDict(from_attributes=True)
