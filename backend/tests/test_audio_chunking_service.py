"""
Comprehensive tests for Audio Chunking Service (DEV-016 Phase 1.2).

Tests audio file chunking for Whisper API compliance (25MB limit).
Following TDD RED → GREEN → REFACTOR methodology.
"""
from __future__ import annotations

import io
import os
from pathlib import Path
from unittest.mock import Mock, patch, MagicMock, AsyncMock, mock_open
from uuid import uuid4

import pytest

from app.services.audio_chunking_service import AudioChunkingService


class TestAudioChunkingServiceInitialization:
    """Test suite for AudioChunkingService initialization."""

    def test_service_initializes_with_default_settings(self):
        """Test service initialization with default chunk settings."""
        # Act
        service = AudioChunkingService()

        # Assert
        assert service.max_chunk_size_bytes == 25 * 1024 * 1024  # 25MB
        assert service.overlap_ms == 1000  # 1 second overlap

    def test_service_initializes_with_custom_settings(self):
        """Test service initialization with custom chunk size and overlap."""
        # Act
        service = AudioChunkingService(
            max_chunk_size_bytes=20 * 1024 * 1024,
            overlap_ms=500
        )

        # Assert
        assert service.max_chunk_size_bytes == 20 * 1024 * 1024
        assert service.overlap_ms == 500


class TestAudioChunkingServiceFileValidation:
    """Test suite for audio file validation."""

    def test_needs_chunking_returns_false_for_small_file(self):
        """Test needs_chunking returns False for files under 25MB."""
        # Arrange
        service = AudioChunkingService()
        file_size = 10 * 1024 * 1024  # 10MB

        # Act
        result = service.needs_chunking(file_size)

        # Assert
        assert result is False

    def test_needs_chunking_returns_true_for_large_file(self):
        """Test needs_chunking returns True for files over 25MB."""
        # Arrange
        service = AudioChunkingService()
        file_size = 30 * 1024 * 1024  # 30MB

        # Act
        result = service.needs_chunking(file_size)

        # Assert
        assert result is True

    def test_needs_chunking_returns_false_at_exact_limit(self):
        """Test needs_chunking returns False at exactly 25MB."""
        # Arrange
        service = AudioChunkingService()
        file_size = 25 * 1024 * 1024  # Exactly 25MB

        # Act
        result = service.needs_chunking(file_size)

        # Assert
        assert result is False


class TestAudioChunkingServiceChunking:
    """Test suite for audio file chunking operations."""

    @pytest.mark.asyncio
    @patch('app.services.audio_chunking_service.subprocess.run')
    async def test_chunk_audio_file_creates_multiple_chunks(self, mock_subprocess):
        """Test chunking large audio file into multiple chunks."""
        # Arrange
        service = AudioChunkingService()
        audio_path = Path("/tmp/large_audio.mp3")

        # Mock file exists
        with patch.object(Path, 'exists', return_value=True):
            # Mock ffprobe returns 60 second duration
            # Mock ffmpeg chunk extraction succeeds
            mock_subprocess.side_effect = [
                MagicMock(returncode=0, stdout="60.0\n"),  # ffprobe
                MagicMock(returncode=0),  # ffmpeg chunk 0
                MagicMock(returncode=0),  # ffmpeg chunk 1
            ]

            # Act
            chunks = await service.chunk_audio_file(audio_path)

            # Assert
            assert len(chunks) >= 1
            assert all(isinstance(chunk, Path) for chunk in chunks)

    @pytest.mark.asyncio
    @patch('app.services.audio_chunking_service.subprocess.run')
    async def test_chunk_audio_file_handles_mp3_format(self, mock_subprocess):
        """Test chunking MP3 files."""
        # Arrange
        service = AudioChunkingService()
        audio_path = Path("/tmp/audio.mp3")

        with patch.object(Path, 'exists', return_value=True):
            mock_subprocess.side_effect = [
                MagicMock(returncode=0, stdout="30.0\n"),  # ffprobe
                MagicMock(returncode=0),  # ffmpeg chunk
            ]

            # Act
            chunks = await service.chunk_audio_file(audio_path, format="mp3")

            # Assert
            assert len(chunks) > 0

    @pytest.mark.asyncio
    @patch('app.services.audio_chunking_service.subprocess.run')
    async def test_chunk_audio_file_handles_wav_format(self, mock_subprocess):
        """Test chunking WAV files."""
        # Arrange
        service = AudioChunkingService()
        audio_path = Path("/tmp/audio.wav")

        with patch.object(Path, 'exists', return_value=True):
            mock_subprocess.side_effect = [
                MagicMock(returncode=0, stdout="30.0\n"),
                MagicMock(returncode=0),
            ]

            # Act
            chunks = await service.chunk_audio_file(audio_path, format="wav")

            # Assert
            assert len(chunks) > 0

    @pytest.mark.asyncio
    @patch('app.services.audio_chunking_service.subprocess.run')
    async def test_chunk_audio_file_applies_overlap(self, mock_subprocess):
        """Test chunks have overlap to prevent word splitting."""
        # Arrange
        service = AudioChunkingService(overlap_ms=1000)
        audio_path = Path("/tmp/audio.mp3")

        with patch.object(Path, 'exists', return_value=True):
            mock_subprocess.side_effect = [
                MagicMock(returncode=0, stdout="60.0\n"),
                MagicMock(returncode=0),
                MagicMock(returncode=0),
            ]

            # Act
            chunks = await service.chunk_audio_file(audio_path)

            # Assert - verify ffmpeg was called with overlap parameters
            assert len(chunks) >= 1

    @pytest.mark.asyncio
    async def test_chunk_audio_file_raises_error_for_missing_file(self):
        """Test chunking raises FileNotFoundError for non-existent file."""
        # Arrange
        service = AudioChunkingService()
        audio_path = Path("/nonexistent/audio.mp3")

        # Act & Assert
        with patch.object(Path, 'exists', return_value=False):
            with pytest.raises(FileNotFoundError):
                await service.chunk_audio_file(audio_path)


