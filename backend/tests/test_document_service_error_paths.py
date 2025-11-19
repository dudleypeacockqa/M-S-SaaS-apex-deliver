"""
TDD Tests for Document Service Error Paths
Target: Increase coverage of app/services/document_service.py error handling
Focus: ValueError paths, edge cases, permission errors
"""
from __future__ import annotations

import os
import uuid
import pytest
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.deal import Deal, DealStage
from app.models.document import Document, DocumentPermission, Folder
from app.models.user import User, UserRole
from app.services import document_service
from app.schemas.document import FolderCreate, PermissionLevel


@pytest.fixture(autouse=True)
def override_storage(tmp_path):
    """Ensure uploads use a temporary directory during tests."""
    os.environ["STORAGE_PATH"] = str(tmp_path)

    from app.services import storage_service as storage_module

    storage_module._storage_service = storage_module.LocalStorageService(base_path=tmp_path)  # type: ignore[attr-defined]
    yield
    storage_module._storage_service = None  # type: ignore[attr-defined]




def _build_user(
    *,
    organization_id: str,
    first_name: str | None = None,
    last_name: str | None = None,
    email: str = "user@example.com",
    role: str = UserRole.growth,
) -> User:
    """Helper to build a lightweight user model."""

    return User(
        id=str(uuid.uuid4()),
        clerk_user_id=f"clerk-{uuid.uuid4()}",
        email=email,
        first_name=first_name,
        last_name=last_name,
        role=role,
        organization_id=organization_id,
    )


def test_user_display_name_prefers_full_name(db_session, create_deal_for_org):
    deal, owner, organization = create_deal_for_org()
    user = _build_user(
        organization_id=organization.id,
        first_name="Alex",
        last_name="Morgan",
        email="alex@example.com",
    )
    assert document_service._user_display_name(user) == "Alex Morgan"  # type: ignore[attr-defined]


def test_user_display_name_falls_back_to_email(db_session, create_deal_for_org):
    deal, owner, organization = create_deal_for_org()
    user = _build_user(organization_id=organization.id, first_name=None, last_name=None)
    assert document_service._user_display_name(user) == user.email  # type: ignore[attr-defined]


def test_user_display_name_none_when_missing(db_session):
    assert document_service._user_display_name(None) is None  # type: ignore[attr-defined]


def test_annotate_question_sets_names():
    question = type("Q", (), {})()
    question.asked_by_user = _build_user(organization_id="org-1", first_name="Jordan", last_name="Lee")
    question.answered_by_user = _build_user(organization_id="org-1", email="helper@example.com", first_name=None, last_name=None)

    annotated = document_service._annotate_question(question)  # type: ignore[attr-defined]

    assert annotated.asked_by_name == "Jordan Lee"
    assert annotated.answered_by_name == "helper@example.com"


def test_max_permission_selects_highest_level():
    assert (
        document_service._max_permission(  # type: ignore[attr-defined]
            PermissionLevel.VIEWER,
            PermissionLevel.EDITOR,
        )
        == PermissionLevel.EDITOR
    )
    assert (
        document_service._max_permission(  # type: ignore[attr-defined]
            PermissionLevel.OWNER,
            PermissionLevel.EDITOR,
        )
        == PermissionLevel.OWNER
    )


def test_delete_folder_with_documents_raises_value_error(
    db_session: Session,
    create_deal_for_org,
):
    """
    TDD RED: delete_folder should raise ValueError when folder contains documents

    Tests line 854: raise ValueError("Folder is not empty - contains documents")
    """
    deal, owner, organization = create_deal_for_org()

    # Create folder with proper UUID
    folder_id = str(uuid.uuid4())
    folder = Folder(
        id=folder_id,
        name="Test Folder",
        deal_id=deal.id,
        organization_id=organization.id,
        created_by=owner.id,
    )
    db_session.add(folder)
    db_session.commit()

    # Add document to folder
    doc_id = str(uuid.uuid4())
    document = Document(
        id=doc_id,
        name="test.pdf",
        file_key="test-key",
        file_size=1024,
        file_type="application/pdf",
        deal_id=deal.id,
        folder_id=str(folder.id),
        organization_id=organization.id,
        uploaded_by=owner.id,
    )
    db_session.add(document)
    db_session.commit()

    # Get folder as FolderResponse (as API route does)
    # Use the service helper to convert Folder model to FolderResponse
    folder_response = document_service._folder_to_response(  # type: ignore[attr-defined]
        folder,
        document_count=1,
        children=[],
        has_children=False,
    )

    # Attempt to delete folder - should raise ValueError
    with pytest.raises(ValueError, match="Folder is not empty - contains documents"):
        document_service.delete_folder(
            db=db_session,
            folder=folder_response,
            current_user=owner,
        )


