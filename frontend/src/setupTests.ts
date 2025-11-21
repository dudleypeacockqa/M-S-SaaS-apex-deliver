import '@testing-library/jest-dom'
import './test/shims/polyfills'
import { beforeAll, afterAll, beforeEach, vi, expect} from 'vitest'
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { ReactElement } from 'react'
import { installClerkMock } from './test/shims/clerk'
import { setupServer } from 'msw/node'
import { mswHandlers, resetDocumentRoomFixtures, resetPodcastFixtures } from './tests/msw/server'

const server = setupServer(...mswHandlers)

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' }) // Changed from 'error' to 'warn' to allow graceful handling
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

class IntersectionObserverMock implements IntersectionObserver {
  readonly root: Element | Document | null
  readonly rootMargin: string
  readonly thresholds: ReadonlyArray<number>
  private callback: IntersectionObserverCallback

  constructor(callback: IntersectionObserverCallback, options: IntersectionObserverInit = {}) {
    this.callback = callback
    this.root = options.root ?? null
    this.rootMargin = options.rootMargin ?? '0px'
    this.thresholds = Array.isArray(options.threshold) ? options.threshold : [options.threshold ?? 0]
  }

  observe(target: Element) {
    this.callback(
      [
        {
          isIntersecting: true,
          target,
          intersectionRatio: 1,
          time: Date.now(),
          boundingClientRect: target.getBoundingClientRect(),
          intersectionRect: target.getBoundingClientRect(),
          rootBounds: this.root instanceof Element ? this.root.getBoundingClientRect() : null,
        } as IntersectionObserverEntry,
      ],
      this,
    )
  }

  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

if (!('IntersectionObserver' in window)) {
  Object.defineProperty(window, 'IntersectionObserver', {
    configurable: true,
    writable: true,
    value: IntersectionObserverMock,
  })
}

if (!('IntersectionObserver' in globalThis)) {
  ;(globalThis as any).IntersectionObserver = IntersectionObserverMock
}

class ResizeObserverMock implements ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!('ResizeObserver' in window)) {
  Object.defineProperty(window, 'ResizeObserver', {
    configurable: true,
    writable: true,
    value: ResizeObserverMock,
  })
}

if (!('ResizeObserver' in globalThis)) {
  ;(globalThis as any).ResizeObserver = ResizeObserverMock
}

beforeEach(() => {
  localStorageMock = createLocalStorageMock()
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: localStorageMock,
  })
  installClerkMock()
  resetDocumentRoomFixtures()
  resetPodcastFixtures()
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