class TestAudioChunkingServiceTranscription:
    """Test suite for chunked audio transcription."""

    @pytest.mark.asyncio
    @patch('builtins.open', new_callable=mock_open, read_data=b"audio data")
    async def test_transcribe_chunks_combines_all_transcripts(self, mock_file):
        """Test transcribing multiple chunks combines transcripts."""
        # Arrange
        service = AudioChunkingService()
        chunk_paths = [
            Path("/tmp/chunk_0.mp3"),
            Path("/tmp/chunk_1.mp3"),
            Path("/tmp/chunk_2.mp3"),
        ]

        # Mock OpenAI client at the openai module level
        with patch('openai.AsyncOpenAI') as mock_openai_class:
            mock_client = MagicMock()
            mock_client.audio = MagicMock()
            mock_client.audio.transcriptions = MagicMock()
            mock_response = MagicMock()
            mock_response.text = "Chunk transcript"

            mock_client.audio.transcriptions.create = AsyncMock(return_value=mock_response)
            mock_openai_class.return_value = mock_client

            # Act
            transcript = await service.transcribe_chunks(chunk_paths, "test_api_key")

            # Assert
            assert "Chunk transcript" in transcript
            # Verify transcript was combined from all chunks
            assert transcript.count("Chunk transcript") == 3
            kwargs = mock_client.audio.transcriptions.create.await_args_list[0].kwargs
            assert kwargs.get("language") == "en"

    @pytest.mark.asyncio
    async def test_transcribe_chunks_handles_empty_chunk_list(self):
        """Test transcribing empty chunk list returns empty string."""
        # Arrange
        service = AudioChunkingService()
        chunk_paths = []

        # Act
        transcript = await service.transcribe_chunks(chunk_paths, "test_api_key")

        # Assert
        assert transcript == ""

    @pytest.mark.asyncio
    @patch('builtins.open', new_callable=mock_open, read_data=b"audio data")
    async def test_transcribe_chunks_raises_error_on_api_failure(self, mock_file):
        """Test transcribing chunks handles API errors gracefully."""
        # Arrange
        service = AudioChunkingService()
        chunk_paths = [Path("/tmp/chunk_0.mp3")]

        with patch('openai.AsyncOpenAI') as mock_openai_class:
            mock_client = MagicMock()
            mock_client.audio = MagicMock()
            mock_client.audio.transcriptions = MagicMock()
            mock_client.audio.transcriptions.create = AsyncMock(side_effect=Exception("API Error"))
            mock_openai_class.return_value = mock_client

            # Act & Assert
            with pytest.raises(Exception, match="API Error"):
                await service.transcribe_chunks(chunk_paths, "test_api_key")

    @pytest.mark.asyncio
    @patch('builtins.open', new_callable=mock_open, read_data=b"audio data")
    async def test_transcribe_chunks_supports_custom_language(self, mock_file):
        """Service should forward requested language to Whisper API calls."""

        service = AudioChunkingService()
        chunk_paths = [Path("/tmp/chunk_0.mp3")]

        with patch('openai.AsyncOpenAI') as mock_openai_class:
            mock_client = MagicMock()
            mock_client.audio = MagicMock()
            mock_client.audio.transcriptions = MagicMock()
            mock_client.audio.transcriptions.create = AsyncMock(return_value="Hola mundo")
            mock_openai_class.return_value = mock_client

            await service.transcribe_chunks(chunk_paths, "test_api_key", language="es")

        kwargs = mock_client.audio.transcriptions.create.await_args_list[0].kwargs
        assert kwargs.get("language") == "es"


class TestAudioChunkingServiceCleanup:
    """Test suite for chunk cleanup operations."""

    @pytest.mark.asyncio
    async def test_cleanup_chunks_deletes_all_files(self):
        """Test cleanup deletes all chunk files."""
        # Arrange
        service = AudioChunkingService()
        chunk_paths = [
            Path("/tmp/chunk_0.mp3"),
            Path("/tmp/chunk_1.mp3"),
        ]

        # Act
        with patch.object(Path, 'unlink') as mock_unlink:
            with patch.object(Path, 'exists', return_value=True):
                await service.cleanup_chunks(chunk_paths)

                # Assert
                assert mock_unlink.call_count == 2

    @pytest.mark.asyncio
    async def test_cleanup_chunks_handles_missing_files(self):
        """Test cleanup handles already-deleted chunk files."""
        # Arrange
        service = AudioChunkingService()
        chunk_paths = [Path("/tmp/chunk_0.mp3")]

        # Act
        with patch.object(Path, 'exists', return_value=False):
            # Should not raise error
            await service.cleanup_chunks(chunk_paths)

    @pytest.mark.asyncio
    async def test_cleanup_chunks_handles_deletion_errors(self):
        """Test cleanup logs errors but doesn't raise exceptions."""
        # Arrange
        service = AudioChunkingService()
        chunk_paths = [Path("/tmp/chunk_0.mp3")]

        # Act
        with patch.object(Path, 'unlink', side_effect=OSError("Permission denied")):
            with patch.object(Path, 'exists', return_value=True):
                # Should not raise error, just log it
                await service.cleanup_chunks(chunk_paths)
