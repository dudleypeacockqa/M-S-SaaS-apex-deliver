/**
 * VideoUploadModal - Upload video files for podcast episodes (DEV-016)
 * Supports MP4, MOV formats up to 2GB
 */

import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface VideoUploadModalProps {
  open: boolean;
  onClose: () => void;
  episodeId: string;
  episodeName: string;
  onUpload?: (file: File) => Promise<UploadResponse>;
  onSuccess?: (response: UploadResponse) => void;
}

interface UploadResponse {
  episode_id: string;
  video_url: string;
  file_size?: number;
  filename?: string;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB
const ALLOWED_FORMATS = ['.mp4', '.mov'];
const ALLOWED_MIME_TYPES = ['video/mp4', 'video/quicktime'];

const VideoUploadModal: React.FC<VideoUploadModalProps> = ({
  open,
  onClose,
  episodeId,
  episodeName,
  onUpload,
  onSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const queryClient = useQueryClient();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedFile(null);
      setError(null);
      setUploadProgress(0);
    }
  }, [open]);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      if (onUpload) {
        return onUpload(file);
      }

      // Default upload implementation
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/podcasts/episodes/${episodeId}/upload-video`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Upload failed');
      }

      return response.json();
    },
    onSuccess: (data: UploadResponse) => {
      setUploadProgress(100);
      queryClient.invalidateQueries({ queryKey: ['podcast-episodes'] });
      queryClient.invalidateQueries({ queryKey: ['podcast-episode', episodeId] });

      if (onSuccess) {
        onSuccess(data);
      }

      // Close modal after short delay to show success
      setTimeout(() => {
        onClose();
      }, 1500);
    },
    onError: (err: Error) => {
      setError(err.message);
      setUploadProgress(0);
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Validate file format
    const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!ALLOWED_FORMATS.includes(fileExt)) {
      setError(`Invalid file format. Allowed formats: ${ALLOWED_FORMATS.join(', ')}`);
      setSelectedFile(null);
      return;
    }

    // Validate mime type when provided
    if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
      setError(`Unsupported file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`);
      setSelectedFile(null);
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setError(`File too large (${sizeMB}MB). Maximum size: 2GB`);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    setUploadProgress(10);
    uploadMutation.mutate(selectedFile);
  };

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Upload Video</h2>
          <p className="text-sm text-gray-600 mt-1">
            Episode: <span className="font-medium">{episodeName}</span>
          </p>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-700 mb-2">
            Supported formats: <span className="font-medium">MP4, MOV</span>
          </p>
          <p className="text-sm text-gray-700 mb-4">
            Maximum file size: <span className="font-medium">2 GB</span>
          </p>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              id="video-file-input"
              className="hidden"
              accept={ALLOWED_FORMATS.join(',')}
              onChange={handleFileChange}
              disabled={uploadMutation.isPending}
            />
            <label
              htmlFor="video-file-input"
              className="cursor-pointer inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
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

        {uploadMutation.isPending && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Uploading...</span>
              <span className="text-sm text-gray-600">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                role="progressbar"
                aria-valuenow={uploadProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {uploadMutation.isSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm font-medium text-green-800">Upload successful!</p>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={uploadMutation.isPending}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || uploadMutation.isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoUploadModal;
