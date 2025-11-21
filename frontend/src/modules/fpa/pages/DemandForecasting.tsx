import React, { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CloudRain, Download, LineChart } from 'lucide-react'

import { DashboardLayout } from '../components/DashboardLayout'
import { fpaApi, type DemandForecast, type DemandForecastCreate } from '../services/fpaApi'

const DEFAULT_FORM: DemandForecastCreate = {
  name: 'Week 47 Ramp',
  period: '2025-W47',
  forecasted_demand: 1200,
  confidence_level: 0.85,
  assumptions: { channel: 'OEM' },
}

const ForecastCard = ({ forecast }: { forecast: DemandForecast }) => {
  const actualDelta = forecast.actual_demand ? forecast.actual_demand - forecast.forecasted_demand : null
  return (
    <div className='rounded-xl border border-slate-200 p-4 shadow-sm'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm text-slate-500'>{forecast.period}</p>
          <h3 className='text-lg font-semibold text-slate-900'>{forecast.name || forecast.period}</h3>
        </div>
        <span className='text-xs font-semibold uppercase tracking-wide text-indigo-600'>Confidence {(forecast.confidence_level * 100).toFixed(0)}%</span>
      </div>
      <div className='mt-4 flex items-baseline gap-3'>
        <p className='text-3xl font-bold text-slate-900'>{forecast.forecasted_demand.toLocaleString()}</p>
        <span className='text-sm text-slate-500'>units</span>
      </div>
      {actualDelta !== null && (
        <p className={`text-sm font-medium ${actualDelta >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
          {actualDelta >= 0 ? '+' : ''}{actualDelta.toLocaleString()} vs actual
        </p>
      )}
    </div>
  )
}

export const DemandForecasting: React.FC = () => {
  const queryClient = useQueryClient()
  const [formState, setFormState] = useState(DEFAULT_FORM)

  const { data: forecasts, isLoading } = useQuery({
    queryKey: ['fpa', 'demand-forecast'],
    queryFn: () => fpaApi.getDemandForecasts(),
  })

  const createForecast = useMutation({
    mutationFn: (payload: DemandForecastCreate) => fpaApi.createDemandForecast(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['fpa', 'demand-forecast'] })
      setFormState(DEFAULT_FORM)
    },
  })

  const summary = useMemo(() => {
    if (!forecasts || forecasts.length === 0) {
      return { avgConfidence: 0, totalForecast: 0 }
    }
    const totalForecast = forecasts.reduce((sum, item) => sum + item.forecasted_demand, 0)
    const avgConfidence = forecasts.reduce((sum, item) => sum + item.confidence_level, 0) / forecasts.length
    return { totalForecast, avgConfidence }
  }, [forecasts])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!formState.period) return
    createForecast.mutate(formState)
  }

  return (
    <DashboardLayout>
      <div className='space-y-8 bg-white p-6 lg:p-8'>
        <header className='space-y-2'>
          <h1 className='text-3xl font-bold text-slate-900'>Demand Forecasting</h1>
          <p className='text-slate-600'>Monte Carlo backed forecasting engine wired into the manufacturing command centre.</p>
        </header>

        <section className='grid gap-4 md:grid-cols-3'>
          <div className='rounded-2xl border border-slate-200 p-4 shadow-sm'>
            <p className='text-sm text-slate-500'>Total Forecast (30d)</p>
            <p className='text-3xl font-bold text-slate-900'>{summary.totalForecast.toLocaleString()} units</p>
          </div>
          <div className='rounded-2xl border border-slate-200 p-4 shadow-sm'>
            <p className='text-sm text-slate-500'>Avg Confidence</p>
            <p className='text-3xl font-bold text-slate-900'>{(summary.avgConfidence * 100).toFixed(1)}%</p>
          </div>
          <div className='rounded-2xl border border-slate-200 p-4 shadow-sm'>
            <p className='text-sm text-slate-500'>Active Forecasts</p>
            <p className='text-3xl font-bold text-slate-900'>{forecasts?.length ?? 0}</p>
          </div>
        </section>

        <section className='rounded-2xl border border-slate-100 p-6 shadow-sm'>
          <div className='mb-4 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <LineChart className='h-5 w-5 text-indigo-600' />
              <h2 className='text-xl font-semibold text-gray-900'>Forecast Timeline</h2>
            </div>
            <button className='inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50'>
              <Download className='h-4 w-4' /> Export CSV
            </button>
          </div>
          {isLoading ? (
            <p className='text-sm text-slate-500'>Loading forecasts…</p>
          ) : (
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {forecasts?.map((forecast) => (
                <ForecastCard key={forecast.id} forecast={forecast} />
              ))}
            </div>
          )}
        </section>

        <section className='grid gap-6 lg:grid-cols-2'>
          <div className='rounded-2xl border border-slate-200 p-6 shadow-sm'>
            <h3 className='text-lg font-semibold text-slate-900'>Create Forecast</h3>
            <form className='mt-4 space-y-4' onSubmit={handleSubmit}>
              <div>
                <label className='text-sm font-medium text-slate-700'>Forecast Name</label>
                <input
                  className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm'
                  value={formState.name ?? ''}
                  onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder='Week 47 Ramp'
                />
              </div>
              <div>
                <label className='text-sm font-medium text-slate-700'>Period (ISO week)</label>
                <input
                  className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm'
                  value={formState.period}
                  onChange={(event) => setFormState((prev) => ({ ...prev, period: event.target.value }))}
                  placeholder='2025-W47'
                />
              </div>
              <div className='grid gap-4 md:grid-cols-2'>
                <div>
                  <label className='text-sm font-medium text-slate-700'>Forecasted Demand</label>
                  <input
                    type='number'
                    className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm'
                    value={formState.forecasted_demand}
                    onChange={(event) => setFormState((prev) => ({ ...prev, forecasted_demand: Number(event.target.value) }))}
                  />
                </div>
                <div>
                  <label className='text-sm font-medium text-slate-700'>Confidence</label>
                  <input
                    type='number'
                    step='0.01'
                    min='0'
                    max='1'
                    className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm'
                    value={formState.confidence_level}
                    onChange={(event) => setFormState((prev) => ({ ...prev, confidence_level: Number(event.target.value) }))}
                  />
                </div>
              </div>
              <button
                type='submit'
                className='w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60'
                disabled={createForecast.isPending}
              >
                {createForecast.isPending ? 'Saving…' : 'Save Forecast'}
              </button>
            </form>
          </div>

          <div className='rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-inner'>
            <div className='flex items-center gap-3'>
              <CloudRain className='h-5 w-5 text-emerald-600' />
              <div>
                <p className='text-xs font-semibold uppercase tracking-wide text-emerald-700'>Signal</p>
                <h3 className='text-lg font-semibold text-emerald-900'>Inventory warning: premium line</h3>
              </div>
            </div>
            <p className='mt-4 text-sm text-emerald-900'>Inventory has dropped below the comfort band for the premium SKU. Consider triggering a replenishment order in the planning run.</p>
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}

export default DemandForecasting
