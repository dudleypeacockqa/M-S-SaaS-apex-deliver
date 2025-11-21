import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { FileText, RefreshCw } from 'lucide-react'

import { DashboardLayout } from '../components/DashboardLayout'
import { fpaApi, type FpaReportResponse } from '../services/fpaApi'

const REPORT_TYPES = [
  { id: 'executive', label: 'Executive Summary' },
  { id: 'banker', label: 'Banker Pack' },
  { id: 'investor', label: 'Investor Update' },
]

export const FinancialReports: React.FC = () => {
  const [reportType, setReportType] = useState('executive')
  const [latestReport, setLatestReport] = useState<FpaReportResponse | null>(null)

  const generateReport = useMutation({
    mutationFn: () => fpaApi.generateReport(reportType),
    onSuccess: (response) => setLatestReport(response),
  })

  return (
    <DashboardLayout>
      <div className='space-y-8 bg-white p-6 lg:p-8'>
        <header className='space-y-2'>
          <h1 className='text-3xl font-bold text-slate-900'>Financial Reports</h1>
          <p className='text-slate-600'>Assemble investor-ready packs in seconds.</p>
        </header>

        <section className='rounded-2xl border border-slate-200 p-6 shadow-sm'>
          <h2 className='text-lg font-semibold text-slate-900'>Report Builder</h2>
          <div className='mt-4 grid gap-4 md:grid-cols-2'>
            <div>
              <label className='text-sm font-medium text-slate-700'>Template</label>
              <select
                className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm'
                value={reportType}
                onChange={(event) => setReportType(event.target.value)}
              >
                {REPORT_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            className='mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60'
            onClick={() => generateReport.mutate()}
            disabled={generateReport.isPending}
          >
            {generateReport.isPending ? (<RefreshCw className='h-4 w-4 animate-spin' />) : <FileText className='h-4 w-4' />}
            Generate Report
          </button>
        </section>

        {latestReport && (
          <section className='rounded-2xl border border-slate-200 p-6 shadow-sm'>
            <h2 className='text-lg font-semibold text-slate-900'>Latest Report</h2>
            <p className='text-sm text-slate-500'>Generated at {new Date(latestReport.created_at).toLocaleString()}</p>
            <pre className='mt-4 max-h-96 overflow-auto rounded-lg bg-slate-900/90 p-4 text-xs text-emerald-100'>
              {JSON.stringify(latestReport.payload, null, 2)}
            </pre>
          </section>
        )}
      </div>
    </DashboardLayout>
  )
}

export default FinancialReports
