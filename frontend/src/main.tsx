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

const appBuildId = import.meta.env.VITE_APP_BUILD_ID ?? __APP_BUILD_ID__

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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)

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
