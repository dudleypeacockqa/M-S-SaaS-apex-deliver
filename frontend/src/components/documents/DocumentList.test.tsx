/**
 * DocumentList Component Tests
 * TDD RED phase - Write failing tests first
 * Sprint 1.1.1 - DEV-008 Secure Document & Data Room
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DocumentList } from './DocumentList';

// Mock document API
vi.mock('../../services/api/documents', () => ({
  listDocuments: vi.fn(),
  downloadDocument: vi.fn(),
  deleteDocument: vi.fn(),
}));

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe('DocumentList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render document list with file details', async () => {
    const { listDocuments } = await import('../../services/api/documents');
    vi.mocked(listDocuments).mockResolvedValue([
      {
        id: 'doc-1',
        name: 'Financial_Statement_Q4.pdf',
        size: 2048000,
        version: 1,
        uploaded_by: 'John Doe',
        created_at: '2025-01-15T10:30:00Z',
        folder_id: 'folder-1',
      },
      {
        id: 'doc-2',
        name: 'NDA_Template.docx',
        size: 512000,
        version: 3,
        uploaded_by: 'Jane Smith',
        created_at: '2025-01-10T14:20:00Z',
        folder_id: 'folder-1',
      },
    ]);

    renderWithProviders(
      <DocumentList
        dealId="deal-1"
        folderId="folder-1"
        onSelectionChange={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Financial_Statement_Q4.pdf')).toBeInTheDocument();
      expect(screen.getByText('NDA_Template.docx')).toBeInTheDocument();
      expect(screen.getByText('2.0 MB')).toBeInTheDocument();
      expect(screen.getByText('v3')).toBeInTheDocument();
    });
  });

  it('should show empty state when no documents', async () => {
    const { listDocuments } = await import('../../services/api/documents');
    vi.mocked(listDocuments).mockResolvedValue([]);

    renderWithProviders(
      <DocumentList
        dealId="deal-1"
        folderId={null}
        onSelectionChange={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/no documents found/i)).toBeInTheDocument();
    });
  });

  it('should sort documents by name', async () => {
    const { listDocuments } = await import('../../services/api/documents');
    vi.mocked(listDocuments).mockResolvedValue([
      { id: 'doc-1', name: 'Zebra.pdf', size: 1024, version: 1, created_at: '2025-01-01', folder_id: null },
      { id: 'doc-2', name: 'Alpha.pdf', size: 1024, version: 1, created_at: '2025-01-02', folder_id: null },
    ]);

    renderWithProviders(
      <DocumentList
        dealId="deal-1"
        folderId={null}
        onSelectionChange={vi.fn()}
      />
    );

    // Click sort by name header
    const nameHeader = await screen.findByRole('button', { name: /sort by name/i });
    fireEvent.click(nameHeader);

    await waitFor(() => {
      const documentNames = screen.getAllByRole('cell', { name: /\.pdf/i });
      expect(documentNames[0]).toHaveTextContent('Alpha.pdf');
      expect(documentNames[1]).toHaveTextContent('Zebra.pdf');
    });
  });

  it('should sort documents by date', async () => {
    const { listDocuments } = await import('../../services/api/documents');
    vi.mocked(listDocuments).mockResolvedValue([
      { id: 'doc-1', name: 'Old.pdf', size: 1024, version: 1, created_at: '2025-01-01T10:00:00Z', folder_id: null },
      { id: 'doc-2', name: 'New.pdf', size: 1024, version: 1, created_at: '2025-01-15T10:00:00Z', folder_id: null },
    ]);

    renderWithProviders(
      <DocumentList
        dealId="deal-1"
        folderId={null}
        onSelectionChange={vi.fn()}
      />
    );

    // Click sort by date header
    const dateHeader = await screen.findByRole('button', { name: /sort by date/i });
    fireEvent.click(dateHeader);

    await waitFor(() => {
      const documentNames = screen.getAllByRole('cell', { name: /\.pdf/i });
      expect(documentNames[0]).toHaveTextContent('New.pdf');
      expect(documentNames[1]).toHaveTextContent('Old.pdf');
    });
  });

  it('should filter documents by search query', async () => {
    const { listDocuments } = await import('../../services/api/documents');
    vi.mocked(listDocuments).mockResolvedValue([
      { id: 'doc-1', name: 'Financial_Report.pdf', size: 1024, version: 1, created_at: '2025-01-01', folder_id: null },
      { id: 'doc-2', name: 'Legal_Contract.pdf', size: 1024, version: 1, created_at: '2025-01-02', folder_id: null },
    ]);

    renderWithProviders(
      <DocumentList
        dealId="deal-1"
        folderId={null}
        onSelectionChange={vi.fn()}
      />
    );

    const searchInput = await screen.findByPlaceholderText(/search documents/i);
    fireEvent.change(searchInput, { target: { value: 'Financial' } });

    await waitFor(() => {
      expect(screen.getByText('Financial_Report.pdf')).toBeInTheDocument();
      expect(screen.queryByText('Legal_Contract.pdf')).not.toBeInTheDocument();
    });
  });

  it('should select single document with checkbox', async () => {
    const { listDocuments } = await import('../../services/api/documents');
    vi.mocked(listDocuments).mockResolvedValue([
      { id: 'doc-1', name: 'Document.pdf', size: 1024, version: 1, created_at: '2025-01-01', folder_id: null },
    ]);

    const onSelectionChange = vi.fn();

    renderWithProviders(
      <DocumentList
        dealId="deal-1"
        folderId={null}
        onSelectionChange={onSelectionChange}
      />
    );

    const checkbox = await screen.findByRole('checkbox', { name: /select document\.pdf/i });
    fireEvent.click(checkbox);

    expect(onSelectionChange).toHaveBeenCalledWith(['doc-1']);
  });

  it('should select all documents with header checkbox', async () => {
    const { listDocuments } = await import('../../services/api/documents');
    vi.mocked(listDocuments).mockResolvedValue([
      { id: 'doc-1', name: 'Doc1.pdf', size: 1024, version: 1, created_at: '2025-01-01', folder_id: null },
      { id: 'doc-2', name: 'Doc2.pdf', size: 1024, version: 1, created_at: '2025-01-02', folder_id: null },
    ]);

    const onSelectionChange = vi.fn();

    renderWithProviders(
      <DocumentList
        dealId="deal-1"
        folderId={null}
        onSelectionChange={onSelectionChange}
      />
    );

    const selectAllCheckbox = await screen.findByRole('checkbox', { name: /select all/i });
    fireEvent.click(selectAllCheckbox);

    expect(onSelectionChange).toHaveBeenCalledWith(['doc-1', 'doc-2']);
  });

  it('should show download button for each document', async () => {
    const { listDocuments } = await import('../../services/api/documents');
    vi.mocked(listDocuments).mockResolvedValue([
      { id: 'doc-1', name: 'Report.pdf', size: 1024, version: 1, created_at: '2025-01-01', folder_id: null },
    ]);

    renderWithProviders(
      <DocumentList
        dealId="deal-1"
        folderId={null}
        onSelectionChange={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /download report\.pdf/i })).toBeInTheDocument();
    });
  });

  it('should call download API when download button clicked', async () => {
    const { listDocuments, downloadDocument } = await import('../../services/api/documents');
    vi.mocked(listDocuments).mockResolvedValue([
      { id: 'doc-1', name: 'Contract.pdf', size: 1024, version: 1, created_at: '2025-01-01', folder_id: null },
    ]);
    vi.mocked(downloadDocument).mockResolvedValue('https://example.com/download-url');

    renderWithProviders(
      <DocumentList
        dealId="deal-1"
        folderId={null}
        onSelectionChange={vi.fn()}
      />
    );

    const downloadButton = await screen.findByRole('button', { name: /download contract\.pdf/i });
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(downloadDocument).toHaveBeenCalledWith('doc-1');
    });
  });

  it('should show delete button for each document', async () => {
    const { listDocuments } = await import('../../services/api/documents');
    vi.mocked(listDocuments).mockResolvedValue([
      { id: 'doc-1', name: 'Old_File.pdf', size: 1024, version: 1, created_at: '2025-01-01', folder_id: null },
    ]);

    renderWithProviders(
      <DocumentList
        dealId="deal-1"
        folderId={null}
        onSelectionChange={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /delete old_file\.pdf/i })).toBeInTheDocument();
    });
  });

  it('should confirm before deleting document', async () => {
    const { listDocuments, deleteDocument } = await import('../../services/api/documents');
    vi.mocked(listDocuments).mockResolvedValue([
      { id: 'doc-1', name: 'ToDelete.pdf', size: 1024, version: 1, created_at: '2025-01-01', folder_id: null },
    ]);
    vi.mocked(deleteDocument).mockResolvedValue(undefined);

    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    renderWithProviders(
      <DocumentList
        dealId="deal-1"
        folderId={null}
        onSelectionChange={vi.fn()}
      />
    );

    const deleteButton = await screen.findByRole('button', { name: /delete todelete\.pdf/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(confirmSpy).toHaveBeenCalled();
      expect(deleteDocument).toHaveBeenCalledWith('doc-1');
    });

    confirmSpy.mockRestore();
  });

  it('should show loading state while fetching documents', () => {
    const { listDocuments } = vi.mocked(require('../../services/api/documents'));
    listDocuments.mockImplementation(() => new Promise(() => {})); // Never resolves

    renderWithProviders(
      <DocumentList
        dealId="deal-1"
        folderId={null}
        onSelectionChange={vi.fn()}
      />
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
