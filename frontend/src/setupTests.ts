// Test setup file for vitest
import '@testing-library/jest-dom'
import { beforeAll, afterAll, vi } from 'vitest'

beforeAll(() => {
  vi.stubEnv('VITE_CLERK_PUBLISHABLE_KEY', 'test_clerk_publishable_key')
})

afterAll(() => {
  vi.unstubAllEnvs()
})
