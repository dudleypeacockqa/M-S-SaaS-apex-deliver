import { describe, it, expect } from 'vitest'
import { formatDate } from './dateFormat'

describe('formatDate', () => {
  it('formats ISO strings as short dates by default', () => {
    expect(formatDate('2025-01-15T10:00:00Z')).toBe('15 Jan 2025')
  })

  it('returns empty string for invalid values', () => {
    expect(formatDate('not-a-date')).toBe('')
  })

  it('supports overriding format options and locale', () => {
    expect(
      formatDate('2025-04-01T00:00:00Z', { month: 'long', day: 'numeric' }, 'en-US')
    ).toBe('April 1')
  })
})
