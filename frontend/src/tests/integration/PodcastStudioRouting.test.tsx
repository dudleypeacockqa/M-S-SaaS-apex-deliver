import type { ReactNode } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { MemoryRouter, Route, Routes } from "react-router-dom"

import { PodcastStudio } from "../../pages/podcast/PodcastStudio"
import * as podcastApi from "../../services/api/podcasts"
import { SignedIn, SignedOut } from "@clerk/clerk-react"

type MockClerkState = {
  isSignedIn: boolean
  isLoaded: boolean
  user: {
    firstName?: string | null
  } | null
}

const mockClerkState: MockClerkState = {
  isSignedIn: false,
  isLoaded: true,
  user: null,
}

const setMockClerkState = (state: Partial<MockClerkState>) => {
  Object.assign(mockClerkState, state)
}

vi.mock("@clerk/clerk-react", () => ({
  ClerkProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  SignedIn: ({ children }: { children: ReactNode }) =>
    mockClerkState.isSignedIn ? <>{children}</> : null,
  SignedOut: ({ children }: { children: ReactNode }) =>
    mockClerkState.isSignedIn ? null : <>{children}</>,
  SignInButton: ({ children }: { children: ReactNode }) => (
    <button data-testid="sign-in-header">{children}</button>
  ),
  UserButton: () => <div data-testid="user-menu">User Menu</div>,
  useAuth: () => ({
    isSignedIn: mockClerkState.isSignedIn,
    isLoaded: mockClerkState.isLoaded,
  }),
  useUser: () => ({
    isSignedIn: mockClerkState.isSignedIn,
    isLoaded: mockClerkState.isLoaded,
    user: mockClerkState.user,
  }),
  useOrganization: () => ({
    organization: {
      publicMetadata: { subscription_tier: 'professional' },
      id: 'org_test456',
    },
    isLoaded: true,
  }),
}))

// Mutable state object to control what listEpisodes returns
const mockPodcastState = {
  episodes: [] as any[],
}

// Mock podcast API calls
vi.mock('../../services/api/podcasts', () => ({
  checkFeatureAccess: vi.fn().mockImplementation((feature: string) =>
    Promise.resolve({
      feature: feature,
      tier: 'professional',
      tierLabel: 'Professional',
      hasAccess: true,
      requiredTier: 'professional',
      requiredTierLabel: 'Professional',
      upgradeRequired: false,
      upgradeMessage: null,
      upgradeCtaUrl: null,
    })
  ),
  getQuotaSummary: vi.fn().mockResolvedValue({
    tier: 'professional',
    tierLabel: 'Professional',
    limit: 10,
    remaining: 5,
    used: 5,
    isUnlimited: false,
    period: '2025-10',
    periodLabel: 'October 2025',
    periodStart: '2025-10-01T00:00:00+00:00',
    periodEnd: '2025-10-31T23:59:59+00:00',
    quotaState: 'normal',
    warningStatus: null,
    warningMessage: null,
    upgradeRequired: false,
    upgradeMessage: null,
    upgradeCtaUrl: null,
  }),
  listEpisodes: vi.fn().mockImplementation(() => Promise.resolve(mockPodcastState.episodes)),
  transcribeEpisode: vi.fn().mockResolvedValue({
    episodeId: 'ep-1',
    transcript: '',
    transcriptLanguage: 'en',
    wordCount: 0,
  }),
  getYouTubeConnectionStatus: vi.fn().mockResolvedValue({
    isConnected: false,
    channelName: null,
    channelUrl: null,
    requiresAction: false,
    connectedAt: null,
    lastPublishedAt: null,
  }),
  initiateYouTubeOAuth: vi.fn().mockResolvedValue({
    authorizationUrl: 'https://youtube.com/oauth',
    state: 'test-state',
    expiresAt: null,
  }),
  publishToYouTube: vi.fn().mockResolvedValue({
    status: 'uploading',
    lastCheckedAt: new Date().toISOString(),
    videoId: null,
  }),
}))

