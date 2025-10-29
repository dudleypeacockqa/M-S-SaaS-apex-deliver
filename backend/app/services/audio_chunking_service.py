"""
Audio Chunking Service for large file transcription (DEV-016 Phase 1.2).

Handles splitting large audio files (>25MB) into smaller chunks for
OpenAI Whisper API compliance. Uses ffmpeg for audio manipulation.
"""
from __future__ import annotations

import logging
import subprocess
import tempfile
from pathlib import Path
from typing import List

logger = logging.getLogger(__name__)


class AudioChunkingService:
    """
    Service for chunking large audio files into Whisper API-compliant chunks.

    Whisper API has a 25MB file size limit. This service:
    1. Splits large audio files into smaller chunks
    2. Applies overlap between chunks to prevent word splitting
    3. Transcribes chunks individually and combines results
    4. Cleans up temporary chunk files after transcription
    """

    def __init__(
        self,
        max_chunk_size_bytes: int = 25 * 1024 * 1024,  # 25MB
        overlap_ms: int = 1000,  # 1 second overlap
    ):
        """
        Initialize audio chunking service.

        Args:
            max_chunk_size_bytes: Maximum chunk size in bytes (default: 25MB)
            overlap_ms: Overlap between chunks in milliseconds (default: 1000ms)
        """
        self.max_chunk_size_bytes = max_chunk_size_bytes
        self.overlap_ms = overlap_ms

    def needs_chunking(self, file_size_bytes: int) -> bool:
        """
        Check if file needs chunking based on size.

        Args:
            file_size_bytes: File size in bytes

        Returns:
            True if file exceeds max chunk size, False otherwise
        """
        return file_size_bytes > self.max_chunk_size_bytes

    async def chunk_audio_file(
        self,
        audio_path: Path,
        format: str = "mp3"
    ) -> List[Path]:
        """
        Split audio file into multiple chunks.

        Uses ffmpeg to split audio file by duration to keep chunks under size limit.
        Applies overlap between chunks to prevent cutting words mid-speech.

        Args:
            audio_path: Path to the audio file to chunk
            format: Audio format (mp3, wav, m4a, etc.)

        Returns:
            List of paths to chunk files

        Raises:
            FileNotFoundError: If audio file doesn't exist
            RuntimeError: If ffmpeg is not available or chunking fails
        """
        if not audio_path.exists():
            raise FileNotFoundError(f"Audio file not found: {audio_path}")

        logger.info(f"Chunking audio file: {audio_path}")

        try:
            # Get audio duration using ffprobe
            duration = await self._get_audio_duration(audio_path)
            logger.info(f"Audio duration: {duration:.2f} seconds")

            # Calculate chunk duration (conservative estimate: ~200KB/sec for MP3 @ 128kbps)
            # Target chunk size: 20MB to leave headroom
            target_chunk_size = 20 * 1024 * 1024
            estimated_bitrate = 128000  # 128kbps (conservative estimate)
            chunk_duration_seconds = (target_chunk_size * 8) / estimated_bitrate

            # Calculate number of chunks needed
            num_chunks = max(1, int(duration / chunk_duration_seconds) + 1)
            chunk_duration = duration / num_chunks

            logger.info(f"Splitting into {num_chunks} chunks of ~{chunk_duration:.1f}s each")

            # Create temporary directory for chunks
            temp_dir = Path(tempfile.mkdtemp(prefix="audio_chunks_"))
            chunk_paths: List[Path] = []

            # Split audio into chunks using ffmpeg
            overlap_seconds = self.overlap_ms / 1000.0

            for i in range(num_chunks):
                start_time = max(0, i * chunk_duration - overlap_seconds)
                chunk_path = temp_dir / f"chunk_{i}.{format}"

                # Use ffmpeg to extract chunk
                cmd = [
                    "ffmpeg",
                    "-i", str(audio_path),
                    "-ss", str(start_time),
                    "-t", str(chunk_duration + overlap_seconds),
                    "-acodec", "copy" if format == "mp3" else "libmp3lame",
                    "-y",  # Overwrite output file
                    str(chunk_path)
                ]

                result = subprocess.run(
                    cmd,
                    capture_output=True,
                    text=True,
                    timeout=300  # 5 minute timeout
                )

                if result.returncode != 0:
                    logger.error(f"ffmpeg chunk extraction failed: {result.stderr}")
                    # Cleanup on failure
                    await self.cleanup_chunks(chunk_paths)
                    raise RuntimeError(f"Failed to extract chunk {i}: {result.stderr}")

                chunk_paths.append(chunk_path)
                logger.info(f"Created chunk {i + 1}/{num_chunks}: {chunk_path}")

            return chunk_paths

        except subprocess.TimeoutExpired:
            logger.error("ffmpeg chunking timed out")
            raise RuntimeError("Audio chunking timed out after 5 minutes")
        except FileNotFoundError:
            logger.error("ffmpeg not found - please install ffmpeg")
            raise RuntimeError(
                "ffmpeg not found. Please install ffmpeg to enable audio chunking."
            )
        except Exception as e:
            logger.error(f"Audio chunking failed: {e}")
            raise

    async def _get_audio_duration(self, audio_path: Path) -> float:
        """
        Get audio file duration using ffprobe.

        Args:
            audio_path: Path to audio file

        Returns:
            Duration in seconds

        Raises:
            RuntimeError: If ffprobe fails
        """
        try:
            cmd = [
                "ffprobe",
                "-v", "error",
                "-show_entries", "format=duration",
                "-of", "default=noprint_wrappers=1:nokey=1",
                str(audio_path)
            ]

            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=30
            )

            if result.returncode != 0:
                raise RuntimeError(f"ffprobe failed: {result.stderr}")

            return float(result.stdout.strip())

        except (ValueError, subprocess.TimeoutExpired) as e:
            logger.error(f"Failed to get audio duration: {e}")
            raise RuntimeError(f"Failed to determine audio duration: {e}")

    async def transcribe_chunks(
        self,
        chunk_paths: List[Path],
        api_key: str,
        *,
        language: str = "en",
    ) -> str:
        """
        Transcribe audio chunks using OpenAI Whisper API and combine results.

        Args:
            chunk_paths: List of paths to audio chunk files
            api_key: OpenAI API key

        Returns:
            Combined transcript text

        Raises:
            Exception: If Whisper API call fails
        """
        if not chunk_paths:
            return ""

        try:
            from openai import AsyncOpenAI

            client = AsyncOpenAI(api_key=api_key)
            transcripts: List[str] = []

            logger.info(f"Transcribing {len(chunk_paths)} audio chunks")

            for i, chunk_path in enumerate(chunk_paths):
                logger.info(f"Transcribing chunk {i + 1}/{len(chunk_paths)}: {chunk_path}")

                with open(chunk_path, "rb") as audio_file:
                    response = await client.audio.transcriptions.create(
                        model="whisper-1",
                        file=audio_file,
                        response_format="text",
                        language=language,
                    )

                transcript = response if isinstance(response, str) else response.text
                transcripts.append(transcript)

                logger.info(f"Chunk {i + 1} transcribed: {len(transcript)} characters")

            # Combine transcripts with space separator
            combined_transcript = " ".join(transcripts)

            logger.info(f"All chunks transcribed. Total: {len(combined_transcript)} characters")

            return combined_transcript

        except Exception as e:
            logger.error(f"Chunk transcription failed: {e}")
            raise

    async def cleanup_chunks(self, chunk_paths: List[Path]) -> None:
        """
        Clean up temporary chunk files after transcription.

        Args:
            chunk_paths: List of paths to chunk files to delete
        """
        for chunk_path in chunk_paths:
            try:
                if chunk_path.exists():
                    chunk_path.unlink()
                    logger.debug(f"Deleted chunk: {chunk_path}")
            except OSError as e:
                logger.warning(f"Failed to delete chunk {chunk_path}: {e}")

        # Try to remove parent directory if empty
        if chunk_paths:
            try:
                parent_dir = chunk_paths[0].parent
                if parent_dir.exists() and not any(parent_dir.iterdir()):
                    parent_dir.rmdir()
                    logger.debug(f"Removed empty chunk directory: {parent_dir}")
            except (OSError, IndexError) as e:
                logger.warning(f"Failed to remove chunk directory: {e}")


# Singleton instance
_audio_chunking_service: AudioChunkingService | None = None


def get_audio_chunking_service() -> AudioChunkingService:
    """Get singleton audio chunking service instance."""
    global _audio_chunking_service
    if _audio_chunking_service is None:
        _audio_chunking_service = AudioChunkingService()
    return _audio_chunking_service
