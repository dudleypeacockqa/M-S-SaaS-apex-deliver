/**
 * DocumentRoomPage Component
 *
 * Main page for the Document Room feature, integrating:
 * - Folder navigation (FolderTree)
 * - Document listing (DocumentList)
 * - File uploads (UploadPanel)
 * - Bulk operations (BulkActionsToolbar)
 *
 * DEV-008: Document Room UI Polish (Phase 1)
 */

import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FileText, FolderOpen, Upload, AlertCircle, Loader2 } from 'lucide-react'
import * as documentApi from '@/services/api/documents'
import type { FolderResponse, DocumentMetadata, DocumentListParams } from '@/services/api/documents'
import { FolderTree } from '@/components/documents/FolderTree'
import { DocumentList } from '@/components/documents/DocumentList'
import UploadPanel from '@/components/documents/UploadPanel'
import { BulkActionsToolbar } from '@/components/documents/BulkActionsToolbar'

export const DocumentRoomPage: React.FC = () => {
  const { dealId } = useParams<{ dealId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [fileTypeFilter, setFileTypeFilter] = useState<string | null>(null)

  if (!dealId) {
    navigate('/deals')
    return null
  }

  // Fetch folders
  const {
    data: folders = [],
    isLoading: isLoadingFolders,
    error: foldersError,
  } = useQuery<FolderResponse[]>({
    queryKey: ['folders', dealId],
    queryFn: () => documentApi.listFolders(dealId),
  })

  // Fetch documents with filters
  const {
    data: documentsData,
    isLoading: isLoadingDocuments,
    error: documentsError,
  } = useQuery({
    queryKey: ['documents', dealId, selectedFolderId, searchQuery, fileTypeFilter],
    queryFn: () => {
      const params: DocumentListParams = {
        folder_id: selectedFolderId || undefined,
        search: searchQuery || undefined,
        file_type: fileTypeFilter || undefined,
        page: 1,
        per_page: 50,
      }
      return documentApi.listDocuments(dealId, params)
    },
  })

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: ({ file, folderId }: { file: File; folderId?: string }) =>
      documentApi.uploadDocument(dealId, file, folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', dealId] })
      queryClient.invalidateQueries({ queryKey: ['folders', dealId] })
    },
  })

  // Bulk download mutation
  const bulkDownloadMutation = useMutation({
    mutationFn: (documentIds: string[]) => documentApi.bulkDownloadDocuments(dealId, documentIds),
    onSuccess: (data) => {
      // Trigger browser download
      const url = window.URL.createObjectURL(new Blob([data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `documents-${Date.now()}.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    },
  })

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: (documentIds: string[]) => documentApi.bulkDeleteDocuments(dealId, documentIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', dealId] })
      setSelectedDocuments([])
    },
  })

  const handleFolderSelect = (folderId: string | null) => {
    setSelectedFolderId(folderId)
    setSelectedDocuments([])
  }

  const handleUpload = (files: File[]) => {
    files.forEach((file) => {
      uploadMutation.mutate({ file, folderId: selectedFolderId || undefined })
    })
  }

  const handleDocumentSelect = (documentIds: string[]) => {
    setSelectedDocuments(documentIds)
  }

  const handleBulkDownload = () => {
    if (selectedDocuments.length > 0) {
      bulkDownloadMutation.mutate(selectedDocuments)
    }
  }

  const handleBulkDelete = () => {
    if (selectedDocuments.length > 0) {
      if (window.confirm(`Are you sure you want to delete ${selectedDocuments.length} documents?`)) {
        bulkDeleteMutation.mutate(selectedDocuments)
      }
    }
  }

  // Compute breadcrumb path
  const getBreadcrumbPath = (folderId: string | null): FolderResponse[] => {
    if (!folderId) return []

    const path: FolderResponse[] = []
    let currentFolderId: string | null = folderId

    while (currentFolderId) {
      const folder = folders.find((f) => f.id === currentFolderId)
      if (!folder) break
      path.unshift(folder)
      currentFolderId = folder.parent_folder_id
    }

    return path
  }

  const breadcrumbPath = getBreadcrumbPath(selectedFolderId)

  const isLoading = isLoadingFolders || isLoadingDocuments
  const hasError = foldersError || documentsError

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FolderOpen className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-semibold text-gray-900">Document Room</h1>
          </div>
          <div className="flex items-center gap-3">
            {selectedDocuments.length > 0 && (
              <span className="text-sm font-medium text-gray-600">
                {selectedDocuments.length} selected
              </span>
            )}
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        {breadcrumbPath.length > 0 && (
          <nav aria-label="Breadcrumb" className="mt-3 flex items-center gap-2 text-sm">
            <button
              onClick={() => handleFolderSelect(null)}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              All Folders
            </button>
            {breadcrumbPath.map((folder, index) => (
              <React.Fragment key={folder.id}>
                <span className="text-gray-400">/</span>
                <button
                  onClick={() => handleFolderSelect(folder.id)}
                  className={
                    index === breadcrumbPath.length - 1
                      ? 'font-medium text-gray-900'
                      : 'text-blue-600 hover:text-blue-800 hover:underline'
                  }
                >
                  {folder.name}
                </button>
              </React.Fragment>
            ))}
          </nav>
        )}
      </div>

      {/* Error States */}
      {hasError && (
        <div className="flex items-center gap-3 bg-red-50 px-6 py-4 text-red-800">
          <AlertCircle className="h-5 w-5" />
          <p>
            {foldersError && 'Failed to load folders. '}
            {documentsError && 'Failed to load documents. '}
            Please try again later.
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !hasError && (
        <div className="flex flex-1 items-center justify-center" role="status">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm text-gray-600">Loading documents...</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!isLoading && !hasError && (
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Folder Tree */}
          <aside className="w-64 border-r border-gray-200 bg-white p-4">
            {folders.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <FolderOpen className="h-12 w-12 text-gray-300" />
                <p className="text-sm text-gray-500">No folders yet</p>
              </div>
            ) : (
              <FolderTree
                dealId={dealId}
                folders={folders}
                selectedFolderId={selectedFolderId}
                onFolderSelect={handleFolderSelect}
              />
            )}
          </aside>

          {/* Main Content Area */}
          <main className="flex flex-1 flex-col overflow-hidden">
            {/* Upload Panel */}
            <div className="border-b border-gray-200 bg-gray-50 p-4">
              <UploadPanel onUpload={handleUpload} />
            </div>

            {/* Bulk Actions Toolbar */}
            {selectedDocuments.length > 0 && (
              <BulkActionsToolbar
                selectedCount={selectedDocuments.length}
                onDownload={handleBulkDownload}
                onDelete={handleBulkDelete}
                isDownloading={bulkDownloadMutation.isPending}
                isDeleting={bulkDeleteMutation.isPending}
              />
            )}

            {/* Document List */}
            <div className="flex-1 overflow-auto">
              {documentsData && documentsData.items.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-16 text-center">
                  <FileText className="h-16 w-16 text-gray-300" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">No documents yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Upload your first document using the panel above
                    </p>
                  </div>
                </div>
              ) : (
                <DocumentList
                  documents={documentsData?.items || []}
                  selectedDocuments={selectedDocuments}
                  onSelectionChange={handleDocumentSelect}
                />
              )}
            </div>

            {/* Pagination Info */}
            {documentsData && documentsData.total > 0 && (
              <div className="border-t border-gray-200 bg-white px-6 py-3 text-sm text-gray-600">
                Showing {documentsData.items.length} of {documentsData.total} documents
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  )
}
