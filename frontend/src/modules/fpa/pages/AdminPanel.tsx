import React, { useState } from 'react'
import { Shield, SlidersHorizontal } from 'lucide-react'

import { DashboardLayout } from '../components/DashboardLayout'

interface ToggleSetting {
  id: string
  label: string
  description: string
}

const TOGGLES: ToggleSetting[] = [
  { id: 'autoAlerts', label: 'Auto Alerts', description: 'Email alerts when KPIs drift outside guardrails.' },
  { id: 'bankerPack', label: 'Banker Pack', description: 'Expose banker-ready PDF inside the workspace.' },
  { id: 'pmIntegration', label: 'Project Sync', description: 'Sync PMI projects to the working capital view.' },
]

export const AdminPanel: React.FC = () => {
  const [toggles, setToggles] = useState<Record<string, boolean>>({ autoAlerts: true, bankerPack: true, pmIntegration: false })

  return (
    <DashboardLayout>
      <div className='space-y-8 bg-white p-6 lg:p-8'>
        <header className='space-y-2'>
          <h1 className='text-3xl font-bold text-slate-900'>FP&A Admin Panel</h1>
          <p className='text-slate-600'>Control access, automation, and data retention policies.</p>
        </header>

        <section className='rounded-2xl border border-slate-200 p-6 shadow-sm'>
          <div className='mb-4 flex items-center gap-2'>
            <Shield className='h-5 w-5 text-indigo-600' />
            <h2 className='text-xl font-semibold text-gray-900'>Workspace Guardrails</h2>
          </div>
          <div className='space-y-4'>
            {TOGGLES.map((toggle) => (
              <div key={toggle.id} className='flex items-center justify-between rounded-xl border border-slate-100 p-4'>
                <div>
                  <p className='font-semibold text-slate-900'>{toggle.label}</p>
                  <p className='text-sm text-slate-500'>{toggle.description}</p>
                </div>
                <button
                  type='button'
                  onClick={() => setToggles((prev) => ({ ...prev, [toggle.id]: !prev[toggle.id] }))}
                  className={`${toggles[toggle.id] ? 'bg-indigo-600' : 'bg-slate-200'} relative inline-flex h-6 w-11 items-center rounded-full transition`}
                >
                  <span className={`${toggles[toggle.id] ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className='rounded-2xl border border-slate-200 p-6 shadow-sm'>
          <div className='mb-4 flex items-center gap-2'>
            <SlidersHorizontal className='h-5 w-5 text-indigo-600' />
            <h2 className='text-xl font-semibold text-gray-900'>Retention & Automation</h2>
          </div>
          <div className='grid gap-4 md:grid-cols-2'>
            <div>
              <label className='text-sm font-medium text-slate-700'>Data retention (months)</label>
              <input type='number' className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm' defaultValue={24} />
            </div>
            <div>
              <label className='text-sm font-medium text-slate-700'>Automation window (days)</label>
              <input type='number' className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm' defaultValue={7} />
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}

export default AdminPanel
