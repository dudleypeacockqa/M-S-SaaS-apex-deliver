import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Card, CardHeader, CardBody, Button } from '../ui'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * ErrorBoundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the whole app.
 *
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 *
 * Or with custom fallback:
 * <ErrorBoundary fallback={<CustomErrorUI />}>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details to console (and optionally to an error reporting service)
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // TODO: Send to error tracking service (Sentry, Datadog, etc.)
    // if (window.Sentry) {
    //   window.Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } })
    // }

    this.setState({
      error,
      errorInfo,
    })
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
                  <p className="text-sm text-gray-600 mt-1">
                    We're sorry, but something unexpected happened.
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardBody>
              <div className="space-y-4">
                {/* Error Message */}
                {this.state.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-red-800 mb-2">Error Details:</h3>
                    <p className="text-sm text-red-700 font-mono break-all">
                      {this.state.error.toString()}
                    </p>
                  </div>
                )}

                {/* Component Stack (Development Only) */}
                {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                  <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="text-sm font-semibold text-gray-700 cursor-pointer">
                      Component Stack (Development)
                    </summary>
                    <pre className="text-xs text-gray-600 mt-2 overflow-x-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button onClick={this.handleReset} variant="primary">
                    Try Again
                  </Button>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="secondary"
                  >
                    Reload Page
                  </Button>
                  <Button
                    onClick={() => (window.location.href = '/')}
                    variant="secondary"
                  >
                    Go to Home
                  </Button>
                </div>

                {/* Support Information */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <h3 className="text-sm font-semibold text-blue-800 mb-2">Need Help?</h3>
                  <p className="text-sm text-blue-700">
                    If this problem persists, please contact support at{' '}
                    <a
                      href="mailto:support@apexdeliver.com"
                      className="underline hover:text-blue-900"
                    >
                      support@apexdeliver.com
                    </a>
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
