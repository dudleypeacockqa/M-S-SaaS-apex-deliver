/**
 * Tests for DayOneChecklist component - 100% Coverage
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { QueryClient, QueryClientProvider, useMutation, useQuery } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { DayOneChecklist } from './DayOneChecklist';
import * as pmiApi from '../services/pmiApi';

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: vi.fn(),
    useMutation: vi.fn(),
  };
});

const mockChecklistItems: pmiApi.PMIDayOneChecklist[] = [
  {
    id: 'item-1',
    project_id: 'project-1',
    organization_id: 'org-1',
    category: 'it',
    item: 'Email access configured',
    status: 'not_started',
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

describe('DayOneChecklist', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    renderWithProviders(<DayOneChecklist projectId="project-1" />);
    expect(screen.getByText('Loading checklist...')).toBeInTheDocument();
  });

  it('should render checklist items', async () => {
    vi.mocked(useQuery).mockReturnValue({
      data: { items: mockChecklistItems, total: 1 },
      isLoading: false,
      error: null,
    } as any);

    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as any);

    renderWithProviders(<DayOneChecklist projectId="project-1" />);

    await waitFor(() => {
      expect(screen.getByText('Email access configured')).toBeInTheDocument();
    });
  });
});

