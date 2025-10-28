// Test setup file for vitest
import '@testing-library/jest-dom'
import { beforeAll, afterAll, vi, expect } from 'vitest'
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { ReactElement } from 'react'

beforeAll(() => {
  vi.stubEnv('VITE_CLERK_PUBLISHABLE_KEY', 'test_clerk_publishable_key')
})

afterAll(() => {
  vi.unstubAllEnvs()
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
