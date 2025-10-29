"""Document service layer for secure data room operations."""
from __future__ import annotations

import math
import os
from collections import defaultdict
from datetime import datetime, timezone
from typing import List, Optional, Tuple
from uuid import UUID, uuid4

from fastapi import HTTPException, UploadFile, status
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

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
    MAX_VERSIONS_PER_DOCUMENT,
    DocumentAccessLogEntry,
    DocumentListParams,
    DocumentMetadata,
    DocumentUploadResponse,
    FolderCreate,
    FolderResponse,
    FolderUpdate,
    PermissionLevel,
    PermissionCreate,
    PermissionResponse,
)
from app.services.storage_service import get_storage_service


_PERMISSION_RANK = {
    PermissionLevel.VIEWER: 1,
    PermissionLevel.EDITOR: 2,
    PermissionLevel.OWNER: 3,
}


def _user_display_name(user: Optional[User]) -> Optional[str]:
    """Return a display name for a user (first + last fallback to email)."""

    if user is None:
        return None

    parts = [user.first_name or "", user.last_name or ""]
    name = " ".join(part for part in parts if part).strip()
    if name:
        return name

    # Fall back to email if available
    return getattr(user, "email", None)


def _normalize_level(level: str) -> str:
    return level.lower()


def _max_permission(current: str, candidate: str) -> str:
    current_key = _normalize_level(current)
    candidate_key = _normalize_level(candidate)
    return current if _PERMISSION_RANK[current_key] >= _PERMISSION_RANK[candidate_key] else candidate


def _resolve_folder_permission(
    db: Session,
    *,
    folder: Optional[Folder],
    user: User,
    deal: Deal,
) -> str:
    """Resolve the effective permission level for a folder hierarchy."""

    # Deal owners always have owner permission
    if str(deal.owner_id) == str(user.id):
        return PermissionLevel.OWNER

    permission = PermissionLevel.VIEWER

    current_folder = folder
    while current_folder is not None:
        perm = (
            db.query(DocumentPermission)
            .filter(
                DocumentPermission.folder_id == current_folder.id,
                DocumentPermission.user_id == str(user.id),
                DocumentPermission.organization_id == current_folder.organization_id,
            )
            .one_or_none()
        )
        if perm:
            permission = _max_permission(permission, perm.permission_level)

        if current_folder.parent_folder_id:
            current_folder = db.get(Folder, current_folder.parent_folder_id)
        else:
            current_folder = None

    return permission


def _resolve_document_permission(
    db: Session,
    *,
    document: Document,
    user: User,
) -> str:
    """Resolve the effective permission level for a specific document."""

    if document.organization_id != str(user.organization_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

    deal = db.get(Deal, document.deal_id)

    # Deal owners and uploaders have implicit owner permission
    if deal and str(deal.owner_id) == str(user.id):
        return PermissionLevel.OWNER
    if str(document.uploaded_by) == str(user.id):
        return PermissionLevel.OWNER

    permission = PermissionLevel.VIEWER

    # Document-specific permission
    doc_permission = (
        db.query(DocumentPermission)
        .filter(
            DocumentPermission.document_id == document.id,
            DocumentPermission.user_id == str(user.id),
            DocumentPermission.organization_id == document.organization_id,
        )
        .one_or_none()
    )
    if doc_permission:
        permission = _max_permission(permission, doc_permission.permission_level)

    # Folder permissions (inherit from parent folders)
    if document.folder_id:
        folder = db.get(Folder, document.folder_id)
        if folder:
            folder_permission = _resolve_folder_permission(
                db,
                folder=folder,
                user=user,
                deal=deal or _ensure_deal_access(db, document.deal_id, user),
            )
            permission = _max_permission(permission, folder_permission)

    return permission


def _ensure_document_permission(
    db: Session,
    *,
    document: Document,
    user: User,
    minimum_level: str,
    allow_editor_for_own: bool = False,
) -> str:
    permission = _resolve_document_permission(db, document=document, user=user)

    if (
        allow_editor_for_own
        and _normalize_level(permission) == PermissionLevel.EDITOR
        and str(document.uploaded_by) == str(user.id)
    ):
        return permission

    if _PERMISSION_RANK[_normalize_level(permission)] < _PERMISSION_RANK[_normalize_level(minimum_level)]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions for this document",
        )
    return permission


