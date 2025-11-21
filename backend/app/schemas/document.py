"""Document and folder Pydantic schemas."""
from datetime import datetime
from typing import Any, Dict, List, Optional, Literal
from uuid import UUID

from pydantic import BaseModel, Field, field_validator


class FolderCreate(BaseModel):
    """Schema for creating a folder."""

    name: str = Field(..., min_length=1, max_length=255, description="Folder name")
    parent_folder_id: Optional[UUID] = Field(None, description="Parent folder UUID")

    @field_validator('name')
    @classmethod
    def name_must_not_be_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError('Folder name cannot be empty or whitespace')
        return v.strip()


class FolderUpdate(BaseModel):
    """Schema for updating a folder."""

    name: Optional[str] = Field(None, min_length=1, max_length=255)
    parent_folder_id: Optional[UUID] = None

    @field_validator('name')
    @classmethod
    def name_must_not_be_empty(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not v.strip():
            raise ValueError('Folder name cannot be empty or whitespace')
        return v.strip() if v else None


class FolderResponse(BaseModel):
    """Schema for folder response."""

    id: UUID
    name: str
    deal_id: str
    parent_folder_id: Optional[UUID]
    organization_id: UUID
    created_by: UUID
    created_at: datetime
    updated_at: Optional[datetime]
    children: List['FolderResponse'] = Field(default_factory=list)
    document_count: int = 0
    has_children: bool = False

    model_config = {"from_attributes": True}


class DocumentMetadata(BaseModel):
    """Schema for document metadata (no file content)."""

    id: UUID
    name: str
    file_size: int
    file_type: str
    deal_id: str
    folder_id: Optional[UUID]
    organization_id: UUID
    uploaded_by: UUID
    version: int
    parent_document_id: Optional[UUID]
    archived_at: Optional[datetime]
    created_at: datetime
    updated_at: Optional[datetime]
    uploader_name: Optional[str] = None
    question_count: int = 0

    model_config = {"from_attributes": True}


class DocumentUploadResponse(BaseModel):
    """Schema for document upload response."""

    id: UUID
    name: str
    file_size: int
    file_type: str
    deal_id: str
    folder_id: Optional[UUID]
    organization_id: UUID
    uploaded_by: UUID
    version: int
    parent_document_id: Optional[UUID]
    archived_at: Optional[datetime]
    created_at: datetime
    updated_at: Optional[datetime]
    uploader_name: Optional[str] = None

    model_config = {"from_attributes": True}


class DocumentListParams(BaseModel):
    """Schema for document list query parameters."""

    deal_id: Optional[UUID] = None
    folder_id: Optional[UUID] = None
    search: Optional[str] = Field(None, max_length=255)
    file_type: Optional[str] = Field(None, max_length=100)
    uploaded_by: Optional[UUID] = None
    uploaded_after: Optional[datetime] = None
    uploaded_before: Optional[datetime] = None
    include_archived: bool = False
    page: int = Field(1, ge=1)
    per_page: int = Field(50, ge=1, le=100)


class PaginatedDocuments(BaseModel):
    """Schema for paginated document list."""

    items: List[DocumentMetadata]
    total: int
    page: int
    per_page: int
    pages: int


class DocumentVersionInfo(BaseModel):
    """Schema for document version information."""

    id: UUID
    version: int
    file_size: int
    uploaded_by: UUID
    uploader_name: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class PermissionLevel(str):
    """Document permission levels."""

    NONE = "none"
    VIEWER = "viewer"
    EDITOR = "editor"
    OWNER = "owner"

class PermissionCreate(BaseModel):
    """Schema for creating a permission."""

    user_id: UUID
    permission_level: str = Field(..., pattern="^(viewer|editor|owner)$")

    @field_validator('permission_level')
    @classmethod
    def validate_permission_level(cls, v: str) -> str:
        allowed = [PermissionLevel.VIEWER, PermissionLevel.EDITOR, PermissionLevel.OWNER]
        if v not in allowed:
            raise ValueError(f'Permission level must be one of: {", ".join(allowed)}')
        return v


class PermissionResponse(BaseModel):
    """Schema for permission response."""

    id: UUID
    document_id: Optional[UUID]
    folder_id: Optional[UUID]
    user_id: UUID
    user_name: Optional[str] = None
    permission_level: str
    granted_by: UUID
    granter_name: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class DocumentAccessLogEntry(BaseModel):
    """Schema for document access log entry."""

    id: UUID
    document_id: UUID
    user_id: UUID
    user_name: Optional[str] = None
    action: str
    ip_address: Optional[str]
    user_agent: Optional[str]
    metadata: Optional[Dict[str, Any]] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class DocumentAccessLogCreate(BaseModel):
    """Schema for creating manual document audit events."""

    action: str = Field(..., min_length=3, max_length=50)
    metadata: Optional[Dict[str, Any]] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None


class BulkDownloadRequest(BaseModel):
    """Schema for bulk download request."""

    document_ids: List[UUID] = Field(..., min_length=1, max_length=100)


class BulkDeleteRequest(BaseModel):
    """Schema for bulk delete request."""

    document_ids: List[UUID] = Field(..., min_length=1, max_length=100)


# Allowed file types for upload
ALLOWED_FILE_TYPES = {
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',  # DOCX
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',  # XLSX
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',  # PPTX
    'application/msword',  # DOC
    'application/vnd.ms-excel',  # XLS
    'application/vnd.ms-powerpoint',  # PPT
    'text/plain',
    'text/csv',
    'image/png',
    'image/jpeg',
    'image/jpg',
}

# Maximum file size: 50MB
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB in bytes

# Maximum versions per document
MAX_VERSIONS_PER_DOCUMENT = 20


class BulkDeleteResponse(BaseModel):
    """Schema for bulk delete response."""

    deleted_count: int
    deleted_ids: List[str]
    failed_ids: List[str] = []
    failed_reasons: dict[str, str] = {}


# Document Sharing Schemas

class ShareLinkCreate(BaseModel):
    """Schema for creating a document share link."""

    expires_in_days: int = Field(..., ge=0, le=365, description="Days until link expires (0 = immediate)")
    allow_download: bool = Field(True, description="Allow file download via share link")
    password_protected: bool = Field(False, description="Require password to access")
    password: Optional[str] = Field(None, min_length=8, max_length=100, description="Password if protected")

    @field_validator('password')
    @classmethod
    def password_required_when_protected(cls, v: Optional[str], values) -> Optional[str]:
        # Access password_protected from values.data if available
        data = values.data if hasattr(values, 'data') else {}
        password_protected = data.get('password_protected', False)
        if password_protected and not v:
            raise ValueError('Password is required when password_protected is True')
        if not password_protected and v:
            raise ValueError('Password should not be provided when password_protected is False')
        return v


class ShareLinkResponse(BaseModel):
    """Schema for share link response."""

    share_link_id: str
    share_url: str
    expires_at: datetime
    created_at: datetime
    allow_download: bool
    password_required: bool
    access_count: int = 0

    model_config = {"from_attributes": True}


class ShareLinkListResponse(BaseModel):
    """Schema for listing share links."""

    share_links: List[ShareLinkResponse]


class SharedDocumentResponse(BaseModel):
    """Schema for accessing a shared document."""

    document_name: str
    file_size: int
    file_type: str
    allow_download: bool
    download_url: Optional[str] = None

    model_config = {"from_attributes": True}


class ShareLinkPasswordVerify(BaseModel):
    """Schema for verifying password-protected share link."""

    password: str = Field(..., min_length=1, max_length=100)


class ShareLinkStats(BaseModel):
    """Schema for share link statistics."""

    access_count: int
    download_count: int = 0
    last_accessed_at: Optional[datetime]
    total_downloads: int = 0  # Alias for download_count

    model_config = {"from_attributes": True}


class ShareLinkRevokeResponse(BaseModel):
    """Schema for share link revocation response."""

    message: str
    revoked_at: datetime



# Resolve forward refs for recursive folder response
FolderResponse.model_rebuild()


class DocumentQuestionCreate(BaseModel):
    """Schema for creating a document question."""

    question: str = Field(..., min_length=3, max_length=2000)

    @field_validator('question')
    @classmethod
    def strip_question(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError('Question cannot be blank')
        return cleaned


class DocumentQuestionResolve(BaseModel):
    """Schema for resolving/answering a document question."""

    answer: str = Field(..., min_length=3, max_length=4000)

    @field_validator('answer')
    @classmethod
    def strip_answer(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError('Answer cannot be blank')
        return cleaned


class DocumentQuestionResponse(BaseModel):
    """Schema for a document question entry."""

    id: UUID
    document_id: UUID
    organization_id: UUID
    question: str
    status: Literal['open', 'resolved']
    asked_by: UUID
    asked_by_name: Optional[str] = None
    answer: Optional[str]
    answered_by: Optional[UUID]
    answered_by_name: Optional[str] = None
    answered_at: Optional[datetime]
    created_at: datetime
    updated_at: Optional[datetime]

    model_config = {"from_attributes": True}


class DocumentQuestionListResponse(BaseModel):
    """Paginated response for document question threads."""

    total: int
    items: List[DocumentQuestionResponse]

