import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

import { PodcastStudio } from './PodcastStudio';
import * as podcastApi from '../../services/api/podcasts';
import { useFeatureAccess, type FeatureAccessState } from '../../hooks/useFeatureAccess';
import { useSubscriptionTier } from '../../hooks/useSubscriptionTier';

vi.mock('../../components/podcast/VideoUploadModal', () => ({
  default: ({ open, episodeName, onClose }: { open: boolean; episodeName: string; onClose: () => void }) =>
    open ? (
      <div data-testid="video-upload-modal">
        <p>{`Uploading for ${episodeName}`}</p>
        <button type="button" onClick={onClose}>
          Close Modal
        </button>
      </div>
    ) : null,
}));

vi.mock('../../components/podcast/LiveStreamManager', () => ({
  default: ({ podcastId, tier }: { podcastId: string | null; tier?: string }) => (
    <div data-testid="live-stream-manager">
      <p>Live streaming for podcast: {podcastId || 'none'}</p>
      {tier && <p>Tier: {tier}</p>}
    </div>
  ),
}));

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

vi.mock('../../hooks/useFeatureAccess', () => ({
  useFeatureAccess: vi.fn(),
}));

vi.mock('../../hooks/useSubscriptionTier', () => ({
  useSubscriptionTier: vi.fn(),
}));

