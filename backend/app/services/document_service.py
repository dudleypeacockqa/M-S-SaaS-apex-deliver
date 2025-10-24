"""Document service layer for secure data room operations."""
from __future__ import annotations

import math
import os
from typing import Optional, Tuple
from uuid import UUID, uuid4

from fastapi import HTTPException, UploadFile, status
from sqlalchemy import select
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
    DocumentListParams,
    DocumentMetadata,
    DocumentUploadResponse,
    FolderCreate,
    FolderResponse,
    PaginatedDocuments,
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

    return FolderResponse(
        id=UUID(folder.id),
        name=folder.name,
        deal_id=folder.deal_id,
        parent_folder_id=UUID(folder.parent_folder_id) if folder.parent_folder_id else None,
        organization_id=UUID(folder.organization_id),
        created_by=UUID(folder.created_by),
        created_at=folder.created_at,
        updated_at=folder.updated_at,
        children=[],
        document_count=0,
    )


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
        version=document.version,
        created_at=document.created_at,
    )


def list_documents(
    db: Session,
    *,
    params: DocumentListParams,
    current_user: User,
) -> PaginatedDocuments:
    deal = _ensure_deal_access(db, str(params.deal_id), current_user)

    query = db.query(Document).filter(
        Document.deal_id == str(deal.id),
        Document.organization_id == current_user.organization_id,
    )

    if params.folder_id:
        query = query.filter(Document.folder_id == str(params.folder_id))
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

    pages = math.ceil(total / params.per_page) if params.per_page else 1

    return PaginatedDocuments(
        items=metadata_items,
        total=total,
        page=params.page,
        per_page=params.per_page,
        pages=pages,
    )


def get_document_for_download(
    db: Session,
    *,
    document_id: str,
    current_user: User,
) -> Tuple[Document, str]:
    document = db.get(Document, document_id)
    if (
        document is None
        or document.organization_id != current_user.organization_id
        or document.archived_at is not None
    ):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

    storage = get_storage_service()
    file_path = storage.base_path / document.organization_id / document.file_key  # type: ignore[arg-type]
    if not file_path.exists():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stored file missing")

    _log_access(db, document, current_user, action="download")
    db.commit()

    return document, str(file_path)


def add_permission(
    db: Session,
    *,
    document_id: str,
    payload: PermissionCreate,
    current_user: User,
) -> PermissionResponse:
    document = db.get(Document, document_id)
    if document is None or document.organization_id != current_user.organization_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

    permission = DocumentPermission(
        id=str(uuid4()),
        document_id=document.id,
        folder_id=None,
        user_id=str(payload.user_id),
        permission_level=payload.permission_level,
        organization_id=document.organization_id,
        granted_by=current_user.id,
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


def _log_access(db: Session, document: Document, user: User, *, action: str) -> None:
    log_entry = DocumentAccessLog(
        id=str(uuid4()),
        document_id=document.id,
        user_id=user.id,
        action=action,
        organization_id=document.organization_id,
    )
    db.add(log_entry)