def _ensure_folder_owner_permission(
    db: Session,
    *,
    folder: Folder,
    user: User,
    deal: Deal,
) -> None:
    permission = _resolve_folder_permission(db, folder=folder, user=user, deal=deal)
    if _PERMISSION_RANK[_normalize_level(permission)] < _PERMISSION_RANK[PermissionLevel.OWNER]:
        raise HTTPException(
            status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions for this folder",
        )


def ensure_document_permission(
    db: Session,
    *,
    document: Document,
    user: User,
    minimum_level: str,
    allow_editor_for_own: bool = False,
) -> str:
    return _ensure_document_permission(
        db,
        document=document,
        user=user,
        minimum_level=minimum_level,
        allow_editor_for_own=allow_editor_for_own,
    )


def ensure_folder_owner_permission(
    db: Session,
    *,
    folder: Folder,
    user: User,
    deal: Deal,
) -> None:
    _ensure_folder_owner_permission(db, folder=folder, user=user, deal=deal)

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

    if parent_folder:
        permission_level = _resolve_folder_permission(
            db,
            folder=parent_folder,
            user=current_user,
            deal=deal,
        )
        if _PERMISSION_RANK[_normalize_level(permission_level)] < _PERMISSION_RANK[PermissionLevel.EDITOR]:
            raise HTTPException(
                status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions to create a subfolder",
            )
    else:
        if str(deal.owner_id) != str(current_user.id):
            raise HTTPException(
                status.HTTP_403_FORBIDDEN,
                detail="Only deal owners can create top-level folders",
            )

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

    if folder:
        permission_level = _resolve_folder_permission(
            db,
            folder=folder,
            user=current_user,
            deal=deal,
        )
        if _PERMISSION_RANK[_normalize_level(permission_level)] < _PERMISSION_RANK[PermissionLevel.EDITOR]:
            raise HTTPException(
                status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions to upload to this folder",
            )
    else:
        if str(deal.owner_id) != str(current_user.id):
            raise HTTPException(
                status.HTTP_403_FORBIDDEN,
                detail="Only deal owners can upload to the root data room",
            )

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

    # Check for existing document with same name in same location (versioning)
    filename = file.filename or "document"
    existing_docs_query = db.query(Document).filter(
        Document.name == filename,
        Document.deal_id == str(deal.id),
        Document.archived_at.is_(None),
    )
    if folder_id:
        existing_docs_query = existing_docs_query.filter(Document.folder_id == folder_id)
    else:
        existing_docs_query = existing_docs_query.filter(Document.folder_id.is_(None))

    # Get all versions ordered by version number descending
    existing_docs = existing_docs_query.order_by(Document.version.desc()).all()

    version_number = 1
    parent_doc_id = None

    if existing_docs:
        # Latest version is first (highest version number)
        latest_doc = existing_docs[0]
        version_number = latest_doc.version + 1

        # Find the root parent (v1) or use the latest doc's parent if it exists
        if latest_doc.parent_document_id:
            parent_doc_id = latest_doc.parent_document_id
        else:
            # Latest doc is the root (v1), so it becomes the parent
            parent_doc_id = latest_doc.id

    document = Document(
        id=str(uuid4()),
        name=filename,
        file_key=storage_key,
        file_size=file_size,
        file_type=file.content_type or "application/octet-stream",
        deal_id=str(deal.id),
        folder_id=folder_id,
        organization_id=current_user.organization_id,
        uploaded_by=current_user.id,
        version=version_number,
        parent_document_id=parent_doc_id,
    )
    document.created_at = datetime.now(timezone.utc)
    db.add(document)
    db.flush()
    document_id = document.id

    await _trim_document_versions(
        db,
        base_document=document,
        storage=storage,
        max_versions=MAX_VERSIONS_PER_DOCUMENT,
    )

    _log_access(db, document, current_user, action="upload")
    db.flush()
    db.commit()

    document = (
        db.query(Document)
        .filter(Document.id == document_id)
        .one_or_none()
    )
    if document is None:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Document upload failed")

    uploader_name = _user_display_name(current_user)

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
        uploader_name=uploader_name,
    )


