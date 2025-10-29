import React from 'react';

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { YouTubePublisher } from './YouTubePublisher';
import type {
  PodcastEpisode,
  YouTubeConnectionStatus,
  YouTubePublishPayload,
} from '../../services/api/podcasts';
import * as podcastApiModule from '../../services/api/podcasts';

type YouTubePublishStatus = 'not_published' | 'uploading' | 'processing' | 'published' | 'failed';

type FeatureAccessState = {
  feature: string;
  hasAccess: boolean;
  tier: string;
  tierLabel: string;
  requiredTier: string | null;
  requiredTierLabel: string | null;
  upgradeRequired: boolean;
  upgradeMessage: string | null;
  upgradeCtaUrl: string | null;
  isLoading: boolean;
  isFetched: boolean;
  error: unknown;
};

vi.mock('../../services/api/podcasts', () => ({
  getYouTubeConnectionStatus: vi.fn(),
  initiateYouTubeOAuth: vi.fn(),
  disconnectYouTubeChannel: vi.fn(),
  publishEpisodeToYouTube: vi.fn(),
  getYouTubePublishStatus: vi.fn(),
}));

const podcastApi = vi.mocked(podcastApiModule);

const buildAccessState = (overrides: Partial<FeatureAccessState> = {}): FeatureAccessState => ({
  feature: 'youtube_integration',
  hasAccess: true,
  tier: 'premium',
  tierLabel: 'Premium',
  requiredTier: 'premium',
  requiredTierLabel: 'Premium',
  upgradeRequired: false,
  upgradeMessage: null,
  upgradeCtaUrl: '/pricing',
  isLoading: false,
  isFetched: true,
  error: null,
  ...overrides,
});

const defaultConnection: YouTubeConnectionStatus = {
  isConnected: true,
  channelName: 'ApexDeliver Media',
  channelUrl: 'https://youtube.com/@apexdeliver',
  requiresAction: false,
  connectedAt: '2025-10-28T12:00:00Z',
  lastPublishedAt: null,
};

