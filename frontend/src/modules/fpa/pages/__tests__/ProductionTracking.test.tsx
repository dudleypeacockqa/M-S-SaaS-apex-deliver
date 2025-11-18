import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductionTracking } from '../ProductionTracking';
import { fpaApi } from '../../services/fpaApi';

vi.mock('../../components/DashboardLayout', () => ({
  DashboardLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('../../services/fpaApi', () => ({
  fpaApi: {
    getProductionMetrics: vi.fn(),
  },
}));

const mockGetProductionMetrics = vi.mocked(fpaApi.getProductionMetrics);

const renderWithClient = async () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ProductionTracking />
    </QueryClientProvider>
  );
};

describe('ProductionTracking page', () => {
  beforeEach(() => {
    mockGetProductionMetrics.mockReset();
  });

  it('renders empty state when no metrics are available', async () => {
    mockGetProductionMetrics.mockResolvedValueOnce([]);
    await renderWithClient();

    await screen.findByText(/production tracking/i);
    expect(screen.getByText(/no production data available yet/i)).toBeInTheDocument();
  });

  it('displays KPI summaries when metrics are returned', async () => {
    mockGetProductionMetrics.mockResolvedValueOnce([
      {
        id: '1',
        date: '2025-11-01',
        units_produced: 1000,
        efficiency: 92.3,
        downtime: 1.5,
      },
      {
        id: '2',
        date: '2025-11-02',
        units_produced: 900,
        efficiency: 88.5,
        downtime: 2.5,
      },
    ]);

    await renderWithClient();

    await waitFor(() => {
      expect(screen.getByText(/average efficiency/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/units produced \(period\)/i)).toBeInTheDocument();
    expect(screen.getByText(/recent production runs/i)).toBeInTheDocument();
  });
});
