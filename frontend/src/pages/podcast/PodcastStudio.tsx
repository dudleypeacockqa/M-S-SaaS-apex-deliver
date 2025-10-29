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
import {
  getQuotaSummary,
  listEpisodes,
  publishEpisodeToYouTube,
  transcribeEpisode,
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
          {quota.upgradeRequired && quota.upgradeMessage && (
            <p className="mt-2 text-sm text-indigo-700" role="alert">{quota.upgradeMessage}</p>
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
}: {
  episodes: PodcastEpisode[];
  youtubeAccess: FeatureAccessState;
  onEdit: (episode: PodcastEpisode) => void;
  onDelete: (episode: PodcastEpisode) => void;
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
}: {
  episode: PodcastEpisode;
  youtubeAccess: FeatureAccessState;
  onEdit: (episode: PodcastEpisode) => void;
  onDelete: (episode: PodcastEpisode) => void;
}) {
  const statusColors = {
    draft: 'bg-yellow-100 text-yellow-800',
    published: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-800',
  };

  const [youtubeSuccessMessage, setYoutubeSuccessMessage] = React.useState<string | null>(null);
  const [youtubeErrorMessage, setYoutubeErrorMessage] = React.useState<string | null>(null);
  const [transcriptionSuccessMessage, setTranscriptionSuccessMessage] = React.useState<string | null>(null);
  const [transcriptionErrorMessage, setTranscriptionErrorMessage] = React.useState<string | null>(null);

  const queryClient = useQueryClient();

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

  const transcriptionMutation = useMutation({
    mutationFn: () => transcribeEpisode(episode.id),
    onSuccess: () => {
      setTranscriptionErrorMessage(null);
      setTranscriptionSuccessMessage('Transcript generated successfully');
      // Refresh episodes list to show updated transcript
      queryClient.invalidateQueries({ queryKey: ['episodes'] });
    },
    onError: () => {
      setTranscriptionSuccessMessage(null);
      setTranscriptionErrorMessage('Failed to transcribe audio. Please try again.');
    },
  });

  const handlePublish = () => {
    setYoutubeSuccessMessage(null);
    setYoutubeErrorMessage(null);
    youtubeMutation.mutate();
  };

  const handleTranscribe = () => {
    setTranscriptionSuccessMessage(null);
    setTranscriptionErrorMessage(null);
    transcriptionMutation.mutate();
  };

  return (
    <li>
      <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              {episode.thumbnail_url ? (
                <img
                  src={episode.thumbnail_url}
                  alt={`Thumbnail for ${episode.title}`}
                  className="h-16 w-16 rounded object-cover border border-gray-200"
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
            <div className="flex flex-col items-end gap-1">
              {episode.transcript === null ? (
                <button
                  type="button"
                  onClick={handleTranscribe}
                  disabled={transcriptionMutation.isPending}
                  className="inline-flex items-center px-3 py-2 border border-indigo-300 shadow-sm text-sm leading-4 font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {transcriptionMutation.isPending ? 'Transcribing…' : 'Transcribe Audio'}
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
                        Download Transcript (TXT)
                      </a>
                      <a
                        href={`/api/podcasts/episodes/${episode.id}/transcript.srt`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-600 hover:text-indigo-800 underline"
                      >
                        Download Transcript (SRT)
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={handleTranscribe}
                      disabled={transcriptionMutation.isPending}
                      className="text-xs text-indigo-600 hover:text-indigo-800 underline text-left"
                    >
                      {transcriptionMutation.isPending ? 'Regenerating…' : 'Regenerate Transcript'}
                    </button>
                  </div>
                </>
              )}
              {transcriptionSuccessMessage && (
                <p className="text-xs text-emerald-600" role="status">
                  {transcriptionSuccessMessage}
                </p>
              )}
              {transcriptionErrorMessage && (
                <p className="text-xs text-red-600" role="alert">
                  {transcriptionErrorMessage}
                </p>
              )}
            </div>
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
