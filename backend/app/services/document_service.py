"""Service layer for Document and Folder CRUD operations."""
from __future__ import annotations

from datetime import datetime, timezone
from typing import BinaryIO, Optional
from uuid import UUID

from fastapi import UploadFile
from sqlalchemy import select, func, or_
from sqlalchemy.orm import Session

from app.models.document import Document, Folder, DocumentPermission, DocumentAccessLog
from app.models.user import User
from app.schemas.document import (
    FolderCreate,
    FolderUpdate,
    DocumentListParams,
    PermissionCreate,
    ALLOWED_FILE_TYPES,
    MAX_FILE_SIZE,
    MAX_VERSIONS_PER_DOCUMENT,
)
from app.services.storage_service import get_storage_service


# ============================================================================
# FOLDER OPERATIONS
# ============================================================================


def create_folder(
    folder_data: FolderCreate,
    deal_id: str,
    user: User,
    db: Session
) -> Folder:
    """
    Create a new folder for document organization.

    Args:
        folder_data: Folder creation data
        deal_id: Deal ID this folder belongs to
        user: User creating the folder
        db: Database session

    Returns:
        Created folder instance

    Raises:
        ValueError: If parent folder doesn't exist or circular reference
    """
    # Validate parent folder exists if specified
    if folder_data.parent_folder_id:
        parent = db.scalar(
            select(Folder).where(
                Folder.id == folder_data.parent_folder_id,
                Folder.organization_id == user.organization_id
            )
        )
        if not parent:
            raise ValueError("Parent folder not found")

    folder = Folder(
        name=folder_data.name,
        deal_id=deal_id,
        parent_folder_id=folder_data.parent_folder_id,
        organization_id=user.organization_id,
        created_by=user.id,
    )
    db.add(folder)
    db.commit()
    db.refresh(folder)
    return folder


def list_folders(deal_id: str, organization_id: UUID, db: Session) -> list[Folder]:
    """
    List all folders for a deal.

    Args:
        deal_id: Deal ID
        organization_id: Organization ID for multi-tenant isolation
        db: Database session

    Returns:
        List of folders (hierarchical)
    """
    return list(db.scalars(
        select(Folder).where(
            Folder.deal_id == deal_id,
            Folder.organization_id == organization_id
        ).order_by(Folder.created_at)
    ))


def get_folder_by_id(
    folder_id: str,
    organization_id: UUID,
    db: Session
) -> Optional[Folder]:
    """
    Get folder by ID (organization-scoped).

    Args:
        folder_id: Folder ID
        organization_id: Organization ID for multi-tenant isolation
        db: Database session

    Returns:
        Folder instance or None
    """
    return db.scalar(
        select(Folder).where(
            Folder.id == folder_id,
            Folder.organization_id == organization_id
        )
    )


def update_folder(
    folder: Folder,
    folder_data: FolderUpdate,
    db: Session
) -> Folder:
    """
    Update folder metadata.

    Args:
        folder: Existing folder instance
        folder_data: Update data
        db: Database session

    Returns:
        Updated folder instance
    """
    if folder_data.name is not None:
        folder.name = folder_data.name
    if folder_data.parent_folder_id is not None:
        folder.parent_folder_id = folder_data.parent_folder_id

    db.commit()
    db.refresh(folder)
    return folder


def delete_folder(folder: Folder, db: Session) -> None:
    """
    Delete folder (must be empty).

    Args:
        folder: Folder to delete
        db: Database session

    Raises:
        ValueError: If folder contains documents or subfolders
    """
    # Check for documents
    doc_count = db.scalar(
        select(func.count()).select_from(Document).where(Document.folder_id == folder.id)
    )
    if doc_count > 0:
        raise ValueError(f"Folder contains {doc_count} documents. Cannot delete.")

    # Check for subfolders
    subfolder_count = db.scalar(
        select(func.count()).select_from(Folder).where(Folder.parent_folder_id == folder.id)
    )
    if subfolder_count > 0:
        raise ValueError(f"Folder contains {subfolder_count} subfolders. Cannot delete.")

    db.delete(folder)
    db.commit()


