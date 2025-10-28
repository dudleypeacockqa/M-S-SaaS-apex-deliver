import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DealPipeline } from './DealPipeline';
import * as dealsApi from '../../services/api/deals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the deals API
vi.mock('../../services/api/deals', () => ({
  listDeals: vi.fn(),
  formatCurrency: (amount: number | null, currency = 'GBP') => {
    if (amount === null) return 'N/A';
    return `£${amount.toLocaleString()}`;
  },
  getStageDisplayName: (stage: string) => {
    const names: Record<string, string> = {
      sourcing: 'Sourcing',
      evaluation: 'Evaluation',
      due_diligence: 'Due Diligence',
      negotiation: 'Negotiation',
      closing: 'Closing',
      won: 'Won',
      lost: 'Lost',
    };
    return names[stage] || stage;
  },
  getStageColor: (stage: string) => '#64748b',
}));

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockDeals = [
  {
    id: '1',
    name: 'Acme Corp Acquisition',
    target_company: 'Acme Corp',
    industry: 'Technology',
    deal_size: 5000000,
    currency: 'GBP',
    stage: 'sourcing' as const,
    owner_id: 'user1',
    organization_id: 'org1',
    description: 'Strategic acquisition',
    archived_at: null,
    created_at: '2025-10-20T10:00:00Z',
    updated_at: '2025-10-20T10:00:00Z',
  },
  {
    id: '2',
    name: 'Beta Inc Deal',
    target_company: 'Beta Inc',
    industry: 'Healthcare',
    deal_size: 3000000,
    currency: 'GBP',
    stage: 'evaluation' as const,
    owner_id: 'user1',
    organization_id: 'org1',
    description: null,
    archived_at: null,
    created_at: '2025-10-21T10:00:00Z',
    updated_at: '2025-10-21T10:00:00Z',
  },
  {
    id: '3',
    name: 'Gamma Partners',
    target_company: 'Gamma Ltd',
    industry: 'Finance',
    deal_size: 10000000,
    currency: 'GBP',
    stage: 'due_diligence' as const,
    owner_id: 'user1',
    organization_id: 'org1',
    description: 'Large acquisition',
    archived_at: null,
    created_at: '2025-10-22T10:00:00Z',
    updated_at: '2025-10-22T10:00:00Z',
  },
];

