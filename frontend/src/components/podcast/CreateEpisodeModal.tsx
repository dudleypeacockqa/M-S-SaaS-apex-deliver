import { useState } from 'react';

interface CreateEpisodeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: {
    title: string;
    description: string;
    episodeNumber: string;
    seasonNumber: string;
    audioFileUrl: string;
    videoFileUrl: string;
    showNotes: string;
  }) => void;
  isSubmitting: boolean;
}

export function CreateEpisodeModal({ open, onClose, onSubmit, isSubmitting }: CreateEpisodeModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    episodeNumber: '',
    seasonNumber: '',
    audioFileUrl: '',
    videoFileUrl: '',
    showNotes: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.episodeNumber || parseInt(formData.episodeNumber) < 1) {
      setError('Valid episode number is required');
      return;
    }
    if (!formData.seasonNumber || parseInt(formData.seasonNumber) < 1) {
      setError('Valid season number is required');
      return;
    }
    if (!formData.audioFileUrl.trim()) {
      setError('Audio file URL is required');
      return;
    }

    onSubmit(formData);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Create New Episode</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>

          {/* Episode and Season Numbers */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="episode-number" className="block text-sm font-medium text-gray-700">
                Episode Number *
              </label>
              <input
                id="episode-number"
                type="number"
                min="1"
                value={formData.episodeNumber}
                onChange={(e) => setFormData({ ...formData, episodeNumber: e.target.value })}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="season-number" className="block text-sm font-medium text-gray-700">
                Season Number *
              </label>
              <input
                id="season-number"
                type="number"
                min="1"
                value={formData.seasonNumber}
                onChange={(e) => setFormData({ ...formData, seasonNumber: e.target.value })}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* Audio File URL */}
          <div>
            <label htmlFor="audio-file-url" className="block text-sm font-medium text-gray-700">
              Audio File URL *
            </label>
            <input
              id="audio-file-url"
              type="url"
              value={formData.audioFileUrl}
              onChange={(e) => setFormData({ ...formData, audio_file_url: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              placeholder="https://cdn.example.com/episode.mp3"
              required
            />
          </div>

          {/* Video File URL */}
          <div>
            <label htmlFor="video-file-url" className="block text-sm font-medium text-gray-700">
              Video File URL (optional)
            </label>
            <input
              id="video-file-url"
              type="url"
              value={formData.video_file_url}
              onChange={(e) => setFormData({ ...formData, video_file_url: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              placeholder="https://cdn.example.com/episode.mp4"
            />
          </div>

          {/* Show Notes */}
          <div>
            <label htmlFor="show-notes" className="block text-sm font-medium text-gray-700">
              Show Notes
            </label>
            <textarea
              id="show-notes"
              value={formData.show_notes}
              onChange={(e) => setFormData({ ...formData, show_notes: e.target.value })}
              rows={4}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
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
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? 'Creating...' : 'Create Episode'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
