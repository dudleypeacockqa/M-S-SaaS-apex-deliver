"""
Comprehensive tests for Thumbnail Generation Service (DEV-016 Phase 2.1).

Tests FFmpeg-based video thumbnail extraction and image processing.
Following TDD RED → GREEN → REFACTOR methodology.
"""
from __future__ import annotations

import io
from pathlib import Path
from unittest.mock import Mock, patch, MagicMock, mock_open
from uuid import uuid4

import pytest

from app.services.thumbnail_service import ThumbnailService


def create_mock_image():
    """Helper to create properly mocked PIL Image with context manager support."""
    mock_image = MagicMock()
    mock_image.mode = "RGB"
    mock_image.__enter__ = MagicMock(return_value=mock_image)
    mock_image.__exit__ = MagicMock(return_value=False)
    return mock_image


def create_mock_storage(return_value="/storage/test.jpg"):
    """Helper to create properly mocked async storage service."""
    mock_storage = MagicMock()
    mock_storage.generate_file_key.return_value = "unique_key"

    # Make save_file return an awaitable
    async def async_save_file(*args, **kwargs):
        return return_value

    mock_storage.save_file = async_save_file
    return mock_storage


class TestThumbnailServiceInitialization:
    """Test suite for ThumbnailService initialization."""

    def test_service_initializes_with_default_settings(self):
        """Test service initialization with default thumbnail settings."""
        # Act
        service = ThumbnailService()

        # Assert
        assert service.default_timestamp == 1.0  # 1 second default
        assert service.default_size == (1280, 720)  # 720p default
        assert service.jpeg_quality == 85  # High quality default

    def test_service_initializes_with_custom_settings(self):
        """Test service initialization with custom settings."""
        # Act
        service = ThumbnailService(
            default_timestamp=2.0,
            default_size=(1920, 1080),
            jpeg_quality=90
        )

        # Assert
        assert service.default_timestamp == 2.0
        assert service.default_size == (1920, 1080)
        assert service.jpeg_quality == 90


class TestThumbnailServiceFrameExtraction:
    """Test suite for FFmpeg frame extraction."""

    @pytest.mark.asyncio
    @patch('app.services.thumbnail_service.subprocess.run')
    async def test_extract_frame_from_video_success(self, mock_subprocess):
        """Test successful frame extraction from video file."""
        # Arrange
        service = ThumbnailService()
        video_path = Path("/tmp/test_video.mp4")
        timestamp = 1.0

        # Mock file exists
        with patch.object(Path, 'exists', return_value=True):
            # Mock ffmpeg successful extraction
            mock_subprocess.return_value = MagicMock(returncode=0)

            # Act
            frame_path = await service.extract_frame(video_path, timestamp)

            # Assert
            assert isinstance(frame_path, Path)
            assert frame_path.suffix == ".jpg"
            mock_subprocess.assert_called_once()

    @pytest.mark.asyncio
    @patch('app.services.thumbnail_service.subprocess.run')
    async def test_extract_frame_at_custom_timestamp(self, mock_subprocess):
        """Test frame extraction at custom timestamp."""
        # Arrange
        service = ThumbnailService()
        video_path = Path("/tmp/video.mp4")
        timestamp = 5.5  # 5.5 seconds

        with patch.object(Path, 'exists', return_value=True):
            mock_subprocess.return_value = MagicMock(returncode=0)

            # Act
            await service.extract_frame(video_path, timestamp)

            # Assert
            # Verify ffmpeg was called with correct timestamp
            call_args = mock_subprocess.call_args[0][0]
            assert "-ss" in call_args
            timestamp_idx = call_args.index("-ss") + 1
            assert call_args[timestamp_idx] == "5.5"

    @pytest.mark.asyncio
    async def test_extract_frame_raises_error_for_missing_file(self):
        """Test frame extraction raises FileNotFoundError for non-existent video."""
        # Arrange
        service = ThumbnailService()
        video_path = Path("/nonexistent/video.mp4")

        # Act & Assert
        with patch.object(Path, 'exists', return_value=False):
            with pytest.raises(FileNotFoundError, match="Video file not found"):
                await service.extract_frame(video_path, 1.0)

    @pytest.mark.asyncio
    @patch('app.services.thumbnail_service.subprocess.run')
    async def test_extract_frame_handles_ffmpeg_failure(self, mock_subprocess):
        """Test frame extraction handles FFmpeg errors gracefully."""
        # Arrange
        service = ThumbnailService()
        video_path = Path("/tmp/corrupt.mp4")

        with patch.object(Path, 'exists', return_value=True):
            # Mock ffmpeg failure
            mock_subprocess.return_value = MagicMock(
                returncode=1,
                stderr="Invalid data found when processing input"
            )

            # Act & Assert
            with pytest.raises(RuntimeError, match="FFmpeg frame extraction failed"):
                await service.extract_frame(video_path, 1.0)

    @pytest.mark.asyncio
    @patch('app.services.thumbnail_service.subprocess.run')
    async def test_extract_frame_handles_ffmpeg_not_found(self, mock_subprocess):
        """Test frame extraction handles missing FFmpeg binary."""
        # Arrange
        service = ThumbnailService()
        video_path = Path("/tmp/video.mp4")

        with patch.object(Path, 'exists', return_value=True):
            # Mock ffmpeg not found
            mock_subprocess.side_effect = FileNotFoundError("ffmpeg not found")

            # Act & Assert
            with pytest.raises(RuntimeError, match="FFmpeg not found"):
                await service.extract_frame(video_path, 1.0)