const buildEpisode = (overrides: Partial<PodcastEpisode> = {}): PodcastEpisode => ({
  id: 'ep-1',
  title: 'Board Update',
  description: 'Q4 strategy briefing',
  episode_number: 4,
  season_number: 1,
  audio_file_url: 'https://cdn.example.com/audio.mp3',
  video_file_url: 'https://cdn.example.com/video.mp4',
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
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const renderPublisher = (options: {
  episode?: PodcastEpisode;
  access?: FeatureAccessState;
  connection?: YouTubeConnectionStatus;
  status?: YouTubePublishStatus;
} = {}) => {
  const {
    episode = buildEpisode(),
    access = buildAccessState(),
    connection = defaultConnection,
    status = 'not_published',
  } = options;

  podcastApi.getYouTubeConnectionStatus.mockResolvedValue(connection);
  podcastApi.getYouTubePublishStatus.mockResolvedValue({
    status,
    lastCheckedAt: '2025-10-28T12:30:00Z',
  });

  render(<YouTubePublisher episode={episode} youtubeAccess={access} />, {
    wrapper: createWrapper(),
  });
};

describe('YouTubePublisher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    podcastApi.getYouTubeConnectionStatus.mockResolvedValue(defaultConnection);
    podcastApi.getYouTubePublishStatus.mockResolvedValue({
      status: 'not_published',
      lastCheckedAt: '2025-10-28T12:30:00Z',
    });
    podcastApi.initiateYouTubeOAuth.mockResolvedValue({
      authorizationUrl: 'https://accounts.google.com/o/oauth2/auth',
      state: 'state-token',
      expiresAt: '2025-10-28T13:00:00Z',
    });
    podcastApi.publishEpisodeToYouTube.mockResolvedValue({ videoId: 'YT_123' });
  });

  it('shows connect call-to-action when YouTube is not connected and triggers OAuth flow', async () => {
    renderPublisher({
      connection: {
        ...defaultConnection,
        isConnected: false,
        channelName: null,
        channelUrl: null,
      },
    });

    const connectButton = await screen.findByRole('button', { name: /connect youtube/i });
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    await userEvent.click(connectButton);

    await waitFor(() => {
      expect(podcastApi.initiateYouTubeOAuth).toHaveBeenCalledWith('ep-1', expect.stringMatching(/^https?:/));
    });
    expect(openSpy).toHaveBeenCalledWith('https://accounts.google.com/o/oauth2/auth', '_blank', 'noopener');
    openSpy.mockRestore();
  });

  it('prefills metadata form with episode details and enforces title length', async () => {
    renderPublisher();

    const titleInput = await screen.findByLabelText(/video title/i);
    expect(titleInput).toHaveValue('Board Update');

    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, 'A'.repeat(120));
    await userEvent.tab();

    expect(await screen.findByText(/title must be 100 characters or fewer/i)).toBeInTheDocument();
    expect(titleInput).toHaveValue('A'.repeat(100));

    const descriptionInput = screen.getByLabelText(/description/i);
    await userEvent.clear(descriptionInput);
    await userEvent.type(descriptionInput, 'Quarterly outlook.');
    expect(descriptionInput).toHaveValue('Quarterly outlook.');

    const tagsInput = screen.getByLabelText(/tags/i);
    await userEvent.clear(tagsInput);
    await userEvent.type(tagsInput, 'investors, earnings, growth');
    expect(tagsInput).toHaveValue('investors, earnings, growth');
  });

  it('submits publish payload with metadata and schedule', async () => {
    renderPublisher();

    const titleInput = await screen.findByLabelText(/video title/i);
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, 'Investor Relations Update');

    await userEvent.clear(screen.getByLabelText(/description/i));
    await userEvent.type(screen.getByLabelText(/description/i), 'Highlights from the board meeting.');

    await userEvent.clear(screen.getByLabelText(/tags/i));
    await userEvent.type(screen.getByLabelText(/tags/i), 'investor relations, earnings');

    await userEvent.selectOptions(screen.getByLabelText(/privacy/i), 'public');
    const scheduleInput = screen.getByLabelText(/schedule/i);
    await userEvent.clear(scheduleInput);
    await userEvent.type(scheduleInput, '2025-11-01T14:30');

    await userEvent.click(screen.getByRole('button', { name: /publish episode/i }));

    await waitFor(() => {
      expect(podcastApi.publishEpisodeToYouTube).toHaveBeenCalledWith('ep-1', {
        title: 'Investor Relations Update',
        description: 'Highlights from the board meeting.',
        tags: ['investor relations', 'earnings'],
        privacy: 'public',
        scheduleTime: '2025-11-01T14:30:00.000Z',
      });
    });
    expect(await screen.findByText(/episode "board update" published to youtube/i)).toBeInTheDocument();
  });

  it('surfaces status badge for publishing states', async () => {
    const statuses: YouTubePublishStatus[] = ['uploading', 'processing', 'published', 'failed'];

    for (const status of statuses) {
      podcastApi.getYouTubePublishStatus.mockResolvedValueOnce({
        status,
        lastCheckedAt: '2025-10-28T12:30:00Z',
      });
      renderPublisher({ status });
      const badge = await screen.findByTestId('youtube-status-badge');
      expect(badge).toHaveTextContent(new RegExp(status, 'i'));
    }
  });

  it('handles publish failure path with actionable messaging', async () => {
    podcastApi.publishEpisodeToYouTube.mockRejectedValue(new Error('quota exceeded'));
    renderPublisher();

    const publishButton = await screen.findByRole('button', { name: /publish episode/i });
    await userEvent.click(publishButton);

    expect(await screen.findByRole('alert')).toHaveTextContent(/failed to publish to youtube/i);
  });

  it('gates all functionality when access is locked behind Premium tier', async () => {
    renderPublisher({
      access: buildAccessState({
        hasAccess: false,
        upgradeRequired: true,
        upgradeMessage: 'Upgrade to Premium to publish.',
        tier: 'professional',
        tierLabel: 'Professional',
      }),
    });

    expect(await screen.findByText(/upgrade to premium to publish/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view plans/i })).toBeEnabled();
  });

  it('allows disconnecting the connected channel', async () => {
    renderPublisher();

    const disconnectButton = await screen.findByRole('button', { name: /disconnect channel/i });
    podcastApi.disconnectYouTubeChannel.mockResolvedValue({ success: true });

    await userEvent.click(disconnectButton);

    await waitFor(() => {
      expect(podcastApi.disconnectYouTubeChannel).toHaveBeenCalledWith('ep-1');
    });
    expect(await screen.findByRole('button', { name: /connect youtube/i })).toBeInTheDocument();
  });

  it('displays retry action when connection requires re-authentication', async () => {
    renderPublisher({
      connection: { ...defaultConnection, requiresAction: true },
    });

    expect(await screen.findByText(/re-authentication required/i)).toBeInTheDocument();
    const retryButton = screen.getByRole('button', { name: /reconnect youtube/i });
    await userEvent.click(retryButton);

    await waitFor(() => {
      expect(podcastApi.initiateYouTubeOAuth).toHaveBeenCalledWith('ep-1', expect.any(String));
    });
  });

  it('provides live validation feedback for mandatory metadata fields', async () => {
    renderPublisher();

    const titleInput = await screen.findByLabelText(/video title/i);
    await userEvent.clear(titleInput);
    await userEvent.tab();

    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();

    const privacySelect = screen.getByLabelText(/privacy/i);
    expect(privacySelect).toHaveDisplayValue(/unlisted/i);
  });

  it('shows processing indicator while publish mutation is in flight', async () => {
    podcastApi.publishEpisodeToYouTube.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ videoId: 'YT_999' }), 50);
        }) as unknown as ReturnType<typeof podcastApi.publishEpisodeToYouTube>
    );
    renderPublisher();

    const publishButton = await screen.findByRole('button', { name: /publish episode/i });
    await userEvent.click(publishButton);

    expect(await screen.findByText(/publishing to youtube…/i)).toBeInTheDocument();
  });

  it('locks scheduling controls when privacy is set to private', async () => {
    renderPublisher();

    const scheduleInput = await screen.findByLabelText(/schedule/i);
    expect(scheduleInput).not.toBeDisabled();

    await userEvent.selectOptions(screen.getByLabelText(/privacy/i), 'private');
    expect(scheduleInput).toBeDisabled();
  });
});
