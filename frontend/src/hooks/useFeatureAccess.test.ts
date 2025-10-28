import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { featureQueryKey, useFeatureAccess } from './useFeatureAccess';

vi.mock('../services/api', () => {
  return {
    api: {
      get: vi.fn(),
    },
  };
});

const { api } = await import('../services/api');

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
    api.get.mockResolvedValueOnce({ data: { hasAccess: false, tier: 'starter' } });

    const { result } = renderHook(() => useFeatureAccess({ feature: 'podcast_audio' }), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.hasAccess).toBe(false);
    expect(result.current.tier).toBe('starter');
  });

  it('exposes access=true for professional tiers on podcast_audio', async () => {
    api.get.mockResolvedValueOnce({
      data: { hasAccess: true, tier: 'professional', requiredTier: 'professional' },
    });

    const { result } = renderHook(() => useFeatureAccess({ feature: 'podcast_audio' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.hasAccess).toBe(true);
    expect(result.current.tier).toBe('professional');
    expect(result.current.requiredTier).toBe('professional');
  });

  it('exposes access=false for professional tier requesting podcast_video', async () => {
    api.get.mockResolvedValueOnce({
      data: {
        hasAccess: false,
        tier: 'professional',
        requiredTier: 'premium',
      },
    });

    const { result } = renderHook(() => useFeatureAccess({ feature: 'podcast_video' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasAccess).toBe(false);
    expect(result.current.tier).toBe('professional');
    expect(result.current.requiredTier).toBe('premium');
  });

  it('supports disabled state for lazy evaluation', () => {
    const { result } = renderHook(
      () => useFeatureAccess({ feature: 'podcast_audio', enabled: false }),
      {
        wrapper: createWrapper(),
      },
    );

    expect(api.get).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.tier).toBe('starter');
  });

  it('provides stable query key helper', () => {
    expect(featureQueryKey('podcast_audio')).toEqual(['feature-access', 'podcast_audio']);
  });
});