def test_delete_folder_with_subfolders_raises_value_error(
    db_session: Session,
    create_deal_for_org,
):
    """
    TDD RED: delete_folder should raise ValueError when folder contains subfolders

    Tests line 862: raise ValueError("Folder is not empty - contains subfolders")
    """
    deal, owner, organization = create_deal_for_org()

    # Create parent folder with proper UUID
    parent_id = str(uuid.uuid4())
    parent_folder = Folder(
        id=parent_id,
        name="Parent Folder",
        deal_id=deal.id,
        organization_id=organization.id,
        created_by=owner.id,
    )
    db_session.add(parent_folder)
    db_session.commit()

    # Create subfolder with proper UUID
    sub_id = str(uuid.uuid4())
    subfolder = Folder(
        id=sub_id,
        name="Subfolder",
        deal_id=deal.id,
        parent_folder_id=str(parent_folder.id),
        organization_id=organization.id,
        created_by=owner.id,
    )
    db_session.add(subfolder)
    db_session.commit()

    # Get folder as FolderResponse (as API route does)
    # Use the service helper to convert Folder model to FolderResponse
    folder_response = document_service._folder_to_response(  # type: ignore[attr-defined]
        parent_folder,
        document_count=0,
        children=[],
        has_children=True,  # Has subfolder
    )

    # Attempt to delete parent folder - should raise ValueError
    with pytest.raises(ValueError, match="Folder is not empty - contains subfolders"):
        document_service.delete_folder(
            db=db_session,
            folder=folder_response,
            current_user=owner,
        )


def _create_base_document(
    db_session: Session,
    *,
    deal,
    owner,
    organization,
    folder_name: str = "Permissions Folder",
    document_name: str = "permissions.pdf",
):
    """Helper to create a folder and document tied to a deal."""

    folder = Folder(
        id=str(uuid.uuid4()),
        name=folder_name,
        deal_id=deal.id,
        organization_id=organization.id,
        created_by=owner.id,
    )
    db_session.add(folder)
    db_session.commit()

    document = Document(
        id=str(uuid.uuid4()),
        name=document_name,
        file_key=f"file-{uuid.uuid4()}",
        file_size=2048,
        file_type="application/pdf",
        deal_id=deal.id,
        folder_id=str(folder.id),
        organization_id=organization.id,
        uploaded_by=owner.id,
    )
    db_session.add(document)
    db_session.commit()

    return folder, document


def _create_folder_hierarchy(
    db_session: Session,
    *,
    deal,
    organization,
    owner,
):
    """Create a parent/child folder pair for permission inheritance tests."""

    parent_folder = Folder(
        id=str(uuid.uuid4()),
        name="Parent Folder",
        deal_id=deal.id,
        organization_id=organization.id,
        created_by=owner.id,
    )
    child_folder = Folder(
        id=str(uuid.uuid4()),
        name="Child Folder",
        deal_id=deal.id,
        parent_folder_id=str(parent_folder.id),
        organization_id=organization.id,
        created_by=owner.id,
    )
    db_session.add_all([parent_folder, child_folder])
    db_session.commit()

    return parent_folder, child_folder


def test_resolve_folder_permission_owner_has_implicit_owner(
    db_session: Session,
    create_deal_for_org,
):
    """Deal owners automatically resolve to OWNER permission."""

    deal, owner, organization = create_deal_for_org()
    _, folder = _create_folder_hierarchy(
        db_session,
        deal=deal,
        organization=organization,
        owner=owner,
    )

    level = document_service._resolve_folder_permission(  # type: ignore[attr-defined]
        db_session,
        folder=folder,
        user=owner,
        deal=deal,
    )

    assert level == PermissionLevel.OWNER


