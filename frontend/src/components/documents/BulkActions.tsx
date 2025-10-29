/**
 * BulkActions Component (DEV-008 Phase 4)
 * Bulk operations for selected documents (download ZIP, delete)
 */

import React, { useState } from 'react';
import { Document, bulkDownloadDocuments, bulkDeleteDocuments } from '../../services/api/documents';

interface BulkActionsProps {
  dealId: string;
  selectedDocuments: Document[];
  onClearSelection: () => void;
  onRefresh: () => void;
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  dealId,
  selectedDocuments,
  onClearSelection,
  onRefresh,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (selectedDocuments.length === 0) {
    return null;
  }

  const handleDownload = async () => {
    try {
      setDownloading(true);
      setError(null);

      const documentIds = selectedDocuments.map((doc) => doc.id);
      const blobUrl = await bulkDownloadDocuments(dealId, documentIds);

      // Trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `documents_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download documents');
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedDocuments.length} documents? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError(null);

      const documentIds = selectedDocuments.map((doc) => doc.id);
      const result = await bulkDeleteDocuments(dealId, documentIds);

      if (result.failed_ids.length > 0) {
        const failedNames = selectedDocuments
          .filter((doc) => result.failed_ids.includes(doc.id))
          .map((doc) => `${doc.name}: ${result.failed_reasons[doc.id]}`)
          .join(', ');
        setError(`${result.failed_ids.length} documents failed to delete: ${failedNames}`);
      }

      onRefresh();
      onClearSelection();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete documents');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#1f2937',
        color: 'white',
        padding: '1rem 2rem',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        zIndex: 1000,
      }}
    >
      <span style={{ fontWeight: 600 }}>
        {selectedDocuments.length} documents selected
      </span>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={handleDownload}
          disabled={downloading || deleting}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: downloading ? '#6b7280' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: downloading || deleting ? 'not-allowed' : 'pointer',
            fontWeight: 500,
          }}
        >
          {downloading ? 'Downloading...' : '⬇️ Download ZIP'}
        </button>

        <button
          onClick={handleDelete}
          disabled={downloading || deleting}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: deleting ? '#6b7280' : '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: downloading || deleting ? 'not-allowed' : 'pointer',
            fontWeight: 500,
          }}
        >
          {deleting ? 'Deleting...' : '🗑️ Delete'}
        </button>

        <button
          onClick={onClearSelection}
          disabled={downloading || deleting}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#4b5563',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: downloading || deleting ? 'not-allowed' : 'pointer',
            fontWeight: 500,
          }}
        >
          ✕ Clear
        </button>
      </div>

      {error && (
        <div
          style={{
            position: 'absolute',
            top: '-3.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            padding: '0.75rem 1rem',
            borderRadius: '0.375rem',
            whiteSpace: 'nowrap',
            maxWidth: '600px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};
