import React from 'react'
import type { Document } from '../../services/api/documents'

export interface BulkArchiveModalProps {
  isOpen: boolean
  documents: Document[]
  isProcessing: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
}

export const BulkArchiveModal: React.FC<BulkArchiveModalProps> = ({
  isOpen,
  documents,
  isProcessing,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null

  const handleBackdropClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="bulk-archive-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <h2 id="bulk-archive-title" className="text-xl font-semibold text-gray-900">
          Archive Documents
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          Archive {documents.length}{' '}
          document{documents.length !== 1 ? 's' : ''}? Archived documents can be restored from the archive view.
        </p>

        {documents.length <= 6 ? (
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-gray-700">
            {documents.map((doc) => (
              <li key={doc.id}>{doc.name}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">
            Showing first 6 of {documents.length} documents.
          </p>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            aria-label="Archive documents"
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isProcessing ? 'Archiving…' : 'Archive'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BulkArchiveModal
