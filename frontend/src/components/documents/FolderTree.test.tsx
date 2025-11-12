/**
 * FolderTree Component Tests
 * TDD RED phase - Write failing tests first
 * Sprint 1.1.1 - DEV-008 Secure Document & Data Room
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FolderTree } from './FolderTree';

vi.mock('../../services/api/documents', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../services/api/documents')>();
  return {
    ...actual,
    createFolder: vi.fn(),
    listFolders: vi.fn(),
    deleteFolder: vi.fn(),
    updateFolder: vi.fn(),
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
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

describe('FolderTree', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders root folder structure', async () => {
    const { listFolders } = await import('../../services/api/documents');
    vi.mocked(listFolders).mockResolvedValue([
      { id: 'folder-1', name: 'Contracts', parent_id: null, deal_id: 'deal-1', created_at: '2025-01-01', document_count: 0, has_children: false },
      { id: 'folder-2', name: 'Financial Reports', parent_id: null, deal_id: 'deal-1', created_at: '2025-01-02', document_count: 2, has_children: false },
    ]);

    renderWithProviders(
      <FolderTree dealId="deal-1" selectedFolderId={null} onFolderSelect={vi.fn()} />
    );

    await waitFor(() => {
      expect(screen.getByText('Contracts')).toBeInTheDocument();
      expect(screen.getByText('Financial Reports')).toBeInTheDocument();
    });
  });

  it('lazy loads child folders when expanded', async () => {
    const { listFolders } = await import('../../services/api/documents');
    vi.mocked(listFolders).mockImplementation(async (_dealId, options) => {
      if (!options || options.parentFolderId === undefined) {
        return [
          { id: 'folder-1', name: 'Legal', parent_id: null, deal_id: 'deal-1', created_at: '2025-01-01', document_count: 0, has_children: true },
        ];
      }

      if (options.parentFolderId === 'folder-1') {
        return [
          { id: 'folder-2', name: 'NDAs', parent_id: 'folder-1', deal_id: 'deal-1', created_at: '2025-01-02', document_count: 0, has_children: false },
        ];
      }

      return [];
    });

    renderWithProviders(
      <FolderTree dealId="deal-1" selectedFolderId={null} onFolderSelect={vi.fn()} />
    );

    const expandButton = await screen.findByRole('button', { name: /expand legal/i });
    fireEvent.click(expandButton);

    await waitFor(() => {
      expect(listFolders).toHaveBeenCalledWith('deal-1', expect.objectContaining({ parentFolderId: 'folder-1' }));
      expect(screen.getByRole('treeitem', { name: /NDAs/i })).toBeInTheDocument();
    });
  });

  it('marks selected folder via aria-selected', async () => {
    const { listFolders } = await import('../../services/api/documents');
    vi.mocked(listFolders).mockResolvedValue([
      { id: 'folder-1', name: 'Documents', parent_id: null, deal_id: 'deal-1', created_at: '2025-01-01', document_count: 2, has_children: false },
    ]);

    renderWithProviders(
      <FolderTree dealId="deal-1" selectedFolderId="folder-1" onFolderSelect={vi.fn()} />
    );

    const treeitem = await screen.findByRole('treeitem', { name: /Documents/i });
    expect(treeitem).toHaveAttribute('aria-selected', 'true');
  });

  it('invokes onFolderSelect when a folder is activated', async () => {
    const { listFolders } = await import('../../services/api/documents');
    vi.mocked(listFolders).mockResolvedValue([
      { id: 'folder-1', name: 'Assets', parent_id: null, deal_id: 'deal-1', created_at: '2025-01-01', document_count: 0, has_children: false },
    ]);

    const onFolderSelect = vi.fn();

    renderWithProviders(
      <FolderTree dealId="deal-1" selectedFolderId={null} onFolderSelect={onFolderSelect} />
    );

    const folderButton = await screen.findByRole('treeitem', { name: /Assets/i });
    fireEvent.click(folderButton);

    expect(onFolderSelect).toHaveBeenCalledWith('folder-1');
  });

  it('creates a new folder through inline form', async () => {
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
      <FolderTree dealId="deal-1" selectedFolderId={null} onFolderSelect={vi.fn()} />
    );

    const createButton = await screen.findByRole('button', { name: /new folder/i });
    fireEvent.click(createButton);

    const input = await screen.findByPlaceholderText(/folder name/i);
    fireEvent.change(input, { target: { value: 'New Folder' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(createFolder).toHaveBeenCalledWith('deal-1', {
        name: 'New Folder',
        parent_folder_id: null,
      });
    });
  });

  it('opens context menu on right-click', async () => {
    const { listFolders } = await import('../../services/api/documents');
    vi.mocked(listFolders).mockResolvedValue([
      { id: 'folder-1', name: 'Reports', parent_id: null, deal_id: 'deal-1', created_at: '2025-01-01', document_count: 0, has_children: false },
    ]);

    renderWithProviders(
      <FolderTree dealId="deal-1" selectedFolderId={null} onFolderSelect={vi.fn()} />
    );

    const folderElement = await screen.findByText('Reports');
    fireEvent.contextMenu(folderElement);

    await waitFor(() => {
      expect(screen.getByText(/rename/i)).toBeInTheDocument();
      expect(screen.getByText(/delete/i)).toBeInTheDocument();
    });
  });

  it('renames folder through context menu', async () => {
    const { listFolders, updateFolder } = await import('../../services/api/documents');
    vi.mocked(listFolders).mockResolvedValue([
      { id: 'folder-1', name: 'Old Name', parent_id: null, deal_id: 'deal-1', created_at: '2025-01-01', document_count: 0, has_children: false },
    ]);
    vi.mocked(updateFolder).mockResolvedValue({
      id: 'folder-1',
      name: 'New Name',
      parent_id: null,
      deal_id: 'deal-1',
      created_at: '2025-01-01',
    });

    renderWithProviders(
      <FolderTree dealId="deal-1" selectedFolderId={null} onFolderSelect={vi.fn()} />
    );

    const folderElement = await screen.findByText('Old Name');
    fireEvent.contextMenu(folderElement);

    const renameButton = await screen.findByText(/rename/i);
    fireEvent.click(renameButton);

    const input = await screen.findByDisplayValue('Old Name');
    fireEvent.change(input, { target: { value: 'New Name' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(updateFolder).toHaveBeenCalledWith('deal-1', 'folder-1', { name: 'New Name' });
    });
  });

  it('deletes folder with confirmation dialog', async () => {
    const { listFolders, deleteFolder } = await import('../../services/api/documents');
    vi.mocked(listFolders).mockResolvedValue([
      { id: 'folder-1', name: 'To Delete', parent_id: null, deal_id: 'deal-1', created_at: '2025-01-01', document_count: 0, has_children: false },
    ]);
    vi.mocked(deleteFolder).mockResolvedValue(undefined);

    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    renderWithProviders(
      <FolderTree dealId="deal-1" selectedFolderId={null} onFolderSelect={vi.fn()} />
    );

    const folderElement = await screen.findByText('To Delete');
    fireEvent.contextMenu(folderElement);

    const deleteButton = await screen.findByRole('button', { name: /^delete$/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(confirmSpy).toHaveBeenCalled();
      expect(deleteFolder).toHaveBeenCalledWith('deal-1', 'folder-1');
    });

    confirmSpy.mockRestore();
  });

  it('shows loading state while the root request is in-flight', async () => {
    const { listFolders } = await import('../../services/api/documents');
    vi.mocked(listFolders).mockImplementation(() => new Promise(() => {}));

    renderWithProviders(
      <FolderTree dealId="deal-1" selectedFolderId={null} onFolderSelect={vi.fn()} />
    );

    expect(screen.getByText(/loading folders/i)).toBeInTheDocument();
  });

  it('persists expanded folders between remounts', async () => {
    const storageKey = 'folder-tree-expanded-deal-1';
    const setItemSpy = vi.spyOn(window.localStorage, 'setItem');
    const getItemSpy = vi.spyOn(window.localStorage, 'getItem').mockReturnValue(null);

    const { listFolders } = await import('../../services/api/documents');
    vi.mocked(listFolders).mockImplementation(async (_dealId, options) => {
      if (!options || options.parentFolderId === undefined) {
        return [
          { id: 'folder-1', name: 'Playbooks', parent_id: null, deal_id: 'deal-1', created_at: '2025-01-01', document_count: 0, has_children: true },
        ];
      }

      if (options.parentFolderId === 'folder-1') {
        return [
          { id: 'folder-2', name: 'Ops', parent_id: 'folder-1', deal_id: 'deal-1', created_at: '2025-01-02', document_count: 0, has_children: false },
        ];
      }
      return [];
    });

    const renderTree = () =>
      renderWithProviders(
        <FolderTree dealId="deal-1" selectedFolderId={null} onFolderSelect={vi.fn()} />
      );

    const { unmount } = renderTree();

    const expandTrigger = await screen.findByRole('button', { name: /expand playbooks/i });
    fireEvent.click(expandTrigger);

    await waitFor(() => {
      expect(setItemSpy).toHaveBeenCalledWith(storageKey, JSON.stringify(['folder-1']));
    });

    getItemSpy.mockReturnValue(JSON.stringify(['folder-1']));

    unmount();
    renderTree();

    await waitFor(() => {
      const toggleButton = screen.getByRole('button', { name: /collapse playbooks/i });
      expect(toggleButton).toBeInTheDocument();
      expect(screen.getByRole('treeitem', { name: /Ops/i })).toBeInTheDocument();
    });

    setItemSpy.mockRestore();
    getItemSpy.mockRestore();
    window.localStorage.removeItem(storageKey);
  });

  it('supports keyboard navigation and selection', async () => {
    const { listFolders } = await import('../../services/api/documents');
    vi.mocked(listFolders).mockResolvedValue([
      { id: 'folder-1', name: 'Contracts', parent_id: null, deal_id: 'deal-1', created_at: '2025-01-01', document_count: 0, has_children: false },
      { id: 'folder-2', name: 'Financials', parent_id: null, deal_id: 'deal-1', created_at: '2025-01-02', document_count: 0, has_children: false },
    ]);

    const onFolderSelect = vi.fn();

    renderWithProviders(
      <FolderTree dealId="deal-1" selectedFolderId={null} onFolderSelect={onFolderSelect} />
    );

    const tree = await screen.findByRole('tree');
    await act(async () => {
      tree.focus();
      fireEvent.focus(tree);
    });

    const firstItem = await screen.findByRole('treeitem', { name: /Contracts/i });
    expect(firstItem).toHaveFocus();

    await act(async () => {
      fireEvent.keyDown(tree, { key: 'ArrowDown' });
    });
    const secondItem = await screen.findByRole('treeitem', { name: /Financials/i });
    expect(secondItem).toHaveFocus();

    await act(async () => {
      fireEvent.keyDown(tree, { key: 'Enter' });
    });
    expect(onFolderSelect).toHaveBeenCalledWith('folder-2');
  });

  it('does not re-fetch child folders after initial load', async () => {
    const { listFolders } = await import('../../services/api/documents');
    const listMock = vi.mocked(listFolders);

    listMock.mockImplementation(async (_dealId, options) => {
      if (!options || options.parentFolderId === undefined) {
        return [
          { id: 'root-1', name: 'Root Folder', parent_id: null, deal_id: 'deal-1', created_at: '2025-01-01', document_count: 0, has_children: true },
        ];
      }

      if (options.parentFolderId === 'root-1') {
        return [
          { id: 'child-1', name: 'Child Folder', parent_id: 'root-1', deal_id: 'deal-1', created_at: '2025-01-02', document_count: 0, has_children: false },
        ];
      }

      return [];
    });

    renderWithProviders(
      <FolderTree dealId="deal-1" selectedFolderId={null} onFolderSelect={vi.fn()} />
    );

    const toggle = await screen.findByRole('button', { name: /expand root folder/i });
    fireEvent.click(toggle);

    await waitFor(() => {
      expect(screen.getByRole('treeitem', { name: /Child Folder/i })).toBeInTheDocument();
    });

    fireEvent.click(toggle); // collapse
    const collapseButton = await screen.findByRole('button', { name: /expand root folder/i });
    fireEvent.click(collapseButton); // expand again

    expect(listMock).toHaveBeenCalledTimes(2); // root + first child fetch only
  });

  it('fetches search results from the API when searchTerm provided', async () => {
    const { listFolders } = await import('../../services/api/documents');
    vi.mocked(listFolders).mockImplementation(async (_dealId, options) => {
      if (options?.search) {
        return [
          { id: 'folder-search', name: 'Legal Team', parent_id: null, deal_id: 'deal-1', created_at: '2025-01-01', document_count: 0, has_children: false },
        ];
      }

      return [];
    });

    renderWithProviders(
      <FolderTree dealId="deal-1" selectedFolderId={null} searchTerm="Legal" onFolderSelect={vi.fn()} />
    );

    await waitFor(() => {
      expect(listFolders).toHaveBeenCalledWith('deal-1', expect.objectContaining({ search: 'Legal' }));
      expect(screen.getByRole('treeitem', { name: /Legal Team/i })).toBeInTheDocument();
    });
  });
});

