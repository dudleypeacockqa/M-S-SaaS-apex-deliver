import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listValuations,
  listScenarios,
  listComparableCompanies,
  listPrecedentTransactions,
  getScenarioSummary,
  getComparableSummary,
  getPrecedentSummary,
  runMonteCarlo,
  triggerExport,
} from '../../../services/api/valuations'

// Import types separately
import type {
  MonteCarloRequest,
  ValuationExportResponse,
  ComparableSummaryMetrics,
} from '../../../services/api/valuations'

import { formatCurrency } from '../../../services/api/deals'

const skeletonClass = 'animate-pulse rounded bg-gray-200 h-4'

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
    <header className="border-b border-gray-200 px-6 py-4">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
    </header>
    <div className="px-6 py-4">{children}</div>
  </section>
)

const TabButton = ({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
      active ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
    }`}
  >
    {label}
  </button>
)

const SummaryView = ({ dealId, valuationId }: { dealId: string; valuationId: string }) => {
  const { data: valuations, isLoading } = useQuery({
    queryKey: ['valuations', dealId],
    queryFn: () => listValuations(dealId),
  })

  if (isLoading) {
    return (
      <div className="space-y-3" role="status" aria-label="Loading valuations">
        <div className={`${skeletonClass} w-32`}></div>
        <div className={`${skeletonClass} w-full`}></div>
        <div className={`${skeletonClass} w-3/4`}></div>
      </div>
    )
  }

  if (!valuations || valuations.length === 0) {
    return <p className="text-sm text-gray-600">No valuations created yet.</p>
  }

  const currentValuation = valuations.find((valuation) => valuation.id === valuationId)

  return (
    <div className="space-y-6">
      <SectionCard title="Valuation Summary">
        {currentValuation ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <p className="text-sm text-gray-500">Enterprise Value</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatCurrency(currentValuation.enterprise_value, 'GBP')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Equity Value</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatCurrency(currentValuation.equity_value, 'GBP')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Implied Share Price</p>
              <p className="text-xl font-semibold text-gray-900">
                {currentValuation.implied_share_price
                  ? `£${currentValuation.implied_share_price.toFixed(2)}`
                  : 'N/A'}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600">Selected valuation not found.</p>
        )}
      </SectionCard>

      <SectionCard title="Monte Carlo Simulation">
        <MonteCarloPanel dealId={dealId} valuationId={valuationId} />
      </SectionCard>
    </div>
  )
}

const MonteCarloPanel = ({ dealId, valuationId }: { dealId: string; valuationId: string }) => {
  const queryClient = useQueryClient()
  const [iterations, setIterations] = useState(500)
  const [seed, setSeed] = useState<number | ''>('')

  const { data: simulation, isPending, mutate } = useMutation({
    mutationFn: (payload: MonteCarloRequest) => runMonteCarlo(dealId, valuationId, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(['valuations', dealId, valuationId, 'monte-carlo'], data)
    },
  })

  const handleRun = () => {
    const payload: MonteCarloRequest = { iterations }
    if (seed !== '') payload.seed = seed
    mutate(payload)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700">Iterations</label>
          <input
            type="number"
            min={50}
            step={50}
            value={iterations}
            onChange={(event) => setIterations(parseInt(event.target.value, 10))}
            className="mt-1 w-36 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Seed (optional)</label>
          <input
            type="number"
            value={seed}
            onChange={(event) => setSeed(event.target.value === '' ? '' : parseInt(event.target.value, 10))}
            className="mt-1 w-36 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>
        <button
          type="button"
          onClick={handleRun}
          disabled={isPending}
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? 'Running...' : 'Run Simulation'}
        </button>
      </div>

      {simulation ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Iterations</p>
            <p className="text-xl font-semibold text-gray-900">{simulation.iterations}</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Mean EV</p>
            <p className="text-xl font-semibold text-gray-900">
              {formatCurrency(simulation.mean_enterprise_value, 'GBP')}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">P10</p>
            <p className="text-xl font-semibold text-gray-900">
              {formatCurrency(simulation.percentiles.p10, 'GBP')}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">P90</p>
            <p className="text-xl font-semibold text-gray-900">
              {formatCurrency(simulation.percentiles.p90, 'GBP')}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-600">Run the simulation to view percentile outcomes.</p>
      )}
    </div>
  )
}

const ComparablesView = ({ dealId, valuationId }: { dealId: string; valuationId: string }) => {
  const { data: comparables, isLoading } = useQuery({
    queryKey: ['valuations', dealId, valuationId, 'comparables'],
    queryFn: () => listComparableCompanies(dealId, valuationId),
  })
  const { data: summary } = useQuery({
    queryKey: ['valuations', dealId, valuationId, 'comparables', 'summary'],
    queryFn: () => getComparableSummary(dealId, valuationId),
    enabled: !!comparables?.length,
  })

  if (isLoading) {
    return <p className="text-sm text-gray-600">Loading comparable companies...</p>
  }

  if (!comparables || comparables.length === 0) {
    return <p className="text-sm text-gray-600">No comparable companies added yet.</p>
  }

  return (
    <div className="space-y-6">
      {summary && (
        <SectionCard title="Implied Valuation Range">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SummaryMetricCard title="EV / Revenue" metrics={summary.ev_revenue} />
            <SummaryMetricCard title="EV / EBITDA" metrics={summary.ev_ebitda} />
          </div>
        </SectionCard>
      )}

      <SectionCard title="Comparable Companies">
        <div className="grid grid-cols-1 gap-4">
          {comparables.map((comparable) => (
            <article key={comparable.id} className="rounded-lg border border-gray-200 p-4">
              <header className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">{comparable.company_name}</h3>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                  Weight: {comparable.weight.toFixed(2)}
                </span>
              </header>
              <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">EV / Revenue</p>
                  <p className="font-medium text-gray-900">
                    {comparable.ev_revenue_multiple ? comparable.ev_revenue_multiple.toFixed(2) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">EV / EBITDA</p>
                  <p className="font-medium text-gray-900">
                    {comparable.ev_ebitda_multiple ? comparable.ev_ebitda_multiple.toFixed(2) : 'N/A'}
                  </p>
                </div>
              </div>
              {comparable.notes && (
                <p className="mt-3 text-sm text-gray-600">{comparable.notes}</p>
              )}
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

const SummaryMetricCard = ({
  title,
  metrics,
}: {
  title: string
  metrics: ComparableSummaryMetrics | { count: number; min: number | null; max: number | null; median: number | null; weighted_average: number | null }
}) => {
  // Type guard to check if this is ComparableSummaryMetrics
  const isComparable = 'implied_enterprise_value_median' in metrics;

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
      <dl className="mt-3 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-gray-500">Median</dt>
          <dd className="font-medium text-gray-900">
            {isComparable && (metrics as ComparableSummaryMetrics).implied_enterprise_value_median
              ? formatCurrency((metrics as ComparableSummaryMetrics).implied_enterprise_value_median!, 'GBP')
              : 'N/A'}
          </dd>
        </div>
        {isComparable && (
          <>
            <div className="flex items-center justify-between">
              <dt className="text-gray-500">Range</dt>
              <dd className="font-medium text-gray-900">
                {(metrics as ComparableSummaryMetrics).implied_enterprise_value_min && (metrics as ComparableSummaryMetrics).implied_enterprise_value_max
                  ? `${formatCurrency((metrics as ComparableSummaryMetrics).implied_enterprise_value_min!, 'GBP')} - ${formatCurrency(
                      (metrics as ComparableSummaryMetrics).implied_enterprise_value_max!,
                      'GBP',
                    )}`
                  : 'N/A'}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-gray-500">Outliers Removed</dt>
              <dd className="font-medium text-gray-900">{(metrics as ComparableSummaryMetrics).excluded_outliers}</dd>
            </div>
          </>
        )}
      </dl>
    </div>
  )
}

const PrecedentsView = ({ dealId, valuationId }: { dealId: string; valuationId: string }) => {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['valuations', dealId, valuationId, 'precedents'],
    queryFn: () => listPrecedentTransactions(dealId, valuationId),
  })

  const { data: summary } = useQuery({
    queryKey: ['valuations', dealId, valuationId, 'precedents', 'summary'],
    queryFn: () => getPrecedentSummary(dealId, valuationId),
    enabled: !!transactions?.length,
  })

  if (isLoading) {
    return <p className="text-sm text-gray-600">Loading precedent transactions...</p>
  }

  if (!transactions || transactions.length === 0) {
    return <p className="text-sm text-gray-600">No precedent transactions recorded yet.</p>
  }

  return (
    <div className="space-y-6">
      {summary && (
        <SectionCard title="Valuation Summary">
          <SummaryMetricCard title="EV / EBITDA" metrics={summary.ev_ebitda} />
          <p className="mt-3 text-sm text-gray-600">
            <span className="font-medium text-gray-900">{summary.stale_count}</span> transactions flagged as
            stale (older than 12 months).
          </p>
        </SectionCard>
      )}

      <SectionCard title="Precedent Transactions">
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <article key={transaction.id} className="rounded-lg border border-gray-200 p-4">
              <header className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{transaction.target_company}</h3>
                  <p className="text-sm text-gray-600">Acquirer: {transaction.acquirer_company}</p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    transaction.is_stale === 'true'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {transaction.is_stale === 'true' ? 'Stale' : 'Recent'}
                </span>
              </header>
              <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">EV / EBITDA</p>
                  <p className="font-medium text-gray-900">
                    {transaction.ev_ebitda_multiple ? transaction.ev_ebitda_multiple.toFixed(2) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Weight</p>
                  <p className="font-medium text-gray-900">{transaction.weight.toFixed(2)}</p>
                </div>
              </div>
              {transaction.notes && (
                <p className="mt-3 text-sm text-gray-600">{transaction.notes}</p>
              )}
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

const ScenariosView = ({ dealId, valuationId }: { dealId: string; valuationId: string }) => {
  const { data: scenarios, isLoading } = useQuery({
    queryKey: ['valuations', dealId, valuationId, 'scenarios'],
    queryFn: () => listScenarios(dealId, valuationId),
  })

  const { data: summary } = useQuery({
    queryKey: ['valuations', dealId, valuationId, 'scenarios', 'summary'],
    queryFn: () => getScenarioSummary(dealId, valuationId),
    enabled: !!scenarios?.length,
  })

  if (isLoading) {
    return <p className="text-sm text-gray-600">Loading scenarios...</p>
  }

  if (!scenarios || scenarios.length === 0) {
    return <p className="text-sm text-gray-600">No scenarios created yet.</p>
  }

  return (
    <div className="space-y-6">
      {summary && (
        <SectionCard title="Enterprise Value Range">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <RangeValue label="Min" value={summary.enterprise_value_range.min} />
            <RangeValue label="Median" value={summary.enterprise_value_range.median} />
            <RangeValue label="Max" value={summary.enterprise_value_range.max} />
          </div>
        </SectionCard>
      )}

      <SectionCard title="Scenario Details">
        <div className="grid grid-cols-1 gap-4">
          {scenarios.map((scenario) => (
            <article key={scenario.id} className="rounded-lg border border-gray-200 p-4">
              <header className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">{scenario.name}</h3>
                <span className="text-xs uppercase tracking-wide text-gray-500">
                  {scenario.enterprise_value ? formatCurrency(scenario.enterprise_value, 'GBP') : 'N/A'}
                </span>
              </header>
              {scenario.description && <p className="mt-2 text-sm text-gray-600">{scenario.description}</p>}
              <details className="mt-3 rounded-lg border border-gray-200 p-3">
                <summary className="cursor-pointer text-sm font-medium text-gray-900">Assumptions</summary>
                <pre className="mt-2 whitespace-pre-wrap text-xs text-gray-600">
                  {JSON.stringify(scenario.assumptions, null, 2)}
                </pre>
              </details>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

const RangeValue = ({ label, value }: { label: string; value: number | null }) => (
  <div className="rounded-lg border border-gray-200 p-4 text-center">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-lg font-semibold text-gray-900">
      {value != null ? formatCurrency(value, 'GBP') : 'N/A'}
    </p>
  </div>
)

const ExportsView = ({ dealId, valuationId }: { dealId: string; valuationId: string }) => {
  const queryClient = useQueryClient()
  const [exportType, setExportType] = useState<'pdf' | 'excel'>('pdf')
  const [exportFormat, setExportFormat] = useState<string | null>('summary')

  const { mutate, data, isPending, isSuccess } = useMutation({
    mutationFn: () => triggerExport(dealId, valuationId, exportType, exportFormat),
    onSuccess: (response: ValuationExportResponse) => {
      queryClient.invalidateQueries({ queryKey: ['valuations', dealId, valuationId, 'exports'] })
      return response
    },
  })

  return (
    <div className="space-y-6">
      <SectionCard title="Generate Report">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Export Type</label>
            <select
              value={exportType}
              onChange={(event) => setExportType(event.target.value as 'pdf' | 'excel')}
              className="mt-1 w-48 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            >
              <option value="pdf">PDF Report</option>
              <option value="excel">Excel Workbook</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Export Format</label>
            <select
              value={exportFormat ?? ''}
              onChange={(event) => setExportFormat(event.target.value || null)}
              className="mt-1 w-64 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            >
              <option value="summary">Executive Summary</option>
              <option value="detailed">Detailed Model</option>
              <option value="full_model">Full Model</option>
              <option value="">Custom / Not specified</option>
            </select>
          </div>
          <button
            type="button"
            onClick={() => mutate()}
            disabled={isPending}
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? 'Queuing export...' : 'Queue Export'}
          </button>
          {isSuccess && data && (
            <p className="text-sm text-emerald-700">
              Export queued successfully. Task ID: <span className="font-semibold">{data.task_id}</span>
            </p>
          )}
        </div>
      </SectionCard>
    </div>
  )
}

const TABS = ['Summary', 'Comparables', 'Precedents', 'Scenarios', 'Exports'] as const

type TabKey = (typeof TABS)[number]

export const ValuationSuite = () => {
  const { dealId, valuationId } = useParams<{ dealId: string; valuationId: string }>()
  const [activeTab, setActiveTab] = useState<TabKey>('Summary')

  const tabContent = useMemo(() => {
    if (!dealId || !valuationId) {
      return <p className="text-sm text-gray-600">Invalid valuation route.</p>
    }

    switch (activeTab) {
      case 'Summary':
        return <SummaryView dealId={dealId} valuationId={valuationId} />
      case 'Comparables':
        return <ComparablesView dealId={dealId} valuationId={valuationId} />
      case 'Precedents':
        return <PrecedentsView dealId={dealId} valuationId={valuationId} />
      case 'Scenarios':
        return <ScenariosView dealId={dealId} valuationId={valuationId} />
      case 'Exports':
        return <ExportsView dealId={dealId} valuationId={valuationId} />
      default:
        return null
    }
  }, [activeTab, dealId, valuationId])

  if (!dealId || !valuationId) {
    return (
      <div className="px-6 py-8">
        <SectionCard title="Valuation">
          <p className="text-sm text-gray-600">Deal or valuation ID missing from route.</p>
        </SectionCard>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="flex flex-col gap-4 border-b border-gray-200 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-indigo-600">Valuation Suite</p>
            <h1 className="text-3xl font-bold text-gray-900">Deal Valuation Workspace</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage DCF, comparable companies, precedent transactions, and scenario analysis in one workspace.
            </p>
          </div>
        </header>

        <nav className="mt-6 flex flex-wrap gap-3">
          {TABS.map((tab) => (
            <TabButton key={tab} label={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)} />
          ))}
        </nav>

        <section className="mt-6 space-y-6">{tabContent}</section>
      </div>
    </main>
  )
}


