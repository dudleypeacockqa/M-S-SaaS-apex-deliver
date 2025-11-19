"""Success-path coverage for document service helpers."""
from __future__ import annotations

import os
import uuid
from io import BytesIO
from uuid import UUID

import pytest
from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.models.document import (
    Document,
    DocumentAccessLog,
    DocumentPermission,
    DocumentQuestion,
    Folder,
    QUESTION_STATUS_OPEN,
)
from app.models.user import User, UserRole
from app.schemas.document import DocumentListParams, FolderCreate, PermissionLevel
from app.services import document_service


@pytest.fixture(autouse=True)
def override_storage(tmp_path):
    """Ensure uploads hit a temporary storage directory."""
    os.environ["STORAGE_PATH"] = str(tmp_path)

    from app.services import storage_service as storage_module

    storage_module._storage_service = storage_module.LocalStorageService(base_path=tmp_path)  # type: ignore[attr-defined]
    yield
    storage_module._storage_service = None  # type: ignore[attr-defined]


def _build_user(
    *,
    organization_id: str,
    role: str = UserRole.growth,
    email: str = "user@example.com",
    first_name: str | None = None,
    last_name: str | None = None,
) -> User:
    return User(
        id=str(uuid.uuid4()),
        clerk_user_id=f"clerk-{uuid.uuid4()}",
        email=email,
        first_name=first_name,
        last_name=last_name,
        role=role,
        organization_id=organization_id,
    )


def _create_document(
    db_session: Session,
    *,
    name: str,
    deal_id: str,
    organization_id: str,
    uploaded_by: str,
    folder_id: str | None = None,
    file_type: str = "application/pdf",
) -> Document:
    document = Document(
        id=str(uuid.uuid4()),
        name=name,
        file_key=f"file-{uuid.uuid4()}",
        file_size=1024,
        file_type=file_type,
        deal_id=deal_id,
        folder_id=folder_id,
        organization_id=organization_id,
        uploaded_by=uploaded_by,
    )
    db_session.add(document)
    db_session.commit()
    return document


def test_user_display_name_prefers_full_name(create_deal_for_org):
    _, _, organization = create_deal_for_org()
    user = _build_user(organization_id=organization.id, first_name="Alex", last_name="Morgan")
    assert document_service._user_display_name(user) == "Alex Morgan"  # type: ignore[attr-defined]


def test_user_display_name_falls_back_to_email(create_deal_for_org):
    _, _, organization = create_deal_for_org()
    user = _build_user(organization_id=organization.id, first_name=None, last_name=None)
    assert document_service._user_display_name(user) == user.email  # type: ignore[attr-defined]


def test_annotate_question_sets_names(create_deal_for_org):
    _, _, organization = create_deal_for_org()
    question = type("Q", (), {})()
    question.asked_by_user = _build_user(organization_id=organization.id, first_name="Jordan", last_name="Lee")
    question.answered_by_user = _build_user(organization_id=organization.id, email="helper@example.com", first_name=None, last_name=None)

    annotated = document_service._annotate_question(question)  # type: ignore[attr-defined]
    assert annotated.asked_by_name == "Jordan Lee"
    assert annotated.answered_by_name == "helper@example.com"


def test_max_permission_selects_highest_level():
    assert document_service._max_permission(PermissionLevel.VIEWER, PermissionLevel.EDITOR) == PermissionLevel.EDITOR  # type: ignore[attr-defined]
    assert document_service._max_permission(PermissionLevel.OWNER, PermissionLevel.EDITOR) == PermissionLevel.OWNER  # type: ignore[attr-defined]


def test_user_has_document_listing_access_positive(db_session: Session, create_deal_for_org):
    deal, owner, organization = create_deal_for_org()
    collaborator = _build_user(organization_id=organization.id)
    db_session.add(collaborator)

    folder = Folder(
        id=str(uuid.uuid4()),
        name="Folder",
        deal_id=deal.id,
        organization_id=organization.id,
        created_by=owner.id,
    )
    db_session.add(folder)
    db_session.commit()

    permission = DocumentPermission(
        id=str(uuid.uuid4()),
        folder_id=str(folder.id),
        document_id=None,
        user_id=collaborator.id,
        permission_level=PermissionLevel.VIEWER,
        organization_id=organization.id,
        granted_by=owner.id,
    )
    db_session.add(permission)
    db_session.commit()

    assert document_service._user_has_document_listing_access(db_session, deal=deal, user=collaborator)  # type: ignore[attr-defined]


def test_user_has_document_listing_access_denied_for_other_org(db_session: Session, create_deal_for_org, create_organization):
    deal, _, _ = create_deal_for_org()
    outsider_org = create_organization()
    outsider = _build_user(organization_id=outsider_org.id)
    db_session.add(outsider)
    db_session.commit()

    assert not document_service._user_has_document_listing_access(db_session, deal=deal, user=outsider)  # type: ignore[attr-defined]


def test_ensure_folder_owner_permission_allows_owner(db_session: Session, create_deal_for_org):
    deal, owner, organization = create_deal_for_org()
    folder = Folder(
        id=str(uuid.uuid4()),
        name="Owner",
        deal_id=deal.id,
        organization_id=organization.id,
        created_by=owner.id,
    )
    db_session.add(folder)
    db_session.commit()

    document_service.ensure_folder_owner_permission(db_session, folder=folder, user=owner, deal=deal)


