import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { ProtectedRoute } from './ProtectedRoute'

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
  useAuth: () => mockAuthState,
  useUser: () => mockUserState,
}))

const ProtectedContent = () => <div data-testid="protected-content">Protected</div>
const LandingPage = () => <div data-testid="landing-page">Landing</div>
const UnauthorizedPage = () => <div data-testid="unauthorized-message">Access denied</div>

const renderRoute = (element: React.ReactNode, initialEntry = '/dashboard') => {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in" element={<div data-testid="sign-in-page">Sign In</div>} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/dashboard" element={element} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    mockAuthState.isSignedIn = false
    mockAuthState.isLoaded = true
    mockUserState.isLoaded = true
    mockUserState.user = null
  })

  it('redirects unauthenticated users to the sign-in page', () => {
    renderRoute(
      <ProtectedRoute>
        <ProtectedContent />
      </ProtectedRoute>,
    )

    expect(screen.getByTestId('sign-in-page')).toBeInTheDocument()
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
  })

  it('renders children when the user is authenticated', () => {
    mockAuthState.isSignedIn = true
    mockUserState.user = { publicMetadata: { role: 'solo' } }

    renderRoute(
      <ProtectedRoute>
        <ProtectedContent />
      </ProtectedRoute>,
    )

    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
  })

  it('shows a loading spinner while Clerk is loading', () => {
    mockAuthState.isLoaded = false

    renderRoute(
      <ProtectedRoute>
        <ProtectedContent />
      </ProtectedRoute>,
    )

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
  })

  it('blocks access when required role does not match', () => {
    mockAuthState.isSignedIn = true
    mockUserState.user = { publicMetadata: { role: 'solo' } }

    renderRoute(
      <ProtectedRoute requiredRole="admin">
        <ProtectedContent />
      </ProtectedRoute>,
    )

    expect(screen.getByTestId('unauthorized-message')).toBeInTheDocument()
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
  })

  it('allows access when required role matches', () => {
    mockAuthState.isSignedIn = true
    mockUserState.user = { publicMetadata: { role: 'admin' } }

    renderRoute(
      <ProtectedRoute requiredRole="admin">
        <ProtectedContent />
      </ProtectedRoute>,
    )

    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
  })

  it('blocks master admins when requirement is admin-only', () => {
    mockAuthState.isSignedIn = true
    mockUserState.user = { publicMetadata: { role: 'master_admin' } }

    renderRoute(
      <ProtectedRoute requiredRole="admin">
        <ProtectedContent />
      </ProtectedRoute>,
    )

    expect(screen.getByTestId('unauthorized-message')).toBeInTheDocument()
  })
})
