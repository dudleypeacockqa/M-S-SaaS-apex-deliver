/**
 * DataRoom Component Tests
 * Testing folder management and document operations
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DataRoom } from './DataRoom';
import * as documentsAPI from '../../services/api/documents';

// Mock the documents API
vi.mock('../../services/api/documents', () => ({
  listDocuments: vi.fn(),
  listFolders: vi.fn(),
  createFolder: vi.fn(),
  uploadDocument: vi.fn(),
  downloadDocument: vi.fn(),
  archiveDocument: vi.fn(),
  bulkDownloadDocuments: vi.fn(),
  bulkDeleteDocuments: vi.fn(),
  formatFileSize: vi.fn((bytes) => `${bytes} bytes`),
  getFileIcon: vi.fn(() => '📄'),
  ALLOWED_FILE_TYPES: ['application/pdf'],
  MAX_FILE_SIZE: 50 * 1024 * 1024,
}));

// Mock useParams
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ dealId: 'test-deal-123' }),
    useNavigate: () => vi.fn(),
  };
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const renderDataRoom = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <DataRoom />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

afterEach(() => {
  queryClient.clear();
});

describe('DataRoom - Folder Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock responses
    (documentsAPI.listFolders as any).mockResolvedValue([]);
    (documentsAPI.listDocuments as any).mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      per_page: 20,
      pages: 1,
    });
  });

  it('should display folder sidebar', async () => {
    renderDataRoom();

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /folders/i })).toBeInTheDocument()
    })
  });

  it('should list existing folders', async () => {
    const mockFolders = [
      {
        id: 'folder-1',
        name: 'Financial Statements',
        deal_id: 'test-deal-123',
        parent_id: null,
        organization_id: 'org-1',
        created_by: 'user-1',
        created_at: new Date().toISOString(),
        updated_at: null,
        document_count: 0,
      },
      {
        id: 'folder-2',
        name: 'Legal Documents',
        deal_id: 'test-deal-123',
        parent_id: null,
        organization_id: 'org-1',
        created_by: 'user-1',
        created_at: new Date().toISOString(),
        updated_at: null,
        document_count: 0,
      },
    ];

    (documentsAPI.listFolders as any).mockResolvedValue(mockFolders);

    renderDataRoom();

    await waitFor(() => {
      expect(screen.getByText('Financial Statements')).toBeInTheDocument();
      expect(screen.getByText('Legal Documents')).toBeInTheDocument();
    });
  });

  it('should show create folder button', async () => {
    renderDataRoom();

    await waitFor(() => {
      const createButton = screen.getByRole('button', { name: /new folder/i });
      expect(createButton).toBeInTheDocument();
    });
  });

  it('should create a new folder', async () => {
    const mockNewFolder = {
      id: 'folder-new',
      name: 'Due Diligence',
      deal_id: 'test-deal-123',
      parent_id: null,
      organization_id: 'org-1',
      created_by: 'user-1',
      created_at: new Date().toISOString(),
      updated_at: null,
      document_count: 0,
    };

    (documentsAPI.createFolder as any).mockResolvedValue(mockNewFolder);
    (documentsAPI.listFolders as any).mockResolvedValue([mockNewFolder]);

    renderDataRoom();

    await waitFor(() => {
      const createButton = screen.getByRole('button', { name: /new folder/i });
      fireEvent.click(createButton);
    });

    const input = await screen.findByPlaceholderText(/folder name/i)
    fireEvent.change(input, { target: { value: 'Due Diligence' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    await waitFor(() => {
      expect(documentsAPI.createFolder).toHaveBeenCalledWith('test-deal-123', {
        name: 'Due Diligence',
        parent_id: null,
      })
    })
  });

  it('should filter documents by selected folder', async () => {
    const mockFolders = [
      {
        id: 'folder-1',
        name: 'Financials',
        deal_id: 'test-deal-123',
        parent_id: null,
        organization_id: 'org-1',
        created_by: 'user-1',
        created_at: new Date().toISOString(),
        updated_at: null,
        document_count: 0,
      },
    ];

    const mockDocuments = {
      items: [
        {
          id: 'doc-1',
          name: 'Balance Sheet.pdf',
          file_size: 1024,
          file_type: 'application/pdf',
          deal_id: 'test-deal-123',
          folder_id: 'folder-1',
          organization_id: 'org-1',
          uploaded_by: 'user-1',
          version: 1,
          created_at: new Date().toISOString(),
          updated_at: null,
        },
      ],
      total: 1,
      page: 1,
      per_page: 20,
      pages: 1,
    };

    (documentsAPI.listFolders as any).mockResolvedValue(mockFolders);
    (documentsAPI.listDocuments as any).mockResolvedValue(mockDocuments);

    renderDataRoom();

    const folderButton = await screen.findByRole('button', { name: /select financials/i })
    fireEvent.click(folderButton)

    await waitFor(() => {
      expect(documentsAPI.listDocuments).toHaveBeenLastCalledWith(
        'test-deal-123',
        expect.objectContaining({ folder_id: 'folder-1' })
      )
    })
  });

  it('should show All Documents view when no folder selected', async () => {
    renderDataRoom();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /all documents/i })).toBeInTheDocument()
    })
  });
});

describe('DataRoom - Document Operations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (documentsAPI.listFolders as any).mockResolvedValue([]);
    (documentsAPI.listDocuments as any).mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      per_page: 20,
      pages: 1,
    });
    (documentsAPI.bulkDownloadDocuments as any).mockResolvedValue('blob:mock');
    (documentsAPI.bulkDeleteDocuments as any).mockResolvedValue({
      deleted_count: 0,
      deleted_ids: [],
      failed_ids: [],
      failed_reasons: {},
    });
  });

  it('shows upgrade message when listing documents responds with 403 entitlement error', async () => {
    const entitlementError = Object.assign(
      new Error('Forbidden'),
      {
        status: 403,
        data: {
          detail: {
            message: 'Upgrade to the Growth tier to unlock secure data room access.',
            required_tier_label: 'Growth',
            upgrade_cta_url: '/billing/upgrade',
          },
        },
      }
    )

    ;(documentsAPI.listDocuments as any).mockRejectedValueOnce(entitlementError)

    renderDataRoom();

    const heading = await screen.findByRole('heading', { name: /access restricted/i });
    expect(heading).toBeInTheDocument();
    expect(
      screen.getByText(/upgrade to the growth tier/i),
    ).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /view pricing plans/i });
    expect(link).toHaveAttribute('href', '/billing/upgrade');
  });

  it('should display upload button', async () => {
    renderDataRoom();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /upload document/i })).toBeInTheDocument()
    });
  });

  it('should show empty state when no documents', async () => {
    renderDataRoom();

    await waitFor(() => {
      expect(screen.getByText(/no documents/i)).toBeInTheDocument();
    });
  });

  it('should display document list', async () => {
    const mockDocuments = {
      items: [
        {
          id: 'doc-1',
          name: 'Business Plan.pdf',
          file_size: 2048,
          file_type: 'application/pdf',
          deal_id: 'test-deal-123',
          folder_id: null,
          organization_id: 'org-1',
          uploaded_by: 'user-1',
          version: 1,
          created_at: new Date().toISOString(),
          updated_at: null,
        },
      ],
      total: 1,
      page: 1,
      per_page: 20,
      pages: 1,
    };

    (documentsAPI.listDocuments as any).mockResolvedValue(mockDocuments);

    renderDataRoom();

    await waitFor(() => {
      expect(screen.getByText('Business Plan.pdf')).toBeInTheDocument();
    });
  });

  it('allows selecting documents and triggers bulk actions', async () => {
    const mockDocuments = {
      items: [
        {
          id: 'doc-1',
          name: 'Doc One.pdf',
          file_size: 1024,
          file_type: 'application/pdf',
          deal_id: 'test-deal-123',
          folder_id: null,
          organization_id: 'org-1',
          uploaded_by: 'user-1',
          version: 1,
          created_at: new Date().toISOString(),
          updated_at: null,
        },
        {
          id: 'doc-2',
          name: 'Doc Two.pdf',
          file_size: 2048,
          file_type: 'application/pdf',
          deal_id: 'test-deal-123',
          folder_id: null,
          organization_id: 'org-1',
          uploaded_by: 'user-1',
          version: 1,
          created_at: new Date().toISOString(),
          updated_at: null,
        },
      ],
      total: 2,
      page: 1,
      per_page: 20,
      pages: 1,
    };

    (documentsAPI.listDocuments as any).mockResolvedValue(mockDocuments);

    renderDataRoom();

    await waitFor(() => {
      expect(screen.getByText('Doc One.pdf')).toBeInTheDocument();
      expect(screen.getByText('Doc Two.pdf')).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);

    expect(screen.getByText(/2 documents selected/i)).toBeInTheDocument();

    const downloadButton = screen.getByRole('button', { name: /download zip/i });
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(documentsAPI.bulkDownloadDocuments).toHaveBeenCalledWith('test-deal-123', ['doc-1', 'doc-2']);
    });

    window.confirm = vi.fn(() => true);
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(documentsAPI.bulkDeleteDocuments).toHaveBeenCalledWith('test-deal-123', ['doc-1', 'doc-2']);
    });

    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);

    expect(screen.queryByText(/documents selected/i)).not.toBeInTheDocument();
  });

  it('opens permission modal for single selected document', async () => {
    const mockDocuments = {
      items: [
        {
          id: 'doc-1',
          name: 'Confidential.pdf',
          file_size: 1024,
          file_type: 'application/pdf',
          deal_id: 'test-deal-123',
          folder_id: null,
          organization_id: 'org-1',
          uploaded_by: 'user-1',
          version: 1,
          created_at: new Date().toISOString(),
          updated_at: null,
        },
      ],
      total: 1,
      page: 1,
      per_page: 20,
      pages: 1,
    }

    ;(documentsAPI.listDocuments as any).mockResolvedValue(mockDocuments)

    renderDataRoom()

    const checkbox = await screen.findByRole('checkbox', { name: /select confidential.pdf/i })
    fireEvent.click(checkbox)

    const manageButton = await screen.findByRole('button', { name: /manage access/i })
    fireEvent.click(manageButton)

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })
});