def test_resolve_folder_permission_inherits_from_parent(
    db_session: Session,
    create_deal_for_org,
):
    """Child folders inherit the highest permission from any ancestor."""

    deal, owner, organization = create_deal_for_org()
    collaborator = User(
        id=str(uuid.uuid4()),
        clerk_user_id="clerk-folder-collab",
        email="folder@example.com",
        organization_id=organization.id,
        role=UserRole.growth,
    )
    db_session.add(collaborator)
    db_session.commit()

    parent, child = _create_folder_hierarchy(
        db_session,
        deal=deal,
        organization=organization,
        owner=owner,
    )

    db_session.add(
        DocumentPermission(
            id=str(uuid.uuid4()),
            folder_id=str(parent.id),
            document_id=None,
            user_id=str(collaborator.id),
            permission_level=PermissionLevel.EDITOR,
            organization_id=organization.id,
            granted_by=owner.id,
        )
    )
    db_session.commit()

    level = document_service._resolve_folder_permission(  # type: ignore[attr-defined]
        db_session,
        folder=child,
        user=collaborator,
        deal=deal,
    )

    assert level == PermissionLevel.EDITOR


def test_user_has_document_listing_access_with_folder_permission(
    db_session: Session,
    create_deal_for_org,
):
    """Folder permissions grant listing access."""

    deal, owner, organization = create_deal_for_org()
    collaborator = User(
        id=str(uuid.uuid4()),
        clerk_user_id="clerk-list-folder",
        email="list-folder@example.com",
        organization_id=organization.id,
        role=UserRole.growth,
    )
    db_session.add(collaborator)
    db_session.commit()

    folder, _ = _create_base_document(
        db_session,
        deal=deal,
        owner=owner,
        organization=organization,
    )

    db_session.add(
        DocumentPermission(
            id=str(uuid.uuid4()),
            folder_id=str(folder.id),
            document_id=None,
            user_id=str(collaborator.id),
            permission_level=PermissionLevel.VIEWER,
            organization_id=organization.id,
            granted_by=owner.id,
        )
    )
    db_session.commit()

    assert document_service._user_has_document_listing_access(  # type: ignore[attr-defined]
        db_session,
        deal=deal,
        user=collaborator,
    )


def test_user_has_document_listing_access_when_uploaded_document(
    db_session: Session,
    create_deal_for_org,
):
    """Users who uploaded a document should maintain listing access."""

    deal, owner, organization = create_deal_for_org()
    uploader = User(
        id=str(uuid.uuid4()),
        clerk_user_id="clerk-list-upload",
        email="list-upload@example.com",
        organization_id=organization.id,
        role=UserRole.growth,
    )
    db_session.add(uploader)
    db_session.commit()

    document = Document(
        id=str(uuid.uuid4()),
        name="listing.pdf",
        file_key="listing-key",
        file_size=1024,
        file_type="application/pdf",
        deal_id=deal.id,
        folder_id=None,
        organization_id=organization.id,
        uploaded_by=uploader.id,
    )
    db_session.add(document)
    db_session.commit()

    assert document_service._user_has_document_listing_access(  # type: ignore[attr-defined]
        db_session,
        deal=deal,
        user=uploader,
    )


def test_resolve_document_permission_inherits_folder_permissions(
    db_session: Session,
    create_deal_for_org,
):
    """
    TDD RED: _resolve_document_permission should inherit folder-level permissions.
    """

    deal, owner, organization = create_deal_for_org()
    collaborator = User(
        id=str(uuid.uuid4()),
        clerk_user_id="clerk-collab",
        email="collab@example.com",
        organization_id=organization.id,
        role=UserRole.growth,
    )
    db_session.add(collaborator)
    db_session.commit()

    folder, document = _create_base_document(
        db_session,
        deal=deal,
        owner=owner,
        organization=organization,
    )

    permission = DocumentPermission(
        id=str(uuid.uuid4()),
        folder_id=str(folder.id),
        document_id=None,
        user_id=str(collaborator.id),
        permission_level=PermissionLevel.EDITOR,
        organization_id=organization.id,
        granted_by=owner.id,
    )
    db_session.add(permission)
    db_session.commit()

    level = document_service._resolve_document_permission(  # type: ignore[attr-defined]
        db_session,
        document=document,
        user=collaborator,
    )

    assert level == PermissionLevel.EDITOR


