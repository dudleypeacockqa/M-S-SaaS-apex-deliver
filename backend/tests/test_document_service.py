"""Unit tests for document service helpers (DEV-008)."""

from __future__ import annotations

import io
import zipfile
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import List
from uuid import uuid4

import pytest
from fastapi import HTTPException, status

from app.models.document import Document, DocumentAccessLog
from app.models.user import User
from app.services import document_service


class _StubStorage:
    """Minimal async storage stub supporting delete and download operations."""

    def __init__(self, paths: dict[str, Path] | None = None) -> None:
        self.paths = paths or {}
        self.deleted: List[str] = []

    async def delete_file(self, file_key: str, organization_id: str) -> bool:  # pragma: no cover - trivial stub
        self.deleted.append(file_key)
        return True

    async def get_file_path(self, file_key: str, organization_id: str) -> Path:
        return self.paths[file_key]


@pytest.mark.asyncio
async def test_trim_document_versions_keeps_latest_twenty(db_session, create_deal_for_org):
    """Ensure only the 20 most recent versions remain and newest upload is preserved."""

    deal, owner, organization = create_deal_for_org()
    base_time = datetime.now(timezone.utc)

    first_doc_id: str | None = None
    for version in range(1, 25):
        doc_id = str(uuid4())
        if first_doc_id is None:
            first_doc_id = doc_id
        document = Document(
            id=doc_id,
            name="policy.pdf",
            file_key=f"file-{version}",
            file_size=128,
            file_type="application/pdf",
            deal_id=deal.id,
            folder_id=None,
            organization_id=organization.id,
            uploaded_by=owner.id,
            version=version,
            parent_document_id=None if version == 1 else first_doc_id,
            created_at=base_time + timedelta(seconds=version),
        )
        db_session.add(document)

    db_session.commit()

    latest_document = Document(
        id=str(uuid4()),
        name="policy.pdf",
        file_key="file-25",
        file_size=256,
        file_type="application/pdf",
        deal_id=deal.id,
        folder_id=None,
        organization_id=organization.id,
        uploaded_by=owner.id,
        version=25,
        parent_document_id=first_doc_id,
        created_at=base_time + timedelta(seconds=25),
    )
    db_session.add(latest_document)
    db_session.commit()
    db_session.refresh(latest_document)

    storage = _StubStorage()

    await document_service._trim_document_versions(  # type: ignore[attr-defined]
        db_session,
        base_document=latest_document,
        storage=storage,
        max_versions=20,
    )
    db_session.commit()

    remaining = (
        db_session.query(Document)
        .filter(
            Document.name == "policy.pdf",
            Document.deal_id == deal.id,
            Document.archived_at.is_(None),
        )
        .order_by(Document.version.asc())
        .all()
    )

    assert len(remaining) == 20
    remaining_versions = {doc.version for doc in remaining}
    assert remaining_versions == set(range(6, 26))

    root_doc = min(remaining, key=lambda doc: doc.version)
    for doc in remaining:
        if doc.id == root_doc.id:
            assert doc.parent_document_id is None
        else:
            assert doc.parent_document_id == root_doc.id

    assert len(storage.deleted) == 5
    assert set(storage.deleted) == {f"file-{version}" for version in range(1, 6)}


