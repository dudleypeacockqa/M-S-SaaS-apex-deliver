/**
 * Tests for DEV-018 Phase 4: Matching Workspace Component
 * TDD RED phase - Write failing tests first
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import MatchingWorkspace from './MatchingWorkspace';

// Mock API service
vi.mock('../../services/dealMatchingService', () => ({
  fetchMatchCriteria: vi.fn(),
  createMatchCriteria: vi.fn(),
  findMatchesForDeal: vi.fn(),
  listDealMatches: vi.fn(),
}));

const mockMatchCriteria = [
  {
    id: 'criteria-1',
    name: 'Tech Acquisitions Q4',
    deal_type: 'buy_side',
    industries: ['saas', 'fintech'],
    min_deal_size: '1000000',
    max_deal_size: '10000000',
    geographies: ['UK', 'EU'],
    created_at: '2025-10-29T10:00:00Z',
  },
  {
    id: 'criteria-2',
    name: 'Healthcare Deals',
    deal_type: 'sell_side',
    industries: ['healthcare'],
    min_deal_size: '5000000',
    max_deal_size: '50000000',
    geographies: ['US'],
    created_at: '2025-10-28T15:30:00Z',
  },
];

const mockMatches = [
  {
    deal_id: 'deal-1',
    deal_name: 'SaaS Startup Acquisition',
    score: 85.5,
    confidence: 'high',
    explanation: {
      industry_match: { score: 0.95, reason: 'Strong industry alignment' },
      size_match: { score: 0.85, reason: 'Deal size within range' },
      geography_match: { score: 0.80, reason: 'Target geography match' },
      description_match: { score: 0.75, reason: 'Semantic similarity detected' },
    },
  },
  {
    deal_id: 'deal-2',
    deal_name: 'FinTech Platform',
    score: 72.3,
    confidence: 'medium',
    explanation: {
      industry_match: { score: 0.70, reason: 'Related industry' },
      size_match: { score: 0.75, reason: 'Close to range' },
      geography_match: { score: 0.65, reason: 'Adjacent region' },
      description_match: { score: 0.78, reason: 'Partial description match' },
    },
  },
];

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </QueryClientProvider>
  );
}

describe('MatchingWorkspace', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render matching workspace with title and tabs', async () => {
      const { fetchMatchCriteria } = await import('../../services/dealMatchingService');
      vi.mocked(fetchMatchCriteria).mockResolvedValue(mockMatchCriteria);

      renderWithProviders(<MatchingWorkspace />);

      await waitFor(() => {
        expect(screen.getByText(/deal matching/i)).toBeInTheDocument();
      });

      expect(screen.getByRole('tab', { name: /criteria/i })).toBeInTheDocument();
    });

    it('should show loading state while fetching data', () => {
      renderWithProviders(<MatchingWorkspace />);

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should display error message when fetch fails', async () => {
      const { fetchMatchCriteria } = await import('../../services/dealMatchingService');
      vi.mocked(fetchMatchCriteria).mockRejectedValue(new Error('Network error'));

      renderWithProviders(<MatchingWorkspace />);

      await waitFor(() => {
        expect(screen.getByText(/error loading/i)).toBeInTheDocument();
      });
    });
  });

  describe('Criteria Management', () => {
    it('should list all saved criteria', async () => {
      const { fetchMatchCriteria } = await import('../../services/dealMatchingService');
      vi.mocked(fetchMatchCriteria).mockResolvedValue(mockMatchCriteria);

      renderWithProviders(<MatchingWorkspace />);

      await waitFor(() => {
        expect(screen.getByText('Tech Acquisitions Q4')).toBeInTheDocument();
        expect(screen.getByText('Healthcare Deals')).toBeInTheDocument();
      });
    });

    it('should show create criteria button', async () => {
      const { fetchMatchCriteria } = await import('../../services/dealMatchingService');
      vi.mocked(fetchMatchCriteria).mockResolvedValue([]);

      renderWithProviders(<MatchingWorkspace />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /create criteria/i })).toBeInTheDocument();
      });
    });

    it('should display criteria details (industries, size, geography)', async () => {
      const { fetchMatchCriteria } = await import('../../services/dealMatchingService');
      vi.mocked(fetchMatchCriteria).mockResolvedValue(mockMatchCriteria);

      renderWithProviders(<MatchingWorkspace />);

      await waitFor(() => {
        expect(screen.getByText(/saas/i)).toBeInTheDocument();
        expect(screen.getByText(/fintech/i)).toBeInTheDocument();
        expect(screen.getByText(/£1\.0M - £10\.0M/i)).toBeInTheDocument();
      });
    });
  });

  describe('Match Discovery', () => {
    it('should display match results with scores', async () => {
      const { listDealMatches } = await import('../../services/dealMatchingService');
      vi.mocked(listDealMatches).mockResolvedValue(mockMatches);

      renderWithProviders(<MatchingWorkspace dealId="test-deal-1" activeTab="matches" />);

      await waitFor(() => {
        expect(screen.getByText('SaaS Startup Acquisition')).toBeInTheDocument();
        expect(screen.getByText(/85\.5/)).toBeInTheDocument();
        expect(screen.getByText(/high/i)).toBeInTheDocument();
      });
    });

    it('should show confidence badges (high/medium/low)', async () => {
      const { listDealMatches } = await import('../../services/dealMatchingService');
      vi.mocked(listDealMatches).mockResolvedValue(mockMatches);

      renderWithProviders(<MatchingWorkspace dealId="test-deal-1" activeTab="matches" />);

      await waitFor(() => {
        expect(screen.getByText(/high/i)).toBeInTheDocument();
        expect(screen.getByText(/medium/i)).toBeInTheDocument();
      });
    });

    it('should display match explanation details', async () => {
      const { listDealMatches } = await import('../../services/dealMatchingService');
      vi.mocked(listDealMatches).mockResolvedValue(mockMatches);

      renderWithProviders(<MatchingWorkspace dealId="test-deal-1" activeTab="matches" />);

      await waitFor(() => {
        expect(screen.getByText(/strong industry alignment/i)).toBeInTheDocument();
      });
    });

    it('should show empty state when no matches found', async () => {
      const { listDealMatches } = await import('../../services/dealMatchingService');
      vi.mocked(listDealMatches).mockResolvedValue([]);

      renderWithProviders(<MatchingWorkspace dealId="test-deal-1" activeTab="matches" />);

      await waitFor(() => {
        expect(screen.getByText(/no matches found/i)).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions', () => {
    it('should allow switching between tabs', async () => {
      const { fetchMatchCriteria, listDealMatches } = await import('../../services/dealMatchingService');
      vi.mocked(fetchMatchCriteria).mockResolvedValue(mockMatchCriteria);
      vi.mocked(listDealMatches).mockResolvedValue([]);

      renderWithProviders(<MatchingWorkspace dealId="test-deal-1" />);

      // Wait for component to load
      const criteriaTab = await screen.findByRole('tab', { name: /criteria/i });
      const matchesTab = await screen.findByRole('tab', { name: /matches/i });

      // Initially criteria tab should be selected
      expect(criteriaTab).toHaveAttribute('aria-selected', 'true');
      expect(matchesTab).toHaveAttribute('aria-selected', 'false');

      // Click matches tab
      fireEvent.click(matchesTab);

      // Matches tab should now be selected
      await waitFor(() => {
        expect(matchesTab).toHaveAttribute('aria-selected', 'true');
        expect(criteriaTab).toHaveAttribute('aria-selected', 'false');
      });
    });

    it('should trigger find matches action', async () => {
      const { fetchMatchCriteria, findMatchesForDeal } = await import('../../services/dealMatchingService');
      vi.mocked(fetchMatchCriteria).mockResolvedValue(mockMatchCriteria);
      vi.mocked(findMatchesForDeal).mockResolvedValue({ matches: mockMatches, total_count: 2 });

      renderWithProviders(<MatchingWorkspace dealId="test-deal-1" activeTab="matches" />);

      const findButton = await screen.findByRole('button', { name: /find matches/i });
      fireEvent.click(findButton);

      await waitFor(() => {
        expect(findMatchesForDeal).toHaveBeenCalledWith('test-deal-1', expect.any(Object));
      });
    });
  });

  describe('Tier Gating', () => {
    it('should show upgrade prompt for Starter tier users', async () => {
      // Mock user with Starter tier
      renderWithProviders(<MatchingWorkspace userTier="starter" />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /upgrade to professional/i })).toBeInTheDocument();
        expect(screen.getByText(/unlock deal matching/i)).toBeInTheDocument();
      });
    });

    it('should allow access for Professional+ tier users', async () => {
      const { fetchMatchCriteria } = await import('../../services/dealMatchingService');
      vi.mocked(fetchMatchCriteria).mockResolvedValue(mockMatchCriteria);

      renderWithProviders(<MatchingWorkspace userTier="professional" />);

      await waitFor(() => {
        expect(screen.queryByText(/upgrade to professional/i)).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create criteria/i })).toBeInTheDocument();
      });
    });
  });
});
