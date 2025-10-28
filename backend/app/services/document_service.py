"""Document service layer for secure data room operations."""
from __future__ import annotations

import math
import os
from collections import defaultdict
from datetime import datetime, timezone
from typing import Optional, Tuple
from uuid import UUID, uuid4

from fastapi import HTTPException, UploadFile, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.deal import Deal
from app.models.document import (
    Document,
    DocumentAccessLog,
    DocumentPermission,
    Folder,
)
from app.models.user import User
from app.schemas.document import (
    ALLOWED_FILE_TYPES,
    MAX_FILE_SIZE,
    DocumentAccessLogEntry,
    DocumentListParams,
    DocumentMetadata,
    DocumentUploadResponse,
    FolderCreate,
    FolderResponse,
    FolderUpdate,
    PermissionCreate,
    PermissionResponse,
)
from app.services.storage_service import get_storage_service


def _ensure_deal_access(db: Session, deal_id: str, user: User) -> Deal:
    deal = db.get(Deal, deal_id)
    if deal is None or deal.organization_id != user.organization_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Deal not found")
    return deal


def _ensure_folder_access(
    db: Session, folder_id: Optional[str], deal: Deal
) -> Optional[Folder]:
    if folder_id is None:
        return None
    folder = db.get(Folder, folder_id)
    if folder is None or folder.deal_id != str(deal.id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Folder not found")
    return folder


def _folder_to_response(folder: Folder, *, document_count: int, children: Optional[list[FolderResponse]] = None) -> FolderResponse:
    return FolderResponse(
        id=UUID(folder.id),
        name=folder.name,
        deal_id=folder.deal_id,
        parent_folder_id=UUID(folder.parent_folder_id) if folder.parent_folder_id else None,
        organization_id=UUID(folder.organization_id),
        created_by=UUID(folder.created_by),
        created_at=folder.created_at,
        updated_at=folder.updated_at,
        children=children or [],
        document_count=document_count,
    )


def create_folder(
    db: Session,
    *,
    payload: FolderCreate,
    deal_id: str,
    current_user: User,
) -> FolderResponse:
    deal = _ensure_deal_access(db, deal_id, current_user)
    parent_folder = _ensure_folder_access(db, payload.parent_folder_id and str(payload.parent_folder_id), deal)

    folder = Folder(
        id=str(uuid4()),
        name=payload.name.strip(),
        deal_id=str(deal.id),
        parent_folder_id=str(parent_folder.id) if parent_folder else None,
        organization_id=current_user.organization_id,
        created_by=current_user.id,
    )
    db.add(folder)
    db.commit()
    db.refresh(folder)

    return _folder_to_response(folder, document_count=0, children=[])


async def upload_document(
    db: Session,
    *,
    file: UploadFile,
    deal_id: str,
    current_user: User,
    folder_id: Optional[str] = None,
) -> DocumentUploadResponse:
    deal = _ensure_deal_access(db, deal_id, current_user)
    folder = _ensure_folder_access(db, folder_id, deal)

    if file.content_type not in ALLOWED_FILE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file type",
        )

    file.file.seek(0, os.SEEK_END)
    file_size = file.file.tell()
    file.file.seek(0)

    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds 50MB limit",
        )

    storage = get_storage_service()
    storage_key = storage.generate_file_key(
        current_user.organization_id,
        deal_id,
        file.filename or "document",
        current_user.id,
    )

    await storage.save_file(storage_key, file.file, current_user.organization_id)

    document = Document(
        id=str(uuid4()),
        name=file.filename or "document",
        file_key=storage_key,
        file_size=file_size,
        file_type=file.content_type or "application/octet-stream",
        deal_id=str(deal.id),
        folder_id=folder_id,
        organization_id=current_user.organization_id,
        uploaded_by=current_user.id,
        version=1,
    )
    db.add(document)
    db.flush()

    _log_access(db, document, current_user, action="upload")

    db.commit()
    db.refresh(document)

    return DocumentUploadResponse(
        id=UUID(document.id),
        name=document.name,
        file_size=document.file_size,
        file_type=document.file_type,
        deal_id=document.deal_id,
        folder_id=UUID(document.folder_id) if document.folder_id else None,
        organization_id=UUID(document.organization_id),
        uploaded_by=UUID(document.uploaded_by),
        version=document.version,
        parent_document_id=UUID(document.parent_document_id) if document.parent_document_id else None,
        archived_at=document.archived_at,
        created_at=document.created_at,
        updated_at=document.updated_at,
        uploader_name=None,
    )


