import React from 'react';
import { ChunkLoadError } from './ChunkLoadError';

interface ErrorBoundaryProps {
  fallback?: React.ReactNode;
  children: React.ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  isChunkError: boolean;
}

/**
 * Enhanced ErrorBoundary with chunk load error detection
 *
 * Detects common chunk loading errors:
 * - "Failed to fetch dynamically imported module"
 * - "Importing a module script failed"
 * - "Unable to preload CSS"
 * - "Loading chunk X failed"
 * - "Loading CSS chunk X failed"
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, isChunkError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Detect chunk loading errors
    const isChunkError = error.message.includes('Failed to fetch') ||
                        error.message.includes('dynamically imported module') ||
                        error.message.includes('Importing a module script failed') ||
                        error.message.includes('Unable to preload CSS') ||
                        error.message.includes('Loading chunk') ||
                        error.message.includes('Loading CSS chunk');

    return { hasError: true, error, isChunkError };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error('ErrorBoundary caught error', error, info);

    // Log chunk errors for monitoring
    if (this.state.isChunkError) {
      console.error('⚠️ Chunk load failure detected:', {
        error,
        errorInfo: info,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      });
    }
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null, isChunkError: false });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      // Show specialized UI for chunk load errors
      if (this.state.isChunkError) {
        return <ChunkLoadError error={this.state.error || undefined} resetErrorBoundary={this.resetErrorBoundary} />;
      }

      // Show custom fallback or default error UI
      return this.props.fallback ?? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Something went wrong while rendering this section.
          {this.state.error && import.meta.env.DEV && (
            <p className="mt-2 text-xs text-red-600">{this.state.error.message}</p>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