async def _trim_document_versions(
    db: Session,
    *,
    base_document: Document,
    storage,
    max_versions: int,
) -> None:
    """Ensure only the most recent `max_versions` remain for a document."""

    versions_query = db.query(Document).filter(
        Document.name == base_document.name,
        Document.deal_id == base_document.deal_id,
        Document.organization_id == base_document.organization_id,
        Document.archived_at.is_(None),
    )

    if base_document.folder_id:
        versions_query = versions_query.filter(Document.folder_id == base_document.folder_id)
    else:
        versions_query = versions_query.filter(Document.folder_id.is_(None))

    versions = (
        versions_query
        .order_by(Document.version.desc(), Document.created_at.desc())
        .all()
    )

    if len(versions) <= max_versions:
        return

    # Ensure the freshly uploaded document is preserved before trimming
    def _sort_key(doc: Document):
        created = doc.created_at or datetime(1970, 1, 1, tzinfo=timezone.utc)
        return (0 if str(doc.id) == str(base_document.id) else 1, -(doc.version or 0), created)

    ordered_versions = sorted(versions, key=_sort_key)
    keep = ordered_versions[:max_versions]
    purge = ordered_versions[max_versions:]

    # Determine new root (oldest version among the ones we keep)
    root = min(keep, key=lambda v: v.version)

    for version in keep:
        version.parent_document_id = None if version.id == root.id else root.id
        db.add(version)

    db.flush()

    for old_version in purge:
        try:
            await storage.delete_file(old_version.file_key, base_document.organization_id)
        except Exception:  # pragma: no cover - storage deletion best effort
            pass
        db.delete(old_version)

    db.flush()


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
    current_user: User,
) -> FolderResponse:
    """Update folder name or move it to a different parent."""
    folder_model = db.get(Folder, str(folder.id))
    if folder_model is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Folder not found")

    deal = db.get(Deal, folder_model.deal_id)
    if deal is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Deal not found")

    _ensure_folder_owner_permission(db, folder=folder_model, user=current_user, deal=deal)

    if folder_data.parent_folder_id is not None:
        new_parent = db.get(Folder, str(folder_data.parent_folder_id))
        if new_parent is None or new_parent.deal_id != folder_model.deal_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Parent folder not found")
        parent_permission = _resolve_folder_permission(db, folder=new_parent, user=current_user, deal=deal)
        if _PERMISSION_RANK[_normalize_level(parent_permission)] < _PERMISSION_RANK[PermissionLevel.OWNER]:
            raise HTTPException(
                status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions to move folder",
            )
        folder_model.parent_folder_id = str(folder_data.parent_folder_id)

    if folder_data.name is not None:
        folder_model.name = folder_data.name.strip()

    db.add(folder_model)
    db.commit()
    db.refresh(folder_model)

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
    current_user: User,
) -> None:
    """Delete a folder (must be empty - no documents or subfolders)."""
    folder_model = db.get(Folder, str(folder.id))
    if folder_model is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Folder not found")

    deal = db.get(Deal, folder_model.deal_id)
    if deal is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Deal not found")

    _ensure_folder_owner_permission(db, folder=folder_model, user=current_user, deal=deal)

    doc_count = (
        db.query(func.count(Document.id))
        .filter(Document.folder_id == folder_model.id)
        .scalar()
    ) or 0
    if doc_count > 0:
        raise ValueError("Folder is not empty - contains documents")

    subfolder_count = (
        db.query(func.count(Folder.id))
        .filter(Folder.parent_folder_id == folder_model.id)
        .scalar()
    ) or 0
    if subfolder_count > 0:
        raise ValueError("Folder is not empty - contains subfolders")

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
    performed_by: Optional[User] = None,
) -> None:
    """
    Archive a document and all its versions.

    Sets archived_at timestamp for the document and all related versions.
    """
    archive_time = datetime.now(timezone.utc)

    # Find the root parent
    root_id = document.parent_document_id if document.parent_document_id else document.id

    # Get all versions (root + all its children)
    all_versions = db.query(Document).filter(
        Document.organization_id == document.organization_id,
        (Document.id == root_id) | (Document.parent_document_id == root_id),
    ).all()

    # Archive all versions
    for version in all_versions:
        version.archived_at = archive_time
        db.add(version)

    if performed_by:
        _log_access(
            db,
            document=document,
            user=performed_by,
            action="delete",
        )
        db.commit()

    db.flush()
    db.commit()


