"""
Comprehensive tests for S3/R2 Storage Service (DEV-016 Phase 1.1).

Tests S3-compatible storage implementation with mocked boto3 client.
Following TDD RED → GREEN → REFACTOR methodology.
"""
from __future__ import annotations

import io
from unittest.mock import MagicMock, Mock, patch
from uuid import uuid4

import pytest
from botocore.exceptions import ClientError

from app.services.s3_storage_service import S3StorageService


class TestS3StorageServiceInitialization:
    """Test suite for S3StorageService initialization and configuration."""

    @patch('app.services.s3_storage_service.boto3.client')
    @patch('app.services.s3_storage_service.get_settings')
    def test_initialization_with_valid_credentials(self, mock_settings, mock_boto_client):
        """Test successful initialization with all required credentials."""
        # Arrange
        mock_settings_obj = Mock()
        mock_settings_obj.R2_ENDPOINT_URL = "https://test.r2.cloudflarestorage.com"
        mock_settings_obj.R2_ACCESS_KEY_ID = "test_access_key"
        mock_settings_obj.R2_SECRET_ACCESS_KEY = "test_secret_key"
        mock_settings_obj.R2_BUCKET_NAME = "test-bucket"
        mock_settings_obj.R2_REGION = "auto"
        mock_settings.return_value = mock_settings_obj

        # Act
        service = S3StorageService()

        # Assert
        assert service.endpoint_url == "https://test.r2.cloudflarestorage.com"
        assert service.access_key_id == "test_access_key"
        assert service.bucket_name == "test-bucket"
        mock_boto_client.assert_called_once()

    @patch('app.services.s3_storage_service.get_settings')
    def test_initialization_fails_without_credentials(self, mock_settings):
        """Test initialization raises ValueError when credentials missing."""
        # Arrange
        mock_settings_obj = Mock()
        mock_settings_obj.R2_ENDPOINT_URL = None
        mock_settings_obj.R2_ACCESS_KEY_ID = None
        mock_settings_obj.R2_SECRET_ACCESS_KEY = None
        mock_settings.return_value = mock_settings_obj

        # Act & Assert
        with pytest.raises(ValueError, match="S3/R2 storage requires"):
            S3StorageService()

    @patch('app.services.s3_storage_service.get_settings')
    def test_initialization_fails_with_partial_credentials(self, mock_settings):
        """Test initialization fails when only some credentials provided."""
        # Arrange
        mock_settings_obj = Mock()
        mock_settings_obj.R2_ENDPOINT_URL = "https://test.r2.cloudflarestorage.com"
        mock_settings_obj.R2_ACCESS_KEY_ID = "test_key"
        mock_settings_obj.R2_SECRET_ACCESS_KEY = None  # Missing
        mock_settings.return_value = mock_settings_obj

        # Act & Assert
        with pytest.raises(ValueError):
            S3StorageService()


class TestS3StorageServiceFileKey:
    """Test suite for file key generation."""

    @patch('app.services.s3_storage_service.boto3.client')
    @patch('app.services.s3_storage_service.get_settings')
    def test_generate_file_key_creates_unique_hash(self, mock_settings, mock_boto_client):
        """Test file key generation produces SHA256 hash."""
        # Arrange
        mock_settings_obj = Mock()
        mock_settings_obj.R2_ENDPOINT_URL = "https://test.r2.cloudflarestorage.com"
        mock_settings_obj.R2_ACCESS_KEY_ID = "test_key"
        mock_settings_obj.R2_SECRET_ACCESS_KEY = "test_secret"
        mock_settings.return_value = mock_settings_obj

        service = S3StorageService()
        org_id = str(uuid4())
        deal_id = str(uuid4())
        user_id = str(uuid4())

        # Act
        file_key = service.generate_file_key(org_id, deal_id, "test.pdf", user_id)

        # Assert
        assert isinstance(file_key, str)
        assert len(file_key) == 64  # SHA256 produces 64 character hex string

    @patch('app.services.s3_storage_service.boto3.client')
    @patch('app.services.s3_storage_service.get_settings')
    def test_generate_file_key_is_unique(self, mock_settings, mock_boto_client):
        """Test file key generation produces different hashes for same input."""
        # Arrange
        mock_settings_obj = Mock()
        mock_settings_obj.R2_ENDPOINT_URL = "https://test.r2.cloudflarestorage.com"
        mock_settings_obj.R2_ACCESS_KEY_ID = "test_key"
        mock_settings_obj.R2_SECRET_ACCESS_KEY = "test_secret"
        mock_settings.return_value = mock_settings_obj

        service = S3StorageService()
        org_id = str(uuid4())
        deal_id = str(uuid4())
        user_id = str(uuid4())

        # Act
        key1 = service.generate_file_key(org_id, deal_id, "test.pdf", user_id)
        key2 = service.generate_file_key(org_id, deal_id, "test.pdf", user_id)

        # Assert - Should be different due to UUID in hash
        assert key1 != key2


