import React, { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ShieldCheck, TrendingDown } from 'lucide-react'

import { DashboardLayout } from '../components/DashboardLayout'
import { fpaApi, type QualityMetric } from '../services/fpaApi'

const QualityRow = ({ metric }: { metric: QualityMetric }) => (
  <tr className='border-b border-slate-100 text-sm'>
    <td className='py-3 text-slate-500'>{new Date(metric.date).toLocaleDateString()}</td>
    <td className='py-3 font-medium text-slate-900'>{metric.pass_rate.toFixed(1)}%</td>
    <td className='py-3 text-slate-500'>{metric.defect_rate.toFixed(1)}%</td>
    <td className='py-3 text-slate-500'>{metric.total_inspections.toLocaleString()}</td>
  </tr>
)

export const QualityControl: React.FC = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['fpa', 'quality'],
    queryFn: () => fpaApi.getQualityMetrics(),
  })

  const summary = useMemo(() => {
    const items = metrics ?? []
    if (items.length === 0) {
      return { avgPassRate: 0, avgDefectRate: 0 }
    }
    const avgPassRate = items.reduce((sum, item) => sum + item.pass_rate, 0) / items.length
    const avgDefectRate = items.reduce((sum, item) => sum + item.defect_rate, 0) / items.length
    return { avgPassRate, avgDefectRate }
  }, [metrics])

  return (
    <DashboardLayout>
      <div className='space-y-8 bg-white p-6 lg:p-8'>
        <header className='space-y-2'>
          <h1 className='text-3xl font-bold text-slate-900'>Quality Control</h1>
          <p className='text-slate-600'>Live quality signal from inline inspection, automated alerts, and corrective action routing.</p>
        </header>

        <section className='grid gap-4 md:grid-cols-2'>
          <div className='rounded-2xl border border-slate-200 p-4 shadow-sm'>
            <p className='text-sm text-slate-500'>Average Pass Rate</p>
            <p className='text-3xl font-bold text-emerald-600'>{summary.avgPassRate.toFixed(1)}%</p>
          </div>
          <div className='rounded-2xl border border-slate-200 p-4 shadow-sm'>
            <p className='text-sm text-slate-500'>Average Defect Rate</p>
            <p className='text-3xl font-bold text-rose-600'>{summary.avgDefectRate.toFixed(1)}%</p>
          </div>
        </section>

        <section className='rounded-2xl border border-slate-100 p-6 shadow-sm'>
          <div className='mb-4 flex items-center gap-2'>
            <ShieldCheck className='h-5 w-5 text-indigo-600' />
            <h2 className='text-xl font-semibold text-gray-900'>Inspection Log</h2>
          </div>
          {isLoading ? (
            <p className='text-sm text-slate-500'>Loading quality metrics…</p>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full'>
                <thead>
                  <tr className='text-left text-xs uppercase tracking-wide text-slate-500'>
                    <th className='pb-3'>Date</th>
                    <th className='pb-3'>Pass Rate</th>
                    <th className='pb-3'>Defect Rate</th>
                    <th className='pb-3'>Inspections</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics?.map((metric) => (
                    <QualityRow key={metric.id} metric={metric} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className='rounded-2xl border border-rose-200 bg-rose-50 p-6 shadow-inner'>
          <div className='flex items-center gap-3'>
            <TrendingDown className='h-5 w-5 text-rose-700' />
            <div>
              <p className='text-xs font-semibold uppercase tracking-wide text-rose-700'>CAPA Triggered</p>
              <h3 className='text-lg font-semibold text-rose-900'>Surface finish variance</h3>
            </div>
          </div>
          <p className='mt-4 text-sm text-rose-900'>Cell 7 recorded a spike in cosmetic defects. Root cause isolation assigned to the advanced manufacturing engineer with due date tomorrow.</p>
        </section>
      </div>
    </DashboardLayout>
  )
}

export default QualityControl
