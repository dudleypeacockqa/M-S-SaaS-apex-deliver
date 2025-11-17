import React from "react"
import ReactDOM from "react-dom/client"
import { ClerkProvider } from "@clerk/clerk-react"

import App from "./App"
import "./index.css"

const publishableKey =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ??
  (import.meta.env.MODE === "test" ? "test-clerk-publishable-key" : undefined)

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
    navigator.serviceWorker.register("/service-worker.js").catch((error) => {
      if (import.meta.env.DEV) {
        console.warn("Service worker registration failed", error)
      }
    })
  })
}
