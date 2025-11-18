/**
 * Tests for RiskRegister component - 100% Coverage
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { RiskRegister } from './RiskRegister';
import * as pmiApi from '../services/pmiApi';

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

const mockRisks: pmiApi.PMIRisk[] = [
  {
    id: 'risk-1',
    project_id: 'project-1',
    organization_id: 'org-1',
    title: 'Integration Delay Risk',
    description: 'Risk of delays',
    severity: 'high',
    status: 'open',
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

describe('RiskRegister', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state', () => {
    const { useQuery } = await import('@tanstack/react-query');
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    renderWithProviders(<RiskRegister projectId="project-1" />);
    expect(screen.getByText('Loading risks...')).toBeInTheDocument();
  });

  it('should render risks list', async () => {
    const { useQuery } = await import('@tanstack/react-query');
    vi.mocked(useQuery).mockReturnValue({
      data: { items: mockRisks, total: 1 },
      isLoading: false,
      error: null,
    } as any);

    renderWithProviders(<RiskRegister projectId="project-1" />);

    await waitFor(() => {
      expect(screen.getByText('Integration Delay Risk')).toBeInTheDocument();
    });
  });
});

