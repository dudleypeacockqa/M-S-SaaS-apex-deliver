import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { AppRoutes } from './App'

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
    <button data-testid="sign-in-button">{children}</button>
  ),
  UserButton: ({ afterSignOutUrl }: { afterSignOutUrl?: string }) => (
    <button data-testid="user-button" data-signout-url={afterSignOutUrl}>User Menu</button>
  ),
}))

const renderApp = (initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AppRoutes />
    </MemoryRouter>,
  )
}

describe('AppRoutes', () => {
  beforeEach(() => {
    mockAuthState.isSignedIn = false
    mockAuthState.isLoaded = true
    mockUserState.isLoaded = true
    mockUserState.user = null
    vi.clearAllMocks()
  })

  it('renders landing page content for signed-out users', () => {
    renderApp(['/' ])

    expect(screen.getByText(/M&A Intelligence Platform/i)).toBeInTheDocument()
    expect(screen.getByTestId('sign-in-button')).toBeInTheDocument()
  })

  it('hides sign-in button when user is authenticated', () => {
    mockAuthState.isSignedIn = true

    renderApp(['/'])

    expect(screen.queryByTestId('sign-in-button')).not.toBeInTheDocument()
    expect(screen.getByTestId('user-button')).toBeInTheDocument()
  })

  it('redirects unauthenticated users away from protected routes', () => {
    renderApp(['/dashboard'])

    expect(screen.getByTestId('signed-out')).toBeInTheDocument()
    expect(screen.queryByTestId('user-button')).not.toBeInTheDocument()
  })

  it('renders protected content for authenticated users', () => {
    mockAuthState.isSignedIn = true
    mockUserState.user = { publicMetadata: { role: 'solo' } }

    renderApp(['/dashboard'])

    expect(screen.getByTestId('user-button')).toBeInTheDocument()
  })

  it('redirects to unauthorized for insufficient role', () => {
    mockAuthState.isSignedIn = true
    mockUserState.user = { publicMetadata: { role: 'solo' } }

    renderApp(['/admin'])

    expect(screen.getByTestId('unauthorized-page')).toBeInTheDocument()
  })

  it('allows admin users to access admin routes', () => {
    mockAuthState.isSignedIn = true
    mockUserState.user = { publicMetadata: { role: 'admin' } }

    renderApp(['/admin'])

    expect(screen.getByTestId('user-button')).toBeInTheDocument()
  })
})
