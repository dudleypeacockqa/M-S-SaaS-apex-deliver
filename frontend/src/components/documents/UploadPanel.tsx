/**
 * UploadPanel Component
 * Drag-and-drop file upload with progress tracking and entitlement awareness.
 * Sprint 1.1 - DEV-008 Secure Document & Data Room
 */

import React, { useRef, useState } from 'react'
import { CheckCircle, XCircle, Loader2, X, UploadCloud } from '@/lib/icons'
import { formatFileSize, calculateOverallProgress } from '@/utils/fileHelpers'

export interface UploadQueueItem {
  id: string
  name: string
  progress: number
  status: 'pending' | 'uploading' | 'complete' | 'error'
  error?: string
  size?: number
  speed?: string
  eta?: string
}

export interface StorageQuota {
  used: number
  limit: number
}

export interface UploadPanelProps {
  onUpload: (files: FileList | File[]) => void
  isUploading: boolean
  progress?: number
  errorMessage?: string
  onRemove?: () => void
  accept?: string
  uploadQueue?: UploadQueueItem[]
  onCancelFile?: (fileId: string) => void
  onRetryFile?: (fileId: string) => void
  storageQuota?: StorageQuota
  maxFileSize?: number
  userTier?: 'starter' | 'professional' | 'enterprise' | 'community'
  allowedFileTypes?: string[]
  maxFilesPerUpload?: number
  onManageStorage?: () => void
  quotaLockMessage?: string
  analyticsContext?: {
    dealId: string
    folderId: string | null
  }
  onUploadTelemetry?: (payload: Record<string, any>) => void
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
  storageQuota,
  maxFileSize,
  userTier,
  allowedFileTypes,
  maxFilesPerUpload,
  onManageStorage,
  quotaLockMessage,
  analyticsContext,
  onUploadTelemetry,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const displayError = errorMessage || localError
  const hasUploadQueue = uploadQueue.length > 0
  const overallProgress = hasUploadQueue ? calculateOverallProgress(uploadQueue) : progress

  const quotaPercentage = storageQuota
    ? Math.round((storageQuota.used / storageQuota.limit) * 100)
    : 0
  const quotaWarningLevel =
    quotaPercentage >= 95 ? 'critical' : quotaPercentage >= 80 ? 'warning' : 'normal'
  const quotaLocked = storageQuota ? storageQuota.used >= storageQuota.limit : false
  const quotaLockNotice = quotaLockMessage ?? 'Storage quota reached. Delete files or upgrade your plan.'

  const formatGB = (bytes: number): string => (bytes / (1024 * 1024 * 1024)).toFixed(1)
  const formatMB = (bytes: number): string => Math.round(bytes / 1_000_000).toString()

