import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'

import { usePMIAccess } from './usePMIAccess'
import { useFeatureAccess } from '../../../hooks/useFeatureAccess'

vi.mock('../../../hooks/useFeatureAccess', () => ({
  useFeatureAccess: vi.fn(),
}))

const mockedUseFeatureAccess = vi.mocked(useFeatureAccess)

describe('usePMIAccess', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns PMI access state from feature entitlement hook', () => {
    mockedUseFeatureAccess.mockReturnValue({
      feature: 'pmi_module',
      hasAccess: true,
      tier: 'professional',
      tierLabel: 'Professional',
      requiredTier: 'professional',
      requiredTierLabel: 'Professional',
      upgradeRequired: false,
      upgradeMessage: null,
      upgradeCtaUrl: '/pricing/pmi',
      isLoading: false,
      isFetched: true,
      error: null,
    } as any)

    const { result } = renderHook(() => usePMIAccess())

    expect(useFeatureAccess).toHaveBeenCalledWith({ feature: 'pmi_module' })
    expect(result.current).toEqual({
      hasAccess: true,
      isLoading: false,
      error: null,
      upgradeMessage: null,
      requiredTier: 'professional',
      upgradeCtaUrl: '/pricing/pmi',
    })
  })

  it('falls back to default upgrade CTA when entitlement lacks one', () => {
    const error = new Error('forbidden')
    mockedUseFeatureAccess.mockReturnValue({
      feature: 'pmi_module',
      hasAccess: false,
      tier: 'starter',
      tierLabel: 'Starter',
      requiredTier: 'professional',
      requiredTierLabel: 'Professional',
      upgradeRequired: true,
      upgradeMessage: 'Upgrade required',
      upgradeCtaUrl: null,
      isLoading: false,
      isFetched: true,
      error,
    } as any)

    const { result } = renderHook(() => usePMIAccess())

    expect(result.current.upgradeCtaUrl).toBe('/pricing')
    expect(result.current.error).toBe(error)
  })
})
