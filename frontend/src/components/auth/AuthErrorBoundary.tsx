import { Component, ErrorInfo, ReactNode } from 'react'

interface AuthErrorBoundaryProps {
  children: ReactNode
}

interface AuthErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * AuthErrorBoundary Component
 *
 * Error boundary to catch and display authentication-related errors gracefully.
 * Provides recovery actions for users.
 */
export class AuthErrorBoundary extends Component<
  AuthErrorBoundaryProps,
  AuthErrorBoundaryState
> {
  constructor(props: AuthErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): AuthErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Auth Error Boundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          <div
            style={{
              maxWidth: '500px',
              background: 'white',
              padding: '2rem',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}
          >
            <h1 style={{ color: '#dc2626', marginBottom: '1rem', fontSize: '1.5rem' }}>
              Something went wrong
            </h1>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>
              We encountered an error while processing your request. This might be an authentication
              issue.
            </p>
            {this.state.error && (
              <details style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                <summary style={{ cursor: 'pointer', color: '#666' }}>Error details</summary>
                <pre
                  style={{
                    marginTop: '0.5rem',
                    padding: '1rem',
                    background: '#f3f4f6',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    overflow: 'auto'
                  }}
                >
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={this.handleReset}
              style={{
                background: '#667eea',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Return to Home
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