def test_resolve_document_permission_blocks_other_organizations(
    db_session: Session,
    create_deal_for_org,
    create_organization,
):
    """TDD RED: access from non-member org should raise HTTP 404."""

    deal, owner, organization = create_deal_for_org()
    folder, document = _create_base_document(
        db_session,
        deal=deal,
        owner=owner,
        organization=organization,
    )

    outsider_org = create_organization()
    outsider = User(
        id=str(uuid.uuid4()),
        clerk_user_id="clerk-outsider",
        email="outsider@example.com",
        organization_id=outsider_org.id,
        role=UserRole.growth,
    )
    db_session.add(outsider)
    db_session.commit()

    with pytest.raises(HTTPException) as exc_info:
        document_service._resolve_document_permission(  # type: ignore[attr-defined]
            db_session,
            document=document,
            user=outsider,
        )

    assert exc_info.value.status_code == status.HTTP_404_NOT_FOUND


def test_ensure_document_permission_raises_for_insufficient_level(
    db_session: Session,
    create_deal_for_org,
):
    """
    TDD RED: ensure_document_permission enforces minimum level checks.
    """

    deal, owner, organization = create_deal_for_org()
    collaborator = User(
        id=str(uuid.uuid4()),
        clerk_user_id="clerk-collab-viewer",
        email="viewer@example.com",
        organization_id=organization.id,
        role=UserRole.growth,
    )
    db_session.add(collaborator)
    db_session.commit()

    folder, document = _create_base_document(
        db_session,
        deal=deal,
        owner=owner,
        organization=organization,
    )

    permission = DocumentPermission(
        id=str(uuid.uuid4()),
        folder_id=str(folder.id),
        document_id=None,
        user_id=str(collaborator.id),
        permission_level=PermissionLevel.VIEWER,
        organization_id=organization.id,
        granted_by=owner.id,
    )
    db_session.add(permission)
    db_session.commit()

    with pytest.raises(HTTPException) as exc_info:
        document_service.ensure_document_permission(
            db=db_session,
            document=document,
            user=collaborator,
            minimum_level=PermissionLevel.EDITOR,
        )

    assert exc_info.value.status_code == status.HTTP_403_FORBIDDEN
    assert "Insufficient permissions" in exc_info.value.detail


@pytest.mark.asyncio
async def test_upload_document_unsupported_file_type(
    db_session: Session,
    create_deal_for_org,
):
    """
    TDD RED: upload_document should raise HTTPException for unsupported file types

    Tests lines 405-409: Unsupported file type error
    """
    from fastapi import UploadFile
    from io import BytesIO
    from unittest.mock import Mock

    deal, owner, organization = create_deal_for_org()

    # Create unsupported file type with proper mocking
    file_content = BytesIO(b"fake executable content")
    file = UploadFile(filename="malware.exe", file=file_content)

    # Mock content_type property
    type(file).content_type = property(lambda self: "application/x-msdownload")

    with pytest.raises(HTTPException) as exc_info:
        await document_service.upload_document(
            db=db_session,
            file=file,
            deal_id=deal.id,
            current_user=owner,
        )

    assert exc_info.value.status_code == status.HTTP_400_BAD_REQUEST
    assert "Unsupported file type" in exc_info.value.detail


@pytest.mark.asyncio
async def test_upload_document_file_size_exceeds_limit(
    db_session: Session,
    create_deal_for_org,
):
    """
    TDD RED: upload_document should raise HTTPException for files exceeding size limit

    Tests lines 415-419: File size exceeds limit error
    """
    from fastapi import UploadFile
    from io import BytesIO

    deal, owner, organization = create_deal_for_org()

    # Create file exceeding 50MB limit
    large_content = BytesIO(b"x" * (51 * 1024 * 1024))  # 51MB
    file = UploadFile(filename="large-file.pdf", file=large_content)

    # Mock content_type property
    type(file).content_type = property(lambda self: "application/pdf")

    with pytest.raises(HTTPException) as exc_info:
        await document_service.upload_document(
            db=db_session,
            file=file,
            deal_id=deal.id,
            current_user=owner,
        )

    assert exc_info.value.status_code == status.HTTP_400_BAD_REQUEST
    assert "File size exceeds" in exc_info.value.detail


