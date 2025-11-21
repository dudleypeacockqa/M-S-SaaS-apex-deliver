import type { ReactNode } from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { HelmetProvider } from "react-helmet-async"

import { AppRoutes } from "./App"
import { setMockClerkState } from "./test/mocks/clerk"

// Mock Clerk before importing components that use it
vi.mock("@clerk/clerk-react", async () => {
  const { createClerkMock } = await import("./test/mocks/clerk")
  return createClerkMock()
})

const renderApp = (initialEntries: string[] = ["/"]) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return render(
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>
          <AppRoutes />
        </MemoryRouter>
      </QueryClientProvider>
    </HelmetProvider>
  )
}

const jsonResponse = (body: unknown) =>
  Promise.resolve(
    new Response(JSON.stringify(body), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  )

const createMockFetch = () =>
  vi.fn((input: RequestInfo | URL) => {
    const url = typeof input === "string" ? input : input.url

    if (url.includes("/financial/ratios")) {
      return jsonResponse({ ratios: [] })
    }

    if (url.includes("/financial/narrative")) {
      return jsonResponse({ narrative: "" })
    }

    if (url.includes("/financial/")) {
      return jsonResponse({})
    }

    if (url.includes("/blog")) {
      return jsonResponse({ items: [] })
    }

    return jsonResponse({})
  })

let fetchMock: ReturnType<typeof createMockFetch>

describe("AppRoutes", () => {
  beforeEach(() => {
    setMockClerkState({
      isSignedIn: false,
      isLoaded: true,
      user: null,
      organization: null,
    })

    fetchMock = createMockFetch()
    vi.stubGlobal("fetch", fetchMock)
  })

  afterEach(() => {
    fetchMock?.mockClear()
  })

  it("renders the marketing hero with key CTAs for visitors", async () => {
    renderApp(["/"])

    expect(await screen.findByRole("link", { name: /apexdeliver home/i }, { timeout: 5000 })).toBeInTheDocument()
    expect(await screen.findByText(/from deal flow to cash flow/i)).toBeInTheDocument()
    const trialCtas = await screen.findAllByText(/start your free 14-day trial/i)
    expect(trialCtas.length).toBeGreaterThan(0)
    expect(screen.getAllByText(/schedule a demo/i).length).toBeGreaterThan(0)
  }, 20000)

  it("redirects visitors from the dashboard to the sign-in page", async () => {
    renderApp(["/dashboard"])

    // App redirects unauthenticated users to sign-in page
    expect(
      await screen.findByRole("heading", { name: /sign in to apexdeliver/i }, { timeout: 5000 })
    ).toBeInTheDocument()
  }, 10000)

  it("shows dashboard content when the user is authenticated", async () => {
     setMockClerkState({
       isSignedIn: true,
       isLoaded: true,
       user: { firstName: "Jamie", id: "user-1" },
       organization: { name: "Test Org", id: "org-1" },
     })
 
     renderApp(["/dashboard"])
 
     // The new dashboard has a personalized greeting instead of "Dashboard" heading
     expect(
       await screen.findByRole("heading", { name: /good (morning|afternoon|evening), jamie/i }, { timeout: 20000 })
     ).toBeInTheDocument()
   }, 20000)

  it("keeps marketing CTA actions visible even when authenticated", async () => {
     setMockClerkState({
       isSignedIn: true,
       isLoaded: true,
       user: { firstName: "Jamie", id: "user-1" },
       organization: { name: "Test Org", id: "org-1" },
     })

     renderApp(["/"])

    expect(await screen.findByText(/from deal flow to cash flow/i, { timeout: 10000 })).toBeInTheDocument()
    const marketingCtas = await screen.findAllByText(/start your free 14-day trial/i, { timeout: 10000 })
    expect(marketingCtas.length).toBeGreaterThan(0)
  }, 10000)

  it("routes to financial dashboard for authenticated users", async () => {
    setMockClerkState({
      isSignedIn: true,
      isLoaded: true,
      user: { firstName: "Jamie", id: "user-1" },
      organization: { name: "Test Org", id: "org-1" },
    })

    renderApp(["/deals/test-deal-123/financial"])

    // Financial dashboard should render for authenticated users
    // The component will hit auth errors in test environment, but that proves routing works
    // Check for Retry button (multiple error messages may exist, but button is unique action)
    expect(
      await screen.findByRole("button", { name: /retry/i }, { timeout: 5000 })
    ).toBeInTheDocument()
  }, 10000)
})
