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

import { FeatureGate } from '../../components/podcast/FeatureGate';
import { CreateEpisodeModal } from '../../components/podcast/CreateEpisodeModal';
import { EditEpisodeModal } from '../../components/podcast/EditEpisodeModal';
import { DeleteEpisodeModal } from '../../components/podcast/DeleteEpisodeModal';
import AudioUploadModal from '../../components/podcast/AudioUploadModal';
import {
  getQuotaSummary,
  listEpisodes,
  publishEpisodeToYouTube,
  createEpisode,
  updateEpisode,
  deleteEpisode,
  type PodcastEpisode,
  type QuotaSummary,
} from '../../services/api/podcasts';
import { useFeatureAccess } from '../../hooks/useFeatureAccess';

type FeatureAccessState = ReturnType<typeof useFeatureAccess>;
type CreateEpisodePayload = Parameters<typeof createEpisode>[0];
type UpdateEpisodePayload = Parameters<typeof updateEpisode>[1];

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
  const [uploadTarget, setUploadTarget] = React.useState<PodcastEpisode | null>(null);

  const {
    data: quota,
    isLoading: quotaLoading,
    isError: quotaError,
  } = useQuery({
    queryKey: ['podcastQuota'],
    queryFn: getQuotaSummary,
  });

  const {
    data: episodes = [],
    isLoading: episodesLoading,
    isError: episodesError,
  } = useQuery({
    queryKey: ['podcastEpisodes'],
    queryFn: () => listEpisodes(),
  });

  const youtubeAccess = useFeatureAccess({ feature: 'youtube_integration' });

  const createEpisodeMutation = useMutation({
    mutationFn: (payload: CreateEpisodePayload) => createEpisode(payload),
    onSuccess: () => {
      setCreateModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['podcastEpisodes'] });
    },
  });

  const updateEpisodeMutation = useMutation({
    mutationFn: ({ episodeId, updates }: { episodeId: string; updates: UpdateEpisodePayload }) =>
      updateEpisode(episodeId, updates),
    onSuccess: () => {
      setEditingEpisode(null);
      queryClient.invalidateQueries({ queryKey: ['podcastEpisodes'] });
    },
  });

  const deleteEpisodeMutation = useMutation({
    mutationFn: (episodeId: string) => deleteEpisode(episodeId),
    onSuccess: () => {
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ['podcastEpisodes'] });
    },
  });

  const isQuotaExceeded = Boolean(
    quota && !quota.isUnlimited && (quota.remaining ?? 0) <= 0,
  );
  const isUpgradeRequired = quota?.upgradeRequired ?? false;

  if (quotaLoading || episodesLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

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

      {/* Quota Card */}
      {quota && <QuotaCard quota={quota} />}

      {/* Actions Bar */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Episodes</h2>
        <button
          type="button"
          disabled={isQuotaExceeded || isUpgradeRequired}
          onClick={() => {
            if (!isQuotaExceeded && !isUpgradeRequired) {
              setCreateModalOpen(true);
            }
          }}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
            isQuotaExceeded || isUpgradeRequired
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
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
      <EpisodesList
        episodes={episodes}
        youtubeAccess={youtubeAccess}
        onEdit={(episode) => setEditingEpisode(episode)}
        onDelete={(episode) => setDeleteTarget(episode)}
        onUploadAudio={(episode) => setUploadTarget(episode)}
      />

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

      {uploadTarget && (
        <AudioUploadModal
          open={Boolean(uploadTarget)}
          onClose={() => setUploadTarget(null)}
          episodeId={uploadTarget.id}
          episodeName={uploadTarget.title}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['podcastEpisodes'] });
            setUploadTarget(null);
          }}
        />
      )}
    </div>
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

  const cycleLabel = quota.periodLabel ?? quota.period ?? 'Current cycle';
  const periodDetails = React.useMemo(() => {
    if (!quota.periodStart || !quota.periodEnd) {
      return null;
    }

    const startDate = new Date(quota.periodStart);
    const endDate = new Date(quota.periodEnd);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return null;
    }

    const dateFormatter = new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const timeFormatter = new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    return {
      range: `${dateFormatter.format(startDate)} – ${dateFormatter.format(endDate)}`,
      resetLabel: timeFormatter.format(endDate),
    };
  }, [quota.periodStart, quota.periodEnd]);

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
          <p className="mt-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
            {cycleLabel} cycle
          </p>
          {periodDetails && (
            <p className="mt-1 text-xs text-gray-500">
              {periodDetails.range} · resets at {periodDetails.resetLabel.toLowerCase()}
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
          {quota.upgradeRequired && quota.upgradeMessage && (
            <div
              role="alert"
              aria-label="Upgrade required"
              className="mt-2 rounded-md border border-indigo-200 bg-indigo-50 px-4 py-3 text-indigo-900"
            >
              <p className="text-sm font-medium">{quota.upgradeMessage}</p>
            </div>
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
  onEdit,
  onDelete,
  onUploadAudio,
}: {
  episodes: PodcastEpisode[];
  youtubeAccess: FeatureAccessState;
  onEdit: (episode: PodcastEpisode) => void;
  onDelete: (episode: PodcastEpisode) => void;
  onUploadAudio: (episode: PodcastEpisode) => void;
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
            onEdit={onEdit}
            onDelete={onDelete}
            onUploadAudio={onUploadAudio}
          />
        ))}
      </ul>
    </div>
  );
}

