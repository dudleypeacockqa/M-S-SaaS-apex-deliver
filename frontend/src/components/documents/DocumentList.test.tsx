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
vi.mock('../../services/api/documents', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../services/api/documents')>();
  return {
    ...actual,
    listDocuments: vi.fn(),
    downloadDocument: vi.fn(),
    deleteDocument: vi.fn(),
  };
});

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
    vi.mocked(listDocuments).mockResolvedValue({
      items: [
        {
          id: 'doc-1',
          name: 'Financial_Statement_Q4.pdf',
          file_size: 2_048_000,
          file_type: 'application/pdf',
          version: 1,
          uploaded_by: 'John Doe',
          created_at: '2025-01-15T10:30:00Z',
          folder_id: 'folder-1',
          deal_id: 'deal-1',
          organization_id: 'org-1',
          updated_at: null,
          archived_at: null,
        },
        {
          id: 'doc-2',
          name: 'NDA_Template.docx',
          file_size: 512_000,
          file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          version: 3,
          uploaded_by: 'Jane Smith',
          created_at: '2025-01-10T14:20:00Z',
          folder_id: 'folder-1',
          deal_id: 'deal-1',
          organization_id: 'org-1',
          updated_at: null,
          archived_at: null,
        },
      ],
      total: 2,
      page: 1,
      per_page: 25,
      pages: 1,
    });

    renderWithProviders(
      <DocumentList dealId="deal-1" folderId="folder-1" />
    );

    await waitFor(() => {
      expect(screen.getByText('Financial_Statement_Q4.pdf')).toBeInTheDocument();
      expect(screen.getByText('NDA_Template.docx')).toBeInTheDocument();
      expect(screen.getByText('1.95 MB')).toBeInTheDocument();
      expect(screen.getByText('v3')).toBeInTheDocument();
    });
  });

  it('should show empty state when no documents', async () => {
    const { listDocuments } = await import('../../services/api/documents');
    vi.mocked(listDocuments).mockResolvedValue({ items: [], total: 0, page: 1, per_page: 25, pages: 1 });

    renderWithProviders(<DocumentList dealId="deal-1" folderId={null} />);

    await waitFor(() => {
      expect(screen.getByText(/no documents found/i)).toBeInTheDocument();
    });
  });

  it('should sort documents by name', async () => {
    const { listDocuments } = await import('../../services/api/documents');
    vi.mocked(listDocuments).mockResolvedValue({
      items: [
        { id: 'doc-1', name: 'Zebra.pdf', file_size: 1024, file_type: 'application/pdf', version: 1, created_at: '2025-01-01', folder_id: null, deal_id: 'deal-1', organization_id: 'org-1', uploaded_by: 'user', updated_at: null, archived_at: null },
        { id: 'doc-2', name: 'Alpha.pdf', file_size: 1024, file_type: 'application/pdf', version: 1, created_at: '2025-01-02', folder_id: null, deal_id: 'deal-1', organization_id: 'org-1', uploaded_by: 'user', updated_at: null, archived_at: null },
      ],
      total: 2,
      page: 1,
      per_page: 25,
      pages: 1,
    });

    renderWithProviders(<DocumentList dealId="deal-1" folderId={null} />);

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
    vi.mocked(listDocuments).mockResolvedValue({
      items: [
        { id: 'doc-1', name: 'Old.pdf', file_size: 1024, file_type: 'application/pdf', version: 1, created_at: '2025-01-01T10:00:00Z', folder_id: null, deal_id: 'deal-1', organization_id: 'org-1', uploaded_by: 'user', updated_at: null, archived_at: null },
        { id: 'doc-2', name: 'New.pdf', file_size: 1024, file_type: 'application/pdf', version: 1, created_at: '2025-01-15T10:00:00Z', folder_id: null, deal_id: 'deal-1', organization_id: 'org-1', uploaded_by: 'user', updated_at: null, archived_at: null },
      ],
      total: 2,
      page: 1,
      per_page: 25,
      pages: 1,
    });

    renderWithProviders(<DocumentList dealId="deal-1" folderId={null} />);

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
    vi.mocked(listDocuments).mockResolvedValue({
      items: [
        { id: 'doc-1', name: 'Financial_Report.pdf', file_size: 1024, file_type: 'application/pdf', version: 1, created_at: '2025-01-01', folder_id: null, deal_id: 'deal-1', organization_id: 'org-1', uploaded_by: 'user', updated_at: null, archived_at: null },
        { id: 'doc-2', name: 'Legal_Contract.pdf', file_size: 1024, file_type: 'application/pdf', version: 1, created_at: '2025-01-02', folder_id: null, deal_id: 'deal-1', organization_id: 'org-1', uploaded_by: 'user', updated_at: null, archived_at: null },
      ],
      total: 2,
      page: 1,
      per_page: 25,
      pages: 1,
    });

    renderWithProviders(<DocumentList dealId="deal-1" folderId={null} />);

    const searchInput = await screen.findByPlaceholderText(/search documents/i);
    fireEvent.change(searchInput, { target: { value: 'Financial' } });

    await waitFor(() => {
      expect(screen.getByText('Financial_Report.pdf')).toBeInTheDocument();
      expect(screen.queryByText('Legal_Contract.pdf')).not.toBeInTheDocument();
    });
  });

  it('should select single document with checkbox', async () => {
    const { listDocuments } = await import('../../services/api/documents');
    vi.mocked(listDocuments).mockResolvedValue({
      items: [
        { id: 'doc-1', name: 'Document.pdf', file_size: 1024, file_type: 'application/pdf', version: 1, created_at: '2025-01-01', folder_id: null, deal_id: 'deal-1', organization_id: 'org-1', uploaded_by: 'user', updated_at: null, archived_at: null },
      ],
      total: 1,
      page: 1,
      per_page: 25,
      pages: 1,
    });

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

    await waitFor(() => expect(onSelectionChange).toHaveBeenCalled())
    const selectedDocs = onSelectionChange.mock.calls.at(-1)?.[0] as Array<{
      id: string
    }>
    expect(selectedDocs).toHaveLength(1)
    expect(selectedDocs[0].id).toBe('doc-1')
  });

  it('should select all documents with header checkbox', async () => {
    const { listDocuments } = await import('../../services/api/documents');
    vi.mocked(listDocuments).mockResolvedValue({
      items: [
        { id: 'doc-1', name: 'Doc1.pdf', file_size: 1024, file_type: 'application/pdf', version: 1, created_at: '2025-01-01', folder_id: null, deal_id: 'deal-1', organization_id: 'org-1', uploaded_by: 'user', updated_at: null, archived_at: null },
        { id: 'doc-2', name: 'Doc2.pdf', file_size: 1024, file_type: 'application/pdf', version: 1, created_at: '2025-01-02', folder_id: null, deal_id: 'deal-1', organization_id: 'org-1', uploaded_by: 'user', updated_at: null, archived_at: null },
      ],
      total: 2,
      page: 1,
      per_page: 25,
      pages: 1,
    });

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

    await waitFor(() => expect(onSelectionChange).toHaveBeenCalled())
    const selectedDocs = onSelectionChange.mock.calls.at(-1)?.[0] as Array<{
      id: string
    }>
    expect(Array.isArray(selectedDocs)).toBe(true)
    expect(selectedDocs).toHaveLength(2)
    expect(selectedDocs.map((doc) => doc.id)).toEqual(['doc-1', 'doc-2'])
  });

  it('should show download button for each document', async () => {
    const { listDocuments } = await import('../../services/api/documents');
    vi.mocked(listDocuments).mockResolvedValue({
      items: [
        { id: 'doc-1', name: 'Report.pdf', file_size: 1024, file_type: 'application/pdf', version: 1, created_at: '2025-01-01', folder_id: null, deal_id: 'deal-1', organization_id: 'org-1', uploaded_by: 'user', updated_at: null, archived_at: null },
      ],
      total: 1,
      page: 1,
      per_page: 25,
      pages: 1,
    });

    renderWithProviders(<DocumentList dealId="deal-1" folderId={null} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /download report\.pdf/i })).toBeInTheDocument();
    });
  });

  it('should call download API when download button clicked', async () => {
    const { listDocuments, downloadDocument } = await import('../../services/api/documents');
    vi.mocked(listDocuments).mockResolvedValue({
      items: [
        { id: 'doc-1', name: 'Contract.pdf', file_size: 1024, file_type: 'application/pdf', version: 1, created_at: '2025-01-01', folder_id: null, deal_id: 'deal-1', organization_id: 'org-1', uploaded_by: 'user', updated_at: null, archived_at: null },
      ],
      total: 1,
      page: 1,
      per_page: 25,
      pages: 1,
    });
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
      expect(downloadDocument).toHaveBeenCalledWith('deal-1', 'doc-1');
    });
  });

  it('should show delete button for each document', async () => {
    const { listDocuments } = await import('../../services/api/documents');
    vi.mocked(listDocuments).mockResolvedValue({
      items: [
        { id: 'doc-1', name: 'Old_File.pdf', file_size: 1024, file_type: 'application/pdf', version: 1, created_at: '2025-01-01', folder_id: null, deal_id: 'deal-1', organization_id: 'org-1', uploaded_by: 'user', updated_at: null, archived_at: null },
      ],
      total: 1,
      page: 1,
      per_page: 25,
      pages: 1,
    });

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

  it('should render manage access button when provided', async () => {
    const { listDocuments } = await import('../../services/api/documents');
    vi.mocked(listDocuments).mockResolvedValue({
      items: [
        { id: 'doc-1', name: 'Secure.pdf', file_size: 1024, file_type: 'application/pdf', version: 1, created_at: '2025-01-01', folder_id: null, deal_id: 'deal-1', organization_id: 'org-1', uploaded_by: 'user', updated_at: null, archived_at: null },
      ],
      total: 1,
      page: 1,
      per_page: 25,
      pages: 1,
    });

    const onManagePermissions = vi.fn();

    renderWithProviders(
      <DocumentList
        dealId="deal-1"
        folderId={null}
        onSelectionChange={vi.fn()}
        onManagePermissions={onManagePermissions}
      />
    );

    const manageButton = await screen.findByRole('button', { name: /manage permissions for secure.pdf/i });
    fireEvent.click(manageButton);

    expect(onManagePermissions).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'doc-1' })
    );
  });

  it('should confirm before deleting document', async () => {
    const { listDocuments, deleteDocument } = await import('../../services/api/documents');
    vi.mocked(listDocuments).mockResolvedValue({
      items: [
        { id: 'doc-1', name: 'ToDelete.pdf', file_size: 1024, file_type: 'application/pdf', version: 1, created_at: '2025-01-01', folder_id: null, deal_id: 'deal-1', organization_id: 'org-1', uploaded_by: 'user', updated_at: null, archived_at: null },
      ],
      total: 1,
      page: 1,
      per_page: 25,
      pages: 1,
    });
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
      expect(deleteDocument).toHaveBeenCalledWith('deal-1', 'doc-1');
    });

    confirmSpy.mockRestore();
  });

  it('should show loading state while fetching documents', async () => {
    const { listDocuments } = await import('../../services/api/documents');
    vi.mocked(listDocuments).mockImplementation(() => new Promise(() => {}));

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
