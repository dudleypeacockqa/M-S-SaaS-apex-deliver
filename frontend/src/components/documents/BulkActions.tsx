/**
 * BulkActions Component (DEV-008 Phase 4)
 * Bulk operations for selected documents (download ZIP, delete)
 */

import React, { useMemo, useRef, useState } from 'react'
import { Document, bulkDeleteDocuments, bulkDownloadDocuments } from '../../services/api/documents'

interface BulkActionsProps {
  dealId: string
  selectedDocuments: Document[]
  onClearSelection: () => void
  onRefresh: () => void
  autoClearOnDelete?: boolean
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  dealId,
  selectedDocuments,
  onClearSelection,
  onRefresh,
  autoClearOnDelete = true,
}) => {
  const downloadLinkRef = useRef<HTMLAnchorElement | null>(null)
  const [downloading, setDownloading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const documentIds = useMemo(() => selectedDocuments.map((doc) => doc.id), [selectedDocuments])

  if (documentIds.length === 0) {
    return null
  }

  const handleDownload = async () => {
    try {
      setDownloading(true)
      setError(null)

      const blobUrl = await bulkDownloadDocuments(dealId, documentIds)
      const existingLink = downloadLinkRef.current
      const link = existingLink ?? document.createElement('a')
      let appended = false

      if (!existingLink) {
        link.style.display = 'none'
        document.body.appendChild(link)
        appended = true
      }

      link.href = blobUrl
      link.download = `deal-${dealId}-documents-${new Date().toISOString().split('T')[0]}.zip`
      link.click()

      if (appended) {
        document.body.removeChild(link)
      }

      window.setTimeout(() => {
        if (typeof URL?.revokeObjectURL === 'function') {
          URL.revokeObjectURL(blobUrl)
        }
      }, 0)
    } catch (err) {
      const fallbackMessage = 'Failed to download documents'
      const message = err instanceof Error ? err.message : fallbackMessage
      setError(/failed to download/i.test(message) ? message : fallbackMessage)
    } finally {
      setDownloading(false)
    }
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedDocuments.length} documents? This action cannot be undone.`
    )

    if (!confirmed) {
      return
    }

    let shouldClearSelection = false

    try {
      setDeleting(true)
      setError(null)

      const result = await bulkDeleteDocuments(dealId, documentIds)

      if (result.failed_ids.length > 0) {
        const failedNames = selectedDocuments
          .filter((doc) => result.failed_ids.includes(doc.id))
          .map((doc) => `${doc.name}: ${result.failed_reasons[doc.id]}`)
          .join(', ')

        setError(`${result.failed_ids.length} documents failed to delete: ${failedNames}`)
      }

      shouldClearSelection = autoClearOnDelete && result.failed_ids.length === 0
      onRefresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete documents')
    } finally {
      setDeleting(false)
      if (shouldClearSelection) {
        onClearSelection()
      }
    }
  }

  const disableActions = downloading || deleting

  return (
    <div className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-3">
      <a ref={downloadLinkRef} className="hidden" aria-hidden="true" />

      <div className="flex w-full max-w-3xl items-center gap-6 rounded-xl bg-slate-900 px-6 py-4 text-white shadow-2xl">
        <span className="font-semibold">{selectedDocuments.length} documents selected</span>

        <div className="flex flex-1 justify-end gap-3">
          <button
            onClick={handleDownload}
            disabled={disableActions}
            className="inline-flex items-center justify-center rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-500"
          >
            {downloading ? 'Downloading...' : '⬇️ Download ZIP'}
          </button>

          <button
            onClick={handleDelete}
            disabled={disableActions}
            className="inline-flex items-center justify-center rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium transition-colors hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-slate-500"
          >
            {deleting ? 'Deleting...' : '🗑️ Delete'}
          </button>

          <button
            onClick={onClearSelection}
            disabled={disableActions}
            className="inline-flex items-center justify-center rounded-lg bg-slate-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-500 disabled:cursor-not-allowed disabled:bg-slate-500"
          >
            ✕ Clear
          </button>
        </div>
      </div>

      {error && (
        <div
          role="status"
          aria-live="assertive"
          className="max-w-3xl rounded-lg bg-rose-100 px-4 py-3 text-sm font-medium text-rose-700 shadow-lg"
        >
          {error}
        </div>
      )}
    </div>
  )
}
