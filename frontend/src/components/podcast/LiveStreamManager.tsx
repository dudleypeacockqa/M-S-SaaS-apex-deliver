import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createLiveStream,
  fetchLiveStream,
  getLiveStreamStatus,
  startLiveStream,
  stopLiveStream,
  updateLiveStreamPreferences,
  type RecordingSettings,
  type StreamQuality,
  type StreamStatusSnapshot,
  type UpdateLiveStreamPreferencesInput,
} from '../../services/api/podcastStreams';
import { StreamConfigPanel } from './StreamConfigPanel';
import { StreamControlPanel } from './StreamControlPanel';
import { StreamRecordingOptions } from './StreamRecordingOptions';
import { MultiLanguageStreamSettings } from './MultiLanguageStreamSettings';

const queryKey = (podcastId: string) => ['podcast', podcastId, 'liveStream'] as const;

export type LiveStreamManagerTier = 'starter' | 'professional' | 'premium' | 'enterprise';

interface LiveStreamManagerProps {
  podcastId: string;
  tier: LiveStreamManagerTier;
}

type PreferencesMutationInput = {
  streamId: string;
  preferences: UpdateLiveStreamPreferencesInput;
};

const copyToClipboard = async (value: string) => {
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
  }
};

function useLiveStream(podcastId: string) {
  return useQuery({
    queryKey: queryKey(podcastId),
    queryFn: () => fetchLiveStream(podcastId),
    staleTime: 30 * 1000,
  });
}

