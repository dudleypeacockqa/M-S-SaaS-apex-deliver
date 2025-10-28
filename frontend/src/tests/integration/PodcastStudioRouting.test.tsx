import type { ReactNode } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"

import App from "../../App"

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
}))

// Mock podcast API calls
vi.mock("../../services/api/podcasts", () => ({
  checkFeatureAccess: vi.fn().mockResolvedValue({
    feature: "podcast_audio",
    tier: "Professional",
    has_access: true,
    required_tier: "Professional",
  }),
  getQuotaSummary: vi.fn().mockResolvedValue({
    tier: "Professional",
    limit: 10,
    remaining: 5,
    used: 5,
    unlimited: false,
    period: "monthly",
  }),
  listEpisodes: vi.fn().mockResolvedValue([]),
}))

describe("Integration: Podcast Studio routing", () => {
  beforeEach(() => {
    setMockClerkState({
      isSignedIn: false,
      isLoaded: true,
      user: null,
    })
    window.history.replaceState({}, "Test", "/")
  })

  it("redirects unauthenticated users to sign-in when accessing /podcast-studio", async () => {
    window.history.replaceState({}, "Test", "/podcast-studio")

    render(<App />)

    // Unauthenticated users should see minimal layout (RootLayout) without podcast content
    // The SignedIn wrapper should prevent rendering the PodcastStudio component
    await waitFor(() => {
      // Should not see podcast studio content
      expect(screen.queryByRole("heading", { name: /podcast studio/i })).not.toBeInTheDocument()
    })

    // Should see the basic app layout with sign-in option
    expect(screen.getByRole("link", { name: /apexdeliver/i })).toBeInTheDocument()
  })

  it("renders Podcast Studio for authenticated users with access", async () => {
    setMockClerkState({
      isSignedIn: true,
      user: { firstName: "Taylor" },
    })
    window.history.replaceState({}, "Test", "/podcast-studio")

    render(<App />)

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
    window.history.replaceState({}, "Test", "/podcast-studio")

    render(<App />)

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
})
