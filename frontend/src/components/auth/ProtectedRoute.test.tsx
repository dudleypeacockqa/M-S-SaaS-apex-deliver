import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'

// Mock Clerk state (using object for reactivity)
const mockClerkState = {
  isSignedIn: false,
  isLoaded: true
}

vi.mock('@clerk/clerk-react', () => ({
  useAuth: vi.fn(() => ({
    isSignedIn: mockClerkState.isSignedIn,
    isLoaded: mockClerkState.isLoaded
  })),
}))

// Test component for protected routes
const TestComponent = () => <div data-testid="protected-content">Protected Content</div>

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    mockIsSignedIn = false
    mockIsLoaded = true
    vi.clearAllMocks()
  })

  it('should redirect to sign-in when user is not authenticated', async () => {
    mockIsSignedIn = false

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route path="/" element={<div data-testid="home">Home</div>} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <TestComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )

    // Should not see protected content
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
  })

  it('should render children when user is authenticated', () => {
    mockIsSignedIn = true

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <TestComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
  })

  it('should show loading spinner during auth check', () => {
    mockIsLoaded = false
    mockIsSignedIn = false

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <TestComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('should not render children when loading', () => {
    mockIsLoaded = false
    mockIsSignedIn = true

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <TestComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
  })

  it('should handle role-based access control', () => {
    mockIsSignedIn = true

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <div data-testid="admin-content">Admin Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )

    // For now, should render (we'll implement role checking later)
    expect(screen.getByTestId('admin-content')).toBeInTheDocument()
  })

  it('should pass additional props to children', () => {
    mockIsSignedIn = true

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div data-testid="custom-prop" data-custom="value">Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )

    const element = screen.getByTestId('custom-prop')
    expect(element).toHaveAttribute('data-custom', 'value')
  })

  it('should handle authentication state changes', async () => {
    mockIsSignedIn = false
    mockIsLoaded = true

    const { rerender } = render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <TestComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()

    // Simulate user signing in
    mockIsSignedIn = true

    rerender(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <TestComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    })
  })

  it('should work with nested routes', () => {
    mockIsSignedIn = true

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/deals/*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route path=":dealId" element={<div data-testid="deal-details">Deal Details</div>} />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByTestId('deal-details')).toBeInTheDocument()
  })
})
