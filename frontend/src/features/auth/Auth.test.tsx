import type { ReactNode } from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

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

  it('redirects unauthenticated users from /dashboard to /sign-in', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AppRoutes />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('heading', {
        name: /sign in to apexdeliver/i,
      })
    ).toBeInTheDocument()
  })

  it('shows dashboard content when the user is authenticated', () => {
    setMockClerkState({
      isSignedIn: true,
      user: { firstName: 'Ada', emailAddress: 'ada@example.com' },
    })

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AppRoutes />
      </MemoryRouter>
    )

    // The new dashboard has a personalized greeting instead of "Dashboard" heading
    expect(
      screen.getByRole('heading', {
        name: /good (morning|afternoon|evening), ada/i,
      })
    ).toBeInTheDocument()
  })

  it('renders the appropriate header action depending on auth state', () => {
    const { rerender } = render(
      <MemoryRouter>
        <AppRoutes />
      </MemoryRouter>
    )

    // Marketing nav uses regular link, not Clerk's SignInButton
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument()

    setMockClerkState({
      isSignedIn: true,
      user: { firstName: 'Morgan' },
    })

    rerender(
      <MemoryRouter>
        <AppRoutes />
      </MemoryRouter>
    )

    // Landing page still shows marketing nav (not the user name in header)
    // The user name would appear in the dashboard, not on the landing page
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument()
  })
})
