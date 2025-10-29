/**
 * Data Room Component
 *
 * Secure document management UI for M&A deal data rooms.
 * Features: upload, list, download, archive documents with pagination.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Document,
  Folder,
  uploadDocument,
  listDocuments,
  listFolders,
  createFolder,
  downloadDocument,
  archiveDocument,
  formatFileSize,
  getFileIcon,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
} from '../../services/api/documents'
import { BulkActions } from '../../components/documents/BulkActions'

export const DataRoom: React.FC = () => {
  const { dealId } = useParams<{ dealId: string }>()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [documents, setDocuments] = useState<Document[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [isCreateFolderVisible, setIsCreateFolderVisible] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 20,
    total: 0,
    pages: 1,
  })
  const [loading, setLoading] = useState(true)
  const [loadingFolders, setLoadingFolders] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([])
  const [entitlementGate, setEntitlementGate] = useState<{
    message: string
    requiredTierLabel?: string
    upgradeUrl?: string
  } | null>(null)

  const flattenedFolders = useMemo(() => folders, [folders])

  useEffect(() => {
    if (!dealId) return

    ;(async () => {
      try {
        setLoadingFolders(true)
        const data = await listFolders(dealId)
        setFolders(data)
      } catch (err) {
        console.error('Failed to load folders:', err)
      } finally {
        setLoadingFolders(false)
      }
    })()
  }, [dealId])

  useEffect(() => {
    if (!dealId) return

    ;(async () => {
      await fetchDocuments()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealId, pagination.page, selectedFolderId])

  const fetchDocuments = async () => {
    if (!dealId) return

    try {
      setLoading(true)
      setError(null)
      setEntitlementGate(null)

      const data = await listDocuments(dealId, {
        page: pagination.page,
        per_page: pagination.per_page,
        include_archived: false,
        search: searchQuery || undefined,
        folder_id: selectedFolderId || undefined,
      })

      setDocuments(data.items)
      setPagination({
        page: data.page,
        per_page: data.per_page,
        total: data.total,
        pages: data.pages,
      })
      setSelectedDocuments((prev) =>
        prev.filter((selected) => data.items.some((doc) => doc.id === selected.id))
      )
    } catch (err) {
      const status = (err as any)?.status ?? (err as any)?.response?.status
      if (status === 403) {
        const detail = (err as any)?.data?.detail ?? (err as any)?.response?.data?.detail ?? {}
        setEntitlementGate({
          message: detail.message ?? 'This data room is available to Growth tier and above.',
          requiredTierLabel: detail.required_tier_label,
          upgradeUrl: detail.upgrade_cta_url,
        })
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load documents')
      }
    } finally {
      setLoading(false)
    }
  }

  const clearSelection = () => setSelectedDocuments([])

  const toggleDocumentSelection = (document: Document) => {
    setSelectedDocuments((prev) => {
      const exists = prev.some((item) => item.id === document.id)
      if (exists) {
        return prev.filter((item) => item.id !== document.id)
      }
      return [...prev, document]
    })
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !dealId) return

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError(`File type ${file.type} is not allowed. Please upload PDF, Office documents, or images.`)
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(`File size exceeds ${formatFileSize(MAX_FILE_SIZE)} limit. Please upload a smaller file.`)
      return
    }

    try {
      setUploading(true)
      setUploadProgress(`Uploading ${file.name}...`)
      setError(null)

      await uploadDocument(dealId, file, { folderId: selectedFolderId || undefined })
      await fetchDocuments()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload document')
    } finally {
      setUploadProgress(null)
      setUploading(false)
      event.target.value = ''
    }
  }

  const handleDownload = async (documentId: string) => {
    if (!dealId) return

    try {
      const blobUrl = await downloadDocument(dealId, documentId)
      window.open(blobUrl, '_blank')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download document')
    }
  }

  const handleArchive = async (documentId: string, documentName: string) => {
    if (!dealId) return

    const confirmed = window.confirm(
      `Are you sure you want to archive "${documentName}"? You can restore it later.`
    )
    if (!confirmed) return

    try {
      setError(null)
      await archiveDocument(dealId, documentId)
      await fetchDocuments()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to archive document')
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dealId) return

    setPagination((prev) => ({ ...prev, page: 1 }))
    await fetchDocuments()
  }

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dealId || !newFolderName.trim()) return

    try {
      await createFolder(dealId, {
        name: newFolderName.trim(),
        parent_folder_id: selectedFolderId,
      })
      setNewFolderName('')
      setIsCreateFolderVisible(false)
      const data = await listFolders(dealId)
      setFolders(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create folder')
    }
  }

  const handleFolderClick = (folderId: string) => {
    setSelectedFolderId(folderId)
    clearSelection()
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handleShowAllDocuments = () => {
    setSelectedFolderId(null)
    clearSelection()
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  if (!dealId) {
    return (
      <section data-testid="data-room">
        <p>Error: Deal ID not found</p>
      </section>
    )
  }

  if (entitlementGate) {
    const requiredTier = entitlementGate.requiredTierLabel || 'Growth'
    return (
      <section
        data-testid="data-room-entitlement"
        style={{ padding: '4rem 2rem', display: 'flex', justifyContent: 'center' }}
      >
        <div
          style={{
            maxWidth: '560px',
            width: '100%',
            backgroundColor: '#f8fafc',
            border: '1px solid #cbd5f5',
            borderRadius: '0.75rem',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#1e293b' }}>
            Access Restricted
          </h2>
          <p style={{ color: '#475569', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            {entitlementGate.message || `This data room is available to ${requiredTier} tier and above.`}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            {entitlementGate.upgradeUrl && (
              <a
                href={entitlementGate.upgradeUrl}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                View Pricing Plans
              </a>
            )}
            <button
              type="button"
              onClick={() => navigate('/billing/upgrade')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section data-testid="data-room" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}
      >
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>📂 Data Room</h1>
        <button
          onClick={() => navigate(`/deals/${dealId}`)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
          }}
        >
          ← Back to Deal
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }}>
        <aside
          style={{
            padding: '1.5rem',
            backgroundColor: '#f9fafb',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Folders</h2>
            <button
              type="button"
              onClick={() => setIsCreateFolderVisible((visible) => !visible)}
              style={{
                padding: '0.35rem 0.75rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              + New Folder
            </button>
          </div>

          {isCreateFolderVisible && (
            <form onSubmit={handleCreateFolder} style={{ display: 'grid', gap: '0.5rem' }}>
              <input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name"
                style={{
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                }}
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                  }}
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateFolderVisible(false)
                    setNewFolderName('')
                  }}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    backgroundColor: '#e5e7eb',
                    color: '#1f2937',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={handleShowAllDocuments}
              style={{
                textAlign: 'left',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: selectedFolderId === null ? '#e0f2fe' : 'transparent',
                color: selectedFolderId === null ? '#0f172a' : '#334155',
                fontWeight: selectedFolderId === null ? 600 : 500,
              }}
            >
              All Documents
            </button>

            {loadingFolders && <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Loading folders...</p>}

            {!loadingFolders && flattenedFolders.length === 0 && (
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>No folders yet.</p>
            )}

            {!loadingFolders &&
              flattenedFolders.map((folder) => (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => handleFolderClick(folder.id)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.375rem',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: selectedFolderId === folder.id ? '#e0f2fe' : 'transparent',
                    color: selectedFolderId === folder.id ? '#0f172a' : '#334155',
                    fontWeight: selectedFolderId === folder.id ? 600 : 500,
                  }}
                >
                  <span>{folder.name}</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{folder.document_count ?? 0}</span>
                </button>
              ))}
          </nav>
        </aside>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#f9fafb',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb',
              padding: '1.5rem',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <p style={{ fontWeight: 600, color: '#0f172a' }}>Upload documents</p>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Allowed: PDF, Word, Excel, PowerPoint, Images | Max size: {formatFileSize(MAX_FILE_SIZE)}
              </p>
              {uploadProgress && (
                <span style={{ color: '#3b82f6', fontSize: '0.875rem' }}>{uploadProgress}</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{
                  padding: '0.75rem 1.25rem',
                  backgroundColor: uploading ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  fontWeight: 500,
                }}
              >
                {uploading ? '⏳ Uploading...' : '📤 Upload Document'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                disabled={uploading}
                style={{ display: 'none' }}
                accept={ALLOWED_FILE_TYPES.join(',')}
              />
            </div>
          </div>

          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              style={{
                flex: 1,
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
              }}
            >
              🔍 Search
            </button>
          </form>

          {error && (
            <div
              style={{
                padding: '1rem',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                borderRadius: '0.375rem',
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {loading && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Loading documents...</p>
            </div>
          )}

          {!loading && documents.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
              <p style={{ fontSize: '1.125rem' }}>📭 No documents yet</p>
              <p style={{ marginTop: '0.5rem' }}>Upload your first document to get started</p>
            </div>
          )}

          {!loading && documents.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {documents.map((doc) => (
            <div
              key={doc.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                backgroundColor: selectedDocuments.some((item) => item.id === doc.id) ? '#eef2ff' : 'white',
                border: selectedDocuments.some((item) => item.id === doc.id) ? '1px solid #6366f1' : '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                gap: '1rem',
              }}
            >
              <input
                type="checkbox"
                checked={selectedDocuments.some((item) => item.id === doc.id)}
                onChange={() => toggleDocumentSelection(doc)}
                aria-label={`Select ${doc.name}`}
                style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '2rem' }}>{getFileIcon(doc.file_type)}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{doc.name}</p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {formatFileSize(doc.file_size)} • Version {doc.version} •{' '}
                      {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => handleDownload(doc.id)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                      }}
                      title="Download document"
                    >
                      ⬇️ Download
                    </button>
                    <button
                      type="button"
                      onClick={() => handleArchive(doc.id, doc.name)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                      }}
                      title="Archive document"
                    >
                      🗑️ Archive
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {pagination.pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: pagination.page === 1 ? '#e5e7eb' : '#3b82f6',
                  color: pagination.page === 1 ? '#9ca3af' : 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: pagination.page === 1 ? 'not-allowed' : 'pointer',
                }}
              >
                ← Previous
              </button>
              <span style={{ color: '#6b7280' }}>
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                type="button"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: pagination.page === pagination.pages ? '#e5e7eb' : '#3b82f6',
                  color: pagination.page === pagination.pages ? '#9ca3af' : 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: pagination.page === pagination.pages ? 'not-allowed' : 'pointer',
                }}
              >
                Next →
              </button>
            </div>
          )}

          {!loading && documents.length > 0 && (
            <p style={{ textAlign: 'center', marginTop: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
              Showing {documents.length} of {pagination.total} documents
            </p>
          )}
        </div>
      </div>
      <BulkActions
        dealId={dealId}
        selectedDocuments={selectedDocuments}
        onClearSelection={clearSelection}
        onRefresh={fetchDocuments}
      />
    </section>
  )
}
