/**
 * TDD Phase 1 (RED): Tests for podcast FeatureGate component
 *
 * FeatureGate component controls access to tier-gated podcast features
 * and displays upgrade CTAs when users lack access.
 *
 * Requirements from DEV-016:
 * - Check feature access via API (/podcasts/features/{feature})
 * - Show children when access granted
 * - Show upgrade CTA when access denied
 * - Handle loading and error states
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FeatureGate } from './FeatureGate';

// Mock API client
vi.mock('../../services/api/podcasts', () => ({
  checkFeatureAccess: vi.fn(),
}));

import { checkFeatureAccess } from '../../services/api/podcasts';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe('FeatureGate', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe('Access Granted', () => {
    it('should render children when user has access', async () => {
      vi.mocked(checkFeatureAccess).mockResolvedValue({
        feature: 'podcast_audio',
        tier: 'professional',
        has_access: true,
        required_tier: 'professional',
      });

      render(
        <FeatureGate feature="podcast_audio">
          <div>Podcast Content</div>
        </FeatureGate>,
        { wrapper }
      );

      await waitFor(() => {
        expect(screen.getByText('Podcast Content')).toBeInTheDocument();
      });
    });

    it('should not render upgrade CTA when access granted', async () => {
      vi.mocked(checkFeatureAccess).mockResolvedValue({
        feature: 'podcast_audio',
        tier: 'premium',
        has_access: true,
        required_tier: 'professional',
      });

      render(
        <FeatureGate feature="podcast_audio">
          <div>Podcast Content</div>
        </FeatureGate>,
        { wrapper }
      );

      await waitFor(() => {
        expect(screen.getByText('Podcast Content')).toBeInTheDocument();
      });

      expect(screen.queryByText(/upgrade/i)).not.toBeInTheDocument();
    });
  });

  describe('Access Denied', () => {
    it('should render upgrade CTA when user lacks access', async () => {
      vi.mocked(checkFeatureAccess).mockResolvedValue({
        feature: 'podcast_audio',
        tier: 'starter',
        has_access: false,
        required_tier: 'professional',
      });

      render(
        <FeatureGate feature="podcast_audio">
          <div>Podcast Content</div>
        </FeatureGate>,
        { wrapper }
      );

      await waitFor(() => {
        expect(screen.getByText('Upgrade Required')).toBeInTheDocument();
      });
    });

    it('should not render children when access denied', async () => {
      vi.mocked(checkFeatureAccess).mockResolvedValue({
        feature: 'podcast_video',
        tier: 'professional',
        has_access: false,
        required_tier: 'premium',
      });

      render(
        <FeatureGate feature="podcast_video">
          <div>Video Content</div>
        </FeatureGate>,
        { wrapper }
      );

      await waitFor(() => {
        expect(screen.getByText('Upgrade Required')).toBeInTheDocument();
      });

      expect(screen.queryByText('Video Content')).not.toBeInTheDocument();
    });

    it('should display required tier in upgrade CTA', async () => {
      vi.mocked(checkFeatureAccess).mockResolvedValue({
        feature: 'podcast_video',
        tier: 'professional',
        has_access: false,
        required_tier: 'premium',
      });

      render(
        <FeatureGate feature="podcast_video">
          <div>Video Content</div>
        </FeatureGate>,
        { wrapper }
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /upgrade to premium/i })).toBeInTheDocument();
      });
    });
  });

  describe('Loading State', () => {
    it('should show loading indicator while checking access', () => {
      vi.mocked(checkFeatureAccess).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(
        <FeatureGate feature="podcast_audio">
          <div>Podcast Content</div>
        </FeatureGate>,
        { wrapper }
      );

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should deny access by default when API fails', async () => {
      vi.mocked(checkFeatureAccess).mockRejectedValue(
        new Error('Network error')
      );

      render(
        <FeatureGate feature="podcast_audio">
          <div>Podcast Content</div>
        </FeatureGate>,
        { wrapper }
      );

      await waitFor(() => {
        expect(screen.getByText('Upgrade Required')).toBeInTheDocument();
      });

      expect(screen.queryByText('Podcast Content')).not.toBeInTheDocument();
    });

    it('should display error message when API fails', async () => {
      vi.mocked(checkFeatureAccess).mockRejectedValue(
        new Error('Network error')
      );

      render(
        <FeatureGate feature="podcast_audio">
          <div>Podcast Content</div>
        </FeatureGate>,
        { wrapper }
      );

      await waitFor(() => {
        expect(screen.getByText(/Error checking feature access/i)).toBeInTheDocument();
      });
    });
  });
});
