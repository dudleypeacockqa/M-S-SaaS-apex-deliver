import React, { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, Boxes, TrendingUp } from 'lucide-react'

import { DashboardLayout } from '../components/DashboardLayout'
import { fpaApi, type InventoryItem } from '../services/fpaApi'

const InventoryRow = ({ item }: { item: InventoryItem }) => {
  const status = item.current_stock <= item.reorder_point ? 'REORDER' : 'HEALTHY'
  const statusColor = status === 'REORDER' ? 'text-rose-600 bg-rose-50' : 'text-emerald-600 bg-emerald-50'
  const coverage = Math.max(0, Math.round((item.current_stock / Math.max(1, item.reorder_point)) * 100))

  return (
    <tr className='border-b border-slate-100 text-sm'>
      <td className='py-3 font-medium text-slate-900'>{item.name}</td>
      <td className='py-3 text-slate-500'>{item.category}</td>
      <td className='py-3 text-slate-900'>{item.current_stock.toLocaleString()}</td>
      <td className='py-3 text-slate-500'>{item.reorder_point.toLocaleString()}</td>
      <td className='py-3'>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor}`}>{status}</span>
      </td>
      <td className='py-3'>
        <div className='flex items-center gap-2'>
          <div className='h-2 flex-1 rounded-full bg-slate-100'>
            <div className={`h-full rounded-full ${status === 'REORDER' ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, coverage)}%` }} />
          </div>
          <span className='text-xs text-slate-500'>{coverage}%</span>
        </div>
      </td>
    </tr>
  )
}

export const InventoryManagement: React.FC = () => {
  const { data: inventory, isLoading } = useQuery({
    queryKey: ['fpa', 'inventory'],
    queryFn: () => fpaApi.getInventoryItems(),
  })

  const summary = useMemo(() => {
    const items = inventory ?? []
    const totalStock = items.reduce((sum, item) => sum + item.current_stock, 0)
    const atRisk = items.filter((item) => item.current_stock <= item.reorder_point)
    return {
      totalStock,
      atRiskCount: atRisk.length,
      atRisk,
    }
  }, [inventory])

  return (
    <DashboardLayout>
      <div className='space-y-8 bg-white p-6 lg:p-8'>
        <header className='space-y-2'>
          <h1 className='text-3xl font-bold text-slate-900'>Inventory Management</h1>
          <p className='text-slate-600'>Live inventory posture across premium SKUs with automated reorder intelligence.</p>
        </header>

        <section className='grid gap-4 md:grid-cols-3'>
          <div className='rounded-2xl border border-slate-200 p-4 shadow-sm'>
            <p className='text-sm text-slate-500'>Total Stock Value</p>
            <p className='text-3xl font-bold text-slate-900'>£{(summary.totalStock * 120).toLocaleString()}</p>
          </div>
          <div className='rounded-2xl border border-slate-200 p-4 shadow-sm'>
            <p className='text-sm text-slate-500'>SKUs at Risk</p>
            <p className='text-3xl font-bold text-rose-600'>{summary.atRiskCount}</p>
          </div>
          <div className='rounded-2xl border border-slate-200 p-4 shadow-sm'>
            <p className='text-sm text-slate-500'>Fulfilment Confidence</p>
            <p className='text-3xl font-bold text-emerald-600'>94%</p>
          </div>
        </section>

        <section className='rounded-2xl border border-slate-100 p-6 shadow-sm'>
          <div className='mb-4 flex items-center gap-2'>
            <Boxes className='h-5 w-5 text-indigo-600' />
            <h2 className='text-xl font-semibold text-gray-900'>Inventory Position</h2>
          </div>
          {isLoading ? (
            <p className='text-sm text-slate-500'>Loading inventory…</p>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full'>
                <thead>
                  <tr className='text-left text-xs uppercase tracking-wide text-slate-500'>
                    <th className='pb-3'>SKU</th>
                    <th className='pb-3'>Category</th>
                    <th className='pb-3'>On Hand</th>
                    <th className='pb-3'>Reorder Point</th>
                    <th className='pb-3'>Status</th>
                    <th className='pb-3'>Coverage</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory?.map((item) => (
                    <InventoryRow key={item.id} item={item} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className='grid gap-6 lg:grid-cols-2'>
          <div className='rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-inner'>
            <div className='flex items-center gap-3'>
              <AlertTriangle className='h-5 w-5 text-amber-600' />
              <div>
                <p className='text-xs font-semibold uppercase tracking-wide text-amber-700'>Automated Alert</p>
                <h3 className='text-lg font-semibold text-amber-900'>Reorder premium packaging</h3>
              </div>
            </div>
            <p className='mt-4 text-sm text-amber-900'>Premium packaging SKU has 12 days of coverage. Trigger vendor-managed inventory before the promotional campaign.</p>
          </div>

          <div className='rounded-2xl border border-slate-200 p-6 shadow-sm'>
            <div className='flex items-center gap-3'>
              <TrendingUp className='h-5 w-5 text-emerald-600' />
              <div>
                <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>Optimization</p>
                <h3 className='text-lg font-semibold text-slate-900'>Cycle stock recommendation</h3>
              </div>
            </div>
            <p className='mt-3 text-sm text-slate-600'>Increase lean buffer for the flagship SKU by 8% to support the APAC roll-out and protect customer fill rate.</p>
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}

export default InventoryManagement
