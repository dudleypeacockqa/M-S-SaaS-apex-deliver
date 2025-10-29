/**
 * BulkActions Component Tests (DEV-008 Phase 4)
 * TDD RED phase: Bulk document operations
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BulkActions } from './BulkActions';
import * as documentsAPI from '../../services/api/documents';

// Mock the documents API
vi.mock('../../services/api/documents', () => ({
  bulkDownloadDocuments: vi.fn(),
  bulkDeleteDocuments: vi.fn(),
}));

describe('BulkActions Component', () => {
  const mockSelectedDocuments = [
    {
      id: 'doc-1',
      name: 'Financial Report.pdf',
      file_size: 1024000,
      file_type: 'application/pdf',
      deal_id: 'deal-123',
      folder_id: null,
      organization_id: 'org-1',
      uploaded_by: 'user-1',
      version: 1,
      created_at: '2025-01-01T10:00:00Z',
      updated_at: null,
    },
    {
      id: 'doc-2',
      name: 'Legal Contract.docx',
      file_size: 512000,
      file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      deal_id: 'deal-123',
      folder_id: null,
      organization_id: 'org-1',
      uploaded_by: 'user-1',
      version: 1,
      created_at: '2025-01-01T11:00:00Z',
      updated_at: null,
    },
  ];

  const mockOnClearSelection = vi.fn();
  const mockOnRefresh = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering and Visibility', () => {
    it('should not render when no documents selected', () => {
      const { container } = render(
        <BulkActions
          dealId="deal-123"
          selectedDocuments={[]}
          onClearSelection={mockOnClearSelection}
          onRefresh={mockOnRefresh}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should render action bar when documents selected', () => {
      render(
        <BulkActions
          dealId="deal-123"
          selectedDocuments={mockSelectedDocuments}
          onClearSelection={mockOnClearSelection}
          onRefresh={mockOnRefresh}
        />
      );

      expect(screen.getByText(/2 documents selected/i)).toBeInTheDocument();
    });

    it('should display bulk download button', () => {
      render(
        <BulkActions
          dealId="deal-123"
          selectedDocuments={mockSelectedDocuments}
          onClearSelection={mockOnClearSelection}
          onRefresh={mockOnRefresh}
        />
      );

      expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
    });

    it('should display bulk delete button', () => {
      render(
        <BulkActions
          dealId="deal-123"
          selectedDocuments={mockSelectedDocuments}
          onClearSelection={mockOnClearSelection}
          onRefresh={mockOnRefresh}
        />
      );

      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    it('should display clear selection button', () => {
      render(
        <BulkActions
          dealId="deal-123"
          selectedDocuments={mockSelectedDocuments}
          onClearSelection={mockOnClearSelection}
          onRefresh={mockOnRefresh}
        />
      );

      expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
    });
  });

  describe('Bulk Download', () => {
    it('should call bulkDownloadDocuments API when download clicked', async () => {
      const mockBlobUrl = 'blob:http://localhost/fake-blob-url';
      (documentsAPI.bulkDownloadDocuments as any).mockResolvedValue(mockBlobUrl);

      global.URL.createObjectURL = vi.fn(() => mockBlobUrl);
      global.URL.revokeObjectURL = vi.fn();

      const mockLink = document.createElement('a');
      mockLink.click = vi.fn();
      mockLink.remove = vi.fn();
      vi.spyOn(document, 'createElement').mockReturnValue(mockLink);
      vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink);
      vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink);

      render(
        <BulkActions
          dealId="deal-123"
          selectedDocuments={mockSelectedDocuments}
          onClearSelection={mockOnClearSelection}
          onRefresh={mockOnRefresh}
        />
      );

      const downloadButton = screen.getByRole('button', { name: /download/i });
      fireEvent.click(downloadButton);

      await waitFor(() => {
        expect(documentsAPI.bulkDownloadDocuments).toHaveBeenCalledWith('deal-123', ['doc-1', 'doc-2']);
      });
    });

    it('should show loading state during download', async () => {
      (documentsAPI.bulkDownloadDocuments as any).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );

      render(
        <BulkActions
          dealId="deal-123"
          selectedDocuments={mockSelectedDocuments}
          onClearSelection={mockOnClearSelection}
          onRefresh={mockOnRefresh}
        />
      );

      const downloadButton = screen.getByRole('button', { name: /download/i });
      fireEvent.click(downloadButton);

      await waitFor(() => {
        expect(screen.getByText(/downloading/i)).toBeInTheDocument();
      });
    });

    it('should handle download errors gracefully', async () => {
      (documentsAPI.bulkDownloadDocuments as any).mockRejectedValue(new Error('Download failed'));

      render(
        <BulkActions
          dealId="deal-123"
          selectedDocuments={mockSelectedDocuments}
          onClearSelection={mockOnClearSelection}
          onRefresh={mockOnRefresh}
        />
      );

      const downloadButton = screen.getByRole('button', { name: /download/i });
      fireEvent.click(downloadButton);

      await waitFor(() => {
        expect(screen.getByText(/failed to download/i)).toBeInTheDocument();
      });
    });
  });

  describe('Bulk Delete', () => {
    it('should show confirmation dialog before delete', () => {
      global.confirm = vi.fn(() => false);

      render(
        <BulkActions
          dealId="deal-123"
          selectedDocuments={mockSelectedDocuments}
          onClearSelection={mockOnClearSelection}
          onRefresh={mockOnRefresh}
        />
      );

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      expect(global.confirm).toHaveBeenCalledWith(
        expect.stringContaining('2 documents')
      );
    });

    it('should call bulkDeleteDocuments API when confirmed', async () => {
      global.confirm = vi.fn(() => true);
      (documentsAPI.bulkDeleteDocuments as any).mockResolvedValue({
        deleted_count: 2,
        deleted_ids: ['doc-1', 'doc-2'],
        failed_ids: [],
        failed_reasons: {},
      });

      render(
        <BulkActions
          dealId="deal-123"
          selectedDocuments={mockSelectedDocuments}
          onClearSelection={mockOnClearSelection}
          onRefresh={mockOnRefresh}
        />
      );

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(documentsAPI.bulkDeleteDocuments).toHaveBeenCalledWith('deal-123', ['doc-1', 'doc-2']);
      });
    });

    it('should call onRefresh after successful delete', async () => {
      global.confirm = vi.fn(() => true);
      (documentsAPI.bulkDeleteDocuments as any).mockResolvedValue({
        deleted_count: 2,
        deleted_ids: ['doc-1', 'doc-2'],
        failed_ids: [],
        failed_reasons: {},
      });

      render(
        <BulkActions
          dealId="deal-123"
          selectedDocuments={mockSelectedDocuments}
          onClearSelection={mockOnClearSelection}
          onRefresh={mockOnRefresh}
        />
      );

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(mockOnRefresh).toHaveBeenCalled();
      });
    });

    it('should call onClearSelection after successful delete', async () => {
      global.confirm = vi.fn(() => true);
      (documentsAPI.bulkDeleteDocuments as any).mockResolvedValue({
        deleted_count: 2,
        deleted_ids: ['doc-1', 'doc-2'],
        failed_ids: [],
        failed_reasons: {},
      });

      render(
        <BulkActions
          dealId="deal-123"
          selectedDocuments={mockSelectedDocuments}
          onClearSelection={mockOnClearSelection}
          onRefresh={mockOnRefresh}
        />
      );

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(mockOnClearSelection).toHaveBeenCalled();
      });
    });

    it('should handle partial delete failures', async () => {
      global.confirm = vi.fn(() => true);
      (documentsAPI.bulkDeleteDocuments as any).mockResolvedValue({
        deleted_count: 1,
        deleted_ids: ['doc-1'],
        failed_ids: ['doc-2'],
        failed_reasons: {
          'doc-2': 'Permission denied',
        },
      });

      render(
        <BulkActions
          dealId="deal-123"
          selectedDocuments={mockSelectedDocuments}
          onClearSelection={mockOnClearSelection}
          onRefresh={mockOnRefresh}
        />
      );

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByText(/1.*failed/i)).toBeInTheDocument();
      });
    });

    it('should not call API if user cancels confirmation', () => {
      global.confirm = vi.fn(() => false);

      render(
        <BulkActions
          dealId="deal-123"
          selectedDocuments={mockSelectedDocuments}
          onClearSelection={mockOnClearSelection}
          onRefresh={mockOnRefresh}
        />
      );

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      expect(documentsAPI.bulkDeleteDocuments).not.toHaveBeenCalled();
    });
  });

  describe('Clear Selection', () => {
    it('should call onClearSelection when clear button clicked', () => {
      render(
        <BulkActions
          dealId="deal-123"
          selectedDocuments={mockSelectedDocuments}
          onClearSelection={mockOnClearSelection}
          onRefresh={mockOnRefresh}
        />
      );

      const clearButton = screen.getByRole('button', { name: /clear/i });
      fireEvent.click(clearButton);

      expect(mockOnClearSelection).toHaveBeenCalled();
    });
  });
});
