import React from 'react'

import type { DealMatch } from '../../../services/dealMatchingService'

export interface MatchInsightStats {
  totalMatches: number
  averageScore: number
  successRate: number
  introRate: number
  highConfidence: number
}

const formatPercent = (value: number) => `${Math.max(0, Math.min(100, Math.round(value)))}%`

const insightCards: Array<{
  key: keyof MatchInsightStats
  label: string
  helper?: string
  emphasis?: 'primary' | 'secondary'
}> = [
  { key: 'totalMatches', label: 'Total Matches', helper: 'Tracked this week', emphasis: 'primary' },
  { key: 'averageScore', label: 'Average Score', helper: 'Quality index' },
  { key: 'successRate', label: 'Success Rate', helper: 'Saved or intro requested', emphasis: 'secondary' },
  { key: 'introRate', label: 'Intro Rate', helper: 'Introductions requested' },
  { key: 'highConfidence', label: 'High Confidence', helper: 'Score ≥ 80' },
]

export const calculateMatchInsights = (matches: DealMatch[]): MatchInsightStats => {
  if (!matches || matches.length === 0) {
    return {
      totalMatches: 0,
      averageScore: 0,
      successRate: 0,
      introRate: 0,
      highConfidence: 0,
    }
  }

  const totalMatches = matches.length
  const successStatuses = new Set(['saved', 'intro_requested', 'intro_completed', 'accepted', 'won'])
  const introStatuses = new Set(['intro_requested', 'intro_completed'])

  const { totalScore, successCount, introCount, highConfidence } = matches.reduce(
    (acc, match) => {
      const numericScore = typeof match.score === 'number' ? match.score : Number(match.score ?? 0)
      if (Number.isFinite(numericScore)) {
        acc.totalScore += numericScore
        if (numericScore >= 80) {
          acc.highConfidence += 1
        }
      }
      const status = (match.status ?? '').toLowerCase()
      if (successStatuses.has(status)) {
        acc.successCount += 1
      }
      if (introStatuses.has(status)) {
        acc.introCount += 1
      }
      return acc
    },
    { totalScore: 0, successCount: 0, introCount: 0, highConfidence: 0 },
  )

  return {
    totalMatches,
    averageScore: totalMatches > 0 ? Math.round(totalScore / totalMatches) : 0,
    successRate: totalMatches > 0 ? Math.round((successCount / totalMatches) * 100) : 0,
    introRate: totalMatches > 0 ? Math.round((introCount / totalMatches) * 100) : 0,
    highConfidence,
  }
}

interface MatchInsightsProps {
  insights: MatchInsightStats
}

export const MatchInsights: React.FC<MatchInsightsProps> = ({ insights }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5" data-testid="match-insights">
      {insightCards.map((card) => {
        const value = insights[card.key]
        const displayValue =
          card.key === 'averageScore' || card.key === 'highConfidence'
            ? value
            : card.key === 'totalMatches'
              ? value
              : formatPercent(value)

        const emphasisClass =
          card.emphasis === 'primary'
            ? 'bg-slate-900 text-white'
            : card.emphasis === 'secondary'
              ? 'bg-indigo-50 border-indigo-200'
              : 'bg-white'

        return (
          <div
            key={card.key}
            className={`rounded-2xl border border-slate-200 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow ${
              emphasisClass ?? ''
            }`}
          >
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400">
              {card.label}
            </p>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {displayValue}
              {card.key === 'averageScore' && <span className="ml-1 text-base font-medium text-slate-500">/100</span>}
            </p>
            {card.helper && <p className="mt-2 text-xs text-slate-500">{card.helper}</p>}
          </div>
        )
      })}
    </div>
  )
}

