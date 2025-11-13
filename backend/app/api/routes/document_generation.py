"""
Document Generation API Routes
Feature: F-009 Automated Document Generation
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api.dependencies.auth import get_current_user
from app.models.user import User
from app.models.document_generation import DocumentStatus
from app.schemas.document_generation import (
    DocumentTemplateCreate,
    DocumentTemplateUpdate,
    DocumentTemplateResponse,
    GeneratedDocumentResponse,
    TemplateRenderRequest,
    TemplateRenderResponse,
)
from app.services.document_generation_service import DocumentGenerationService


router = APIRouter(prefix="/api/document-generation", tags=["document-generation"])


# ============================================================================
# Document Template Endpoints
# ============================================================================

@router.post("/templates", response_model=DocumentTemplateResponse, status_code=201)
def create_template(
    template_data: DocumentTemplateCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create a new document template

    Requires authentication and organization membership.
    """
    # Ensure user can only create templates for their organization
    if template_data.organization_id != current_user.organization_id:
        raise HTTPException(status_code=403, detail="Cannot create template for another organization")

    # Override created_by_user_id with current user
    template_data.created_by_user_id = current_user.id

    template = DocumentGenerationService.create_template(db, template_data)
    return template


@router.get("/templates", response_model=List[DocumentTemplateResponse])
def list_templates(
    status: Optional[str] = Query(None, pattern="^(draft|active|archived)$"),
    template_type: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    List all document templates for the current user's organization

    Optional filters:
    - status: draft, active, or archived
    - template_type: legal, proposal, report, etc.
    """
    templates = DocumentGenerationService.list_templates(
        db,
        organization_id=current_user.organization_id,
        status=status,
        template_type=template_type,
        skip=skip,
        limit=limit,
    )
    return templates


@router.get("/templates/{template_id}", response_model=DocumentTemplateResponse)
def get_template(
    template_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a specific document template by ID"""
    template = DocumentGenerationService.get_template(
        db,
        template_id=template_id,
        organization_id=current_user.organization_id,
    )

    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    return template


@router.put("/templates/{template_id}", response_model=DocumentTemplateResponse)
def update_template(
    template_id: str,
    update_data: DocumentTemplateUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update an existing document template"""
    template = DocumentGenerationService.update_template(
        db,
        template_id=template_id,
        organization_id=current_user.organization_id,
        update_data=update_data,
    )

    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    return template


@router.delete("/templates/{template_id}", status_code=204)
def delete_template(
    template_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Archive a document template (soft delete)"""
    deleted = DocumentGenerationService.delete_template(
        db,
        template_id=template_id,
        organization_id=current_user.organization_id,
    )

    if not deleted:
        raise HTTPException(status_code=404, detail="Template not found")

    return None


# ============================================================================
# Document Generation Endpoints
# ============================================================================

@router.post(
    "/templates/{template_id}/generate",
    response_model=TemplateRenderResponse,
    status_code=201,
)
def generate_document(
    template_id: str,
    render_request: TemplateRenderRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Generate a document from a template

    Replaces {{variables}} in the template with provided values.
    Optionally generates a PDF or DOCX file.
    """
    try:
        generated = DocumentGenerationService.generate_document(
            db,
            template_id=template_id,
            organization_id=current_user.organization_id,
            generated_by_user_id=current_user.id,
            render_request=render_request,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    if not generated:
        raise HTTPException(status_code=404, detail="Template not found or not active")

    return TemplateRenderResponse(
        generated_document_id=generated.id,
        generated_content=generated.generated_content,
        file_path=generated.file_path,
        status=generated.status.value,
    )


# ============================================================================
# Generated Document Endpoints
# ============================================================================

@router.get("/documents", response_model=List[GeneratedDocumentResponse])
def list_generated_documents(
    template_id: Optional[str] = None,
    status: Optional[str] = Query(None, pattern="^(draft|generated|finalized|sent)$"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    List all generated documents for the current user's organization

    Optional filters:
    - template_id: filter by source template
    - status: draft, generated, finalized, or sent
    """
    documents = DocumentGenerationService.list_generated_documents(
        db,
        organization_id=current_user.organization_id,
        template_id=template_id,
        status=status,
        skip=skip,
        limit=limit,
    )
    return documents


@router.get("/documents/{document_id}", response_model=GeneratedDocumentResponse)
def get_generated_document(
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a specific generated document by ID"""
    document = DocumentGenerationService.get_generated_document(
        db,
        document_id=document_id,
        organization_id=current_user.organization_id,
    )

    if not document:
        raise HTTPException(status_code=404, detail="Generated document not found")

    return document


@router.patch("/documents/{document_id}/status", response_model=GeneratedDocumentResponse)
def update_document_status(
    document_id: str,
    status: str = Query(..., pattern="^(draft|generated|finalized|sent)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update the status of a generated document"""
    document = DocumentGenerationService.update_generated_document_status(
        db,
        document_id=document_id,
        organization_id=current_user.organization_id,
        new_status=DocumentStatus(status),
    )

    if not document:
        raise HTTPException(status_code=404, detail="Generated document not found")

    return document