class TestS3StorageServiceFileOperations:
    """Test suite for S3 file operations (upload, download, delete)."""

    @pytest.mark.asyncio
    @patch('app.services.s3_storage_service.boto3.client')
    @patch('app.services.s3_storage_service.get_settings')
    async def test_save_file_uploads_successfully(self, mock_settings, mock_boto_client):
        """Test file upload to S3/R2 storage."""
        # Arrange
        mock_settings_obj = Mock()
        mock_settings_obj.R2_ENDPOINT_URL = "https://test.r2.cloudflarestorage.com"
        mock_settings_obj.R2_ACCESS_KEY_ID = "test_key"
        mock_settings_obj.R2_SECRET_ACCESS_KEY = "test_secret"
        mock_settings_obj.R2_BUCKET_NAME = "test-bucket"
        mock_settings.return_value = mock_settings_obj

        mock_client = MagicMock()
        mock_boto_client.return_value = mock_client

        service = S3StorageService()
        file_stream = io.BytesIO(b"test file content")
        org_id = str(uuid4())
        file_key = "test-file-key"

        # Act
        result = await service.save_file(file_key, file_stream, org_id)

        # Assert
        assert result == f"s3://test-bucket/{org_id}/{file_key}"
        mock_client.upload_fileobj.assert_called_once()

    @pytest.mark.asyncio
    @patch('app.services.s3_storage_service.boto3.client')
    @patch('app.services.s3_storage_service.get_settings')
    async def test_save_file_includes_metadata(self, mock_settings, mock_boto_client):
        """Test file upload includes organization and file key metadata."""
        # Arrange
        mock_settings_obj = Mock()
        mock_settings_obj.R2_ENDPOINT_URL = "https://test.r2.cloudflarestorage.com"
        mock_settings_obj.R2_ACCESS_KEY_ID = "test_key"
        mock_settings_obj.R2_SECRET_ACCESS_KEY = "test_secret"
        mock_settings_obj.R2_BUCKET_NAME = "test-bucket"
        mock_settings.return_value = mock_settings_obj

        mock_client = MagicMock()
        mock_boto_client.return_value = mock_client

        service = S3StorageService()
        file_stream = io.BytesIO(b"test content")
        org_id = str(uuid4())
        file_key = "test-key"

        # Act
        await service.save_file(file_key, file_stream, org_id)

        # Assert
        call_args = mock_client.upload_fileobj.call_args
        extra_args = call_args[1]['ExtraArgs']
        assert extra_args['Metadata']['organization_id'] == org_id
        assert extra_args['Metadata']['file_key'] == file_key

    @pytest.mark.asyncio
    @patch('app.services.s3_storage_service.boto3.client')
    @patch('app.services.s3_storage_service.get_settings')
    async def test_save_file_handles_client_error(self, mock_settings, mock_boto_client):
        """Test save_file raises IOError on S3 client error."""
        # Arrange
        mock_settings_obj = Mock()
        mock_settings_obj.R2_ENDPOINT_URL = "https://test.r2.cloudflarestorage.com"
        mock_settings_obj.R2_ACCESS_KEY_ID = "test_key"
        mock_settings_obj.R2_SECRET_ACCESS_KEY = "test_secret"
        mock_settings.return_value = mock_settings_obj

        mock_client = MagicMock()
        error_response = {'Error': {'Code': 'AccessDenied', 'Message': 'Access Denied'}}
        mock_client.upload_fileobj.side_effect = ClientError(error_response, 'upload_fileobj')
        mock_boto_client.return_value = mock_client

        service = S3StorageService()
        file_stream = io.BytesIO(b"test")
        org_id = str(uuid4())

        # Act & Assert
        with pytest.raises(IOError, match="Failed to upload file to S3"):
            await service.save_file("test-key", file_stream, org_id)

    @pytest.mark.asyncio
    @patch('app.services.s3_storage_service.boto3.client')
    @patch('app.services.s3_storage_service.get_settings')
    async def test_get_file_path_returns_presigned_url(self, mock_settings, mock_boto_client):
        """Test get_file_path returns presigned URL for existing file."""
        # Arrange
        mock_settings_obj = Mock()
        mock_settings_obj.R2_ENDPOINT_URL = "https://test.r2.cloudflarestorage.com"
        mock_settings_obj.R2_ACCESS_KEY_ID = "test_key"
        mock_settings_obj.R2_SECRET_ACCESS_KEY = "test_secret"
        mock_settings_obj.R2_BUCKET_NAME = "test-bucket"
        mock_settings.return_value = mock_settings_obj

        mock_client = MagicMock()
        mock_client.head_object.return_value = {'ContentLength': 1024}
        mock_client.generate_presigned_url.return_value = "https://presigned.url/test-file"
        mock_boto_client.return_value = mock_client

        service = S3StorageService()
        org_id = str(uuid4())
        file_key = "test-key"

        # Act
        result = await service.get_file_path(file_key, org_id)

        # Assert
        assert result == "https://presigned.url/test-file"
        mock_client.head_object.assert_called_once()
        mock_client.generate_presigned_url.assert_called_once()

    @pytest.mark.asyncio
    @patch('app.services.s3_storage_service.boto3.client')
    @patch('app.services.s3_storage_service.get_settings')
    async def test_get_file_path_raises_error_for_missing_file(self, mock_settings, mock_boto_client):
        """Test get_file_path raises FileNotFoundError for non-existent file."""
        # Arrange
        mock_settings_obj = Mock()
        mock_settings_obj.R2_ENDPOINT_URL = "https://test.r2.cloudflarestorage.com"
        mock_settings_obj.R2_ACCESS_KEY_ID = "test_key"
        mock_settings_obj.R2_SECRET_ACCESS_KEY = "test_secret"
        mock_settings.return_value = mock_settings_obj

        mock_client = MagicMock()
        error_response = {'Error': {'Code': '404', 'Message': 'Not Found'}}
        mock_client.head_object.side_effect = ClientError(error_response, 'head_object')
        mock_boto_client.return_value = mock_client

        service = S3StorageService()
        org_id = str(uuid4())

        # Act & Assert
        with pytest.raises(FileNotFoundError, match="File not found in S3"):
            await service.get_file_path("missing-key", org_id)

    @pytest.mark.asyncio
    @patch('app.services.s3_storage_service.boto3.client')
    @patch('app.services.s3_storage_service.get_settings')
    async def test_delete_file_removes_from_storage(self, mock_settings, mock_boto_client):
        """Test file deletion from S3/R2 storage."""
        # Arrange
        mock_settings_obj = Mock()
        mock_settings_obj.R2_ENDPOINT_URL = "https://test.r2.cloudflarestorage.com"
        mock_settings_obj.R2_ACCESS_KEY_ID = "test_key"
        mock_settings_obj.R2_SECRET_ACCESS_KEY = "test_secret"
        mock_settings_obj.R2_BUCKET_NAME = "test-bucket"
        mock_settings.return_value = mock_settings_obj

        mock_client = MagicMock()
        mock_client.head_object.return_value = {'ContentLength': 1024}
        mock_boto_client.return_value = mock_client

        service = S3StorageService()
        org_id = str(uuid4())
        file_key = "test-key"

        # Act
        result = await service.delete_file(file_key, org_id)

        # Assert
        assert result is True
        mock_client.delete_object.assert_called_once_with(
            Bucket="test-bucket",
            Key=f"{org_id}/{file_key}"
        )

    @pytest.mark.asyncio
    @patch('app.services.s3_storage_service.boto3.client')
    @patch('app.services.s3_storage_service.get_settings')
    async def test_delete_file_returns_false_for_missing_file(self, mock_settings, mock_boto_client):
        """Test delete_file returns False when file doesn't exist."""
        # Arrange
        mock_settings_obj = Mock()
        mock_settings_obj.R2_ENDPOINT_URL = "https://test.r2.cloudflarestorage.com"
        mock_settings_obj.R2_ACCESS_KEY_ID = "test_key"
        mock_settings_obj.R2_SECRET_ACCESS_KEY = "test_secret"
        mock_settings.return_value = mock_settings_obj

        mock_client = MagicMock()
        error_response = {'Error': {'Code': '404', 'Message': 'Not Found'}}
        mock_client.head_object.side_effect = ClientError(error_response, 'head_object')
        mock_boto_client.return_value = mock_client

        service = S3StorageService()
        org_id = str(uuid4())

        # Act
        result = await service.delete_file("missing-key", org_id)

        # Assert
        assert result is False

    @pytest.mark.asyncio
    @patch('app.services.s3_storage_service.boto3.client')
    @patch('app.services.s3_storage_service.get_settings')
    async def test_file_exists_returns_true_for_existing_file(self, mock_settings, mock_boto_client):
        """Test file_exists returns True when file exists."""
        # Arrange
        mock_settings_obj = Mock()
        mock_settings_obj.R2_ENDPOINT_URL = "https://test.r2.cloudflarestorage.com"
        mock_settings_obj.R2_ACCESS_KEY_ID = "test_key"
        mock_settings_obj.R2_SECRET_ACCESS_KEY = "test_secret"
        mock_settings.return_value = mock_settings_obj

        mock_client = MagicMock()
        mock_client.head_object.return_value = {'ContentLength': 1024}
        mock_boto_client.return_value = mock_client

        service = S3StorageService()
        org_id = str(uuid4())

        # Act
        result = await service.file_exists("test-key", org_id)

        # Assert
        assert result is True

    @pytest.mark.asyncio
    @patch('app.services.s3_storage_service.boto3.client')
    @patch('app.services.s3_storage_service.get_settings')
    async def test_file_exists_returns_false_for_missing_file(self, mock_settings, mock_boto_client):
        """Test file_exists returns False when file doesn't exist."""
        # Arrange
        mock_settings_obj = Mock()
        mock_settings_obj.R2_ENDPOINT_URL = "https://test.r2.cloudflarestorage.com"
        mock_settings_obj.R2_ACCESS_KEY_ID = "test_key"
        mock_settings_obj.R2_SECRET_ACCESS_KEY = "test_secret"
        mock_settings.return_value = mock_settings_obj

        mock_client = MagicMock()
        error_response = {'Error': {'Code': '404', 'Message': 'Not Found'}}
        mock_client.head_object.side_effect = ClientError(error_response, 'head_object')
        mock_boto_client.return_value = mock_client

        service = S3StorageService()
        org_id = str(uuid4())

        # Act
        result = await service.file_exists("missing-key", org_id)

        # Assert
        assert result is False

    @patch('app.services.s3_storage_service.boto3.client')
    @patch('app.services.s3_storage_service.get_settings')
    def test_get_file_size_returns_content_length(self, mock_settings, mock_boto_client):
        """Test get_file_size returns correct file size."""
        # Arrange
        mock_settings_obj = Mock()
        mock_settings_obj.R2_ENDPOINT_URL = "https://test.r2.cloudflarestorage.com"
        mock_settings_obj.R2_ACCESS_KEY_ID = "test_key"
        mock_settings_obj.R2_SECRET_ACCESS_KEY = "test_secret"
        mock_settings_obj.R2_BUCKET_NAME = "test-bucket"
        mock_settings.return_value = mock_settings_obj

        mock_client = MagicMock()
        mock_client.head_object.return_value = {'ContentLength': 2048}
        mock_boto_client.return_value = mock_client

        service = S3StorageService()
        org_id = str(uuid4())

        # Act
        size = service.get_file_size("test-key", org_id)

        # Assert
        assert size == 2048

    @patch('app.services.s3_storage_service.boto3.client')
    @patch('app.services.s3_storage_service.get_settings')
    def test_get_file_size_raises_error_for_missing_file(self, mock_settings, mock_boto_client):
        """Test get_file_size raises FileNotFoundError for non-existent file."""
        # Arrange
        mock_settings_obj = Mock()
        mock_settings_obj.R2_ENDPOINT_URL = "https://test.r2.cloudflarestorage.com"
        mock_settings_obj.R2_ACCESS_KEY_ID = "test_key"
        mock_settings_obj.R2_SECRET_ACCESS_KEY = "test_secret"
        mock_settings.return_value = mock_settings_obj

        mock_client = MagicMock()
        error_response = {'Error': {'Code': '404', 'Message': 'Not Found'}}
        mock_client.head_object.side_effect = ClientError(error_response, 'head_object')
        mock_boto_client.return_value = mock_client

        service = S3StorageService()
        org_id = str(uuid4())

        # Act & Assert
        with pytest.raises(FileNotFoundError, match="File not found in S3"):
            service.get_file_size("missing-key", org_id)


