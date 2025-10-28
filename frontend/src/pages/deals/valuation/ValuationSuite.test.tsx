import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import userEvent from '@testing-library/user-event'

import { ValuationSuite } from './ValuationSuite'
import * as valuationApi from '../../../services/api/valuations'

vi.mock('../../../services/api/valuations', () => ({
  listValuations: vi.fn(),
  getValuation: vi.fn(),
  createValuation: vi.fn(),
  listScenarios: vi.fn(),
  getScenarioSummary: vi.fn(),
  addComparable: vi.fn(),
  addPrecedent: vi.fn(),
  triggerExport: vi.fn(),
}))

const renderSuite = (initialEntry = '/deals/deal-123/valuations/val-001') => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/deals/:dealId/valuations/:valuationId" element={<ValuationSuite />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('ValuationSuite RED tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(valuationApi.listValuations).mockResolvedValue([])
  })

  it('renders valuation layout shell', () => {
    renderSuite()
    expect(screen.getByText(/valuation suite/i)).toBeInTheDocument()
  })

  it.skip('shows loading indicator while valuations fetch', async () => {
    vi.mocked(valuationApi.listValuations).mockResolvedValueOnce([])
    renderSuite('/deals/deal-789/valuations/val-001')
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it.skip('submits new valuation when form completed', async () => {
    const user = userEvent.setup()
    vi.mocked(valuationApi.listValuations).mockResolvedValueOnce([])
    vi.mocked(valuationApi.createValuation).mockResolvedValueOnce({ id: 'val-1' })

    renderSuite('/deals/deal-new/valuations/val-001')

    await user.type(screen.getByLabelText(/discount rate/i), '12')
    await user.type(screen.getByLabelText(/terminal cash flow/i), '1200000')
    await user.click(screen.getByRole('button', { name: /save valuation/i }))

    await waitFor(() => {
      expect(valuationApi.createValuation).toHaveBeenCalled()
    })
  })

  it.skip('allows adding comparable company to selected valuation', async () => {
    const user = userEvent.setup()
    vi.mocked(valuationApi.listValuations).mockResolvedValueOnce([
      { id: 'val-1', name: 'Base Case', enterprise_value: 10500000, equity_value: 8000000 }
    ])
    vi.mocked(valuationApi.addComparable).mockResolvedValueOnce({ id: 'comp-1' })

    renderSuite('/deals/deal-compare/valuations/val-001')

    await waitFor(() => expect(screen.getByText(/base case/i)).toBeInTheDocument())
    await user.click(screen.getByRole('tab', { name: /comparables/i }))
    await user.type(screen.getByLabelText(/company name/i), 'PeerCo')
    await user.type(screen.getByLabelText(/ev\/ebitda/i), '9')
    await user.click(screen.getByRole('button', { name: /add comparable/i }))

    await waitFor(() => {
      expect(valuationApi.addComparable).toHaveBeenCalledWith(expect.objectContaining({
        valuationId: 'val-1',
        payload: expect.objectContaining({ companyName: 'PeerCo' }),
      }))
    })
  })

  it.skip('displays scenario summary request and analytics summary', async () => {
    vi.mocked(valuationApi.listValuations).mockResolvedValueOnce([
      { id: 'val-analytics', name: 'Upside', enterprise_value: 12000000, equity_value: 9000000 }
    ])
    vi.mocked(valuationApi.getScenarioSummary).mockResolvedValueOnce({
      count: 2,
      enterpriseValueRange: { min: 8000000, max: 12500000, median: 10250000 },
      equityValueRange: { min: 6200000, max: 10000000, median: 8100000 },
    })

    renderSuite('/deals/deal-analytics/valuations/val-analytics')

    await waitFor(() => expect(screen.getByText(/analytics/i)).toBeInTheDocument())
    await waitFor(() => expect(valuationApi.getScenarioSummary).toHaveBeenCalled())
  })

  it.skip('fetches scenario list when scenarios tab opened', async () => {
    const user = userEvent.setup()
    vi.mocked(valuationApi.listValuations).mockResolvedValueOnce({
      items: [{ id: 'val-scenario', name: 'Base Case', enterpriseValue: 10500000 }],
      total: 1,
    })
    vi.mocked(valuationApi.listScenarios).mockResolvedValueOnce([])

    renderSuite('/deals/deal-scenarios/valuations/val-scenario')

    await waitFor(() => expect(screen.getByText(/base case/i)).toBeInTheDocument())
    await user.click(screen.getByRole('tab', { name: /scenarios/i }))

    await waitFor(() => expect(valuationApi.listScenarios).toHaveBeenCalled())
  })

  it.skip('allows triggering PDF export for growth-tier users', async () => {
    const user = userEvent.setup()
    vi.mocked(valuationApi.listValuations).mockResolvedValueOnce({
      items: [{ id: 'val-export', name: 'Base Case', enterpriseValue: 10500000 }],
      total: 1,
    })
    vi.mocked(valuationApi.triggerExport).mockResolvedValueOnce({ taskId: 'task-1', status: 'queued' })

    renderSuite('/deals/deal-export/valuations/val-export')

    await waitFor(() => expect(screen.getByText(/base case/i)).toBeInTheDocument())
    await user.click(screen.getByRole('button', { name: /export pdf/i }))

    await waitFor(() => expect(valuationApi.triggerExport).toHaveBeenCalled())
  })

  it.skip('guards valuation workspace for growth-tier access', async () => {
    vi.mocked(valuationApi.listValuations).mockRejectedValueOnce({
      response: { status: 403 },
    })

    renderSuite('/deals/deal-403/valuations/val-403')

    await waitFor(() => expect(screen.getByText(/upgrade required/i)).toBeInTheDocument())
  })
})