def test_create_folder_insufficient_permissions_for_subfolder(
    db_session: Session,
    create_deal_for_org,
):
    """
    TDD RED: create_folder should raise HTTPException when user lacks permissions for subfolder

    Tests lines 349-352: Insufficient permissions error for subfolder creation
    """
    deal, owner, organization = create_deal_for_org()

    # Create parent folder with proper UUID
    parent_id = str(uuid.uuid4())
    parent_folder = Folder(
        id=parent_id,
        name="Parent",
        deal_id=deal.id,
        organization_id=organization.id,
        created_by=owner.id,
    )
    db_session.add(parent_folder)
    db_session.commit()

    # Create non-owner user with valid role
    non_owner_id = str(uuid.uuid4())
    non_owner = User(
        id=non_owner_id,
        clerk_user_id="clerk-non-owner",
        email="nonowner@test.com",
        organization_id=organization.id,
        role="solo",  # Use valid enum value
    )
    db_session.add(non_owner)
    db_session.commit()

    # Non-owner tries to create subfolder - should fail
    payload = FolderCreate(name="Subfolder", parent_folder_id=str(parent_folder.id))

    with pytest.raises(HTTPException) as exc_info:
        document_service.create_folder(
            db=db_session,
            payload=payload,
            deal_id=deal.id,
            current_user=non_owner,
        )

    assert exc_info.value.status_code == status.HTTP_403_FORBIDDEN
    assert "Insufficient permissions" in exc_info.value.detail


def test_create_folder_non_owner_cannot_create_top_level(
    db_session: Session,
    create_deal_for_org,
):
    """
    TDD RED: create_folder should raise HTTPException when non-owner tries to create top-level folder

    Tests lines 354-358: Only deal owners can create top-level folders
    """
    deal, owner, organization = create_deal_for_org()

    # Create non-owner user with valid role and UUID
    non_owner_id = str(uuid.uuid4())
    non_owner = User(
        id=non_owner_id,
        clerk_user_id="clerk-non-owner-2",
        email="nonowner2@test.com",
        organization_id=organization.id,
        role="solo",  # Use valid enum value
    )
    db_session.add(non_owner)
    db_session.commit()

    # Non-owner tries to create top-level folder - should fail
    payload = FolderCreate(name="Top Level Folder")

    with pytest.raises(HTTPException) as exc_info:
        document_service.create_folder(
            db=db_session,
            payload=payload,
            deal_id=deal.id,
            current_user=non_owner,
        )

    assert exc_info.value.status_code == status.HTTP_403_FORBIDDEN
    assert "Only deal owners" in exc_info.value.detail


@pytest.mark.asyncio
async def test_upload_document_non_owner_cannot_upload_to_root(
    db_session: Session,
    create_deal_for_org,
):
    """
    TDD RED: upload_document should raise HTTPException when non-owner tries to upload to root

    Tests lines 399-403: Only deal owners can upload to root data room
    """
    from fastapi import UploadFile
    from io import BytesIO

    deal, owner, organization = create_deal_for_org()

    # Create non-owner user with valid role and UUID
    non_owner_id = str(uuid.uuid4())
    non_owner = User(
        id=non_owner_id,
        clerk_user_id="clerk-non-owner-3",
        email="nonowner3@test.com",
        organization_id=organization.id,
        role="solo",  # Use valid enum value
    )
    db_session.add(non_owner)
    db_session.commit()

    # Create valid file
    file_content = BytesIO(b"PDF content")
    file = UploadFile(filename="test.pdf", file=file_content)

    # Mock content_type property
    type(file).content_type = property(lambda self: "application/pdf")

    # Non-owner tries to upload to root (no folder_id) - should fail
    with pytest.raises(HTTPException) as exc_info:
        await document_service.upload_document(
            db=db_session,
            file=file,
            deal_id=deal.id,
            current_user=non_owner,
            folder_id=None,
        )

    assert exc_info.value.status_code == status.HTTP_403_FORBIDDEN
    assert "Only deal owners" in exc_info.value.detail





