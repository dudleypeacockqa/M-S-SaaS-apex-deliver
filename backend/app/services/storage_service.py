"""File storage service for secure document management."""
import hashlib
import shutil
import uuid
from pathlib import Path
from typing import BinaryIO, Optional, Protocol

from app.core.config import get_settings


class StorageServiceProtocol(Protocol):
    """Protocol defining the storage service interface."""

    def generate_file_key(
        self,
        organization_id: str,
        deal_id: str,
        filename: str,
        user_id: str
    ) -> str:
        """Generate unique storage key for file."""
        ...

    async def save_file(
        self,
        file_key: str,
        file_stream: BinaryIO,
        organization_id: str
    ) -> str:
        """Save file to storage."""
        ...

    async def get_file_path(
        self,
        file_key: str,
        organization_id: str
    ) -> Path:
        """Get file path for reading."""
        ...

    async def delete_file(
        self,
        file_key: str,
        organization_id: str
    ) -> bool:
        """Delete file from storage."""
        ...

    async def file_exists(
        self,
        file_key: str,
        organization_id: str
    ) -> bool:
        """Check if file exists."""
        ...

    def get_file_size(
        self,
        file_key: str,
        organization_id: str
    ) -> int:
        """Get file size in bytes."""
        ...


class LocalStorageService:
    """
    File storage abstraction layer.
    Supports local filesystem with S3-ready architecture for future migration.
    """

    def __init__(self, base_path: Optional[str] = None):
        """
        Initialize storage service.

        Args:
            base_path: Base directory for file storage. If None, uses settings.
        """
        settings = get_settings()
        self.base_path = Path(base_path or getattr(settings, 'STORAGE_PATH', './storage'))
        self.base_path.mkdir(parents=True, exist_ok=True)

    def generate_file_key(
        self,
        organization_id: str,
        deal_id: str,
        filename: str,
        user_id: str
    ) -> str:
        """
        Generate unique, encrypted storage key for file.

        Args:
            organization_id: Organization UUID
            deal_id: Deal UUID
            filename: Original filename
            user_id: Uploader UUID

        Returns:
            SHA256 hash-based storage key
        """
        unique_string = f"{organization_id}/{deal_id}/{filename}/{user_id}/{uuid.uuid4()}"
        return hashlib.sha256(unique_string.encode()).hexdigest()

    def _get_org_path(self, organization_id: str) -> Path:
        """Get organization-specific storage directory."""
        org_path = self.base_path / organization_id
        org_path.mkdir(parents=True, exist_ok=True)
        return org_path

    async def save_file(
        self,
        file_key: str,
        file_stream: BinaryIO,
        organization_id: str
    ) -> str:
        """
        Save file to storage.

        Args:
            file_key: Unique storage key
            file_stream: File binary stream
            organization_id: Organization UUID

        Returns:
            Full storage path as string

        Raises:
            IOError: If file save fails
        """
        org_path = self._get_org_path(organization_id)
        file_path = org_path / file_key

        try:
            with open(file_path, 'wb') as f:
                shutil.copyfileobj(file_stream, f)
            return str(file_path)
        except Exception as e:
            # Cleanup partial file if save failed
            if file_path.exists():
                file_path.unlink()
            raise IOError(f"Failed to save file {file_key}: {str(e)}")

    async def get_file_path(
        self,
        file_key: str,
        organization_id: str
    ) -> Path:
        """
        Get file path for reading.

        Args:
            file_key: Storage key
            organization_id: Organization UUID

        Returns:
            Path object to file

        Raises:
            FileNotFoundError: If file doesn't exist
        """
        file_path = self.base_path / organization_id / file_key
        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {file_key}")
        return file_path

    async def delete_file(
        self,
        file_key: str,
        organization_id: str
    ) -> bool:
        """
        Delete file from storage.

        Args:
            file_key: Storage key
            organization_id: Organization UUID

        Returns:
            True if deleted, False if file didn't exist
        """
        file_path = self.base_path / organization_id / file_key
        if file_path.exists():
            file_path.unlink()
            return True
        return False

    async def file_exists(
        self,
        file_key: str,
        organization_id: str
    ) -> bool:
        """
        Check if file exists in storage.

        Args:
            file_key: Storage key
            organization_id: Organization UUID

        Returns:
            True if file exists, False otherwise
        """
        file_path = self.base_path / organization_id / file_key
        return file_path.exists()

    def get_file_size(
        self,
        file_key: str,
        organization_id: str
    ) -> int:
        """
        Get file size in bytes.

        Args:
            file_key: Storage key
            organization_id: Organization UUID

        Returns:
            File size in bytes

        Raises:
            FileNotFoundError: If file doesn't exist
        """
        file_path = self.base_path / organization_id / file_key
        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {file_key}")
        return file_path.stat().st_size


# Singleton instance
_storage_service: Optional[StorageServiceProtocol] = None


def get_storage_service() -> StorageServiceProtocol:
    """
    Get singleton storage service instance.

    Returns LocalStorageService for local filesystem (development)
    or S3StorageService for cloud storage (production) based on
    USE_S3_STORAGE configuration flag.
    """
    global _storage_service
    if _storage_service is None:
        settings = get_settings()
        if settings.use_s3_storage:
            # Import here to avoid circular dependency and allow graceful degradation
            from app.services.s3_storage_service import S3StorageService
            _storage_service = S3StorageService()
        else:
            _storage_service = LocalStorageService()
    return _storage_service
