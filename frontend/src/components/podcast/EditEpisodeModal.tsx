import { useState, useEffect } from 'react';
import type { PodcastEpisode } from '../../services/api/podcasts';

interface EditEpisodeModalProps {
  episode: PodcastEpisode | null;
  onClose: () => void;
  onSubmit: (updates: {
    title?: string;
    description?: string;
    show_notes?: string;
    status?: 'draft' | 'published' | 'archived';
  }) => void;
  isSubmitting: boolean;
}

export function EditEpisodeModal({ episode, onClose, onSubmit, isSubmitting }: EditEpisodeModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    show_notes: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
  });
  const [error, setError] = useState<string | null>(null);

  // Pre-populate form when episode changes
  useEffect(() => {
    if (episode) {
      setFormData({
        title: episode.title,
        description: episode.description || '',
        show_notes: episode.show_notes || '',
        status: episode.status,
      });
      setError(null);
    }
  }, [episode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    onSubmit({
      title: formData.title,
      description: formData.description || undefined,
      show_notes: formData.show_notes || undefined,
      status: formData.status,
    });
  };

  if (!episode) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Edit Episode</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              id="edit-title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>

          {/* Show Notes */}
          <div>
            <label htmlFor="edit-show-notes" className="block text-sm font-medium text-gray-700">
              Show Notes
            </label>
            <textarea
              id="edit-show-notes"
              value={formData.show_notes}
              onChange={(e) => setFormData({ ...formData, show_notes: e.target.value })}
              rows={4}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="edit-status"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as 'draft' | 'published' | 'archived' })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Episode Info (read-only) */}
          <div className="rounded-md bg-gray-50 p-4">
            <p className="text-sm text-gray-600">
              <strong>Season:</strong> {episode.season_number} <strong className="ml-4">Episode:</strong>{' '}
              {episode.episode_number}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              <strong>Audio URL:</strong>{' '}
              <a href={episode.audio_file_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                {episode.audio_file_url}
              </a>
            </p>
            {episode.video_file_url && (
              <p className="mt-1 text-sm text-gray-600">
                <strong>Video URL:</strong>{' '}
                <a href={episode.video_file_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                  {episode.video_file_url}
                </a>
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-50 p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
