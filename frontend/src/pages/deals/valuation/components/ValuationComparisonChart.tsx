/**
 * Valuation Comparison Chart Component
 * Displays side-by-side comparison of DCF, Comparables, and Precedent methodologies
 */

import React, { useState } from 'react'
import { useRecharts } from '@/hooks/useRecharts'

export interface ValuationMethodData {
  enterpriseValue: number
  equityValue: number
  method: string
}

interface ValuationComparisonChartProps {
  data: {
    dcf: ValuationMethodData | null
    comparables: ValuationMethodData | null
    precedent: ValuationMethodData | null
  }
}

export const ValuationComparisonChart: React.FC<ValuationComparisonChartProps> = ({ data }) => {
  const [viewMode, setViewMode] = useState<'enterprise' | 'equity'>('enterprise')
  const recharts = useRecharts()

  // Prepare chart data
  const chartData = [
    {
      method: 'DCF',
      enterpriseValue: data.dcf?.enterpriseValue || 0,
      equityValue: data.dcf?.equityValue || 0,
    },
    {
      method: 'Comparables',
      enterpriseValue: data.comparables?.enterpriseValue || 0,
      equityValue: data.comparables?.equityValue || 0,
    },
    {
      method: 'Precedent',
      enterpriseValue: data.precedent?.enterpriseValue || 0,
      equityValue: data.precedent?.equityValue || 0,
    },
  ].filter((item) => {
    // Only include methods with data
    if (viewMode === 'enterprise') {
      return item.enterpriseValue > 0
    }
    return item.equityValue > 0
  })

  const formatCurrency = (value: number) => {
    if (Number.isNaN(value)) return 'N/A'
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Methodology Comparison</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setViewMode('enterprise')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              viewMode === 'enterprise'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Enterprise Value
          </button>
          <button
            type="button"
            onClick={() => setViewMode('equity')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              viewMode === 'equity'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Equity Value
          </button>
        </div>
      </div>

      {chartData.length > 0 ? (
        recharts ? (
          <recharts.ResponsiveContainer width="100%" height={300}>
            <recharts.BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <recharts.CartesianGrid strokeDasharray="3 3" />
              <recharts.XAxis dataKey="method" />
              <recharts.YAxis
                tickFormatter={(value) => {
                  if (value >= 1000000) {
                    return `£${(value / 1000000).toFixed(1)}M`
                  }
                  return `£${(value / 1000).toFixed(0)}K`
                }}
              />
              <recharts.Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `${label} Methodology`}
              />
              <recharts.Legend />
              <recharts.Bar
                dataKey={viewMode === 'enterprise' ? 'enterpriseValue' : 'equityValue'}
                fill="#4F46E5"
                name={viewMode === 'enterprise' ? 'Enterprise Value' : 'Equity Value'}
              />
            </recharts.BarChart>
          </recharts.ResponsiveContainer>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-500">Loading chart…</p>
          </div>
        )
      ) : (
        <div className="flex items-center justify-center h-64 rounded-lg border border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-500">No valuation data available for comparison</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mt-4">
        {data.dcf && (
          <div className="rounded-lg border border-gray-200 bg-white p-3">
            <p className="text-xs font-medium text-gray-500">DCF</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(viewMode === 'enterprise' ? data.dcf.enterpriseValue : data.dcf.equityValue)}
            </p>
          </div>
        )}
        {data.comparables && (
          <div className="rounded-lg border border-gray-200 bg-white p-3">
            <p className="text-xs font-medium text-gray-500">Comparables</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(
                viewMode === 'enterprise' ? data.comparables.enterpriseValue : data.comparables.equityValue
              )}
            </p>
          </div>
        )}
        {data.precedent && (
          <div className="rounded-lg border border-gray-200 bg-white p-3">
            <p className="text-xs font-medium text-gray-500">Precedent</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(
                viewMode === 'enterprise' ? data.precedent.enterpriseValue : data.precedent.equityValue
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

