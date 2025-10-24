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
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class Folder(Base):
    """Folder model for organizing documents in a hierarchy."""

    __tablename__ = "folders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    deal_id = Column(UUID(as_uuid=True), ForeignKey("deals.id"), nullable=False)
    parent_folder_id = Column(UUID(as_uuid=True), ForeignKey("folders.id"), nullable=True)
    organization_id = Column(
        UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False
    )
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
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
        remote_side=[id],
    )
    parent = relationship("Folder", back_populates="children", remote_side=[parent_folder_id])

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

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)  # Original filename
    file_key = Column(String(500), nullable=False, unique=True)  # Storage key
    file_size = Column(BigInteger, nullable=False)  # Bytes
    file_type = Column(String(100), nullable=False)  # MIME type
    deal_id = Column(UUID(as_uuid=True), ForeignKey("deals.id"), nullable=False)
    folder_id = Column(UUID(as_uuid=True), ForeignKey("folders.id"), nullable=True)
    organization_id = Column(
        UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False
    )
    uploaded_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    version = Column(Integer, default=1, nullable=False)
    parent_document_id = Column(
        UUID(as_uuid=True), ForeignKey("documents.id"), nullable=True
    )
    archived_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    deal = relationship("Deal", back_populates="documents")
    folder = relationship("Folder", back_populates="documents")
    organization = relationship("Organization")
    uploader = relationship("User", foreign_keys=[uploaded_by])
    versions = relationship(
        "Document",
        back_populates="parent_document",
        cascade="all, delete-orphan",
        remote_side=[id],
    )
    parent_document = relationship(
        "Document", back_populates="versions", remote_side=[parent_document_id]
    )
    permissions = relationship(
        "DocumentPermission", back_populates="document", cascade="all, delete-orphan"
    )
    access_logs = relationship(
        "DocumentAccessLog", back_populates="document", cascade="all, delete-orphan"
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

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id"), nullable=True)
    folder_id = Column(UUID(as_uuid=True), ForeignKey("folders.id"), nullable=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    permission_level = Column(
        String(20), nullable=False
    )  # viewer, editor, owner
    organization_id = Column(
        UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False
    )
    granted_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
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

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    action = Column(String(50), nullable=False)  # view, download, upload, delete
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(String(500), nullable=True)
    organization_id = Column(
        UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False
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
