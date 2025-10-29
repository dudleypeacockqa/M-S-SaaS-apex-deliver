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
import { useSubscriptionTier, type SubscriptionTier } from '../../hooks/useSubscriptionTier';

// Mock the podcast API
vi.mock('../../services/api/podcasts', () => ({
  checkFeatureAccess: vi.fn(),
  getQuotaSummary: vi.fn(),
  listEpisodes: vi.fn(),
  getEpisode: vi.fn(),
  createEpisode: vi.fn(),
  updateEpisode: vi.fn(),
  deleteEpisode: vi.fn(),
  getYouTubeConnectionStatus: vi.fn(),
  initiateYouTubeOAuth: vi.fn(),
  publishEpisodeToYouTube: vi.fn(),
  transcribeEpisode: vi.fn(),
}));
vi.mock('../../components/podcast/LiveStreamManager', () => ({
  default: () => <div data-testid="mock-live-stream-manager" />,
}));

vi.mock('../../hooks/useSubscriptionTier', () => ({
  useSubscriptionTier: vi.fn(),
}));

const tierRank: Record<SubscriptionTier, number> = {
  starter: 0,
  professional: 1,
  premium: 2,
  enterprise: 3,
};

let activeTier: SubscriptionTier = 'professional';

const setSubscriptionTier = (tier: SubscriptionTier) => {
  activeTier = tier;
  vi.mocked(useSubscriptionTier).mockReturnValue({
    tier,
    label: tier.charAt(0).toUpperCase() + tier.slice(1),
    isLoading: false,
    isLoaded: true,
    error: null,
    hasOrganization: true,
    isAtLeast: (requiredTier: SubscriptionTier) => tierRank[tier] >= tierRank[requiredTier],
    requiresUpgrade: (requiredTier: SubscriptionTier) => tierRank[tier] < tierRank[requiredTier],
  });
};

const defaultQuota: podcastApi.QuotaSummary = {
  tier: 'professional',
  tierLabel: 'Professional',
  limit: 10,
  remaining: 7,
  used: 3,
  isUnlimited: false,
  period: '2025-10',
  periodLabel: 'October 2025',
  periodStart: '2025-10-01T00:00:00+00:00',
  periodEnd: '2025-10-31T23:59:59+00:00',
  quotaState: 'normal',
  warningStatus: null,
  warningMessage: null,
  upgradeRequired: false,
  upgradeMessage: null,
  upgradeCtaUrl: null,
};

const defaultYouTubeConnection: podcastApi.YouTubeConnectionStatus = {
  isConnected: true,
  channelName: 'ApexDeliver Media',
  channelUrl: 'https://youtube.com/@apexdeliver',
  requiresAction: false,
  connectedAt: '2025-10-01T00:00:00Z',
  lastPublishedAt: null,
};

