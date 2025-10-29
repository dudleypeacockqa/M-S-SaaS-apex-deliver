/**
 * FolderTree Component Tests
 * TDD RED phase - Write failing tests first
 * Sprint 1.1.1 - DEV-008 Secure Document & Data Room
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FolderTree } from './FolderTree';

// Mock folder API
vi.mock('../../services/api/documents', () => ({
  createFolder: vi.fn(),
  listFolders: vi.fn(),
  deleteFolder: vi.fn(),
  updateFolder: vi.fn(),
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

describe('FolderTree', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render root folder structure', async () => {
    const { listFolders } = await import('../../services/api/documents');
    vi.mocked(listFolders).mockResolvedValue([
      { id: 'folder-1', name: 'Contracts', parent_id: null, deal_id: 'deal-1', created_at: '2025-01-01' },
      { id: 'folder-2', name: 'Financial Reports', parent_id: null, deal_id: 'deal-1', created_at: '2025-01-02' },
    ]);

    renderWithProviders(
      <FolderTree
        dealId="deal-1"
        selectedFolderId={null}
        onFolderSelect={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Contracts')).toBeInTheDocument();
      expect(screen.getByText('Financial Reports')).toBeInTheDocument();
    });
  });

  it('should render nested folder hierarchy', async () => {
    const { listFolders } = await import('../../services/api/documents');
    vi.mocked(listFolders).mockResolvedValue([
      { id: 'folder-1', name: 'Legal', parent_id: null, deal_id: 'deal-1', created_at: '2025-01-01' },
      { id: 'folder-2', name: 'NDAs', parent_id: 'folder-1', deal_id: 'deal-1', created_at: '2025-01-02' },
      { id: 'folder-3', name: 'Signed', parent_id: 'folder-2', deal_id: 'deal-1', created_at: '2025-01-03' },
    ]);

    renderWithProviders(
      <FolderTree
        dealId="deal-1"
        selectedFolderId={null}
        onFolderSelect={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Legal')).toBeInTheDocument();
    });

    // Expand parent folder
    const expandButton = screen.getByRole('button', { name: /expand legal/i });
    fireEvent.click(expandButton);

    await waitFor(() => {
      expect(screen.getByText('NDAs')).toBeInTheDocument();
    });
  });

  it('should highlight selected folder', async () => {
    const { listFolders } = await import('../../services/api/documents');
    vi.mocked(listFolders).mockResolvedValue([
      { id: 'folder-1', name: 'Documents', parent_id: null, deal_id: 'deal-1', created_at: '2025-01-01' },
    ]);

    renderWithProviders(
      <FolderTree
        dealId="deal-1"
        selectedFolderId="folder-1"
        onFolderSelect={vi.fn()}
      />
    );

    await waitFor(() => {
      const folderElement = screen.getByText('Documents').closest('div');
      expect(folderElement).toHaveClass('bg-indigo-50');
    });
  });

  it('should call onFolderSelect when folder is clicked', async () => {
    const { listFolders } = await import('../../services/api/documents');
    vi.mocked(listFolders).mockResolvedValue([
      { id: 'folder-1', name: 'Assets', parent_id: null, deal_id: 'deal-1', created_at: '2025-01-01' },
    ]);

    const onFolderSelect = vi.fn();

    renderWithProviders(
      <FolderTree
        dealId="deal-1"
        selectedFolderId={null}
        onFolderSelect={onFolderSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Assets')).toBeInTheDocument();
    });

    const folderButton = screen.getByRole('button', { name: /select assets/i });
    fireEvent.click(folderButton);

    expect(onFolderSelect).toHaveBeenCalledWith('folder-1');
  });

  it('should show create folder button', async () => {
    const { listFolders } = await import('../../services/api/documents');
    vi.mocked(listFolders).mockResolvedValue([]);

    renderWithProviders(
      <FolderTree
        dealId="deal-1"
        selectedFolderId={null}
        onFolderSelect={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /new folder/i })).toBeInTheDocument();
    });
  });

  it('should create new folder with inline input', async () => {
    const { listFolders, createFolder } = await import('../../services/api/documents');
    vi.mocked(listFolders).mockResolvedValue([]);
    vi.mocked(createFolder).mockResolvedValue({
      id: 'folder-new',
      name: 'New Folder',
      parent_id: null,
      deal_id: 'deal-1',
      created_at: '2025-01-01',
    });

    renderWithProviders(
      <FolderTree
        dealId="deal-1"
        selectedFolderId={null}
        onFolderSelect={vi.fn()}
      />
    );

    const createButton = await screen.findByRole('button', { name: /new folder/i });
    fireEvent.click(createButton);

    // Expect inline input to appear
    const input = await screen.findByPlaceholderText(/folder name/i);
    fireEvent.change(input, { target: { value: 'New Folder' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(createFolder).toHaveBeenCalledWith({
        deal_id: 'deal-1',
        name: 'New Folder',
        parent_id: null,
      });
    });
  });

  it('should show context menu on right-click', async () => {
    const { listFolders } = await import('../../services/api/documents');
    vi.mocked(listFolders).mockResolvedValue([
      { id: 'folder-1', name: 'Reports', parent_id: null, deal_id: 'deal-1', created_at: '2025-01-01' },
    ]);

    renderWithProviders(
      <FolderTree
        dealId="deal-1"
        selectedFolderId={null}
        onFolderSelect={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Reports')).toBeInTheDocument();
    });

    const folderElement = screen.getByText('Reports');
    fireEvent.contextMenu(folderElement);

    await waitFor(() => {
      expect(screen.getByText(/rename/i)).toBeInTheDocument();
      expect(screen.getByText(/delete/i)).toBeInTheDocument();
    });
  });

  it('should rename folder via context menu', async () => {
    const { listFolders, updateFolder } = await import('../../services/api/documents');
    vi.mocked(listFolders).mockResolvedValue([
      { id: 'folder-1', name: 'Old Name', parent_id: null, deal_id: 'deal-1', created_at: '2025-01-01' },
    ]);
    vi.mocked(updateFolder).mockResolvedValue({
      id: 'folder-1',
      name: 'New Name',
      parent_id: null,
      deal_id: 'deal-1',
      created_at: '2025-01-01',
    });

    renderWithProviders(
      <FolderTree
        dealId="deal-1"
        selectedFolderId={null}
        onFolderSelect={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Old Name')).toBeInTheDocument();
    });

    // Right-click to open context menu
    const folderElement = screen.getByText('Old Name');
    fireEvent.contextMenu(folderElement);

    // Click rename
    const renameButton = await screen.findByText(/rename/i);
    fireEvent.click(renameButton);

    // Enter new name
    const input = await screen.findByDisplayValue('Old Name');
    fireEvent.change(input, { target: { value: 'New Name' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(updateFolder).toHaveBeenCalledWith('folder-1', { name: 'New Name' });
    });
  });

  it('should delete folder with confirmation', async () => {
    const { listFolders, deleteFolder } = await import('../../services/api/documents');
    vi.mocked(listFolders).mockResolvedValue([
      { id: 'folder-1', name: 'To Delete', parent_id: null, deal_id: 'deal-1', created_at: '2025-01-01' },
    ]);
    vi.mocked(deleteFolder).mockResolvedValue(undefined);

    // Mock window.confirm
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    renderWithProviders(
      <FolderTree
        dealId="deal-1"
        selectedFolderId={null}
        onFolderSelect={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('To Delete')).toBeInTheDocument();
    });

    // Right-click to open context menu
    const folderElement = screen.getByText('To Delete');
    fireEvent.contextMenu(folderElement);

    // Click delete
    const deleteButton = await screen.findByText(/delete/i);
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(confirmSpy).toHaveBeenCalled();
      expect(deleteFolder).toHaveBeenCalledWith('folder-1');
    });

    confirmSpy.mockRestore();
  });

  it('should show loading state while fetching folders', () => {
    const { listFolders } = vi.mocked(require('../../services/api/documents'));
    listFolders.mockImplementation(() => new Promise(() => {})); // Never resolves

    renderWithProviders(
      <FolderTree
        dealId="deal-1"
        selectedFolderId={null}
        onFolderSelect={vi.fn()}
      />
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