export default function LiveStreamManager({ podcastId, tier }: LiveStreamManagerProps) {
  const queryClient = useQueryClient();
  const streamQuery = useLiveStream(podcastId);
  const [statusSnapshot, setStatusSnapshot] = React.useState<StreamStatusSnapshot | null>(null);
  const [selectedLanguages, setSelectedLanguages] = React.useState<string[]>([]);
  const [autoTranslate, setAutoTranslate] = React.useState(true);
  const [subtitles, setSubtitles] = React.useState(true);
  const [recordingSettings, setRecordingSettings] = React.useState<RecordingSettings>({
    enabled: true,
    retentionDays: 30,
    storageLocation: 'cloud',
    postProcessing: [],
  });

  const stream = streamQuery.data;

  React.useEffect(() => {
    if (!stream) {
      return;
    }
    setRecordingSettings({
      enabled: stream.recording.enabled,
      retentionDays: stream.recording.retentionDays,
      storageLocation: stream.recording.storageLocation,
      postProcessing: stream.recording.postProcessing ?? [],
    });
    setSelectedLanguages(stream.languages);
    setAutoTranslate(true);
    setSubtitles(true);
  }, [stream]);

  const createMutation = useMutation({
    mutationFn: () => createLiveStream({ podcastId }),
    onSuccess: (createdStream) => {
      queryClient.setQueryData(queryKey(podcastId), createdStream);
    },
  });

  const startMutation = useMutation({
    mutationFn: (streamId: string) => startLiveStream(streamId),
    onSuccess: async (updatedStream) => {
      queryClient.setQueryData(queryKey(podcastId), updatedStream);
      try {
        const snapshot = await getLiveStreamStatus(updatedStream.id);
        setStatusSnapshot(snapshot);
      } finally {
        queryClient.invalidateQueries({ queryKey: queryKey(podcastId) });
      }
    },
  });

  const stopMutation = useMutation({
    mutationFn: (streamId: string) => stopLiveStream(streamId),
    onSuccess: async (updatedStream) => {
      queryClient.setQueryData(queryKey(podcastId), updatedStream);
      try {
        const snapshot = await getLiveStreamStatus(updatedStream.id);
        setStatusSnapshot(snapshot);
      } finally {
        queryClient.invalidateQueries({ queryKey: queryKey(podcastId) });
      }
    },
  });

  const preferencesMutation = useMutation({
    mutationFn: ({ streamId, preferences }: PreferencesMutationInput) =>
      updateLiveStreamPreferences(streamId, preferences),
    onSuccess: (updatedStream) => {
      queryClient.setQueryData(queryKey(podcastId), updatedStream);
    },
  });

  const handleCreateStream = () => createMutation.mutate();

  const handleCopyServer = async () => {
    if (!stream) return;
    await copyToClipboard(stream.serverUrl);
  };

  const handleCopyKey = async () => {
    if (!stream) return;
    await copyToClipboard(stream.streamKey);
  };

  const handleStartStream = () => {
    if (!stream || startMutation.isPending) return;
    startMutation.mutate(stream.id);
  };

  const handleStopStream = () => {
    if (!stream || stopMutation.isPending) return;
    stopMutation.mutate(stream.id);
  };

  const updatePreferences = (preferences: UpdateLiveStreamPreferencesInput) => {
    if (!stream) return;
    preferencesMutation.mutate({ streamId: stream.id, preferences });
  };

  const handleRecordingChange = (next: RecordingSettings) => {
    const normalized: RecordingSettings = {
      ...next,
      postProcessing: next.postProcessing ?? [],
    };
    setRecordingSettings(normalized);

    const recordingPayload: Partial<RecordingSettings> = {
      enabled: normalized.enabled,
      retentionDays: normalized.retentionDays,
      storageLocation: normalized.storageLocation,
    };
    if (normalized.postProcessing.length > 0) {
      recordingPayload.postProcessing = normalized.postProcessing;
    }

    updatePreferences({ recording: recordingPayload });
  };

  const handleQualityChange = (quality: StreamQuality) => {
    updatePreferences({ quality });
  };

  const handleLanguageChange = (languages: string[]) => {
    setSelectedLanguages(languages);
    updatePreferences({ languages });
  };

  const handleAutoTranslateToggle = (value: boolean) => {
    setAutoTranslate(value);
    updatePreferences({ autoTranslate: value });
  };

  const handleSubtitleToggle = (value: boolean) => {
    setSubtitles(value);
    updatePreferences({ subtitles: { enabled: value, languages: selectedLanguages } });
  };

  if (streamQuery.isLoading) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-slate-300" aria-label="Loading live stream" />
          <span className="text-sm text-slate-600">Loading live stream configuration.</span>
        </div>
      </section>
    );
  }

  if (streamQuery.isError) {
    return (
      <section className="rounded-xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-rose-900">Live streaming unavailable</h2>
        <p className="mt-2 text-sm text-rose-700">
          We were unable to load your live stream configuration. Please retry or contact support if the issue persists.
        </p>
        <button
          type="button"
          onClick={() => streamQuery.refetch()}
          className="mt-4 inline-flex items-center rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-700"
        >
          Retry
        </button>
      </section>
    );
  }

  if (!stream) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-indigo-200 bg-indigo-50 p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
          <svg
            aria-hidden="true"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L6 20.75m0 0L2.25 17M6 20.75V10.5m12 3.75L14.25 10.5m3.75 3.75L21.75 10.5M18 14.25V4.5"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-indigo-900">Launch your first live stream</h2>
          <p className="mt-2 text-sm text-indigo-700">
            Generate RTMP credentials and broadcast live investor updates directly from ApexDeliver.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreateStream}
          disabled={createMutation.isPending}
          className="inline-flex items-center rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          {createMutation.isPending ? 'Creating…' : 'Create stream'}
        </button>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <StreamConfigPanel
        stream={stream}
        onCopyServerUrl={handleCopyServer}
        onCopyStreamKey={handleCopyKey}
      />

      <StreamControlPanel
        stream={stream}
        statusSnapshot={statusSnapshot}
        onStart={handleStartStream}
        onStop={handleStopStream}
        onQualityChange={handleQualityChange}
        isStarting={startMutation.isPending}
        isStopping={stopMutation.isPending}
      />

      <StreamRecordingOptions
        settings={recordingSettings}
        isSaving={preferencesMutation.isPending}
        onChange={handleRecordingChange}
      />

      {tier === 'enterprise' ? (
        <MultiLanguageStreamSettings
          availableLanguages={stream.languages.length > 0 ? stream.languages : ['en']}
          selectedLanguages={selectedLanguages}
          autoTranslate={autoTranslate}
          subtitlesEnabled={subtitles}
          onLanguagesChange={handleLanguageChange}
          onToggleAutoTranslate={handleAutoTranslateToggle}
          onToggleSubtitles={handleSubtitleToggle}
        />
      ) : (
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Enterprise streaming add-ons</h2>
          <p className="mt-2 text-sm text-slate-600">
            Upgrade to the Enterprise plan to unlock simultaneous translation, subtitle generation, and regional CDN
            routing.
          </p>
        </section>
      )}
    </div>
  );
}


