import React from "react"
import ReactDOM from "react-dom/client"
import { ClerkProvider } from "@clerk/clerk-react"
import App from "./App"
import "./index.css"
// CRITICAL: Import icons to force initialization (prevents "Cannot set properties of undefined" error)
import "@/lib/icons"

const publishableKey =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ??
  (import.meta.env.MODE === "test" ? "test-clerk-publishable-key" : undefined)

const appBuildId = import.meta.env.VITE_APP_BUILD_ID ?? (typeof __APP_BUILD_ID__ !== 'undefined' ? __APP_BUILD_ID__ : undefined)

const unregisterLegacyServiceWorkers = () => {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
    return
  }

  navigator.serviceWorker
    .getRegistrations()
    .then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister().catch((error) => {
          if (import.meta.env.DEV) {
            console.warn('Failed to unregister service worker', error)
          }
        })
      })
    })
    .catch((error) => {
      if (import.meta.env.DEV) {
        console.warn('Unable to enumerate service workers', error)
      }
    })
}

const Root = () => {
  // Always provide ClerkProvider context to prevent SignedIn/SignedOut component crashes
  // Use fallback key if real key is missing - this allows app to render
  const keyToUse = publishableKey && 
    publishableKey !== 'undefined' && 
    publishableKey.trim() !== ''
    ? publishableKey 
    : "pk_test_fallback-key-prevents-crashes"
  
  if (!publishableKey || publishableKey === 'undefined' || publishableKey.trim() === '') {
    console.warn("Missing or invalid VITE_CLERK_PUBLISHABLE_KEY. Using fallback key to prevent crashes.")
  }

  // Always wrap App in ClerkProvider - even with invalid key, it initializes (auth just won't work)
  // This prevents SignedIn/SignedOut components from crashing with "must be used within ClerkProvider" errors
  return (
    <ClerkProvider publishableKey={keyToUse}>
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
    if (rootElement.hasChildNodes()) {
      ReactDOM.hydrateRoot(rootElement,
        <React.StrictMode>
          <Root />
        </React.StrictMode>
      )
    } else {
      ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
          <Root />
        </React.StrictMode>
      )
    }
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

// Render React app synchronously - no async preloading needed
unregisterLegacyServiceWorkers()
renderReactApp()
