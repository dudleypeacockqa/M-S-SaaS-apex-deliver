"""API endpoints for document external sharing with expiring links."""
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional

import bcrypt
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import and_, select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db.session import get_db
from app.models.document import Document, DocumentShareLink
from app.models.user import User
from app.schemas.document import (
    ShareLinkCreate,
    ShareLinkListResponse,
    ShareLinkPasswordVerify,
    ShareLinkResponse,
    ShareLinkRevokeResponse,
    ShareLinkStats,
    SharedDocumentResponse,
)

router = APIRouter(tags=["document-sharing"])
settings = get_settings()


def generate_secure_token(length: int = 32) -> str:
    """Generate a cryptographically secure random token."""
    return secrets.token_urlsafe(length)


def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    """Verify a password against its hash."""
    return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))


@router.post("/documents/{document_id}/share", response_model=ShareLinkResponse, status_code=status.HTTP_201_CREATED)
def create_share_link(
    document_id: str,
    share_link_data: ShareLinkCreate,
    db: Session = Depends(get_db),
    request: Request = None
):
    """
    Create an expiring share link for a document.

    Allows external sharing with:
    - Configurable expiration (0-365 days)
    - Optional password protection
    - Download control
    - Access tracking
    """
    # Verify document exists
    document = db.execute(select(Document).where(Document.id == document_id)).scalar_one_or_none()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    # Calculate expiration
    expires_at = datetime.now(timezone.utc) + timedelta(days=share_link_data.expires_in_days)

    # Generate secure token
    share_token = generate_secure_token()

    # Hash password if provided
    password_hash = None
    if share_link_data.password_protected and share_link_data.password:
        password_hash = hash_password(share_link_data.password)

    # Create share link
    share_link = DocumentShareLink(
        document_id=document_id,
        share_token=share_token,
        expires_at=expires_at,
        allow_download=1 if share_link_data.allow_download else 0,  # SQLite boolean
        password_hash=password_hash,
        created_by=document.uploaded_by,  # Use document uploader as creator
        organization_id=document.organization_id
    )

    db.add(share_link)
    db.commit()
    db.refresh(share_link)

    # Construct share URL
    base_url = request.base_url if request else "http://localhost:8000/"
    share_url = f"{base_url}shared/{share_link.id}"

    return ShareLinkResponse(
        share_link_id=share_link.id,
        share_url=str(share_url),
        expires_at=share_link.expires_at,
        created_at=share_link.created_at,
        allow_download=bool(share_link.allow_download),
        password_required=password_hash is not None,
        access_count=share_link.access_count
    )


@router.get("/shared/{share_link_id}", response_model=SharedDocumentResponse)
def access_shared_document(
    share_link_id: str,
    db: Session = Depends(get_db),
    request: Request = None
):
    """
    Access a shared document via share link (public endpoint, no auth required).

    Returns document metadata if link is valid and not expired.
    Password-protected links will return 401 and require password verification.
    """
    # Find share link
    share_link = db.execute(
        select(DocumentShareLink).where(DocumentShareLink.id == share_link_id)
    ).scalar_one_or_none()

    if not share_link:
        raise HTTPException(status_code=404, detail="Share link not found or has been revoked")

    # Check if revoked
    if share_link.revoked_at:
        raise HTTPException(status_code=404, detail="Share link not found or has been revoked")

    # Check if expired (handle both timezone-aware and naive datetimes for SQLite/PostgreSQL compatibility)
    now = datetime.now(timezone.utc)
    expires_at = share_link.expires_at
    if expires_at.tzinfo is None:
        # SQLite returns naive datetimes, make now naive too
        now = datetime.utcnow()
    if now > expires_at:
        raise HTTPException(status_code=410, detail="Share link has expired")

    # Check if password protected
    if share_link.password_hash:
        raise HTTPException(status_code=401, detail="Password required to access this document")

    # Increment access count
    share_link.access_count += 1
    last_accessed = datetime.now(timezone.utc)
    if expires_at.tzinfo is None:
        # SQLite requires naive datetime
        last_accessed = datetime.utcnow()
    share_link.last_accessed_at = last_accessed
    db.commit()

    # Get document
    document = db.execute(
        select(Document).where(Document.id == share_link.document_id)
    ).scalar_one_or_none()

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    # Construct download URL if download allowed
    download_url = None
    if share_link.allow_download:
        base_url = request.base_url if request else "http://localhost:8000/"
        download_url = f"{base_url}api/shared/{share_link_id}/download"

    return SharedDocumentResponse(
        document_name=document.name,
        file_size=document.file_size,
        file_type=document.file_type,
        allow_download=bool(share_link.allow_download),
        download_url=download_url
    )


