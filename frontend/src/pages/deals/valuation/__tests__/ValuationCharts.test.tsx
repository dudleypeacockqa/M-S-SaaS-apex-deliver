/**
 * Valuation Comparison Charts Tests
 * TDD: RED → GREEN → REFACTOR
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ValuationComparisonChart } from '../components/ValuationComparisonChart'

vi.mock('@/hooks/useRecharts', () => {
  const recharts = require('recharts')
  return {
    useRecharts: () => recharts,
  }
})

describe('ValuationComparisonChart', () => {
  const mockData = {
    dcf: {
      enterpriseValue: 5000000,
      equityValue: 4800000,
      method: 'DCF',
    },
    comparables: {
      enterpriseValue: 5200000,
      equityValue: 5000000,
      method: 'Comparables',
    },
    precedent: {
      enterpriseValue: 5100000,
      equityValue: 4900000,
      method: 'Precedent',
    },
  }

  it('should render comparison chart with all three methodologies', () => {
    render(<ValuationComparisonChart data={mockData} />)

    expect(screen.getByText(/DCF/i)).toBeInTheDocument()
    expect(screen.getByText(/Comparables/i)).toBeInTheDocument()
    expect(screen.getByText(/Precedent/i)).toBeInTheDocument()
  })

  it('should display enterprise value comparison', () => {
    render(<ValuationComparisonChart data={mockData} />)

    // Chart should show enterprise values for each method
    expect(screen.getByText(/Enterprise Value/i)).toBeInTheDocument()
  })

  it('should display equity value comparison', () => {
    render(<ValuationComparisonChart data={mockData} />)

    // Chart should show equity values for each method
    expect(screen.getByText(/Equity Value/i)).toBeInTheDocument()
  })

  it('should handle missing data gracefully', () => {
    const partialData = {
      dcf: mockData.dcf,
      comparables: null,
      precedent: null,
    }

    render(<ValuationComparisonChart data={partialData} />)

    // Should still render with available data
    expect(screen.getByText(/DCF/i)).toBeInTheDocument()
  })

  it('should allow switching between enterprise and equity value views', () => {
    render(<ValuationComparisonChart data={mockData} />)

    // Check that both toggle buttons exist
    const enterpriseButton = screen.getByRole('button', { name: /Enterprise Value/i })
    const equityButton = screen.getByRole('button', { name: /Equity Value/i })
    
    expect(enterpriseButton).toBeInTheDocument()
    expect(equityButton).toBeInTheDocument()
  })
})