class TestThumbnailServiceImageProcessing:
    """Test suite for image resizing and compression."""

    @pytest.mark.asyncio
    @patch('app.services.thumbnail_service.Image')
    async def test_resize_and_compress_thumbnail(self, mock_image_class):
        """Test thumbnail resizing and JPEG compression."""
        # Arrange
        service = ThumbnailService()
        frame_path = Path("/tmp/frame.jpg")
        target_size = (1280, 720)

        # Mock Pillow Image with context manager support
        mock_image = MagicMock()
        mock_image.mode = "RGB"
        mock_image.__enter__ = MagicMock(return_value=mock_image)
        mock_image.__exit__ = MagicMock(return_value=False)
        mock_image_class.open.return_value = mock_image

        with patch.object(Path, 'exists', return_value=True):
            # Act
            await service.resize_and_compress(frame_path, target_size, quality=85)

            # Assert
            mock_image_class.open.assert_called_once_with(frame_path)
            mock_image.thumbnail.assert_called_once()
            mock_image.save.assert_called_once()

    @pytest.mark.asyncio
    @patch('app.services.thumbnail_service.Image')
    async def test_resize_maintains_aspect_ratio(self, mock_image_class):
        """Test resizing maintains aspect ratio."""
        # Arrange
        service = ThumbnailService()
        frame_path = Path("/tmp/frame.jpg")
        target_size = (1920, 1080)

        mock_image = create_mock_image()
        mock_image.size = (1920, 1080)
        mock_image_class.open.return_value = mock_image

        with patch.object(Path, 'exists', return_value=True):
            # Act
            await service.resize_and_compress(frame_path, target_size)

            # Assert - Pillow's thumbnail() maintains aspect ratio
            mock_image.thumbnail.assert_called_once()

    @pytest.mark.asyncio
    @patch('app.services.thumbnail_service.Image')
    async def test_compress_with_custom_quality(self, mock_image_class):
        """Test JPEG compression with custom quality setting."""
        # Arrange
        service = ThumbnailService()
        frame_path = Path("/tmp/frame.jpg")
        quality = 90

        mock_image = create_mock_image()
        mock_image_class.open.return_value = mock_image

        with patch.object(Path, 'exists', return_value=True):
            # Act
            await service.resize_and_compress(frame_path, (1280, 720), quality=quality)

            # Assert - Verify quality parameter passed to save
            save_call_kwargs = mock_image.save.call_args[1]
            assert save_call_kwargs['quality'] == 90


class TestThumbnailServiceStorageIntegration:
    """Test suite for storage service integration."""

    @pytest.mark.asyncio
    @patch('app.services.thumbnail_service.get_storage_service')
    async def test_save_thumbnail_to_storage(self, mock_get_storage):
        """Test saving thumbnail to storage service."""
        # Arrange
        service = ThumbnailService()
        thumbnail_path = Path("/tmp/thumbnail.jpg")
        organization_id = str(uuid4())
        episode_id = str(uuid4())

        # Mock storage service with async save_file
        mock_storage = create_mock_storage(f"/storage/thumbnails/{episode_id}_thumb.jpg")
        mock_get_storage.return_value = mock_storage

        with patch.object(Path, 'exists', return_value=True):
            with patch('builtins.open', mock_open(read_data=b"image data")):
                # Act
                storage_path = await service.save_to_storage(
                    thumbnail_path,
                    organization_id,
                    episode_id
                )

                # Assert
                assert "/storage/" in storage_path

    @pytest.mark.asyncio
    @patch('app.services.thumbnail_service.get_storage_service')
    async def test_save_thumbnail_generates_unique_key(self, mock_get_storage):
        """Test thumbnail storage uses unique file keys."""
        # Arrange
        service = ThumbnailService()
        thumbnail_path = Path("/tmp/thumb.jpg")
        org_id = str(uuid4())
        episode_id = str(uuid4())

        mock_storage = create_mock_storage()
        mock_get_storage.return_value = mock_storage

        with patch.object(Path, 'exists', return_value=True):
            with patch('builtins.open', mock_open(read_data=b"data")):
                # Act
                await service.save_to_storage(thumbnail_path, org_id, episode_id)

                # Assert
                mock_storage.generate_file_key.assert_called_once()

    @pytest.mark.asyncio
    @patch('app.services.thumbnail_service.get_storage_service')
    async def test_save_thumbnail_handles_storage_error(self, mock_get_storage):
        """Test thumbnail save handles storage service errors."""
        # Arrange
        service = ThumbnailService()
        thumbnail_path = Path("/tmp/thumb.jpg")
        org_id = str(uuid4())
        episode_id = str(uuid4())

        # Mock storage service failure
        mock_storage = MagicMock()
        mock_storage.save_file.side_effect = IOError("Storage unavailable")
        mock_get_storage.return_value = mock_storage

        with patch.object(Path, 'exists', return_value=True):
            with patch('builtins.open', mock_open(read_data=b"data")):
                # Act & Assert
                with pytest.raises(IOError, match="Storage unavailable"):
                    await service.save_to_storage(thumbnail_path, org_id, episode_id)


