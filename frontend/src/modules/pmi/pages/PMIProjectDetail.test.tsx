/**
 * Tests for PMIProjectDetail page - 100% Coverage
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PMIProjectDetail } from './PMIProjectDetail';
import { usePMIDashboard } from '../hooks/usePMIDashboard';
import { usePMIProject } from '../hooks/usePMIProject';

vi.mock('../hooks/usePMIDashboard', () => ({
  usePMIDashboard: vi.fn(),
}));

vi.mock('../hooks/usePMIProject', () => ({
  usePMIProject: vi.fn(),
}));

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/pmi/projects/project-1']}>
        <Routes>
          <Route path="/pmi/projects/:projectId" element={ui} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('PMIProjectDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state', () => {
    vi.mocked(usePMIDashboard).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    vi.mocked(usePMIProject).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    renderWithProviders(<PMIProjectDetail />);
    expect(screen.getByText(/loading pmi project/i)).toBeInTheDocument();
  });

  it('should render project details', async () => {
    vi.mocked(usePMIDashboard).mockReturnValue({
      data: {
        project_id: 'project-1',
        synergy_realization_rate: 75.5,
        completed_workstreams: 3,
        total_workstreams: 7,
        critical_risks: 2,
        total_risks: 5,
        day_one_readiness_percentage: 80,
        current_phase: 'stabilization',
        workstreams_summary: [],
        top_risks: [],
      },
      isLoading: false,
      error: null,
    } as any);

    vi.mocked(usePMIProject).mockReturnValue({
      data: {
        id: 'project-1',
        name: 'Test PMI Project',
        description: 'Test description',
        status: 'active',
        organization_id: 'org-1',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-02T00:00:00Z',
      },
      isLoading: false,
      error: null,
    } as any);

    renderWithProviders(<PMIProjectDetail />);

    await waitFor(() => {
      expect(screen.getByText('Test PMI Project')).toBeInTheDocument();
    });
  });

  it('renders contextual help tooltip in detail header', async () => {
    vi.mocked(usePMIDashboard).mockReturnValue({
      data: {
        project_id: 'project-1',
        synergy_realization_rate: 60,
        completed_workstreams: 2,
        total_workstreams: 5,
        critical_risks: 1,
        total_risks: 4,
        day_one_readiness_percentage: 70,
        current_phase: 'integration',
        workstreams_summary: [],
        top_risks: [],
      },
      isLoading: false,
      error: null,
    } as any)

    vi.mocked(usePMIProject).mockReturnValue({
      data: {
        id: 'project-1',
        name: 'Help Tooltip Project',
        description: 'Help test',
        status: 'active',
        organization_id: 'org-1',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-02T00:00:00Z',
      },
      isLoading: false,
      error: null,
    } as any)

    renderWithProviders(<PMIProjectDetail />)

    await waitFor(() => {
      expect(screen.getByText('Help Tooltip Project')).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /pmi detail help/i })).toBeInTheDocument()
  })
});

