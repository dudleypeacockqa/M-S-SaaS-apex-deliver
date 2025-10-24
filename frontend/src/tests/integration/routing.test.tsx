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

  it("renders the landing page for visitors", () => {
    render(<App />)

    expect(
      screen.getByRole("heading", { name: /m&a intelligence platform/i })
    ).toBeInTheDocument()
    expect(screen.getByTestId("sign-in-header")).toBeInTheDocument()
  })

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

    expect(screen.getByRole("heading", { name: /dashboard/i })).toBeInTheDocument()
  })

  it("updates the header actions after sign-in", () => {
    setMockClerkState({
      isSignedIn: true,
      user: { firstName: "Taylor" },
    })

    render(<App />)

    expect(screen.getByTestId("user-menu")).toBeInTheDocument()
    expect(screen.queryByTestId("sign-in-header")).not.toBeInTheDocument()
  })
})
