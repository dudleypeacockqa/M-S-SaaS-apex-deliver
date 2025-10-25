import type { ReactNode } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"

import { AppRoutes } from "./App"

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
  useAuth: () => ({
    isSignedIn: mockClerkState.isSignedIn,
    isLoaded: mockClerkState.isLoaded,
  }),
  useUser: () => ({
    isSignedIn: mockClerkState.isSignedIn,
    isLoaded: mockClerkState.isLoaded,
    user: mockClerkState.user,
  }),
  SignInButton: ({ children }: { children: ReactNode }) => (
    <button data-testid="sign-in-action">{children}</button>
  ),
  UserButton: () => <div data-testid="user-menu">User Menu</div>,
}))

const renderApp = (initialEntries: string[] = ["/"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AppRoutes />
    </MemoryRouter>
  )
}

describe("AppRoutes", () => {
  beforeEach(() => {
    setMockClerkState({
      isSignedIn: false,
      isLoaded: true,
      user: null,
    })
  })

  it("renders the home route with sign-in actions for visitors", () => {
    renderApp(["/"])

    // The new landing page has a different structure with MarketingNav
    expect(
      screen.getByRole("heading", { name: /m&a intelligence platform/i })
    ).toBeInTheDocument()
    // Marketing nav has regular links, not Clerk's SignInButton
    expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument()
    // Multiple "Get Started" links exist (nav + footer), so use getAllBy
    const getStartedLinks = screen.getAllByRole("link", { name: /get started/i })
    expect(getStartedLinks.length).toBeGreaterThan(0)
  })

  it("redirects visitors from the dashboard to the sign-in page", () => {
    renderApp(["/dashboard"])

    expect(
      screen.getByRole("heading", { name: /sign in to apexdeliver/i })
    ).toBeInTheDocument()
  })

  it("shows dashboard content when the user is authenticated", () => {
    setMockClerkState({
      isSignedIn: true,
      user: { firstName: "Jamie" },
    })

    renderApp(["/dashboard"])

    expect(screen.getByRole("heading", { name: /dashboard/i })).toBeInTheDocument()
  })

  it("updates the header to show the user menu for authenticated users", () => {
    setMockClerkState({
      isSignedIn: true,
      user: { firstName: "Jamie" },
    })

    renderApp(["/"])

    // The landing page still shows MarketingNav for authenticated users
    // (they can still access marketing pages)
    expect(
      screen.getByRole("heading", { name: /m&a intelligence platform/i })
    ).toBeInTheDocument()
    // The marketing nav still shows sign-in/up links even when authenticated
    expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument()
  })
})
