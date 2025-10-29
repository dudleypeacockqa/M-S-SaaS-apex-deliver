"""
Thumbnail Generation Service for video processing (DEV-016 Phase 2.1).

Uses FFmpeg to extract video frames and Pillow for image processing.
Generates thumbnails for podcast video episodes.
"""
from __future__ import annotations

import logging
import subprocess
import tempfile
from pathlib import Path
from typing import Tuple

from PIL import Image

from app.services.storage_service import get_storage_service

logger = logging.getLogger(__name__)


class ThumbnailService:
    """
    Service for generating video thumbnails using FFmpeg and Pillow.

    Features:
    - Extract frames from video at specified timestamp
    - Resize and compress images to target dimensions
    - Save thumbnails to storage service (local or S3)
    - Clean up temporary files after processing
    """

    def __init__(
        self,
        default_timestamp: float = 1.0,
        default_size: Tuple[int, int] = (1280, 720),
        jpeg_quality: int = 85
    ):
        """
        Initialize thumbnail service.

        Args:
            default_timestamp: Default timestamp for frame extraction (seconds)
            default_size: Default thumbnail dimensions (width, height)
            jpeg_quality: JPEG compression quality (1-100, default: 85)
        """
        self.default_timestamp = default_timestamp
        self.default_size = default_size
        self.jpeg_quality = jpeg_quality

    async def extract_frame(
        self,
        video_path: Path,
        timestamp: float
    ) -> Path:
        """
        Extract single frame from video at specified timestamp using FFmpeg.

        Args:
            video_path: Path to video file
            timestamp: Time in seconds to extract frame

        Returns:
            Path to extracted frame (temporary file)

        Raises:
            FileNotFoundError: If video file doesn't exist
            RuntimeError: If FFmpeg fails or is not found
        """
        if not video_path.exists():
            raise FileNotFoundError(f"Video file not found: {video_path}")

        logger.info(f"Extracting frame from {video_path} at {timestamp}s")

        try:
            # Create temporary file for extracted frame
            temp_frame = Path(tempfile.mktemp(suffix=".jpg"))

            # Use FFmpeg to extract frame
            # -ss: seek to timestamp
            # -i: input video
            # -vframes 1: extract single frame
            # -q:v 2: high quality output
            cmd = [
                "ffmpeg",
                "-ss", str(timestamp),
                "-i", str(video_path),
                "-vframes", "1",
                "-q:v", "2",
                "-y",  # Overwrite output
                str(temp_frame)
            ]

            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=30  # 30 second timeout
            )

            if result.returncode != 0:
                logger.error(f"FFmpeg frame extraction failed: {result.stderr}")
                raise RuntimeError(
                    f"FFmpeg frame extraction failed: {result.stderr[:200]}"
                )

            if not temp_frame.exists():
                raise RuntimeError("FFmpeg did not create output frame")

            logger.info(f"Frame extracted to {temp_frame}")
            return temp_frame

        except FileNotFoundError as e:
            logger.error(f"FFmpeg not found: {e}")
            raise RuntimeError(
                "FFmpeg not found. Please install FFmpeg to generate thumbnails."
            )
        except subprocess.TimeoutExpired:
            logger.error("FFmpeg frame extraction timed out")
            raise RuntimeError("Frame extraction timed out after 30 seconds")
        except Exception as e:
            logger.error(f"Frame extraction failed: {e}")
            raise

    async def resize_and_compress(
        self,
        frame_path: Path,
        target_size: Tuple[int, int],
        quality: int | None = None
    ) -> Path:
        """
        Resize and compress extracted frame using Pillow.

        Args:
            frame_path: Path to extracted frame
            target_size: Target dimensions (width, height)
            quality: JPEG quality (uses default if None)

        Returns:
            Path to processed thumbnail (same as input, modified in place)

        Raises:
            FileNotFoundError: If frame doesn't exist
            RuntimeError: If image processing fails
        """
        if not frame_path.exists():
            raise FileNotFoundError(f"Frame file not found: {frame_path}")

        quality = quality if quality is not None else self.jpeg_quality

        logger.info(f"Resizing frame to {target_size} with quality {quality}")

        try:
            # Open image with Pillow
            with Image.open(frame_path) as img:
                # Convert to RGB if needed (handles PNG, etc.)
                if img.mode != "RGB":
                    img = img.convert("RGB")

                # Resize maintaining aspect ratio
                img.thumbnail(target_size, Image.Resampling.LANCZOS)

                # Save as JPEG with compression
                img.save(
                    frame_path,
                    "JPEG",
                    quality=quality,
                    optimize=True
                )

            logger.info(f"Thumbnail processed: {frame_path}")
            return frame_path

        except Exception as e:
            logger.error(f"Image processing failed: {e}")
            raise RuntimeError(f"Failed to resize and compress thumbnail: {e}")

    async def save_to_storage(
        self,
        thumbnail_path: Path,
        organization_id: str,
        episode_id: str
    ) -> str:
        """
        Save thumbnail to storage service.

        Args:
            thumbnail_path: Path to thumbnail file
            organization_id: Organization UUID
            episode_id: Episode UUID

        Returns:
            Storage path/URL for saved thumbnail

        Raises:
            FileNotFoundError: If thumbnail doesn't exist
            IOError: If storage save fails
        """
        if not thumbnail_path.exists():
            raise FileNotFoundError(f"Thumbnail file not found: {thumbnail_path}")

        logger.info(f"Saving thumbnail to storage for episode {episode_id}")

        try:
            storage = get_storage_service()

            # Generate unique file key for thumbnail
            file_key = storage.generate_file_key(
                organization_id=organization_id,
                deal_id=episode_id,  # Using episode_id as deal_id
                filename=f"{episode_id}_thumbnail.jpg",
                user_id=organization_id  # Use org_id as user_id for system uploads
            )

            # Save to storage
            with open(thumbnail_path, "rb") as thumb_file:
                storage_path = await storage.save_file(
                    file_key=file_key,
                    file_stream=thumb_file,
                    organization_id=organization_id
                )

            logger.info(f"Thumbnail saved to storage: {storage_path}")
            return storage_path

        except IOError as e:
            logger.error(f"Failed to save thumbnail to storage: {e}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error saving thumbnail: {e}")
            raise IOError(f"Failed to save thumbnail: {e}")

    async def generate_thumbnail(
        self,
        video_path: Path,
        organization_id: str,
        episode_id: str,
        timestamp: float | None = None,
        output_size: Tuple[int, int] | None = None
    ) -> str:
        """
        Generate thumbnail from video file (end-to-end workflow).

        This is the main entry point for thumbnail generation. It:
        1. Extracts frame from video at timestamp
        2. Resizes and compresses image
        3. Saves to storage service
        4. Cleans up temporary files

        Args:
            video_path: Path to video file
            organization_id: Organization UUID
            episode_id: Episode UUID
            timestamp: Time in seconds to extract frame (uses default if None)
            output_size: Target dimensions (uses default if None)

        Returns:
            Storage path/URL for saved thumbnail

        Raises:
            FileNotFoundError: If video doesn't exist
            RuntimeError: If FFmpeg or image processing fails
            IOError: If storage save fails
        """
        timestamp = timestamp if timestamp is not None else self.default_timestamp
        output_size = output_size if output_size is not None else self.default_size

        logger.info(
            f"Generating thumbnail for episode {episode_id} "
            f"at {timestamp}s with size {output_size}"
        )

        temp_frame: Path | None = None

        try:
            # Step 1: Extract frame from video
            temp_frame = await self.extract_frame(video_path, timestamp)

            # Step 2: Resize and compress
            await self.resize_and_compress(temp_frame, output_size)

            # Step 3: Save to storage
            storage_path = await self.save_to_storage(
                temp_frame,
                organization_id,
                episode_id
            )

            logger.info(f"Thumbnail generation complete: {storage_path}")
            return storage_path

        finally:
            # Step 4: Cleanup temporary frame
            if temp_frame and temp_frame.exists():
                try:
                    temp_frame.unlink()
                    logger.debug(f"Cleaned up temporary frame: {temp_frame}")
                except OSError as e:
                    logger.warning(f"Failed to delete temporary frame {temp_frame}: {e}")


# Singleton instance
_thumbnail_service: ThumbnailService | None = None


def get_thumbnail_service() -> ThumbnailService:
    """Get singleton thumbnail service instance."""
    global _thumbnail_service
    if _thumbnail_service is None:
        _thumbnail_service = ThumbnailService()
    return _thumbnail_service
