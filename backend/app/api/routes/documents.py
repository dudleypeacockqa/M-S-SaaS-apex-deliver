"""Document and Folder API endpoints for secure data room functionality."""
from __future__ import annotations

import io
import math
from typing import List, Optional

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    Query,
    Request,
    UploadFile,
    status,
)
from fastapi.responses import FileResponse, StreamingResponse
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.document import (
    BulkDeleteRequest,
    BulkDeleteResponse,
    BulkDownloadRequest,
    DocumentListParams,
    DocumentMetadata,
    DocumentUploadResponse,
    FolderCreate,
    FolderResponse,
    FolderUpdate,
    PaginatedDocuments,
    PermissionLevel,
    PermissionCreate,
    PermissionResponse,
    DocumentAccessLogEntry,
)
from app.services import document_service
from app.services.storage_service import get_storage_service

router = APIRouter(prefix="/deals/{deal_id}", tags=["documents"])


# ============================================================================
# FOLDER ENDPOINTS
# ============================================================================


@router.post("/folders", response_model=FolderResponse, status_code=status.HTTP_201_CREATED)
def create_folder(
    deal_id: str,
    folder_data: FolderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create a new folder for organizing documents.

    Folders can be nested (parent_folder_id) for hierarchical organization.
    """
    try:
        folder = document_service.create_folder(
            db=db,
            payload=folder_data,
            deal_id=deal_id,
            current_user=current_user,
        )
        return folder
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/folders", response_model=List[FolderResponse])
def list_folders(
    deal_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    List all folders for a deal.

    Returns folder hierarchy for the specified deal.
    """
    folders = document_service.list_folders(
        deal_id=deal_id,
        organization_id=current_user.organization_id,
        db=db
    )
    return folders


@router.get("/folders/{folder_id}", response_model=FolderResponse)
def get_folder(
    deal_id: str,
    folder_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get folder details by ID.

    Returns folder metadata and document count.
    """
    folder = document_service.get_folder_by_id(
        folder_id=folder_id,
        organization_id=current_user.organization_id,
        db=db
    )
    if not folder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Folder not found"
        )

    return folder


@router.put("/folders/{folder_id}", response_model=FolderResponse)
def update_folder(
    deal_id: str,
    folder_id: str,
    folder_data: FolderUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Update folder metadata (name, parent folder).

    Supports partial updates - only provided fields will be updated.
    """
    folder = document_service.get_folder_by_id(
        folder_id=folder_id,
        organization_id=current_user.organization_id,
        db=db
    )
    if not folder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Folder not found"
        )

    updated_folder = document_service.update_folder(
        folder=folder,
        folder_data=folder_data,
        db=db,
        current_user=current_user,
    )
    return updated_folder


@router.delete("/folders/{folder_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_folder(
    deal_id: str,
    folder_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Delete a folder (must be empty).

    Folder cannot contain documents or subfolders.
    """
    folder = document_service.get_folder_by_id(
        folder_id=folder_id,
        organization_id=current_user.organization_id,
        db=db
    )
    if not folder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Folder not found"
        )

    try:
        document_service.delete_folder(
            folder=folder,
            db=db,
            current_user=current_user,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post(
    "/folders/{folder_id}/permissions",
    response_model=PermissionResponse,
    status_code=status.HTTP_201_CREATED,
)
def grant_folder_permission(
    deal_id: str,
    folder_id: str,
    permission_data: PermissionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    permission = document_service.grant_folder_permission(
        db=db,
        deal_id=deal_id,
        folder_id=folder_id,
        permission_data=permission_data,
        current_user=current_user,
    )
    return permission


@router.get("/folders/{folder_id}/permissions", response_model=List[PermissionResponse])
def list_folder_permissions(
    deal_id: str,
    folder_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return document_service.list_folder_permissions(
        db=db,
        deal_id=deal_id,
        folder_id=folder_id,
        current_user=current_user,
    )


# ============================================================================
# DOCUMENT ENDPOINTS
# ============================================================================


@router.post("/documents", response_model=DocumentUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    deal_id: str,
    file: UploadFile = File(...),
    folder_id: Optional[str] = Query(None, description="Folder ID to organize document"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Upload a document to the data room.

    File type and size validation:
    - Allowed types: PDF, Office documents, images
    - Maximum size: 50MB
    """
    try:
        document = await document_service.upload_document(
            db=db,
            file=file,
            deal_id=deal_id,
            current_user=current_user,
            folder_id=folder_id
        )
        return document
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/documents", response_model=PaginatedDocuments)
def list_documents(
    deal_id: str,
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(50, ge=1, le=100, description="Items per page"),
    folder_id: Optional[str] = Query(None, description="Filter by folder"),
    search: Optional[str] = Query(None, description="Search by filename"),
    file_type: Optional[str] = Query(None, description="Filter by file type"),
    include_archived: bool = Query(False, description="Include archived documents"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    List documents for a deal with pagination and filtering.

    Supports filtering by folder, file type, and search.
    """
    params = DocumentListParams(
        folder_id=folder_id,
        search=search,
        file_type=file_type,
        include_archived=include_archived,
        page=page,
        per_page=per_page
    )

    documents, total = document_service.list_documents(
        db=db,
        deal_id=deal_id,
        organization_id=current_user.organization_id,
        params=params,
        current_user=current_user,
    )

    return {
        "items": documents,
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": math.ceil(total / per_page) if total > 0 else 1,
    }


@router.post(
    "/documents/bulk-download",
    response_class=StreamingResponse,
    status_code=status.HTTP_200_OK,
)
async def bulk_download_documents(
    deal_id: str,
    payload: BulkDownloadRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Download multiple documents as a single ZIP archive (DEV-008)."""

    zip_bytes, filename = await document_service.bulk_download_documents(
        db=db,
        document_ids=[str(doc_id) for doc_id in payload.document_ids],
        organization_id=current_user.organization_id,
        current_user=current_user,
    )

    response = StreamingResponse(
        io.BytesIO(zip_bytes),
        media_type="application/zip",
    )
    response.headers["Content-Disposition"] = f"attachment; filename=\"{filename}\""
    return response


@router.get("/documents/{document_id}", response_model=DocumentMetadata)
def get_document(
    deal_id: str,
    document_id: str,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get document metadata by ID.

    Logs access for audit trail.
    """
    document = document_service.get_document_by_id(
        db=db,
        document_id=document_id,
        organization_id=current_user.organization_id,
    )
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )

    document_service.ensure_document_permission(
        db=db,
        document=document,
        user=current_user,
        minimum_level=PermissionLevel.VIEWER,
    )

    # Log access
    document_service.log_document_access(
        db=db,
        document=document,
        user=current_user,
        action="view",
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent")
    )

    return document


@router.put("/documents/{document_id}", response_model=DocumentMetadata)
def update_document(
    deal_id: str,
    document_id: str,
    folder_id: Optional[str] = Query(None, description="Move to folder (null for root)"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Update document metadata (e.g., move to folder).

    Currently supports moving documents between folders.
    """
    document = document_service.get_document_by_id(
        document_id=document_id,
        organization_id=current_user.organization_id,
        db=db
    )
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )

    document_service.ensure_document_permission(
        db=db,
        document=document,
        user=current_user,
        minimum_level=PermissionLevel.EDITOR,
        allow_editor_for_own=True,
    )

    updated_document = document_service.update_document_metadata(
        db=db,
        document=document,
        current_user=current_user,
        folder_id=folder_id,
    )
    return updated_document


@router.delete("/documents/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(
    deal_id: str,
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Soft-delete (archive) a document.

    Document can be restored later. Use permanent delete for hard deletion.
    """
    document = document_service.get_document_by_id(
        document_id=document_id,
        organization_id=current_user.organization_id,
        db=db
    )
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )

    document_service.ensure_document_permission(
        db=db,
        document=document,
        user=current_user,
        minimum_level=PermissionLevel.OWNER,
        allow_editor_for_own=True,
    )

    document_service.archive_document(
        db=db,
        document=document,
        performed_by=current_user,
    )


@router.post("/documents/{document_id}/download")
async def download_document(
    deal_id: str,
    document_id: str,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Download a document file.

    Logs download access for audit trail.
    """
    document = document_service.get_document_by_id(
        db=db,
        document_id=document_id,
        organization_id=current_user.organization_id,
    )
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )

    document_service.ensure_document_permission(
        db=db,
        document=document,
        user=current_user,
        minimum_level=PermissionLevel.VIEWER,
    )

    # Get file path from storage
    storage = get_storage_service()
    try:
        file_path = await storage.get_file_path(
            file_key=document.file_key,
            organization_id=str(current_user.organization_id)
        )
    except FileNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document file not found in storage"
        )

    # Log download
    document_service.log_document_access(
        db=db,
        document=document,
        user=current_user,
        action="download",
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent")
    )

    return FileResponse(
        path=str(file_path),
        filename=document.name,
        media_type=document.file_type
    )


@router.post("/documents/{document_id}/archive", status_code=status.HTTP_204_NO_CONTENT)
def archive_document_endpoint(
    deal_id: str,
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Archive a document (soft delete)."""
    document = document_service.get_document_by_id(
        db=db,
        document_id=document_id,
        organization_id=current_user.organization_id,
    )
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )

    document_service.ensure_document_permission(
        db=db,
        document=document,
        user=current_user,
        minimum_level=PermissionLevel.OWNER,
        allow_editor_for_own=True,
    )

    document_service.archive_document(
        db=db,
        document=document,
        performed_by=current_user,
    )


@router.post("/documents/{document_id}/restore", status_code=status.HTTP_204_NO_CONTENT)
def restore_document_endpoint(
    deal_id: str,
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Restore an archived document."""
    document = document_service.get_document_by_id(
        db=db,
        document_id=document_id,
        organization_id=current_user.organization_id,
    )
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )

    document_service.ensure_document_permission(
        db=db,
        document=document,
        user=current_user,
        minimum_level=PermissionLevel.OWNER,
    )

    document_service.restore_document(db=db, document=document)


# ============================================================================
# PERMISSION ENDPOINTS
# ============================================================================


@router.post("/documents/{document_id}/permissions", response_model=PermissionResponse, status_code=status.HTTP_201_CREATED)
def grant_permission(
    deal_id: str,
    document_id: str,
    permission_data: PermissionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Grant user permission to access a document.

    Permission levels: viewer, editor, owner
    """
    # Verify document exists
    document = document_service.get_document_by_id(
        db=db,
        document_id=document_id,
        organization_id=current_user.organization_id,
    )
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )

    document_service.ensure_document_permission(
        db=db,
        document=document,
        user=current_user,
        minimum_level=PermissionLevel.OWNER,
    )

    permission = document_service.grant_document_permission(
        db=db,
        document=document,
        permission_data=permission_data,
        granter=current_user,
    )
    return permission


@router.get("/documents/{document_id}/permissions", response_model=List[PermissionResponse])
def list_permissions(
    deal_id: str,
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    List all permissions for a document.

    Shows who has access and their permission level.
    """
    document = document_service.get_document_by_id(
        db=db,
        document_id=document_id,
        organization_id=current_user.organization_id,
    )
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

    document_service.ensure_document_permission(
        db=db,
        document=document,
        user=current_user,
        minimum_level=PermissionLevel.OWNER,
    )

    permissions = document_service.list_document_permissions(
        db=db,
        document_id=document_id,
        organization_id=current_user.organization_id,
    )
    return permissions


# ============================================================================
# ACCESS LOG ENDPOINTS
# ============================================================================


@router.get("/documents/{document_id}/access-logs", response_model=List[DocumentAccessLogEntry])
def get_access_logs(
    deal_id: str,
    document_id: str,
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of logs"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get access logs for a document (audit trail).

    Returns recent access history including views, downloads, and modifications.
    """
    document = document_service.get_document_by_id(
        db=db,
        document_id=document_id,
        organization_id=current_user.organization_id,
    )
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

    document_service.ensure_document_permission(
        db=db,
        document=document,
        user=current_user,
        minimum_level=PermissionLevel.OWNER,
    )

    logs = document_service.get_document_access_logs(
        db=db,
        document_id=document_id,
        organization_id=current_user.organization_id,
        limit=limit,
    )
    return logs


@router.get("/documents/{document_id}/versions", response_model=List[DocumentMetadata])
def get_document_versions(
    deal_id: str,
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get all versions of a document.

    Returns all versions in chronological order (oldest to newest).
    """
    versions = document_service.get_document_versions(
        db=db,
        document_id=document_id,
        organization_id=current_user.organization_id,
    )
    return versions


@router.post("/documents/{document_id}/restore/{version_id}", response_model=DocumentUploadResponse, status_code=status.HTTP_201_CREATED)
async def restore_document_version(
    deal_id: str,
    document_id: str,
    version_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Restore a previous version of a document.

    Creates a new version with the content of the specified version.
    """
    restored_doc = await document_service.restore_document_version(
        db=db,
        document_id=document_id,
        version_id=version_id,
        organization_id=current_user.organization_id,
        current_user=current_user,
    )
    return restored_doc


# ============================================================================
# BULK OPERATIONS (DEV-008 Phase 2)
# ============================================================================


@router.post("/documents/bulk-download")
async def bulk_download_documents(
    deal_id: str,
    request: BulkDownloadRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Bulk download multiple documents as a ZIP file.

    Returns a ZIP archive containing all requested documents that the user has permission to view.
    Documents without permission are silently skipped.
    Returns 403 if no documents are accessible.
    """
    from fastapi.responses import Response

    document_ids = [str(doc_id) for doc_id in request.document_ids]

    zip_content, filename = await document_service.bulk_download_documents(
        db=db,
        document_ids=document_ids,
        organization_id=current_user.organization_id,
        current_user=current_user,
    )

    return Response(
        content=zip_content,
        media_type="application/zip",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )


@router.post("/documents/bulk-delete", response_model=BulkDeleteResponse)
def bulk_delete_documents(
    deal_id: str,
    request: BulkDeleteRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Bulk delete (archive) multiple documents.

    Requires owner permission (deal owner or document uploader).
    Returns details about successful and failed deletions.
    Returns 403 if all documents fail due to insufficient permissions.
    """
    document_ids = [str(doc_id) for doc_id in request.document_ids]

    deleted_ids, failed_ids, failed_reasons = document_service.bulk_delete_documents(
        db=db,
        document_ids=document_ids,
        organization_id=current_user.organization_id,
        current_user=current_user,
    )

    # Check if ALL documents failed due to permission
    if len(failed_ids) == len(document_ids) and len(deleted_ids) == 0:
        # If all failed due to permission, return 403
        if all("permission" in str(reason).lower() or "forbidden" in str(reason).lower()
               for reason in failed_reasons.values()):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions to delete any of the requested documents",
            )

    return BulkDeleteResponse(
        deleted_count=len(deleted_ids),
        deleted_ids=deleted_ids,
        failed_ids=failed_ids,
        failed_reasons=failed_reasons,
    )
