import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

import App from '../../App'

let mockIsSignedIn = false
let mockIsLoaded = true
let mockUser = { publicMetadata: { role: 'solo' } }

vi.mock('@clerk/clerk-react', () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="clerk-provider">{children}</div>
  ),
  useAuth: () => ({
    isSignedIn: mockIsSignedIn,
    isLoaded: mockIsLoaded,
    getToken: vi.fn(async () => 'test-token'),
  }),
  useUser: () => ({ user: mockUser }),
  SignedIn: ({ children }: { children: React.ReactNode }) => (
    mockIsSignedIn ? <div data-testid="signed-in">{children}</div> : null
  ),
  SignedOut: ({ children }: { children: React.ReactNode }) => (
    mockIsSignedIn ? null : <div data-testid="signed-out">{children}</div>
  ),
  SignInButton: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sign-in-button">{children}</div>
  ),
  UserButton: () => <div data-testid="user-button">User</div>,
}))

describe('Integration: Routing Flow', () => {
  beforeEach(() => {
    mockIsSignedIn = false
    mockIsLoaded = true
    mockUser = { publicMetadata: { role: 'solo' } }
  })

  it('renders the landing page for visitors', () => {
    render(<App />)

    expect(screen.getByText(/M&A Intelligence Platform/i)).toBeInTheDocument()
  })

  it('routes unauthenticated users to sign-in when visiting protected areas', () => {
    window.history.replaceState({}, 'Test', '/dashboard/overview')

    render(<App />)

    expect(screen.getByTestId('signed-out')).toBeInTheDocument()
  })

  it('shows dashboard overview for authenticated users', () => {
    mockIsSignedIn = true
    mockUser = { publicMetadata: { role: 'solo' } }

    window.history.replaceState({}, 'Test', '/dashboard/overview')

    render(<App />)

    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument()
  })

  it('prevents non-admin users from opening admin portal', () => {
    mockIsSignedIn = true
    mockUser = { publicMetadata: { role: 'solo' } }

    window.history.replaceState({}, 'Test', '/admin/dashboard')

    render(<App />)

    expect(screen.getByText(/access denied/i)).toBeInTheDocument()
  })

  it('allows admin users to access admin dashboard', () => {
    mockIsSignedIn = true
    mockUser = { publicMetadata: { role: 'admin' } }

    window.history.replaceState({}, 'Test', '/admin/dashboard')

    render(<App />)

    expect(screen.getByRole('heading', { name: /platform admin/i })).toBeInTheDocument()
  })
})
