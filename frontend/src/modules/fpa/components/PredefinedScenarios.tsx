import React from 'react'
import { ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react'

const DEFAULT_SCENARIOS: PredefinedScenarioCard[] = [
  { id: 'aggressive-growth', name: 'Aggressive Growth', description: 'Double pipeline velocity with expanded demand gen', revenueImpact: 12, ebitdaImpact: 4 },
  { id: 'efficiency-focus', name: 'Efficiency Focus', description: 'Lean execution with targeted opex reductions', revenueImpact: 4, ebitdaImpact: 6 },
  { id: 'defensive-mode', name: 'Defensive Mode', description: 'Preserve cash during macro slowdowns', revenueImpact: -3, ebitdaImpact: 2 },
  { id: 'platform-investment', name: 'Platform Investment', description: 'Fund platform upgrades for strategic accounts', revenueImpact: 7, ebitdaImpact: -1 },
]


export interface PredefinedScenarioCard {
  id: string
  name: string
  description: string
  revenueImpact: number
  ebitdaImpact: number
}

interface PredefinedScenariosProps {
  baseline: {
    revenue: number
    ebitda: number
  }
  scenarios?: PredefinedScenarioCard[]
  onApplyScenario: (scenarioId: string) => void
  isApplying?: boolean
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value)

const formatPercent = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`

export const PredefinedScenarios: React.FC<PredefinedScenariosProps> = ({
  baseline,
  scenarios = DEFAULT_SCENARIOS,
  onApplyScenario,
  isApplying,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {scenarios.map((scenario) => {
        const revenueValue = baseline.revenue * (1 + scenario.revenueImpact / 100)
        const ebitdaValue = baseline.ebitda * (1 + scenario.ebitdaImpact / 100)
        const revenuePositive = scenario.revenueImpact >= 0
        const ebitdaPositive = scenario.ebitdaImpact >= 0

        return (
          <div key={scenario.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Preset</p>
                <h3 className="text-base font-semibold text-slate-900">{scenario.name}</h3>
                <p className="text-xs text-slate-500">{scenario.description}</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <p className="text-xs text-slate-500">Revenue</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-lg font-bold text-slate-900">{formatCurrency(revenueValue)}</p>
                  <span className={`inline-flex items-center text-sm font-medium ${revenuePositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {revenuePositive ? <ArrowUpRight className="mr-1 h-4 w-4" /> : <ArrowDownRight className="mr-1 h-4 w-4" />}
                    {formatPercent(scenario.revenueImpact)}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500">EBITDA</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-lg font-bold text-slate-900">{formatCurrency(ebitdaValue)}</p>
                  <span className={`inline-flex items-center text-sm font-medium ${ebitdaPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {ebitdaPositive ? <ArrowUpRight className="mr-1 h-4 w-4" /> : <ArrowDownRight className="mr-1 h-4 w-4" />}
                    {formatPercent(scenario.ebitdaImpact)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onApplyScenario(scenario.id)}
              className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
              disabled={isApplying}
            >
              {isApplying ? 'Applying…' : 'Apply Scenario'}
            </button>
          </div>
        )
      })}
    </div>
  )
}