def list_documents(
    db: Session,
    *,
    deal_id: str,
    organization_id: str,
    params: DocumentListParams,
) -> tuple[list[DocumentMetadata], int]:
    query = db.query(Document).filter(
        Document.deal_id == deal_id,
        Document.organization_id == organization_id,
    )

    if params.folder_id:
        query = query.filter(Document.folder_id == str(params.folder_id))
    if params.search:
        like_pattern = f"%{params.search.lower()}%"
        query = query.filter(Document.name.ilike(like_pattern))
    if params.file_type:
        query = query.filter(Document.file_type == params.file_type)
    if not params.include_archived:
        query = query.filter(Document.archived_at.is_(None))

    total = query.count()
    items = (
        query.order_by(Document.created_at.desc())
        .offset((params.page - 1) * params.per_page)
        .limit(params.per_page)
        .all()
    )

    metadata_items = [
        DocumentMetadata(
            id=UUID(item.id),
            name=item.name,
            file_size=item.file_size,
            file_type=item.file_type,
            deal_id=item.deal_id,
            folder_id=UUID(item.folder_id) if item.folder_id else None,
            organization_id=UUID(item.organization_id),
            uploaded_by=UUID(item.uploaded_by),
            version=item.version,
            parent_document_id=UUID(item.parent_document_id) if item.parent_document_id else None,
            archived_at=item.archived_at,
            created_at=item.created_at,
            updated_at=item.updated_at,
            uploader_name=None,
        )
        for item in items
    ]

    return metadata_items, total


def list_folders(
    db: Session,
    *,
    deal_id: str,
    organization_id: str,
) -> list[FolderResponse]:
    folders = (
        db.query(Folder)
        .filter(Folder.deal_id == deal_id, Folder.organization_id == organization_id)
        .all()
    )

    documents_per_folder: dict[str, int] = defaultdict(int)
    for folder_id, doc_count in (
        db.query(Document.folder_id, func.count(Document.id))
        .filter(Document.deal_id == deal_id, Document.organization_id == organization_id)
        .group_by(Document.folder_id)
        .all()
    ):
        if folder_id:
            documents_per_folder[str(folder_id)] = doc_count

    children_map: dict[Optional[str], list[Folder]] = defaultdict(list)
    for folder in folders:
        children_map[folder.parent_folder_id].append(folder)

    def build_tree(parent_id: Optional[str]) -> list[FolderResponse]:
        responses: list[FolderResponse] = []
        for folder in children_map.get(parent_id, []):
            child_responses = build_tree(folder.id)
            responses.append(
                _folder_to_response(
                    folder,
                    document_count=documents_per_folder.get(folder.id, 0),
                    children=child_responses,
                )
            )
        return responses

    return build_tree(None)


def get_folder_by_id(
    db: Session,
    *,
    folder_id: str,
    organization_id: str,
) -> FolderResponse | None:
    """Get a single folder by ID with org isolation."""
    folder = db.get(Folder, folder_id)
    if folder is None or folder.organization_id != organization_id:
        return None

    # Count documents in this folder
    doc_count = (
        db.query(func.count(Document.id))
        .filter(Document.folder_id == folder_id)
        .scalar()
    ) or 0

    return _folder_to_response(folder, document_count=doc_count)


def update_folder(
    db: Session,
    *,
    folder: FolderResponse,
    folder_data: FolderUpdate,
) -> FolderResponse:
    """Update folder name or move it to a different parent."""
    # Get the actual folder model from DB
    folder_model = db.get(Folder, str(folder.id))
    if folder_model is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Folder not found")

    # Update fields
    if folder_data.name is not None:
        folder_model.name = folder_data.name.strip()

    if folder_data.parent_folder_id is not None:
        folder_model.parent_folder_id = str(folder_data.parent_folder_id)

    db.add(folder_model)
    db.commit()
    db.refresh(folder_model)

    # Count documents for response
    doc_count = (
        db.query(func.count(Document.id))
        .filter(Document.folder_id == folder_model.id)
        .scalar()
    ) or 0

    return _folder_to_response(folder_model, document_count=doc_count)


def delete_folder(
    db: Session,
    *,
    folder: FolderResponse,
) -> None:
    """Delete a folder (must be empty - no documents or subfolders)."""
    # Get the actual folder model from DB
    folder_model = db.get(Folder, str(folder.id))
    if folder_model is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Folder not found")

    # Check for documents
    doc_count = (
        db.query(func.count(Document.id))
        .filter(Document.folder_id == folder_model.id)
        .scalar()
    ) or 0

    if doc_count > 0:
        raise ValueError("Folder is not empty - contains documents")

    # Check for subfolders
    subfolder_count = (
        db.query(func.count(Folder.id))
        .filter(Folder.parent_folder_id == folder_model.id)
        .scalar()
    ) or 0

    if subfolder_count > 0:
        raise ValueError("Folder is not empty - contains subfolders")

    # Delete the folder
    db.delete(folder_model)
    db.commit()


def get_document_by_id(
    db: Session,
    *,
    document_id: str,
    organization_id: str,
) -> Document | None:
    document = db.get(Document, document_id)
    if document is None or document.organization_id != organization_id:
        return None
    return document


def archive_document(
    db: Session,
    *,
    document: Document,
) -> None:
    document.archived_at = datetime.now(timezone.utc)
    document.is_archived = True
    db.add(document)
    db.commit()