def restore_document(
    db: Session,
    *,
    document: Document,
) -> None:
    document.archived_at = None
    db.add(document)
    db.commit()


def update_document_metadata(
    db: Session,
    *,
    document: Document,
    current_user: User,
    folder_id: Optional[str],
) -> Document:
    ensure_document_permission(
        db,
        document=document,
        user=current_user,
        minimum_level=PermissionLevel.EDITOR,
        allow_editor_for_own=True,
    )

    deal = db.get(Deal, document.deal_id)
    if deal is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Deal not found")

    if folder_id:
        folder = db.get(Folder, folder_id)
        if folder is None or folder.deal_id != document.deal_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Folder not found")
        folder_permission = _resolve_folder_permission(
            db,
            folder=folder,
            user=current_user,
            deal=deal,
        )
        if _PERMISSION_RANK[_normalize_level(folder_permission)] < _PERMISSION_RANK[PermissionLevel.EDITOR]:
            raise HTTPException(
                status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions to move document to this folder",
            )
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
    ensure_document_permission(
        db,
        document=document,
        user=granter,
        minimum_level=PermissionLevel.OWNER,
    )

    target_user = db.get(User, str(permission_data.user_id))
    if target_user is None or target_user.organization_id != document.organization_id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="User not found")

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
        user_name=_user_display_name(target_user),
        permission_level=permission.permission_level,
        granted_by=UUID(permission.granted_by),
        granter_name=_user_display_name(granter),
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
            user_name=_user_display_name(permission.user),
            permission_level=permission.permission_level,
            granted_by=UUID(permission.granted_by),
            granter_name=_user_display_name(permission.granter),
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
        .options(joinedload(DocumentAccessLog.user))
        .filter(
            DocumentAccessLog.document_id == document_id,
            DocumentAccessLog.organization_id == organization_id,
        )
         .order_by(DocumentAccessLog.created_at.desc(), DocumentAccessLog.id.desc())
        .limit(limit)
    )

    logs = query.all()
    return [
        DocumentAccessLogEntry(
            id=UUID(log.id),
            document_id=UUID(log.document_id),
            user_id=UUID(log.user_id),
            user_name=_user_display_name(log.user),
            action=log.action,
            ip_address=log.ip_address,
            user_agent=log.user_agent,
            created_at=log.created_at,
        )
        for log in logs
    ]