class TestS3StorageServicePresignedURLs:
    """Test suite for presigned URL generation."""

    @pytest.mark.asyncio
    @patch('app.services.s3_storage_service.boto3.client')
    @patch('app.services.s3_storage_service.get_settings')
    async def test_get_presigned_url_generates_valid_url(self, mock_settings, mock_boto_client):
        """Test presigned URL generation with custom expiration."""
        # Arrange
        mock_settings_obj = Mock()
        mock_settings_obj.R2_ENDPOINT_URL = "https://test.r2.cloudflarestorage.com"
        mock_settings_obj.R2_ACCESS_KEY_ID = "test_key"
        mock_settings_obj.R2_SECRET_ACCESS_KEY = "test_secret"
        mock_settings_obj.R2_BUCKET_NAME = "test-bucket"
        mock_settings.return_value = mock_settings_obj

        mock_client = MagicMock()
        mock_client.head_object.return_value = {'ContentLength': 1024}
        mock_client.generate_presigned_url.return_value = "https://presigned.url/file?expires=7200"
        mock_boto_client.return_value = mock_client

        service = S3StorageService()
        org_id = str(uuid4())

        # Act
        url = await service.get_presigned_url("test-key", org_id, expiration=7200)

        # Assert
        assert "presigned.url" in url
        mock_client.generate_presigned_url.assert_called_once_with(
            'get_object',
            Params={'Bucket': 'test-bucket', 'Key': f"{org_id}/test-key"},
            ExpiresIn=7200
        )

    @pytest.mark.asyncio
    @patch('app.services.s3_storage_service.boto3.client')
    @patch('app.services.s3_storage_service.get_settings')
    async def test_get_presigned_url_default_expiration(self, mock_settings, mock_boto_client):
        """Test presigned URL uses default 1 hour expiration."""
        # Arrange
        mock_settings_obj = Mock()
        mock_settings_obj.R2_ENDPOINT_URL = "https://test.r2.cloudflarestorage.com"
        mock_settings_obj.R2_ACCESS_KEY_ID = "test_key"
        mock_settings_obj.R2_SECRET_ACCESS_KEY = "test_secret"
        mock_settings_obj.R2_BUCKET_NAME = "test-bucket"
        mock_settings.return_value = mock_settings_obj

        mock_client = MagicMock()
        mock_client.head_object.return_value = {'ContentLength': 1024}
        mock_client.generate_presigned_url.return_value = "https://presigned.url/file"
        mock_boto_client.return_value = mock_client

        service = S3StorageService()
        org_id = str(uuid4())

        # Act
        await service.get_presigned_url("test-key", org_id)

        # Assert
        call_args = mock_client.generate_presigned_url.call_args
        assert call_args[1]['ExpiresIn'] == 3600  # Default 1 hour


