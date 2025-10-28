import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createValuation, type ValuationCreateRequest } from '../../services/api/valuations'

interface CreateValuationModalProps {
  dealId: string
  isOpen: boolean
  onClose: () => void
}

export const CreateValuationModal = ({ dealId, isOpen, onClose }: CreateValuationModalProps) => {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState<ValuationCreateRequest>({
    forecast_years: 5,
    discount_rate: 0,
    terminal_growth_rate: 2.5,
    terminal_method: 'gordon_growth',
    cash_flows: [0, 0, 0, 0, 0],
    terminal_cash_flow: 0,
    net_debt: 0,
    shares_outstanding: 1000000,
  })

  const { mutate, isPending } = useMutation({
    mutationFn: () => createValuation(dealId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['valuations', dealId] })
      onClose()
      // Reset form
      setFormData({
        forecast_years: 5,
        discount_rate: 0,
        terminal_growth_rate: 2.5,
        terminal_method: 'gordon_growth',
        cash_flows: [0, 0, 0, 0, 0],
        terminal_cash_flow: 0,
        net_debt: 0,
        shares_outstanding: 1000000,
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Create New Valuation</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Discount Rate */}
          <div>
            <label htmlFor="discount-rate" className="block text-sm font-medium text-gray-700">
              Discount Rate (%)
            </label>
            <input
              id="discount-rate"
              type="number"
              step="0.1"
              value={formData.discount_rate}
              onChange={(e) =>
                setFormData({ ...formData, discount_rate: parseFloat(e.target.value) || 0 })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              required
            />
          </div>

          {/* Terminal Cash Flow */}
          <div>
            <label htmlFor="terminal-cash-flow" className="block text-sm font-medium text-gray-700">
              Terminal Cash Flow
            </label>
            <input
              id="terminal-cash-flow"
              type="number"
              step="1000"
              value={formData.terminal_cash_flow}
              onChange={(e) =>
                setFormData({ ...formData, terminal_cash_flow: parseFloat(e.target.value) || 0 })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              required
            />
          </div>

          {/* Forecast Years */}
          <div>
            <label htmlFor="forecast-years" className="block text-sm font-medium text-gray-700">
              Forecast Years
            </label>
            <input
              id="forecast-years"
              type="number"
              min="1"
              max="10"
              value={formData.forecast_years}
              onChange={(e) => {
                const years = parseInt(e.target.value, 10) || 5
                setFormData({
                  ...formData,
                  forecast_years: years,
                  cash_flows: Array(years).fill(0),
                })
              }}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              required
            />
          </div>

          {/* Terminal Method */}
          <div>
            <label htmlFor="terminal-method" className="block text-sm font-medium text-gray-700">
              Terminal Method
            </label>
            <select
              id="terminal-method"
              value={formData.terminal_method}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  terminal_method: e.target.value as 'gordon_growth' | 'exit_multiple',
                })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            >
              <option value="gordon_growth">Gordon Growth Model</option>
              <option value="exit_multiple">Exit Multiple</option>
            </select>
          </div>

          {/* Terminal Growth Rate (for Gordon Growth) */}
          {formData.terminal_method === 'gordon_growth' && (
            <div>
              <label htmlFor="terminal-growth-rate" className="block text-sm font-medium text-gray-700">
                Terminal Growth Rate (%)
              </label>
              <input
                id="terminal-growth-rate"
                type="number"
                step="0.1"
                value={formData.terminal_growth_rate || 0}
                onChange={(e) =>
                  setFormData({ ...formData, terminal_growth_rate: parseFloat(e.target.value) || 0 })
                }
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>
          )}

          {/* Net Debt */}
          <div>
            <label htmlFor="net-debt" className="block text-sm font-medium text-gray-700">
              Net Debt
            </label>
            <input
              id="net-debt"
              type="number"
              step="1000"
              value={formData.net_debt}
              onChange={(e) =>
                setFormData({ ...formData, net_debt: parseFloat(e.target.value) || 0 })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>

          {/* Shares Outstanding */}
          <div>
            <label htmlFor="shares-outstanding" className="block text-sm font-medium text-gray-700">
              Shares Outstanding
            </label>
            <input
              id="shares-outstanding"
              type="number"
              step="1000"
              value={formData.shares_outstanding || 0}
              onChange={(e) =>
                setFormData({ ...formData, shares_outstanding: parseInt(e.target.value, 10) || null })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? 'Saving...' : 'Save Valuation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