def test_ensure_folder_owner_permission_requires_owner(
    db_session: Session,
    create_deal_for_org,
):
    deal, owner, organization = create_deal_for_org()
    folder = Folder(
        id=str(uuid.uuid4()),
        name="Restricted",
        deal_id=deal.id,
        organization_id=organization.id,
        created_by=owner.id,
    )
    db_session.add(folder)
    db_session.commit()

    viewer = _build_user(organization_id=organization.id)
    db_session.add(viewer)
    db_session.commit()

    with pytest.raises(HTTPException) as exc_info:
        document_service.ensure_folder_owner_permission(
            db=db_session,
            folder=folder,
            user=viewer,
            deal=deal,
        )

    assert exc_info.value.status_code == status.HTTP_403_FORBIDDEN


def test_ensure_deal_access_blocks_other_org(
    db_session, create_deal_for_org, create_organization
):
    deal, owner, organization = create_deal_for_org()
    outsider_org = create_organization()
    outsider = _build_user(organization_id=outsider_org.id)
    db_session.add(outsider)
    db_session.commit()

    with pytest.raises(HTTPException) as exc_info:
        document_service._ensure_deal_access(  # type: ignore[attr-defined]
            db_session,
            deal_id=deal.id,
            user=outsider,
        )

    assert exc_info.value.status_code == status.HTTP_404_NOT_FOUND


def test_user_has_document_listing_access_denied_for_other_org(
    db_session: Session,
    create_deal_for_org,
    create_organization,
):
    deal, owner, organization = create_deal_for_org()
    outsider_org = create_organization()
    outsider = _build_user(organization_id=outsider_org.id)
    db_session.add(outsider)
    db_session.commit()

    assert not document_service._user_has_document_listing_access(  # type: ignore[attr-defined]
        db_session,
        deal=deal,
        user=outsider,
    )


def test_ensure_document_permission_allows_editor_for_own_upload(
    db_session: Session,
    create_deal_for_org,
):
    deal, owner, organization = create_deal_for_org()
    uploader = _build_user(organization_id=organization.id)
    db_session.add(uploader)
    db_session.commit()

    folder, document = _create_base_document(
        db_session,
        deal=deal,
        owner=owner,
        organization=organization,
    )
    document.uploaded_by = uploader.id
    db_session.add(document)
    db_session.commit()

    db_session.add(
        DocumentPermission(
            id=str(uuid.uuid4()),
            folder_id=str(folder.id),
            document_id=None,
            user_id=str(uploader.id),
            permission_level=PermissionLevel.EDITOR,
            organization_id=organization.id,
            granted_by=owner.id,
        )
    )
    db_session.commit()

    assert (
        document_service.ensure_document_permission(
            db=db_session,
            document=document,
            user=uploader,
            minimum_level=PermissionLevel.EDITOR,
            allow_editor_for_own=True,
        )
        == PermissionLevel.OWNER
    )


def _create_base_document(
    db_session: Session,
    *,
    deal,
    owner,
    organization,
    folder_name: str = "Permissions Folder",
    document_name: str = "permissions.pdf",
):
    """Helper to create a folder and document tied to a deal."""

    folder = Folder(
        id=str(uuid.uuid4()),
        name=folder_name,
        deal_id=deal.id,
        organization_id=organization.id,
        created_by=owner.id,
    )
    db_session.add(folder)
    db_session.commit()

    document = Document(
        id=str(uuid.uuid4()),
        name=document_name,
        file_key=f"file-{uuid.uuid4()}",
        file_size=2048,
        file_type="application/pdf",
        deal_id=deal.id,
        folder_id=str(folder.id),
        organization_id=organization.id,
        uploaded_by=owner.id,
    )
    db_session.add(document)
    db_session.commit()

    return folder, document


def _create_folder_hierarchy(
    db_session: Session,
    *,
    deal,
    organization,
    owner,
):
    parent_folder = Folder(
        id=str(uuid.uuid4()),
        name="Parent Folder",
        deal_id=deal.id,
        organization_id=organization.id,
        created_by=owner.id,
    )
    child_folder = Folder(
        id=str(uuid.uuid4()),
        name="Child Folder",
        deal_id=deal.id,
        parent_folder_id=str(parent_folder.id),
        organization_id=organization.id,
        created_by=owner.id,
    )
    db_session.add_all([parent_folder, child_folder])
    db_session.commit()

    return parent_folder, child_folder


