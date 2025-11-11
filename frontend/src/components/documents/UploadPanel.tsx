/**
 * UploadPanel Component
 * Drag-and-drop file upload with progress tracking and upload queue management
 * Sprint 1.1 - DEV-008 Secure Document & Data Room
 * Sprint 2 Task 1 - Enhanced upload queue with per-file progress and cancellation
 */

import React, { useRef, useState } from 'react';
import { CheckCircle, XCircle, Loader2, X, UploadCloud } from 'lucide-react';
import { formatFileSize, calculateOverallProgress } from '@/utils/fileHelpers';

export interface UploadQueueItem {
  id: string;
  name: string;
  progress: number;
  status: 'pending' | 'uploading' | 'complete' | 'error';
  error?: string;
  size?: number;
  speed?: string;
  eta?: string;
}

export interface UploadPanelProps {
  onUpload: (files: FileList | File[]) => void;
  isUploading: boolean;
  progress?: number;
  errorMessage?: string;
  onRemove?: () => void;
  accept?: string;
  uploadQueue?: UploadQueueItem[];
  onCancelFile?: (fileId: string) => void;
  onRetryFile?: (fileId: string) => void;
}

const UploadPanel: React.FC<UploadPanelProps> = ({
  onUpload,
  isUploading,
  progress = 0,
  errorMessage,
  onRemove,
  accept = '.pdf,.docx,.xlsx,.pptx,.txt',
  uploadQueue = [],
  onCancelFile,
  onRetryFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const displayError = errorMessage || localError;
  const hasUploadQueue = uploadQueue.length > 0;

  // Calculate overall progress from queue
  const overallProgress = hasUploadQueue
    ? calculateOverallProgress(uploadQueue)
    : progress;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (isUploading) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setLocalError(null);
      onUpload(files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLocalError(null);
      onUpload(e.target.files);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full space-y-4">
      {/* Drop zone */}
      <div
        data-testid="upload-dropzone"
        aria-disabled={isUploading}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-all duration-200 ${
          isUploading
            ? 'cursor-not-allowed border-gray-300 bg-gray-50'
            : isDragging
            ? 'border-blue-500 bg-blue-50 scale-102'
            : 'border-gray-300 hover:border-indigo-400'
        }`}
      >
        {isUploading && !hasUploadQueue ? (
          <div className="space-y-3">
            <div className="text-lg font-medium text-gray-700">Uploading...</div>
            <div className="mx-auto max-w-md">
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 text-sm text-gray-600">{progress}%</div>
            </div>
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                aria-label="Cancel upload"
              >
                Cancel Upload
              </button>
            )}
          </div>
        ) : null}

        {/* Enhanced drag-active icon */}
        {isDragging && (
          <div data-testid="drag-active-icon" className="animate-bounce">
            <UploadCloud className="mx-auto h-16 w-16 text-blue-500" />
          </div>
        )}

        {/* Idle state */}
        {!isUploading && !isDragging && (
          <div className="space-y-3">
            <div className="text-gray-500">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">Drag & drop files here</p>
              <p className="mt-1 text-sm text-gray-500">or</p>
            </div>
            <button
              type="button"
              onClick={handleBrowseClick}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
              aria-label="Browse files"
            >
              Browse Files
            </button>
            <p className="text-xs text-gray-500">
              Supported formats: PDF, DOCX, XLSX, PPTX, TXT
            </p>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          data-testid="upload-input"
          type="file"
          multiple
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Upload Queue */}
      {hasUploadQueue && (
        <div data-testid="upload-queue" className="space-y-3">
          {/* Overall Progress */}
          <div data-testid="overall-progress" className="text-sm font-medium text-gray-700">
            Overall: {overallProgress}%
          </div>

          {/* File List */}
          <div className="space-y-2">
            {uploadQueue.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3"
              >
                {/* Status Icon */}
                {file.status === 'uploading' && (
                  <Loader2
                    data-testid={`upload-status-uploading-${file.id}`}
                    className="h-5 w-5 animate-spin text-blue-500 flex-shrink-0"
                  />
                )}
                {file.status === 'complete' && (
                  <CheckCircle
                    data-testid={`upload-status-complete-${file.id}`}
                    className="h-5 w-5 text-green-500 flex-shrink-0"
                  />
                )}
                {file.status === 'error' && (
                  <XCircle
                    data-testid={`upload-status-error-${file.id}`}
                    className="h-5 w-5 text-red-500 flex-shrink-0"
                  />
                )}
                {file.status === 'pending' && (
                  <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                )}

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    {file.size && (
                      <p className="text-xs text-gray-500 ml-2">{formatFileSize(file.size)}</p>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {(file.status === 'uploading' || file.status === 'pending') && (
                    <div>
                      <div
                        data-testid={`file-progress-${file.id}`}
                        role="progressbar"
                        aria-valuenow={file.progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Upload progress for ${file.name}`}
                        className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200"
                      >
                        <div
                          className="h-full bg-blue-600 transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                      <div className="mt-1 flex items-center justify-between text-xs text-gray-600">
                        <span>{file.progress}%</span>
                        {file.speed && <span>{file.speed}</span>}
                        {file.eta && <span>{file.eta} remaining</span>}
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {file.status === 'error' && file.error && (
                    <p className="text-xs text-red-600 mt-1">{file.error}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Cancel Button */}
                  {file.status === 'uploading' && onCancelFile && (
                    <button
                      type="button"
                      onClick={() => onCancelFile(file.id)}
                      aria-label={`Cancel upload for ${file.name}`}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}

                  {/* Retry Button */}
                  {file.status === 'error' && onRetryFile && (
                    <button
                      type="button"
                      onClick={() => onRetryFile(file.id)}
                      aria-label="Retry upload"
                      className="px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 border border-blue-300 rounded hover:bg-blue-50 transition-colors"
                    >
                      Retry
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error message */}
      {displayError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {displayError}
        </div>
      )}
    </div>
  );
};

export default UploadPanel;
