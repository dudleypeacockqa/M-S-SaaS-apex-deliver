import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDealMatches, useSaveMatch, useUpdateMatchStatus } from './useDealMatches';
import * as dealMatchingService from '../services/dealMatchingService';

// Mock the service
vi.mock('../services/dealMatchingService', () => ({
  findMatchesForDeal: vi.fn(),
  saveMatch: vi.fn(),
  updateMatchStatus: vi.fn(),
}));

const mockMatches = [
  {
    id: 'match-1',
    dealId: 'deal-1',
    dealName: 'Test Deal 1',
    score: 85.5,
    confidence: 'high',
  },
  {
    id: 'match-2',
    dealId: 'deal-1',
    dealName: 'Test Deal 2',
    score: 72.3,
    confidence: 'medium',
  },
];

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

describe('useDealMatches', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches matches for given deal ID', async () => {
    vi.mocked(dealMatchingService.findMatchesForDeal).mockResolvedValue({
      matches: mockMatches,
      total_count: 2,
    });

    const { result } = renderHook(() => useDealMatches('deal-1', 'criteria-1'), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockMatches);
    expect(dealMatchingService.findMatchesForDeal).toHaveBeenCalledWith(
      'deal-1',
      expect.objectContaining({ criteria_id: 'criteria-1' })
    );
  });

  it('returns empty array when no matches', async () => {
    vi.mocked(dealMatchingService.findMatchesForDeal).mockResolvedValue({
      matches: [],
      total_count: 0,
    });

    const { result } = renderHook(() => useDealMatches('deal-1', 'criteria-1'), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual([]);
  });

  it('handles API errors gracefully', async () => {
    vi.mocked(dealMatchingService.findMatchesForDeal).mockRejectedValue(
      new Error('Network error')
    );

    const { result } = renderHook(() => useDealMatches('deal-1', 'criteria-1'), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
  });
});

describe('useSaveMatch', () => {
  it('saves match and invalidates cache', async () => {
    vi.mocked(dealMatchingService.saveMatch).mockResolvedValue({
      id: 'match-1',
      status: 'saved',
    });

    const { result } = renderHook(() => useSaveMatch(), { wrapper });

    result.current.mutate({
      dealId: 'deal-1',
      matchedDealId: 'deal-2',
      score: 85.5,
      confidence: 'high',
      explanation: {},
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(dealMatchingService.saveMatch).toHaveBeenCalled();
  });
});

describe('useUpdateMatchStatus', () => {
  it('updates match status to saved', async () => {
    vi.mocked(dealMatchingService.updateMatchStatus).mockResolvedValue({
      id: 'match-1',
      status: 'saved',
    });

    const { result } = renderHook(() => useUpdateMatchStatus(), { wrapper });

    result.current.mutate({
      matchId: 'match-1',
      status: 'saved',
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(dealMatchingService.updateMatchStatus).toHaveBeenCalledWith('match-1', 'saved');
  });

  it('updates match status to passed', async () => {
    vi.mocked(dealMatchingService.updateMatchStatus).mockResolvedValue({
      id: 'match-1',
      status: 'passed',
    });

    const { result } = renderHook(() => useUpdateMatchStatus(), { wrapper });

    result.current.mutate({
      matchId: 'match-1',
      status: 'passed',
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(dealMatchingService.updateMatchStatus).toHaveBeenCalledWith('match-1', 'passed');
  });
});
