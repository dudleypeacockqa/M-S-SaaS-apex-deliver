import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { PiggyBank } from 'lucide-react'

import { DashboardLayout } from '../components/DashboardLayout'
import { fpaApi } from '../services/fpaApi'

export const WorkingCapital: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['fpa', 'working-capital'],
    queryFn: () => fpaApi.getWorkingCapitalAnalysis(),
  })

  return (
    <DashboardLayout>
      <div className='space-y-8 bg-white p-6 lg:p-8'>
        <header className='space-y-2'>
          <h1 className='text-3xl font-bold text-slate-900'>Working Capital</h1>
          <p className='text-slate-600'>Cash runway, DSO/DPO/DIO, and working capital orchestration.</p>
        </header>

        {isLoading || !data ? (
          <p className='text-sm text-slate-500'>Loading working capital insights…</p>
        ) : (
          <>
            <section className='grid gap-4 md:grid-cols-3'>
              <div className='rounded-2xl border border-slate-200 p-4 shadow-sm'>
                <p className='text-sm text-slate-500'>Current Position</p>
                <p className='text-3xl font-bold text-slate-900'>£{data.current.toLocaleString()}</p>
              </div>
              <div className='rounded-2xl border border-slate-200 p-4 shadow-sm'>
                <p className='text-sm text-slate-500'>30d Projection</p>
                <p className='text-3xl font-bold text-slate-900'>£{data.projection_30day.toLocaleString()}</p>
              </div>
              <div className='rounded-2xl border border-slate-200 p-4 shadow-sm'>
                <p className='text-sm text-slate-500'>Growth</p>
                <p className='text-3xl font-bold text-emerald-600'>+{data.growth_percentage.toFixed(1)}%</p>
              </div>
            </section>

            <section className='grid gap-4 md:grid-cols-3'>
              <div className='rounded-xl border border-slate-100 p-4'>
                <p className='text-xs text-slate-500'>DSO</p>
                <p className='text-2xl font-semibold text-slate-900'>{data.dso.toFixed(1)} days</p>
              </div>
              <div className='rounded-xl border border-slate-100 p-4'>
                <p className='text-xs text-slate-500'>DPO</p>
                <p className='text-2xl font-semibold text-slate-900'>{data.dpo.toFixed(1)} days</p>
              </div>
              <div className='rounded-xl border border-slate-100 p-4'>
                <p className='text-xs text-slate-500'>DIO</p>
                <p className='text-2xl font-semibold text-slate-900'>{data.dio.toFixed(1)} days</p>
              </div>
            </section>

            <section className='rounded-2xl border border-indigo-200 bg-indigo-50 p-6 shadow-inner'>
              <div className='flex items-center gap-3'>
                <PiggyBank className='h-5 w-5 text-indigo-700' />
                <div>
                  <p className='text-xs font-semibold uppercase tracking-wide text-indigo-700'>Recommendation</p>
                  <h3 className='text-lg font-semibold text-indigo-900'>Accelerate collections run</h3>
                </div>
              </div>
              <p className='mt-4 text-sm text-indigo-900'>Deploy automated reminders for the 4 largest invoices (>£250k) to compress DSO by 2.5 days.</p>
            </section>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

export default WorkingCapital
