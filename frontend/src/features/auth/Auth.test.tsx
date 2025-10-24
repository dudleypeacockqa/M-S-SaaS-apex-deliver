import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

// Mock Clerk hooks and components
vi.mock('@clerk/clerk-react', () => ({
  useAuth: vi.fn(),
  useUser: vi.fn(),
  ClerkProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SignedIn: ({ children }: { children: React.ReactNode }) => {
    const { isSignedIn } = vi.mocked(useAuth)()
    return isSignedIn ? <>{children}</> : null
  },
  SignedOut: ({ children }: { children: React.ReactNode }) => {
    const { isSignedIn } = vi.mocked(useAuth)()
    return !isSignedIn ? <>{children}</> : null
  },
  SignInButton: ({ children }: { children: React.ReactNode }) => (
    <button data-testid="sign-in-btn">{children}</button>
  ),
  UserButton: () => <div data-testid="user-button">User Menu</div>,
}))

import { useAuth, useUser, SignedIn, SignedOut } from '@clerk/clerk-react'

// Simple components for testing protected routing
const Dashboard = () => (
  <div data-testid="dashboard">
    <h1>Dashboard</h1>
    <p>This is a protected route</p>
  </div>
)

const LandingPage = () => (
  <div data-testid="landing">
    <h1>Landing Page</h1>
    <SignedOut>
      <p>Please sign in</p>
    </SignedOut>
    <SignedIn>
      <p>Welcome back!</p>
    </SignedIn>
  </div>
)

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) {
    return <div data-testid="loading">Loading...</div>
  }

  return isSignedIn ? <>{children}</> : <div data-testid="unauthorized">Unauthorized</div>
}

describe('Clerk Authentication Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useAuth Hook', () => {
    it('returns authentication state', () => {
      vi.mocked(useAuth).mockReturnValue({
        isSignedIn: true,
        isLoaded: true,
        userId: 'user_123',
      } as any)

      const { isSignedIn, userId } = useAuth()

      expect(isSignedIn).toBe(true)
      expect(userId).toBe('user_123')
    })

    it('handles unauthenticated state', () => {
      vi.mocked(useAuth).mockReturnValue({
        isSignedIn: false,
        isLoaded: true,
        userId: null,
      } as any)

      const { isSignedIn, userId } = useAuth()

      expect(isSignedIn).toBe(false)
      expect(userId).toBeNull()
    })

    it('handles loading state', () => {
      vi.mocked(useAuth).mockReturnValue({
        isSignedIn: false,
        isLoaded: false,
        userId: null,
      } as any)

      const { isLoaded } = useAuth()

      expect(isLoaded).toBe(false)
    })
  })

  describe('useUser Hook', () => {
    it('returns user data when signed in', () => {
      vi.mocked(useUser).mockReturnValue({
        isSignedIn: true,
        isLoaded: true,
        user: {
          id: 'user_123',
          firstName: 'John',
          lastName: 'Doe',
          emailAddresses: [{ emailAddress: 'john@example.com' }],
        },
      } as any)

      const { user } = useUser()

      expect(user?.firstName).toBe('John')
      expect(user?.lastName).toBe('Doe')
    })

    it('returns null when signed out', () => {
      vi.mocked(useUser).mockReturnValue({
        isSignedIn: false,
        isLoaded: true,
        user: null,
      } as any)

      const { user } = useUser()

      expect(user).toBeNull()
    })
  })

  describe('SignedIn Component', () => {
    it('renders children when user is signed in', () => {
      vi.mocked(useAuth).mockReturnValue({
        isSignedIn: true,
        isLoaded: true,
      } as any)

      render(
        <SignedIn>
          <div data-testid="protected-content">Protected Content</div>
        </SignedIn>
      )

      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    })

    it('does not render children when user is signed out', () => {
      vi.mocked(useAuth).mockReturnValue({
        isSignedIn: false,
        isLoaded: true,
      } as any)

      render(
        <SignedIn>
          <div data-testid="protected-content">Protected Content</div>
        </SignedIn>
      )

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })
  })

  describe('SignedOut Component', () => {
    it('renders children when user is signed out', () => {
      vi.mocked(useAuth).mockReturnValue({
        isSignedIn: false,
        isLoaded: true,
      } as any)

      render(
        <SignedOut>
          <div data-testid="public-content">Public Content</div>
        </SignedOut>
      )

      expect(screen.getByTestId('public-content')).toBeInTheDocument()
    })

    it('does not render children when user is signed in', () => {
      vi.mocked(useAuth).mockReturnValue({
        isSignedIn: true,
        isLoaded: true,
      } as any)

      render(
        <SignedOut>
          <div data-testid="public-content">Public Content</div>
        </SignedOut>
      )

      expect(screen.queryByTestId('public-content')).not.toBeInTheDocument()
    })
  })

  describe('Protected Routing', () => {
    it('allows access to protected route when authenticated', () => {
      vi.mocked(useAuth).mockReturnValue({
        isSignedIn: true,
        isLoaded: true,
      } as any)

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      )

      expect(screen.getByTestId('dashboard')).toBeInTheDocument()
    })

    it('blocks access to protected route when unauthenticated', () => {
      vi.mocked(useAuth).mockReturnValue({
        isSignedIn: false,
        isLoaded: true,
      } as any)

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      )

      expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument()
      expect(screen.getByTestId('unauthorized')).toBeInTheDocument()
    })

    it('shows loading state while auth is being verified', () => {
      vi.mocked(useAuth).mockReturnValue({
        isSignedIn: false,
        isLoaded: false,
      } as any)

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      )

      expect(screen.getByTestId('loading')).toBeInTheDocument()
    })
  })

  describe('Navigation Flow', () => {
    it('displays public content on landing page for unauthenticated users', () => {
      vi.mocked(useAuth).mockReturnValue({
        isSignedIn: false,
        isLoaded: true,
      } as any)

      render(
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
          </Routes>
        </MemoryRouter>
      )

      expect(screen.getByText('Please sign in')).toBeInTheDocument()
    })

    it('displays authenticated content on landing page for signed-in users', () => {
      vi.mocked(useAuth).mockReturnValue({
        isSignedIn: true,
        isLoaded: true,
      } as any)

      render(
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
          </Routes>
        </MemoryRouter>
      )

      expect(screen.getByText('Welcome back!')).toBeInTheDocument()
    })
  })
})
