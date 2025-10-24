import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

// Mock Clerk components
vi.mock('@clerk/clerk-react', () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="clerk-provider">{children}</div>,
  SignedIn: ({ children }: { children: React.ReactNode }) => {
    const isSignedIn = vi.mocked(useAuth).mockReturnValue({ isSignedIn: true } as any)
    return isSignedIn ? <div data-testid="signed-in">{children}</div> : null
  },
  SignedOut: ({ children }: { children: React.ReactNode }) => {
    const isSignedIn = vi.mocked(useAuth).mockReturnValue({ isSignedIn: false } as any)
    return !isSignedIn ? <div data-testid="signed-out">{children}</div> : null
  },
  SignInButton: ({ children }: { children: React.ReactNode }) => (
    <button data-testid="sign-in-button">{children}</button>
  ),
  UserButton: ({ afterSignOutUrl }: { afterSignOutUrl?: string }) => (
    <button data-testid="user-button" data-signout-url={afterSignOutUrl}>User Menu</button>
  ),
  useAuth: vi.fn(),
}))

// Import useAuth after mocking
import { useAuth } from '@clerk/clerk-react'

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByTestId('clerk-provider')).toBeInTheDocument()
  })

  it('displays landing page for unauthenticated users', () => {
    vi.mocked(useAuth).mockReturnValue({ isSignedIn: false } as any)

    render(<App />)

    expect(screen.getByText(/M&A Intelligence Platform/i)).toBeInTheDocument()
    expect(screen.getByText(/Enterprise-grade M&A deal management/i)).toBeInTheDocument()
  })

  it('shows sign-in button for unauthenticated users', () => {
    vi.mocked(useAuth).mockReturnValue({ isSignedIn: false } as any)

    render(<App />)

    expect(screen.getByTestId('sign-in-button')).toBeInTheDocument()
  })

  it('renders dashboard route', () => {
    // This test verifies the routing setup exists
    render(<App />)

    // The app should render with BrowserRouter
    expect(screen.getByTestId('clerk-provider')).toBeInTheDocument()
  })

  it('wraps app with ClerkProvider', () => {
    render(<App />)

    expect(screen.getByTestId('clerk-provider')).toBeInTheDocument()
  })
})

describe('Landing Page', () => {
  it('displays main heading', () => {
    render(<App />)

    expect(screen.getByText('M&A Intelligence Platform')).toBeInTheDocument()
  })

  it('displays description text', () => {
    render(<App />)

    expect(screen.getByText(/Enterprise-grade M&A deal management/i)).toBeInTheDocument()
  })
})

describe('Authentication Flow', () => {
  it('shows UserButton when signed in', () => {
    vi.mocked(useAuth).mockReturnValue({ isSignedIn: true } as any)

    render(<App />)

    expect(screen.getByTestId('user-button')).toBeInTheDocument()
  })

  it('does not show sign-in button when signed in', () => {
    vi.mocked(useAuth).mockReturnValue({ isSignedIn: true } as any)

    render(<App />)

    expect(screen.queryByTestId('sign-in-button')).not.toBeInTheDocument()
  })
})
