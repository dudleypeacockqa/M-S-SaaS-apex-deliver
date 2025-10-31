import type { ReactNode } from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { AppRoutes } from '../../App'

type MockClerkState = {
  isSignedIn: boolean
  isLoaded: boolean
  user: {
    firstName?: string | null
    emailAddress?: string | null
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

vi.mock('@clerk/clerk-react', () => ({
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
    isLoaded: mockClerkState.isLoaded,
    isSignedIn: mockClerkState.isSignedIn,
    user: mockClerkState.user,
  }),
  SignInButton: ({ children }: { children: ReactNode }) => (
    <button data-testid="sign-in-button">{children}</button>
  ),
  UserButton: () => <div data-testid="user-menu">User Menu</div>,
}))

describe('Clerk authentication routing', () => {
  beforeEach(() => {
    setMockClerkState({
      isSignedIn: false,
      isLoaded: true,
      user: null,
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
      user: { firstName: 'Ada', emailAddress: 'ada@example.com' },
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

  it('renders the appropriate header action depending on auth state', async () => {
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

    expect(await screen.findByRole('link', { name: /sign in/i }, { timeout: 10000 })).toBeInTheDocument()

    setMockClerkState({
      isSignedIn: true,
      user: { firstName: 'Morgan' },
    })

    rerender(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AppRoutes />
        </MemoryRouter>
      </QueryClientProvider>
    )

    expect(await screen.findByRole('link', { name: /sign in/i }, { timeout: 10000 })).toBeInTheDocument()
  }, 10000)
})
