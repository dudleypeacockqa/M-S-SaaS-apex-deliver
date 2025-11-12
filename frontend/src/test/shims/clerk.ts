import { vi } from 'vitest'

export function installClerkMock() {
  if (typeof window === 'undefined') {
    return
  }

  if ((window as any).Clerk) {
    return
  }

  const mockSession = {
    getToken: vi.fn().mockResolvedValue('test-clerk-token'),
  }

  const mockClerk = {
    session: Promise.resolve(mockSession),
  }

  Object.defineProperty(window, 'Clerk', {
    configurable: true,
    writable: true,
    value: mockClerk,
  })
}
