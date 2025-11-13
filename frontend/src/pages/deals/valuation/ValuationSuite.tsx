import { useMemo, useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
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
  getExportStatus,
  createValuation,
  addComparableCompany,
  createScenario,
  addPrecedentTransaction,
} from '../../../services/api/valuations'

// Import types separately
import type {
  MonteCarloRequest,
  ValuationExportResponse,
  ValuationExportLogEntry,
  ComparableSummaryMetrics,
  ValuationCreateRequest,
  ScenarioCreateRequest,
  PrecedentTransaction,
} from '../../../services/api/valuations'

import { formatCurrency } from '../../../services/api/deals'
import { Spinner as LoadingSpinner } from '../../../components/ui'

const skeletonClass = 'animate-pulse rounded bg-gray-200 h-4'

type ValuationFormState = {
  discountRate: string
  terminalCashFlow: string
  forecastYears: string
  terminalGrowthRate: string
  netDebt: string
}

const DEFAULT_VALUATION_FORM: ValuationFormState = {
  discountRate: '12',
  terminalCashFlow: '1200000',
  forecastYears: '5',
  terminalGrowthRate: '3',
  netDebt: '0',
}

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
    type="button"
    role="tab"
    aria-selected={active}
    tabIndex={active ? 0 : -1}
    onClick={onClick}
    className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
      active ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
    }`}
  >
    {label}
  </button>
)

const SummaryView = ({ dealId, valuationId }: { dealId: string; valuationId: string }) => {
  const queryClient = useQueryClient()
  const {
    data: valuations,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['valuations', dealId],
    queryFn: () => listValuations(dealId),
  })

  const currentValuation = useMemo(() => {
    if (!valuations || valuations.length === 0) {
      return undefined
    }
    return valuations.find((valuation) => valuation.id === valuationId) ?? valuations[0]
  }, [valuations, valuationId])

  const currentValuationId = currentValuation?.id

  const { data: scenarioSummary, isPending: isScenarioSummaryPending } = useQuery({
    queryKey: ['valuations', dealId, currentValuationId, 'scenarios', 'summary'],
    queryFn: () => getScenarioSummary(dealId, currentValuationId as string),
    enabled: Boolean(currentValuationId),
  })

  const [formValues, setFormValues] = useState<ValuationFormState>(DEFAULT_VALUATION_FORM)
  const [formError, setFormError] = useState<string | null>(null)
  const [formMessage, setFormMessage] = useState<string | null>(null)

  const createValuationMutation = useMutation({
    mutationFn: (payload: ValuationCreateRequest) => createValuation(dealId, payload),
    onSuccess: () => {
      setFormValues(DEFAULT_VALUATION_FORM)
      setFormError(null)
      setFormMessage('Valuation saved successfully.')
      queryClient.invalidateQueries({ queryKey: ['valuations', dealId] })
      void refetch()
    },
    onError: () => {
      setFormMessage(null)
      setFormError('Unable to save valuation. Please try again.')
    },
  })

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setFormValues((previous) => ({ ...previous, [name]: value }))
  }

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)
    setFormMessage(null)

    const discountRateValue = Number(formValues.discountRate)
    const terminalCashFlowValue = Number(formValues.terminalCashFlow)

    if (Number.isNaN(discountRateValue) || Number.isNaN(terminalCashFlowValue)) {
      setFormError('Please provide numerical values for discount rate and terminal cash flow.')
      return
    }

    const forecastYearsValue = Math.max(1, Number(formValues.forecastYears) || 5)
    const terminalGrowthRateValue =
      formValues.terminalGrowthRate.trim() === '' ? null : Number(formValues.terminalGrowthRate)

    if (terminalGrowthRateValue !== null && Number.isNaN(terminalGrowthRateValue)) {
      setFormError('Terminal growth rate must be a number if provided.')
      return
    }

    const step = terminalCashFlowValue / (forecastYearsValue + 1)
    const cashFlows = Array.from({ length: forecastYearsValue }, (_, index) =>
      Number(((index + 1) * step).toFixed(2)),
    )

    const payload: ValuationCreateRequest = {
      forecast_years: forecastYearsValue,
      discount_rate: discountRateValue / 100,
      terminal_method: 'gordon_growth',
      terminal_cash_flow: terminalCashFlowValue,
      'cash_flows': cashFlows,
      net_debt: Number(formValues.netDebt || 0),
    }

    if (terminalGrowthRateValue !== null) {
      payload.terminal_growth_rate = terminalGrowthRateValue / 100
    }

    createValuationMutation.mutate(payload)
  }

  const createForm = (
    <SectionCard title="Create New Valuation">
      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleFormSubmit} noValidate>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700" htmlFor="discountRate">
            Discount Rate (%)
          </label>
          <input
            id="discountRate"
            name="discountRate"
            type="number"
            step="0.1"
            value={formValues.discountRate}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700" htmlFor="terminalCashFlow">
            Terminal Cash Flow (£)
          </label>
          <input
            id="terminalCashFlow"
            name="terminalCashFlow"
            type="number"
            step="1000"
            value={formValues.terminalCashFlow}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700" htmlFor="forecastYears">
            Forecast Years
          </label>
          <input
            id="forecastYears"
            name="forecastYears"
            type="number"
            min="1"
            max="10"
            value={formValues.forecastYears}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700" htmlFor="terminalGrowthRate">
            Terminal Growth Rate (%)
          </label>
          <input
            id="terminalGrowthRate"
            name="terminalGrowthRate"
            type="number"
            step="0.1"
            value={formValues.terminalGrowthRate}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700" htmlFor="netDebt">
            Net Debt (£)
          </label>
          <input
            id="netDebt"
            name="netDebt"
            type="number"
            step="1000"
            value={formValues.netDebt}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-end md:col-span-2">
          <button
            type="submit"
            disabled={createValuationMutation.isPending}
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createValuationMutation.isPending ? 'Saving…' : 'Save Valuation'}
          </button>
        </div>
        {formError && (
          <p className="md:col-span-2 text-sm text-red-600" role="alert">
            {formError}
          </p>
        )}
        {formMessage && (
          <p className="md:col-span-2 text-sm text-emerald-700" role="status" aria-live="polite">
            {formMessage}
          </p>
        )}
      </form>
    </SectionCard>
  )

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-4 py-6" role="status" aria-label="Loading valuations">
        <LoadingSpinner />
        <div className="w-full space-y-3">
          <div className={`${skeletonClass} w-32`}></div>
          <div className={`${skeletonClass} w-full`}></div>
          <div className={`${skeletonClass} w-3/4`}></div>
        </div>
      </div>
    )
  }

  if (isError) {
    const statusCode =
      (error as { response?: { status?: number } } | undefined)?.response?.status ??
      (error as { status?: number } | undefined)?.status ??
      (error as { statusCode?: number } | undefined)?.statusCode

    if (statusCode === 403) {
      const responseDetail =
        (error as { response?: { data?: unknown } } | undefined)?.response?.data ??
        (error as { detail?: unknown } | undefined)?.detail

      let upgradeMessage: string | null = null
      let upgradeCtaUrl = '/pricing'
      let requiredTierLabel: string | null = null

      if (responseDetail) {
        if (typeof responseDetail === 'string') {
          upgradeMessage = responseDetail
        } else if (typeof responseDetail === 'object' && responseDetail !== null) {
          const detailObject =
            'detail' in responseDetail && typeof (responseDetail as { detail?: unknown }).detail !== 'undefined'
              ? (responseDetail as { detail?: unknown }).detail
              : responseDetail

          if (typeof detailObject === 'string') {
            upgradeMessage = detailObject
          } else if (typeof detailObject === 'object' && detailObject !== null) {
            const detailRecord = detailObject as Record<string, unknown>
            if (typeof detailRecord.message === 'string') {
              upgradeMessage = detailRecord.message
            }
            if (typeof detailRecord.upgrade_cta_url === 'string') {
              upgradeCtaUrl = detailRecord.upgrade_cta_url
            }
            if (typeof detailRecord.required_tier_label === 'string') {
              requiredTierLabel = detailRecord.required_tier_label
            }
          }
        }
      }

      const requiredTierText = requiredTierLabel ?? 'Growth'
      const displayUpgradeMessage =
        upgradeMessage ?? 'Please upgrade your subscription to unlock valuation analytics and exports.'

      return (
        <div className="space-y-6">
          <SectionCard title="Upgrade Required">
            <div className="space-y-3 text-sm text-gray-600">
              <p>The valuation workspace is available to {requiredTierText} tier and above.</p>
              <p>{displayUpgradeMessage}</p>
              <Link
                to={upgradeCtaUrl}
                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
              >
                View pricing plans
              </Link>
            </div>
          </SectionCard>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {createForm}
        <SectionCard title="Valuations">
          <div className="space-y-3 text-sm text-gray-600">
            <p>We couldn’t load valuations for this deal. Please retry.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
            >
              Retry
            </button>
          </div>
        </SectionCard>
      </div>
    )
  }

  if (!valuations || valuations.length === 0) {
    return (
      <div className="space-y-6">
        {createForm}
        <SectionCard title="Valuations">
          <p className="text-sm text-gray-600">No valuations created yet. Save your first valuation to populate this workspace.</p>
        </SectionCard>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {createForm}
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

      {currentValuation && (
        <SectionCard title="Monte Carlo Simulation">
          <MonteCarloPanel dealId={dealId} valuationId={currentValuation.id} />
        </SectionCard>
      )}

      {currentValuation && (
        <SectionCard title="Analytics Summary">
          {isScenarioSummaryPending ? (
            <div className="flex items-center gap-2 text-sm text-gray-600" role="status">
              <LoadingSpinner />
              <span>Fetching scenario analytics…</span>
            </div>
          ) : scenarioSummary ? (
            <div
              className="grid grid-cols-1 gap-4 md:grid-cols-5"
              data-testid="analytics-metrics-grid"
            >
              <AnalyticsMetric label="Scenarios Analysed" value={scenarioSummary.count} />
              <RangeValue label="EV Median" value={scenarioSummary.enterprise_value_range.median} />
              <RangeValue label="Equity Median" value={scenarioSummary.equity_value_range.median} />
              <AnalyticsMetric
                label="EV Range"
                value={
                  scenarioSummary.enterprise_value_range.min != null &&
                  scenarioSummary.enterprise_value_range.max != null
                    ? `${formatCurrency(scenarioSummary.enterprise_value_range.min, 'GBP')} – ${formatCurrency(
                        scenarioSummary.enterprise_value_range.max,
                        'GBP',
                      )}`
                    : 'N/A'
                }
                isPlain
              />
              <AnalyticsMetric
                label="Equity Range"
                value={
                  scenarioSummary.equity_value_range.min != null && scenarioSummary.equity_value_range.max != null
                    ? `${formatCurrency(scenarioSummary.equity_value_range.min, 'GBP')} – ${formatCurrency(
                        scenarioSummary.equity_value_range.max,
                        'GBP',
                      )}`
                    : 'N/A'
                }
                isPlain
              />
            </div>
          ) : (
            <p className="text-sm text-gray-600">Create valuation scenarios to unlock analytics insights.</p>
          )}
        </SectionCard>
      )}
    </div>
  )
}

const MonteCarloPanel = ({ dealId, valuationId }: { dealId: string; valuationId: string }) => {
  const queryClient = useQueryClient()
  const [iterationsInput, setIterationsInput] = useState('500')
  const [seed, setSeed] = useState<number | ''>('')

  const { data: simulation, isPending, mutate } = useMutation({
    mutationFn: (payload: MonteCarloRequest) => runMonteCarlo(dealId, valuationId, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(['valuations', dealId, valuationId, 'monte-carlo'], data)
    },
  })

  const handleRun = () => {
    const parsedIterations = Number.parseInt(iterationsInput, 10)
    const safeIterations = Number.isNaN(parsedIterations) ? 500 : Math.max(50, parsedIterations)
    setIterationsInput(safeIterations.toString())

    const payload: MonteCarloRequest = { iterations: safeIterations }
    if (seed !== '') payload.seed = Number(seed)
    mutate(payload)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="monte-carlo-iterations">
            Iterations
          </label>
          <input
            id="monte-carlo-iterations"
            type="number"
            min={50}
            step={50}
            value={iterationsInput}
            onChange={(event) => setIterationsInput(event.target.value)}
            className="mt-1 w-36 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="monte-carlo-seed">
            Seed (optional)
          </label>
          <input
            id="monte-carlo-seed"
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
  const queryClient = useQueryClient()
  const { data: comparables, isLoading } = useQuery({
    queryKey: ['valuations', dealId, valuationId, 'comparables'],
    queryFn: () => listComparableCompanies(dealId, valuationId),
  })
  const { data: summary } = useQuery({
    queryKey: ['valuations', dealId, valuationId, 'comparables', 'summary'],
    queryFn: () => getComparableSummary(dealId, valuationId),
    enabled: !!comparables?.length,
  })

  const [formData, setFormData] = useState({
    companyName: '',
    evRevenue: '',
    evEbitda: '',
    weight: '1.00',
    isOutlier: false,
    notes: '',
  })

  const resetForm = () =>
    setFormData({ companyName: '', evRevenue: '', evEbitda: '', weight: '1.00', isOutlier: false, notes: '' })

  const toNullableNumber = (value: string) => {
    if (value.trim() === '') return null
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: () =>
      addComparableCompany(dealId, valuationId, {
        company_name: formData.companyName.trim(),
        ev_revenue_multiple: toNullableNumber(formData.evRevenue) ?? undefined,
        ev_ebitda_multiple: toNullableNumber(formData.evEbitda) ?? undefined,
        weight: Number(formData.weight) || 0,
        is_outlier: formData.isOutlier ? 'true' : 'false',
        notes: formData.notes ? formData.notes.trim() : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['valuations', dealId, valuationId, 'comparables'] })
      queryClient.invalidateQueries({ queryKey: ['valuations', dealId, valuationId, 'comparables', 'summary'] })
      resetForm()
    },
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formData.companyName.trim()) {
      return
    }
    await mutateAsync()
  }

  if (isLoading) {
    return <p className="text-sm text-gray-600">Loading comparable companies...</p>
  }

  return (
    <div className="space-y-6">
      <SectionCard title="Add Comparable Company">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="comparable-company-name" className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              id="comparable-company-name"
              type="text"
              value={formData.companyName}
              onChange={(event) => setFormData((current) => ({ ...current, companyName: event.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="comparable-ev-revenue" className="block text-sm font-medium text-gray-700">
              EV/Revenue Multiple
            </label>
            <input
              id="comparable-ev-revenue"
              type="number"
              step="0.1"
              value={formData.evRevenue}
              onChange={(event) => setFormData((current) => ({ ...current, evRevenue: event.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              placeholder="e.g. 4.5"
            />
          </div>

          <div>
            <label htmlFor="comparable-ev-ebitda" className="block text-sm font-medium text-gray-700">
              EV/EBITDA
            </label>
            <input
              id="comparable-ev-ebitda"
              type="number"
              step="0.1"
              value={formData.evEbitda}
              onChange={(event) => setFormData((current) => ({ ...current, evEbitda: event.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="comparable-weight" className="block text-sm font-medium text-gray-700">
              Weight
            </label>
            <input
              id="comparable-weight"
              type="number"
              min="0"
              step="0.1"
              value={formData.weight}
              onChange={(event) => setFormData((current) => ({ ...current, weight: event.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="comparable-outlier"
              type="checkbox"
              checked={formData.isOutlier}
              onChange={(event) => setFormData((current) => ({ ...current, isOutlier: event.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="comparable-outlier" className="text-sm text-gray-700">
              Mark as outlier
            </label>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="comparable-notes" className="block text-sm font-medium text-gray-700">
              Notes (optional)
            </label>
            <textarea
              id="comparable-notes"
              value={formData.notes}
              onChange={(event) => setFormData((current) => ({ ...current, notes: event.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>

          {error && (
            <p className="md:col-span-2 text-sm text-red-600" role="alert">
              Unable to add comparable company. Please try again.
            </p>
          )}

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? 'Saving...' : 'Add Comparable'}
            </button>
          </div>
        </form>
      </SectionCard>

      {summary && (
        <SectionCard title="Implied Valuation Range">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SummaryMetricCard title="EV / Revenue" metrics={summary.ev_revenue} />
            <SummaryMetricCard title="EV / EBITDA" metrics={summary.ev_ebitda} />
          </div>
        </SectionCard>
      )}

      <SectionCard title="Comparable Companies">
        {(!comparables || comparables.length === 0) && (
          <p className="text-sm text-gray-600">No comparable companies added yet.</p>
        )}
        <div className="grid grid-cols-1 gap-4">
          {comparables?.map((comparable) => (
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
  const queryClient = useQueryClient()
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['valuations', dealId, valuationId, 'precedents'],
    queryFn: () => listPrecedentTransactions(dealId, valuationId),
  })

  const { data: summary } = useQuery({
    queryKey: ['valuations', dealId, valuationId, 'precedents', 'summary'],
    queryFn: () => getPrecedentSummary(dealId, valuationId),
    enabled: !!transactions?.length,
  })

  const [formData, setFormData] = useState({
    targetCompany: '',
    acquirerCompany: '',
    evEbitda: '',
    evRevenue: '',
    weight: '1.00',
    announcementDate: '',
    notes: '',
  })

  const resetForm = () =>
    setFormData({ targetCompany: '', acquirerCompany: '', evEbitda: '', evRevenue: '', weight: '1.00', announcementDate: '', notes: '' })

  const toNullableNumber = (value: string) => {
    if (value.trim() === '') return null
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: () =>
      addPrecedentTransaction(dealId, valuationId, {
        target_company: formData.targetCompany.trim(),
        acquirer_company: formData.acquirerCompany.trim(),
        ev_ebitda_multiple: toNullableNumber(formData.evEbitda) ?? undefined,
        ev_revenue_multiple: toNullableNumber(formData.evRevenue) ?? undefined,
        weight: Number(formData.weight) || 1.0,
        announcement_date: formData.announcementDate || undefined,
        notes: formData.notes ? formData.notes.trim() : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['valuations', dealId, valuationId, 'precedents'] })
      queryClient.invalidateQueries({ queryKey: ['valuations', dealId, valuationId, 'precedents', 'summary'] })
      resetForm()
    },
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formData.targetCompany.trim() || !formData.acquirerCompany.trim()) {
      return
    }
    await mutateAsync()
  }

  if (isLoading) {
    return <p className="text-sm text-gray-600">Loading precedent transactions...</p>
  }

  return (
    <div className="space-y-6">
      <SectionCard title="Add Precedent Transaction">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="precedent-target-company" className="block text-sm font-medium text-gray-700">
              Target Company
            </label>
            <input
              id="precedent-target-company"
              type="text"
              value={formData.targetCompany}
              onChange={(event) => setFormData((current) => ({ ...current, targetCompany: event.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="precedent-acquirer-company" className="block text-sm font-medium text-gray-700">
              Acquirer Company
            </label>
            <input
              id="precedent-acquirer-company"
              type="text"
              value={formData.acquirerCompany}
              onChange={(event) => setFormData((current) => ({ ...current, acquirerCompany: event.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="precedent-ev-ebitda" className="block text-sm font-medium text-gray-700">
              EV/EBITDA
            </label>
            <input
              id="precedent-ev-ebitda"
              type="number"
              step="0.1"
              value={formData.evEbitda}
              onChange={(event) => setFormData((current) => ({ ...current, evEbitda: event.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              placeholder="e.g. 8.5"
            />
          </div>

          <div>
            <label htmlFor="precedent-ev-revenue" className="block text-sm font-medium text-gray-700">
              EV/Revenue Multiple
            </label>
            <input
              id="precedent-ev-revenue"
              type="number"
              step="0.1"
              value={formData.evRevenue}
              onChange={(event) => setFormData((current) => ({ ...current, evRevenue: event.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              placeholder="e.g. 4.5"
            />
          </div>

          <div>
            <label htmlFor="precedent-weight" className="block text-sm font-medium text-gray-700">
              Weight
            </label>
            <input
              id="precedent-weight"
              type="number"
              min="0"
              step="0.1"
              value={formData.weight}
              onChange={(event) => setFormData((current) => ({ ...current, weight: event.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="precedent-announcement-date" className="block text-sm font-medium text-gray-700">
              Announcement Date
            </label>
            <input
              id="precedent-announcement-date"
              type="date"
              value={formData.announcementDate}
              onChange={(event) => setFormData((current) => ({ ...current, announcementDate: event.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="precedent-notes" className="block text-sm font-medium text-gray-700">
              Notes (optional)
            </label>
            <textarea
              id="precedent-notes"
              value={formData.notes}
              onChange={(event) => setFormData((current) => ({ ...current, notes: event.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>

          {error && (
            <p className="md:col-span-2 text-sm text-red-600" role="alert">
              Unable to add precedent transaction. Please try again.
            </p>
          )}

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? 'Saving...' : 'Add Precedent'}
            </button>
          </div>
        </form>
      </SectionCard>

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
        {(!transactions || transactions.length === 0) && (
          <p className="text-sm text-gray-600">No precedent transactions recorded yet.</p>
        )}
        <div className="space-y-4">
          {transactions?.map((transaction: PrecedentTransaction) => (
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
  const queryClient = useQueryClient()
  const { data: scenarios, isLoading } = useQuery({
    queryKey: ['valuations', dealId, valuationId, 'scenarios'],
    queryFn: () => listScenarios(dealId, valuationId),
  })

  const { data: summary } = useQuery({
    queryKey: ['valuations', dealId, valuationId, 'scenarios', 'summary'],
    queryFn: () => getScenarioSummary(dealId, valuationId),
    enabled: !!scenarios?.length,
  })

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    assumptions: '{\n  "revenue_growth": 0.05\n}',
  })
  const [formError, setFormError] = useState<string | null>(null)
  const [formMessage, setFormMessage] = useState<string | null>(null)

  const handleScenarioFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target
    setFormValues((previous) => ({ ...previous, [name]: value }))
  }

  const resetForm = () => {
    setFormValues({ name: '', description: '', assumptions: '{\n  "revenue_growth": 0.05\n}' })
  }

  const scenarioMutation = useMutation({
    mutationFn: (payload: ScenarioCreateRequest) => createScenario(dealId, valuationId, payload),
    onSuccess: () => {
      setFormMessage('Scenario saved successfully.')
      setFormError(null)
      resetForm()
      setIsFormOpen(false)
      queryClient.invalidateQueries({ queryKey: ['valuations', dealId, valuationId, 'scenarios'] })
      queryClient.invalidateQueries({
        queryKey: ['valuations', dealId, valuationId, 'scenarios', 'summary'],
      })
    },
    onError: () => {
      setFormMessage(null)
      setFormError('Unable to save scenario. Please try again.')
    },
  })

  const handleScenarioSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)
    setFormMessage(null)

    if (!formValues.name.trim()) {
      setFormError('Scenario name is required.')
      return
    }

    const assumptionText = formValues.assumptions.trim()
    let parsedAssumptions: Record<string, unknown> = {}

    if (assumptionText.length > 0) {
      try {
        const candidate = JSON.parse(assumptionText)
        if (typeof candidate !== 'object' || candidate === null || Array.isArray(candidate)) {
          setFormError('Assumptions must be a JSON object.')
          return
        }
        parsedAssumptions = candidate as Record<string, unknown>
      } catch (error) {
        setFormError('Assumptions must be valid JSON.')
        return
      }
    }

    const payload: ScenarioCreateRequest = {
      name: formValues.name.trim(),
      assumptions: parsedAssumptions,
    }

    if (formValues.description.trim()) {
      payload.description = formValues.description.trim()
    }

    scenarioMutation.mutate(payload)
  }

  if (isLoading) {
    return <p className="text-sm text-gray-600">Loading scenarios...</p>
  }

  const hasScenarios = Array.isArray(scenarios) && scenarios.length > 0

  return (
    <div className="space-y-6">
      <SectionCard title="Scenario Management">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-gray-600">
              Model alternative forecasts, sensitivities, and downside cases to stress-test valuations.
            </p>
            {!isFormOpen && (
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(true)
                  setFormError(null)
                  setFormMessage(null)
                }}
                className="inline-flex items-center rounded-md border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-100"
              >
                Add Scenario
              </button>
            )}
          </div>

          {formMessage && (
            <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700" role="status">
              {formMessage}
            </p>
          )}
          {formError && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {formError}
            </p>
          )}

          {isFormOpen && (
            <form className="space-y-4" onSubmit={handleScenarioSubmit} noValidate>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="scenario-name">
                    Scenario Name
                  </label>
                  <input
                    id="scenario-name"
                    name="name"
                    value={formValues.name}
                    onChange={handleScenarioFieldChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    placeholder="e.g. Upside Case"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="scenario-description">
                    Description
                  </label>
                  <input
                    id="scenario-description"
                    name="description"
                    value={formValues.description}
                    onChange={handleScenarioFieldChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    placeholder="Optional summary"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700" htmlFor="scenario-assumptions">
                  Assumptions JSON
                </label>
                <textarea
                  id="scenario-assumptions"
                  name="assumptions"
                  value={formValues.assumptions}
                  onChange={handleScenarioFieldChange}
                  rows={6}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  spellCheck={false}
                />
                <p className="text-xs text-gray-500">
                  Provide a JSON object of assumption overrides (e.g. <code>{'{ "revenue_growth": 0.12 }'}</code>).
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={scenarioMutation.isPending}
                  className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {scenarioMutation.isPending ? 'Saving…' : 'Save Scenario'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false)
                    setFormError(null)
                    setFormMessage(null)
                  }}
                  className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </SectionCard>

      {summary && (
        <SectionCard title="Enterprise Value Range">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <RangeValue label="Min" value={summary.enterprise_value_range.min} />
            <RangeValue label="Median" value={summary.enterprise_value_range.median} />
            <RangeValue label="Max" value={summary.enterprise_value_range.max} />
          </div>
        </SectionCard>
      )}

      {hasScenarios && scenarios && scenarios.length > 0 && (
        <SectionCard title="Scenario Comparison">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scenarios.map(s => ({
              name: s.name,
              'Enterprise Value': s.enterprise_value ? s.enterprise_value / 1000000 : 0
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Enterprise Value (£M)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value: number) => [`£${value.toFixed(2)}M`, 'Enterprise Value']} />
              <Legend />
              <Bar dataKey="Enterprise Value" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      )}

      <SectionCard title="Scenario Details">
        {hasScenarios ? (
          <div className="grid grid-cols-1 gap-4">
            {scenarios!.map((scenario) => (
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
        ) : (
          <p className="text-sm text-gray-600">No scenarios created yet.</p>
        )}
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

const AnalyticsMetric = ({
  label,
  value,
  isPlain = false,
}: {
  label: string
  value: number | string
  isPlain?: boolean
}) => {
  const displayValue = typeof value === 'number' && !isPlain ? value.toLocaleString() : value

  return (
    <div className="rounded-lg border border-gray-200 p-4 text-center">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-900">{displayValue}</p>
    </div>
  )
}

const ExportsView = ({ dealId, valuationId }: { dealId: string; valuationId: string }) => {
  const queryClient = useQueryClient()
  const [exportType, setExportType] = useState<'pdf' | 'excel'>('pdf')
  const [exportFormat, setExportFormat] = useState<string | null>('summary')

  const [lastExport, setLastExport] = useState<ValuationExportResponse | null>(null)
  const [exportStatus, setExportStatus] = useState<ValuationExportLogEntry | null>(null)
  const [exportError, setExportError] = useState<string | null>(null)
  const pollingIntervalRef = useRef<number | null>(null)

  const { mutate, isPending } = useMutation({
    mutationFn: () => triggerExport(dealId, valuationId, exportType, exportFormat),
    onMutate: () => {
      setExportError(null)
      setLastExport(null)
      setExportStatus(null)
      // Clear any existing polling
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    },
    onSuccess: (response: ValuationExportResponse) => {
      setLastExport(response)
      queryClient.invalidateQueries({ queryKey: ['valuations', dealId, valuationId, 'exports'] })
      // Start polling for status
      if (response.task_id) {
        pollExportStatus(response.task_id)
      }
    },
    onError: () => {
      setExportError('Unable to queue export. Please try again.')
    },
  })

  const pollExportStatus = async (taskId: string) => {
    const checkStatus = async () => {
      try {
        const status = await getExportStatus(dealId, valuationId, taskId)
        setExportStatus(status)

        // Stop polling if export is complete or failed
        if (status.status === 'complete' || status.status === 'failed') {
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current)
            pollingIntervalRef.current = null
          }
          return false // Signal to stop polling
        }
        return true // Continue polling
      } catch (error) {
        console.error('Failed to check export status:', error)
        // Continue polling on error (might be transient)
        return true
      }
    }

    // Check immediately
    const shouldContinue = await checkStatus()

    // Poll every 2 seconds if still processing
    if (shouldContinue) {
      pollingIntervalRef.current = window.setInterval(async () => {
        const continuePolling = await checkStatus()
        if (!continuePolling && pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current)
          pollingIntervalRef.current = null
        }
      }, 2000)
    }
  }

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [])

  const formatLabel = (value: string | null) => {
    if (!value) {
      return 'custom'
    }
    return value.replace(/_/g, ' ')
  }

  const getStatusDisplay = () => {
    if (!exportStatus && !lastExport) {
      return null
    }

    const status = exportStatus?.status || lastExport?.status || 'queued'
    const taskId = exportStatus?.task_id || lastExport?.task_id

    if (status === 'queued') {
      return (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700" role="status">
          <div className="flex items-center gap-2">
            <LoadingSpinner className="h-4 w-4" />
            <span>
              Export queued: {exportStatus?.export_type || lastExport?.export_type} ({formatLabel(exportStatus?.export_format || lastExport?.export_format)}) · Task ID {taskId}
            </span>
          </div>
        </div>
      )
    }

    if (status === 'processing') {
      return (
        <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700" role="status">
          <div className="flex items-center gap-2">
            <LoadingSpinner className="h-4 w-4" />
            <span>Processing export... This may take a few moments.</span>
          </div>
        </div>
      )
    }

    if (status === 'complete' && exportStatus?.download_url) {
      const fileSize = exportStatus.file_size_bytes
        ? ` (${(exportStatus.file_size_bytes / 1024 / 1024).toFixed(2)} MB)`
        : ''
      return (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700" role="status">
          <div className="flex items-center justify-between">
            <span>Export complete!{fileSize}</span>
            <a
              href={exportStatus.download_url}
              download
              className="ml-4 font-medium text-emerald-800 underline hover:text-emerald-900"
            >
              Download
            </a>
          </div>
        </div>
      )
    }

    if (status === 'failed') {
      return (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          <div>
            <strong>Export failed.</strong>
            {exportStatus?.error_message && <span className="ml-2">{exportStatus.error_message}</span>}
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className="space-y-6">
      <SectionCard title="Generate Report">
        <div className="space-y-4">
          <div>
            <label htmlFor="export-format" className="block text-sm font-medium text-gray-700">Export Format</label>
            <select
              id="export-format"
              value={exportType}
              onChange={(event) => setExportType(event.target.value as 'pdf' | 'excel')}
              className="mt-1 w-48 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            >
              <option value="pdf">PDF</option>
              <option value="excel">DOCX</option>
              <option value="html">HTML</option>
            </select>
          </div>
          <div>
            <label htmlFor="export-template" className="block text-sm font-medium text-gray-700">Export Template</label>
            <select
              id="export-template"
              value={exportFormat ?? ''}
              onChange={(event) => setExportFormat(event.target.value || null)}
              className="mt-1 w-64 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            >
              <option value="summary">Executive Summary</option>
              <option value="detailed">Detailed</option>
              <option value="custom">Custom</option>
              <option value="">Not specified</option>
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
          {exportError && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {exportError}
            </p>
          )}
          {getStatusDisplay()}
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

        <nav className="mt-6 flex flex-wrap gap-3" role="tablist" aria-label="Valuation suite sections">
          {TABS.map((tab) => (
            <TabButton key={tab} label={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)} />
          ))}
        </nav>

        <section className="mt-6 space-y-6">{tabContent}</section>
      </div>
    </main>
  )
}