# ============================================================================
# DOCUMENT OPERATIONS
# ============================================================================


async def upload_document(
    file: UploadFile,
    deal_id: str,
    user: User,
    db: Session,
    folder_id: Optional[str] = None
) -> Document:
    """
    Upload document and create metadata record.

    Args:
        file: Uploaded file
        deal_id: Deal ID
        user: User uploading the document
        db: Database session
        folder_id: Optional folder ID to organize document

    Returns:
        Created document instance

    Raises:
        ValueError: If file type/size invalid or folder not found
    """
    # Validate file type
    if file.content_type not in ALLOWED_FILE_TYPES:
        raise ValueError(
            f"File type '{file.content_type}' not allowed. "
            f"Allowed types: {', '.join(ALLOWED_FILE_TYPES)}"
        )

    # Validate file size
    file_content = await file.read()
    file_size = len(file_content)
    if file_size > MAX_FILE_SIZE:
        raise ValueError(
            f"File size {file_size} bytes exceeds maximum {MAX_FILE_SIZE} bytes"
        )

    # Validate folder exists if specified
    if folder_id:
        folder = db.scalar(
            select(Folder).where(
                Folder.id == folder_id,
                Folder.organization_id == user.organization_id
            )
        )
        if not folder:
            raise ValueError("Folder not found")

    # Generate storage key
    storage = get_storage_service()
    file_key = storage.generate_file_key(
        organization_id=str(user.organization_id),
        deal_id=deal_id,
        filename=file.filename or "unknown",
        user_id=str(user.id)
    )

    # Save file to storage
    await file.seek(0)  # Reset file pointer
    await storage.save_file(
        file_key=file_key,
        file_stream=file.file,
        organization_id=str(user.organization_id)
    )

    # Create metadata record
    document = Document(
        name=file.filename or "untitled",
        file_key=file_key,
        file_size=file_size,
        file_type=file.content_type or "application/octet-stream",
        deal_id=deal_id,
        folder_id=folder_id,
        organization_id=user.organization_id,
        uploaded_by=user.id,
        version=1,
    )
    db.add(document)
    db.commit()
    db.refresh(document)

    # Log access
    log_document_access(
        document_id=document.id,
        user=user,
        action="upload",
        db=db
    )

    return document


def list_documents(
    deal_id: str,
    organization_id: UUID,
    params: DocumentListParams,
    db: Session
) -> tuple[list[Document], int]:
    """
    List documents with pagination and filtering.

    Args:
        deal_id: Deal ID
        organization_id: Organization ID for multi-tenant isolation
        params: Query parameters
        db: Database session

    Returns:
        Tuple of (document list, total count)
    """
    # Base query
    query = select(Document).where(
        Document.deal_id == deal_id,
        Document.organization_id == organization_id
    )

    # Filter: archived
    if not params.include_archived:
        query = query.where(Document.archived_at.is_(None))

    # Filter: folder
    if params.folder_id:
        query = query.where(Document.folder_id == params.folder_id)

    # Filter: file type
    if params.file_type:
        query = query.where(Document.file_type == params.file_type)

    # Filter: uploaded by
    if params.uploaded_by:
        query = query.where(Document.uploaded_by == params.uploaded_by)

    # Filter: date range
    if params.uploaded_after:
        query = query.where(Document.created_at >= params.uploaded_after)
    if params.uploaded_before:
        query = query.where(Document.created_at <= params.uploaded_before)

    # Filter: search
    if params.search:
        search_term = f"%{params.search}%"
        query = query.where(Document.name.ilike(search_term))

    # Get total count
    total = db.scalar(select(func.count()).select_from(query.subquery()))

    # Pagination
    offset = (params.page - 1) * params.per_page
    query = query.order_by(Document.created_at.desc()).offset(offset).limit(params.per_page)

    documents = list(db.scalars(query))
    return documents, total or 0