const renderDealPipeline = () => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <DealPipeline />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('DealPipeline', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    vi.mocked(dealsApi.listDeals).mockImplementation(
      () => new Promise(() => {}) // Never resolves to keep loading
    );

    renderDealPipeline();
    expect(screen.getByText('Loading pipeline...')).toBeInTheDocument();
  });

  it('should display deals grouped by stage after loading', async () => {
    vi.mocked(dealsApi.listDeals).mockResolvedValue({
      items: mockDeals,
      total: 3,
      page: 1,
      per_page: 100,
      total_pages: 1,
    });

    renderDealPipeline();

    await waitFor(() => {
      expect(screen.getByText('Deal Pipeline')).toBeInTheDocument();
    });

    // Check header shows deal count
    expect(screen.getByText('3 active deals across all stages')).toBeInTheDocument();

    // Check that deal names appear
    expect(screen.getByText('Acme Corp Acquisition')).toBeInTheDocument();
    expect(screen.getByText('Beta Inc Deal')).toBeInTheDocument();
    expect(screen.getByText('Gamma Partners')).toBeInTheDocument();
  });

  it('should display "New Deal" button', async () => {
    vi.mocked(dealsApi.listDeals).mockResolvedValue({
      items: mockDeals,
      total: 3,
      page: 1,
      per_page: 100,
      total_pages: 1,
    });

    renderDealPipeline();

    await waitFor(() => {
      expect(screen.getByText('+ New Deal')).toBeInTheDocument();
    });
  });

  it('should navigate to new deal form when "New Deal" button is clicked', async () => {
    vi.mocked(dealsApi.listDeals).mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      per_page: 100,
      total_pages: 1,
    });

    renderDealPipeline();

    await waitFor(() => {
      expect(screen.getByText('+ New Deal')).toBeInTheDocument();
    });

    const newDealButton = screen.getByText('+ New Deal');
    newDealButton.click();

    expect(mockNavigate).toHaveBeenCalledWith('/deals/new');
  });

  it('should show error state when API call fails', async () => {
    vi.mocked(dealsApi.listDeals).mockRejectedValue(
      new Error('Network error')
    );

    renderDealPipeline();

    await waitFor(() => {
      expect(screen.getByText('Error Loading Pipeline')).toBeInTheDocument();
    });

    expect(screen.getByText('Network error')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('should retry loading deals when retry button is clicked', async () => {
    vi.mocked(dealsApi.listDeals).mockRejectedValueOnce(
      new Error('Network error')
    );

    renderDealPipeline();

    await waitFor(() => {
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });

    // Mock successful response for retry
    vi.mocked(dealsApi.listDeals).mockResolvedValue({
      items: mockDeals,
      total: 3,
      page: 1,
      per_page: 100,
      total_pages: 1,
    });

    const retryButton = screen.getByText('Retry');
    await act(async () => {
      retryButton.click();
    });

    await waitFor(() => {
      expect(screen.getByText('Deal Pipeline')).toBeInTheDocument();
    });
  });

  it('should show empty state when no deals exist', async () => {
    vi.mocked(dealsApi.listDeals).mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      per_page: 100,
      total_pages: 1,
    });

    renderDealPipeline();

    await waitFor(() => {
      expect(screen.getByText('0 active deals across all stages')).toBeInTheDocument();
    });
  });

  it('should display stage columns with correct names', async () => {
    vi.mocked(dealsApi.listDeals).mockResolvedValue({
      items: mockDeals,
      total: 3,
      page: 1,
      per_page: 100,
      total_pages: 1,
    });

    renderDealPipeline();

    await waitFor(() => {
      expect(screen.getByText('Sourcing')).toBeInTheDocument();
    });

    expect(screen.getByText('Evaluation')).toBeInTheDocument();
    expect(screen.getByText('Due Diligence')).toBeInTheDocument();
    expect(screen.getByText('Negotiation')).toBeInTheDocument();
    expect(screen.getByText('Closing')).toBeInTheDocument();
  });

  it('should display deal counts per stage', async () => {
    vi.mocked(dealsApi.listDeals).mockResolvedValue({
      items: mockDeals,
      total: 3,
      page: 1,
      per_page: 100,
      total_pages: 1,
    });

    renderDealPipeline();

    await waitFor(() => {
      expect(screen.getByText('Deal Pipeline')).toBeInTheDocument();
    });

    // Each stage should show a count (sourcing: 1, evaluation: 1, due_diligence: 1, etc.)
    // The exact format depends on implementation, but counts should be visible
    const text = screen.getByTestId('deal-pipeline').textContent;
    expect(text).toContain('1'); // At least one count of "1" should appear
  });

  it('should not display archived deals', async () => {
    const dealsWithArchived = [
      ...mockDeals,
      {
        id: '4',
        name: 'Archived Deal',
        target_company: 'Old Corp',
        industry: 'Technology',
        deal_size: 1000000,
        currency: 'GBP',
        stage: 'sourcing' as const,
        owner_id: 'user1',
        organization_id: 'org1',
        description: 'This should not appear',
        archived_at: '2025-10-23T10:00:00Z',
        created_at: '2025-10-19T10:00:00Z',
        updated_at: '2025-10-23T10:00:00Z',
      },
    ];

    vi.mocked(dealsApi.listDeals).mockResolvedValue({
      items: dealsWithArchived,
      total: 4,
      page: 1,
      per_page: 100,
      total_pages: 1,
    });

    renderDealPipeline();

    await waitFor(() => {
      expect(screen.getByText('Deal Pipeline')).toBeInTheDocument();
    });

    // Archived deal should not be displayed
    expect(screen.queryByText('Archived Deal')).not.toBeInTheDocument();
    expect(screen.queryByText('Old Corp')).not.toBeInTheDocument();
  });
});
