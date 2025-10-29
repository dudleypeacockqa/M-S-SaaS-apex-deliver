/**
 * UploadPanel Component
 * Drag-and-drop file upload with progress tracking
 * Sprint 1.1 - DEV-008 Secure Document & Data Room
 */

import React, { useRef, useState } from 'react';

export interface UploadPanelProps {
  onUpload: (files: FileList | File[]) => void;
  isUploading: boolean;
  progress?: number;
  errorMessage?: string;
  onRemove?: () => void;
  accept?: string;
}

const UploadPanel: React.FC<UploadPanelProps> = ({
  onUpload,
  isUploading,
  progress = 0,
  errorMessage,
  onRemove,
  accept = '.pdf,.docx,.xlsx,.pptx,.txt',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const displayError = errorMessage || localError;

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
    <div className="w-full">
      {/* Drop zone */}
      <div
        data-testid="upload-dropzone"
        aria-disabled={isUploading}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          isUploading
            ? 'cursor-not-allowed border-gray-300 bg-gray-50'
            : isDragging
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-300 hover:border-indigo-400'
        }`}
      >
        {isUploading ? (
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
        ) : (
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

      {/* Error message */}
      {displayError && (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {displayError}
        </div>
      )}
    </div>
  );
};

export default UploadPanel;
