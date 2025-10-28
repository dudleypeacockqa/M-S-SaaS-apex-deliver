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

export interface FeatureAccessResponse {
  feature: string;
  tier: string;
  has_access: boolean;
  required_tier: string;
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
  show_notes: string | null;
}

export interface QuotaSummary {
  tier: string;
  limit: number | null;
  remaining: number | null;
  used: number;
  unlimited: boolean;
  period: string;
}

/**
 * Check if current user has access to a podcast feature based on subscription tier
 */
export async function checkFeatureAccess(
  feature: string
): Promise<FeatureAccessResponse> {
  const response = await axios.get<FeatureAccessResponse>(
    `${API_BASE_URL}/api/podcasts/features/${feature}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
}

/**
 * Get quota usage summary for current organization
 */
export async function getQuotaSummary(): Promise<QuotaSummary> {
  const response = await axios.get<QuotaSummary>(
    `${API_BASE_URL}/api/podcasts/usage`,
    {
      withCredentials: true,
    }
  );
  return response.data;
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
