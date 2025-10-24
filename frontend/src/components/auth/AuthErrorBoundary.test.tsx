import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthErrorBoundary } from './AuthErrorBoundary'

// Component that throws an error
const ThrowError = () => {
  throw new Error('Test error')
}

const GoodComponent = () => <div>Good Component</div>

describe('AuthErrorBoundary Component', () => {
  // Suppress console.error for these tests
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should render children when there is no error', () => {
    render(
      <AuthErrorBoundary>
        <GoodComponent />
      </AuthErrorBoundary>
    )

    expect(screen.getByText('Good Component')).toBeInTheDocument()
  })

  it('should catch and display error message', () => {
    render(
      <AuthErrorBoundary>
        <ThrowError />
      </AuthErrorBoundary>
    )

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument()
  })

  it('should provide a way to recover from error', () => {
    render(
      <AuthErrorBoundary>
        <ThrowError />
      </AuthErrorBoundary>
    )

    // Should show some recovery action (button/link)
    expect(screen.getByRole('button') || screen.getByRole('link')).toBeInTheDocument()
  })
})
