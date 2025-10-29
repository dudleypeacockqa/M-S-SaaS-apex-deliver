/**
 * AudioUploadModal - Upload audio files for podcast episodes (DEV-016 Phase 2.2)
 * Supports MP3, WAV, M4A formats up to 500MB with real-time upload progress
 */

import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useUploadProgress } from '../../hooks/useUploadProgress';

interface AudioUploadModalProps {
  open: boolean;
  onClose: () => void;
  episodeId: string;
  episodeName: string;
  onSuccess?: (response: UploadResponse) => void;
}

interface UploadResponse {
  episode_id: string;
  audio_url: string;
  file_size?: number;
  filename?: string;
}

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const ALLOWED_FORMATS = ['.mp3', '.wav', '.m4a'];
const ALLOWED_MIME_TYPES = ['audio/mpeg', 'audio/wav', 'audio/x-m4a', 'audio/mp4'];

const AudioUploadModal: React.FC<AudioUploadModalProps> = ({
  open,
  onClose,
  episodeId,
  episodeName,
  onSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  // Use the real-time upload progress hook (Phase 2.2)
  const {
    progress,
    isUploading,
    error: uploadError,
    uploadSpeed,
    estimatedTimeRemaining,
    upload,
    cancel,
    reset,
  } = useUploadProgress();

  const [validationError, setValidationError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  // Combined error state
  const error = validationError || uploadError;

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedFile(null);
      setValidationError(null);
      setUploadSuccess(false);
      reset();
    }
  }, [open, reset]);

  const handleUploadSuccess = (response: UploadResponse) => {
    setUploadSuccess(true);
    queryClient.invalidateQueries({ queryKey: ['podcast-episodes'] });
    queryClient.invalidateQueries({ queryKey: ['podcast-episode', episodeId] });

    if (onSuccess) {
      onSuccess(response);
    }

    // Close modal after short delay to show success
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleUploadError = (err: Error) => {
    setValidationError(err.message);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setValidationError(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Validate file format
    const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!ALLOWED_FORMATS.includes(fileExt)) {
      setValidationError(`Invalid file format. Allowed formats: ${ALLOWED_FORMATS.join(', ')}`);
      setSelectedFile(null);
      return;
    }

    // Validate mime type when provided
    if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
      setValidationError(`Unsupported file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`);
      setSelectedFile(null);
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setValidationError(`File too large (${sizeMB}MB). Maximum size: 500MB`);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    // Get auth token from cookies or headers
    const headers: Record<string, string> = {
      // Note: credentials: 'include' will send cookies automatically
      // Add any additional headers if needed
    };

    // Start real-time upload with progress tracking (Phase 2.2)
    upload(
      selectedFile,
      `/api/podcasts/episodes/${episodeId}/upload-audio`,
      headers,
      handleUploadSuccess,
      handleUploadError
    );
  };

  const handleCancel = () => {
    if (isUploading) {
      cancel();
    }
    onClose();
  };

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatSpeed = (bytesPerSecond: number | null): string => {
    if (!bytesPerSecond) return '---';
    const mbps = bytesPerSecond / (1024 * 1024);
    return `${mbps.toFixed(2)} MB/s`;
  };

  const formatTime = (seconds: number | null): string => {
    if (!seconds || !isFinite(seconds)) return '---';
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${minutes}m ${secs}s`;
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleCancel}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Upload Audio</h2>
          <p className="text-sm text-gray-600 mt-1">
            Episode: <span className="font-medium">{episodeName}</span>
          </p>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-700 mb-2">
            Supported formats: <span className="font-medium">MP3, WAV, M4A</span>
          </p>
          <p className="text-sm text-gray-700 mb-4">
            Maximum file size: <span className="font-medium">500 MB</span>
          </p>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              id="audio-file-input"
              className="hidden"
              accept={ALLOWED_FORMATS.join(',')}
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <label
              htmlFor="audio-file-input"
              className="cursor-pointer inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:bg-gray-400"
            >
              Choose File
            </label>

            {selectedFile && (
              <div className="mt-4 text-left bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Size: {formatFileSize(selectedFile.size)}
                </p>
              </div>
            )}

            {error && (
              <div className="mt-4 text-left bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
          </div>
        </div>

        {isUploading && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Uploading...</span>
              <span className="text-sm text-gray-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* Real-time upload statistics (Phase 2.2) */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Speed:</span>
                <span className="ml-2 font-medium text-gray-900">{formatSpeed(uploadSpeed)}</span>
              </div>
              <div>
                <span className="text-gray-600">Time remaining:</span>
                <span className="ml-2 font-medium text-gray-900">{formatTime(estimatedTimeRemaining)}</span>
              </div>
            </div>
          </div>
        )}

        {uploadSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm font-medium text-green-800">Upload successful!</p>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={isUploading}
          >
            {isUploading ? 'Cancel Upload' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioUploadModal;
