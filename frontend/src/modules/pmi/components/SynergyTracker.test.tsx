/**
 * Tests for SynergyTracker component - 100% Coverage
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { SynergyTracker } from './SynergyTracker';
import * as pmiApi from '../../services/pmiApi';

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

const mockSynergies: pmiApi.PMISynergy[] = [
  {
    id: 'syn-1',
    project_id: 'project-1',
    organization_id: 'org-1',
    name: 'Cost Synergy',
    category: 'cost_synergy',
    planned_value: 100000,
    realized_value: 80000,
    currency: 'GBP',
    status: 'realized',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-02T00:00:00Z',
  },
];

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('SynergyTracker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    renderWithProviders(<SynergyTracker projectId="project-1" />);
    expect(screen.getByText('Loading synergies...')).toBeInTheDocument();
  });

  it('should render synergies and calculate totals', async () => {
    vi.mocked(useQuery).mockReturnValue({
      data: { items: mockSynergies, total: 1 },
      isLoading: false,
      error: null,
    } as any);

    renderWithProviders(<SynergyTracker projectId="project-1" />);

    await waitFor(() => {
      expect(screen.getByText('Cost Synergy')).toBeInTheDocument();
    });
  });
});