def test_ensure_folder_access_rejects_invalid_folder(
    db_session: Session,
    create_deal_for_org,
):
    """Cross-deal folder ids should trigger a 404."""

    deal, owner, organization = create_deal_for_org()
    other_deal, other_owner, other_org = create_deal_for_org()

    folder = Folder(
        id=str(uuid.uuid4()),
        name="Foreign Folder",
        deal_id=other_deal.id,
        organization_id=other_org.id,
        created_by=other_owner.id,
    )
    db_session.add(folder)
    db_session.commit()

    with pytest.raises(HTTPException) as exc_info:
        document_service._ensure_folder_access(  # type: ignore[attr-defined]
            db_session,
            folder_id=str(folder.id),
            deal=deal,
        )

    assert exc_info.value.status_code == status.HTTP_404_NOT_FOUND


def test_resolve_folder_permission_owner_has_implicit_owner(
    db_session: Session,
    create_deal_for_org,
):
    """Deal owners always get OWNER permission."""

    deal, owner, organization = create_deal_for_org()
    _, folder = _create_folder_hierarchy(
        db_session,
        deal=deal,
        organization=organization,
        owner=owner,
    )

    level = document_service._resolve_folder_permission(  # type: ignore[attr-defined]
        db_session,
        folder=folder,
        user=owner,
        deal=deal,
    )

    assert level == PermissionLevel.OWNER


def test_resolve_folder_permission_inherits_from_parent(
    db_session: Session,
    create_deal_for_org,
):
    """Child folders inherit ancestor permissions."""

    deal, owner, organization = create_deal_for_org()
    collaborator = User(
        id=str(uuid.uuid4()),
        clerk_user_id="clerk-folder-collab",
        email="folder@example.com",
        organization_id=organization.id,
        role=UserRole.growth,
    )
    db_session.add(collaborator)
    db_session.commit()

    parent, child = _create_folder_hierarchy(
        db_session,
        deal=deal,
        organization=organization,
        owner=owner,
    )

    db_session.add(
        DocumentPermission(
            id=str(uuid.uuid4()),
            folder_id=str(parent.id),
            document_id=None,
            user_id=str(collaborator.id),
            permission_level=PermissionLevel.EDITOR,
            organization_id=organization.id,
            granted_by=owner.id,
        )
    )
    db_session.commit()

    level = document_service._resolve_folder_permission(  # type: ignore[attr-defined]
        db_session,
        folder=child,
        user=collaborator,
        deal=deal,
    )

    assert level == PermissionLevel.EDITOR


def test_resolve_document_permission_inherits_folder_permissions(
    db_session: Session,
    create_deal_for_org,
):
    deal, owner, organization = create_deal_for_org()
    collaborator = User(
        id=str(uuid.uuid4()),
        clerk_user_id="clerk-collab",
        email="collab@example.com",
        organization_id=organization.id,
        role=UserRole.growth,
    )
    db_session.add(collaborator)
    db_session.commit()

    folder, document = _create_base_document(
        db_session,
        deal=deal,
        owner=owner,
        organization=organization,
    )

    db_session.add(
        DocumentPermission(
            id=str(uuid.uuid4()),
            folder_id=str(folder.id),
            document_id=None,
            user_id=str(collaborator.id),
            permission_level=PermissionLevel.EDITOR,
            organization_id=organization.id,
            granted_by=owner.id,
        )
    )
    db_session.commit()

    level = document_service._resolve_document_permission(  # type: ignore[attr-defined]
        db_session,
        document=document,
        user=collaborator,
    )

    assert level == PermissionLevel.EDITOR


def test_resolve_document_permission_blocks_other_organizations(
    db_session: Session,
    create_deal_for_org,
    create_organization,
):
    deal, owner, organization = create_deal_for_org()
    _, document = _create_base_document(
        db_session,
        deal=deal,
        owner=owner,
        organization=organization,
    )

    outsider_org = create_organization()
    outsider = User(
        id=str(uuid.uuid4()),
        clerk_user_id="clerk-outsider",
        email="outsider@example.com",
        organization_id=outsider_org.id,
        role=UserRole.growth,
    )
    db_session.add(outsider)
    db_session.commit()

    with pytest.raises(HTTPException) as exc_info:
        document_service._resolve_document_permission(  # type: ignore[attr-defined]
            db_session,
            document=document,
            user=outsider,
        )

    assert exc_info.value.status_code == status.HTTP_404_NOT_FOUND


