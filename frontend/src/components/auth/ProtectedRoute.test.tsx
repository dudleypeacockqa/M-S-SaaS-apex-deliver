import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ProtectedRoute } from './ProtectedRoute'

const mockAuthState = {
  isLoaded: true,
  isSignedIn: false,
}

const mockUserState = {
  isLoaded: true,
  user: null as { publicMetadata?: { role?: string } } | null,
}

vi.mock('@clerk/clerk-react', () => ({
  useAuth: () => mockAuthState,
  useUser: () => mockUserState,
}))

const ProtectedScreen = () => <div data-testid="protected">Protected</div>
const AdminScreen = () => <div data-testid="admin">Admin</div>
const SignInScreen = () => <div data-testid="sign-in">Sign in</div>
const UnauthorizedScreen = () => <div data-testid="unauthorized">Unauthorized</div>

const renderWithRouter = (initialPath: string, element: React.ReactNode) =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/sign-in" element={<SignInScreen />} />
        <Route path="/unauthorized" element={<UnauthorizedScreen />} />
        <Route path="/protected" element={element} />
      </Routes>
    </MemoryRouter>,
  )

describe('ProtectedRoute', () => {
  beforeEach(() => {
    mockAuthState.isLoaded = true
    mockAuthState.isSignedIn = false
    mockUserState.user = { publicMetadata: { role: 'solo' } }
  })

  it('redirects unauthenticated users to /sign-in', async () => {
    renderWithRouter(
      '/protected',
      <ProtectedRoute>
        <ProtectedScreen />
      </ProtectedRoute>,
    )

    expect(await screen.findByTestId('sign-in')).toBeInTheDocument()
    expect(screen.queryByTestId('protected')).not.toBeInTheDocument()
  })

  it('renders protected content when authenticated', () => {
    mockAuthState.isSignedIn = true

    renderWithRouter(
      '/protected',
      <ProtectedRoute>
        <ProtectedScreen />
      </ProtectedRoute>,
    )

    expect(screen.getByTestId('protected')).toBeInTheDocument()
  })

  it('shows a loading spinner while auth state is loading', () => {
    mockAuthState.isLoaded = false

    renderWithRouter(
      '/protected',
      <ProtectedRoute>
        <ProtectedScreen />
      </ProtectedRoute>,
    )

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('redirects to /unauthorized when user lacks required role', async () => {
    mockAuthState.isSignedIn = true
    mockUserState.user = { publicMetadata: { role: 'solo' } }

    renderWithRouter(
      '/protected',
      <ProtectedRoute requiredRole="admin">
        <AdminScreen />
      </ProtectedRoute>,
    )

    expect(await screen.findByTestId('unauthorized')).toBeInTheDocument()
    expect(screen.queryByTestId('admin')).not.toBeInTheDocument()
  })

  it('allows access when user has required role', () => {
    mockAuthState.isSignedIn = true
    mockUserState.user = { publicMetadata: { role: 'admin' } }

    renderWithRouter(
      '/protected',
      <ProtectedRoute requiredRole="admin">
        <AdminScreen />
      </ProtectedRoute>,
    )

    expect(screen.getByTestId('admin')).toBeInTheDocument()
  })
})
