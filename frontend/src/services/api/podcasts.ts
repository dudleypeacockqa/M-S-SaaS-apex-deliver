/**
 * Podcast API client service
 *
 * Provides methods for interacting with podcast endpoints:
 * - Feature access checking
 * - Episode CRUD operations
 * - Quota usage queries
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

type ApiFeatureAccessResponse = {
  feature: string;
  tier: string;
  tier_label?: string | null;
  has_access: boolean;
  required_tier: string;
  required_tier_label?: string | null;
  upgrade_required?: boolean;
  upgrade_message?: string | null;
  upgrade_cta_url?: string | null;
};

export interface FeatureAccessResponse {
  feature: string;
  tier: string;
  tierLabel: string;
  hasAccess: boolean;
  requiredTier: string;
  requiredTierLabel: string;
  upgradeRequired: boolean;
  upgradeMessage: string | null;
  upgradeCtaUrl: string | null;
}

export interface PodcastEpisode {
  id: string;
  title: string;
  description: string | null;
  episode_number: number;
  season_number: number;
  audio_file_url: string;
  video_file_url: string | null;
  status: 'draft' | 'published' | 'archived';
  created_by: string;
  organization_id: string;
  created_at: string;
  updated_at: string | null;
  published_at: string | null;
  show_notes: string | null;
  transcript: string | null;
  transcript_language: string | null;
  duration_seconds: number | null;
  youtube_video_id: string | null;
}

type ApiQuotaSummary = {
  tier: string;
  tier_label?: string | null;
  limit: number | null;
  remaining: number;
  used: number;
  is_unlimited: boolean;
  period: string;
  period_label?: string | null;
  period_start?: string | null;
  period_end?: string | null;
  quota_state?: string;
  warning_status?: string | null;
  warning_message?: string | null;
  upgrade_required?: boolean;
  upgrade_message?: string | null;
  upgrade_cta_url?: string | null;
};

export interface QuotaSummary {
  tier: string;
  tierLabel: string;
  limit: number | null;
  remaining: number;
  used: number;
  isUnlimited: boolean;
  period: string;
  periodLabel: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  quotaState: string;
  warningStatus: string | null;
  warningMessage: string | null;
  upgradeRequired: boolean;
  upgradeMessage: string | null;
  upgradeCtaUrl: string | null;
}

interface ApiYouTubeUploadResponse {
  video_id: string;
}

export interface YouTubeUploadResponse {
  videoId: string;
}

interface ApiTranscriptionResponse {
  episode_id: string;
  transcript: string;
  transcript_language?: string | null;
  word_count?: number | null;
}

export interface TranscriptionResponse {
  episodeId: string;
  transcript: string;
  transcriptLanguage: string;
  wordCount: number;
}

/**
 * Check if current user has access to a podcast feature based on subscription tier
 */
export async function checkFeatureAccess(feature: string): Promise<FeatureAccessResponse> {
  const { data } = await axios.get<ApiFeatureAccessResponse>(
    `${API_BASE_URL}/api/podcasts/features/${feature}`,
    {
      withCredentials: true,
    }
  );

  return {
    feature: data.feature,
    tier: data.tier,
    tierLabel: data.tier_label ?? data.tier,
    hasAccess: data.has_access,
    requiredTier: data.required_tier,
    requiredTierLabel: data.required_tier_label ?? data.required_tier,
    upgradeRequired: data.upgrade_required ?? !data.has_access,
    upgradeMessage: data.upgrade_message ?? null,
    upgradeCtaUrl: data.upgrade_cta_url ?? null,
  };
}

/**
 * Get quota usage summary for current organization
 */
export async function getQuotaSummary(): Promise<QuotaSummary> {
  const { data } = await axios.get<ApiQuotaSummary>(
    `${API_BASE_URL}/api/podcasts/usage`,
    {
      withCredentials: true,
    }
  );

  return {
    tier: data.tier,
    tierLabel: data.tier_label ?? data.tier,
    limit: data.limit,
    remaining: data.remaining,
    used: data.used,
    isUnlimited: data.is_unlimited,
    period: data.period,
    periodLabel: data.period_label ?? null,
    periodStart: data.period_start ?? null,
    periodEnd: data.period_end ?? null,
    quotaState: data.quota_state ?? 'normal',
    warningStatus: data.warning_status ?? null,
    warningMessage: data.warning_message ?? null,
    upgradeRequired: data.upgrade_required ?? false,
    upgradeMessage: data.upgrade_message ?? null,
    upgradeCtaUrl: data.upgrade_cta_url ?? null,
  };
}

/**
 * List all podcast episodes for current organization
 */
export async function listEpisodes(params?: {
  status?: string;
  limit?: number;
}): Promise<PodcastEpisode[]> {
  const response = await axios.get<PodcastEpisode[]>(
    `${API_BASE_URL}/api/podcasts/episodes`,
    {
      params,
      withCredentials: true,
    }
  );
  return response.data;
}

/**
 * Get a single podcast episode by ID
 */
export async function getEpisode(episodeId: string): Promise<PodcastEpisode> {
  const response = await axios.get<PodcastEpisode>(
    `${API_BASE_URL}/api/podcasts/episodes/${episodeId}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
}

/**
 * Create a new podcast episode
 */
export async function createEpisode(
  data: Omit<
    PodcastEpisode,
    'id' | 'created_by' | 'organization_id' | 'created_at' | 'status'
  > & { status?: string }
): Promise<PodcastEpisode> {
  const response = await axios.post<PodcastEpisode>(
    `${API_BASE_URL}/api/podcasts/episodes`,
    data,
    {
      withCredentials: true,
    }
  );
  return response.data;
}

/**
 * Update an existing podcast episode
 */
export async function updateEpisode(
  episodeId: string,
  data: Partial<Pick<PodcastEpisode, 'title' | 'description' | 'show_notes' | 'status'>>
): Promise<PodcastEpisode> {
  const response = await axios.put<PodcastEpisode>(
    `${API_BASE_URL}/api/podcasts/episodes/${episodeId}`,
    data,
    {
      withCredentials: true,
    }
  );
  return response.data;
}

/**
 * Delete a podcast episode
 */
export async function deleteEpisode(episodeId: string): Promise<void> {
  await axios.delete(`${API_BASE_URL}/api/podcasts/episodes/${episodeId}`, {
    withCredentials: true,
  });
}

export async function publishEpisodeToYouTube(episodeId: string): Promise<YouTubeUploadResponse> {
  const response = await axios.post<ApiYouTubeUploadResponse>(
    `${API_BASE_URL}/api/podcasts/episodes/${episodeId}/youtube`,
    undefined,
    {
      withCredentials: true,
    }
  );

  return {
    videoId: response.data.video_id,
  };
}

export async function transcribeEpisode(episodeId: string, language?: string): Promise<TranscriptionResponse> {
  const body = language ? { language } : undefined;
  const { data } = await axios.post<ApiTranscriptionResponse>(
    `${API_BASE_URL}/api/podcasts/episodes/${episodeId}/transcribe`,
    body,
    {
      withCredentials: true,
    }
  );

  return {
    episodeId: data.episode_id,
    transcript: data.transcript,
    transcriptLanguage: data.transcript_language ?? 'en',
    wordCount: data.word_count ?? (data.transcript ? data.transcript.split(/\s+/).filter(Boolean).length : 0),
  };
}
