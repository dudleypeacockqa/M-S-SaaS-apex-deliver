import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

import {
  getCurrentUser,
  hasRole,
  getPermissionLevel,
  meetsPermissionLevel,
  type User,
} from './api'

const mockUser: User = {
  id: 'user-1',
  clerk_user_id: 'clerk-user-1',
  email: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
  profile_image_url: null,
  role: 'growth',
  is_active: true,
  created_at: '2025-01-01T00:00:00.000Z',
  updated_at: '2025-01-01T00:00:00.000Z',
}

describe('api utilities', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    vi.resetAllMocks()
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  it('getCurrentUser returns parsed user when request succeeds', async () => {
    const json = vi.fn().mockResolvedValue(mockUser)
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json }) as unknown as typeof fetch

    const result = await getCurrentUser('token-123')

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/auth\/me$/),
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({ Authorization: 'Bearer token-123' }),
      })
    )
    expect(result).toEqual(mockUser)
    expect(json).toHaveBeenCalled()
  })

  it('getCurrentUser throws structured error when backend returns failure payload', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({
        error: { code: 'AUTH_ERROR', message: 'Failed auth' },
      }),
    }) as unknown as typeof fetch

    await expect(getCurrentUser('bad-token')).rejects.toThrow('Failed auth')
  })

  it('hasRole respects admin override and exact matches', () => {
    expect(hasRole({ ...mockUser, role: 'admin' }, 'solo')).toBe(true)
    expect(hasRole({ ...mockUser, role: 'growth' }, 'growth')).toBe(true)
    expect(hasRole({ ...mockUser, role: 'growth' }, 'enterprise')).toBe(false)
    expect(hasRole(null, 'growth')).toBe(false)
  })

  it('getPermissionLevel maps known roles to numeric hierarchy', () => {
    expect(getPermissionLevel('solo')).toBe(1)
    expect(getPermissionLevel('growth')).toBe(2)
    expect(getPermissionLevel('enterprise')).toBe(3)
    expect(getPermissionLevel('admin')).toBe(4)
    expect(getPermissionLevel('unknown')).toBe(0)
  })

  it('meetsPermissionLevel compares user hierarchy against required role', () => {
    expect(meetsPermissionLevel({ ...mockUser, role: 'enterprise' }, 'growth')).toBe(true)
    expect(meetsPermissionLevel({ ...mockUser, role: 'growth' }, 'enterprise')).toBe(false)
    expect(meetsPermissionLevel(null, 'solo')).toBe(false)
  })
})

