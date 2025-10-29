/**
 * BulkActionsToolbar Component Tests
 * TDD RED phase - Write failing tests first
 * Sprint 1.1 - DEV-008 Secure Document & Data Room
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BulkActionsToolbar } from './BulkActionsToolbar';

// Mock bulk actions API
vi.mock('../../services/api/documents', () => ({
  bulkDownloadDocuments: vi.fn(),
  bulkDeleteDocuments: vi.fn(),
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

describe('BulkActionsToolbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when no documents selected', () => {
    renderWithProviders(<BulkActionsToolbar selectedIds={[]} onClear={vi.fn()} />);
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
  });

  it('should render when documents are selected', () => {
    renderWithProviders(<BulkActionsToolbar selectedIds={['doc-1', 'doc-2']} onClear={vi.fn()} />);
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
    expect(screen.getByText(/2 selected/i)).toBeInTheDocument();
  });

  it('should show download button', () => {
    renderWithProviders(<BulkActionsToolbar selectedIds={['doc-1']} onClear={vi.fn()} />);
    expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
  });

  it('should show delete button', () => {
    renderWithProviders(<BulkActionsToolbar selectedIds={['doc-1']} onClear={vi.fn()} />);
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('should show clear selection button', () => {
    renderWithProviders(<BulkActionsToolbar selectedIds={['doc-1']} onClear={vi.fn()} />);
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('should call bulk download API', async () => {
    const { bulkDownloadDocuments } = await import('../../services/api/documents');
    vi.mocked(bulkDownloadDocuments).mockResolvedValue('https://example.com/download-zip');

    // Mock window.open
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    renderWithProviders(<BulkActionsToolbar selectedIds={['doc-1', 'doc-2']} onClear={vi.fn()} />);

    const downloadButton = screen.getByRole('button', { name: /download/i });
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(bulkDownloadDocuments).toHaveBeenCalledWith(['doc-1', 'doc-2']);
      expect(windowOpenSpy).toHaveBeenCalledWith('https://example.com/download-zip', '_blank');
    });

    windowOpenSpy.mockRestore();
  });

  it('should confirm before bulk delete', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    renderWithProviders(<BulkActionsToolbar selectedIds={['doc-1', 'doc-2']} onClear={vi.fn()} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(confirmSpy).toHaveBeenCalledWith('Delete 2 documents?');
    confirmSpy.mockRestore();
  });

  it('should call bulk delete API when confirmed', async () => {
    const { bulkDeleteDocuments } = await import('../../services/api/documents');
    vi.mocked(bulkDeleteDocuments).mockResolvedValue(undefined);
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    const onClear = vi.fn();
    renderWithProviders(<BulkActionsToolbar selectedIds={['doc-1', 'doc-2']} onClear={onClear} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(bulkDeleteDocuments).toHaveBeenCalledWith(['doc-1', 'doc-2']);
      expect(onClear).toHaveBeenCalled();
    });

    confirmSpy.mockRestore();
  });
});
