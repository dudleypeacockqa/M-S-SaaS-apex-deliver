import React from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getYouTubeConnectionStatus,
  getYouTubePublishStatus,
  initiateYouTubeOAuth,
  disconnectYouTubeChannel,
  publishEpisodeToYouTube,
  type PodcastEpisode,
  type YouTubePublishPayload,
  type YouTubePublishState,
  type YouTubeConnectionStatus,
} from '../../services/api/podcasts';
import { YouTubeMetadataForm, type YouTubeMetadataValues, type YouTubeMetadataErrors } from './YouTubeMetadataForm';
import { YouTubePublishButton } from './YouTubePublishButton';
import { YouTubeStatusBadge } from './YouTubeStatusBadge';
import type { FeatureAccessState } from '../../hooks/useFeatureAccess';

interface NotificationBanner {
  type: 'success' | 'error' | 'info';
  message: string;
}

interface YouTubePublisherProps {
  episode: PodcastEpisode;
  youtubeAccess: FeatureAccessState;
}

const DEFAULT_CATEGORY = '22';
const DEFAULT_PRIVACY: YouTubeMetadataValues['privacy'] = 'unlisted';

const BANNER_CLASSNAMES: Record<NotificationBanner['type'], string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  error: 'border-red-200 bg-red-50 text-red-700',
  info: 'border-indigo-200 bg-indigo-50 text-indigo-700',
};

