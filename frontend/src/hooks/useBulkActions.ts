import { useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { Document } from '../services/api/documents'
import {
  bulkArchiveDocuments,
  bulkMoveDocuments,
  restoreArchivedDocuments,
  type BulkArchiveResult,
  type BulkMoveResult,
} from '../services/api/documents'

/**
 * Reusable hook for bulk document operations with optimistic updates
 *
 * Provides state management and handlers for:
 * - Bulk move operations with partial failure handling
 * - Bulk archive operations with undo capability
 * - Toast notifications
 * - Progress tracking for large batches
 *
 * @param dealId - The deal ID for query invalidation
 * @returns Bulk operation state and handlers
 */
export function useBulkActions(dealId: string) {
  const queryClient = useQueryClient()

  // Move state
  const [bulkMoveState, setBulkMoveState] = useState<{
    isOpen: boolean
    documents: Document[]
  }>({
    isOpen: false,
    documents: [],
  })

  // Archive state
  const [bulkArchiveState, setBulkArchiveState] = useState<{
    isOpen: boolean
    documents: Document[]
  }>({
    isOpen: false,
    documents: [],
  })

  // Toast state
  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error' | 'status' | 'alert'
    undoAction?: () => void
  } | null>(null)

  // Progress state for large batches
  const [progress, setProgress] = useState<{
    current: number
    total: number
  } | null>(null)

  // Reset selection signal
  const [resetSelectionSignal, setResetSelectionSignal] = useState(0)

  /**
   * Open bulk move modal with selected documents
   */
  const handleBulkMove = useCallback(
    async (documents: Document[]) => {
      setBulkMoveState({ isOpen: true, documents })
    },
    []
  )

  /**
   * Confirm bulk move with optimistic updates and partial failure handling
   */
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

        const result: BulkMoveResult = await bulkMoveDocuments(dealId, {
          document_ids: documents.map((doc) => doc.id),
          target_folder_id: targetFolderId,
        })

        if (result.failures && result.failures.length > 0) {
          const successCount = result.moved_ids.length
          const failureSummary = result.failures
            .map((failure) => {
              const docName = documents.find((doc) => doc.id === failure.id)?.name ?? failure.id
              return `${docName}: ${failure.reason}`
            })
            .join('; ')

          setToast({
            message: `Moved ${successCount} of ${documents.length} documents. Issues: ${failureSummary}`,
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

  /**
   * Open bulk archive modal with selected documents
   */
  const handleBulkArchive = useCallback(
    async (documents: Document[]) => {
      setBulkArchiveState({ isOpen: true, documents })
    },
    []
  )

  /**
   * Confirm bulk archive with optimistic updates and undo capability
   */
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

        const archiveResult: BulkArchiveResult = await bulkArchiveDocuments(dealId, {
          document_ids: documents.map((doc) => doc.id),
        })

        if (archiveResult.failures && archiveResult.failures.length > 0) {
          const failureSummary = archiveResult.failures
            .map((failure) => {
              const docName = documents.find((doc) => doc.id === failure.id)?.name ?? failure.id
              return `${docName}: ${failure.reason}`
            })
            .join('; ')

          setToast({
            message: `Some documents could not be archived: ${failureSummary}`,
            type: 'alert',
          })
        }

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

  /**
   * Undo archive operation
   */
  const handleUndoArchive = useCallback(
    async (documents: Document[]) => {
      try {
        await restoreArchivedDocuments(dealId, documents.map((doc) => doc.id))

        setToast({
          message: `Unarchived ${documents.length} document${documents.length !== 1 ? 's' : ''}`,
          type: 'status',
        })

        // Refresh documents
        queryClient.invalidateQueries({
          queryKey: ['deal-documents', dealId],
        })
      } catch (error) {
        setToast({
          message: 'Failed to undo archive',
          type: 'alert',
        })
      }
    },
    [dealId, queryClient]
  )

  return {
    // Move state
    bulkMoveState,
    setBulkMoveState,
    handleBulkMove,
    handleBulkMoveConfirm,

    // Archive state
    bulkArchiveState,
    setBulkArchiveState,
    handleBulkArchive,
    handleBulkArchiveConfirm,
    handleUndoArchive,

    // Shared state
    toast,
    setToast,
    progress,
    setProgress,
    resetSelectionSignal,
    setResetSelectionSignal,
  }
}
