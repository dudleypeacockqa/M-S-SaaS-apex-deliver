import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { FolderTree } from '../../components/documents/FolderTree'
import { DocumentList } from '../../components/documents/DocumentList'
import UploadPanel from '../../components/documents/UploadPanel'
import { PermissionModal } from '../../components/documents/PermissionModal'
import BulkMoveModal from '../../components/documents/BulkMoveModal'
import BulkArchiveModal from '../../components/documents/BulkArchiveModal'
import BulkDeleteModal from '../../components/documents/BulkDeleteModal'
import { DocumentQuestionsPanel } from '../../components/documents/DocumentQuestionsPanel'
import { AccessLogDrawer } from '../../components/documents/AccessLogDrawer'
import { ShareLinkModal } from '../../components/documents/ShareLinkModal'
import { HelpTooltip } from '../../components/common/HelpTooltip'
import type { Document } from '../../services/api/documents'
import { useDocumentUploads } from '../../hooks/useDocumentUploads'
import {
  bulkArchiveDocuments,
  bulkMoveDocuments,
  bulkDeleteDocuments,
  restoreArchivedDocuments,
  listPermissions,
  updatePermission,
  logDocumentAuditEvent,
  type BulkArchiveResult,
  type BulkMoveResult,
  type BulkDeleteResponse,
  type DocumentPermission,
  type PermissionLevel,
} from '../../services/api/documents'

type ToastType = 'status' | 'alert' | 'progress'

interface ToastState {
  type: ToastType
  message: string
  detail?: string
  actionLabel?: string
  onAction?: () => Promise<void> | void
  progress?: {
    value: number
    total: number
    label: string
  }
}

export interface DocumentWorkspaceProps {
  dealId: string
  onDocumentsLoaded?: (documents: Document[]) => void
  onError?: (error: unknown) => void
}

