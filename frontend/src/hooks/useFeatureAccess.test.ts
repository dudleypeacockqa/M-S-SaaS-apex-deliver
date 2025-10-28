import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { featureQueryKey, useFeatureAccess } from './useFeatureAccess';

vi.mock('../services/api/podcasts', () => ({
  checkFeatureAccess: vi.fn(),
}));

const { checkFeatureAccess } = await import('../services/api/podcasts');

const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

afterEach(() => {
  vi.clearAllMocks();
});

describe('useFeatureAccess', () => {
  it('returns hasAccess=false while loading', async () => {
    vi.mocked(checkFeatureAccess).mockResolvedValueOnce({
      feature: 'podcast_audio',
      tier: 'starter',
      tierLabel: 'Starter',
      hasAccess: false,
      requiredTier: 'professional',
      requiredTierLabel: 'Professional',
      upgradeRequired: true,
      upgradeMessage: 'Upgrade to Professional tier to unlock audio podcasting.',
      upgradeCtaUrl: '/pricing',
    });

    const { result } = renderHook(() => useFeatureAccess({ feature: 'podcast_audio' }), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.hasAccess).toBe(false);
    expect(result.current.tier).toBe('starter');
  });

  it('exposes access=true for professional tiers on podcast_audio', async () => {
    vi.mocked(checkFeatureAccess).mockResolvedValueOnce({
      feature: 'podcast_audio',
      tier: 'professional',
      tierLabel: 'Professional',
      hasAccess: true,
      requiredTier: 'professional',
      requiredTierLabel: 'Professional',
      upgradeRequired: false,
      upgradeMessage: null,
      upgradeCtaUrl: null,
    });

    const { result } = renderHook(() => useFeatureAccess({ feature: 'podcast_audio' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.hasAccess).toBe(true);
    expect(result.current.tierLabel).toBe('Professional');
    expect(result.current.requiredTier).toBe('professional');
  });

  it('exposes access=false for professional tier requesting podcast_video', async () => {
    vi.mocked(checkFeatureAccess).mockResolvedValueOnce({
      feature: 'podcast_video',
      tier: 'professional',
      tierLabel: 'Professional',
      hasAccess: false,
      requiredTier: 'premium',
      requiredTierLabel: 'Premium',
      upgradeRequired: true,
      upgradeMessage: 'Upgrade to Premium tier to unlock video podcasting.',
      upgradeCtaUrl: '/pricing',
    });

    const { result } = renderHook(() => useFeatureAccess({ feature: 'podcast_video' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasAccess).toBe(false);
    expect(result.current.requiredTierLabel).toBe('Premium');
    expect(result.current.upgradeMessage).toMatch(/video podcasting/);
  });

  it('supports disabled state for lazy evaluation', () => {
    const { result } = renderHook(
      () => useFeatureAccess({ feature: 'podcast_audio', enabled: false }),
      {
        wrapper: createWrapper(),
      },
    );

    expect(checkFeatureAccess).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.tier).toBe('starter');
  });

  it('provides stable query key helper', () => {
    expect(featureQueryKey('podcast_audio')).toEqual(['feature-access', 'podcast_audio']);
  });
});
