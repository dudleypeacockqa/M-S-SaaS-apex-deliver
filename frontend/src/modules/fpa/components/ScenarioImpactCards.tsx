import React from 'react'
import { DollarSign, TrendingUp, Briefcase, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface ScenarioImpactCardsProps {
  revenue: number
  grossMargin: number
  ebitda: number
  ebitdaMargin: number
  baseline?: {
    revenue: number
    grossMargin: number
    ebitda: number
    ebitdaMargin: number
  }
}

type MetricKey = 'revenue' | 'grossMargin' | 'ebitda' | 'ebitdaMargin'

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
  notation: 'compact',
  compactDisplay: 'short',
})

const percentFormatter = (value: number) => `${value.toFixed(1)}%`

export const ScenarioImpactCards: React.FC<ScenarioImpactCardsProps> = ({
  revenue,
  grossMargin,
  ebitda,
  ebitdaMargin,
  baseline,
}) => {
  const cards = [
    {
      key: 'revenue' as MetricKey,
      icon: DollarSign,
      label: 'Projected Revenue',
      value: revenue,
      formatter: currencyFormatter.format,
      gradient: 'from-purple-500 to-indigo-600',
    },
    {
      key: 'grossMargin' as MetricKey,
      icon: TrendingUp,
      label: 'Gross Margin',
      value: grossMargin,
      formatter: percentFormatter,
      gradient: 'from-indigo-500 to-blue-600',
    },
    {
      key: 'ebitda' as MetricKey,
      icon: Briefcase,
      label: 'EBITDA',
      value: ebitda,
      formatter: currencyFormatter.format,
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      key: 'ebitdaMargin' as MetricKey,
      icon: Target,
      label: 'EBITDA Margin',
      value: ebitdaMargin,
      formatter: percentFormatter,
      gradient: 'from-cyan-500 to-teal-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        const baselineValue = baseline ? baseline[card.key] : null
        const delta = baselineValue !== null && baselineValue !== undefined ? card.value - baselineValue : null
        const isPositive = (delta ?? 0) >= 0

        return (
          <div
            key={card.key}
            className={`bg-gradient-to-br ${card.gradient} rounded-lg p-6 text-white shadow-lg transition-all duration-200 hover:-translate-y-1`}
          >
            <div className="mb-4 flex items-center justify-between">
              <Icon className="h-8 w-8 opacity-90" />
              {delta !== null && (
                <div className={`flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-emerald-200' : 'text-rose-200'}`}>
                  {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  <span>{card.formatter(Math.abs(delta))}</span>
                </div>
              )}
            </div>
            <p className="text-3xl font-bold tracking-tight">{card.formatter(card.value)}</p>
            <p className="mt-2 text-sm font-semibold opacity-90">{card.label}</p>
            {baselineValue !== null && baselineValue !== undefined && (
              <p className="text-xs opacity-75">Baseline {card.formatter(baselineValue)}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}