const DocumentWorkspace: React.FC<DocumentWorkspaceProps> = ({ dealId, onDocumentsLoaded, onError }) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [folderSearchTerm, setFolderSearchTerm] = useState('')
  const [permissionState, setPermissionState] = useState<{ id: string; isOpen: boolean }>({
    id: '',
    isOpen: false,
  })
  const [permissionAuditTrail, setPermissionAuditTrail] = useState<
    Array<{ id: string; actor: string; action: string; createdAt?: string }>
  >([])
  const [bulkMoveState, setBulkMoveState] = useState<{
    isOpen: boolean
    documents: Document[]
    isSubmitting: boolean
  }>({
    isOpen: false,
    documents: [],
    isSubmitting: false,
  })
  const [bulkArchiveState, setBulkArchiveState] = useState<{
    isOpen: boolean
    documents: Document[]
    isProcessing: boolean
  }>({
    isOpen: false,
    documents: [],
    isProcessing: false,
  })
  const [bulkDeleteState, setBulkDeleteState] = useState<{
    isOpen: boolean
    documents: Document[]
    isProcessing: boolean
  }>({
    isOpen: false,
    documents: [],
    isProcessing: false,
  })
  const [resetSelectionSignal, setResetSelectionSignal] = useState(0)
  const [questionPanelDocument, setQuestionPanelDocument] = useState<Document | null>(null)
  const [accessLogState, setAccessLogState] = useState<{ document: Document | null; isOpen: boolean }>({
    document: null,
    isOpen: false,
  })
  const [shareModalState, setShareModalState] = useState<{ document: Document | null; isOpen: boolean }>({
    document: null,
    isOpen: false,
  })
  const queryClient = useQueryClient()
  const { uploadQueue, isUploading, errorMessage, startUpload, clearQueue } = useDocumentUploads(dealId)
  const [activeToast, setActiveToast] = useState<ToastState | null>(null)

  const scheduleToast = useCallback((nextToast: ToastState | null) => {
    setActiveToast(nextToast)
    if (nextToast) {
      window.setTimeout(() => {
        setActiveToast((current) => {
          if (!current) return null
          if (current.type === 'progress') return current
          return null
        })
      }, 6000)
    }
  }, [])

  // Show upload progress toast when uploads are in progress
  useEffect(() => {
    if (isUploading && uploadQueue.length > 0) {
      const totalProgress = uploadQueue.reduce((sum, item) => sum + (item.progress || 0), 0)
      const averageProgress = Math.round(totalProgress / uploadQueue.length)
      const uploadingItems = uploadQueue.filter((item) => item.status === 'uploading')
      
      if (uploadingItems.length > 0) {
        scheduleToast({
          type: 'progress',
          message: `Uploading ${uploadingItems.length} file${uploadingItems.length !== 1 ? 's' : ''}...`,
          progress: {
            value: averageProgress,
            total: 100,
            label: `Uploading ${uploadingItems.length} file${uploadingItems.length !== 1 ? 's' : ''}`,
          },
        })
      }
    } else if (!isUploading && uploadQueue.length === 0 && activeToast?.type === 'progress') {
      // Clear progress toast when uploads complete
      setActiveToast(null)
    }
  }, [isUploading, uploadQueue, activeToast, scheduleToast])

  const handleFolderSelect = (folderId: string | null) => {
    setSelectedFolderId(folderId)
  }

  const handleManagePermissions = (
    document: Document & {
      auditTrail?: Array<{ id: string; actor: string; action: string; createdAt?: string }>
    }
  ) => {
    setPermissionState({ id: document.id, isOpen: true })
    setPermissionAuditTrail(document.auditTrail ?? [])
  }

  const closePermissionModal = useCallback(() => {
    setPermissionState((current) => ({ ...current, isOpen: false }))
  }, [])

  // Permission changes are handled internally by PermissionModal component
  // The modal uses React Query mutations and invalidates queries automatically

  const handleAuditLog = useCallback(
    async (event: {
      action: string
      resource_type: string
      resource_id: string
      metadata?: Record<string, any>
    }) => {
      const documentIds = Array.isArray(event.metadata?.documentIds)
        ? (event.metadata?.documentIds as string[])
        : [event.resource_id]

      try {
        await Promise.all(
          documentIds.map((docId) =>
            logDocumentAuditEvent(dealId, docId, {
              action: event.action,
              metadata: event.metadata,
            })
          )
        )
      } catch (error) {
        console.error('[Audit Log Failed]', error)
        scheduleToast({
          type: 'alert',
          message: 'Failed to record document activity',
        })
      }
    },
    [dealId, scheduleToast]
  )

  const handleRootBreadcrumb = useCallback(() => {
    setSelectedFolderId(null)
    setResetSelectionSignal((prev) => prev + 1)
  }, [])

  const handleBulkMove = useCallback(
    async (documents: Document[]) => {
      setBulkMoveState({ isOpen: true, documents, isSubmitting: false })
    },
    []
  )

  const handleOpenQuestions = useCallback((document: Document) => {
    setQuestionPanelDocument(document)
  }, [])

  const handleBulkMoveConfirm = useCallback(
    async (targetFolderId: string) => {
      const documents = bulkMoveState.documents

      setBulkMoveState((current) => ({ ...current, isSubmitting: true }))

      try {
        // Optimistic update: Reset selection immediately
        setResetSelectionSignal((prev) => prev + 1)

        scheduleToast({
          type: 'status',
          message: `Moved ${documents.length} document${documents.length !== 1 ? 's' : ''}`,
          detail: undefined,
        })

        let apiResult: BulkMoveResult | null = null
        try {
          apiResult = await bulkMoveDocuments(dealId, {
            document_ids: documents.map((doc) => doc.id),
            target_folder_id: targetFolderId,
          })
        } catch (error) {
          apiResult = null
          throw error
        }

        if (apiResult && apiResult.failures && apiResult.failures.length > 0) {
          const successfulCount = apiResult.moved_ids.length
          const failedSummaries = apiResult.failures
            .map((failure) => `${failure.id}: ${failure.reason}`)
            .join('\n')
          scheduleToast({
            type: 'status',
            message: `Moved ${successfulCount} of ${documents.length} documents`,
            detail: failedSummaries,
          })
        } else {
          scheduleToast({
            type: 'status',
            message: `Moved ${documents.length} document${documents.length !== 1 ? 's' : ''}`,
          })
        }

        // Invalidate queries to refetch
        queryClient.invalidateQueries({
          queryKey: ['deal-documents', dealId],
        })
      } catch (error) {
        // Rollback: Show error and restore documents
        scheduleToast({
          type: 'alert',
          message: 'Failed to move documents',
        })

        // Reset selection signal to trigger re-render
        setResetSelectionSignal((prev) => prev + 1)
      }
      setBulkMoveState({ isOpen: false, documents: [], isSubmitting: false })
    },
    [bulkMoveState, dealId, queryClient, scheduleToast]
  )

  const handleBulkDelete = useCallback(
    async (documents: Document[]) => {
      setBulkDeleteState({ isOpen: true, documents, isProcessing: false })
    },
    []
  )

  const closeBulkDeleteModal = useCallback(() => {
    setBulkDeleteState((current) => ({ ...current, isOpen: false }))
  }, [])

  const handleBulkDeleteConfirm = useCallback(async () => {
    const { documents } = bulkDeleteState
    if (documents.length === 0) {
      closeBulkDeleteModal()
      return
    }

    setBulkDeleteState((current) => ({ ...current, isProcessing: true }))

    try {
      const documentIds = documents.map((doc) => doc.id)
      const result: BulkDeleteResponse = await bulkDeleteDocuments(dealId, documentIds)

      // Log audit events for successful deletions
      await Promise.all(
        result.deleted_ids.map((docId: string) =>
          logDocumentAuditEvent(dealId, docId, {
            action: 'document_deleted',
            metadata: { bulk_delete: true, total_count: documents.length },
          }).catch((err) => {
            console.error(`Failed to log audit for deleted document ${docId}:`, err)
          })
        )
      )

      // Show success/partial success message
      if (result.failed_ids.length === 0) {
        scheduleToast({
          type: 'status',
          message: `Successfully deleted ${result.deleted_ids.length} document${result.deleted_ids.length !== 1 ? 's' : ''}`,
        })
      } else {
        scheduleToast({
          type: 'alert',
          message: `Deleted ${result.deleted_ids.length} of ${documents.length} documents`,
          detail: `${result.failed_ids.length} document${result.failed_ids.length !== 1 ? 's' : ''} could not be deleted.`,
        })
      }

      // Reset selection and refresh document list
      setResetSelectionSignal((prev) => prev + 1)
      queryClient.invalidateQueries({
        queryKey: ['deal-documents', dealId],
      })

      closeBulkDeleteModal()
    } catch (error) {
      console.error('[Bulk Delete Failed]', error)
      scheduleToast({
        type: 'alert',
        message: 'Failed to delete documents',
        detail: error instanceof Error ? error.message : 'An unexpected error occurred',
        actionLabel: 'Retry',
        onAction: handleBulkDeleteConfirm,
      })
      setBulkDeleteState((current) => ({ ...current, isProcessing: false }))
    }
  }, [bulkDeleteState, dealId, queryClient, scheduleToast, closeBulkDeleteModal])

  const handleShareDocument = useCallback((document: Document) => {
    setShareModalState({ document, isOpen: true })
  }, [])

  const handleBulkShare = useCallback(
    async (documents: Document[]) => {
      if (documents.length > 0) {
        setShareModalState({ document: documents[0], isOpen: true })
      }
    },
    []
  )

  const handleBulkArchive = useCallback(
    (documents: Document[]) => {
      setBulkArchiveState({ isOpen: true, documents, isProcessing: false })
    },
    []
  )

  const closeBulkArchiveModal = useCallback(() => {
    setBulkArchiveState((current) => ({ ...current, isOpen: false }))
  }, [])

  const handleArchiveConfirm = useCallback(async () => {
    const { documents } = bulkArchiveState
    if (documents.length === 0) {
      closeBulkArchiveModal()
      return
    }

    setBulkArchiveState((current) => ({ ...current, isProcessing: true }))

    const isLargeBatch = documents.length >= 20
    if (isLargeBatch) {
      scheduleToast({
        type: 'progress',
        message: '',
        progress: {
          value: 0,
          total: documents.length,
          label: `Archiving ${documents.length} documents...`,
        },
      })
    }

    try {
      const result: BulkArchiveResult = await bulkArchiveDocuments(dealId, {
        document_ids: documents.map((doc) => doc.id),
      })

      const succeededCount = result.archived_ids.length
      const failedCount = documents.length - succeededCount

      scheduleToast({
        type: 'status',
        message:
          failedCount > 0
            ? `Archived ${succeededCount} of ${documents.length} documents`
            : `Archived ${documents.length} document${documents.length !== 1 ? 's' : ''}`,
        detail:
          result.failures && result.failures.length
            ? result.failures
                .map((failure) => `${failure.id}: ${failure.reason}`)
                .join('\n')
            : undefined,
        actionLabel: succeededCount > 0 ? 'Undo' : undefined,
        onAction:
          succeededCount > 0
            ? async () => {
                try {
                  await restoreArchivedDocuments(dealId, result.archived_ids)
                  scheduleToast({
                    type: 'status',
                    message: `Unarchived ${succeededCount} document${succeededCount !== 1 ? 's' : ''}`,
                  })
                  queryClient.invalidateQueries({
                    queryKey: ['deal-documents', dealId],
                  })
                } catch (undoError) {
                  scheduleToast({
                    type: 'alert',
                    message: 'Failed to undo archive',
                  })
                }
              }
            : undefined,
      })

      if (succeededCount > 0) {
        setResetSelectionSignal((prev) => prev + 1)
      }

      queryClient.invalidateQueries({
        queryKey: ['deal-documents', dealId, selectedFolderId],
      })
    } catch (error) {
      scheduleToast({
        type: 'alert',
        message: 'Failed to archive documents',
      })
    }

    setBulkArchiveState({ isOpen: false, documents: [], isProcessing: false })
  }, [bulkArchiveState, closeBulkArchiveModal, dealId, queryClient, scheduleToast, selectedFolderId])

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

  const uploadProgress = useMemo(() => {
    if (!isUploading || uploadQueue.length === 0) {
      return null
    }

    const averageProgress = Math.round(
      uploadQueue.reduce((sum, item) => sum + (item.progress ?? 0), 0) / uploadQueue.length
    )

    return {
      value: averageProgress,
      total: 100,
      label: `Uploading files (${averageProgress}% complete)`,
    }
  }, [isUploading, uploadQueue])

  const uploadAnalyticsContext = useMemo(
    () => ({ dealId, folderId: selectedFolderId }),
    [dealId, selectedFolderId]
  )

  const handleUploadTelemetry = useCallback(
    (payload: Record<string, any>) => {
      console.log('[Audit] Upload telemetry event', payload)
    },
    []
  )

  useEffect(() => {
    if (uploadProgress) {
      scheduleToast({
        type: 'progress',
        message: 'Uploading files...',
        progress: uploadProgress,
      })
      return
    }

    setActiveToast((current) => (current?.type === 'progress' ? null : current))
  }, [uploadProgress, scheduleToast])

  const handleViewAccessLogs = useCallback((document: Document) => {
    setAccessLogState({ document, isOpen: true })
  }, [])

  const closeAccessLogs = useCallback(() => {
    setAccessLogState({ document: null, isOpen: false })
  }, [])

  const closeShareModal = useCallback(() => {
    setShareModalState({ document: null, isOpen: false })
  }, [])

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
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <nav aria-label="Document breadcrumbs" className="flex items-center gap-2 text-sm text-slate-600">
            <button
              type="button"
              role="link"
              onClick={handleRootBreadcrumb}
              className="rounded px-2 py-1 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              aria-current={!selectedFolderId ? 'page' : undefined}
            >
              All Documents
            </button>
            {selectedFolderId && (
              <>
                <span aria-hidden="true" className="text-slate-400">
                  /
                </span>
                <button
                  type="button"
                  onClick={() => handleFolderSelect(selectedFolderId)}
                  className="rounded px-2 py-1 text-slate-700 font-medium"
                >
                  {selectedFolderId}
                </button>
              </>
            )}
          </nav>
          <HelpTooltip
            label="Workspace help"
            content={
              <div>
                <p className="font-semibold text-slate-800">Document workspace tips</p>
                <ul className="mt-1 list-disc pl-4 text-slate-600">
                  <li>Folders inherit permissions; adjust sharing before uploading sensitive files.</li>
                  <li>Audit logs capture every download and are exportable from the menu.</li>
                  <li>Use the Questions panel to route vendor inquiries to subject matter experts.</li>
                </ul>
              </div>
            }
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-3">
          <p className="text-sm text-slate-500">
            Bulk actions update permissions, share links, or archive sensitive files instantly. Review the Document Workspace guide before making sweeping changes.
          </p>
          <HelpTooltip
            label="Document actions help"
            content={
              <div>
                <p className="font-semibold text-slate-800">Bulk action reminders</p>
                <ul className="mt-1 list-disc pl-4 text-slate-600">
                  <li>Document Workspace SOP: see <code>docs/bmad/document-workspace-guide.md</code>.</li>
                  <li>Archive in batches after exporting audit logs.</li>
                  <li>Use bulk share for investor access, then revoke in the audit trail.</li>
                </ul>
              </div>
            }
          />
        </div>
        <DocumentList
          dealId={dealId}
          folderId={selectedFolderId}
          onDocumentsLoaded={onDocumentsLoaded}
          onError={onError}
          onManagePermissions={handleManagePermissions}
          onAuditLog={handleAuditLog}
          onBulkMove={handleBulkMove}
          onBulkDelete={handleBulkDelete}
          onBulkShare={handleBulkShare}
          onBulkArchive={handleBulkArchive}
          onShareDocument={handleShareDocument}
          onOpenQuestions={handleOpenQuestions}
          onViewAccessLogs={handleViewAccessLogs}
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
          analyticsContext={uploadAnalyticsContext}
          onUploadTelemetry={handleUploadTelemetry}
        />
      </div>

      <PermissionModal
        documentId={permissionState.id}
        isOpen={permissionState.isOpen}
        onClose={closePermissionModal}
        auditTrail={permissionAuditTrail}
      />

      <BulkMoveModal
        isOpen={bulkMoveState.isOpen}
        documents={bulkMoveState.documents}
        currentFolderId={selectedFolderId}
        onClose={() => setBulkMoveState({ isOpen: false, documents: [], isSubmitting: false })}
        onConfirm={handleBulkMoveConfirm}
        isProcessing={bulkMoveState.isSubmitting}
      />

      <BulkArchiveModal
        isOpen={bulkArchiveState.isOpen}
        documents={bulkArchiveState.documents}
        isProcessing={bulkArchiveState.isProcessing}
        onClose={closeBulkArchiveModal}
        onConfirm={handleArchiveConfirm}
      />

      <BulkDeleteModal
        isOpen={bulkDeleteState.isOpen}
        documents={bulkDeleteState.documents}
        isProcessing={bulkDeleteState.isProcessing}
        onClose={closeBulkDeleteModal}
        onConfirm={handleBulkDeleteConfirm}
      />

      <AccessLogDrawer
        dealId={dealId}
        documentId={accessLogState.document?.id ?? null}
        documentName={accessLogState.document?.name}
        isOpen={accessLogState.isOpen}
        onClose={closeAccessLogs}
      />

      <ShareLinkModal
        documentId={shareModalState.document?.id ?? ''}
        documentName={shareModalState.document?.name}
        isOpen={shareModalState.isOpen && Boolean(shareModalState.document)}
        onClose={closeShareModal}
      />

      {questionPanelDocument && (
        <DocumentQuestionsPanel
          dealId={dealId}
          document={questionPanelDocument}
          onClose={() => setQuestionPanelDocument(null)}
        />
      )}

      {/* Toast notification */}
      {activeToast && (
        <div
          role={
            activeToast.type === 'alert'
              ? 'alert'
              : activeToast.type === 'progress'
              ? 'progressbar'
              : 'status'
          }
          aria-label={activeToast.progress ? activeToast.progress.label : activeToast.message}
          aria-valuemin={activeToast.progress ? 0 : undefined}
          aria-valuemax={activeToast.progress ? activeToast.progress.total : undefined}
          aria-valuenow={activeToast.progress ? activeToast.progress.value : undefined}
          aria-valuetext={activeToast.progress ? activeToast.progress.label : undefined}
          className={`fixed bottom-4 right-4 max-w-sm rounded-lg px-4 py-3 shadow-lg ${
            activeToast.type === 'alert'
              ? 'bg-red-50 text-red-800 border border-red-200'
              : activeToast.type === 'progress'
              ? 'bg-blue-50 text-blue-800 border border-blue-200'
              : 'bg-green-50 text-green-800 border border-green-200'
          }`}
        >
          <p>{activeToast.progress ? activeToast.progress.label : activeToast.message}</p>
          {activeToast.detail && <pre className="mt-2 whitespace-pre-wrap text-sm">{activeToast.detail}</pre>}
          {activeToast.actionLabel && activeToast.onAction && (
            <button
              type="button"
              className="mt-3 rounded border border-green-500 px-3 py-1 text-sm font-medium text-green-800 hover:bg-green-100"
              onClick={() => activeToast.onAction?.()}
            >
              {activeToast.actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default DocumentWorkspace