@router.post("/shared/{share_link_id}/verify", response_model=SharedDocumentResponse)
def verify_password_and_access(
    share_link_id: str,
    password_data: ShareLinkPasswordVerify,
    db: Session = Depends(get_db),
    request: Request = None
):
    """
    Verify password and access password-protected shared document.
    """
    # Find share link
    share_link = db.execute(
        select(DocumentShareLink).where(DocumentShareLink.id == share_link_id)
    ).scalar_one_or_none()

    if not share_link or share_link.revoked_at:
        raise HTTPException(status_code=404, detail="Share link not found or has been revoked")

    # Check if expired (handle both timezone-aware and naive datetimes)
    now = datetime.now(timezone.utc)
    expires_at = share_link.expires_at
    if expires_at.tzinfo is None:
        now = datetime.utcnow()
    if now > expires_at:
        raise HTTPException(status_code=410, detail="Share link has expired")

    # Verify password
    if not share_link.password_hash:
        raise HTTPException(status_code=400, detail="This link is not password protected")

    if not verify_password(password_data.password, share_link.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect password")

    # Increment access count
    share_link.access_count += 1
    last_accessed = datetime.now(timezone.utc)
    if expires_at.tzinfo is None:
        last_accessed = datetime.utcnow()
    share_link.last_accessed_at = last_accessed
    db.commit()

    # Get document
    document = db.execute(
        select(Document).where(Document.id == share_link.document_id)
    ).scalar_one_or_none()

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    # Construct download URL if download allowed
    download_url = None
    if share_link.allow_download:
        base_url = request.base_url if request else "http://localhost:8000/"
        download_url = f"{base_url}api/shared/{share_link_id}/download"

    return SharedDocumentResponse(
        document_name=document.name,
        file_size=document.file_size,
        file_type=document.file_type,
        allow_download=bool(share_link.allow_download),
        download_url=download_url
    )


@router.get("/documents/{document_id}/shares", response_model=ShareLinkListResponse)
def list_share_links(
    document_id: str,
    db: Session = Depends(get_db),
    request: Request = None
):
    """
    List all active share links for a document.
    """
    # Verify document exists
    document = db.execute(select(Document).where(Document.id == document_id)).scalar_one_or_none()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    # Get all active share links (not revoked)
    share_links = db.execute(
        select(DocumentShareLink).where(
            and_(
                DocumentShareLink.document_id == document_id,
                DocumentShareLink.revoked_at == None
            )
        )
    ).scalars().all()

    base_url = request.base_url if request else "http://localhost:8000/"

    share_link_responses = [
        ShareLinkResponse(
            share_link_id=link.id,
            share_url=f"{base_url}shared/{link.id}",
            expires_at=link.expires_at,
            created_at=link.created_at,
            allow_download=bool(link.allow_download),
            password_required=link.password_hash is not None,
            access_count=link.access_count
        )
        for link in share_links
    ]

    return ShareLinkListResponse(share_links=share_link_responses)


@router.delete("/documents/{document_id}/shares/{share_link_id}", response_model=ShareLinkRevokeResponse)
def revoke_share_link(
    document_id: str,
    share_link_id: str,
    db: Session = Depends(get_db)
):
    """
    Revoke a share link before its expiration.
    """
    # Find share link
    share_link = db.execute(
        select(DocumentShareLink).where(
            and_(
                DocumentShareLink.id == share_link_id,
                DocumentShareLink.document_id == document_id
            )
        )
    ).scalar_one_or_none()

    if not share_link:
        raise HTTPException(status_code=404, detail="Share link not found")

    # Revoke the link (handle SQLite naive datetimes)
    revoked_at = datetime.now(timezone.utc)
    if share_link.expires_at.tzinfo is None:
        revoked_at = datetime.utcnow()
    share_link.revoked_at = revoked_at
    db.commit()

    return ShareLinkRevokeResponse(
        message="Share link revoked successfully",
        revoked_at=revoked_at
    )


@router.get("/documents/{document_id}/shares/{share_link_id}/stats", response_model=ShareLinkStats)
def get_share_link_stats(
    document_id: str,
    share_link_id: str,
    db: Session = Depends(get_db)
):
    """
    Get statistics for a share link (access count, downloads, etc.).
    """
    # Find share link
    share_link = db.execute(
        select(DocumentShareLink).where(
            and_(
                DocumentShareLink.id == share_link_id,
                DocumentShareLink.document_id == document_id
            )
        )
    ).scalar_one_or_none()

    if not share_link:
        raise HTTPException(status_code=404, detail="Share link not found")

    return ShareLinkStats(
        access_count=share_link.access_count,
        download_count=share_link.download_count,
        last_accessed_at=share_link.last_accessed_at,
        total_downloads=share_link.download_count
    )
