import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { AppRoutes } from '../../App'

const mockAuthState = {
  isSignedIn: false,
  isLoaded: true,
}

const mockUserState: {
  isLoaded: boolean
  user: null | { publicMetadata?: Record<string, unknown> }
} = {
  isLoaded: true,
  user: null,
}

vi.mock('@clerk/clerk-react', () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="clerk-provider">{children}</div>,
  useAuth: () => mockAuthState,
  useUser: () => mockUserState,
  SignedIn: ({ children }: { children: React.ReactNode }) => (
    mockAuthState.isSignedIn ? <div data-testid="signed-in">{children}</div> : null
  ),
  SignedOut: ({ children }: { children: React.ReactNode }) => (
    mockAuthState.isSignedIn ? null : <div data-testid="signed-out">{children}</div>
  ),
  SignInButton: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sign-in-button">{children}</div>
  ),
  UserButton: ({ afterSignOutUrl }: { afterSignOutUrl?: string }) => (
    <button data-testid="user-button" data-signout-url={afterSignOutUrl}>User Menu</button>
  ),
}))

const renderRoutes = (initialEntries: string[]) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <AppRoutes />
    </MemoryRouter>,
  )

describe('Integration: Routing Flow', () => {
  beforeEach(() => {
    mockAuthState.isSignedIn = false
    mockAuthState.isLoaded = true
    mockUserState.isLoaded = true
    mockUserState.user = null
    vi.clearAllMocks()
  })

  it('displays landing page on root route', () => {
    renderRoutes(['/'])

    expect(screen.getByText(/M&A Intelligence Platform/i)).toBeInTheDocument()
    expect(screen.getByTestId('sign-in-button')).toBeInTheDocument()
  })

  it('redirects unauthenticated users away from protected routes', async () => {
    renderRoutes(['/dashboard'])

    await waitFor(() => {
      expect(screen.getByTestId('signed-out')).toBeInTheDocument()
    })
  })

  it('allows authenticated users to access dashboard', () => {
    mockAuthState.isSignedIn = true
    mockUserState.user = { publicMetadata: { role: 'solo' } }

    renderRoutes(['/dashboard'])

    expect(screen.getByTestId('user-button')).toBeInTheDocument()
  })

  it('navigates between protected routes when authenticated', async () => {
    mockAuthState.isSignedIn = true
    mockUserState.user = { publicMetadata: { role: 'solo' } }

    const { rerender } = renderRoutes(['/dashboard'])
    expect(screen.getByTestId('user-button')).toBeInTheDocument()

    rerender(
      <MemoryRouter initialEntries={['/deals']}>
        <AppRoutes />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('user-button')).toBeInTheDocument()
    })
  })

  it('redirects non-admin users from admin routes', async () => {
    mockAuthState.isSignedIn = true
    mockUserState.user = { publicMetadata: { role: 'solo' } }

    renderRoutes(['/admin'])

    await waitFor(() => {
      expect(screen.getByTestId('unauthorized-page')).toBeInTheDocument()
    })
  })

  it('allows admin users to access admin routes', () => {
    mockAuthState.isSignedIn = true
    mockUserState.user = { publicMetadata: { role: 'admin' } }

    renderRoutes(['/admin'])

    expect(screen.getByTestId('user-button')).toBeInTheDocument()
  })
})
