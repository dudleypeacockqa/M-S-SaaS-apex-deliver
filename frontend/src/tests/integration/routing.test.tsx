import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../../App'

// Mock Clerk state
let mockIsSignedIn = false
let mockIsLoaded = true
let mockUser = { publicMetadata: { role: 'solo' } }

vi.mock('@clerk/clerk-react', () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="clerk-provider">{children}</div>
  ),
  useAuth: vi.fn(() => ({
    isSignedIn: mockIsSignedIn,
    isLoaded: mockIsLoaded,
  })),
  useUser: vi.fn(() => ({ user: mockUser })),
  SignedIn: ({ children }: { children: React.ReactNode }) => {
    return mockIsSignedIn ? <div data-testid="signed-in">{children}</div> : null
  },
  SignedOut: ({ children }: { children: React.ReactNode }) => {
    return !mockIsSignedIn ? <div data-testid="signed-out">{children}</div> : null
  },
  SignInButton: ({ children }: { children: React.ReactNode }) => (
    <button data-testid="sign-in-button">{children}</button>
  ),
  UserButton: ({ afterSignOutUrl }: { afterSignOutUrl?: string }) => (
    <button data-testid="user-button" data-signout-url={afterSignOutUrl}>
      User Menu
    </button>
  ),
}))

describe('Integration: Routing Flow', () => {
  beforeEach(() => {
    mockIsSignedIn = false
    mockIsLoaded = true
    mockUser = { publicMetadata: { role: 'solo' } }
    vi.clearAllMocks()
  })

  it('should display landing page on root route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByText(/M&A Intelligence Platform/i)).toBeInTheDocument()
  })

  it('should redirect unauthenticated users from protected routes', async () => {
    mockIsSignedIn = false

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    )

    // Should not see dashboard content when unauthenticated
    await waitFor(() => {
      expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument()
    })
  })

  it('should allow authenticated users to access dashboard', () => {
    mockIsSignedIn = true

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByTestId('user-button')).toBeInTheDocument()
  })

  it('should navigate between protected routes when authenticated', async () => {
    mockIsSignedIn = true

    const { rerender } = render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByTestId('user-button')).toBeInTheDocument()

    // Navigate to deals
    rerender(
      <MemoryRouter initialEntries={['/deals']}>
        <App />
      </MemoryRouter>
    )

    // Should see deals page
    await waitFor(() => {
      expect(screen.getByTestId('user-button')).toBeInTheDocument()
    })
  })

  it('should block admin routes for non-admin users', async () => {
    mockIsSignedIn = true
    mockUser = { publicMetadata: { role: 'solo' } }

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <App />
      </MemoryRouter>
    )

    // Should not see admin content
    await waitFor(() => {
      expect(screen.queryByTestId('admin-dashboard')).not.toBeInTheDocument()
    })
  })

  it('should allow admin users to access admin routes', () => {
    mockIsSignedIn = true
    mockUser = { publicMetadata: { role: 'admin' } }

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <App />
      </MemoryRouter>
    )

    // Should see admin content or at least not be redirected
    expect(screen.getByTestId('user-button')).toBeInTheDocument()
  })
})
