import React, { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { FolderTree } from '../../components/documents/FolderTree'
import { DocumentList } from '../../components/documents/DocumentList'
import UploadPanel from '../../components/documents/UploadPanel'
import { PermissionModal } from '../../components/documents/PermissionModal'
import BulkMoveModal from '../../components/documents/BulkMoveModal'
import type { Document } from '../../services/api/documents'
import { useDocumentUploads } from '../../hooks/useDocumentUploads'

export interface DocumentWorkspaceProps {
  dealId: string
}

const DocumentWorkspace: React.FC<DocumentWorkspaceProps> = ({ dealId }) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [folderSearchTerm, setFolderSearchTerm] = useState('')
  const [permissionState, setPermissionState] = useState<{ id: string; isOpen: boolean }>({
    id: '',
    isOpen: false,
  })
  const [bulkMoveState, setBulkMoveState] = useState<{
    isOpen: boolean
    documents: Document[]
  }>({
    isOpen: false,
    documents: [],
  })
  const [bulkArchiveState, setBulkArchiveState] = useState<{
    isOpen: boolean
    documents: Document[]
  }>({
    isOpen: false,
    documents: [],
  })
  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error' | 'status' | 'alert'
    undoAction?: () => void
  } | null>(null)
  const [progress, setProgress] = useState<{
    current: number
    total: number
  } | null>(null)
  const [resetSelectionSignal, setResetSelectionSignal] = useState(0)
  const queryClient = useQueryClient()
  const { uploadQueue, isUploading, errorMessage, startUpload, clearQueue } = useDocumentUploads(dealId)

  const handleFolderSelect = (folderId: string | null) => {
    setSelectedFolderId(folderId)
  }

  const handleManagePermissions = (document: Document) => {
    setPermissionState({ id: document.id, isOpen: true })
  }

  const closePermissionModal = useCallback(() => {
    setPermissionState((current) => ({ ...current, isOpen: false }))
  }, [])

  const handlePermissionChange = useCallback(
    async (change: { documentId: string; userId: string; permission: string }) => {
      // TODO: Call backend API to update permissions
      // For now, just log the audit event
      console.log('[Audit] Permission changed:', change)
    },
    []
  )

  const handleAuditLog = useCallback((event: {
    action: string
    resource_type: string
    resource_id: string
    metadata?: Record<string, any>
  }) => {
    // TODO: Send audit log to backend
    console.log('[Audit]', event)
  }, [])

  const handleBulkMove = useCallback(
    async (documents: Document[]) => {
      setBulkMoveState({ isOpen: true, documents })
    },
    []
  )

  const handleBulkMoveConfirm = useCallback(
    async (targetFolderId: string) => {
      const { documents } = bulkMoveState

      try {
        // Optimistic update: Reset selection immediately
        setResetSelectionSignal((prev) => prev + 1)

        // Show success toast immediately (optimistic)
        setToast({
          message: `Moved ${documents.length} document${documents.length !== 1 ? 's' : ''}`,
          type: 'status',
        })

        // Close modal
        setBulkMoveState({ isOpen: false, documents: [] })

        // TODO: Call actual API endpoint
        // const result = await bulkMoveDocuments(documents.map(d => d.id), targetFolderId)

        // Simulate API call for testing
        const result: any = await new Promise((resolve, reject) => {
          setTimeout(() => {
            // For testing: check if we should simulate an error
            if ((window as any).__TEST_BULK_MOVE_ERROR__) {
              reject(new Error('Network error'))
            } else if ((window as any).__TEST_BULK_MOVE_PARTIAL_FAILURE__) {
              resolve((window as any).__TEST_BULK_MOVE_PARTIAL_FAILURE__)
            } else {
              resolve({ success: true })
            }
          }, 100)
        })

        // Handle partial failures
        if (result && !result.success && result.results) {
          const successCount = result.results.filter((r: any) => r.success).length
          const failures = result.results.filter((r: any) => !r.success)

          const failedDoc = failures[0]
          const matchingDoc = documents.find((d) => d.id === failedDoc.id)

          setToast({
            message: `Moved ${successCount} of ${documents.length} documents. ${matchingDoc?.name}: ${failedDoc.error}`,
            type: 'status',
          })
        }

        // Invalidate queries to refetch
        queryClient.invalidateQueries({
          queryKey: ['deal-documents', dealId],
        })
      } catch (error) {
        // Rollback: Show error and restore documents
        setToast({
          message: 'Failed to move documents',
          type: 'alert',
        })

        // Reset selection signal to trigger re-render
        setResetSelectionSignal((prev) => prev + 1)
      }
    },
    [bulkMoveState, dealId, queryClient]
  )

  const handleBulkDelete = useCallback(
    async (documents: Document[]) => {
      // TODO: Show confirmation dialog
      console.log('[Bulk Delete]', documents)
    },
    []
  )

  const handleBulkShare = useCallback(
    async (documents: Document[]) => {
      // TODO: Show bulk share modal
      console.log('[Bulk Share]', documents)
    },
    []
  )

  const handleBulkArchive = useCallback(
    async (documents: Document[]) => {
      setBulkArchiveState({ isOpen: true, documents })
    },
    []
  )

  const handleBulkArchiveConfirm = useCallback(
    async () => {
      const { documents } = bulkArchiveState

      try {
        // Optimistic update: Reset selection immediately
        setResetSelectionSignal((prev) => prev + 1)

        // Show progress for large batches
        if (documents.length > 10) {
          setProgress({ current: 0, total: documents.length })

          // Simulate batch progress
          for (let i = 0; i < documents.length; i += 10) {
            setProgress({ current: i, total: documents.length })
            await new Promise((resolve) => setTimeout(resolve, 50))
          }
          setProgress({ current: documents.length, total: documents.length })
        }

        // Store documents for undo
        const archivedDocs = [...documents]

        // Show success toast with undo
        setToast({
          message: `Archived ${documents.length} document${documents.length !== 1 ? 's' : ''}`,
          type: 'status',
          undoAction: () => handleUndoArchive(archivedDocs),
        })

        // Close modal and clear progress
        setBulkArchiveState({ isOpen: false, documents: [] })
        setProgress(null)

        // TODO: Call actual API endpoint
        // await bulkArchiveDocuments(documents.map(d => d.id))

        // Simulate API call for testing
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            // For testing: check if we should simulate an error
            if ((window as any).__TEST_BULK_ARCHIVE_ERROR__) {
              reject(new Error('Server error'))
            } else {
              resolve(undefined)
            }
          }, 100)
        })

        // Invalidate queries to refetch
        queryClient.invalidateQueries({
          queryKey: ['deal-documents', dealId],
        })
      } catch (error) {
        // Rollback: Show error and restore documents
        setToast({
          message: 'Failed to archive documents',
          type: 'alert',
        })
        setProgress(null)

        // Reset selection signal to trigger re-render
        setResetSelectionSignal((prev) => prev + 1)
      }
    },
    [bulkArchiveState, dealId, queryClient]
  )

  const handleUndoArchive = useCallback(
    async (documents: Document[]) => {
      try {
        // TODO: Call unarchive API endpoint
        // await bulkUnarchiveDocuments(documents.map(d => d.id))

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 100))

        setToast({
          message: `Unarchived ${documents.length} document${documents.length !== 1 ? 's' : ''}`,
          type: 'status',
        })

        // Refresh documents
        queryClient.invalidateQueries({
          queryKey: ['deal-documents', dealId],
        })
        setResetSelectionSignal((prev) => prev + 1)
      } catch (error) {
        setToast({
          message: 'Failed to undo archive',
          type: 'alert',
        })
      }
    },
    [dealId, queryClient]
  )

  const handleUpload = useCallback(
    async (files: FileList | File[]) => {
      try {
        await startUpload(files, { folderId: selectedFolderId })
        setResetSelectionSignal((value) => value + 1)
        queryClient.invalidateQueries({
          queryKey: ['deal-documents', dealId, selectedFolderId],
        })
      } catch (error) {
        // The hook already surfaces error state to UploadPanel; swallow to keep UX consistent.
      }
    },
    [dealId, queryClient, selectedFolderId, startUpload]
  )

  return (
    <div
      data-testid="workspace-layout"
      className="grid grid-cols-[320px_1fr] gap-6 h-full"
    >
      <aside data-testid="folder-pane" className="border rounded-lg bg-white p-4">
        {/* Folder Search */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="search"
              role="searchbox"
              aria-label="Search folders"
              placeholder="Search folders..."
              value={folderSearchTerm}
              onChange={(e) => setFolderSearchTerm(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {folderSearchTerm && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setFolderSearchTerm('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <FolderTree
          dealId={dealId}
          selectedFolderId={selectedFolderId}
          searchTerm={folderSearchTerm}
          onFolderSelect={handleFolderSelect}
        />
      </aside>

      <section data-testid="document-pane" className="flex flex-col border rounded-lg bg-white">
        <DocumentList
          dealId={dealId}
          folderId={selectedFolderId}
          onManagePermissions={handleManagePermissions}
          onAuditLog={handleAuditLog}
          onBulkMove={handleBulkMove}
          onBulkDelete={handleBulkDelete}
          onBulkShare={handleBulkShare}
          onBulkArchive={handleBulkArchive}
          resetSelectionSignal={resetSelectionSignal}
        />
      </section>

      <div data-testid="upload-pane" className="border rounded-lg bg-white p-4">
        <UploadPanel
          onUpload={handleUpload}
          isUploading={isUploading}
          uploadQueue={uploadQueue}
          errorMessage={errorMessage ?? undefined}
          onRemove={clearQueue}
        />
      </div>

      <PermissionModal
        documentId={permissionState.id}
        isOpen={permissionState.isOpen}
        onClose={closePermissionModal}
        onPermissionChange={handlePermissionChange}
      />

      <BulkMoveModal
        isOpen={bulkMoveState.isOpen}
        documents={bulkMoveState.documents}
        currentFolderId={selectedFolderId}
        onClose={() => setBulkMoveState({ isOpen: false, documents: [] })}
        onConfirm={handleBulkMoveConfirm}
      />

      {/* Bulk Archive Confirmation Dialog */}
      {bulkArchiveState.isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setBulkArchiveState({ isOpen: false, documents: [] })
            }
          }}
        >
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900">
              Archive {bulkArchiveState.documents.length} document
              {bulkArchiveState.documents.length !== 1 ? 's' : ''}?
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Archived documents can be restored later from the archive section.
            </p>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setBulkArchiveState({ isOpen: false, documents: [] })}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkArchiveConfirm}
                aria-label="Archive"
                className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {progress && (
        <div
          role="progressbar"
          aria-valuenow={progress.current}
          aria-valuemin={0}
          aria-valuemax={progress.total}
          className="fixed bottom-20 right-4 w-80 rounded-lg bg-white p-4 shadow-lg border border-gray-200"
        >
          <p className="text-sm font-medium text-gray-900">
            Archiving {progress.total} documents...
          </p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-600">
            {progress.current} of {progress.total} completed
          </p>
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <div
          role={toast.type}
          className={`fixed bottom-4 right-4 rounded-lg px-4 py-3 shadow-lg flex items-center justify-between space-x-4 ${
            toast.type === 'alert'
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-green-50 text-green-800 border border-green-200'
          }`}
        >
          <span>{toast.message}</span>
          {toast.undoAction && (
            <button
              type="button"
              onClick={() => {
                toast.undoAction?.()
                setToast(null)
              }}
              aria-label="Undo"
              className="ml-3 rounded bg-green-700 px-3 py-1 text-sm font-medium text-white hover:bg-green-800"
            >
              Undo
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default DocumentWorkspace