def get_document_by_id(
    document_id: str,
    organization_id: UUID,
    db: Session
) -> Optional[Document]:
    """
    Get document by ID (organization-scoped).

    Args:
        document_id: Document ID
        organization_id: Organization ID for multi-tenant isolation
        db: Database session

    Returns:
        Document instance or None
    """
    return db.scalar(
        select(Document).where(
            Document.id == document_id,
            Document.organization_id == organization_id
        )
    )


def update_document_metadata(
    document: Document,
    folder_id: Optional[str],
    db: Session
) -> Document:
    """
    Update document metadata (e.g., move to folder).

    Args:
        document: Existing document instance
        folder_id: New folder ID (or None to move to root)
        db: Database session

    Returns:
        Updated document instance
    """
    document.folder_id = folder_id
    db.commit()
    db.refresh(document)
    return document


def archive_document(document: Document, db: Session) -> Document:
    """
    Soft-delete document (archive).

    Args:
        document: Document to archive
        db: Database session

    Returns:
        Archived document instance
    """
    document.archived_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(document)
    return document


def restore_document(document: Document, db: Session) -> Document:
    """
    Restore archived document.

    Args:
        document: Archived document to restore
        db: Database session

    Returns:
        Restored document instance
    """
    document.archived_at = None
    db.commit()
    db.refresh(document)
    return document


def permanently_delete_document(document: Document, db: Session) -> None:
    """
    Permanently delete document and file.

    Args:
        document: Document to delete
        db: Database session
    """
    # Delete physical file
    storage = get_storage_service()
    storage.delete_file(
        file_key=document.file_key,
        organization_id=str(document.organization_id)
    )

    # Delete database record
    db.delete(document)
    db.commit()


# ============================================================================
# PERMISSION OPERATIONS
# ============================================================================


def grant_document_permission(
    document_id: str,
    permission_data: PermissionCreate,
    granter: User,
    db: Session
) -> DocumentPermission:
    """
    Grant user permission to document.

    Args:
        document_id: Document ID
        permission_data: Permission data
        granter: User granting the permission
        db: Database session

    Returns:
        Created permission instance
    """
    permission = DocumentPermission(
        document_id=document_id,
        user_id=permission_data.user_id,
        permission_level=permission_data.permission_level,
        organization_id=granter.organization_id,
        granted_by=granter.id,
    )
    db.add(permission)
    db.commit()
    db.refresh(permission)
    return permission


def list_document_permissions(
    document_id: str,
    organization_id: UUID,
    db: Session
) -> list[DocumentPermission]:
    """
    List all permissions for a document.

    Args:
        document_id: Document ID
        organization_id: Organization ID for multi-tenant isolation
        db: Database session

    Returns:
        List of permissions
    """
    return list(db.scalars(
        select(DocumentPermission).where(
            DocumentPermission.document_id == document_id,
            DocumentPermission.organization_id == organization_id
        )
    ))


# ============================================================================
# ACCESS LOG OPERATIONS
# ============================================================================


def log_document_access(
    document_id: UUID,
    user: User,
    action: str,
    db: Session,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None
) -> DocumentAccessLog:
    """
    Log document access for audit trail.

    Args:
        document_id: Document ID
        user: User performing the action
        action: Action type (view, download, upload, delete)
        db: Database session
        ip_address: Optional IP address
        user_agent: Optional user agent string

    Returns:
        Created log entry
    """
    log = DocumentAccessLog(
        document_id=document_id,
        user_id=user.id,
        action=action,
        ip_address=ip_address,
        user_agent=user_agent,
        organization_id=user.organization_id,
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


def get_document_access_logs(
    document_id: str,
    organization_id: UUID,
    db: Session,
    limit: int = 100
) -> list[DocumentAccessLog]:
    """
    Get access logs for a document.

    Args:
        document_id: Document ID
        organization_id: Organization ID for multi-tenant isolation
        db: Database session
        limit: Maximum number of logs to return

    Returns:
        List of access logs (most recent first)
    """
    return list(db.scalars(
        select(DocumentAccessLog).where(
            DocumentAccessLog.document_id == document_id,
            DocumentAccessLog.organization_id == organization_id
        ).order_by(DocumentAccessLog.created_at.desc()).limit(limit)
    ))
