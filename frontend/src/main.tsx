import React from "react"
import ReactDOM from "react-dom/client"
import { ClerkProvider } from "@clerk/clerk-react"

import App from "./App"
import "./index.css"

const publishableKey =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ??
  (import.meta.env.MODE === "test" ? "test-clerk-publishable-key" : undefined)

const appBuildId = import.meta.env.VITE_APP_BUILD_ID ?? (typeof __APP_BUILD_ID__ !== 'undefined' ? __APP_BUILD_ID__ : undefined)

const ClerkKeyMissingError = () => {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: 'linear-gradient(to bottom right, #f8fafc, #e2e8f0)',
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          background: 'white',
          padding: '2rem',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h1
          style={{
            color: '#dc2626',
            marginBottom: '1rem',
            fontSize: '1.5rem',
            fontWeight: '600',
          }}
        >
          Configuration Error
        </h1>
        <p style={{ color: '#475569', marginBottom: '1rem', lineHeight: '1.6' }}>
          The application is missing required configuration. The <code style={{ background: '#f1f5f9', padding: '0.125rem 0.25rem', borderRadius: '0.25rem', fontSize: '0.875rem' }}>VITE_CLERK_PUBLISHABLE_KEY</code> environment variable is not set.
        </p>
        <div
          style={{
            background: '#f8fafc',
            padding: '1rem',
            borderRadius: '0.375rem',
            marginBottom: '1rem',
            borderLeft: '4px solid #3b82f6',
          }}
        >
          <p style={{ color: '#1e293b', marginBottom: '0.5rem', fontWeight: '500' }}>
            For Administrators:
          </p>
          <ol style={{ color: '#475569', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
            <li>Go to your Render dashboard</li>
            <li>Navigate to the <strong>ma-saas-frontend</strong> service</li>
            <li>Open the <strong>Environment</strong> tab</li>
            <li>Add <code style={{ background: '#e2e8f0', padding: '0.125rem 0.25rem', borderRadius: '0.25rem', fontSize: '0.875rem' }}>VITE_CLERK_PUBLISHABLE_KEY</code> with your Clerk publishable key</li>
            <li>Trigger a redeploy</li>
          </ol>
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '0.625rem 1.25rem',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '0.875rem',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#2563eb'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#3b82f6'
          }}
        >
          Reload Page
        </button>
      </div>
    </div>
  )
}

const Root = () => {
  if (!publishableKey) {
    if (import.meta.env.DEV) {
      console.warn("Missing VITE_CLERK_PUBLISHABLE_KEY environment variable. Rendering without Clerk.")
      // In development, allow rendering without Clerk for testing
      return <App />
    }
    // In production, show error UI instead of blank screen
    console.error("Missing VITE_CLERK_PUBLISHABLE_KEY environment variable in production build.")
    return <ClerkKeyMissingError />
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <App />
    </ClerkProvider>
  )
}

// Global error handler for unhandled errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error)
  const rootElement = document.getElementById("root")
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 2rem; font-family: system-ui, sans-serif;">
        <h1 style="color: #dc2626; margin-bottom: 1rem;">Application Error</h1>
        <p style="color: #666; margin-bottom: 1rem;">An error occurred while loading the application.</p>
        <pre style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; overflow: auto;">${event.error?.toString() || 'Unknown error'}</pre>
        <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 0.25rem; cursor: pointer;">Reload Page</button>
      </div>
    `
  }
})

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
})

const renderReactApp = () => {
  const rootElement = document.getElementById("root")
  if (!rootElement) {
    throw new Error("Root element not found. Make sure there's a <div id='root'></div> in your HTML.")
  }

  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <Root />
      </React.StrictMode>
    )
  } catch (error) {
    console.error('Failed to render React app:', error)
    rootElement.innerHTML = `
      <div style="padding: 2rem; font-family: system-ui, sans-serif;">
        <h1 style="color: #dc2626; margin-bottom: 1rem;">Render Error</h1>
        <p style="color: #666; margin-bottom: 1rem;">Failed to render the React application.</p>
        <pre style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; overflow: auto;">${error instanceof Error ? error.toString() : 'Unknown error'}</pre>
        <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 0.25rem; cursor: pointer;">Reload Page</button>
      </div>
    `
  }
}

const bootstrapApplication = async () => {
  try {
    await import('./lib/icons')
  } catch (error) {
    console.error('Failed to preload lucide-react icons before render:', error)
  } finally {
    renderReactApp()
  }
}

void bootstrapApplication()

if (import.meta.env.MODE !== "test" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const swVersionParam = appBuildId ? `?v=${encodeURIComponent(appBuildId)}` : ""
    navigator.serviceWorker.register(`/service-worker.js${swVersionParam}`).catch((error) => {
      if (import.meta.env.DEV) {
        console.warn("Service worker registration failed", error)
      }
    })
  })
}