def test_ensure_document_permission_raises_for_insufficient_level(
    db_session: Session,
    create_deal_for_org,
):
    deal, owner, organization = create_deal_for_org()
    collaborator = User(
        id=str(uuid.uuid4()),
        clerk_user_id="clerk-collab-viewer",
        email="viewer@example.com",
        organization_id=organization.id,
        role=UserRole.growth,
    )
    db_session.add(collaborator)
    db_session.commit()

    folder, document = _create_base_document(
        db_session,
        deal=deal,
        owner=owner,
        organization=organization,
    )

    db_session.add(
        DocumentPermission(
            id=str(uuid.uuid4()),
            folder_id=str(folder.id),
            document_id=None,
            user_id=str(collaborator.id),
            permission_level=PermissionLevel.VIEWER,
            organization_id=organization.id,
            granted_by=owner.id,
        )
    )
    db_session.commit()

    with pytest.raises(HTTPException) as exc_info:
        document_service.ensure_document_permission(
            db=db_session,
            document=document,
            user=collaborator,
            minimum_level=PermissionLevel.EDITOR,
        )

    assert exc_info.value.status_code == status.HTTP_403_FORBIDDEN
    assert "Insufficient permissions" in exc_info.value.detail


def test_user_has_document_listing_access_with_folder_permission(
    db_session: Session,
    create_deal_for_org,
):
    deal, owner, organization = create_deal_for_org()
    collaborator = User(
        id=str(uuid.uuid4()),
        clerk_user_id="clerk-list-folder",
        email="list-folder@example.com",
        organization_id=organization.id,
        role=UserRole.growth,
    )
    db_session.add(collaborator)
    db_session.commit()

    folder, _ = _create_base_document(
        db_session,
        deal=deal,
        owner=owner,
        organization=organization,
    )

    db_session.add(
        DocumentPermission(
            id=str(uuid.uuid4()),
            folder_id=str(folder.id),
            document_id=None,
            user_id=str(collaborator.id),
            permission_level=PermissionLevel.VIEWER,
            organization_id=organization.id,
            granted_by=owner.id,
        )
    )
    db_session.commit()

    assert document_service._user_has_document_listing_access(  # type: ignore[attr-defined]
        db_session,
        deal=deal,
        user=collaborator,
    )


def test_user_has_document_listing_access_when_uploaded_document(
    db_session: Session,
    create_deal_for_org,
):
    deal, owner, organization = create_deal_for_org()
    uploader = User(
        id=str(uuid.uuid4()),
        clerk_user_id="clerk-list-upload",
        email="list-upload@example.com",
        organization_id=organization.id,
        role=UserRole.growth,
    )
    db_session.add(uploader)
    db_session.commit()

    document = Document(
        id=str(uuid.uuid4()),
        name="listing.pdf",
        file_key="listing-key",
        file_size=1024,
        file_type="application/pdf",
        deal_id=deal.id,
        folder_id=None,
        organization_id=organization.id,
        uploaded_by=uploader.id,
    )
    db_session.add(document)
    db_session.commit()

    assert document_service._user_has_document_listing_access(  # type: ignore[attr-defined]
        db_session,
        deal=deal,
        user=uploader,
    )


def test_user_has_document_listing_access_denied_without_permissions(
    db_session: Session,
    create_deal_for_org,
):
    deal, owner, organization = create_deal_for_org()
    viewer = User(
        id=str(uuid.uuid4()),
        clerk_user_id="clerk-list-deny",
        email="deny@example.com",
        organization_id=organization.id,
        role=UserRole.growth,
    )
    db_session.add(viewer)
    db_session.commit()

    _create_base_document(
        db_session,
        deal=deal,
        owner=owner,
        organization=organization,
    )

    assert not document_service._user_has_document_listing_access(  # type: ignore[attr-defined]
        db_session,
        deal=deal,
        user=viewer,
    )
