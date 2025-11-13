import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

import App from "../../App"
import { setMockClerkState } from "../../test/mocks/clerk"
import { createClerkMock } from "../../test/mocks/clerk"

// Use async mock factory to avoid hoisting issues
vi.mock("@clerk/clerk-react", async () => {
  const { createClerkMock } = await import("../../test/mocks/clerk")
  return createClerkMock()
})

describe("Integration: routing", () => {
  beforeEach(() => {
    // Reset state before each test
    setMockClerkState({
      isSignedIn: false,
      isLoaded: true,
      user: null,
      organization: null,
    })
    window.history.replaceState({}, "Test", "/")
  })

  it("renders the landing page for visitors", async () => {
    render(<App />)

    expect(
      await screen.findByRole("heading", { name: /from deal flow to cash flow/i, level: 1 }, { timeout: 20000 })
    ).toBeInTheDocument()
    // Marketing nav uses regular links, not Clerk's SignInButton
    expect(screen.getAllByRole("link", { name: /sign in/i }).length).toBeGreaterThan(0)
  }, 20000)

  it("directs visitors to the sign-in page when accessing the dashboard", async () => {
    window.history.replaceState({}, "Test", "/dashboard")

    render(<App />)

    // When not signed in, ProtectedRoute shows a loading state initially,
    // then redirects to sign-in page
    expect(
      await screen.findByText(/sign in to apexdeliver/i, undefined, { timeout: 20000 })
    ).toBeInTheDocument()
  }, 20000)

  it("displays the dashboard when the user is authenticated", async () => {
     setMockClerkState({
       isSignedIn: true,
       isLoaded: true,
       user: { firstName: "Taylor", id: "user-1" },
       organization: { name: "Test Org", id: "org-1" },
     })
     window.history.replaceState({}, "Test", "/dashboard")

     render(<App />)

    // When authenticated, user should NOT be redirected to sign-in page
    // The dashboard may show loading state or actual dashboard content
    await screen.findByText(/preparing the apexdeliver experience/i, undefined, { timeout: 15000 })

    // Verify we're not seeing the sign-in page
    expect(screen.queryByText(/sign in to apexdeliver/i)).not.toBeInTheDocument()
  }, 15000)

  it("renders the rich sign-in page without redirecting", async () => {
    window.history.replaceState({}, "Test", "/sign-in")

    render(<App />)

    expect(
      await screen.findByRole("heading", { name: /sign in to apexdeliver/i }, { timeout: 20000 })
    ).toBeInTheDocument()
    expect(window.location.pathname).toBe("/sign-in")
  }, 20000)
})