class TestThumbnailServiceEndToEnd:
    """Test suite for end-to-end thumbnail generation."""

    @pytest.mark.asyncio
    @patch('app.services.thumbnail_service.subprocess.run')
    @patch('app.services.thumbnail_service.Image')
    @patch('app.services.thumbnail_service.get_storage_service')
    async def test_generate_thumbnail_complete_workflow(
        self,
        mock_get_storage,
        mock_image_class,
        mock_subprocess
    ):
        """Test complete thumbnail generation workflow."""
        # Arrange
        service = ThumbnailService()
        video_path = Path("/tmp/video.mp4")
        organization_id = str(uuid4())
        episode_id = str(uuid4())

        # Mock all dependencies
        with patch.object(Path, 'exists', return_value=True):
            with patch.object(Path, 'unlink'):  # Mock cleanup
                mock_subprocess.return_value = MagicMock(returncode=0)

                mock_image = create_mock_image()
                mock_image_class.open.return_value = mock_image

                mock_storage = create_mock_storage("/storage/thumbnails/thumb.jpg")
                mock_get_storage.return_value = mock_storage

                with patch('builtins.open', mock_open(read_data=b"image")):
                    # Act
                    result = await service.generate_thumbnail(
                        video_path=video_path,
                        organization_id=organization_id,
                        episode_id=episode_id,
                        timestamp=1.0
                    )

                    # Assert
                    assert result == "/storage/thumbnails/thumb.jpg"
                    mock_subprocess.assert_called_once()  # FFmpeg extraction
                    mock_image_class.open.assert_called_once()  # Image processing

    @pytest.mark.asyncio
    @patch('app.services.thumbnail_service.subprocess.run')
    @patch('app.services.thumbnail_service.Image')
    @patch('app.services.thumbnail_service.get_storage_service')
    async def test_generate_thumbnail_with_custom_size(
        self,
        mock_get_storage,
        mock_image_class,
        mock_subprocess
    ):
        """Test thumbnail generation with custom output size."""
        # Arrange
        service = ThumbnailService()
        video_path = Path("/tmp/video.mp4")
        custom_size = (1920, 1080)

        with patch.object(Path, 'exists', return_value=True):
            with patch.object(Path, 'unlink'):
                mock_subprocess.return_value = MagicMock(returncode=0)

                mock_image = create_mock_image()
                mock_image_class.open.return_value = mock_image

                mock_storage = create_mock_storage("/storage/thumb.jpg")
                mock_get_storage.return_value = mock_storage

                with patch('builtins.open', mock_open(read_data=b"image")):
                    # Act
                    await service.generate_thumbnail(
                        video_path=video_path,
                        organization_id=str(uuid4()),
                        episode_id=str(uuid4()),
                        output_size=custom_size
                    )

                    # Assert
                    mock_image.thumbnail.assert_called_once()

    @pytest.mark.asyncio
    @patch('app.services.thumbnail_service.subprocess.run')
    @patch('app.services.thumbnail_service.Image')
    @patch('app.services.thumbnail_service.get_storage_service')
    async def test_generate_thumbnail_cleans_up_temp_files(
        self,
        mock_get_storage,
        mock_image_class,
        mock_subprocess
    ):
        """Test thumbnail generation cleans up temporary frame files."""
        # Arrange
        service = ThumbnailService()
        video_path = Path("/tmp/video.mp4")

        with patch.object(Path, 'exists', return_value=True):
            with patch.object(Path, 'unlink') as mock_unlink:
                mock_subprocess.return_value = MagicMock(returncode=0)

                mock_image = create_mock_image()
                mock_image_class.open.return_value = mock_image

                mock_storage = create_mock_storage()
                mock_get_storage.return_value = mock_storage

                with patch('builtins.open', mock_open(read_data=b"img")):
                    # Act
                    await service.generate_thumbnail(
                        video_path=video_path,
                        organization_id=str(uuid4()),
                        episode_id=str(uuid4())
                    )

                    # Assert - Temp frame file should be deleted
                    assert mock_unlink.called