const SUBSCRIPTION_RANK: Record<string, number> = {
  starter: 0,
  professional: 1,
  premium: 2,
  enterprise: 3,
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

const createEpisode = (
  overrides: Partial<podcastApi.PodcastEpisode> = {}
): podcastApi.PodcastEpisode => ({
  id: 'ep-1',
  title: 'Sample Episode',
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
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

type FeatureMap = Record<string, FeatureAccessState>;

const buildFeatureState = (feature: string, overrides: Partial<FeatureAccessState> = {}): FeatureAccessState => ({
  feature,
  hasAccess: false,
  tier: 'starter',
  tierLabel: 'Starter',
  requiredTier: 'professional',
  requiredTierLabel: 'Professional',
  upgradeRequired: true,
  upgradeMessage: 'Upgrade required',
  upgradeCtaUrl: '/pricing',
  isLoading: false,
  isFetched: true,
  error: null,
  ...overrides,
});

const mockUseFeatureAccess = (map: FeatureMap) => {
  vi.mocked(useFeatureAccess).mockImplementation(({ feature }) => {
    if (map[feature]) {
      return map[feature];
    }
    return buildFeatureState(feature);
  });
};

const mockSubscriptionTier = (tier: string) => {
  vi.mocked(useSubscriptionTier).mockReturnValue({
    tier: tier as 'starter' | 'professional' | 'premium' | 'enterprise',
    label: tier.charAt(0).toUpperCase() + tier.slice(1),
    isLoading: false,
    isLoaded: true,
    error: null,
    hasOrganization: true,
    isAtLeast: (required: string) => SUBSCRIPTION_RANK[tier] >= SUBSCRIPTION_RANK[required],
    requiresUpgrade: (required: string) => SUBSCRIPTION_RANK[tier] < SUBSCRIPTION_RANK[required],
  });
};

describe('PodcastStudio feature gates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSubscriptionTier('professional');
    mockUseFeatureAccess({
      podcast_audio: buildFeatureState('podcast_audio', {
        hasAccess: true,
        tier: 'professional',
        tierLabel: 'Professional',
        requiredTier: 'professional',
        requiredTierLabel: 'Professional',
        upgradeRequired: false,
        upgradeMessage: null,
      }),
      podcast_video: buildFeatureState('podcast_video', {
        hasAccess: false,
        tier: 'professional',
        tierLabel: 'Professional',
        requiredTier: 'premium',
        requiredTierLabel: 'Premium',
        upgradeRequired: true,
        upgradeMessage: 'Premium unlocks video uploads and YouTube publishing.',
      }),
      youtube_integration: buildFeatureState('youtube_integration', {
        hasAccess: false,
        requiredTier: 'premium',
        requiredTierLabel: 'Premium',
        upgradeRequired: true,
        upgradeMessage: 'Upgrade to publish directly to YouTube.',
      }),
      transcription_basic: buildFeatureState('transcription_basic', {
        hasAccess: true,
        upgradeRequired: false,
        requiredTier: 'professional',
        requiredTierLabel: 'Professional',
      }),
      live_streaming: buildFeatureState('live_streaming', {
        hasAccess: false,
        requiredTier: 'enterprise',
        requiredTierLabel: 'Enterprise',
        upgradeRequired: true,
        upgradeMessage: 'Enterprise unlocks live streaming to investor audiences.',
      }),
    });

    vi.mocked(podcastApi.getQuotaSummary).mockResolvedValue(defaultQuota);
    vi.mocked(podcastApi.listEpisodes).mockResolvedValue([]);
    vi.mocked(podcastApi.getYouTubeConnectionStatus).mockResolvedValue(defaultYouTubeConnection);
    vi.mocked(podcastApi.initiateYouTubeOAuth).mockResolvedValue({
      authorizationUrl: 'https://accounts.google.com/o/oauth2/auth',
      state: 'state-token',
      expiresAt: '2025-10-31T12:00:00Z',
    });
  });

  it('shows audio controls but locks video uploads for Professional tier', async () => {
    render(<PodcastStudio />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText(/podcast studio/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /new episode/i })).toBeEnabled();
    expect(screen.getAllByText(/premium unlocks video uploads/i).length).toBeGreaterThan(0);
    expect(
      screen.getByRole('button', { name: /explore premium video options/i })
    ).toBeInTheDocument();
  });

  it('displays quota warnings alongside upgrade messaging when nearing limits', async () => {
    vi.mocked(podcastApi.getQuotaSummary).mockResolvedValue({
      ...defaultQuota,
      remaining: 2,
      used: 8,
      quotaState: 'warning',
      warningStatus: 'warning',
      warningMessage: '80% of your monthly quota used. 2 uploads left.',
    });

    render(<PodcastStudio />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByRole('status', { name: /quota warning/i })).toBeInTheDocument();
    });

    expect(screen.getByText(/80% of your monthly quota used/i)).toBeInTheDocument();
    expect(screen.getAllByText(/premium unlocks video uploads/i).length).toBeGreaterThan(0);
  });

  it('shows clear messaging when video feature is unavailable', async () => {
    render(<PodcastStudio />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText(/podcast studio/i)).toBeInTheDocument();
    });

    expect(
      screen.getByText(/video production is locked on your current plan/i)
    ).toBeInTheDocument();
  });

  it('opens the upgrade modal with pricing when CTA is clicked', async () => {
    const user = userEvent.setup();

    render(<PodcastStudio />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText(/podcast studio/i)).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole('button', { name: /explore premium video options/i })
    );

    expect(await screen.findByRole('dialog', { name: /compare subscription tiers/i })).toBeInTheDocument();
    expect(screen.getByText(/professional £598\/mo/i)).toBeInTheDocument();
    expect(screen.getByText(/premium £1,598\/mo/i)).toBeInTheDocument();
    expect(screen.getByText(/enterprise £2,997\/mo/i)).toBeInTheDocument();
  });

  it('renders upload video button for Premium users and opens modal', async () => {
    mockSubscriptionTier('premium');
    mockUseFeatureAccess({
      podcast_audio: buildFeatureState('podcast_audio', { hasAccess: true, upgradeRequired: false }),
      podcast_video: buildFeatureState('podcast_video', {
        hasAccess: true,
        upgradeRequired: false,
        requiredTier: 'premium',
        requiredTierLabel: 'Premium',
      }),
      transcription_basic: buildFeatureState('transcription_basic', { hasAccess: true, upgradeRequired: false }),
      youtube_integration: buildFeatureState('youtube_integration', { hasAccess: true, upgradeRequired: false }),
    });
    vi.mocked(podcastApi.getQuotaSummary).mockResolvedValue(defaultQuota);
    vi.mocked(podcastApi.listEpisodes).mockResolvedValue([
      createEpisode({ id: 'ep-vid', title: 'Video Episode' }),
    ]);

    const user = userEvent.setup();

    render(<PodcastStudio />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getAllByText(/video episode/i).length).toBeGreaterThan(0);
    });

    await user.click(screen.getByRole('button', { name: /upload video/i }));

    expect(await screen.findByTestId('video-upload-modal')).toHaveTextContent('Uploading for Video Episode');
  });

  it('blocks video upload for Professional tier with upgrade messaging', async () => {
    mockSubscriptionTier('professional');
    mockUseFeatureAccess({
      podcast_audio: buildFeatureState('podcast_audio', { hasAccess: true, upgradeRequired: false }),
      podcast_video: buildFeatureState('podcast_video', { hasAccess: false, upgradeRequired: true }),
      transcription_basic: buildFeatureState('transcription_basic', { hasAccess: true, upgradeRequired: false }),
      youtube_integration: buildFeatureState('youtube_integration', { hasAccess: false, upgradeRequired: true }),
    });
    vi.mocked(podcastApi.listEpisodes).mockResolvedValue([
      createEpisode({ id: 'ep-locked', title: 'Locked Video Episode' }),
    ]);

    render(<PodcastStudio />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText(/locked video episode/i)).toBeInTheDocument();
    });

    expect(screen.getAllByText(/video uploads locked/i).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /upgrade for video uploads/i }).length).toBeGreaterThan(0);
  });

  it('shows transcription upgrade messaging when transcription feature is locked', async () => {
    mockSubscriptionTier('starter');
    mockUseFeatureAccess({
      podcast_audio: buildFeatureState('podcast_audio', { hasAccess: true, upgradeRequired: false }),
      podcast_video: buildFeatureState('podcast_video', { hasAccess: true, upgradeRequired: false }),
      transcription_basic: buildFeatureState('transcription_basic', {
        hasAccess: false,
        requiredTier: 'premium',
        requiredTierLabel: 'Premium',
        upgradeRequired: true,
        upgradeMessage: 'Premium tier unlocks automated podcast transcripts.',
      }),
      youtube_integration: buildFeatureState('youtube_integration', { hasAccess: true, upgradeRequired: false }),
    });
    vi.mocked(podcastApi.listEpisodes).mockResolvedValue([
      createEpisode({ transcript: null }),
    ]);

    render(<PodcastStudio />, { wrapper: createWrapper() });

    await screen.findByText(/sample episode/i);

    const transcriptionUpgradeButtons = await screen.findAllByRole('button', {
      name: /upgrade for transcripts/i,
    });
    expect(transcriptionUpgradeButtons.length).toBeGreaterThan(0);
  });

  it('shows live streaming upgrade call-to-action when feature is locked', async () => {
    mockUseFeatureAccess({
      podcast_audio: buildFeatureState('podcast_audio', { hasAccess: true, upgradeRequired: false }),
      podcast_video: buildFeatureState('podcast_video', { hasAccess: false, upgradeRequired: true }),
      transcription_basic: buildFeatureState('transcription_basic', { hasAccess: true, upgradeRequired: false }),
      youtube_integration: buildFeatureState('youtube_integration', { hasAccess: true, upgradeRequired: false }),
      live_streaming: buildFeatureState('live_streaming', {
        hasAccess: false,
        requiredTier: 'enterprise',
        requiredTierLabel: 'Enterprise',
        upgradeRequired: true,
        upgradeMessage: 'Enterprise unlocks live streaming to investor audiences.',
      }),
    });

    const user = userEvent.setup();

    render(<PodcastStudio />, { wrapper: createWrapper() });

    // Wait for component to load before interacting with tabs
    await screen.findByRole('tab', { name: /episodes/i });

    await user.click(screen.getByRole('tab', { name: /live streaming/i }));

    await waitFor(() => {
      expect(screen.getByText(/live streaming locked/i)).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /explore enterprise streaming/i })).toBeInTheDocument();
  });

  it('renders quota HUD and warning when approaching limit', async () => {
    mockUseFeatureAccess({
      podcast_audio: buildFeatureState('podcast_audio', { hasAccess: true, upgradeRequired: false }),
      podcast_video: buildFeatureState('podcast_video', { hasAccess: false, upgradeRequired: true }),
      transcription_basic: buildFeatureState('transcription_basic', { hasAccess: true, upgradeRequired: false }),
      youtube_integration: buildFeatureState('youtube_integration', { hasAccess: true, upgradeRequired: false }),
    });
    vi.mocked(podcastApi.getQuotaSummary).mockResolvedValue({
      ...defaultQuota,
      used: 8,
      remaining: 2,
      quotaState: 'warning',
      warningStatus: 'warning',
    });

    render(<PodcastStudio />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText(/plan usage/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/8 \/ 10 episodes/i)).toBeInTheDocument();
    expect(screen.getByText(/you have used 80% of your monthly quota/i)).toBeInTheDocument();
  });
});
