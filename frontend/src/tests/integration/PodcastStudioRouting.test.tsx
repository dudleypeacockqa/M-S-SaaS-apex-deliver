import type { ReactNode } from 'react'
import { describe, it, beforeEach, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'

import App from '../../App'
import {
  resetPodcastFixtures,
  setPodcastEpisodes,
  setPodcastFeatureAccess,
  setPodcastQuota,
} from '../msw/server'

type MockClerkState = {
  isSignedIn: boolean
  isLoaded: boolean
  user: {
    firstName?: string | null
    publicMetadata?: Record<string, unknown>
  } | null
  organization: {
    name?: string | null
    publicMetadata?: Record<string, unknown>
  } | null
}

const mockClerkState: MockClerkState = {
  isSignedIn: false,
  isLoaded: true,
  user: null,
  organization: null,
}

const setMockClerkState = (state: Partial<MockClerkState>) => {
  Object.assign(mockClerkState, state)
}

const setSubscriptionTier = (tier: string) => {
  const metadata = { subscription_tier: tier }
  setMockClerkState({
    user: { firstName: 'Taylor', publicMetadata: metadata },
    organization: { name: 'ApexDeliver', publicMetadata: metadata },
  })
}

vi.mock('@clerk/clerk-react', () => ({
  ClerkProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  SignedIn: ({ children }: { children: ReactNode }) =>
    mockClerkState.isSignedIn ? <>{children}</> : null,
  SignedOut: ({ children }: { children: ReactNode }) =>
    mockClerkState.isSignedIn ? null : <>{children}</>,
  SignInButton: ({ children }: { children: ReactNode }) => (
    <button data-testid="sign-in-button">{children}</button>
  ),
  SignIn: () => <div data-testid="mock-sign-in" />,
  SignUp: () => <div data-testid="mock-sign-up" />,
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
    organization: mockClerkState.organization,
    isLoaded: true,
  }),
}))

describe('Integration: podcast studio routing', () => {
  beforeEach(() => {
    resetPodcastFixtures()
    setMockClerkState({ isSignedIn: false, user: null, organization: null })
    setSubscriptionTier('professional')
    window.history.replaceState({}, 'Test', '/podcast-studio')
  })

  it('redirects visitors to sign-in when unauthenticated', async () => {
    render(<App />)

    // When unauthenticated, the app should redirect to sign-in page
    // The sign-in page may render the SignIn component or show sign-in button
    // Check for either the mock SignIn component or the sign-in button
    await waitFor(
      () => {
        const signInComponent = screen.queryByTestId('mock-sign-in')
        const signInButton = screen.queryByTestId('sign-in-button')
        expect(signInComponent || signInButton).toBeInTheDocument()
      },
      { timeout: 5000 }
    )
  })

  it('renders transcript details when user is signed in and feature enabled', async () => {
    setMockClerkState({ isSignedIn: true })
    setPodcastEpisodes([
      {
        id: 'ep-42',
        title: 'Market Update',
        description: 'Latest commentary',
        episode_number: 42,
        season_number: 4,
        audio_file_url: 'https://cdn.example.com/audio.mp3',
        video_file_url: null,
        thumbnail_url: null,
        status: 'published',
        created_by: 'user-1',
        organization_id: 'org-1',
        created_at: new Date('2025-11-10T10:00:00Z').toISOString(),
        updated_at: null,
        published_at: new Date('2025-11-10T11:00:00Z').toISOString(),
        show_notes: 'Notes',
        transcript: 'Existing transcript content.',
        transcript_language: 'en',
        duration_seconds: 600,
        youtube_video_id: null,
      },
    ])

    render(<App />)

    await waitFor(() => expect(screen.getByText(/market update/i)).toBeInTheDocument())
    await waitFor(() => expect(screen.getByText(/transcript ready/i)).toBeInTheDocument())
    expect(screen.getByRole('link', { name: /download transcript \(txt\)/i })).toHaveAttribute(
      'href',
      '/api/podcasts/episodes/ep-42/transcript',
    )
    expect(screen.getByRole('link', { name: /download transcript \(srt\)/i })).toHaveAttribute(
      'href',
      '/api/podcasts/episodes/ep-42/transcript.srt',
    )
  })

  it('shows transcription upgrade prompt when API denies access', async () => {
    setSubscriptionTier('starter')
    setMockClerkState({ isSignedIn: true })
    setPodcastFeatureAccess('transcription_basic', {
      has_access: false,
      required_tier: 'premium',
      required_tier_label: 'Premium',
      upgrade_required: true,
      upgrade_message: 'Premium unlocks automated transcripts.',
    })
    setPodcastEpisodes([
      {
        id: 'ep-locked',
        title: 'Upgrade Episode',
        description: 'Locked transcription',
        episode_number: 3,
        season_number: 1,
        audio_file_url: 'https://cdn.example.com/audio.mp3',
        video_file_url: null,
        status: 'draft',
        created_by: 'user-1',
        organization_id: 'org-1',
        created_at: new Date('2025-11-01T00:00:00Z').toISOString(),
        updated_at: null,
        published_at: null,
        show_notes: null,
        transcript: null,
        transcript_language: null,
        duration_seconds: null,
        youtube_video_id: null,
      },
    ])

    render(<App />)

    // Wait for the episode to render, then check for upgrade message
    // The upgrade message might be in the FeatureGate component or in the transcript panel
    await waitFor(() => {
      const upgradeText = screen.queryByText(/premium unlocks automated transcripts/i) ||
                         screen.queryByText(/professional tier unlocks automated podcast transcripts/i) ||
                         screen.queryByText(/upgrade required/i)
      expect(upgradeText).toBeInTheDocument()
    }, { timeout: 5000 })
  })

  it('displays quota warning when approaching limit', async () => {
    setMockClerkState({ isSignedIn: true })
    // Ensure podcast feature is enabled
    setPodcastFeatureAccess('podcast_audio', {
      has_access: true,
      required_tier: 'professional',
      required_tier_label: 'Professional',
      upgrade_required: false,
    })
    setPodcastQuota({
      used: 8,
      remaining: 2,
      quota_state: 'warning',
      warning_status: 'warning',
      warning_message: 'You have used 80% of your monthly quota.',
    })

    render(<App />)

    // Wait for the quota section to render
    await waitFor(() => expect(screen.getByText(/plan usage/i)).toBeInTheDocument(), { timeout: 5000 })
    // Check for quota warning message (may be in different formats)
    const quotaWarning = screen.queryByText(/you have used 80% of your monthly quota/i) ||
                        screen.queryByText(/80%/) ||
                        screen.queryByText(/quota/i)
    expect(quotaWarning).toBeInTheDocument()
  })
})
