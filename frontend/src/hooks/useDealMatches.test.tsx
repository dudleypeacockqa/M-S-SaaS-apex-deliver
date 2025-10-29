import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { useDealMatches } from './useDealMatches'
import * as dealMatchingService from '../services/dealMatchingService'

vi.mock('../services/dealMatchingService', () => ({
  listDealMatches: vi.fn(),
}))

const mockMatches = [
  {
    dealId: 'deal-1',
    matchedDealId: 'deal-2',
    dealName: 'Acme vs Beta',
    score: 82,
    confidence: 'high',
    explanation: {
      industry_match: { score: 1, reason: 'Same industry' },
      size_match: { score: 0.8, reason: 'Similar deal size' },
      geography_match: { score: 0.7, reason: 'Both UK-based' },
      description_match: { score: 0.9, reason: 'Strong overlap' },
    },
  },
]

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('useDealMatches', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches stored matches for a deal', async () => {
    vi.mocked(dealMatchingService.listDealMatches).mockResolvedValue(mockMatches as any)

    const { result } = renderHook(() => useDealMatches('deal-1'), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockMatches)
    expect(dealMatchingService.listDealMatches).toHaveBeenCalledWith('deal-1')
  })

  it('does not run query when deal id missing', async () => {
    const { result } = renderHook(() => useDealMatches(undefined), { wrapper })

    expect(result.current.isLoading).toBe(false)
    expect(dealMatchingService.listDealMatches).not.toHaveBeenCalled()
  })
})