def test_ensure_deal_access_blocks_other_org(db_session: Session, create_deal_for_org, create_organization):
    deal, _, _ = create_deal_for_org()
    outsider_org = create_organization()
    outsider = _build_user(organization_id=outsider_org.id)
    db_session.add(outsider)
    db_session.commit()

    with pytest.raises(HTTPException):
        document_service._ensure_deal_access(db_session, deal_id=deal.id, user=outsider)  # type: ignore[attr-defined]


def test_create_folder_owner_creates_top_level(db_session: Session, create_deal_for_org):
    deal, owner, _ = create_deal_for_org()
    payload = FolderCreate(name="  Root Folder  ")

    response = document_service.create_folder(db_session, payload=payload, deal_id=deal.id, current_user=owner)

    assert response.parent_folder_id is None
    assert response.name == "Root Folder"
    created = db_session.get(Folder, str(response.id))
    assert created is not None and created.created_by == owner.id


def test_create_folder_editor_can_create_subfolder(db_session: Session, create_deal_for_org):
    deal, owner, organization = create_deal_for_org()
    parent = Folder(
        id=str(uuid.uuid4()),
        name="Parent",
        deal_id=deal.id,
        organization_id=organization.id,
        created_by=owner.id,
    )
    editor = _build_user(organization_id=organization.id)
    db_session.add_all([parent, editor])
    db_session.commit()

    permission = DocumentPermission(
        id=str(uuid.uuid4()),
        folder_id=str(parent.id),
        document_id=None,
        user_id=editor.id,
        permission_level=PermissionLevel.EDITOR,
        organization_id=organization.id,
        granted_by=owner.id,
    )
    db_session.add(permission)
    db_session.commit()

    payload = FolderCreate(name="Child", parent_folder_id=UUID(str(parent.id)))
    response = document_service.create_folder(db_session, payload=payload, deal_id=deal.id, current_user=editor)

    assert str(response.parent_folder_id) == str(parent.id)


def test_list_documents_owner_receives_metadata(db_session: Session, create_deal_for_org):
    deal, owner, organization = create_deal_for_org()
    folder = Folder(
        id=str(uuid.uuid4()),
        name="Listings",
        deal_id=deal.id,
        organization_id=organization.id,
        created_by=owner.id,
    )
    db_session.add(folder)
    db_session.commit()

    document = _create_document(
        db_session,
        name="Deal Deck",
        deal_id=deal.id,
        organization_id=organization.id,
        uploaded_by=owner.id,
        folder_id=str(folder.id),
    )

    question = DocumentQuestion(
        id=str(uuid.uuid4()),
        document_id=document.id,
        organization_id=organization.id,
        asked_by=owner.id,
        question="Need more info",
        status=QUESTION_STATUS_OPEN,
    )
    db_session.add(question)
    db_session.commit()

    params = DocumentListParams(
        folder_id=UUID(str(folder.id)),
        search="deal",
        file_type="application/pdf",
        per_page=10,
        page=1,
    )

    items, total = document_service.list_documents(
        db_session,
        deal_id=str(deal.id),
        organization_id=organization.id,
        params=params,
        current_user=owner,
    )

    assert total == 1
    assert len(items) == 1
    assert items[0].name == "Deal Deck"
    assert items[0].question_count == 1


def test_list_documents_raises_for_viewer_without_access(db_session: Session, create_deal_for_org):
    deal, owner, organization = create_deal_for_org()
    _create_document(
        db_session,
        name="Private Deck",
        deal_id=deal.id,
        organization_id=organization.id,
        uploaded_by=owner.id,
    )

    viewer = _build_user(organization_id=organization.id)
    db_session.add(viewer)
    db_session.commit()

    params = DocumentListParams(page=1, per_page=5)

    with pytest.raises(HTTPException) as exc_info:
        document_service.list_documents(
            db_session,
            deal_id=str(deal.id),
            organization_id=organization.id,
            params=params,
            current_user=viewer,
        )

    assert exc_info.value.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.asyncio
async def test_upload_document_owner_success_root(db_session: Session, create_deal_for_org):
    deal, owner, _ = create_deal_for_org()
    upload = UploadFile(filename="deal.pdf", file=BytesIO(b"root"))
    type(upload).content_type = property(lambda self: "application/pdf")

    response = await document_service.upload_document(db_session, file=upload, deal_id=deal.id, current_user=owner)
    stored = db_session.get(Document, str(response.id))
    assert stored is not None and stored.version == 1

    log = (
        db_session.query(DocumentAccessLog)
        .filter(DocumentAccessLog.document_id == str(stored.id), DocumentAccessLog.action == "upload")
        .one()
    )
    assert log.user_id == str(owner.id)


@pytest.mark.asyncio
async def test_upload_document_increments_versions(db_session: Session, create_deal_for_org):
    deal, owner, organization = create_deal_for_org()
    folder = Folder(
        id=str(uuid.uuid4()),
        name="Versions",
        deal_id=deal.id,
        organization_id=organization.id,
        created_by=owner.id,
    )
    db_session.add(folder)
    db_session.commit()

    async def _upload(payload: bytes):
        upload = UploadFile(filename="file.pdf", file=BytesIO(payload))
        type(upload).content_type = property(lambda self: "application/pdf")
        return await document_service.upload_document(
            db=db_session,
            file=upload,
            deal_id=deal.id,
            current_user=owner,
            folder_id=str(folder.id),
        )

    await _upload(b"v1")
    await _upload(b"v2")
    docs = (
        db_session.query(Document)
        .filter(Document.folder_id == str(folder.id))
        .order_by(Document.version.asc())
        .all()
    )
    assert [doc.version for doc in docs] == [1, 2]
    assert docs[1].parent_document_id == docs[0].id
