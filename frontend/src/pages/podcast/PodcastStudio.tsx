/**
 * Podcast Studio Component
 *
 * Main page for managing podcast episodes.
 * Requirements from DEV-016:
 * - Professional tier: Audio podcasts (10/month)
 * - Premium tier: Audio + Video podcasts (unlimited)
 * - Display quota usage
 * - List episodes with CRUD operations
 */

import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { FeatureGate } from '../../components/subscription/FeatureGate';
import QuotaWarning from '../../components/podcast/QuotaWarning';
import { CreateEpisodeModal } from '../../components/podcast/CreateEpisodeModal';
import { EditEpisodeModal } from '../../components/podcast/EditEpisodeModal';
import { DeleteEpisodeModal } from '../../components/podcast/DeleteEpisodeModal';
import VideoUploadModal from '../../components/podcast/VideoUploadModal';
import LiveStreamManager, { type LiveStreamManagerTier } from '../../components/podcast/LiveStreamManager';
import {
  getQuotaSummary,
  listEpisodes,
  transcribeEpisode,
  createEpisode,
  updateEpisode,
  deleteEpisode,
  getYouTubeConnectionStatus,
  initiateYouTubeOAuth,
  publishEpisodeToYouTube,
  type PodcastEpisode,
  type QuotaSummary,
  type YouTubeConnectionStatus,
  type YouTubePublishPayload,
} from '../../services/api/podcasts';
import { useFeatureAccess } from '../../hooks/useFeatureAccess';
import { useSubscriptionTier } from '../../hooks/useSubscriptionTier';

type FeatureAccessState = ReturnType<typeof useFeatureAccess>;
type CreateEpisodePayload = Parameters<typeof createEpisode>[0];
type UpdateEpisodePayload = Parameters<typeof updateEpisode>[1];

type NotificationState = {
  type: 'success' | 'error' | 'info';
  message: string;
};

