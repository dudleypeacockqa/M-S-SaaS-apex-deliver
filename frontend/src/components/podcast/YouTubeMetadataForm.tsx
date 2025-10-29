import React from 'react';

export type YouTubePrivacyOption = 'public' | 'unlisted' | 'private';

export interface YouTubeMetadataValues {
  title: string;
  description: string;
  tags: string;
  category: string;
  privacy: YouTubePrivacyOption;
  scheduleTime: string;
}

export type YouTubeMetadataErrors = Partial<Record<keyof YouTubeMetadataValues, string>>;

interface YouTubeMetadataFormProps {
  values: YouTubeMetadataValues;
  errors: YouTubeMetadataErrors;
  onFieldChange: <K extends keyof YouTubeMetadataValues>(field: K, value: YouTubeMetadataValues[K]) => void;
  onErrorChange?: (field: keyof YouTubeMetadataValues, message: string | null) => void;
}

const YOUTUBE_CATEGORIES: Array<{ value: string; label: string }> = [
  { value: '22', label: 'People & Blogs' },
  { value: '27', label: 'Education' },
  { value: '19', label: 'Travel & Events' },
  { value: '24', label: 'Entertainment' },
];

export function YouTubeMetadataForm({ values, errors, onFieldChange, onErrorChange }: YouTubeMetadataFormProps) {
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    const next = rawValue.slice(0, 100);
    onFieldChange('title', next);
    if (onErrorChange) {
      onErrorChange('title', rawValue.length > 100 ? 'Title must be 100 characters or fewer' : null);
    }
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = event.target.value.slice(0, 5000);
    onFieldChange('description', next);
    if (onErrorChange) {
      onErrorChange('description', next.length >= 5000 ? 'Description must be 5000 characters or fewer' : null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="youtube-title" className="block text-sm font-medium text-gray-700">
          Video title
        </label>
        <input
          id="youtube-title"
          type="text"
          value={values.title}
          onChange={handleTitleChange}
          onBlur={() => {
            const trimmed = values.title.trim();
            onFieldChange('title', trimmed);
            onErrorChange && onErrorChange('title', trimmed ? null : 'Title is required');
          }}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Investor update episode"
        />
        {errors.title ? (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.title}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="youtube-description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="youtube-description"
          value={values.description}
          onChange={handleDescriptionChange}
          rows={4}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Add show notes and key talking points for viewers"
        />
        {errors.description ? (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.description}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="youtube-tags" className="block text-sm font-medium text-gray-700">
          Tags (comma separated)
        </label>
        <input
          id="youtube-tags"
          type="text"
          value={values.tags}
          onChange={(event) => {
            onFieldChange('tags', event.target.value);
            onErrorChange && onErrorChange('tags', null);
          }}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="investor relations, earnings"
        />
        {errors.tags ? (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.tags}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="youtube-category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="youtube-category"
            value={values.category}
            onChange={(event) => {
              onFieldChange('category', event.target.value);
              onErrorChange && onErrorChange('category', null);
            }}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {YOUTUBE_CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="youtube-privacy" className="block text-sm font-medium text-gray-700">
            Privacy
          </label>
          <select
            id="youtube-privacy"
            value={values.privacy}
            onChange={(event) => {
              onFieldChange('privacy', event.target.value as YouTubePrivacyOption);
              onErrorChange && onErrorChange('privacy', null);
            }}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="private">Private</option>
            <option value="unlisted">Unlisted</option>
            <option value="public">Public</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="youtube-schedule" className="block text-sm font-medium text-gray-700">
          Schedule (optional)
        </label>
        <input
          id="youtube-schedule"
          type="datetime-local"
          value={values.scheduleTime}
          onChange={(event) => {
            onFieldChange('scheduleTime', event.target.value);
            onErrorChange && onErrorChange('scheduleTime', null);
          }}
          disabled={values.privacy === 'private'}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-100"
        />
        {errors.scheduleTime ? (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.scheduleTime}
          </p>
        ) : null}
      </div>
    </div>
  );
}
