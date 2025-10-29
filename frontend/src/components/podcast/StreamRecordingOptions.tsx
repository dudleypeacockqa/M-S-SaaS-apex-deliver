import React from 'react';

import { RecordingSettings } from '../../services/api/podcastStreams';

interface StreamRecordingOptionsProps {
  settings: RecordingSettings;
  isSaving: boolean;
  onChange: (settings: RecordingSettings) => void;
}

const retentionOptions = [7, 14, 30, 45, 60, 90];

const storageLocations: Array<{ label: string; value: RecordingSettings['storageLocation']; description: string }> = [
  { label: 'Cloud archive', value: 'cloud', description: 'Resilient storage with global playback' },
  { label: 'Local S3 bucket', value: 'local', description: 'Upload to your private S3 bucket after stream' },
];

const postProcessingOptions: Array<{ label: string; value: string }> = [
  { label: 'Normalize audio levels', value: 'normalize' },
  { label: 'Generate highlight reel', value: 'highlights' },
  { label: 'Auto publish to library', value: 'publish' },
];

export function StreamRecordingOptions({ settings, isSaving, onChange }: StreamRecordingOptionsProps) {
  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...settings, enabled: event.target.checked });
  };

  const handleRetentionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...settings, retentionDays: Number(event.target.value) });
  };

  const handleStorageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...settings, storageLocation: event.target.value as RecordingSettings['storageLocation'] });
  };

  const handlePostProcessingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const next = settings.postProcessing.includes(value)
      ? settings.postProcessing.filter((option) => option !== value)
      : [...settings.postProcessing, value];
    onChange({ ...settings, postProcessing: next });
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Recording options</h2>
          <p className="mt-1 text-sm text-slate-500">
            Enable automated recording and choose how long to retain broadcast archives.
          </p>
        </div>
        {isSaving && <span className="text-xs font-medium text-slate-500">Saving…</span>}
      </div>

      <div className="mt-6 space-y-6">
        <label className="inline-flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={handleToggle}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm font-medium text-slate-800">Record stream</span>
        </label>

        <div>
          <label htmlFor="recording-retention" className="block text-sm font-medium text-slate-700">
            Recording retention
          </label>
          <select
            id="recording-retention"
            value={String(settings.retentionDays)}
            onChange={handleRetentionChange}
            className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          >
            {retentionOptions.map((days) => (
              <option key={days} value={days}>
                {days} days
              </option>
            ))}
          </select>
        </div>

        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-slate-800">Storage location</legend>
          {storageLocations.map((option) => (
            <label key={option.value} className="flex items-start gap-3 rounded-md border border-slate-200 p-3">
              <input
                type="radio"
                name="recording-storage"
                value={option.value}
                checked={settings.storageLocation === option.value}
                onChange={handleStorageChange}
                className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
              />
              <span>
                <span className="text-sm font-semibold text-slate-800">{option.label}</span>
                <span className="block text-xs text-slate-500">{option.description}</span>
              </span>
            </label>
          ))}
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold text-slate-800">Post processing</legend>
          {postProcessingOptions.map((option) => (
            <label key={option.value} className="flex items-center gap-3">
              <input
                type="checkbox"
                value={option.value}
                checked={settings.postProcessing.includes(option.value)}
                onChange={handlePostProcessingChange}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-700">{option.label}</span>
            </label>
          ))}
        </fieldset>
      </div>
    </section>
  );
}
