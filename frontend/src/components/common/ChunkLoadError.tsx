import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ChunkLoadErrorProps {
  error?: Error
  resetErrorBoundary?: () => void
}

/**
 * ChunkLoadError Component
 *
 * Displays when a lazy-loaded chunk fails to load (network error, 404, etc.)
 * Provides user-friendly error message and recovery options.
 *
 * Common causes:
 * - Network failure during chunk download
 * - Stale service worker caching old chunks
 * - Deployment updated chunks while user browsing
 * - CDN/server temporarily unavailable
 */
export const ChunkLoadError: React.FC<ChunkLoadErrorProps> = ({ error, resetErrorBoundary }) => {
  const handleReload = () => {
    // Clear service worker cache if exists
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.unregister()
        })
      })
    }

    // Clear all caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name)
        })
      })
    }

    // Reload the page
    window.location.reload()
  }

  const handleRetry = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary()
    } else {
      window.location.reload()
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-16">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
          <AlertTriangle className="h-8 w-8 text-yellow-600" />
        </div>

        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          Unable to Load Page
        </h1>

        <p className="mb-6 text-gray-600">
          We couldn't load some parts of the application. This usually happens when:
        </p>

        <ul className="mb-8 space-y-2 text-left text-sm text-gray-600">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Your internet connection was interrupted</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>The app was updated while you were browsing</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Old cached files are interfering</span>
          </li>
        </ul>

        {error && import.meta.env.DEV && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-left">
            <p className="text-sm font-medium text-red-800">Error Details (dev only):</p>
            <p className="mt-1 text-xs text-red-600">{error.message}</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={handleReload}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            <RefreshCw className="h-5 w-5" />
            Clear Cache & Reload
          </button>

          <button
            onClick={handleRetry}
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Try Again
          </button>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          If this problem persists, please contact support.
        </p>
      </div>
    </div>
  )
}
