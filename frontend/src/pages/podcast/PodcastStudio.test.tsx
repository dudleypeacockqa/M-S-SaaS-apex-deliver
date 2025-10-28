/**
 * TDD Phase 1 (RED): Tests for Podcast Studio page component
 *
 * Requirements from DEV-016:
 * - Display podcast episodes list
 * - Show quota usage summary
 * - Allow creating new episodes (Professional+ tier)
 * - Allow editing existing episodes
 * - Gate video features to Premium+ tier
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { PodcastStudio } from './PodcastStudio';
import * as podcastApi from '../../services/api/podcasts';

// Mock the podcast API
vi.mock('../../services/api/podcasts', () => ({
  checkFeatureAccess: vi.fn(),
  getQuotaSummary: vi.fn(),
  listEpisodes: vi.fn(),
  getEpisode: vi.fn(),
  createEpisode: vi.fn(),
  updateEpisode: vi.fn(),
  deleteEpisode: vi.fn(),
  publishEpisodeToYouTube: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('PodcastStudio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Feature Access Gating', () => {
    it('should show upgrade prompt when user lacks podcast_audio access', async () => {
      vi.mocked(podcastApi.checkFeatureAccess).mockResolvedValue({
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

      render(<PodcastStudio />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText(/upgrade required/i)).toBeInTheDocument();
      });
      expect(screen.getByRole('button', { name: /upgrade to professional/i })).toBeInTheDocument();
    });

    it('should render episode list when user has access', async () => {
      vi.mocked(podcastApi.checkFeatureAccess).mockResolvedValue({
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
      vi.mocked(podcastApi.getQuotaSummary).mockResolvedValue({
        tier: 'professional',
        tierLabel: 'Professional',
        limit: 10,
        remaining: 7,
        used: 3,
        isUnlimited: false,
        period: '2025-10',
        quotaState: 'normal',
        warningStatus: null,
        warningMessage: null,
        upgradeRequired: false,
        upgradeMessage: null,
        upgradeCtaUrl: null,
      });
      vi.mocked(podcastApi.listEpisodes).mockResolvedValue([]);

      render(<PodcastStudio />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText(/podcast studio/i)).toBeInTheDocument();
      });
    });
  });

  describe('Quota Display', () => {
    beforeEach(() => {
      vi.mocked(podcastApi.checkFeatureAccess).mockResolvedValue({
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
      vi.mocked(podcastApi.listEpisodes).mockResolvedValue([]);
    });

    it('should display quota usage for Professional tier', async () => {
      vi.mocked(podcastApi.getQuotaSummary).mockResolvedValue({
        tier: 'professional',
        tierLabel: 'Professional',
        limit: 10,
        remaining: 7,
        used: 3,
        isUnlimited: false,
        period: '2025-10',
        quotaState: 'normal',
        warningStatus: null,
        warningMessage: null,
        upgradeRequired: false,
        upgradeMessage: null,
        upgradeCtaUrl: null,
      });

      render(<PodcastStudio />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText(/3 \/ 10/i)).toBeInTheDocument();
      });
    });

    it('should display "Unlimited" for Premium tier', async () => {
      vi.mocked(podcastApi.getQuotaSummary).mockResolvedValue({
        tier: 'premium',
        tierLabel: 'Premium',
        limit: null,
        remaining: -1,
        used: 15,
        isUnlimited: true,
        period: '2025-10',
        quotaState: 'normal',
        warningStatus: null,
        warningMessage: null,
        upgradeRequired: false,
        upgradeMessage: null,
        upgradeCtaUrl: null,
      });

      render(<PodcastStudio />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText(/unlimited/i)).toBeInTheDocument();
      });
    });

    it('should surface upgrade CTA when quota requires upgrade', async () => {
      vi.mocked(podcastApi.getQuotaSummary).mockResolvedValue({
        tier: 'professional',
        tierLabel: 'Professional',
        limit: 10,
        remaining: 0,
        used: 10,
        isUnlimited: false,
        period: '2025-10',
        quotaState: 'critical',
        warningStatus: 'critical',
        warningMessage: 'Monthly quota exceeded.',
        upgradeRequired: true,
        upgradeMessage: 'Upgrade to Premium tier for unlimited episodes.',
        upgradeCtaUrl: '/pricing',
      });

      render(<PodcastStudio />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText(/upgrade to premium tier for unlimited episodes/i)).toBeInTheDocument();
      });

      const newEpisodeButton = screen.getByRole('button', { name: /new episode/i });
      expect(newEpisodeButton).toBeDisabled();
      expect(screen.getByRole('button', { name: /view upgrade options/i })).toBeInTheDocument();
    });
  });

  describe('Episode List', () => {
    beforeEach(() => {
      vi.mocked(podcastApi.checkFeatureAccess).mockResolvedValue({
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
      vi.mocked(podcastApi.getQuotaSummary).mockResolvedValue({
        tier: 'professional',
        tierLabel: 'Professional',
        limit: 10,
        remaining: 7,
        used: 3,
        isUnlimited: false,
        period: '2025-10',
        quotaState: 'normal',
        warningStatus: null,
        warningMessage: null,
        upgradeRequired: false,
        upgradeMessage: null,
        upgradeCtaUrl: null,
      });
    });

    it('should display "No episodes" when list is empty', async () => {
      vi.mocked(podcastApi.listEpisodes).mockResolvedValue([]);

      render(<PodcastStudio />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText(/no episodes/i)).toBeInTheDocument();
      });
    });

    it('should display list of episodes with titles', async () => {
      vi.mocked(podcastApi.listEpisodes).mockResolvedValue([
        {
          id: 'ep-1',
          title: 'Episode 1: Introduction',
          description: 'First episode',
          episode_number: 1,
          season_number: 1,
          audio_file_url: 'https://cdn.example.com/ep1.mp3',
          video_file_url: null,
          status: 'published',
          created_by: 'user-1',
          organization_id: 'org-1',
          created_at: '2025-10-01T10:00:00Z',
          show_notes: null,
        },
        {
          id: 'ep-2',
          title: 'Episode 2: Deep Dive',
          description: 'Second episode',
          episode_number: 2,
          season_number: 1,
          audio_file_url: 'https://cdn.example.com/ep2.mp3',
          video_file_url: null,
          status: 'draft',
          created_by: 'user-1',
          organization_id: 'org-1',
          created_at: '2025-10-15T10:00:00Z',
          show_notes: null,
        },
      ]);

      render(<PodcastStudio />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Episode 1: Introduction')).toBeInTheDocument();
        expect(screen.getByText('Episode 2: Deep Dive')).toBeInTheDocument();
      });
    });

    it('should show episode status badges', async () => {
      vi.mocked(podcastApi.listEpisodes).mockResolvedValue([
        {
          id: 'ep-1',
          title: 'Published Episode',
          description: null,
          episode_number: 1,
          season_number: 1,
          audio_file_url: 'https://cdn.example.com/ep1.mp3',
          video_file_url: null,
          status: 'published',
          created_by: 'user-1',
          organization_id: 'org-1',
          created_at: '2025-10-01T10:00:00Z',
          show_notes: null,
        },
      ]);

      render(<PodcastStudio />, { wrapper: createWrapper() });

      await waitFor(() => {
        const badges = screen.getAllByText(/published/i);
        // Should have a status badge with "published" text
        expect(badges.length).toBeGreaterThan(0);
      });
    });
  });

  describe('YouTube Integration', () => {
    const audioAccess = {
      feature: 'podcast_audio',
      tier: 'professional',
      tierLabel: 'Professional',
      hasAccess: true,
      requiredTier: 'professional',
      requiredTierLabel: 'Professional',
      upgradeRequired: false,
      upgradeMessage: null,
      upgradeCtaUrl: null,
    } as const;

    const youtubeAccessGranted = {
      feature: 'youtube_integration',
      tier: 'premium',
      tierLabel: 'Premium',
      hasAccess: true,
      requiredTier: 'premium',
      requiredTierLabel: 'Premium',
      upgradeRequired: false,
      upgradeMessage: null,
      upgradeCtaUrl: null,
    } as const;

    const youtubeAccessDenied = {
      feature: 'youtube_integration',
      tier: 'professional',
      tierLabel: 'Professional',
      hasAccess: false,
      requiredTier: 'premium',
      requiredTierLabel: 'Premium',
      upgradeRequired: true,
      upgradeMessage: 'Upgrade to Premium tier to publish on YouTube.',
      upgradeCtaUrl: '/pricing',
    } as const;

    beforeEach(() => {
      vi.mocked(podcastApi.getQuotaSummary).mockResolvedValue({
        tier: 'professional',
        tierLabel: 'Professional',
        limit: 10,
        remaining: 7,
        used: 3,
        isUnlimited: false,
        period: '2025-10',
        quotaState: 'normal',
        warningStatus: null,
        warningMessage: null,
        upgradeRequired: false,
        upgradeMessage: null,
        upgradeCtaUrl: null,
      });
    });

    it('should show Publish to YouTube button for video episodes when integration access granted', async () => {
      vi.mocked(podcastApi.checkFeatureAccess).mockResolvedValueOnce(audioAccess);
      vi.mocked(podcastApi.checkFeatureAccess).mockResolvedValueOnce(youtubeAccessGranted);
      vi.mocked(podcastApi.listEpisodes).mockResolvedValue([
        {
          id: 'ep-youtube-1',
          title: 'Premium Video Episode',
          description: 'Video episode ready for YouTube',
          episode_number: 1,
          season_number: 1,
          audio_file_url: 'https://cdn.example.com/audio.mp3',
          video_file_url: 'https://cdn.example.com/video.mp4',
          status: 'draft',
          created_by: 'user-1',
          organization_id: 'org-1',
          created_at: '2025-10-20T10:00:00Z',
          show_notes: null,
        },
      ]);
      vi.mocked(podcastApi.publishEpisodeToYouTube).mockResolvedValue({ videoId: 'YT_12345' });

      const user = userEvent.setup();
      render(<PodcastStudio />, { wrapper: createWrapper() });

      const publishButton = await screen.findByRole('button', { name: /publish to youtube/i });
      expect(publishButton).toBeEnabled();

      await user.click(publishButton);

      await waitFor(() => {
        expect(podcastApi.publishEpisodeToYouTube).toHaveBeenCalledWith('ep-youtube-1');
      });
      expect(await screen.findByText(/published to youtube/i)).toBeInTheDocument();
    });

    it('should show upgrade button when youtube integration access denied', async () => {
      vi.mocked(podcastApi.checkFeatureAccess).mockResolvedValueOnce(audioAccess);
      vi.mocked(podcastApi.checkFeatureAccess).mockResolvedValueOnce(youtubeAccessDenied);
      vi.mocked(podcastApi.listEpisodes).mockResolvedValue([
        {
          id: 'ep-youtube-2',
          title: 'Video Episode',
          description: null,
          episode_number: 2,
          season_number: 1,
          audio_file_url: 'https://cdn.example.com/audio.mp3',
          video_file_url: 'https://cdn.example.com/video.mp4',
          status: 'draft',
          created_by: 'user-1',
          organization_id: 'org-1',
          created_at: '2025-10-21T10:00:00Z',
          show_notes: null,
        },
      ]);

      render(<PodcastStudio />, { wrapper: createWrapper() });

      const upgradeButton = await screen.findByRole('button', { name: /upgrade for youtube/i });
      expect(upgradeButton).toBeDisabled();
      expect(screen.getByText(/upgrade to premium tier to publish on youtube/i)).toBeInTheDocument();
    });
  });

  describe('Create Episode Button', () => {
    beforeEach(() => {
      vi.mocked(podcastApi.checkFeatureAccess).mockResolvedValue({
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
      vi.mocked(podcastApi.getQuotaSummary).mockResolvedValue({
        tier: 'professional',
        tierLabel: 'Professional',
        limit: 10,
        remaining: 7,
        used: 3,
        isUnlimited: false,
        period: '2025-10',
        quotaState: 'normal',
        warningStatus: null,
        warningMessage: null,
        upgradeRequired: false,
        upgradeMessage: null,
        upgradeCtaUrl: null,
      });
      vi.mocked(podcastApi.listEpisodes).mockResolvedValue([]);
    });

    it('should render "New Episode" button', async () => {
      render(<PodcastStudio />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /new episode/i })).toBeInTheDocument();
      });
    });

    it('should disable "New Episode" button when quota exceeded', async () => {
      vi.mocked(podcastApi.getQuotaSummary).mockResolvedValue({
        tier: 'professional',
        tierLabel: 'Professional',
        limit: 10,
        remaining: 0,
        used: 10,
        isUnlimited: false,
        period: '2025-10',
        quotaState: 'normal',
        warningStatus: null,
        warningMessage: null,
        upgradeRequired: false,
        upgradeMessage: null,
        upgradeCtaUrl: null,
      });

      render(<PodcastStudio />, { wrapper: createWrapper() });

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /new episode/i });
        expect(button).toBeDisabled();
      });
    });
  });
});
