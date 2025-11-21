import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import { calculateMatchInsights, MatchInsights } from '../analytics/MatchInsights'
import type { DealMatch } from '../../../services/dealMatchingService'

const buildMatch = (overrides: Partial<DealMatch> = {}): DealMatch => ({
  id: overrides.id ?? 'match-1',
  dealId: overrides.dealId ?? 'deal-1',
  dealName: overrides.dealName ?? 'Sample Deal',
  score: overrides.score ?? 78,
  status: overrides.status ?? 'saved',
  matchedDealId: overrides.matchedDealId ?? 'target-1',
  createdAt: overrides.createdAt ?? new Date().toISOString(),
})

describe('calculateMatchInsights', () => {
  it('calculates aggregate stats with success and intro rates', () => {
    const matches: DealMatch[] = [
      buildMatch({ id: '1', score: 90, status: 'saved' }),
      buildMatch({ id: '2', score: 72, status: 'intro_requested' }),
      buildMatch({ id: '3', score: 55, status: 'passed' }),
    ]

    const insights = calculateMatchInsights(matches)

    expect(insights.totalMatches).toBe(3)
    expect(insights.averageScore).toBe(72)
    expect(insights.successRate).toBe(67)
    expect(insights.introRate).toBe(33)
    expect(insights.highConfidence).toBe(1)
  })

  it('returns sensible defaults when no matches', () => {
    const insights = calculateMatchInsights([])

    expect(insights.totalMatches).toBe(0)
    expect(insights.averageScore).toBe(0)
    expect(insights.successRate).toBe(0)
    expect(insights.highConfidence).toBe(0)
  })
})

describe('MatchInsights component', () => {
  it('renders insight cards with formatted values', () => {
    const { container } = render(
      <MatchInsights
        insights={{
          totalMatches: 12,
          averageScore: 84,
          successRate: 58,
          introRate: 41,
          highConfidence: 5,
        }}
      />
    )

    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('84')).toBeInTheDocument()
    expect(container.querySelector('[data-testid="match-insights"]')).not.toBeNull()
  })
})
