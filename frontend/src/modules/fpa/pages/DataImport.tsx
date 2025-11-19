import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { CloudUpload } from 'lucide-react'

import { DashboardLayout } from '../components/DashboardLayout'
import { fpaApi } from '../services/fpaApi'

const IMPORT_TYPES = [
  { id: 'forecast', label: 'Forecasts' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'production', label: 'Production Metrics' },
]

export const DataImport: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [importType, setImportType] = useState('forecast')

  const importMutation = useMutation({
    mutationFn: () => {
      if (!file) throw new Error('Select a file to import')
      return fpaApi.importData(file, importType)
    },
    onSuccess: () => setFile(null),
  })

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!file) return
    importMutation.mutate()
  }

  return (
    <DashboardLayout>
      <div className='space-y-8 bg-white p-6 lg:p-8'>
        <header className='space-y-2'>
          <h1 className='text-3xl font-bold text-slate-900'>Data Import</h1>
          <p className='text-slate-600'>Drop in CSV exports from ERP, MES, or legacy tools.</p>
        </header>

        <section className='rounded-2xl border border-dashed border-slate-300 p-8 text-center'>
          <CloudUpload className='mx-auto h-10 w-10 text-slate-400' />
          <p className='mt-2 text-sm text-slate-500'>Drag & drop CSVs or click to browse.</p>
          <form className='mt-4 space-y-4' onSubmit={handleSubmit}>
            <div>
              <label className='text-xs font-semibold uppercase tracking-wide text-slate-500'>Import Type</label>
              <select
                className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm'
                value={importType}
                onChange={(event) => setImportType(event.target.value)}
              >
                {IMPORT_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <input
              type='file'
              accept='.csv,.xlsx'
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className='w-full text-sm'
            />
            <button
              type='submit'
              className='w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60'
              disabled={!file || importMutation.isPending}
            >
              {importMutation.isPending ? 'Importing…' : 'Import Data'}
            </button>
          </form>
          {importMutation.data && (
            <p className='mt-4 text-sm text-emerald-600'>{importMutation.data.message}</p>
          )}
        </section>
      </div>
    </DashboardLayout>
  )
}

export default DataImport
