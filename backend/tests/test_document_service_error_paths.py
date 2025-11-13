"""
TDD Tests for Document Service Error Paths
Target: Increase coverage of app/services/document_service.py error handling
Focus: ValueError paths, edge cases, permission errors
"""
from __future__ import annotations

import uuid
import pytest
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.deal import Deal, DealStage
from app.models.document import Document, Folder
from app.models.user import User, UserRole
from app.services import document_service


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
        folder_id=folder.id,
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
        parent_folder_id=parent_folder.id,
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
    from app.schemas.document import FolderCreate

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
    payload = FolderCreate(name="Subfolder", parent_folder_id=parent_folder.id)

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
    from app.schemas.document import FolderCreate

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

