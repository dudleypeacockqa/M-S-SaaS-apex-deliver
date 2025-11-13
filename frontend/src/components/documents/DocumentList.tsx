import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteDocument,
  downloadDocument,
  formatFileSize,
  listDocuments,
  type Document,
} from '../../services/api/documents'
import { BulkActionsToolbar } from './BulkActionsToolbar'

interface DocumentListProps {
  dealId: string
  folderId: string | null
  onSelectionChange?: (documents: Document[]) => void
  onError?: (error: unknown) => void
  onDocumentsLoaded?: (documents: Document[]) => void
  resetSelectionSignal?: number
  onManagePermissions?: (document: Document) => void
  onBulkMove?: (documents: Document[]) => void
  onBulkDelete?: (documents: Document[]) => void
  onBulkShare?: (documents: Document[]) => void
  onBulkArchive?: (documents: Document[]) => void
  onAuditLog?: (event: {
    action: string
    resource_type: string
    resource_id: string
    metadata?: Record<string, unknown>
  }) => void
  onViewAccessLogs?: (document: Document) => void
  onShareDocument?: (document: Document) => void
  onOpenQuestions?: (document: Document) => void
}

type SortKey = 'name' | 'date'

function formatDate(value: string): string {
  const date = new Date(value)
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export const DocumentList: React.FC<DocumentListProps> = (props) => {
  const {
    dealId,
    folderId,
    onSelectionChange,
    onError,
    onDocumentsLoaded,
    resetSelectionSignal,
    onManagePermissions,
    onShareDocument,
    onViewAccessLogs,
    onOpenQuestions,
  } = props

  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDesc, setSortDesc] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const { data, isLoading, error } = useQuery({
    queryKey: ['deal-documents', dealId, folderId],
    queryFn: () => listDocuments(dealId, { folder_id: folderId ?? undefined }),
  })

  const documents = data?.items ?? []
  const selectedDocuments = useMemo(
    () => documents.filter((doc) => selectedIds.includes(doc.id)),
    [documents, selectedIds]
  )
  const canManageSelection = selectedDocuments.length === 1 && Boolean(onManagePermissions)

  useEffect(() => {
    setSelectedIds([])
  }, [folderId, resetSelectionSignal])

  useEffect(() => {
    if (!onSelectionChange) return
    onSelectionChange(selectedDocuments)
  }, [selectedDocuments, onSelectionChange])

  useEffect(() => {
    if (error && onError) {
      onError(error)
    }
  }, [error, onError])

  useEffect(() => {
    if (onDocumentsLoaded) {
      onDocumentsLoaded(documents)
    }
  }, [documents, onDocumentsLoaded])

  const filteredDocuments = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    const sorted = documents.slice().sort((a, b) => {
      if (sortKey === 'name') {
        return sortDesc ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
      }
      const dateA = Date.parse(a.created_at)
      const dateB = Date.parse(b.created_at)
      return sortDesc ? dateB - dateA : dateA - dateB
    })

    if (!term) {
      return sorted
    }

    return sorted.filter((doc) => doc.name.toLowerCase().includes(term))
  }, [documents, searchTerm, sortKey, sortDesc])

  const invalidateDocuments = () => {
    queryClient.invalidateQueries({ queryKey: ['deal-documents', dealId, folderId] })
  }

  const downloadMutation = useMutation({
    mutationFn: (documentId: string) => downloadDocument(dealId, documentId),
    onSuccess: (blobUrl) => {
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = 'document'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (documentId: string) => deleteDocument(dealId, documentId),
    onSuccess: () => invalidateDocuments(),
  })

  const toggleSelection = (documentId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(documentId)) {
        return prev.filter((id) => id !== documentId)
      }
      return [...prev, documentId]
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredDocuments.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredDocuments.map((doc) => doc.id))
    }
  }

  const handleClearSelection = useCallback(() => {
    setSelectedIds([])
  }, [])

  const handleBulkDownload = useCallback(() => {
    selectedDocuments.forEach((doc) => downloadMutation.mutate(doc.id))
  }, [selectedDocuments, downloadMutation])

  const handleBulkDelete = useCallback(() => {
    if (selectedDocuments.length === 0) return
    if (!window.confirm('Delete selected documents?')) {
      return
    }
    selectedDocuments.forEach((doc) => deleteMutation.mutate(doc.id))
    setSelectedIds([])
  }, [selectedDocuments, deleteMutation])

  if (error) {
    const message = error instanceof Error ? error.message : 'Failed to load documents'
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
        {message}
      </div>
    )
  }

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading documents...</p>
  }

  if (filteredDocuments.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
        No documents found. Adjust your filters or upload a new file.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {selectedIds.length > 0 && (
        <BulkActionsToolbar
          selectedCount={selectedIds.length}
          disableDownload={downloadMutation.isPending}
          disableDelete={deleteMutation.isPending}
          onDownload={handleBulkDownload}
          onDelete={handleBulkDelete}
          onClearSelection={handleClearSelection}
          onManageAccess={
            canManageSelection && onManagePermissions
              ? () => onManagePermissions(selectedDocuments[0])
              : undefined
          }
        />
      )}

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-slate-500" htmlFor="document-search">
            Search
          </label>
          <input
            id="document-search"
            type="search"
            placeholder="Search documents"
            className="rounded border border-slate-300 px-2 py-1 text-sm"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Sort:</span>
          <button
            type="button"
            className={`rounded px-2 py-1 ${sortKey === 'name' ? 'bg-slate-200' : ''}`}
            onClick={() => {
              setSortDesc(sortKey === 'name' ? !sortDesc : false)
              setSortKey('name')
            }}
            aria-label="Sort by name"
          >
            Name
          </button>
          <button
            type="button"
            className={`rounded px-2 py-1 ${sortKey === 'date' ? 'bg-slate-200' : ''}`}
            onClick={() => {
              setSortDesc(sortKey === 'date' ? !sortDesc : true)
              setSortKey('date')
            }}
            aria-label="Sort by date"
          >
            Date
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th scope="col" className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    aria-label="Select all documents"
                    checked={selectedIds.length === filteredDocuments.length}
                    onChange={toggleSelectAll}
                  />
                  Name
                </div>
              </th>
              <th scope="col" className="px-4 py-3">
                Version
              </th>
              <th scope="col" className="px-4 py-3">
                Size
              </th>
              <th scope="col" className="px-4 py-3">
                Uploaded
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700">
            {filteredDocuments.map((doc) => {
              const isSelected = selectedIds.includes(doc.id)
              return (
                <tr key={doc.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        aria-label={`Select ${doc.name}`}
                        checked={isSelected}
                        onChange={() => toggleSelection(doc.id)}
                      />
                      <span className="font-medium text-slate-900">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      v{doc.version}
                    </span>
                  </td>
                  <td className="px-4 py-3">{formatFileSize(doc.file_size)}</td>
                  <td className="px-4 py-3">{formatDate(doc.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        type="button"
                        className="rounded border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                        onClick={() => downloadMutation.mutate(doc.id)}
                        aria-label={`Download ${doc.name}`}
                      >
                        Download
                      </button>
                      <button
                        type="button"
                        className="rounded border border-rose-200 px-3 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50"
                        onClick={() => {
                          if (window.confirm('Delete this document?')) {
                            deleteMutation.mutate(doc.id)
                          }
                        }}
                        aria-label={`Delete ${doc.name}`}
                      >
                        Delete
                      </button>
                      {onManagePermissions && (
                        <button
                          type="button"
                          className="rounded border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                          onClick={() => onManagePermissions(doc)}
                          aria-label={`Manage permissions for ${doc.name}`}
                        >
                          Manage access
                        </button>
                      )}
                      {onShareDocument && (
                        <button
                          type="button"
                          className="rounded border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                          onClick={() => onShareDocument(doc)}
                          aria-label={`Share ${doc.name}`}
                        >
                          Share
                        </button>
                      )}
                      {onViewAccessLogs && (
                        <button
                          type="button"
                          className="rounded border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                          onClick={() => onViewAccessLogs(doc)}
                          aria-label={`View activity for ${doc.name}`}
                        >
                          View activity
                        </button>
                      )}
                      {onOpenQuestions && (
                        <button
                          type="button"
                          className="rounded border border-indigo-200 px-3 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50"
                          onClick={() => onOpenQuestions(doc)}
                        >
                          Q&A
                          {typeof doc.question_count === 'number' && (
                            <span className="ml-1 rounded-full bg-indigo-100 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700">
                              {doc.question_count}
                            </span>
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