  const typeToLabel = (value: string): string => {
    const normalized = value.trim().toLowerCase()
    if (normalized.startsWith('.')) {
      return normalized.slice(1)
    }
    if (normalized === 'application/pdf') return 'pdf'
    if (normalized === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'docx'
    if (normalized === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') return 'xlsx'
    if (!normalized.includes('/')) {
      return normalized
    }
    return normalized
  }

  const isFileTypeAllowed = (file: File): boolean => {
    if (!allowedFileTypes || allowedFileTypes.length === 0) {
      return true
    }
    const mime = file.type?.toLowerCase() ?? ''
    const extension = file.name.includes('.')
      ? file.name.split('.').pop()?.toLowerCase() ?? ''
      : ''

    return allowedFileTypes.some((type) => {
      const normalized = type.trim().toLowerCase()
      if (!normalized) return false
      if (normalized.startsWith('.')) {
        return extension === normalized.slice(1)
      }
      if (!normalized.includes('/')) {
        return extension === normalized
      }
      return mime === normalized
    })
  }

  const validateFiles = (files: FileList | File[]): { valid: boolean; error?: string } => {
    const fileArray = Array.isArray(files) ? files : Array.from(files)

    if (maxFilesPerUpload && maxFilesPerUpload > 0 && fileArray.length > maxFilesPerUpload) {
      return {
        valid: false,
        error: `Max ${maxFilesPerUpload} files per upload. Upgrade to upload more files at once.`,
      }
    }

    if (allowedFileTypes && allowedFileTypes.length > 0) {
      const invalidFiles = fileArray.filter((file) => !isFileTypeAllowed(file))
      if (invalidFiles.length > 0) {
        const allowedNames = allowedFileTypes.map(typeToLabel).join(', ')
        return {
          valid: false,
          error: `File type not allowed. Allowed types: ${allowedNames}`,
        }
      }
    }

    if (maxFileSize) {
      const oversizedFiles = fileArray.filter((file) => file.size > maxFileSize)
      if (oversizedFiles.length > 0) {
        return {
          valid: false,
          error: `File size exceeds ${formatMB(maxFileSize)} MB limit`,
        }
      }
    }

    if (storageQuota) {
      const totalSize = fileArray.reduce((sum, file) => sum + file.size, 0)
      if (storageQuota.used + totalSize > storageQuota.limit) {
        return {
          valid: false,
          error: 'Storage quota exceeded. Please delete some files or upgrade your plan.',
        }
      }
    }

    return { valid: true }
  }

  const emitTelemetry = (eventType: string, files: FileList | File[]) => {
    if (!onUploadTelemetry) return
    const array = Array.isArray(files) ? files : Array.from(files)
    const totalBytes = array.reduce((sum, file) => sum + (file.size ?? 0), 0)
    onUploadTelemetry({
      event: eventType,
      fileCount: array.length,
      totalBytes,
      context: analyticsContext ?? null,
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!isUploading && !quotaLocked) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (isUploading || quotaLocked) {
      if (quotaLocked) {
        setLocalError(quotaLockNotice)
      }
      return
    }

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const validation = validateFiles(files)
      if (!validation.valid) {
        setLocalError(validation.error || 'Upload validation failed')
        return
      }
      setLocalError(null)
      emitTelemetry('drop', files)
      onUpload(Array.from(files))
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (quotaLocked) {
        setLocalError(quotaLockNotice)
        return
      }
      const validation = validateFiles(e.target.files)
      if (!validation.valid) {
        setLocalError(validation.error || 'Upload validation failed')
        return
      }
      setLocalError(null)
      emitTelemetry('browse', e.target.files)
      onUpload(Array.from(e.target.files))
    }
  }

  const handleBrowseClick = () => {
    if (quotaLocked) {
      setLocalError(quotaLockNotice)
      return
    }
    fileInputRef.current?.click()
  }

  const renderErrorAction = () => {
    if (!displayError) return null
    const lower = displayError.toLowerCase()

    if (lower.includes('network')) {
      return (
        <button
          type="button"
          onClick={() => window.location.reload()}
          aria-label="Retry"
          className="mt-2 px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-300 rounded hover:bg-blue-50 transition-colors"
        >
          Retry
        </button>
      )
    }

    if (lower.includes('server error')) {
      return (
        <a
          href="/contact"
          role="link"
          aria-label="Contact support"
          className="mt-2 inline-block px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-300 rounded hover:bg-blue-50 transition-colors"
        >
          Contact Support
        </a>
      )
    }

    if (lower.includes('session expired')) {
      return (
        <button
          type="button"
          onClick={() => (window.location.href = '/login')}
          aria-label="Log in"
          className="mt-2 px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-300 rounded hover:bg-blue-50 transition-colors"
        >
          Log In
        </button>
      )
    }

    if (lower.includes('storage quota') && onManageStorage) {
      return (
        <button
          type="button"
          onClick={onManageStorage}
          aria-label="Manage storage"
          className="mt-2 px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-300 rounded hover:bg-blue-50 transition-colors"
        >
          Manage Storage
        </button>
      )
    }

    return null
  }

  return (
    <div className="w-full space-y-4">
      {storageQuota && (
        <div
          data-testid="storage-quota-display"
          className={`rounded-lg border p-3 ${
            quotaWarningLevel === 'critical'
              ? 'border-red-200 bg-red-50'
              : quotaWarningLevel === 'warning'
              ? 'border-orange-200 bg-orange-50'
              : 'border-gray-200 bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Storage Usage</span>
            <span
              className={`text-sm font-semibold ${
                quotaWarningLevel === 'critical'
                  ? 'text-red-600'
                  : quotaWarningLevel === 'warning'
                  ? 'text-orange-600'
                  : 'text-gray-600'
              }`}
            >
              {quotaPercentage}% used
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>{formatGB(storageQuota.used)} GB</span>
            <span>{formatGB(storageQuota.limit)} GB</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full transition-all duration-300 ${
                quotaWarningLevel === 'critical'
                  ? 'bg-red-600'
                  : quotaWarningLevel === 'warning'
                  ? 'bg-orange-600'
                  : 'bg-blue-600'
              }`}
              style={{ width: `${quotaPercentage}%` }}
            />
          </div>
          {quotaWarningLevel === 'warning' && (
            <p className="mt-2 text-xs text-orange-700">Approaching storage limit</p>
          )}
          {quotaWarningLevel === 'critical' && (
            <p role="alert" className="mt-2 text-xs text-red-700 font-medium">
              Storage almost full! Delete files or upgrade your plan.
            </p>
          )}
          {quotaPercentage >= 100 && userTier && userTier !== 'enterprise' && (
            <div className="mt-2">
              <a
                href="/pricing"
                role="link"
                aria-label="Upgrade storage"
                className="text-xs font-medium text-blue-600 hover:text-blue-700 underline"
              >
                Upgrade to Enterprise
              </a>
            </div>
          )}
        </div>
      )}

      {maxFileSize && (
        <div className="text-xs text-gray-600">
          <span>Max file size: {formatMB(maxFileSize)} MB</span>
          {userTier === 'starter' && (
            <span className="ml-2 text-blue-600">(Upgrade for larger files)</span>
          )}
        </div>
      )}

      <div
        data-testid="upload-dropzone"
        aria-disabled={isUploading || quotaLocked}
        aria-label="Upload files"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-all duration-200 ${
          isUploading || quotaLocked
            ? 'cursor-not-allowed border-gray-300 bg-gray-50'
            : isDragging
            ? 'border-blue-500 bg-blue-50 scale-102'
            : 'border-gray-300 hover:border-indigo-400'
        }`}
      >
        {quotaLocked && (
          <div
            data-testid="quota-lock-overlay"
            role="alert"
            className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-lg bg-white/85 px-6 py-4 text-center backdrop-blur-sm"
          >
            <p className="text-sm font-semibold text-slate-700">{quotaLockNotice}</p>
            {onManageStorage && (
              <button
                type="button"
                onClick={onManageStorage}
                className="mt-3 rounded-md border border-blue-200 px-4 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
              >
                Manage Storage
              </button>
            )}
          </div>
        )}

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

        {isDragging && (
          <div data-testid="drag-active-icon" className="animate-bounce">
            <UploadCloud className="mx-auto h-16 w-16 text-blue-500" />
          </div>
        )}

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
              disabled={isUploading || quotaLocked}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:cursor-not-allowed disabled:opacity-70"
              aria-label="Browse files"
            >
              Browse Files
            </button>
            <p className="text-xs text-gray-500">
              Supported formats: PDF, DOCX, XLSX, PPTX, TXT
            </p>
          </div>
        )}

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

      {hasUploadQueue && (
        <div data-testid="upload-queue" className="space-y-3">
          <div data-testid="overall-progress" className="text-sm font-medium text-gray-700">
            Overall: {overallProgress}%
          </div>

          <div className="space-y-2">
            {uploadQueue.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3"
              >
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

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    {file.size && (
                      <p className="text-xs text-gray-500 ml-2">{formatFileSize(file.size)}</p>
                    )}
                  </div>

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

                  {file.status === 'error' && file.error && (
                    <p className="text-xs text-red-600 mt-1">{file.error}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
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

      {displayError && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-600">{displayError}</p>
          {renderErrorAction()}
        </div>
      )}
    </div>
  )
}

export default UploadPanel
