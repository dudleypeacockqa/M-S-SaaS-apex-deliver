import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export type StreamStatus = 'offline' | 'starting' | 'live' | 'stopping' | 'failed' | 'error';
export type StreamQuality = '1080p' | '720p' | '480p';

interface ApiRecordingSettings {
  enabled: boolean;
  retention_days: number;
  storage_location: 'cloud' | 'local';
  post_processing?: string[] | null;
}

interface ApiLiveStream {
  id: string;
  podcast_id: string;
  rtmp_server_url: string;
  stream_key: string;
  playback_url: string;
  status: StreamStatus;
  recording: ApiRecordingSettings;
  languages: string[];
  quality?: StreamQuality | null;
  created_at: string;
  last_started_at: string | null;
  latest_viewer_count?: number | null;
}

export interface RecordingSettings {
  enabled: boolean;
  retentionDays: number;
  storageLocation: 'cloud' | 'local';
  postProcessing: string[];
}

export interface LiveStream {
  id: string;
  podcastId: string;
  serverUrl: string;
  streamKey: string;
  playbackUrl: string;
  status: StreamStatus;
  recording: RecordingSettings;
  languages: string[];
  quality: StreamQuality;
  createdAt: string;
  lastStartedAt: string | null;
  latestViewerCount: number | null;
}

interface ApiStreamStatus {
  status: StreamStatus;
  updated_at: string;
  viewer_count?: number | null;
  average_bitrate_kbps?: number | null;
}

export interface StreamStatusSnapshot {
  status: StreamStatus;
  updatedAt: string;
  viewerCount: number | null;
  averageBitrateKbps: number | null;
}

export interface CreateLiveStreamInput {
  podcastId: string;
  autoRecord?: boolean;
  languages?: string[];
  quality?: StreamQuality;
}

export interface UpdateLiveStreamPreferencesInput {
  recording?: Partial<RecordingSettings>;
  languages?: string[];
  quality?: StreamQuality;
  autoTranslate?: boolean;
  subtitles?: {
    enabled: boolean;
    languages: string[];
  };
}

const mapRecording = (recording: ApiRecordingSettings | null | undefined): RecordingSettings => ({
  enabled: recording?.enabled ?? false,
  retentionDays: recording?.retention_days ?? 30,
  storageLocation: recording?.storage_location ?? 'cloud',
  postProcessing: recording?.post_processing ?? [],
});

const mapLiveStream = (data: ApiLiveStream): LiveStream => ({
  id: data.id,
  podcastId: data.podcast_id,
  serverUrl: data.rtmp_server_url,
  streamKey: data.stream_key,
  playbackUrl: data.playback_url,
  status: data.status ?? 'offline',
  recording: mapRecording(data.recording),
  languages: data.languages ?? ['en'],
  quality: data.quality ?? '1080p',
  createdAt: data.created_at,
  lastStartedAt: data.last_started_at,
  latestViewerCount: data.latest_viewer_count ?? null,
});

const mapStatus = (data: ApiStreamStatus): StreamStatusSnapshot => ({
  status: data.status,
  updatedAt: data.updated_at,
  viewerCount: data.viewer_count ?? null,
  averageBitrateKbps: data.average_bitrate_kbps ?? null,
});

export async function fetchLiveStream(podcastId: string): Promise<LiveStream | null> {
  const url = `${API_BASE_URL}/api/v1/podcasts/${podcastId}/streams/current`;
  const response = await axios.get<ApiLiveStream | null>(url, { withCredentials: true });
  const payload = response.data;
  return payload ? mapLiveStream(payload) : null;
}

export async function createLiveStream(input: CreateLiveStreamInput): Promise<LiveStream> {
  const response = await axios.post<ApiLiveStream>(
    `${API_BASE_URL}/api/v1/podcasts/streams/create`,
    {
      podcast_id: input.podcastId,
      auto_record: input.autoRecord ?? true,
      languages: input.languages ?? ['en'],
      quality: input.quality ?? '1080p',
    },
    { withCredentials: true },
  );
  return mapLiveStream(response.data);
}

export async function startLiveStream(streamId: string): Promise<LiveStream> {
  const response = await axios.post<ApiLiveStream>(
    `${API_BASE_URL}/api/v1/podcasts/streams/${streamId}/start`,
    undefined,
    { withCredentials: true },
  );
  return mapLiveStream(response.data);
}

export async function stopLiveStream(streamId: string): Promise<LiveStream> {
  const response = await axios.post<ApiLiveStream>(
    `${API_BASE_URL}/api/v1/podcasts/streams/${streamId}/stop`,
    undefined,
    { withCredentials: true },
  );
  return mapLiveStream(response.data);
}

export async function getLiveStreamStatus(streamId: string): Promise<StreamStatusSnapshot> {
  const response = await axios.get<ApiStreamStatus>(
    `${API_BASE_URL}/api/v1/podcasts/streams/${streamId}/status`,
    { withCredentials: true },
  );
  return mapStatus(response.data);
}

export async function updateLiveStreamPreferences(
  streamId: string,
  preferences: UpdateLiveStreamPreferencesInput,
): Promise<LiveStream> {
  const response = await axios.patch<ApiLiveStream>(
    `${API_BASE_URL}/api/v1/podcasts/streams/${streamId}`,
    {
      recording: preferences.recording
        ? {
            enabled: preferences.recording.enabled,
            retention_days: preferences.recording.retentionDays,
            storage_location: preferences.recording.storageLocation,
            post_processing: preferences.recording.postProcessing,
          }
        : undefined,
      languages: preferences.languages,
      quality: preferences.quality,
      auto_translate: preferences.autoTranslate,
      subtitles: preferences.subtitles
        ? {
            enabled: preferences.subtitles.enabled,
            languages: preferences.subtitles.languages,
          }
        : undefined,
    },
    { withCredentials: true },
  );
  return mapLiveStream(response.data);
}
