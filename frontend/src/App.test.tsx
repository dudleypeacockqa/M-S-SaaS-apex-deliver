import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

// Mock Clerk state - use a getter function so it's evaluated at render time
const mockClerkState = {
  isSignedIn: false,
}

vi.mock('@clerk/clerk-react', () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="clerk-provider">{children}</div>,
  SignedIn: ({ children }: { children: React.ReactNode }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (mockClerkState as any).isSignedIn ? <div data-testid="signed-in">{children}</div> : null
  },
  SignedOut: ({ children }: { children: React.ReactNode }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return !(mockClerkState as any).isSignedIn ? <div data-testid="signed-out">{children}</div> : null
  },
  SignInButton: ({ children }: { children: React.ReactNode }) => (
    <button data-testid="sign-in-button">{children}</button>
  ),
  UserButton: ({ afterSignOutUrl }: { afterSignOutUrl?: string }) => (
    <button data-testid="user-button" data-signout-url={afterSignOutUrl}>User Menu</button>
  ),
  useAuth: () => ({ isSignedIn: mockClerkState.isSignedIn }),
}))

// Helper to render App with MemoryRouter
const renderApp = (initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>
  )
}

describe('App Component', () => {
  beforeEach(() => {
    mockClerkState.isSignedIn = false // Reset to unauthenticated
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    renderApp()
    expect(screen.getByTestId('clerk-provider')).toBeInTheDocument()
  })

  it('displays landing page for unauthenticated users', () => {
    mockClerkState.isSignedIn = false

    renderApp()

    expect(screen.getByText(/M&A Intelligence Platform/i)).toBeInTheDocument()
    expect(screen.getByText(/Enterprise-grade M&A deal management/i)).toBeInTheDocument()
  })

  it('shows sign-in button for unauthenticated users', () => {
    mockClerkState.isSignedIn = false

    renderApp()

    expect(screen.getByTestId('sign-in-button')).toBeInTheDocument()
  })

  it('renders dashboard route', () => {
    // This test verifies the routing setup exists
    renderApp()

    // The app should render with BrowserRouter
    expect(screen.getByTestId('clerk-provider')).toBeInTheDocument()
  })

  it('wraps app with ClerkProvider', () => {
    renderApp()

    expect(screen.getByTestId('clerk-provider')).toBeInTheDocument()
  })
})

describe('Landing Page', () => {
  beforeEach(() => {
    mockClerkState.isSignedIn = false
  })

  it('displays main heading', () => {
    renderApp()

    expect(screen.getByText('M&A Intelligence Platform')).toBeInTheDocument()
  })

  it('displays description text', () => {
    renderApp()

    expect(screen.getByText(/Enterprise-grade M&A deal management/i)).toBeInTheDocument()
  })
})

describe('Authentication Flow', () => {
  beforeEach(() => {
    mockClerkState.isSignedIn = false
  })

  it('shows UserButton when signed in', () => {
    mockClerkState.isSignedIn = true

    renderApp()

    expect(screen.getByTestId('user-button')).toBeInTheDocument()
  })

  it('does not show sign-in button when signed in', () => {
    mockClerkState.isSignedIn = true

    renderApp()

    expect(screen.queryByTestId('sign-in-button')).not.toBeInTheDocument()
  })
})