type ErrorBoundaryProps = {
  fallback: React.ReactNode;
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

const UPGRADE_MESSAGES = {
  video: 'Premium unlocks video uploads and YouTube publishing.',
  transcription: 'Professional tier unlocks automated podcast transcripts.',
  youtube: 'Upgrade to Premium to publish directly to YouTube.',
  liveStreaming: 'Enterprise unlocks live streaming to investor audiences.',
};

const QUOTA_WARNING_THRESHOLD = 0.8;

class SectionErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // eslint-disable-next-line no-console
    console.error('PodcastStudio section failed to render', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export function PodcastStudio() {
  return (
    <FeatureGate feature="podcast_audio">
      <PodcastStudioContent />
    </FeatureGate>
  );
}

function PodcastStudioContent() {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setCreateModalOpen] = React.useState(false);
  const [editingEpisode, setEditingEpisode] = React.useState<PodcastEpisode | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<PodcastEpisode | null>(null);
  const [videoUploadEpisode, setVideoUploadEpisode] = React.useState<PodcastEpisode | null>(null);
  const [notification, setNotification] = React.useState<NotificationState | null>(null);
  const [episodeToPublish, setEpisodeToPublish] = React.useState<PodcastEpisode | null>(null);
  const [publishError, setPublishError] = React.useState<string | null>(null);
  const [infoEpisodeId, setInfoEpisodeId] = React.useState<string | null>(null);
  const [youtubeInfoMessage, setYoutubeInfoMessage] = React.useState<string | null>(null);
  const [lastPublishedEpisodeId, setLastPublishedEpisodeId] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<'episodes' | 'live-streaming'>('episodes');
  const notificationTimeoutRef = React.useRef<number | null>(null);
  const subscription = useSubscriptionTier();
  const subscriptionTier = (subscription.tier ?? 'starter') as LiveStreamManagerTier;
  const canUploadVideo = subscription.isAtLeast('premium');

  const pushNotification = React.useCallback((type: NotificationState['type'], message: string) => {
    setNotification({ type, message });
    if (notificationTimeoutRef.current) {
      window.clearTimeout(notificationTimeoutRef.current);
    }
    notificationTimeoutRef.current = window.setTimeout(() => {
      setNotification(null);
      notificationTimeoutRef.current = null;
    }, 5000);
  }, []);

  React.useEffect(() => () => {
    if (notificationTimeoutRef.current) {
      window.clearTimeout(notificationTimeoutRef.current);
    }
  }, []);

  const closeVideoUploadModal = React.useCallback(() => setVideoUploadEpisode(null), []);

  const {
    data: quota,
    isLoading: quotaLoading,
    isError: quotaError,
  } = useQuery<QuotaSummary, Error>({
    queryKey: ['podcastQuota'],
    queryFn: getQuotaSummary,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const [episodesState, setEpisodesState] = React.useState<PodcastEpisode[]>([]);
  const [episodesLoading, setEpisodesLoading] = React.useState(true);
  const [episodesError, setEpisodesError] = React.useState<Error | null>(null);

  const loadEpisodes = React.useCallback(async () => {
    try {
      setEpisodesLoading(true);
      setEpisodesError(null);
      const data = await listEpisodes();
      setEpisodesState(data);
    } catch (error) {
      setEpisodesError(error as Error);
    } finally {
      setEpisodesLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadEpisodes();
  }, [loadEpisodes]);

  if (process.env.NODE_ENV === 'test') {
    console.log('PodcastStudio episodes', { loading: episodesLoading, count: episodesState.length });
  }

  const liveStreamPodcastId = React.useMemo(
    () => (episodesState.length > 0 ? episodesState[0].id : 'podcast-live-stream'),
    [episodesState],
  );

  const youtubeAccess = useFeatureAccess({ feature: 'youtube_integration' });
  const canCheckYouTubeConnection = youtubeAccess.isFetched && youtubeAccess.hasAccess;
  const {
    data: youtubeConnection,
    isLoading: youtubeConnectionLoading,
    isError: youtubeConnectionErrorFlag,
    refetch: refetchYouTubeConnection,
  } = useQuery<YouTubeConnectionStatus>({
    queryKey: ['youtubeConnection'],
    queryFn: getYouTubeConnectionStatus,
    enabled: canCheckYouTubeConnection,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const youtubeConnectionError = canCheckYouTubeConnection && youtubeConnectionErrorFlag;
  const isConnected = Boolean(youtubeConnection?.isConnected);

  const createEpisodeMutation = useMutation({
    mutationFn: (payload: CreateEpisodePayload) => createEpisode(payload),
    onSuccess: () => {
      setCreateModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['podcastEpisodes'] });
      loadEpisodes();
      pushNotification('success', 'Episode created successfully');
    },
    onError: () => {
      pushNotification('error', 'Failed to create episode');
    },
  });

  const updateEpisodeMutation = useMutation({
    mutationFn: ({ episodeId, updates }: { episodeId: string; updates: UpdateEpisodePayload }) =>
      updateEpisode(episodeId, updates),
    onSuccess: () => {
      setEditingEpisode(null);
      queryClient.invalidateQueries({ queryKey: ['podcastEpisodes'] });
      loadEpisodes();
      pushNotification('success', 'Episode updated successfully');
    },
    onError: () => {
      pushNotification('error', 'Failed to update episode');
    },
  });

  const deleteEpisodeMutation = useMutation({
    mutationFn: (episodeId: string) => deleteEpisode(episodeId),
    onSuccess: () => {
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ['podcastEpisodes'] });
      loadEpisodes();
      pushNotification('info', 'Episode deleted');
    },
    onError: () => {
      pushNotification('error', 'Failed to delete episode');
    },
  });

  const initiateYouTubeOAuthMutation = useMutation({
    mutationFn: ({
      episodeId,
      redirectUri,
    }: {
      episodeId: string;
      redirectUri: string;
    }) => initiateYouTubeOAuth(episodeId, redirectUri),
    onMutate: ({ episodeId }) => {
      setInfoEpisodeId(episodeId);
      setYoutubeInfoMessage('Opening YouTube connection…');
      setPublishError(null);
    },
    onSuccess: (response, { episodeId }) => {
      window.open(response.authorizationUrl, '_blank', 'noopener');
      setInfoEpisodeId(episodeId);
      setYoutubeInfoMessage('Complete the YouTube connection in the popup to finish setup.');
      pushNotification('info', 'YouTube connect window opened');
      refetchYouTubeConnection();
    },
    onError: (_error, { episodeId }) => {
      setInfoEpisodeId(episodeId);
      setYoutubeInfoMessage('Unable to start YouTube connection. Please try again.');
      pushNotification('error', 'Failed to open YouTube connect');
    },
  });

  const publishToYouTubeMutation = useMutation({
    mutationFn: ({
      episodeId,
      payload,
    }: {
      episodeId: string;
      payload: YouTubePublishPayload;
    }) => publishEpisodeToYouTube(episodeId, payload),
    onMutate: ({ episodeId }) => {
      setInfoEpisodeId(episodeId);
      setYoutubeInfoMessage('Publishing to YouTube…');
      setPublishError(null);
    },
    onSuccess: (_response, { episodeId }) => {
      setYoutubeInfoMessage('Published to YouTube');
      setLastPublishedEpisodeId(episodeId);
      setEpisodeToPublish(null);
      pushNotification('success', 'Published to YouTube');
      loadEpisodes();
      refetchYouTubeConnection();
    },
    onError: (_error, { episodeId }) => {
      setPublishError('Failed to publish to YouTube. Please try again.');
      setInfoEpisodeId(episodeId);
      setYoutubeInfoMessage(null);
      pushNotification('error', 'Failed to publish to YouTube');
    },
  });

  const handleSubmitPublish = React.useCallback(
    (payload: YouTubePublishPayload) => {
      if (!episodeToPublish) {
        return;
      }

      publishToYouTubeMutation.mutate({
        episodeId: episodeToPublish.id,
        payload,
      });
    },
    [episodeToPublish, publishToYouTubeMutation],
  );

  const handleRequestYouTubeConnect = React.useCallback(
    (episode: PodcastEpisode) => {
      if (initiateYouTubeOAuthMutation.isPending) {
        return;
      }
      const redirectUri = window.location.href;
      initiateYouTubeOAuthMutation.mutate({ episodeId: episode.id, redirectUri });
    },
    [initiateYouTubeOAuthMutation],
  );

  const handleRequestPublish = React.useCallback(
    (episode: PodcastEpisode) => {
      setEpisodeToPublish(episode);
      setPublishError(null);
      setInfoEpisodeId(episode.id);
      setYoutubeInfoMessage(null);
    },
    [],
  );

  const handleClosePublishModal = React.useCallback(() => {
    setEpisodeToPublish(null);
    setPublishError(null);
  }, []);

  const isQuotaExceeded = Boolean(
    quota && !quota.isUnlimited && (quota.remaining ?? 0) <= 0,
  );
  const isUpgradeRequired = quota?.upgradeRequired ?? false;

  const isLoadingInitial = quotaLoading || episodesLoading;

  if (quotaError || episodesError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Failed to load podcast studio. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Podcast Studio</h1>
        <p className="mt-2 text-gray-600">
          Create and manage your podcast episodes
        </p>
      </div>

      {notification ? (
        <NotificationBanner
          notification={notification}
          onDismiss={() => setNotification(null)}
        />
      ) : null}

      <div
        role="tablist"
        aria-label="Podcast studio sections"
        className="mb-6 flex border-b border-gray-200"
      >
        <button
          type="button"
          role="tab"
          id="podcast-tab-episodes"
          aria-selected={activeTab === 'episodes'}
          aria-controls="podcast-panel-episodes"
          tabIndex={activeTab === 'episodes' ? 0 : -1}
          className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'episodes'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('episodes')}
        >
          Episodes
        </button>
        <button
          type="button"
          role="tab"
          id="podcast-tab-live-streaming"
          aria-selected={activeTab === 'live-streaming'}
          aria-controls="podcast-panel-live-streaming"
          tabIndex={activeTab === 'live-streaming' ? 0 : -1}
          className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'live-streaming'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('live-streaming')}
        >
          Live Streaming
        </button>
      </div>

      {isLoadingInitial ? (
        <div className="mb-6 flex items-center justify-center rounded-lg border border-dashed border-gray-200 p-6">
          <div
            className="h-5 w-5 animate-spin rounded-full border-b-2 border-indigo-600"
            aria-label="Loading podcast studio"
          />
          <span className="ml-3 text-sm text-gray-500">Loading podcast studio…</span>
        </div>
      ) : null}

      {activeTab === 'episodes' ? (
        <div
          role="tabpanel"
          id="podcast-panel-episodes"
          aria-labelledby="podcast-tab-episodes"
        >
          {quota ? (
            <>
              <QuotaHud quota={quota} />
              <QuotaWarning quota={quota} threshold={QUOTA_WARNING_THRESHOLD} />
            </>
          ) : null}

          {/* Video feature gate */}
          <div className="mb-6">
            <FeatureGate
              feature="podcast_video"
              requiredTier="premium"
              upgradeMessage={UPGRADE_MESSAGES.video}
              lockedTitle="Video features locked"
              lockedDescription="Video production is locked on your current plan."
              ctaLabel="Explore Premium video options"
            >
              <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                <h3 className="text-sm font-semibold text-purple-800">Video uploads enabled</h3>
                <p className="mt-1 text-sm text-purple-700">
                  Upload ready-to-share video episodes and syndicate directly to YouTube.
                </p>
              </div>
            </FeatureGate>
          </div>

          {/* Quota Card */}
          {quota ? <QuotaCard quota={quota} /> : null}

          {/* Actions Bar */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Episodes</h2>
            <button
              type="button"
              disabled={isQuotaExceeded || isUpgradeRequired}
              onClick={() => {
                if (!isQuotaExceeded && !isUpgradeRequired) {
                  setCreateModalOpen(true);
                }
              }}
              className={`inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm text-white ${
                isQuotaExceeded || isUpgradeRequired
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
              }`}
              title={
                isUpgradeRequired
                  ? quota?.upgradeMessage ?? 'Upgrade required to create new episodes.'
                  : isQuotaExceeded
                    ? 'Quota exceeded. Upgrade to Premium for unlimited episodes.'
                    : ''
              }
            >
              <svg
                className="mr-2 -ml-1 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Episode
            </button>
          </div>

          {/* Episodes List */}
          <SectionErrorBoundary
            fallback={
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                We couldn't load your episodes just now. Please refresh the page or try again later.
              </div>
            }
          >
            <EpisodesList
              episodes={episodesState}
              youtubeAccess={youtubeAccess}
              youtubeConnection={youtubeConnection}
              youtubeConnectionLoading={youtubeConnectionLoading}
              youtubeConnectionError={youtubeConnectionError}
              onRefreshYoutubeConnection={refetchYouTubeConnection}
              onRequestPublish={handleRequestPublish}
              onRequestYouTubeConnect={handleRequestYouTubeConnect}
              youtubeInfoMessage={youtubeInfoMessage}
              infoEpisodeId={infoEpisodeId}
              lastPublishedEpisodeId={lastPublishedEpisodeId}
              publishError={publishError}
              isConnecting={initiateYouTubeOAuthMutation.isPending}
              canUploadVideo={canUploadVideo}
              onEdit={(episode) => setEditingEpisode(episode)}
              onDelete={(episode) => setDeleteTarget(episode)}
              onNotify={pushNotification}
              onVideoUpload={(episode) => setVideoUploadEpisode(episode)}
            />
          </SectionErrorBoundary>
        </div>
      ) : null}

      {activeTab === 'live-streaming' ? (
        <div
          role="tabpanel"
          id="podcast-panel-live-streaming"
          aria-labelledby="podcast-tab-live-streaming"
          className="mt-6"
        >
          <FeatureGate
            feature="live_streaming"
            requiredTier="enterprise"
            upgradeMessage={UPGRADE_MESSAGES.liveStreaming}
            lockedTitle="Live streaming locked"
            lockedDescription="Host real-time investor broadcasts with an Enterprise plan."
            ctaLabel="Explore Enterprise streaming"
          >
            <SectionErrorBoundary
              fallback={
                <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  Live streaming controls failed to load. Please refresh and try again.
                </div>
              }
            >
              <LiveStreamManager podcastId={liveStreamPodcastId} tier={subscriptionTier} />
            </SectionErrorBoundary>
          </FeatureGate>
        </div>
      ) : null}
      <CreateEpisodeModal
        open={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={async (values) => {
          try {
            await createEpisodeMutation.mutateAsync({
              title: values.title,
              description: values.description || null,
              episode_number: Number(values.episodeNumber),
              season_number: Number(values.seasonNumber),
              audio_file_url: values.audioFileUrl,
              video_file_url: values.videoFileUrl || null,
              show_notes: values.showNotes || null,
              status: 'draft',
              updated_at: null,
              published_at: null,
              transcript: null,
              transcript_language: null,
              duration_seconds: null,
              youtube_video_id: null,
            });
          } catch (error) {
            console.error('Failed to create podcast episode', error);
          }
        }}
        isSubmitting={createEpisodeMutation.isPending}
      />

      <EditEpisodeModal
        episode={editingEpisode}
        onClose={() => setEditingEpisode(null)}
        onSubmit={(updates) =>
          editingEpisode &&
          updateEpisodeMutation.mutate({
            episodeId: editingEpisode.id,
            updates,
          })
        }
        isSubmitting={updateEpisodeMutation.isPending}
      />

      <DeleteEpisodeModal
        episode={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteEpisodeMutation.mutate(deleteTarget.id)}
        isSubmitting={deleteEpisodeMutation.isPending}
      />

      <FeatureGate
        feature="podcast_video"
        requiredTier="premium"
        upgradeMessage={UPGRADE_MESSAGES.video}
        lockedTitle="Video uploads locked"
        lockedDescription="Upgrade to access the video upload pipeline."
        ctaLabel="Upgrade for video uploads"
      >
        {videoUploadEpisode && (
          <VideoUploadModal
            open={Boolean(videoUploadEpisode)}
            onClose={closeVideoUploadModal}
            episodeId={videoUploadEpisode.id}
            episodeName={videoUploadEpisode.title}
            onSuccess={(response) => {
              pushNotification('success', `Video uploaded for "${videoUploadEpisode.title}"`);
              closeVideoUploadModal();
              return response;
            }}
          />
        )}
      </FeatureGate>

      <YouTubePublishModal
        open={Boolean(episodeToPublish)}
        episode={episodeToPublish}
        onClose={handleClosePublishModal}
        onSubmit={handleSubmitPublish}
        isSubmitting={publishToYouTubeMutation.isPending}
        error={publishError}
      />

      
    </div>
  );
}

function NotificationBanner({
  notification,
  onDismiss,
}: {
  notification: NotificationState;
  onDismiss: () => void;
}) {
  const palette: Record<NotificationState['type'], string> = {
    success: 'bg-emerald-50 border-emerald-300 text-emerald-700',
    error: 'bg-red-50 border-red-300 text-red-700',
    info: 'bg-indigo-50 border-indigo-300 text-indigo-700',
  };

  return (
    <div
      className={`mb-4 flex items-start justify-between rounded-md border px-4 py-3 text-sm shadow ${palette[notification.type]}`}
      role="status"
    >
      <span>{notification.message}</span>
      <button
        type="button"
        className="ml-4 text-xs font-semibold uppercase tracking-wide"
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        Close
      </button>
    </div>
  );
}

function QuotaHud({ quota }: { quota: QuotaSummary }) {
  const isUnlimited = quota.isUnlimited || quota.limit === null || quota.limit <= 0;
  const limit = quota.limit ?? 0;
  const used = quota.used;
  const percent = isUnlimited ? 0 : Math.min(Math.round((used / limit) * 100), 100);

  return (
    <section className="mb-4 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Plan usage
          </p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {isUnlimited ? `${used} episodes · no limit` : `${used} / ${limit} episodes`}
          </p>
          {!isUnlimited && (
            <p className="text-xs text-gray-500">{quota.remaining} remaining this cycle</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            {quota.tierLabel ?? quota.tier}
          </span>
          {!isUnlimited && (
            <div className="flex w-52 items-center gap-2">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all"
                  style={{ width: `${percent}%` }}
                  aria-hidden
                />
              </div>
              <span className="text-xs font-semibold text-gray-600">{percent}%</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function QuotaCard({ quota }: { quota: QuotaSummary }) {
  const stateStyles: Record<string, string> = {
    normal: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    critical: 'bg-red-100 text-red-800',
  };

  const badgeClass = stateStyles[quota.quotaState] ?? 'bg-gray-100 text-gray-800';
  const showUpgradeCta = quota.upgradeRequired && quota.upgradeCtaUrl;
  const warningLevel = quota.warningStatus ?? (quota.quotaState === 'critical' ? 'critical' : null);
  const warningRole = warningLevel === 'critical' ? 'alert' : 'status';
  const warningLabel = warningLevel === 'critical' ? 'Quota critical warning' : 'Quota warning';
  const percentUsed = !quota.isUnlimited && typeof quota.limit === 'number' && quota.limit > 0
    ? Math.round((quota.used / quota.limit) * 100)
    : null;
  const remainingCount = !quota.isUnlimited && typeof quota.remaining === 'number'
    ? quota.remaining
    : null;
  const fallbackWarningMessage = (() => {
    if (percentUsed === null) {
      return 'Approaching your monthly quota limit.';
    }

    const remainingCopy = remainingCount !== null
      ? `${remainingCount} ${remainingCount === 1 ? 'episode' : 'episodes'} remaining.`
      : '';

    return `${percentUsed}% of your monthly quota used.${remainingCopy ? ` ${remainingCopy}` : ''}`;
  })();
  const warningMessage = quota.warningMessage ?? fallbackWarningMessage;
  const warningStyles: Record<string, string> = {
    warning: 'mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900',
    critical: 'mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-900',
  };

  // Format billing cycle dates (DEV-016 Phase 2.2 - Sprint 4A)
  const formatBillingCycle = () => {
    if (!quota.periodStart || !quota.periodEnd) return null;

    const start = new Date(quota.periodStart);
    const end = new Date(quota.periodEnd);

    const formatDate = (date: Date) => {
      const day = date.getDate();
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    };

    return `${formatDate(start)} – ${formatDate(end)} · Resets at 11:59 PM`;
  };

  const billingCycleDisplay = formatBillingCycle();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Episode Quota
          </h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {quota.isUnlimited ? (
              'Unlimited'
            ) : (
              `${quota.used} / ${quota.limit ?? 0}`
            )}
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {quota.isUnlimited
              ? `Created ${quota.used} episodes this month`
              : `${quota.remaining} remaining this month`}
          </p>
          {quota.periodLabel && (
            <p className="mt-1 text-xs text-gray-500">
              {quota.periodLabel} Cycle
            </p>
          )}
          {billingCycleDisplay && (
            <p className="mt-0.5 text-xs text-gray-500">
              {billingCycleDisplay}
            </p>
          )}
          {warningLevel && (
            <div
              role={warningRole}
              aria-label={warningLabel}
              aria-live="polite"
              className={warningStyles[warningLevel] ?? 'mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900'}
            >
              <p className="text-sm font-medium">{warningMessage}</p>
              {remainingCount !== null && (
                <p className="mt-1 text-sm">
                  {remainingCount === 1
                    ? '1 episode remaining this month.'
                    : `${remainingCount} episodes remaining this month.`}
                </p>
              )}
            </div>
          )}
          {quota.upgradeMessage && !quota.upgradeRequired && (
            <p className="mt-2 text-sm text-indigo-700" role="status">{quota.upgradeMessage}</p>
          )}
        </div>
        <div className="flex flex-col items-end">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badgeClass} capitalize`}>
            {quota.tierLabel ?? quota.tier}
          </span>
          {showUpgradeCta && (
            <button
              type="button"
              className="mt-3 text-sm text-indigo-600 hover:text-indigo-500 font-medium"
              onClick={() => {
                window.location.href = quota.upgradeCtaUrl ?? '/pricing';
              }}
            >
              {quota.upgradeMessage ? 'View Upgrade Options' : 'Upgrade to Premium'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function EpisodesList({
  episodes,
  youtubeAccess,
  youtubeConnection,
  youtubeConnectionLoading,
  youtubeConnectionError,
  onRefreshYoutubeConnection,
  onRequestPublish,
  onRequestYouTubeConnect,
  youtubeInfoMessage,
  infoEpisodeId,
  lastPublishedEpisodeId,
  publishError,
  isConnecting,
  canUploadVideo,
  onEdit,
  onDelete,
  onNotify,
  onVideoUpload,
}: {
  episodes: PodcastEpisode[];
  youtubeAccess: FeatureAccessState;
  youtubeConnection: YouTubeConnectionStatus | undefined;
  youtubeConnectionLoading: boolean;
  youtubeConnectionError: boolean;
  onRefreshYoutubeConnection: () => Promise<unknown>;
  onRequestPublish: (episode: PodcastEpisode) => void;
  onRequestYouTubeConnect: (episode: PodcastEpisode) => void;
  youtubeInfoMessage: string | null;
  infoEpisodeId: string | null;
  lastPublishedEpisodeId: string | null;
  publishError: string | null;
  isConnecting: boolean;
  canUploadVideo: boolean;
  onEdit: (episode: PodcastEpisode) => void;
  onDelete: (episode: PodcastEpisode) => void;
  onNotify: (type: NotificationState['type'], message: string) => void;
  onVideoUpload: (episode: PodcastEpisode) => void;
}) {
  if (episodes.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No episodes</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating your first podcast episode.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {episodes.map((episode) => (
          <EpisodeListItem
            key={episode.id}
            episode={episode}
            youtubeAccess={youtubeAccess}
            youtubeConnection={youtubeConnection}
            youtubeConnectionLoading={youtubeConnectionLoading}
            youtubeConnectionError={youtubeConnectionError}
            onRefreshYoutubeConnection={onRefreshYoutubeConnection}
            onRequestPublish={onRequestPublish}
            onRequestYouTubeConnect={onRequestYouTubeConnect}
            youtubeInfoMessage={youtubeInfoMessage}
            infoEpisodeId={infoEpisodeId}
            lastPublishedEpisodeId={lastPublishedEpisodeId}
            publishError={publishError}
            isConnecting={isConnecting}
            canUploadVideo={canUploadVideo}
            onEdit={onEdit}
            onDelete={onDelete}
            onNotify={onNotify}
            onVideoUpload={onVideoUpload}
          />
        ))}
      </ul>
    </div>
  );
}

function EpisodeListItem({
  episode,
  youtubeAccess,
  youtubeConnection,
  youtubeConnectionLoading,
  youtubeConnectionError,
  onRefreshYoutubeConnection,
  onRequestPublish,
  onRequestYouTubeConnect,
  youtubeInfoMessage,
  infoEpisodeId,
  lastPublishedEpisodeId,
  publishError,
  isConnecting,
  canUploadVideo,
  onEdit,
  onDelete,
  onNotify,
  onVideoUpload,
}: {
  episode: PodcastEpisode;
  youtubeAccess: FeatureAccessState;
  youtubeConnection: YouTubeConnectionStatus | undefined;
  youtubeConnectionLoading: boolean;
  youtubeConnectionError: boolean;
  onRefreshYoutubeConnection: () => Promise<unknown>;
  onRequestPublish: (episode: PodcastEpisode) => void;
  onRequestYouTubeConnect: (episode: PodcastEpisode) => void;
  youtubeInfoMessage: string | null;
  infoEpisodeId: string | null;
  lastPublishedEpisodeId: string | null;
  publishError: string | null;
  isConnecting: boolean;
  canUploadVideo: boolean;
  onEdit: (episode: PodcastEpisode) => void;
  onDelete: (episode: PodcastEpisode) => void;
  onNotify: (type: NotificationState['type'], message: string) => void;
  onVideoUpload: (episode: PodcastEpisode) => void;
}) {
  const statusColors = {
    draft: 'bg-yellow-100 text-yellow-800',
    published: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-800',
  };

  const [transcribeSuccessMessage, setTranscribeSuccessMessage] = React.useState<string | null>(null);
  const [transcribeErrorMessage, setTranscribeErrorMessage] = React.useState<string | null>(null);

  const queryClient = useQueryClient();
  const isVideoEpisode = Boolean(episode.video_file_url);
  const isConnected = Boolean(youtubeConnection?.isConnected);
  const canUseYoutubeFeatures =
    youtubeAccess.hasAccess || (!youtubeConnectionLoading && youtubeConnection && !youtubeConnection.isConnected);
  const infoMessage = infoEpisodeId === episode.id ? youtubeInfoMessage : null;
  const publishErrorMessage = infoEpisodeId === episode.id ? publishError : null;
  const showPublishSuccess = lastPublishedEpisodeId === episode.id;
  const handleRetryConnection = React.useCallback(() => {
    void onRefreshYoutubeConnection()
      .then(() => onNotify('info', 'Refreshing YouTube connection status'))
      .catch(() => onNotify('error', 'Unable to refresh YouTube connection'));
  }, [onRefreshYoutubeConnection, onNotify]);

  const transcribeMutation = useMutation({
    mutationFn: () => transcribeEpisode(episode.id),
    onSuccess: () => {
      setTranscribeErrorMessage(null);
      setTranscribeSuccessMessage('Transcript generated successfully..');
      queryClient.invalidateQueries({ queryKey: ['podcastEpisodes'] });
      onNotify('success', `Transcript generated for "${episode.title}"`);
    },
    onError: () => {
      setTranscribeSuccessMessage(null);
      setTranscribeErrorMessage('Failed to transcribe audio. Please try again.');
      onNotify('error', 'Failed to transcribe episode audio');
    },
  });

  const handleTranscribe = () => {
    setTranscribeSuccessMessage(null);
    setTranscribeErrorMessage(null);
    transcribeMutation.mutate();
  };

  return (
    <li>
      <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              {/* Show thumbnail if available, otherwise show placeholder */}
              {episode.thumbnail_url ? (
                <img
                  src={episode.thumbnail_url}
                  alt={`Thumbnail for ${episode.title}`}
                  className="h-16 w-16 rounded object-cover"
                  data-testid="episode-thumbnail"
                />
              ) : (
                <div
                  className="h-16 w-16 rounded bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center"
                  data-testid="episode-thumbnail-placeholder"
                >
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
              <p className="text-sm font-medium text-indigo-600 truncate">
                {episode.title}
              </p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                  statusColors[episode.status]
                }`}
              >
                {episode.status}
              </span>
              {episode.video_file_url && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                  Video
                </span>
              )}
            </div>
            {episode.description && (
              <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                {episode.description}
              </p>
            )}
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span>
                S{episode.season_number} E{episode.episode_number}
              </span>
              <span className="mx-2">•</span>
              <span>
                {new Date(episode.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="ml-4 flex-shrink-0 flex gap-2">
            <button
              type="button"
              onClick={() => onEdit(episode)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(episode)}
              className="inline-flex items-center px-3 py-2 border border-red-200 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
            </button>
            {/* Transcription functionality (DEV-016 Phase 2.2 - Sprint 4A) */}
            {canUploadVideo ? (
              <div className="flex flex-col items-end gap-1">
                <button
                  type="button"
                  onClick={() => onVideoUpload(episode)}
                  className="inline-flex items-center px-3 py-2 border border-purple-300 shadow-sm text-sm leading-4 font-medium rounded-md text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Upload video
                </button>
                {episode.video_file_url ? (
                  <a
                    href={episode.video_file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-purple-600 hover:text-purple-800 underline"
                  >
                    View current video
                  </a>
                ) : (
                  <span className="text-xs text-gray-500">No video uploaded yet</span>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-end gap-2 rounded-md border border-purple-200 bg-purple-50 p-3 text-right">
                <p className="text-xs text-purple-700">Video uploads locked for your current plan.</p>
                <p className="text-xs text-purple-600">Upgrade to Premium to enable studio-quality uploads.</p>
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-purple-300 shadow-sm text-sm font-medium rounded-md text-purple-700 bg-white hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  onClick={() => onNotify('info', 'Upgrade to Premium to enable video uploads.')}
                >
                  Explore Premium video options
                </button>
              </div>
            )}

            <FeatureGate
              feature="transcription_basic"
              requiredTier="professional"
              upgradeMessage={UPGRADE_MESSAGES.transcription}
              lockedTitle="Transcription locked"
              lockedDescription="Generate AI-powered transcripts when you upgrade."
              ctaLabel="Upgrade for transcripts"
            >
              <div className="flex flex-col items-start gap-1">
                {episode.transcript === null ? (
                  <button
                    type="button"
                    onClick={handleTranscribe}
                    disabled={transcribeMutation.isPending}
                    className="inline-flex items-center px-3 py-2 border border-indigo-300 shadow-sm text-sm leading-4 font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {transcribeMutation.isPending ? 'Transcribing…' : 'Transcribe audio'}
                  </button>
                ) : (
                  <>
                    <div className="flex flex-col gap-1 max-w-md">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Transcript ready</span>
                        {episode.transcript_language && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {episode.transcript_language.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-700 line-clamp-2">
                        {episode.transcript}
                      </p>
                      <div className="flex gap-2">
                        <a
                          href={`/api/podcasts/episodes/${episode.id}/transcript`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-indigo-600 hover:text-indigo-800 underline"
                        >
                          Download transcript (TXT)
                        </a>
                        <a
                          href={`/api/podcasts/episodes/${episode.id}/transcript.srt`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-indigo-600 hover:text-indigo-800 underline"
                        >
                          Download transcript (SRT)
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={handleTranscribe}
                        disabled={transcribeMutation.isPending}
                        className="text-xs text-indigo-600 hover:text-indigo-800 underline text-left"
                      >
                        {transcribeMutation.isPending ? 'Regenerating…' : 'Regenerate Transcript'}
                      </button>
                    </div>
                  </>
                )}
                {transcribeSuccessMessage && (
                  <p className="text-xs text-emerald-600" role="status">
                    {transcribeSuccessMessage}
                  </p>
                )}
                {transcribeErrorMessage && (
                  <p className="text-xs text-red-600" role="alert">
                    {transcribeErrorMessage}
                  </p>
                )}
              </div>
            </FeatureGate>
          {isVideoEpisode ? (
            <div className="flex flex-col items-end gap-2">
              {youtubeAccess.isLoading || youtubeConnectionLoading ? (
                <span className="text-xs text-gray-500" role="status">
                  Checking YouTube access…
                </span>
              ) : !canUseYoutubeFeatures ? (
                <div className="flex flex-col items-end gap-1 text-right">
                  {(() => {
                    const upgradeMessageText =
                      youtubeAccess.upgradeMessage && /publish on youtube/i.test(youtubeAccess.upgradeMessage)
                        ? youtubeAccess.upgradeMessage
                        : 'Upgrade to Premium tier to publish on YouTube.';
                    return (
                      <>
                        <p className="text-xs text-indigo-600">{upgradeMessageText}</p>
                        <button
                          type="button"
                          className="inline-flex items-center px-3 py-2 border border-indigo-300 shadow-sm text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          title={upgradeMessageText}
                          onClick={() => onNotify('info', upgradeMessageText)}
                        >
                          Upgrade for YouTube
                        </button>
                      </>
                    );
                  })()}
                </div>
              ) : youtubeConnectionError ? (
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-red-600" role="alert">
                    We couldn't verify your YouTube connection.
                  </span>
                  <button
                    type="button"
                    onClick={handleRetryConnection}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-600 bg-white hover:bg-gray-50"
                  >
                    Retry connection
                  </button>
                </div>
              ) : !isConnected ? (
                <button
                  type="button"
                  onClick={() => onRequestYouTubeConnect(episode)}
                  disabled={isConnecting}
                  className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isConnecting && infoEpisodeId === episode.id ? 'Connecting…' : 'Connect YouTube'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onRequestPublish(episode)}
                  className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Publish to YouTube
                </button>
              )}
              {isConnected && youtubeConnection?.channelName ? (
                <span className="text-xs text-gray-500">
                  Connected as {youtubeConnection.channelName}
                </span>
              ) : null}
              {infoMessage ? (
                <p className="text-xs text-indigo-600 text-right" role="status">
                  {infoMessage}
                </p>
              ) : null}
              {publishErrorMessage ? (
                <p className="text-xs text-red-600 text-right" role="alert">
                  {publishErrorMessage}
                </p>
              ) : null}
              {showPublishSuccess ? (
                <p className="text-xs text-emerald-600" role="status">
                  Published to YouTube
                </p>
              ) : null}
            </div>
          ) : null}
          </div>
        </div>
      </div>
    </li>
  );
}

interface YouTubePublishModalProps {
  open: boolean;
  episode: PodcastEpisode | null;
  onClose: () => void;
  onSubmit: (payload: YouTubePublishPayload) => void;
  isSubmitting: boolean;
  error: string | null;
}

type PublishFormState = {
  title: string;
  description: string;
  tags: string;
  privacy: 'private' | 'unlisted' | 'public';
  scheduleTime: string;
};

const DEFAULT_PUBLISH_FORM_STATE: PublishFormState = {
  title: '',
  description: '',
  tags: '',
  privacy: 'unlisted',
  scheduleTime: '',
};

function YouTubePublishModal({
  open,
  episode,
  onClose,
  onSubmit,
  isSubmitting,
  error,
}: YouTubePublishModalProps) {
  const [formState, setFormState] = React.useState<PublishFormState>(DEFAULT_PUBLISH_FORM_STATE);
  const [validationError, setValidationError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open && episode) {
      setFormState({
        title: episode.title ?? '',
        description: episode.description ?? '',
        tags: '',
        privacy: 'unlisted',
        scheduleTime: '',
      });
      setValidationError(null);
      return;
    }

    if (!open) {
      setFormState(DEFAULT_PUBLISH_FORM_STATE);
      setValidationError(null);
    }
  }, [open, episode]);

  if (!open || !episode) {
    return null;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = formState.title.trim();
    if (!trimmedTitle) {
      setValidationError('Video title is required');
      return;
    }

    const payload: YouTubePublishPayload = {
      title: trimmedTitle,
      description: formState.description.trim(),
      tags: formState.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      privacy: formState.privacy,
      scheduleTime: formState.scheduleTime
        ? new Date(`${formState.scheduleTime}:00Z`).toISOString()
        : null,
    };

    setValidationError(null);
    onSubmit(payload);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Publish to YouTube</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-gray-500 hover:text-gray-700"
            aria-label="Close publish modal"
          >
            x
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="youtube-title" className="block text-sm font-medium text-gray-700">
              Video title
            </label>
            <input
              id="youtube-title"
              type="text"
              value={formState.title}
              onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              placeholder="Investor update episode"
            />
          </div>

          <div>
            <label htmlFor="youtube-description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="youtube-description"
              value={formState.description}
              onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
              rows={4}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              placeholder="Add show notes and key talking points for viewers"
            />
          </div>

          <div>
            <label htmlFor="youtube-tags" className="block text-sm font-medium text-gray-700">
              Tags (comma separated)
            </label>
            <input
              id="youtube-tags"
              type="text"
              value={formState.tags}
              onChange={(event) => setFormState((prev) => ({ ...prev, tags: event.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              placeholder="investor relations, earnings"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="youtube-privacy" className="block text-sm font-medium text-gray-700">
                Privacy
              </label>
              <select
                id="youtube-privacy"
                value={formState.privacy}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    privacy: event.target.value as PublishFormState['privacy'],
                  }))
                }
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              >
                <option value="private">Private</option>
                <option value="unlisted">Unlisted</option>
                <option value="public">Public</option>
              </select>
            </div>
            <div>
              <label htmlFor="youtube-schedule" className="block text-sm font-medium text-gray-700">
                Schedule (optional)
              </label>
              <input
                id="youtube-schedule"
                type="datetime-local"
                value={formState.scheduleTime}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, scheduleTime: event.target.value }))
                }
                disabled={formState.privacy === 'private'}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-100"
              />
            </div>
          </div>

          {validationError ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {validationError}
            </div>
          ) : null}
          {error ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-indigo-300"
            >
              {isSubmitting ? 'Publishing…' : 'Publish episode'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
