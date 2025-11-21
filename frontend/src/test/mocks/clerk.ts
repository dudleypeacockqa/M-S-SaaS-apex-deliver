import React, { type ReactNode } from 'react'
import { vi } from 'vitest'

type MockClerkState = {
  isSignedIn: boolean
  isLoaded: boolean
  user: {
    firstName?: string | null
    emailAddress?: string | null
    publicMetadata?: Record<string, unknown>
    id?: string
  } | null
  organization: {
    name?: string | null
    publicMetadata?: Record<string, unknown>
    id?: string
  } | null
}

// Use a global object to avoid module initialization issues with hoisting and --pool=threads
const getMockState = (): MockClerkState => {
  // @ts-expect-error - accessing global mock state
  if (!globalThis.__mockClerkState) {
    // @ts-expect-error
    globalThis.__mockClerkState = {
      isSignedIn: false,
      isLoaded: true,
      user: null,
      organization: null,
    }
  }
  // @ts-expect-error
  return globalThis.__mockClerkState as MockClerkState
}

export const setMockClerkState = (state: Partial<MockClerkState>) => {
  const currentState = getMockState()
  Object.assign(currentState, state)
}

export const getMockClerkStateValue = () => ({ ...getMockState() })

// Create mock factory that accesses state lazily to avoid hoisting issues
export const createClerkMock = () => {
  // Access state lazily through function to avoid hoisting issues
  const getState = () => getMockState()
  
  return {
    ClerkProvider: ({ children }: { children: ReactNode }) => React.createElement(React.Fragment, null, children),
    SignedIn: ({ children }: { children: ReactNode }) => {
      const state = getState()
      return state.isSignedIn ? React.createElement(React.Fragment, null, children) : null
    },
    SignedOut: ({ children }: { children: ReactNode }) => {
      const state = getState()
      return state.isSignedIn ? null : React.createElement(React.Fragment, null, children)
    },
    SignIn: () => React.createElement('div', { 'data-testid': 'mock-sign-in' }),
    SignUp: () => React.createElement('div', { 'data-testid': 'mock-sign-up' }),
    SignInButton: ({ children }: { children: ReactNode }) =>
      React.createElement('button', { 'data-testid': 'sign-in-button' }, children),
    SignUpButton: ({ children }: { children: ReactNode }) =>
      React.createElement('button', { 'data-testid': 'sign-up-button' }, children),
    UserButton: () => React.createElement('div', { 'data-testid': 'user-menu' }, 'User Menu'),
    useAuth: () => {
      const state = getState()
      return {
        isSignedIn: state.isSignedIn,
        isLoaded: state.isLoaded,
        userId: state.user?.id ?? null,
        sessionId: state.isSignedIn ? 'mock-session-id' : null,
        getToken: vi.fn().mockResolvedValue('mock-token'),
      }
    },
    useUser: () => {
      const state = getState()
      return {
        isSignedIn: state.isSignedIn,
        isLoaded: state.isLoaded,
        user: state.user,
      }
    },
    useOrganization: () => {
      const state = getState()
      return {
        organization: state.organization,
        isLoaded: true,
        membership: state.organization
          ? {
              role: 'org:admin',
              permissions: [],
            }
          : null,
      }
    },
    useOrganizationList: () => {
      const state = getState()
      return {
        isLoaded: true,
        organizationList: state.organization
          ? [
              {
                organization: state.organization,
                membership: {
                  role: 'org:admin',
                  permissions: [],
                },
              },
            ]
          : [],
      }
    },
  }
}