class TestS3StorageServiceContentTypes:
    """Test suite for content type detection."""

    @patch('app.services.s3_storage_service.boto3.client')
    @patch('app.services.s3_storage_service.get_settings')
    def test_guess_content_type_pdf(self, mock_settings, mock_boto_client):
        """Test content type detection for PDF files."""
        # Arrange
        mock_settings_obj = Mock()
        mock_settings_obj.R2_ENDPOINT_URL = "https://test.r2.cloudflarestorage.com"
        mock_settings_obj.R2_ACCESS_KEY_ID = "test_key"
        mock_settings_obj.R2_SECRET_ACCESS_KEY = "test_secret"
        mock_settings.return_value = mock_settings_obj

        service = S3StorageService()

        # Act
        content_type = service._guess_content_type("document.pdf")

        # Assert
        assert content_type == "application/pdf"

    @patch('app.services.s3_storage_service.boto3.client')
    @patch('app.services.s3_storage_service.get_settings')
    def test_guess_content_type_mp4(self, mock_settings, mock_boto_client):
        """Test content type detection for video files."""
        # Arrange
        mock_settings_obj = Mock()
        mock_settings_obj.R2_ENDPOINT_URL = "https://test.r2.cloudflarestorage.com"
        mock_settings_obj.R2_ACCESS_KEY_ID = "test_key"
        mock_settings_obj.R2_SECRET_ACCESS_KEY = "test_secret"
        mock_settings.return_value = mock_settings_obj

        service = S3StorageService()

        # Act
        content_type = service._guess_content_type("video.mp4")

        # Assert
        assert content_type == "video/mp4"

    @patch('app.services.s3_storage_service.boto3.client')
    @patch('app.services.s3_storage_service.get_settings')
    def test_guess_content_type_unknown(self, mock_settings, mock_boto_client):
        """Test content type detection falls back to octet-stream."""
        # Arrange
        mock_settings_obj = Mock()
        mock_settings_obj.R2_ENDPOINT_URL = "https://test.r2.cloudflarestorage.com"
        mock_settings_obj.R2_ACCESS_KEY_ID = "test_key"
        mock_settings_obj.R2_SECRET_ACCESS_KEY = "test_secret"
        mock_settings.return_value = mock_settings_obj

        service = S3StorageService()

        # Act - use truly unknown extension that won't be recognized
        content_type = service._guess_content_type("unknown.unknownext123")

        # Assert
        assert content_type == "application/octet-stream"
