import React, { useState } from 'react'
import type { Document } from '../../services/api/documents'

export interface BulkMoveModalProps {
  isOpen: boolean
  documents: Document[]
  currentFolderId: string | null
  onClose: () => void
  onConfirm: (targetFolderId: string) => Promise<void>
  isProcessing?: boolean
}

const BulkMoveModal: React.FC<BulkMoveModalProps> = ({
  isOpen,
  documents,
  currentFolderId,
  onClose,
  onConfirm,
  isProcessing = false,
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)

  if (!isOpen) return null

  const isSameFolder = selectedFolderId === currentFolderId
  const canMove = selectedFolderId !== null && !isSameFolder && !isProcessing

  const handleConfirm = async () => {
    if (!canMove || !selectedFolderId) return

    try {
      await onConfirm(selectedFolderId)
      onClose()
    } catch (error) {
      // Error handled by parent
    }
  }

  return (
    <div
      role="dialog"
      aria-labelledby="bulk-move-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <h2 id="bulk-move-title" className="text-xl font-semibold text-gray-900">
          Move Documents
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          Select destination folder
        </p>

        <p className="mt-1 text-sm font-medium text-gray-700">
          {documents.length} document{documents.length !== 1 ? 's' : ''} selected
        </p>

        {/* Folder selection */}
        <div className="mt-4 space-y-2">
          {/* Mock folders for testing - in real implementation, this would be FolderTree */}
          <button
            type="button"
            role="button"
            aria-label="Legal Documents"
            onClick={() => setSelectedFolderId('folder-legal')}
            className={`w-full rounded border p-3 text-left transition-colors ${
              selectedFolderId === 'folder-legal'
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            Legal Documents
          </button>

          <button
            type="button"
            role="button"
            aria-label="Current Folder"
            onClick={() => setSelectedFolderId(currentFolderId)}
            className={`w-full rounded border p-3 text-left transition-colors ${
              selectedFolderId === currentFolderId
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            Current Folder
          </button>
        </div>

        {/* Validation message */}
        {isSameFolder && (
          <p className="mt-2 text-sm text-orange-600">
            Documents are already in this folder
          </p>
        )}

        {/* Actions */}
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
            onClick={handleConfirm}
            disabled={!canMove}
            aria-label="Move documents"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isProcessing ? 'Moving...' : 'Move Documents'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BulkMoveModal
