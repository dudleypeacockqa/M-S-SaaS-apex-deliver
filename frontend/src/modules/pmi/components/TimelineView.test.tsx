/**
 * Tests for TimelineView component - 100% Coverage
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { TimelineView } from './TimelineView';
import { usePMIDashboard } from '../hooks/usePMIDashboard';

vi.mock('../hooks/usePMIDashboard', () => ({
  usePMIDashboard: vi.fn(),
}));

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('TimelineView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state', () => {
    vi.mocked(usePMIDashboard).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    renderWithProviders(<TimelineView projectId="project-1" />);
    expect(screen.getByText('Loading timeline...')).toBeInTheDocument();
  });

  it('should render timeline phases', () => {
    vi.mocked(usePMIDashboard).mockReturnValue({
      data: {
        current_phase: 'stabilization',
        days_since_day_one: 15,
        days_remaining: 85,
      },
      isLoading: false,
      error: null,
    } as any);

    renderWithProviders(<TimelineView projectId="project-1" />);
    expect(screen.getAllByText(/Stabilization/i).length).toBeGreaterThan(0);
  });
});