@pytest.mark.asyncio
async def test_trim_document_versions_noop_when_within_limit(db_session, create_deal_for_org):
    """Trimming within the allowed limit should leave documents untouched."""

    deal, owner, organization = create_deal_for_org()
    base_time = datetime.now(timezone.utc)
    first_doc_id: str | None = None

    for version in range(1, 4):
        doc_id = str(uuid4())
        if first_doc_id is None:
            first_doc_id = doc_id
        document = Document(
            id=doc_id,
            name="engagement.pdf",
            file_key=f"eng-{version}",
            file_size=64,
            file_type="application/pdf",
            deal_id=deal.id,
            folder_id=None,
            organization_id=organization.id,
            uploaded_by=owner.id,
            version=version,
            parent_document_id=None if version == 1 else first_doc_id,
            created_at=base_time + timedelta(seconds=version),
        )
        db_session.add(document)

    db_session.commit()

    latest = (
        db_session.query(Document)
        .filter_by(name="engagement.pdf", deal_id=deal.id, version=3)
        .one()
    )
    storage = _StubStorage()

    await document_service._trim_document_versions(  # type: ignore[attr-defined]
        db_session,
        base_document=latest,
        storage=storage,
        max_versions=20,
    )
    db_session.commit()

    remaining = (
        db_session.query(Document)
        .filter(
            Document.name == "engagement.pdf",
            Document.deal_id == deal.id,
            Document.archived_at.is_(None),
        )
        .order_by(Document.version.asc())
        .all()
    )

    assert [doc.version for doc in remaining] == [1, 2, 3]
    assert not storage.deleted
    assert remaining[0].parent_document_id is None
    assert all(doc.parent_document_id == remaining[0].id for doc in remaining[1:])


@pytest.mark.asyncio
async def test_bulk_download_documents_logs_access(monkeypatch, tmp_path, db_session, create_deal_for_org):
    """Bulk download should emit audit logs and include accessible documents."""

    deal, owner, organization = create_deal_for_org()

    file_path = tmp_path / "policy.pdf"
    file_path.write_bytes(b"Confidential policy")

    document = Document(
        id=str(uuid4()),
        name="policy.pdf",
        file_key="file-current",
        file_size=len(b"Confidential policy"),
        file_type="application/pdf",
        deal_id=deal.id,
        folder_id=None,
        organization_id=organization.id,
        uploaded_by=owner.id,
        version=1,
        parent_document_id=None,
        created_at=datetime.now(timezone.utc),
    )
    db_session.add(document)
    db_session.commit()
    db_session.refresh(document)

    storage = _StubStorage(paths={"file-current": file_path})
    monkeypatch.setattr(document_service, "get_storage_service", lambda: storage)

    zip_bytes, filename = await document_service.bulk_download_documents(
        db=db_session,
        document_ids=[document.id],
        organization_id=str(organization.id),
        current_user=owner,
    )

    assert filename.endswith(".zip")
    with zipfile.ZipFile(io.BytesIO(zip_bytes)) as zf:
        assert zf.namelist() == [document.name]
        assert zf.read(document.name) == b"Confidential policy"

    logs = (
        db_session.query(DocumentAccessLog)
        .filter(DocumentAccessLog.document_id == document.id)
        .all()
    )
    assert any(log.action == "bulk_download" for log in logs)


@pytest.mark.asyncio
async def test_bulk_download_documents_requires_viewer_permission(
    monkeypatch,
    tmp_path,
    db_session,
    create_deal_for_org,
    create_user,
):
    """Bulk download should fail when the user lacks viewer permission."""

    deal, owner, organization = create_deal_for_org()

    unauthorized_user: User = create_user(
        role=owner.role,
        organization_id=organization.id,
    )

    file_path = tmp_path / "financials.pdf"
    file_path.write_bytes(b"Financial data")

    document = Document(
        id=str(uuid4()),
        name="financials.pdf",
        file_key="file-denied",
        file_size=len(b"Financial data"),
        file_type="application/pdf",
        deal_id=deal.id,
        folder_id=None,
        organization_id=organization.id,
        uploaded_by=owner.id,
        version=1,
        parent_document_id=None,
        created_at=datetime.now(timezone.utc),
    )
    db_session.add(document)
    db_session.commit()

    storage = _StubStorage(paths={"file-denied": file_path})
    monkeypatch.setattr(document_service, "get_storage_service", lambda: storage)

    with pytest.raises(HTTPException) as exc_info:
        await document_service.bulk_download_documents(
            db=db_session,
            document_ids=[document.id],
            organization_id=str(organization.id),
            current_user=unauthorized_user,
        )

    assert exc_info.value.status_code == status.HTTP_403_FORBIDDEN
