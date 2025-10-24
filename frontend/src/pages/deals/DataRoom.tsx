/**
 * Data Room Component
 *
 * Secure document management UI for M&A deal data rooms.
 * Features: upload, list, download, archive documents with pagination.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
} from '../../services/api/documents';

export const DataRoom: React.FC = () => {
  const { dealId } = useParams<{ dealId: string }>();
  const navigate = useNavigate();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 20,
    total: 0,
    pages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch folders on mount
  useEffect(() => {
    if (dealId) {
      fetchFolders();
    }
  }, [dealId]);

  // Fetch documents on mount and when page/folder changes
  useEffect(() => {
    if (dealId) {
      fetchDocuments();
    }
  }, [dealId, pagination.page, selectedFolderId]);

  const fetchFolders = async () => {
    if (!dealId) return;

    try {
      const data = await listFolders(dealId);
      setFolders(data);
    } catch (err) {
      console.error('Failed to load folders:', err);
    }
  };

  const fetchDocuments = async () => {
    if (!dealId) return;

    try {
      setLoading(true);
      setError(null);

      const data = await listDocuments(dealId, {
        page: pagination.page,
        per_page: pagination.per_page,
        include_archived: false,
        search: searchQuery || undefined,
        folder_id: selectedFolderId || undefined,
      });

      setDocuments(data.items);
      setPagination({
        page: data.page,
        per_page: data.per_page,
        total: data.total,
        pages: data.pages,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !dealId) return;

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError(`File type ${file.type} is not allowed. Please upload PDF, Office documents, or images.`);
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size exceeds ${formatFileSize(MAX_FILE_SIZE)} limit. Please upload a smaller file.`);
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(`Uploading ${file.name}...`);
      setError(null);

      await uploadDocument(dealId, file);
      await fetchDocuments();

      setUploadProgress(null);
      // Reset file input
      event.target.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload document');
      setUploadProgress(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (documentId: string) => {
    if (!dealId) return;

    try {
      await downloadDocument(dealId, documentId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download document');
    }
  };

  const handleArchive = async (documentId: string, documentName: string) => {
    if (!dealId) return;

    const confirmed = window.confirm(
      `Are you sure you want to archive "${documentName}"? You can restore it later.`
    );
    if (!confirmed) return;

    try {
      setError(null);
      await archiveDocument(dealId, documentId);
      await fetchDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to archive document');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    fetchDocuments();
  };

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleCreateFolder = async () => {
    if (!dealId || !newFolderName.trim()) return;

    try {
      await createFolder(dealId, newFolderName.trim());
      setNewFolderName('');
      setShowFolderModal(false);
      await fetchFolders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create folder');
    }
  };

  const handleFolderClick = (folderId: string) => {
    setSelectedFolderId(folderId);
    setPagination({ ...pagination, page: 1 }); // Reset to first page
  };

  const handleShowAllDocuments = () => {
    setSelectedFolderId(null);
    setPagination({ ...pagination, page: 1 });
  };

  if (!dealId) {
    return (
      <section data-testid="data-room">
        <p>Error: Deal ID not found</p>
      </section>
    );
  }

  return (
    <section data-testid="data-room" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
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

      {/* Two-column layout: Folders sidebar + Documents */}
      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Folder Sidebar */}
        <aside style={{ width: '250px', flexShrink: 0 }}>
          <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Folders</h2>
              <button
                onClick={() => setShowFolderModal(true)}
                style={{
                  padding: '0.25rem 0.5rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                + New Folder
              </button>
            </div>

            {/* All Documents button */}
            <button
              onClick={handleShowAllDocuments}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '0.5rem',
                marginBottom: '0.5rem',
                backgroundColor: !selectedFolderId ? '#3b82f6' : 'white',
                color: !selectedFolderId ? 'white' : '#1f2937',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer',
              }}
            >
              All Documents
            </button>

            {/* Folder List */}
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => handleFolderClick(folder.id)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.5rem',
                  marginBottom: '0.25rem',
                  backgroundColor: selectedFolderId === folder.id ? '#3b82f6' : 'white',
                  color: selectedFolderId === folder.id ? 'white' : '#1f2937',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                }}
              >
                {folder.name}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1 }}>
      {/* Upload Section */}
      <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
        <button
          onClick={() => document.getElementById('file-upload')?.click()}
          disabled={uploading}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: uploading ? '#9ca3af' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: uploading ? 'not-allowed' : 'pointer',
            fontWeight: '500',
          }}
        >
          {uploading ? 'Uploading...' : 'Upload Document'}
        </button>
        <input
          id="file-upload"
          type="file"
          onChange={handleFileUpload}
          disabled={uploading}
          style={{ display: 'none' }}
          accept={ALLOWED_FILE_TYPES.join(',')}
        />
        {uploadProgress && (
          <p style={{ marginTop: '0.5rem', color: '#3b82f6', fontSize: '0.875rem' }}>{uploadProgress}</p>
        )}
        <p style={{ marginTop: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
          Allowed: PDF, Word, Excel, PowerPoint, Images | Max size: {formatFileSize(MAX_FILE_SIZE)}
        </p>
      </div>

      {/* Search Section */}
      <form onSubmit={handleSearch} style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem' }}>
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

      {/* Error Message */}
      {error && (
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            borderRadius: '0.375rem',
            marginBottom: '1rem',
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading documents...</p>
        </div>
      )}

      {/* Document List */}
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
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                gap: '1rem',
              }}
            >
              {/* File Icon */}
              <span style={{ fontSize: '2rem' }}>{getFileIcon(doc.file_type)}</span>

              {/* Document Info */}
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{doc.name}</p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {formatFileSize(doc.file_size)} • Version {doc.version} •{' '}
                  {new Date(doc.created_at).toLocaleDateString()}
                </p>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
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

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            marginTop: '2rem',
          }}
        >
          <button
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

      {/* Document Count */}
      {!loading && documents.length > 0 && (
        <p style={{ textAlign: 'center', marginTop: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
          Showing {documents.length} of {pagination.total} documents
        </p>
      )}
        </main>
      </div>

      {/* Folder Creation Modal */}
      {showFolderModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowFolderModal(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '0.5rem',
              maxWidth: '400px',
              width: '100%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Create New Folder</h3>
            <input
              type="text"
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleCreateFolder();
                }
              }}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                marginBottom: '1rem',
              }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowFolderModal(false);
                  setNewFolderName('');
                }}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: newFolderName.trim() ? '#3b82f6' : '#9ca3af',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: newFolderName.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
