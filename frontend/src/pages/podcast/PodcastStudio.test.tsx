/**
 * TDD Phase 1 (RED): Tests for Podcast Studio page component
 *
 * Requirements from DEV-016:
 * - Display podcast episodes list
 * - Show quota usage summary
 * - Allow creating new episodes (Professional+ tier)
 * - Allow editing existing episodes
 * - Gate video features to Premium+ tier
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { PodcastStudio } from './PodcastStudio';
import * as podcastApi from '../../services/api/podcasts';

// Mock the podcast API
vi.mock('../../services/api/podcasts', () => ({
  checkFeatureAccess: vi.fn(),
  getQuotaSummary: vi.fn(),
  listEpisodes: vi.fn(),
  getEpisode: vi.fn(),
  createEpisode: vi.fn(),
  updateEpisode: vi.fn(),
  deleteEpisode: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('PodcastStudio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Feature Access Gating', () => {
    it('should show upgrade prompt when user lacks podcast_audio access', async () => {
      vi.mocked(podcastApi.checkFeatureAccess).mockResolvedValue({
        feature: 'podcast_audio',
        tier: 'starter',
        has_access: false,
        required_tier: 'professional',
      });

      render(<PodcastStudio />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText(/upgrade required/i)).toBeInTheDocument();
      });
      expect(screen.getByRole('button', { name: /upgrade to professional/i })).toBeInTheDocument();
    });

    it('should render episode list when user has access', async () => {
      vi.mocked(podcastApi.checkFeatureAccess).mockResolvedValue({
        feature: 'podcast_audio',
        tier: 'professional',
        has_access: true,
        required_tier: 'professional',
      });
      vi.mocked(podcastApi.getQuotaSummary).mockResolvedValue({
        tier: 'professional',
        limit: 10,
        remaining: 7,
        used: 3,
        unlimited: false,
        period: '2025-10',
      });
      vi.mocked(podcastApi.listEpisodes).mockResolvedValue([]);

      render(<PodcastStudio />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText(/podcast studio/i)).toBeInTheDocument();
      });
    });
  });

  describe('Quota Display', () => {
    beforeEach(() => {
      vi.mocked(podcastApi.checkFeatureAccess).mockResolvedValue({
        feature: 'podcast_audio',
        tier: 'professional',
        has_access: true,
        required_tier: 'professional',
      });
      vi.mocked(podcastApi.listEpisodes).mockResolvedValue([]);
    });

    it('should display quota usage for Professional tier', async () => {
      vi.mocked(podcastApi.getQuotaSummary).mockResolvedValue({
        tier: 'professional',
        limit: 10,
        remaining: 7,
        used: 3,
        unlimited: false,
        period: '2025-10',
      });

      render(<PodcastStudio />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText(/3 \/ 10/i)).toBeInTheDocument();
      });
    });

    it('should display "Unlimited" for Premium tier', async () => {
      vi.mocked(podcastApi.getQuotaSummary).mockResolvedValue({
        tier: 'premium',
        limit: null,
        remaining: null,
        used: 15,
        unlimited: true,
        period: '2025-10',
      });

      render(<PodcastStudio />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText(/unlimited/i)).toBeInTheDocument();
      });
    });
  });

  describe('Episode List', () => {
    beforeEach(() => {
      vi.mocked(podcastApi.checkFeatureAccess).mockResolvedValue({
        feature: 'podcast_audio',
        tier: 'professional',
        has_access: true,
        required_tier: 'professional',
      });
      vi.mocked(podcastApi.getQuotaSummary).mockResolvedValue({
        tier: 'professional',
        limit: 10,
        remaining: 7,
        used: 3,
        unlimited: false,
        period: '2025-10',
      });
    });

    it('should display "No episodes" when list is empty', async () => {
      vi.mocked(podcastApi.listEpisodes).mockResolvedValue([]);

      render(<PodcastStudio />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText(/no episodes/i)).toBeInTheDocument();
      });
    });

    it('should display list of episodes with titles', async () => {
      vi.mocked(podcastApi.listEpisodes).mockResolvedValue([
        {
          id: 'ep-1',
          title: 'Episode 1: Introduction',
          description: 'First episode',
          episode_number: 1,
          season_number: 1,
          audio_file_url: 'https://cdn.example.com/ep1.mp3',
          video_file_url: null,
          status: 'published',
          created_by: 'user-1',
          organization_id: 'org-1',
          created_at: '2025-10-01T10:00:00Z',
          show_notes: null,
        },
        {
          id: 'ep-2',
          title: 'Episode 2: Deep Dive',
          description: 'Second episode',
          episode_number: 2,
          season_number: 1,
          audio_file_url: 'https://cdn.example.com/ep2.mp3',
          video_file_url: null,
          status: 'draft',
          created_by: 'user-1',
          organization_id: 'org-1',
          created_at: '2025-10-15T10:00:00Z',
          show_notes: null,
        },
      ]);

      render(<PodcastStudio />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Episode 1: Introduction')).toBeInTheDocument();
        expect(screen.getByText('Episode 2: Deep Dive')).toBeInTheDocument();
      });
    });

    it('should show episode status badges', async () => {
      vi.mocked(podcastApi.listEpisodes).mockResolvedValue([
        {
          id: 'ep-1',
          title: 'Published Episode',
          description: null,
          episode_number: 1,
          season_number: 1,
          audio_file_url: 'https://cdn.example.com/ep1.mp3',
          video_file_url: null,
          status: 'published',
          created_by: 'user-1',
          organization_id: 'org-1',
          created_at: '2025-10-01T10:00:00Z',
          show_notes: null,
        },
      ]);

      render(<PodcastStudio />, { wrapper: createWrapper() });

      await waitFor(() => {
        const badges = screen.getAllByText(/published/i);
        // Should have a status badge with "published" text
        expect(badges.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Create Episode Button', () => {
    beforeEach(() => {
      vi.mocked(podcastApi.checkFeatureAccess).mockResolvedValue({
        feature: 'podcast_audio',
        tier: 'professional',
        has_access: true,
        required_tier: 'professional',
      });
      vi.mocked(podcastApi.getQuotaSummary).mockResolvedValue({
        tier: 'professional',
        limit: 10,
        remaining: 7,
        used: 3,
        unlimited: false,
        period: '2025-10',
      });
      vi.mocked(podcastApi.listEpisodes).mockResolvedValue([]);
    });

    it('should render "New Episode" button', async () => {
      render(<PodcastStudio />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /new episode/i })).toBeInTheDocument();
      });
    });

    it('should disable "New Episode" button when quota exceeded', async () => {
      vi.mocked(podcastApi.getQuotaSummary).mockResolvedValue({
        tier: 'professional',
        limit: 10,
        remaining: 0,
        used: 10,
        unlimited: false,
        period: '2025-10',
      });

      render(<PodcastStudio />, { wrapper: createWrapper() });

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /new episode/i });
        expect(button).toBeDisabled();
      });
    });
  });
});