def grant_folder_permission(
    db: Session,
    *,
    deal_id: str,
    folder_id: str,
    permission_data: PermissionCreate,
    current_user: User,
) -> PermissionResponse:
    deal = _ensure_deal_access(db, deal_id, current_user)
    folder = _ensure_folder_access(db, folder_id, deal)
    if folder is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Folder not found")

    _ensure_folder_owner_permission(db, folder=folder, user=current_user, deal=deal)

    target_user = db.get(User, str(permission_data.user_id))
    if target_user is None or target_user.organization_id != folder.organization_id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="User not found")

    permission = (
        db.query(DocumentPermission)
        .filter(
            DocumentPermission.folder_id == folder.id,
            DocumentPermission.user_id == str(permission_data.user_id),
            DocumentPermission.organization_id == folder.organization_id,
        )
        .one_or_none()
    )

    if permission:
        permission.permission_level = permission_data.permission_level
        permission.granted_by = current_user.id
    else:
        permission = DocumentPermission(
            id=str(uuid4()),
            document_id=None,
            folder_id=folder.id,
            user_id=str(permission_data.user_id),
            permission_level=permission_data.permission_level,
            organization_id=folder.organization_id,
            granted_by=current_user.id,
        )
        db.add(permission)

    db.commit()
    db.refresh(permission)

    return PermissionResponse(
        id=UUID(permission.id),
        document_id=None,
        folder_id=UUID(permission.folder_id) if permission.folder_id else None,
        user_id=UUID(permission.user_id),
        user_name=_user_display_name(target_user),
        permission_level=permission.permission_level,
        granted_by=UUID(permission.granted_by),
        granter_name=_user_display_name(current_user),
        created_at=permission.created_at,
    )


def list_folder_permissions(
    db: Session,
    *,
    deal_id: str,
    folder_id: str,
    current_user: User,
) -> list[PermissionResponse]:
    deal = _ensure_deal_access(db, deal_id, current_user)
    folder = _ensure_folder_access(db, folder_id, deal)
    if folder is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Folder not found")

    _ensure_folder_owner_permission(db, folder=folder, user=current_user, deal=deal)

    permissions = (
        db.query(DocumentPermission)
        .filter(
            DocumentPermission.folder_id == folder.id,
            DocumentPermission.organization_id == folder.organization_id,
        )
        .order_by(DocumentPermission.created_at.desc())
        .all()
    )

    return [
        PermissionResponse(
            id=UUID(permission.id),
            document_id=None,
            folder_id=UUID(permission.folder_id) if permission.folder_id else None,
            user_id=UUID(permission.user_id),
            user_name=_user_display_name(permission.user),
            permission_level=permission.permission_level,
            granted_by=UUID(permission.granted_by),
            granter_name=_user_display_name(permission.granter),
            created_at=permission.created_at,
        )
        for permission in permissions
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
    entry = _log_access(
        db,
        document=document,
        user=user,
        action=action,
        ip_address=ip_address,
        user_agent=user_agent,
    )
    db.commit()
    db.refresh(entry)

    return DocumentAccessLogEntry(
        id=UUID(entry.id),
        document_id=UUID(entry.document_id),
        user_id=UUID(entry.user_id),
        user_name=_user_display_name(entry.user),
        action=entry.action,
        ip_address=entry.ip_address,
        user_agent=entry.user_agent,
        created_at=entry.created_at,
    )


def _log_access(
    db: Session,
    document: Document,
    user: User,
    *,
    action: str,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
) -> DocumentAccessLog:
    entry = DocumentAccessLog(
        id=str(uuid4()),
        document_id=document.id,
        user_id=user.id,
        action=action,
        organization_id=document.organization_id,
        created_at=datetime.now(timezone.utc),
        ip_address=ip_address,
        user_agent=user_agent,
    )
    db.add(entry)
    db.flush()
    return entry


def get_document_versions(
    db: Session,
    *,
    document_id: str,
    organization_id: str,
) -> List[DocumentMetadata]:
    """
    Get all versions of a document.

    Returns all versions (including the specified document) in chronological order.
    """
    # Get the document to find its root parent
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.organization_id == organization_id,
    ).first()

    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

    # Find the root parent (v1)
    root_id = document.parent_document_id if document.parent_document_id else document.id

    # Get all versions (root + all its children)
    versions_query = db.query(Document).filter(
        Document.organization_id == organization_id,
        (Document.id == root_id) | (Document.parent_document_id == root_id),
    ).order_by(Document.version.asc())

    versions = versions_query.all()

    return [
        DocumentMetadata(
            id=UUID(v.id),
            name=v.name,
            file_size=v.file_size,
            file_type=v.file_type,
            deal_id=v.deal_id,
            folder_id=UUID(v.folder_id) if v.folder_id else None,
            organization_id=UUID(v.organization_id),
            uploaded_by=UUID(v.uploaded_by),
            version=v.version,
            parent_document_id=UUID(v.parent_document_id) if v.parent_document_id else None,
            archived_at=v.archived_at,
            created_at=v.created_at,
            updated_at=v.updated_at,
            uploader_name=_user_display_name(v.uploader),
        )
        for v in versions
    ]


