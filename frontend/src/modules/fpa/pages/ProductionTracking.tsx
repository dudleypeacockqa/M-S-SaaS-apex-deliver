import React, { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Activity, Factory, Timer } from 'lucide-react'

import { DashboardLayout } from '../components/DashboardLayout'
import { fpaApi, type ProductionMetric } from '../services/fpaApi'

const ProductionRow = ({ metric }: { metric: ProductionMetric }) => (
  <tr className='border-b border-slate-100 text-sm'>
    <td className='py-3 text-slate-500'>{new Date(metric.date).toLocaleDateString()}</td>
    <td className='py-3 font-medium text-slate-900'>{metric.units_produced.toLocaleString()}</td>
    <td className='py-3 text-slate-500'>{metric.efficiency.toFixed(1)}%</td>
    <td className='py-3 text-slate-500'>{metric.downtime.toFixed(1)} hrs</td>
  </tr>
)

export const ProductionTracking: React.FC = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['fpa', 'production'],
    queryFn: () => fpaApi.getProductionMetrics(),
  })

  const hasMetrics = (metrics?.length ?? 0) > 0

  const summary = useMemo(() => {
    const items = metrics ?? []
    if (items.length === 0) {
      return { avgEfficiency: 0, avgDowntime: 0, totalUnits: 0 }
    }
    const totalUnits = items.reduce((sum, item) => sum + item.units_produced, 0)
    const avgEfficiency = items.reduce((sum, item) => sum + item.efficiency, 0) / items.length
    const avgDowntime = items.reduce((sum, item) => sum + item.downtime, 0) / items.length
    return { totalUnits, avgEfficiency, avgDowntime }
  }, [metrics])

  return (
    <DashboardLayout>
      <div className='space-y-8 bg-white p-6 lg:p-8'>
        <header className='space-y-2'>
          <h1 className='text-3xl font-bold text-slate-900'>Production Tracking</h1>
          <p className='text-slate-600'>Observe throughput, efficiency, and downtime trends directly from the MES feed.</p>
        </header>

        <section className='grid gap-4 md:grid-cols-3'>
          <div className='rounded-2xl border border-slate-200 p-4 shadow-sm'>
            <p className='text-sm text-slate-500'>Units Produced (period)</p>
            <p className='text-3xl font-bold text-slate-900'>{summary.totalUnits.toLocaleString()}</p>
          </div>
          <div className='rounded-2xl border border-slate-200 p-4 shadow-sm'>
            <p className='text-sm text-slate-500'>Average Efficiency</p>
            <p className='text-3xl font-bold text-slate-900'>{summary.avgEfficiency.toFixed(1)}%</p>
          </div>
          <div className='rounded-2xl border border-slate-200 p-4 shadow-sm'>
            <p className='text-sm text-slate-500'>Average Downtime</p>
            <p className='text-3xl font-bold text-slate-900'>{summary.avgDowntime.toFixed(1)} hrs</p>
          </div>
        </section>

        <section className='rounded-2xl border border-slate-100 p-6 shadow-sm'>
          <div className='mb-4 flex items-center gap-2'>
            <Factory className='h-5 w-5 text-indigo-600' />
            <h2 className='text-xl font-semibold text-gray-900'>Recent production runs</h2>
          </div>
          {isLoading ? (
            <p className='text-sm text-slate-500'>Loading production metrics…</p>
          ) : !hasMetrics ? (
            <p className='text-sm text-slate-500'>No production data available yet. Connect your MES feed to begin tracking throughput.</p>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full'>
                <thead>
                  <tr className='text-left text-xs uppercase tracking-wide text-slate-500'>
                    <th className='pb-3'>Date</th>
                    <th className='pb-3'>Units Produced</th>
                    <th className='pb-3'>Efficiency</th>
                    <th className='pb-3'>Downtime</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics?.map((metric) => (
                    <ProductionRow key={metric.id} metric={metric} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className='grid gap-6 lg:grid-cols-2'>
          <div className='rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-inner'>
            <div className='flex items-center gap-3'>
              <Activity className='h-5 w-5 text-emerald-700' />
              <div>
                <p className='text-xs font-semibold uppercase tracking-wide text-emerald-700'>Automation Signal</p>
                <h3 className='text-lg font-semibold text-emerald-900'>Throughput exceeds plan</h3>
              </div>
            </div>
            <p className='mt-4 text-sm text-emerald-900'>Production cells exceeded plan by 6% for the third consecutive day. Consider accelerating the downstream logistics plan.</p>
          </div>

          <div className='rounded-2xl border border-rose-200 bg-rose-50 p-6 shadow-inner'>
            <div className='flex items-center gap-3'>
              <Timer className='h-5 w-5 text-rose-700' />
              <div>
                <p className='text-xs font-semibold uppercase tracking-wide text-rose-700'>Downtime Alert</p>
                <h3 className='text-lg font-semibold text-rose-900'>Line 4 micro-stops</h3>
              </div>
            </div>
            <p className='mt-4 text-sm text-rose-900'>Line 4 recorded 18 micro-stops in the past shift. Assign a TPM action to inspect feeder sensors.</p>
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}

export default ProductionTracking
