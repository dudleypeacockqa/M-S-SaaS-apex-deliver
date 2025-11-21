/**
 * Tests for PMIProjectList page - 100% Coverage
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { PMIProjectList } from './PMIProjectList';
import { usePMIProjects } from '../hooks/usePMIProject';

vi.mock('../hooks/usePMIProject', () => ({
  usePMIProjects: vi.fn(),
}));

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('PMIProjectList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state', () => {
    vi.mocked(usePMIProjects).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    renderWithProviders(<PMIProjectList />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should render projects list', async () => {
    vi.mocked(usePMIProjects).mockReturnValue({
      data: {
        items: [
          {
            id: 'project-1',
            name: 'Test PMI Project',
            status: 'active',
            organization_id: 'org-1',
            created_at: '2025-01-01T00:00:00Z',
            updated_at: '2025-01-02T00:00:00Z',
          },
        ],
        total: 1,
        page: 1,
        page_size: 20,
      },
      isLoading: false,
      error: null,
    } as any);

    renderWithProviders(<PMIProjectList />);

    await waitFor(() => {
      expect(screen.getByText('Test PMI Project')).toBeInTheDocument();
    });
  });
});