async def restore_document_version(
    db: Session,
    *,
    document_id: str,
    version_id: str,
    organization_id: str,
    current_user: User,
) -> DocumentUploadResponse:
    """
    Restore a previous version of a document by creating a new version with the old content.

    Args:
        db: Database session
        document_id: Current document ID (usually the latest version)
        version_id: ID of the version to restore
        organization_id: Organization ID for security
        current_user: User performing the restore

    Returns:
        Newly created document version with restored content
    """
    # Get the version to restore
    version_to_restore = db.query(Document).filter(
        Document.id == version_id,
        Document.organization_id == organization_id,
    ).first()

    if not version_to_restore:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Version not found")

    # Get the current document to ensure it exists
    current_doc = db.query(Document).filter(
        Document.id == document_id,
        Document.organization_id == organization_id,
    ).first()

    if not current_doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

    # Find the root parent and latest version number
    root_id = current_doc.parent_document_id if current_doc.parent_document_id else current_doc.id
    all_versions = db.query(Document).filter(
        Document.organization_id == organization_id,
        (Document.id == root_id) | (Document.parent_document_id == root_id),
    ).order_by(Document.version.desc()).all()

    latest_version_number = all_versions[0].version if all_versions else 1
    new_version_number = latest_version_number + 1

    # Copy the file from the version to restore
    storage = get_storage_service()
    old_file_path = await storage.get_file_path(version_to_restore.file_key, organization_id)

    # Generate new storage key for the restored version
    new_storage_key = storage.generate_file_key(
        organization_id,
        current_doc.deal_id,
        version_to_restore.name,
        current_user.id,
    )

    # Copy the file content
    with open(old_file_path, 'rb') as source_file:
        await storage.save_file(new_storage_key, source_file, organization_id)

    # Create new document version
    restored_document = Document(
        id=str(uuid4()),
        name=version_to_restore.name,
        file_key=new_storage_key,
        file_size=version_to_restore.file_size,
        file_type=version_to_restore.file_type,
        deal_id=current_doc.deal_id,
        folder_id=current_doc.folder_id,
        organization_id=organization_id,
        uploaded_by=current_user.id,
        version=new_version_number,
        parent_document_id=root_id,
    )
    db.add(restored_document)
    db.flush()

    await _trim_document_versions(
        db,
        base_document=restored_document,
        storage=storage,
        max_versions=20,
    )

    _log_access(db, restored_document, current_user, action="restore")
    db.flush()

    db.commit()
    persisted_document = db.get(Document, restored_document.id)

    return DocumentUploadResponse(
        id=UUID(persisted_document.id),
        name=persisted_document.name,
        file_size=persisted_document.file_size,
        file_type=persisted_document.file_type,
        deal_id=persisted_document.deal_id,
        folder_id=UUID(persisted_document.folder_id) if persisted_document.folder_id else None,
        organization_id=UUID(persisted_document.organization_id),
        uploaded_by=UUID(persisted_document.uploaded_by),
        version=persisted_document.version,
        parent_document_id=UUID(persisted_document.parent_document_id) if persisted_document.parent_document_id else None,
        archived_at=persisted_document.archived_at,
        created_at=persisted_document.created_at,
        updated_at=persisted_document.updated_at,
        uploader_name=_user_display_name(current_user),
    )





