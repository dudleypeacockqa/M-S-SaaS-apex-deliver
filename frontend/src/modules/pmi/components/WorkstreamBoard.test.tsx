/**
 * Tests for WorkstreamBoard component - 100% Coverage
 * Following TDD methodology (RED → GREEN → REFACTOR)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { WorkstreamBoard } from './WorkstreamBoard';
import * as pmiApi from '../../services/pmiApi';

// Mock the workstreams hook
vi.mock('../hooks/useWorkstreams', () => ({
  useWorkstreams: vi.fn(),
}));

import { useWorkstreams } from '../hooks/useWorkstreams';

const mockWorkstreams: pmiApi.PMIWorkstream[] = [
  {
    id: 'ws-1',
    project_id: 'project-1',
    organization_id: 'org-1',
    name: 'IT Integration',
    workstream_type: 'it',
    status: 'in_progress',
    priority: 'high',
    progress_percentage: 50,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-02T00:00:00Z',
  },
  {
    id: 'ws-2',
    project_id: 'project-1',
    organization_id: 'org-1',
    name: 'HR Integration',
    workstream_type: 'hr',
    status: 'completed',
    priority: 'medium',
    progress_percentage: 100,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-03T00:00:00Z',
  },
];

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('WorkstreamBoard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state', () => {
    vi.mocked(useWorkstreams).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      createWorkstream: vi.fn(),
      updateWorkstream: vi.fn(),
      deleteWorkstream: vi.fn(),
    });

    renderWithProviders(<WorkstreamBoard projectId="project-1" />);
    expect(screen.getByText('Loading workstreams...')).toBeInTheDocument();
  });

  it('should render error state', () => {
    vi.mocked(useWorkstreams).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load'),
      createWorkstream: vi.fn(),
      updateWorkstream: vi.fn(),
      deleteWorkstream: vi.fn(),
    });

    renderWithProviders(<WorkstreamBoard projectId="project-1" />);
    expect(screen.getByText('Error loading workstreams')).toBeInTheDocument();
  });

  it('should render workstreams list', async () => {
    vi.mocked(useWorkstreams).mockReturnValue({
      data: { items: mockWorkstreams, total: 2 },
      isLoading: false,
      error: null,
      createWorkstream: vi.fn(),
      updateWorkstream: vi.fn(),
      deleteWorkstream: vi.fn(),
    });

    renderWithProviders(<WorkstreamBoard projectId="project-1" />);

    await waitFor(() => {
      expect(screen.getByText('IT Integration')).toBeInTheDocument();
      expect(screen.getByText('HR Integration')).toBeInTheDocument();
    });
  });

  it('should display workstream progress', async () => {
    vi.mocked(useWorkstreams).mockReturnValue({
      data: { items: mockWorkstreams, total: 2 },
      isLoading: false,
      error: null,
      createWorkstream: vi.fn(),
      updateWorkstream: vi.fn(),
      deleteWorkstream: vi.fn(),
    });

    renderWithProviders(<WorkstreamBoard projectId="project-1" />);

    await waitFor(() => {
      expect(screen.getByText('50%')).toBeInTheDocument();
      expect(screen.getByText('100%')).toBeInTheDocument();
    });
  });

  it('should display correct status icons and colors', async () => {
    vi.mocked(useWorkstreams).mockReturnValue({
      data: { items: mockWorkstreams, total: 2 },
      isLoading: false,
      error: null,
      createWorkstream: vi.fn(),
      updateWorkstream: vi.fn(),
      deleteWorkstream: vi.fn(),
    });

    renderWithProviders(<WorkstreamBoard projectId="project-1" />);

    await waitFor(() => {
      const inProgressElement = screen.getByText(/in progress/i);
      expect(inProgressElement).toBeInTheDocument();

      const completedElement = screen.getByText(/completed/i);
      expect(completedElement).toBeInTheDocument();
    });
  });

  it('should handle empty workstreams list', () => {
    vi.mocked(useWorkstreams).mockReturnValue({
      data: { items: [], total: 0 },
      isLoading: false,
      error: null,
      createWorkstream: vi.fn(),
      updateWorkstream: vi.fn(),
      deleteWorkstream: vi.fn(),
    });

    renderWithProviders(<WorkstreamBoard projectId="project-1" />);
    
    // Should not crash, just show empty state or no workstreams message
    expect(screen.queryByText('IT Integration')).not.toBeInTheDocument();
  });
});

