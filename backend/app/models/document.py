"""Document and folder models for secure data room functionality."""
import uuid
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    DateTime,
    ForeignKey,
    BigInteger,
    Integer,
    Index,
    CheckConstraint,
    Text,
    JSON,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base, GUID


QUESTION_STATUS_OPEN = "open"
QUESTION_STATUS_RESOLVED = "resolved"


class Folder(Base):
    """Folder model for organizing documents in a hierarchy."""

    __tablename__ = "folders"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    deal_id = Column(String(36), ForeignKey("deals.id"), nullable=False)
    parent_folder_id = Column(String(36), ForeignKey("folders.id"), nullable=True)
    organization_id = Column(
        String(36), ForeignKey("organizations.id"), nullable=False
    )
    created_by = Column(String(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    deal = relationship("Deal", back_populates="folders")
    organization = relationship("Organization")
    creator = relationship("User", foreign_keys=[created_by])
    documents = relationship("Document", back_populates="folder", cascade="all, delete-orphan")
    children = relationship(
        "Folder",
        back_populates="parent",
        cascade="all, delete-orphan",
        single_parent=True,
    )
    parent = relationship(
        "Folder",
        back_populates="children",
        remote_side="Folder.id",
    )

    __table_args__ = (
        Index("idx_folders_deal_id", "deal_id"),
        Index("idx_folders_parent_id", "parent_folder_id"),
        Index("idx_folders_org_id", "organization_id"),
    )

    def __repr__(self):
        return f"<Folder(id={self.id}, name='{self.name}', deal_id={self.deal_id})>"


class Document(Base):
    """Document model for secure file storage and management."""

    __tablename__ = "documents"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)  # Original filename
    file_key = Column(String(500), nullable=False, unique=True)  # Storage key
    file_size = Column(BigInteger, nullable=False)  # Bytes
    file_type = Column(String(100), nullable=False)  # MIME type
    deal_id = Column(String(36), ForeignKey("deals.id"), nullable=False)
    folder_id = Column(String(36), ForeignKey("folders.id"), nullable=True)
    organization_id = Column(
        String(36), ForeignKey("organizations.id"), nullable=False
    )
    uploaded_by = Column(String(36), ForeignKey("users.id"), nullable=False)
    version = Column(Integer, default=1, nullable=False)
    parent_document_id = Column(GUID, ForeignKey("documents.id"), nullable=True)
    archived_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    deal = relationship("Deal", back_populates="documents")
    folder = relationship("Folder", back_populates="documents")
    organization = relationship("Organization")
    uploader = relationship("User", foreign_keys=[uploaded_by])
    # Version control: parent document has many versions (children)
    versions = relationship(
        "Document",
        back_populates="parent_document",
        cascade="all, delete-orphan",
        foreign_keys=[parent_document_id],
    )
    # Version control: child version references parent document
    parent_document = relationship(
        "Document",
        back_populates="versions",
        remote_side=[id],
        foreign_keys=[parent_document_id],
    )
    permissions = relationship(
        "DocumentPermission", back_populates="document", cascade="all, delete-orphan"
    )
    access_logs = relationship(
        "DocumentAccessLog", back_populates="document", cascade="all, delete-orphan"
    )

    questions = relationship(
        "DocumentQuestion",
        back_populates="document",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        Index("idx_documents_deal_id", "deal_id"),
        Index("idx_documents_folder_id", "folder_id"),
        Index("idx_documents_org_id", "organization_id"),
        Index("idx_documents_name", "name"),
        Index("idx_documents_uploaded_by", "uploaded_by"),
        Index("idx_documents_created_at", "created_at"),
    )

    def __repr__(self):
        return f"<Document(id={self.id}, name='{self.name}', version={self.version})>"


class DocumentPermission(Base):
    """Document permission model for granular access control."""

    __tablename__ = "document_permissions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = Column(GUID, ForeignKey("documents.id"), nullable=True)
    folder_id = Column(String(36), ForeignKey("folders.id"), nullable=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    permission_level = Column(
        String(20), nullable=False
    )  # viewer, editor, owner
    organization_id = Column(
        String(36), ForeignKey("organizations.id"), nullable=False
    )
    granted_by = Column(String(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    document = relationship("Document", back_populates="permissions")
    folder = relationship("Folder")
    user = relationship("User", foreign_keys=[user_id])
    granter = relationship("User", foreign_keys=[granted_by])
    organization = relationship("Organization")

    __table_args__ = (
        Index("idx_doc_perms_document_id", "document_id"),
        Index("idx_doc_perms_folder_id", "folder_id"),
        Index("idx_doc_perms_user_id", "user_id"),
        Index("idx_doc_perms_org_id", "organization_id"),
        CheckConstraint(
            "(document_id IS NOT NULL AND folder_id IS NULL) OR "
            "(document_id IS NULL AND folder_id IS NOT NULL)",
            name="permission_target_check",
        ),
    )

    def __repr__(self):
        return (
            f"<DocumentPermission(user_id={self.user_id}, "
            f"level={self.permission_level})>"
        )


class DocumentAccessLog(Base):
    """Document access log for audit trail and compliance."""

    __tablename__ = "document_access_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = Column(GUID, ForeignKey("documents.id"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    action = Column(String(50), nullable=False)  # view, download, upload, delete
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(String(500), nullable=True)
    metadata = Column(JSON, nullable=True)
    organization_id = Column(
        String(36), ForeignKey("organizations.id"), nullable=False
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    document = relationship("Document", back_populates="access_logs")
    user = relationship("User")
    organization = relationship("Organization")

    __table_args__ = (
        Index("idx_access_logs_document_id", "document_id"),
        Index("idx_access_logs_user_id", "user_id"),
        Index("idx_access_logs_org_id", "organization_id"),
        Index("idx_access_logs_created_at", "created_at"),
    )

    def __repr__(self):
        return (
            f"<DocumentAccessLog(document_id={self.document_id}, "
            f"action={self.action}, user_id={self.user_id})>"
        )


class DocumentShareLink(Base):
    """Document share link model for external secure sharing with expiring links."""

    __tablename__ = "document_share_links"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = Column(GUID, ForeignKey("documents.id"), nullable=False)
    share_token = Column(String(64), nullable=False, unique=True, index=True)  # Secure random token
    expires_at = Column(DateTime(timezone=True), nullable=False)
    allow_download = Column(Integer, default=1, nullable=False)  # SQLite: 1=True, 0=False
    password_hash = Column(String(255), nullable=True)  # Bcrypt hash if password protected
    access_count = Column(Integer, default=0, nullable=False)
    last_accessed_at = Column(DateTime(timezone=True), nullable=True)
    download_count = Column(Integer, default=0, nullable=False)
    revoked_at = Column(DateTime(timezone=True), nullable=True)  # NULL = active, non-NULL = revoked
    created_by = Column(String(36), ForeignKey("users.id"), nullable=False)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    document = relationship("Document")
    creator = relationship("User", foreign_keys=[created_by])
    organization = relationship("Organization")

    __table_args__ = (
        Index("idx_share_links_document_id", "document_id"),
        Index("idx_share_links_token", "share_token"),
        Index("idx_share_links_expires_at", "expires_at"),
        Index("idx_share_links_org_id", "organization_id"),
    )

    def __repr__(self):
        return (
            f"<DocumentShareLink(id={self.id}, document_id={self.document_id}, "
            f"expires_at={self.expires_at})>"
        )


class DocumentQuestion(Base):
    """Persistent Q&A threads for secure document collaboration."""

    __tablename__ = "document_questions"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    document_id = Column(GUID, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)
    asked_by = Column(String(36), ForeignKey("users.id"), nullable=False)
    question = Column(Text, nullable=False)
    status = Column(String(20), nullable=False, default=QUESTION_STATUS_OPEN)
    answer = Column(Text, nullable=True)
    answered_by = Column(String(36), ForeignKey("users.id"), nullable=True)
    answered_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    document = relationship("Document", back_populates="questions")
    organization = relationship("Organization")
    asked_by_user = relationship("User", foreign_keys=[asked_by])
    answered_by_user = relationship("User", foreign_keys=[answered_by])

    __table_args__ = (
        Index("ix_document_questions_document_id", "document_id"),
        Index("ix_document_questions_org_id", "organization_id"),
        Index("ix_document_questions_status", "status"),
    )

    def __repr__(self):
        return f"<DocumentQuestion(id={self.id}, document_id={self.document_id}, status={self.status})>"
