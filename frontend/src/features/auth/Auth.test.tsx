import type { ReactNode } from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { AppRoutes } from '../../App'
import { setMockClerkState } from '../../test/mocks/clerk'

// Mock Clerk before importing components that use it
vi.mock('@clerk/clerk-react', async () => {
  const { createClerkMock } = await import('../../test/mocks/clerk')
  return createClerkMock()
})

describe('Clerk authentication routing', () => {
  beforeEach(() => {
    setMockClerkState({
      isSignedIn: false,
      isLoaded: true,
      user: null,
      organization: null,
    })
  })

  it('redirects unauthenticated users from /dashboard to /sign-in', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/dashboard']}>
          <AppRoutes />
        </MemoryRouter>
      </QueryClientProvider>
    )

    // Wait for lazy-loaded SignInPage to render
    expect(
      await screen.findByRole('heading', {
        name: /sign in to apexdeliver/i,
      }, { timeout: 3000 })
    ).toBeInTheDocument()
  })

  it('shows dashboard content when the user is authenticated', async () => {
    setMockClerkState({
      isSignedIn: true,
      isLoaded: true,
      user: { firstName: 'Ada', emailAddress: 'ada@example.com', id: 'user-1' },
      organization: { name: 'Test Org', id: 'org-1' },
    })

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/dashboard']}>
          <AppRoutes />
        </MemoryRouter>
      </QueryClientProvider>
    )

    // The new dashboard has a personalized greeting instead of "Dashboard" heading - wait for lazy load
    expect(
      await screen.findByRole('heading', {
        name: /good (morning|afternoon|evening), ada/i,
      }, { timeout: 3000 })
    ).toBeInTheDocument()
  })

  it('shows marketing sign-in link for visitors and remains stable when authenticated', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })

    const { rerender } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AppRoutes />
        </MemoryRouter>
      </QueryClientProvider>
    )

    const visitorSignInLinks = await screen.findAllByRole('link', { name: /sign in/i }, { timeout: 10000 })
    expect(visitorSignInLinks.length).toBeGreaterThan(0)

    setMockClerkState({
      isSignedIn: true,
      isLoaded: true,
      user: { firstName: 'Morgan', id: 'user-1' },
      organization: { name: 'Test Org', id: 'org-1' },
    })

    rerender(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AppRoutes />
        </MemoryRouter>
      </QueryClientProvider>
    )

    const authenticatedLinks = await screen.findAllByRole('link', { name: /sign in/i }, { timeout: 10000 })
    expect(authenticatedLinks.length).toBeGreaterThan(0)
  }, 10000)
})