export function YouTubePublisher({ episode, youtubeAccess }: YouTubePublisherProps) {
  const queryClient = useQueryClient();
  const [metadata, setMetadata] = React.useState<YouTubeMetadataValues>(() => ({
    title: episode.title ?? '',
    description: episode.description ?? '',
    tags: '',
    category: DEFAULT_CATEGORY,
    privacy: DEFAULT_PRIVACY,
    scheduleTime: '',
  }));
  const [errors, setErrors] = React.useState<YouTubeMetadataErrors>({});
  const [banner, setBanner] = React.useState<NotificationBanner | null>(null);

  const handleErrorChange = React.useCallback((field: keyof YouTubeMetadataValues, message: string | null) => {
    setErrors((prev) => {
      if (!message) {
        const { [field]: _omit, ...rest } = prev;
        return rest;
      }
      return { ...prev, [field]: message };
    });
  }, []);

  const connectionQuery = useQuery<YouTubeConnectionStatus>({
    queryKey: ['youtubeConnection'],
    queryFn: getYouTubeConnectionStatus,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const statusQuery = useQuery<YouTubePublishState>({
    queryKey: ['youtubeStatus', episode.id],
    queryFn: () => getYouTubePublishStatus(episode.id),
    refetchOnWindowFocus: false,
  });

  const oauthMutation = useMutation({
    mutationFn: async () => {
      const redirectUri = window.location.href;
      const response = await initiateYouTubeOAuth(episode.id, redirectUri);
      window.open(response.authorizationUrl, '_blank', 'noopener');
    },
    onSuccess: () => {
      setBanner({ type: 'info', message: 'Complete the YouTube connection in the popup to link your channel.' });
      connectionQuery.refetch();
    },
    onError: () => {
      setBanner({ type: 'error', message: 'Failed to initiate YouTube connection.' });
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: () => disconnectYouTubeChannel(episode.id),
    onSuccess: () => {
      setBanner({ type: 'info', message: 'Disconnected YouTube channel.' });
      connectionQuery.refetch();
      statusQuery.refetch();
    },
    onError: () => {
      setBanner({ type: 'error', message: 'Unable to disconnect the YouTube channel. Please try again.' });
    },
  });

  const publishMutation = useMutation({
    mutationFn: (payload: YouTubePublishPayload) => publishEpisodeToYouTube(episode.id, payload),
    onSuccess: () => {
      setBanner({ type: 'success', message: 'Episode "' + episode.title + '" published to YouTube.' });
      statusQuery.refetch();
      queryClient.invalidateQueries({ queryKey: ['podcastEpisodes'] });
    },
    onError: () => {
      setBanner({ type: 'error', message: 'Failed to publish to YouTube. Please try again.' });
    },
  });

  const handleFieldChange = React.useCallback(<K extends keyof YouTubeMetadataValues>(field: K, value: YouTubeMetadataValues[K]) => {
    setMetadata((prev) => {
      const next: YouTubeMetadataValues = { ...prev, [field]: value };
      if (field === 'privacy' && value === 'private') {
        next.scheduleTime = '';
        handleErrorChange('scheduleTime', null);
      }
      return next;
    });
  }, [handleErrorChange]);

  const validateMetadata = React.useCallback((): YouTubeMetadataErrors => {
    const validation: YouTubeMetadataErrors = {};
    const trimmedTitle = metadata.title.trim();

    if (!trimmedTitle) {
      validation.title = 'Title is required';
    } else if (trimmedTitle.length > 100) {
      validation.title = 'Title must be 100 characters or fewer';
    }

    if (metadata.description.length > 5000) {
      validation.description = 'Description must be 5000 characters or fewer';
    }

    if (metadata.scheduleTime && metadata.privacy === 'private') {
      validation.scheduleTime = 'Scheduling is unavailable for private uploads';
    }

    return validation;
  }, [metadata]);

  const handlePublish = () => {
    const validation = validateMetadata();
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      return;
    }

    const trimmedTitle = metadata.title.trim();
    const allowSchedule = metadata.privacy !== 'private' && metadata.scheduleTime;
    const scheduleIso = allowSchedule
      ? new Date((metadata.scheduleTime || '') + ':00Z').toISOString()
      : null;

    const payload: YouTubePublishPayload = {
      title: trimmedTitle,
      description: metadata.description.trim(),
      tags: metadata.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      privacy: metadata.privacy,
      scheduleTime: scheduleIso,
    };

    setBanner(null);
    publishMutation.mutate(payload);
  };

  const handleConnect = () => oauthMutation.mutate();
  const handleReconnect = () => oauthMutation.mutate();
  const handleDisconnect = () => disconnectMutation.mutate();

  if (youtubeAccess.isLoading) {
    return <p className="text-sm text-gray-500">Checking access…</p>;
  }

  if (!youtubeAccess.hasAccess) {
    const upgradeMessage = youtubeAccess.upgradeMessage ?? 'Upgrade to Premium to publish on YouTube.';
    return (
      <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
        <p className="text-sm text-indigo-900">{upgradeMessage}</p>
        <button
          type="button"
          className="mt-3 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => {
            window.location.href = youtubeAccess.upgradeCtaUrl ?? '/pricing';
          }}
        >
          View plans
        </button>
      </div>
    );
  }

  const connection = connectionQuery.data;
  const isConnected = Boolean(connection?.isConnected);
  const requiresAction = Boolean(connection?.requiresAction);
  const connectionLoading = connectionQuery.isLoading;
  const publishState: YouTubePublishState | undefined = statusQuery.data;
  const status = publishState?.status ?? 'not_published';
  const isPublishing = publishMutation.isPending;

  return (
    <div className="space-y-6">
      {banner && (
        <div role={banner.type === 'error' ? 'alert' : 'status'} className={'rounded-md border px-3 py-2 text-sm ' + BANNER_CLASSNAMES[banner.type]}>
          {banner.message}
        </div>
      )}

      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-900">YouTube connection</p>
            {connectionLoading ? (
              <p className="text-sm text-gray-500">Checking connection status…</p>
            ) : isConnected ? (
              <>
                <p className="text-sm text-gray-600">Connected as {connection?.channelName ?? 'YouTube channel'}.</p>
                {connection?.channelUrl ? (
                  <a
                    href={connection.channelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-600 hover:text-indigo-800 underline"
                  >
                    View channel
                  </a>
                ) : null}
                {requiresAction ? (
                  <p className="text-sm text-amber-600" role="status">
                    Re-authentication required before publishing your next episode.
                  </p>
                ) : null}
              </>
            ) : (
              <p className="text-sm text-gray-600">Connect your YouTube channel to publish video episodes.</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            {isConnected ? (
              <>
                <button
                  type="button"
                  onClick={handleDisconnect}
                  disabled={disconnectMutation.isPending}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {disconnectMutation.isPending ? 'Disconnecting…' : 'Disconnect channel'}
                </button>
                {requiresAction ? (
                  <button
                    type="button"
                    onClick={handleReconnect}
                    disabled={oauthMutation.isPending}
                    className="inline-flex items-center rounded-md border border-indigo-200 bg-white px-3 py-2 text-sm font-medium text-indigo-700 shadow-sm hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {oauthMutation.isPending ? 'Connecting…' : 'Reconnect YouTube'}
                  </button>
                ) : null}
              </>
            ) : (
              <button
                type="button"
                onClick={handleConnect}
                disabled={oauthMutation.isPending}
                className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {oauthMutation.isPending ? 'Connecting…' : 'Connect YouTube'}
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">Status</span>
            <YouTubeStatusBadge status={status} />
          </div>
          {publishState?.lastCheckedAt ? (
            <span className="text-xs text-gray-500">Last checked {new Date(publishState.lastCheckedAt).toLocaleString()}</span>
          ) : null}
        </div>

        <YouTubeMetadataForm values={metadata} errors={errors} onFieldChange={handleFieldChange} onErrorChange={handleErrorChange} />

        <div className="flex items-center justify-between">
          {isPublishing ? (
            <span className="text-sm text-indigo-600" role="status">
              Publishing to YouTube…
            </span>
          ) : (
            <span />
          )}
          <YouTubePublishButton isLoading={isPublishing} disabled={!isConnected} onClick={handlePublish} />
        </div>
      </section>
    </div>
  );
}
