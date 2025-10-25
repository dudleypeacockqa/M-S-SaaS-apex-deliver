/**
 * DataRoom Component Tests
 * Testing folder management and document operations
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
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

const renderDataRoom = () => {
  return render(
    <BrowserRouter>
      <DataRoom />
    </BrowserRouter>
  );
};

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
        parent_folder_id: null,
        organization_id: 'org-1',
        created_at: new Date().toISOString(),
        updated_at: null,
      },
      {
        id: 'folder-2',
        name: 'Legal Documents',
        deal_id: 'test-deal-123',
        parent_folder_id: null,
        organization_id: 'org-1',
        created_at: new Date().toISOString(),
        updated_at: null,
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
      parent_folder_id: null,
      organization_id: 'org-1',
      created_at: new Date().toISOString(),
      updated_at: null,
    };

    (documentsAPI.createFolder as any).mockResolvedValue(mockNewFolder);
    (documentsAPI.listFolders as any).mockResolvedValue([mockNewFolder]);

    renderDataRoom();

    await waitFor(() => {
      const createButton = screen.getByRole('button', { name: /new folder/i });
      fireEvent.click(createButton);
    });

    await waitFor(() => {
      const input = screen.getByPlaceholderText(/folder name/i)
      expect(input).toBeInTheDocument()
    })
  });

  it('should filter documents by selected folder', async () => {
    const mockFolders = [
      {
        id: 'folder-1',
        name: 'Financials',
        deal_id: 'test-deal-123',
        parent_folder_id: null,
        organization_id: 'org-1',
        created_at: new Date().toISOString(),
        updated_at: null,
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

    await waitFor(() => {
      const folder = screen.getByText('Financials');
      fireEvent.click(folder);
    });

    await waitFor(() => {
      expect(documentsAPI.listDocuments).toHaveBeenCalledWith(
        'test-deal-123',
        expect.objectContaining({ folder_id: 'folder-1' })
      )
    })
  });

  it('should show All Documents view when no folder selected', async () => {
    renderDataRoom();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /all documents/i })).toBeInTheDocument()
    });
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
});
