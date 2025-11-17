import React from "react"
import ReactDOM from "react-dom/client"
import { ClerkProvider } from "@clerk/clerk-react"

// Pre-import icons to ensure proper initialization before any components load
import './lib/icons'

import App from "./App"
import "./index.css"

const publishableKey =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ??
  (import.meta.env.MODE === "test" ? "test-clerk-publishable-key" : undefined)

const appBuildId = import.meta.env.VITE_APP_BUILD_ID ?? (typeof __APP_BUILD_ID__ !== 'undefined' ? __APP_BUILD_ID__ : undefined)

const Root = () => {
  if (!publishableKey) {
    if (import.meta.env.DEV) {
      console.warn("Missing VITE_CLERK_PUBLISHABLE_KEY environment variable. Rendering without Clerk.")
    }
    return <App />
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
