import React from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@clerk/clerk-react', () => {
  const MockComponent = ({ children }: { children?: React.ReactNode }) => <>{children}</>
  const mockHook = () => ({})
  return {
    ClerkProvider: MockComponent,
    SignedIn: MockComponent,
    SignedOut: MockComponent,
    SignIn: MockComponent,
    SignUp: MockComponent,
    SignInButton: MockComponent,
    SignUpButton: MockComponent,
    UserButton: MockComponent,
    useAuth: mockHook,
    useUser: mockHook,
    useOrganization: mockHook,
    useOrganizationList: mockHook,
  }
})

const loadModule = async () => {
  vi.resetModules()
  return import('./index')
}

describe('clerk wrapper', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('enables real Clerk exports when publishable key is valid', async () => {
    import.meta.env.VITE_CLERK_PUBLISHABLE_KEY = 'pk_live_123'
    const mod = await loadModule()
    expect(mod.isClerkEnabled).toBe(true)
    expect(mod.clerkPublishableKey).toBe('pk_live_123')
  })

  it('disables Clerk when publishable key contains local preview marker', async () => {
    import.meta.env.VITE_CLERK_PUBLISHABLE_KEY = 'pk_test_localpreview'
    const mod = await loadModule()
    expect(mod.isClerkEnabled).toBe(false)
    expect(mod.clerkPublishableKey).toBeUndefined()
  })

  it('disables Clerk when publishable key is missing', async () => {
    delete import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
    const mod = await loadModule()
    expect(mod.isClerkEnabled).toBe(false)
    expect(mod.clerkPublishableKey).toBeUndefined()
  })
})

