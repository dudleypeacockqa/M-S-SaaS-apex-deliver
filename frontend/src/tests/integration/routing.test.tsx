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
      await screen.findByRole("heading", { name: /close deals/i, level: 1 }, { timeout: 10000 })
    ).toBeInTheDocument()
    // Marketing nav uses regular links, not Clerk's SignInButton
    expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument()
  }, 10000)

  it("directs visitors to the sign-in page when accessing the dashboard", () => {
    window.history.replaceState({}, "Test", "/dashboard")

    render(<App />)

    expect(
      screen.getByRole("heading", { name: /sign in to apexdeliver/i })
    ).toBeInTheDocument()
  })

  it("displays the dashboard when the user is authenticated", () => {
    setMockClerkState({
      isSignedIn: true,
      user: { firstName: "Taylor" },
    })
    window.history.replaceState({}, "Test", "/dashboard")

    render(<App />)

    // The new dashboard has a personalized greeting instead of "Dashboard" heading
    expect(screen.getByRole("heading", { name: /good (morning|afternoon|evening), taylor/i })).toBeInTheDocument()
  })

  it("updates the header actions after sign-in", () => {
    setMockClerkState({
      isSignedIn: true,
      user: { firstName: "Taylor" },
    })

    render(<App />)

    // Landing page still shows marketing nav even when authenticated
    expect(
      screen.getByRole("heading", { name: /close deals/i, level: 1 })
    ).toBeInTheDocument()
    // Marketing nav always shows sign-in link
    expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument()
  })
})
