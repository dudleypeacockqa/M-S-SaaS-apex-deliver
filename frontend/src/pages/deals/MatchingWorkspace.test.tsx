/**
 * Tests for DEV-018 Phase 4: Matching Workspace Component
 * TDD RED phase - Write failing tests first
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import MatchingWorkspace from './MatchingWorkspace';

// Mock API service
vi.mock('../../services/dealMatchingService', () => ({
  fetchMatchCriteria: vi.fn(),
  createMatchCriteria: vi.fn(),
  findMatchesForDeal: vi.fn(),
  listDealMatches: vi.fn(),
  recordMatchAction: vi.fn(),
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
    id: 'match-1',
    dealId: 'deal-1',
    matchedDealId: 'matched-deal-1',
    dealName: 'SaaS Startup Acquisition',
    score: 85.5,
    confidence: 'high' as const,
    explanation: {
      industry_match: { score: 0.95, reason: 'Strong industry alignment' },
      size_match: { score: 0.85, reason: 'Deal size within range' },
      geography_match: { score: 0.80, reason: 'Target geography match' },
      description_match: { score: 0.75, reason: 'Semantic similarity detected' },
    },
    status: 'saved',
  },
  {
    id: 'match-2',
    dealId: 'deal-2',
    matchedDealId: 'matched-deal-2',
    dealName: 'FinTech Platform',
    score: 72.3,
    confidence: 'medium' as const,
    explanation: {
      industry_match: { score: 0.70, reason: 'Related industry' },
      size_match: { score: 0.75, reason: 'Close to range' },
      geography_match: { score: 0.65, reason: 'Adjacent region' },
      description_match: { score: 0.78, reason: 'Partial description match' },
    },
    status: 'viewed',
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
      const { fetchMatchCriteria, listDealMatches } = await import('../../services/dealMatchingService');
      vi.mocked(fetchMatchCriteria).mockResolvedValue(mockMatchCriteria);
      vi.mocked(listDealMatches).mockResolvedValue(mockMatches);

      renderWithProviders(<MatchingWorkspace dealId="test-deal-1" activeTab="matches" />);

      await waitFor(() => {
        expect(screen.getByText('SaaS Startup Acquisition')).toBeInTheDocument();
        const scoreBadges = screen.getAllByTestId('score-badge');
        expect(scoreBadges).toHaveLength(2);
        expect(scoreBadges[0]).toHaveTextContent('86%');
        expect(scoreBadges[1]).toHaveTextContent('72%');
      });
    });

    it('should show confidence badges (high/medium/low)', async () => {
      const { fetchMatchCriteria, listDealMatches } = await import('../../services/dealMatchingService');
      vi.mocked(fetchMatchCriteria).mockResolvedValue(mockMatchCriteria);
      vi.mocked(listDealMatches).mockResolvedValue(mockMatches);

      renderWithProviders(<MatchingWorkspace dealId="test-deal-1" activeTab="matches" />);

      await waitFor(() => {
        const badges = screen.getAllByTestId('score-badge');
        expect(badges[0]).toHaveTextContent(/High/i);
        expect(badges[1]).toHaveTextContent(/Medium/i);
      });
    });

    it('should display match explanation details', async () => {
      const { fetchMatchCriteria, listDealMatches } = await import('../../services/dealMatchingService');
      vi.mocked(fetchMatchCriteria).mockResolvedValue(mockMatchCriteria);
      vi.mocked(listDealMatches).mockResolvedValue(mockMatches);

      renderWithProviders(<MatchingWorkspace dealId="test-deal-1" activeTab="matches" />);

      await waitFor(() => {
        expect(screen.getByText(/strong industry alignment/i)).toBeInTheDocument();
      });
    });

    it('should show empty state when no matches found', async () => {
      const { fetchMatchCriteria, listDealMatches } = await import('../../services/dealMatchingService');
      vi.mocked(fetchMatchCriteria).mockResolvedValue(mockMatchCriteria);
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

  describe('Match Actions Workflow', () => {
    it('records view action and opens detail modal', async () => {
      const { fetchMatchCriteria, listDealMatches, recordMatchAction } = await import('../../services/dealMatchingService');
      vi.mocked(fetchMatchCriteria).mockResolvedValue(mockMatchCriteria);
      vi.mocked(listDealMatches).mockResolvedValue(mockMatches);
      const recordActionMock = vi.mocked(recordMatchAction).mockResolvedValue({
        id: 'action-view',
        match_id: 'match-1',
        user_id: 'user-1',
        action: 'view',
        metadata: {},
        created_at: '2025-10-29T12:00:00Z',
      });

      renderWithProviders(<MatchingWorkspace dealId="deal-123" activeTab="matches" />);

      const viewButtons = await screen.findAllByRole('button', { name: /view details/i });
      const viewButton = viewButtons[0];
      fireEvent.click(viewButton);

      await waitFor(() => {
        expect(recordActionMock).toHaveBeenCalledWith('match-1', expect.objectContaining({ action: 'view' }));
      });

      const detailModal = await screen.findByRole('dialog');
      expect(within(detailModal).getByText(mockMatches[0].dealName)).toBeInTheDocument();
    });

    it('records save and pass actions from match cards', async () => {
      const { fetchMatchCriteria, listDealMatches, recordMatchAction } = await import('../../services/dealMatchingService');
      vi.mocked(fetchMatchCriteria).mockResolvedValue(mockMatchCriteria);
      vi.mocked(listDealMatches).mockResolvedValue(mockMatches);
      const recordActionMock = vi.mocked(recordMatchAction).mockResolvedValue({
        id: 'action-save',
        match_id: 'match-1',
        user_id: 'user-1',
        action: 'save',
        metadata: {},
        created_at: '2025-10-29T12:05:00Z',
      });

      renderWithProviders(<MatchingWorkspace dealId="deal-123" activeTab="matches" />);

      const saveButtons = await screen.findAllByRole('button', { name: /save match/i });
      fireEvent.click(saveButtons[0]);

      await waitFor(() => {
        expect(recordActionMock).toHaveBeenCalledWith('match-1', expect.objectContaining({ action: 'save' }));
      });

      const passButtons = screen.getAllByRole('button', { name: /pass/i });
      fireEvent.click(passButtons[0]);

      await waitFor(() => {
        expect(recordActionMock).toHaveBeenCalledWith('match-1', expect.objectContaining({ action: 'pass' }));
      });
    });

    it('opens introduction request modal from detail view', async () => {
      const { fetchMatchCriteria, listDealMatches, recordMatchAction } = await import('../../services/dealMatchingService');
      vi.mocked(fetchMatchCriteria).mockResolvedValue(mockMatchCriteria);
      vi.mocked(listDealMatches).mockResolvedValue(mockMatches);
      vi.mocked(recordMatchAction).mockResolvedValue({
        id: 'action-view',
        match_id: 'match-1',
        user_id: 'user-1',
        action: 'view',
        metadata: {},
        created_at: '2025-10-29T12:10:00Z',
      });

      renderWithProviders(<MatchingWorkspace dealId="deal-123" activeTab="matches" />);

      const viewButtons = await screen.findAllByRole('button', { name: /view details/i });
      fireEvent.click(viewButtons[0]);

      const detailModal = await screen.findByRole('dialog');
      const requestIntroButton = within(detailModal).getByRole('button', { name: /request introduction/i });
      fireEvent.click(requestIntroButton);

      const introModal = await screen.findByRole('dialog', { name: /request introduction/i });
      expect(within(introModal).getByLabelText(/introduction message/i)).toBeInTheDocument();
    });
  });

  describe('Match Analytics', () => {
    it('displays analytics widgets summarising matches', async () => {
      const analyticsMatches = [
        {
          id: 'analytics-1',
          dealId: 'deal-a',
          matchedDealId: 'matched-a',
          dealName: 'AI Automation Platform',
          score: 90,
          confidence: 'high' as const,
          explanation: {
            industry_match: { score: 0.9, reason: 'Category leader match' },
            size_match: { score: 0.85, reason: 'Aligned revenue band' },
            geography_match: { score: 0.8, reason: 'Same primary market' },
            description_match: { score: 0.88, reason: 'High semantic similarity' },
          },
          status: 'saved',
        },
        {
          id: 'analytics-2',
          dealId: 'deal-b',
          matchedDealId: 'matched-b',
          dealName: 'FinOps SaaS',
          score: 70,
          confidence: 'medium' as const,
          explanation: {
            industry_match: { score: 0.7, reason: 'Same vertical' },
            size_match: { score: 0.65, reason: 'Slightly smaller' },
            geography_match: { score: 0.6, reason: 'Adjacent region' },
            description_match: { score: 0.7, reason: 'Strong narrative overlap' },
          },
          status: 'intro_requested',
        },
        {
          id: 'analytics-3',
          dealId: 'deal-c',
          matchedDealId: 'matched-c',
          dealName: 'Legacy ERP Divestiture',
          score: 50,
          confidence: 'low' as const,
          explanation: {
            industry_match: { score: 0.45, reason: 'Adjacent industry' },
            size_match: { score: 0.5, reason: 'Below preferred range' },
            geography_match: { score: 0.4, reason: 'Different core region' },
            description_match: { score: 0.55, reason: 'Moderate text similarity' },
          },
          status: 'passed',
        },
      ];

      const { fetchMatchCriteria, listDealMatches } = await import('../../services/dealMatchingService');
      vi.mocked(fetchMatchCriteria).mockResolvedValue(mockMatchCriteria);
      vi.mocked(listDealMatches).mockResolvedValue(analyticsMatches);

      renderWithProviders(<MatchingWorkspace dealId="analytics-deal" activeTab="matches" />);

      await waitFor(() => {
        expect(screen.getByText(/analytics overview/i)).toBeInTheDocument();
      });

      expect(screen.getByTestId('analytics-average')).toHaveTextContent('70%');
      expect(screen.getByTestId('analytics-success-rate')).toHaveTextContent('67%');
      expect(screen.getByTestId('analytics-intro-count')).toHaveTextContent('1');
      expect(screen.getByTestId('analytics-distribution-high')).toHaveTextContent('High (>=80): 1');
      expect(screen.getByTestId('analytics-distribution-medium')).toHaveTextContent('Medium (60-79): 1');
      expect(screen.getByTestId('analytics-distribution-low')).toHaveTextContent('Low (<60): 1');
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
