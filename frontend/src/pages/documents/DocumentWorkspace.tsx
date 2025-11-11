import React, { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { FolderTree } from '../../components/documents/FolderTree'
import { DocumentList } from '../../components/documents/DocumentList'
import UploadPanel from '../../components/documents/UploadPanel'
import { PermissionModal } from '../../components/documents/PermissionModal'
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
      // TODO: Show folder selection modal
      console.log('[Bulk Move]', documents)
    },
    []
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
    </div>
  )
}

export default DocumentWorkspace
