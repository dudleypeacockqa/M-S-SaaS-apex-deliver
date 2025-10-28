/**
 * Clerk TypeScript declarations for window.Clerk
 */

interface ClerkSession {
  getToken: () => Promise<string | null>
}

interface ClerkInstance {
  session: Promise<ClerkSession | null>
  loaded: boolean
}

interface Window {
  Clerk: ClerkInstance
}
