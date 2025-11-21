import { describe, it, expect, beforeEach, vi } from 'vitest'
import api from './api'
import { handleFormSubmission } from './ghl'

vi.mock('./api', () => ({
  __esModule: true,
  default: {
    post: vi.fn(),
  },
}))

const mockedApi = api as unknown as { post: ReturnType<typeof vi.fn> }

describe('handleFormSubmission', () => {
  beforeEach(() => {
    mockedApi.post.mockReset()
  })

  it('normalizes payload and forwards to marketing contact endpoint', async () => {
    mockedApi.post.mockResolvedValue({ data: { success: true, message: 'ok', id: 42 } })

    const result = await handleFormSubmission(
      {
        firstName: 'Ava',
        lastName: 'Morgan',
        email: 'ava@example.com',
        company: 'FinanceFlo',
        phone: '+123',
        budget: '250k',
      },
      'Demo Request',
    )

    expect(mockedApi.post).toHaveBeenCalledWith('/marketing/contact', {
      name: 'Ava Morgan',
      email: 'ava@example.com',
      company: 'FinanceFlo',
      phone: '+123',
      message: expect.stringContaining('budget'),
    })

    expect(result).toMatchObject({
      success: true,
      message: 'ok',
      contactId: 'contact-42',
    })
    expect(result.leadScore).toBeGreaterThanOrEqual(10)
  })

  it('handles API failures gracefully', async () => {
    mockedApi.post.mockRejectedValue(new Error('network down'))

    const result = await handleFormSubmission({
      name: 'Fallback',
      email: 'fallback@example.com',
    })

    expect(mockedApi.post).toHaveBeenCalled()
    expect(result.success).toBe(false)
    expect(result.message).toContain('Failed')
    expect(result.error).toBe('network down')
  })
})
