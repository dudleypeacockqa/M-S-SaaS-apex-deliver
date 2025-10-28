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
import { useQuery } from '@tanstack/react-query';
import { FeatureGate } from '../../components/podcast/FeatureGate';
import {
  getQuotaSummary,
  listEpisodes,
  type PodcastEpisode,
  type QuotaSummary,
} from '../../services/api/podcasts';

export function PodcastStudio() {
  return (
    <FeatureGate feature="podcast_audio">
      <PodcastStudioContent />
    </FeatureGate>
  );
}

function PodcastStudioContent() {
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
      <EpisodesList episodes={episodes} />
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
          {quota.warningMessage && (
            <p className="mt-2 text-sm text-amber-700">{quota.warningMessage}</p>
          )}
          {quota.upgradeRequired && quota.upgradeMessage && (
            <p className="mt-2 text-sm text-indigo-700">{quota.upgradeMessage}</p>
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

function EpisodesList({ episodes }: { episodes: PodcastEpisode[] }) {
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
          <EpisodeListItem key={episode.id} episode={episode} />
        ))}
      </ul>
    </div>
  );
}

function EpisodeListItem({ episode }: { episode: PodcastEpisode }) {
  const statusColors = {
    draft: 'bg-yellow-100 text-yellow-800',
    published: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-800',
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
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
