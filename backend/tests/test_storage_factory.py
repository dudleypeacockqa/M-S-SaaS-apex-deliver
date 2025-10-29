"""
Tests for storage service factory pattern (DEV-016 Phase 1.1).

Tests the get_storage_service() factory function that switches between
LocalStorageService and S3StorageService based on USE_S3_STORAGE flag.
"""
from __future__ import annotations

from unittest.mock import Mock, patch

import pytest

from app.services.storage_service import (
    LocalStorageService,
    get_storage_service,
)

# Check if boto3 is available for S3 tests
try:
    import boto3
    HAS_BOTO3 = True
except ImportError:
    HAS_BOTO3 = False


class TestStorageServiceFactory:
    """Test suite for storage service factory pattern."""

    def test_factory_returns_local_storage_by_default(self):
        """Test factory returns LocalStorageService when USE_S3_STORAGE=False."""
        # Arrange
        with patch('app.services.storage_service.get_settings') as mock_settings:
            mock_settings_obj = Mock()
            mock_settings_obj.use_s3_storage = False
            mock_settings_obj.STORAGE_PATH = './test_storage'
            mock_settings.return_value = mock_settings_obj

            # Force re-initialization by clearing singleton
            import app.services.storage_service as storage_module
            storage_module._storage_service = None

            # Act
            service = get_storage_service()

            # Assert
            assert isinstance(service, LocalStorageService)

    @pytest.mark.skipif(not HAS_BOTO3, reason="boto3 not installed - S3 storage optional")
    def test_factory_returns_s3_storage_when_enabled(self):
        """Test factory returns S3StorageService when USE_S3_STORAGE=True."""
        # Arrange
        with patch('app.services.storage_service.get_settings') as mock_settings:
            mock_settings_obj = Mock()
            mock_settings_obj.use_s3_storage = True
            mock_settings_obj.R2_ENDPOINT_URL = "https://test.r2.cloudflarestorage.com"
            mock_settings_obj.R2_ACCESS_KEY_ID = "test_key"
            mock_settings_obj.R2_SECRET_ACCESS_KEY = "test_secret"
            mock_settings_obj.R2_BUCKET_NAME = "test-bucket"
            mock_settings_obj.R2_REGION = "auto"
            mock_settings.return_value = mock_settings_obj

            # Force re-initialization
            import app.services.storage_service as storage_module
            storage_module._storage_service = None

            # Mock S3StorageService import (it's imported inside get_storage_service)
            with patch('app.services.s3_storage_service.S3StorageService') as mock_s3:
                mock_s3_instance = Mock()
                mock_s3.return_value = mock_s3_instance

                # Act
                service = get_storage_service()

                # Assert
                mock_s3.assert_called_once()
                assert service == mock_s3_instance

    def test_factory_returns_singleton(self):
        """Test factory returns same instance on repeated calls."""
        # Arrange
        with patch('app.services.storage_service.get_settings') as mock_settings:
            mock_settings_obj = Mock()
            mock_settings_obj.use_s3_storage = False
            mock_settings_obj.STORAGE_PATH = './test_storage'
            mock_settings.return_value = mock_settings_obj

            # Force re-initialization
            import app.services.storage_service as storage_module
            storage_module._storage_service = None

            # Act
            service1 = get_storage_service()
            service2 = get_storage_service()

            # Assert
            assert service1 is service2

    def test_local_storage_implements_protocol(self):
        """Test LocalStorageService implements all required methods."""
        # Arrange
        with patch('app.services.storage_service.get_settings') as mock_settings:
            mock_settings_obj = Mock()
            mock_settings_obj.STORAGE_PATH = './test_storage'
            mock_settings.return_value = mock_settings_obj

            service = LocalStorageService()

            # Assert
            assert hasattr(service, 'generate_file_key')
            assert hasattr(service, 'save_file')
            assert hasattr(service, 'get_file_path')
            assert hasattr(service, 'delete_file')
            assert hasattr(service, 'file_exists')
            assert hasattr(service, 'get_file_size')

    @pytest.mark.skipif(not HAS_BOTO3, reason="boto3 not installed - S3 storage optional")
    def test_s3_storage_implements_protocol(self):
        """Test S3StorageService implements all required methods."""
        # Arrange
        with patch('app.services.s3_storage_service.boto3.client'):
            with patch('app.services.s3_storage_service.get_settings') as mock_settings:
                mock_settings_obj = Mock()
                mock_settings_obj.R2_ENDPOINT_URL = "https://test.r2.cloudflarestorage.com"
                mock_settings_obj.R2_ACCESS_KEY_ID = "test_key"
                mock_settings_obj.R2_SECRET_ACCESS_KEY = "test_secret"
                mock_settings_obj.R2_BUCKET_NAME = "test-bucket"
                mock_settings_obj.R2_REGION = "auto"
                mock_settings.return_value = mock_settings_obj

                from app.services.s3_storage_service import S3StorageService
                service = S3StorageService()

                # Assert
                assert hasattr(service, 'generate_file_key')
                assert hasattr(service, 'save_file')
                assert hasattr(service, 'get_file_path')
                assert hasattr(service, 'delete_file')
                assert hasattr(service, 'file_exists')
                assert hasattr(service, 'get_file_size')
