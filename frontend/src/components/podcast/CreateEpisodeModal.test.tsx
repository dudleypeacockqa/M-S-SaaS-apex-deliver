import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { CreateEpisodeModal } from './CreateEpisodeModal';
import { useFeatureAccess } from '../../hooks/useFeatureAccess';
import { useSubscriptionTier } from '../../hooks/useSubscriptionTier';

vi.mock('../../hooks/useFeatureAccess', () => ({
  useFeatureAccess: vi.fn(),
}));

vi.mock('../../hooks/useSubscriptionTier', () => ({
  useSubscriptionTier: vi.fn(),
}));

describe('CreateEpisodeModal feature gating', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const baseProps = {
    open: true,
    onClose: vi.fn(),
    onSubmit: vi.fn(),
    isSubmitting: false,
  };

  beforeEach(() => {
    vi.mocked(useFeatureAccess).mockReturnValue({
      feature: 'podcast_video',
      hasAccess: true,
      tier: 'premium',
      tierLabel: 'Premium',
      requiredTier: 'premium',
      requiredTierLabel: 'Premium',
      upgradeRequired: false,
      upgradeMessage: null,
      upgradeCtaUrl: null,
      isLoading: false,
      isFetched: true,
      error: null,
    });
    vi.mocked(useSubscriptionTier).mockReturnValue({
      tier: 'premium',
      label: 'Premium',
      isLoading: false,
      isLoaded: true,
      error: null,
      hasOrganization: true,
      isAtLeast: () => true,
      requiresUpgrade: () => false,
    });
  });

  it('renders video URL field when feature access granted', () => {
    render(<CreateEpisodeModal {...baseProps} />, { wrapper });

    expect(screen.getByLabelText(/video file url/i)).toBeInTheDocument();
  });

  it('shows upgrade messaging when video access denied', () => {
    vi.mocked(useFeatureAccess).mockReturnValue({
      feature: 'podcast_video',
      hasAccess: false,
      tier: 'professional',
      tierLabel: 'Professional',
      requiredTier: 'premium',
      requiredTierLabel: 'Premium',
      upgradeRequired: true,
      upgradeMessage: 'Premium unlocks video uploads and YouTube publishing.',
      upgradeCtaUrl: '/pricing',
      isLoading: false,
      isFetched: true,
      error: null,
    });
    vi.mocked(useSubscriptionTier).mockReturnValue({
      tier: 'professional',
      label: 'Professional',
      isLoading: false,
      isLoaded: true,
      error: null,
      hasOrganization: true,
      isAtLeast: (required: string) => required !== 'premium' && required !== 'enterprise',
      requiresUpgrade: (required: string) => required === 'premium' || required === 'enterprise',
    });

    render(<CreateEpisodeModal {...baseProps} />, { wrapper });

    expect(screen.getByText(/video uploads locked/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/video file url/i)).not.toBeInTheDocument();
  });
});