function EpisodeListItem({
  episode,
  youtubeAccess,
  onEdit,
  onDelete,
  onUploadAudio,
}: {
  episode: PodcastEpisode;
  youtubeAccess: FeatureAccessState;
  onEdit: (episode: PodcastEpisode) => void;
  onDelete: (episode: PodcastEpisode) => void;
  onUploadAudio: (episode: PodcastEpisode) => void;
}) {
  const statusColors = {
    draft: 'bg-yellow-100 text-yellow-800',
    published: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-800',
  };

  const [youtubeSuccessMessage, setYoutubeSuccessMessage] = React.useState<string | null>(null);
  const [youtubeErrorMessage, setYoutubeErrorMessage] = React.useState<string | null>(null);

  const youtubeMutation = useMutation({
    mutationFn: () => publishEpisodeToYouTube(episode.id),
    onSuccess: () => {
      setYoutubeErrorMessage(null);
      setYoutubeSuccessMessage('Published to YouTube');
    },
    onError: () => {
      setYoutubeSuccessMessage(null);
      setYoutubeErrorMessage('Failed to publish to YouTube. Please try again.');
    },
  });

  const handlePublish = () => {
    setYoutubeSuccessMessage(null);
    setYoutubeErrorMessage(null);
    youtubeMutation.mutate();
  };

  return (
    <li>
      <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
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
              onClick={() => onUploadAudio(episode)}
              className="inline-flex items-center px-3 py-2 border border-indigo-200 shadow-sm text-sm leading-4 font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              title="Upload audio file for this episode"
            >
              <svg
                className="mr-1.5 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Upload Audio
            </button>
            <button
              type="button"
              onClick={() => onDelete(episode)}
              className="inline-flex items-center px-3 py-2 border border-red-200 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
            </button>
            {episode.video_file_url && (
              <div className="flex flex-col items-end gap-1">
                {youtubeAccess.isLoading ? (
                  <span className="text-xs text-gray-500" role="status">
                    Checking YouTube access…
                  </span>
                ) : youtubeAccess.hasAccess ? (
                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={youtubeMutation.isPending}
                    className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {youtubeMutation.isPending ? 'Publishing…' : 'Publish to YouTube'}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-500 bg-white cursor-not-allowed"
                    title={youtubeAccess.upgradeMessage ?? 'Upgrade to Premium tier to publish on YouTube.'}
                  >
                    Upgrade for YouTube
                  </button>
                )}
                {youtubeAccess.upgradeRequired && !youtubeAccess.hasAccess && youtubeAccess.upgradeMessage && (
                  <p className="text-xs text-indigo-700 text-right">{youtubeAccess.upgradeMessage}</p>
                )}
                {youtubeSuccessMessage && (
                  <p className="text-xs text-emerald-600" role="status">
                    {youtubeSuccessMessage}
                  </p>
                )}
                {youtubeErrorMessage && (
                  <p className="text-xs text-red-600" role="alert">
                    {youtubeErrorMessage}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
