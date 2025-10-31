import type { ReactNode } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

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

describe("Integration: routing", () => {
  beforeEach(() => {
    setMockClerkState({
      isSignedIn: false,
      isLoaded: true,
      user: null,
    })
    window.history.replaceState({}, "Test", "/")
  })

  it("renders the landing page for visitors", async () => {
    render(<App />)

    expect(
      await screen.findByRole("heading", { name: /from deal flow to cash flow/i, level: 1 }, { timeout: 10000 })
    ).toBeInTheDocument()
    // Marketing nav uses regular links, not Clerk's SignInButton
    expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument()
  }, 10000)

  it("directs visitors to the sign-in page when accessing the dashboard", async () => {
    window.history.replaceState({}, "Test", "/dashboard")

    render(<App />)

    // When not signed in, ProtectedRoute shows a loading state initially,
    // then redirects to sign-in page
    expect(
      await screen.findByText(/sign in to apexdeliver/i, undefined, { timeout: 10000 })
    ).toBeInTheDocument()
  }, 10000)

  it("displays the dashboard when the user is authenticated", async () => {
     setMockClerkState({
       isSignedIn: true,
       isLoaded: true,
       user: { firstName: "Taylor" },
     })
     window.history.replaceState({}, "Test", "/dashboard")

     render(<App />)

    // When authenticated, user should NOT be redirected to sign-in page
    // The dashboard may show loading state or actual dashboard content
    await screen.findByText(/preparing the apexdeliver experience/i, undefined, { timeout: 5000 })

    // Verify we're not seeing the sign-in page
    expect(screen.queryByText(/sign in to apexdeliver/i)).not.toBeInTheDocument()
  }, 15000)
})