def restore_document(
    db: Session,
    *,
    document: Document,
) -> None:
    document.archived_at = None
    document.is_archived = False
    db.add(document)
    db.commit()


def update_document_metadata(
    db: Session,
    *,
    document: Document,
    folder_id: Optional[str],
) -> Document:
    if folder_id:
        folder = db.get(Folder, folder_id)
        if folder is None or folder.deal_id != document.deal_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Folder not found")
        document.folder_id = folder_id
    else:
        document.folder_id = None

    document.updated_at = datetime.now(timezone.utc)
    db.add(document)
    db.commit()
    db.refresh(document)
    return document


def get_document_for_download(
    db: Session,
    *,
    document: Document,
    current_user: User,
) -> Tuple[Document, str]:
    storage = get_storage_service()
    file_path = storage.base_path / document.organization_id / document.file_key  # type: ignore[arg-type]
    if not file_path.exists():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stored file missing")

    log_document_access(
        db=db,
        document=document,
        user=current_user,
        action="download",
    )

    return document, str(file_path)


def grant_document_permission(
    db: Session,
    *,
    document: Document,
    permission_data: PermissionCreate,
    granter: User,
) -> PermissionResponse:
    existing_permission = (
        db.query(DocumentPermission)
        .filter(
            DocumentPermission.document_id == document.id,
            DocumentPermission.user_id == str(permission_data.user_id),
            DocumentPermission.organization_id == document.organization_id,
        )
        .one_or_none()
    )

    if existing_permission:
        existing_permission.permission_level = permission_data.permission_level
        existing_permission.granted_by = granter.id
        permission = existing_permission
    else:
        permission = DocumentPermission(
            id=str(uuid4()),
            document_id=document.id,
            folder_id=None,
            user_id=str(permission_data.user_id),
            permission_level=permission_data.permission_level,
            organization_id=document.organization_id,
            granted_by=granter.id,
        )
        db.add(permission)

    db.commit()
    db.refresh(permission)

    return PermissionResponse(
        id=UUID(permission.id),
        document_id=UUID(permission.document_id) if permission.document_id else None,
        folder_id=UUID(permission.folder_id) if permission.folder_id else None,
        user_id=UUID(permission.user_id),
        permission_level=permission.permission_level,
        granted_by=UUID(permission.granted_by),
        created_at=permission.created_at,
    )


def list_document_permissions(
    db: Session,
    *,
    document_id: str,
    organization_id: str,
) -> list[PermissionResponse]:
    permissions = (
        db.query(DocumentPermission)
        .filter(
            DocumentPermission.document_id == document_id,
            DocumentPermission.organization_id == organization_id,
        )
        .order_by(DocumentPermission.created_at.desc())
        .all()
    )

    return [
        PermissionResponse(
            id=UUID(permission.id),
            document_id=UUID(permission.document_id) if permission.document_id else None,
            folder_id=UUID(permission.folder_id) if permission.folder_id else None,
            user_id=UUID(permission.user_id),
            permission_level=permission.permission_level,
            granted_by=UUID(permission.granted_by),
            created_at=permission.created_at,
        )
        for permission in permissions
    ]


def get_document_access_logs(
    db: Session,
    *,
    document_id: str,
    organization_id: str,
    limit: int,
) -> list[DocumentAccessLogEntry]:
    query = (
        db.query(DocumentAccessLog)
        .filter(
            DocumentAccessLog.document_id == document_id,
            DocumentAccessLog.organization_id == organization_id,
        )
        .order_by(DocumentAccessLog.created_at.desc())
        .limit(limit)
    )

    logs = query.all()
    return [
        DocumentAccessLogEntry(
            id=UUID(log.id),
            document_id=UUID(log.document_id),
            user_id=UUID(log.user_id),
            action=log.action,
            ip_address=log.ip_address,
            user_agent=log.user_agent,
            created_at=log.created_at,
        )
        for log in logs
    ]


def log_document_access(
    db: Session,
    *,
    document: Document,
    user: User,
    action: str,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
) -> DocumentAccessLogEntry:
    log_entry = DocumentAccessLog(
        id=str(uuid4()),
        document_id=document.id,
        user_id=user.id,
        action=action,
        organization_id=document.organization_id,
        ip_address=ip_address,
        user_agent=user_agent,
    )
    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)

    return DocumentAccessLogEntry(
        id=UUID(log_entry.id),
        document_id=UUID(log_entry.document_id),
        user_id=UUID(log_entry.user_id),
        action=log_entry.action,
        ip_address=log_entry.ip_address,
        user_agent=log_entry.user_agent,
        created_at=log_entry.created_at,
    )


def _log_access(
    db: Session,
    document: Document,
    user: User,
    *,
    action: str,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
) -> None:
    entry = DocumentAccessLog(
        id=str(uuid4()),
        document_id=document.id,
        user_id=user.id,
        action=action,
        organization_id=document.organization_id,
        ip_address=ip_address,
        user_agent=user_agent,
    )
    db.add(entry)