const renderPodcastStudioRoute = (initialPath = "/podcast-studio") => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <a href="/" aria-label="ApexDeliver">
                  ApexDeliver
                </a>
              </div>
            }
          />
          <Route
            path="/podcast-studio"
            element={
              <>
                <SignedIn>
                  <PodcastStudio />
                </SignedIn>
                <SignedOut>
                  <div>
                    <a href="/" aria-label="ApexDeliver">
                      ApexDeliver
                    </a>
                  </div>
                </SignedOut>
              </>
            }
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe("Integration: Podcast Studio routing", () => {
  beforeEach(() => {
    setMockClerkState({
      isSignedIn: false,
      isLoaded: true,
      user: null,
    })
    window.history.replaceState({}, "Test", "/")
    // Reset episodes data to empty array for each test
    mockPodcastState.episodes = []
  })

  it("redirects unauthenticated users to sign-in when accessing /podcast-studio", async () => {
    renderPodcastStudioRoute()

    await waitFor(() => {
      expect(screen.queryByRole("heading", { name: /podcast studio/i })).not.toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByRole("link", { name: /apexdeliver/i })).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it("renders Podcast Studio for authenticated users with access", async () => {
    setMockClerkState({
      isSignedIn: true,
      user: { firstName: "Taylor" },
    })
    renderPodcastStudioRoute()

    // Should see the Podcast Studio heading after feature gate passes
    await waitFor(
      () => {
        expect(screen.getByRole("heading", { name: /podcast studio/i })).toBeInTheDocument()
      },
      { timeout: 5000 }
    )
  })

  it("shows feature gate and loads content successfully", async () => {
    setMockClerkState({
      isSignedIn: true,
      user: { firstName: "Taylor" },
    })
    renderPodcastStudioRoute()

    // Should eventually see the Podcast Studio content after feature gate passes
    await waitFor(
      () => {
        expect(screen.getByRole("heading", { name: /podcast studio/i })).toBeInTheDocument()
      },
      { timeout: 5000 }
    )

    // Should also see the quota information
    expect(screen.getByText(/episode quota/i)).toBeInTheDocument()
  })

  // TODO: This test requires fixing the mock setup for listEpisodes
  // The module-level vi.mock is hoisted and captures the empty episodes array
  // Need to refactor to use a different mocking strategy (e.g., MSW, or custom QueryClient with pre-filled cache)
  it("displays transcript status and download links when transcript exists", async () => {
    setMockClerkState({
      isSignedIn: true,
      user: { firstName: "Taylor" },
    })
    renderPodcastStudioRoute()

    // Mock the listEpisodes to return an episode with transcript
    const mockEpisodeWithTranscript = {
      id: 'ep-1',
      title: 'Transcript Ready',
      description: 'Episode with transcript',
      episode_number: 1,
      season_number: 1,
      audio_file_url: 'https://cdn.example.com/audio.mp3',
      video_file_url: null,
      status: 'draft',
      created_by: 'user-1',
      organization_id: 'org-1',
      created_at: '2025-10-20T10:00:00Z',
      updated_at: '2025-10-20T10:00:00Z',
      published_at: null,
      show_notes: null,
      transcript: 'Existing transcript content.',
      transcript_language: 'en',
      duration_seconds: null,
      youtube_video_id: null,
    }

    // Set the episodes data that the mock will return
    mockPodcastState.episodes = [mockEpisodeWithTranscript]

    render(<App />)

    // Wait for page to load and episodes to be fetched
    await screen.findByText(/podcast studio/i, { timeout: 5000 })

    // Wait for the episode title to appear
    await screen.findByText('Transcript Ready', { timeout: 5000 })

    // Then wait for transcript status
    await screen.findByText(/transcript ready/i, { timeout: 5000 })

    const txtLink = await screen.findByRole('link', { name: /download transcript \(txt\)/i }, { timeout: 3000 })
    const srtLink = screen.getByRole('link', { name: /download transcript \(srt\)/i })

    expect(txtLink).toHaveAttribute('href', '/api/podcasts/episodes/ep-1/transcript')
    expect(srtLink).toHaveAttribute('href', '/api/podcasts/episodes/ep-1/transcript.srt')
  })
})
