import '@testing-library/jest-dom'
import './test/shims/polyfills'
import { beforeAll, afterAll, beforeEach, vi, expect } from 'vitest'
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { ReactElement } from 'react'
import { installClerkMock } from './test/shims/clerk'
import { setupServer } from 'msw/node'
import { mswHandlers, resetDocumentRoomFixtures } from './tests/msw/server'


const server = setupServer(...mswHandlers)

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
  vi.stubEnv('VITE_CLERK_PUBLISHABLE_KEY', 'test_clerk_publishable_key')
})

const createLocalStorageMock = () => {
  let store: Record<string, string> = {}

  return {
    getItem: vi.fn((key: string) => (key in store ? store[key] : null)),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = String(value)
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
}

let localStorageMock = createLocalStorageMock()

Object.defineProperty(window, 'localStorage', {
  configurable: true,
  value: localStorageMock,
})

beforeEach(() => {
  localStorageMock = createLocalStorageMock()
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: localStorageMock,
  })
  installClerkMock()
  resetDocumentRoomFixtures()
})

afterAll(() => {
  server.close()
  vi.unstubAllEnvs()
})

afterEach(() => {
  server.resetHandlers()
})

// Provide a helper to wrap components with QueryClientProvider in tests
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  })

export function renderWithQueryClient(ui: ReactElement) {
  const queryClient = createTestQueryClient()
  return {
    queryClient,
    ...render(React.createElement(QueryClientProvider, { client: queryClient }, ui)),
  }
}

expect.extend({})
