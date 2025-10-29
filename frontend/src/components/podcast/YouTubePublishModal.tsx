import React, { useEffect, useState } from 'react';

import type {
  PodcastEpisode,
  YouTubeConnectionStatus,
  YouTubePublishPayload,
} from '../../services/api/podcasts';

interface YouTubePublishModalProps {
  open: boolean;
  episode: PodcastEpisode | null;
  connection: YouTubeConnectionStatus | undefined;
  isSubmitting: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onSubmit: (payload: YouTubePublishPayload) => void;
}

const DEFAULT_PRIVACY: YouTubePublishPayload['privacy'] = 'unlisted';

export function YouTubePublishModal({
  open,
  episode,
  connection,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
}: YouTubePublishModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [privacy, setPrivacy] = useState<YouTubePublishPayload['privacy']>(DEFAULT_PRIVACY);
  const [scheduleTime, setScheduleTime] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (open && episode) {
      setTitle(episode.title ?? '');
      setDescription(episode.description ?? '');
      setTags('');
      setPrivacy(DEFAULT_PRIVACY);
      setScheduleTime('');
      setFormError(null);
    }
    if (!open) {
      setFormError(null);
    }
  }, [open, episode]);

  if (!open || !episode) {
    return null;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setFormError('Video title is required');
      return;
    }

    const tagList = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    let scheduledAt: string | null = null;
    if (scheduleTime) {
      const parsed = new Date(scheduleTime);
      if (!Number.isNaN(parsed.getTime())) {
        scheduledAt = parsed.toISOString();
      } else {
        setFormError('Enter a valid schedule time or leave blank.');
        return;
      }
    }

    const payload: YouTubePublishPayload = {
      title: trimmedTitle,
      description: description.trim(),
      tags: tagList,
      privacy,
      scheduleTime: scheduledAt,
    };

    onSubmit(payload);
  };

  const close = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      onClick={close}
    >
      <div
        className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Publish to YouTube</h2>
            <p className="mt-1 text-sm text-gray-600">
              {connection?.isConnected
                ? `Publishing as ${connection.channelName ?? 'connected channel'}.`
                : 'Connect your YouTube channel from the episode list before publishing.'}
            </p>
          </div>
          <button
            type="button"
            className="text-sm font-medium text-gray-500 hover:text-gray-700"
            onClick={close}
          >
            Close
          </button>
        </div>

        {(formError || errorMessage) && (
          <div className="mb-4 space-y-2" role="alert">
            {formError && (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {formError}
              </p>
            )}
            {errorMessage && (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {errorMessage}
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="youtube-title" className="block text-sm font-medium text-gray-700">
              Video title
            </label>
            <input
              id="youtube-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Investor update episode"
            />
          </div>

          <div>
            <label htmlFor="youtube-description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="youtube-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="investor relations, m&a strategy"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="youtube-privacy" className="block text-sm font-medium text-gray-700">
                Privacy
              </label>
              <select
                id="youtube-privacy"
                value={privacy}
                onChange={(event) => setPrivacy(event.target.value as YouTubePublishPayload['privacy'])}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
                value={scheduleTime}
                onChange={(event) => setScheduleTime(event.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={close}
              className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Publishing…' : 'Publish episode'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