const buildEpisode = (
  overrides: Partial<podcastApi.PodcastEpisode> = {}
): podcastApi.PodcastEpisode => ({
  id: 'ep-1',
  title: 'Episode Title',
  description: 'Episode description',
  episode_number: 1,
  season_number: 1,
  audio_file_url: 'https://cdn.example.com/audio.mp3',
  video_file_url: null,
  status: 'draft',
  created_by: 'user-1',
  organization_id: 'org-1',
  created_at: '2025-10-01T10:00:00Z',
  updated_at: '2025-10-01T10:00:00Z',
  published_at: null,
  show_notes: null,
  transcript: null,
  transcript_language: null,
  duration_seconds: null,
  youtube_video_id: null,
  ...overrides,
});

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
    setSubscriptionTier('professional');
    vi.mocked(podcastApi.transcribeEpisode).mockResolvedValue({
      episodeId: 'ep-1',
      transcript: 'Generated transcript content.',
      transcriptLanguage: 'en',
      wordCount: 3,
    });
    vi.mocked(podcastApi.getYouTubeConnectionStatus).mockResolvedValue(defaultYouTubeConnection);
    vi.mocked(podcastApi.initiateYouTubeOAuth).mockResolvedValue({
      authorizationUrl: 'https://accounts.google.com/o/oauth2/auth',
      state: 'state-token',
      expiresAt: '2025-10-31T12:00:00Z',
    });
    vi.mocked(podcastApi.publishEpisodeToYouTube).mockResolvedValue({ videoId: 'YT_DEFAULT' });
    vi.mocked(podcastApi.checkFeatureAccess).mockImplementation(async (feature: string) => {
      const requiredTierMap: Record<string, SubscriptionTier> = {
        podcast_audio: 'professional',
        podcast_video: 'premium',
        transcription_basic: 'professional',
        youtube_integration: 'premium',
        live_streaming: 'enterprise',
      };

      const requiredTier = requiredTierMap[feature] ?? 'professional';
      const hasAccess = tierRank[activeTier] >= tierRank[requiredTier];

      return {
        feature,
        tier: activeTier,
        tierLabel: activeTier.charAt(0).toUpperCase() + activeTier.slice(1),
        hasAccess,
        requiredTier,
        requiredTierLabel: requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1),
        upgradeRequired: !hasAccess,
        upgradeMessage: hasAccess ? null : `Upgrade to ${requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)} to access ${feature.replace('_', ' ')}`,
        upgradeCtaUrl: '/pricing',
      };
    });
  });

  describe('Feature Access Gating', () => {
    it('should show upgrade prompt when user lacks podcast_audio access', async () => {
      setSubscriptionTier('starter');
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
      vi.mocked(podcastApi.getQuotaSummary).mockResolvedValue(defaultQuota);
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
      vi.mocked(podcastApi.getQuotaSummary).mockResolvedValue(defaultQuota);

      render(<PodcastStudio />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getAllByText(/3 \/ 10/i).length).toBeGreaterThan(0);
      });
    });

    it('should show approaching quota banner when usage reaches warning threshold', async () => {
      vi.mocked(podcastApi.getQuotaSummary).mockResolvedValue({
        ...defaultQuota,
        remaining: 2,
        used: 8,
        quotaState: 'warning',
        warningStatus: 'warning',
        warningMessage: '80% of monthly quota used (8/10). 2 episodes remaining this month.',
      });

      render(<PodcastStudio />, { wrapper: createWrapper() });

      const banner = await screen.findByRole('status', { name: /quota warning/i });
      expect(banner).toHaveTextContent('80% of monthly quota used (8/10)');
      expect(banner).toHaveTextContent('2 episodes remaining this month');
      expect(screen.getByRole('button', { name: /new episode/i })).toBeEnabled();
    });

    it('should show critical quota banner when usage reaches critical threshold', async () => {
      vi.mocked(podcastApi.getQuotaSummary).mockResolvedValue({
        ...defaultQuota,
        remaining: 1,
        used: 9,
        quotaState: 'critical',
        warningStatus: 'critical',
        warningMessage: '90% of monthly quota used (9/10). 1 episode remaining this month.',
      });

      render(<PodcastStudio />, { wrapper: createWrapper() });

      const banner = await screen.findByRole('alert', { name: /quota critical warning/i });
      expect(banner).toHaveTextContent('90% of monthly quota used (9/10)');
      expect(banner).toHaveTextContent('1 episode remaining this month');
      expect(screen.getByRole('button', { name: /new episode/i })).toBeEnabled();
    });

    it('should display billing cycle with reset range when provided', async () => {
      vi.mocked(podcastApi.getQuotaSummary).mockResolvedValue(defaultQuota);

      render(<PodcastStudio />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText(/october 2025 cycle/i)).toBeInTheDocument();
      });

      expect(
        screen.getByText(/1 oct 2025 – 31 oct 2025 · resets at 11:59 pm/i)
      ).toBeInTheDocument();
    });

    it('should disable new episode creation and show upgrade CTA when quota requires upgrade', async () => {
      vi.mocked(podcastApi.getQuotaSummary).mockResolvedValue({
        ...defaultQuota,
        tier: 'starter',
        tierLabel: 'Starter',
        limit: 3,
        remaining: 0,
        used: 3,
        quotaState: 'warning',
        warningStatus: 'critical',
        warningMessage: 'Monthly limit reached. Upgrade required to continue publishing.',
        upgradeRequired: true,
        upgradeMessage: 'Upgrade to Professional for additional podcast slots.',
        upgradeCtaUrl: '/pricing',
      });

      render(<PodcastStudio />, { wrapper: createWrapper() });

      const upgradeMessage = await screen.findByText(/upgrade to professional for additional podcast slots/i);
      const upgradeAlert = upgradeMessage.closest('[role="alert"]');
      expect(upgradeAlert).not.toBeNull();

      const upgradeButton = screen.getByRole('button', { name: /view upgrade options/i });
      expect(upgradeButton).toBeInTheDocument();

      const newEpisodeButton = screen.getByRole('button', { name: /new episode/i });
      expect(newEpisodeButton).toBeDisabled();
      expect(newEpisodeButton).toHaveAttribute('title', 'Upgrade to Professional for additional podcast slots.');
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
        warningMessage: 'Monthly quota exceeded (10/10). 0 episodes remaining this month.',
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

  describe('Transcription', () => {
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
      vi.mocked(podcastApi.getQuotaSummary).mockResolvedValue(defaultQuota);
    });

    it('should show transcribe button when transcript missing', async () => {
      vi.mocked(podcastApi.listEpisodes).mockResolvedValue([
        buildEpisode({ transcript: null }),
      ]);

      render(<PodcastStudio />, { wrapper: createWrapper() });

      const transcribeButton = await screen.findByRole('button', { name: /transcribe audio/i });
      expect(transcribeButton).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /download transcript/i })).not.toBeInTheDocument();
      expect(podcastApi.transcribeEpisode).not.toHaveBeenCalled();
    });

    it('should call API and show success message when transcription completes', async () => {
      vi.mocked(podcastApi.listEpisodes).mockResolvedValue([
        buildEpisode({ transcript: null }),
      ]);

      const user = userEvent.setup();
      render(<PodcastStudio />, { wrapper: createWrapper() });

      const transcribeButton = await screen.findByRole('button', { name: /transcribe audio/i });
      await user.click(transcribeButton);

      await waitFor(() => {
        expect(podcastApi.transcribeEpisode).toHaveBeenCalledWith('ep-1');
      });

      expect(await screen.findByText(/transcript generated successfully/i)).toBeInTheDocument();
    });

    it('should indicate when transcript is ready', async () => {
      vi.mocked(podcastApi.listEpisodes).mockResolvedValue([
        buildEpisode({ transcript: 'Existing transcript content.' }),
      ]);

      render(<PodcastStudio />, { wrapper: createWrapper() });

      expect(await screen.findByText(/transcript ready/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /regenerate transcript/i })).toBeInTheDocument();
      expect(screen.getByText(/existing transcript content/i)).toBeInTheDocument();
    });

    it('should provide transcript download links when transcript ready', async () => {
      vi.mocked(podcastApi.listEpisodes).mockResolvedValue([
        buildEpisode({ transcript: 'Existing transcript content.' }),
      ]);

      render(<PodcastStudio />, { wrapper: createWrapper() });

      const txtLink = await screen.findByRole('link', { name: /download transcript \(txt\)/i });
      const srtLink = screen.getByRole('link', { name: /download transcript \(srt\)/i });

      expect(txtLink).toHaveAttribute('href', '/api/podcasts/episodes/ep-1/transcript');
      expect(srtLink).toHaveAttribute('href', '/api/podcasts/episodes/ep-1/transcript.srt');
      expect(txtLink).toHaveAttribute('target', '_blank');
      expect(srtLink).toHaveAttribute('target', '_blank');
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
        buildEpisode({
          id: 'ep-1',
          title: 'Episode 1: Introduction',
          description: 'First episode',
          status: 'published',
          published_at: '2025-10-02T10:00:00Z',
        }),
        buildEpisode({
          id: 'ep-2',
          title: 'Episode 2: Deep Dive',
          description: 'Second episode',
          episode_number: 2,
          status: 'draft',
        }),
      ]);

      render(<PodcastStudio />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Episode 1: Introduction')).toBeInTheDocument();
        expect(screen.getByText('Episode 2: Deep Dive')).toBeInTheDocument();
      });
    });

    it('should show episode status badges', async () => {
      vi.mocked(podcastApi.listEpisodes).mockResolvedValue([
        buildEpisode({
          id: 'ep-1',
          title: 'Published Episode',
          status: 'published',
          published_at: '2025-10-05T10:00:00Z',
        }),
        buildEpisode({
          id: 'ep-2',
          title: 'Draft Episode',
          status: 'draft',
        }),
      ]);

      render(<PodcastStudio />, { wrapper: createWrapper() });

      await waitFor(() => {
        const badges = screen.getAllByText(/published/i);
        // Should have a status badge with "published" text
        expect(badges.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Video thumbnails', () => {
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
      vi.mocked(podcastApi.getQuotaSummary).mockResolvedValue(defaultQuota);
    });

    it('shows thumbnail when thumbnail_url present', async () => {
      vi.mocked(podcastApi.listEpisodes).mockResolvedValue([
        buildEpisode({
          id: 'ep-thumb',
          title: 'Video Episode',
          thumbnail_url: 'https://cdn.example.com/thumb.jpg',
        }),
      ]);

      render(<PodcastStudio />, { wrapper: createWrapper() });

      const thumbnail = await screen.findByTestId('episode-thumbnail');
      expect(thumbnail).toHaveAttribute('src', 'https://cdn.example.com/thumb.jpg');
      expect(thumbnail).toHaveAccessibleName(/thumbnail for video episode/i);
      expect(screen.queryByTestId('episode-thumbnail-placeholder')).not.toBeInTheDocument();
    });

    it('renders placeholder when thumbnail missing', async () => {
      vi.mocked(podcastApi.listEpisodes).mockResolvedValue([
        buildEpisode({
          id: 'ep-placeholder',
          title: 'No Thumbnail Episode',
          thumbnail_url: null,
        }),
      ]);

      render(<PodcastStudio />, { wrapper: createWrapper() });

      expect(await screen.findByTestId('episode-thumbnail-placeholder')).toBeInTheDocument();
      expect(screen.queryByTestId('episode-thumbnail')).not.toBeInTheDocument();
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

    it('allows editing metadata before publishing to YouTube when integration access granted', async () => {
      vi.mocked(podcastApi.checkFeatureAccess).mockResolvedValueOnce(audioAccess);
      vi.mocked(podcastApi.checkFeatureAccess).mockResolvedValueOnce(youtubeAccessGranted);
      vi.mocked(podcastApi.listEpisodes).mockResolvedValue([
        buildEpisode({
          id: 'ep-youtube-1',
          title: 'Premium Video Episode',
          description: 'Video episode ready for YouTube',
          video_file_url: 'https://cdn.example.com/video.mp4',
        }),
      ]);
      vi.mocked(podcastApi.publishEpisodeToYouTube).mockResolvedValue({ videoId: 'YT_12345' });
      vi.mocked(podcastApi.getYouTubeConnectionStatus).mockResolvedValue({
        ...defaultYouTubeConnection,
        isConnected: true,
      });

      const user = userEvent.setup();
      render(<PodcastStudio />, { wrapper: createWrapper() });

      const publishButton = await screen.findByRole('button', { name: /publish to youtube/i });
      expect(publishButton).toBeEnabled();

      await user.click(publishButton);

      const modalTitle = await screen.findByRole('heading', { name: /publish to youtube/i });
      expect(modalTitle).toBeInTheDocument();

      const titleInput = screen.getByLabelText(/video title/i);
      expect(titleInput).toHaveValue('Premium Video Episode');
      await user.clear(titleInput);
      await user.type(titleInput, 'Investor Update Episode');

      const tagsInput = screen.getByLabelText(/tags/i);
      await user.clear(tagsInput);
      await user.type(tagsInput, 'investor relations, earnings');

      const privacySelect = screen.getByLabelText(/privacy/i);
      await user.selectOptions(privacySelect, 'public');

      await user.click(screen.getByRole('button', { name: /publish episode/i }));

      await waitFor(() => {
        expect(podcastApi.publishEpisodeToYouTube).toHaveBeenCalledWith('ep-youtube-1', {
          title: 'Investor Update Episode',
          description: 'Video episode ready for YouTube',
          tags: ['investor relations', 'earnings'],
          privacy: 'public',
          scheduleTime: null,
        });
      });
      expect(await screen.findByText(/published to youtube/i)).toBeInTheDocument();
    });

    it('initiates OAuth connect flow when YouTube account is not connected', async () => {
      vi.mocked(podcastApi.checkFeatureAccess).mockResolvedValueOnce(audioAccess);
      vi.mocked(podcastApi.checkFeatureAccess).mockResolvedValueOnce(youtubeAccessGranted);
      vi.mocked(podcastApi.listEpisodes).mockResolvedValue([
        buildEpisode({
          id: 'ep-youtube-connect',
          title: 'Video Episode',
          video_file_url: 'https://cdn.example.com/video.mp4',
        }),
      ]);
      vi.mocked(podcastApi.getYouTubeConnectionStatus).mockResolvedValue({
        ...defaultYouTubeConnection,
        isConnected: false,
        channelName: null,
        channelUrl: null,
      });
      vi.mocked(podcastApi.initiateYouTubeOAuth).mockResolvedValue({
        authorizationUrl: 'https://accounts.google.com/o/oauth2/auth?client_id=test',
        state: 'state-456',
        expiresAt: '2025-11-01T00:00:00Z',
      });

      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
      const user = userEvent.setup();

      render(<PodcastStudio />, { wrapper: createWrapper() });

      const connectButton = await screen.findByRole('button', { name: /connect youtube/i });
      await user.click(connectButton);

      await waitFor(() => {
        expect(podcastApi.initiateYouTubeOAuth).toHaveBeenCalledWith(
          'ep-youtube-connect',
          expect.any(String),
        );
      });

      expect(openSpy).toHaveBeenCalledWith(
        'https://accounts.google.com/o/oauth2/auth?client_id=test',
        '_blank',
        'noopener',
      );
      expect(
        await screen.findByText(/complete the youtube connection in the popup/i),
      ).toBeInTheDocument();

      openSpy.mockRestore();
    });

    it('should show upgrade button when youtube integration access denied', async () => {
      vi.mocked(podcastApi.checkFeatureAccess).mockResolvedValueOnce(audioAccess);
      vi.mocked(podcastApi.checkFeatureAccess).mockResolvedValueOnce(youtubeAccessDenied);
      vi.mocked(podcastApi.listEpisodes).mockResolvedValue([
        buildEpisode({
          id: 'ep-youtube-2',
          title: 'Video Episode',
          video_file_url: 'https://cdn.example.com/video.mp4',
        }),
      ]);

      render(<PodcastStudio />, { wrapper: createWrapper() });

      const upgradeButtons = await screen.findAllByRole('button', { name: /upgrade for youtube/i });
      expect(upgradeButtons.length).toBeGreaterThan(0);
      upgradeButtons.forEach((button) => expect(button).toBeEnabled());
      expect(screen.getAllByText(/upgrade to premium tier to publish on youtube/i).length).toBeGreaterThan(0);
    });
  });

  describe('Create Episode Button', () => {
    beforeEach(() => {
      vi.mocked(podcastApi.checkFeatureAccess).mockImplementation(async (feature: string) => ({
        feature,
        tier: feature === 'youtube_integration' ? 'premium' : 'professional',
        tierLabel: feature === 'youtube_integration' ? 'Premium' : 'Professional',
        hasAccess: true,
        requiredTier: feature === 'youtube_integration' ? 'premium' : 'professional',
        requiredTierLabel: feature === 'youtube_integration' ? 'Premium' : 'Professional',
        upgradeRequired: false,
        upgradeMessage: null,
        upgradeCtaUrl: null,
      }));
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

  describe('CRUD Operations (TDD)', () => {
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

    it('should open Create Episode modal when New Episode button clicked', async () => {
      const user = userEvent.setup();
      render(<PodcastStudio />, { wrapper: createWrapper() });

      const newButton = await screen.findByRole('button', { name: /new episode/i });
      await user.click(newButton);

      expect(await screen.findByRole('dialog')).toBeInTheDocument();
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/episode number/i)).toBeInTheDocument();
    });

    it('should create episode when form submitted with valid data', async () => {
      const user = userEvent.setup();
      const newEpisode = buildEpisode({
        id: 'ep-new',
        title: 'New Test Episode',
        description: 'Test description',
        episode_number: 3,
        audio_file_url: 'https://cdn.example.com/ep3.mp3',
      });
      vi.mocked(podcastApi.createEpisode).mockResolvedValue(newEpisode);

      render(<PodcastStudio />, { wrapper: createWrapper() });

      await user.click(await screen.findByRole('button', { name: /new episode/i }, {}, { timeout: 5000 }));

      await user.type(screen.getByLabelText(/title/i), 'New Test Episode');
      await user.type(screen.getByLabelText(/episode number/i), '3');
      await user.type(screen.getByLabelText(/season number/i), '1');
      await user.type(screen.getByLabelText(/audio file url/i), 'https://cdn.example.com/ep3.mp3');

      await user.click(screen.getByRole('button', { name: /create episode/i }));

      // Wait for the mutation to be called
      await waitFor(() => {
        expect(podcastApi.createEpisode).toHaveBeenCalled();
      }, { timeout: 10000 });

      // Verify it was called with correct values (null for empty optional fields)
      expect(podcastApi.createEpisode).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Test Episode',
          description: null,
          episode_number: 3,
          season_number: 1,
          audio_file_url: 'https://cdn.example.com/ep3.mp3',
          video_file_url: null,
          show_notes: null,
          status: 'draft',
        })
      );
    }, 15000);

    it('should open Edit modal when Edit button clicked on episode', async () => {
      const user = userEvent.setup();
      vi.mocked(podcastApi.listEpisodes).mockResolvedValue([
        buildEpisode({
          id: 'ep-1',
          title: 'Episode to Edit',
          description: 'Original description',
        }),
      ]);

      render(<PodcastStudio />, { wrapper: createWrapper() });

      const editButton = await screen.findByRole('button', { name: /edit/i });
      await user.click(editButton);

      expect(await screen.findByRole('dialog')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Episode to Edit')).toBeInTheDocument();
    });

    it('should update episode when edit form submitted', async () => {
      const user = userEvent.setup();
      const existingEpisode = buildEpisode({
        id: 'ep-1',
        title: 'Original Title',
        description: 'Original description',
      });

      vi.mocked(podcastApi.listEpisodes).mockResolvedValue([existingEpisode]);
      vi.mocked(podcastApi.updateEpisode).mockResolvedValue({
        ...existingEpisode,
        title: 'Updated Title',
      });

      render(<PodcastStudio />, { wrapper: createWrapper() });

      await user.click(await screen.findByRole('button', { name: /edit/i }));

      const titleInput = screen.getByDisplayValue('Original Title');
      await user.clear(titleInput);
      await user.type(titleInput, 'Updated Title');

      await user.click(screen.getByRole('button', { name: /save changes/i }));

      await waitFor(() => {
        expect(podcastApi.updateEpisode).toHaveBeenCalledWith(
          'ep-1',
          expect.objectContaining({ title: 'Updated Title' })
        );
      }, { timeout: 10000 });
    });

    it('should show delete confirmation when delete button clicked', async () => {
      const user = userEvent.setup();
      vi.mocked(podcastApi.listEpisodes).mockResolvedValue([
        buildEpisode({
          id: 'ep-del',
          title: 'Episode to Delete',
        }),
      ]);

      render(<PodcastStudio />, { wrapper: createWrapper() });

      const deleteButton = await screen.findByRole('button', { name: /delete/i });
      await user.click(deleteButton);

      expect(await screen.findByText(/are you sure/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /confirm delete/i })).toBeInTheDocument();
    });

    it('should delete episode when deletion confirmed', async () => {
      const user = userEvent.setup();
      vi.mocked(podcastApi.listEpisodes).mockResolvedValue([
        buildEpisode({
          id: 'ep-del',
          title: 'Episode to Delete',
        }),
      ]);
      vi.mocked(podcastApi.deleteEpisode).mockResolvedValue(undefined);

      render(<PodcastStudio />, { wrapper: createWrapper() });

      await user.click(await screen.findByRole('button', { name: /delete/i }));
      await user.click(await screen.findByRole('button', { name: /confirm delete/i }));

      await waitFor(() => {
        expect(podcastApi.deleteEpisode).toHaveBeenCalledWith('ep-del');
      });
    });
  });
});

