import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ValuationSuite } from './ValuationSuite'
import * as valuationApi from '../../../services/api/valuation'

vi.mock('../../../services/api/valuation', () => ({
  listValuations: vi.fn(),
  getValuation: vi.fn(),
  createValuation: vi.fn(),
  listScenarios: vi.fn(),
  getScenarioSummary: vi.fn(),
  addComparable: vi.fn(),
  addPrecedent: vi.fn(),
  triggerExport: vi.fn(),
}))

describe('ValuationSuite RED tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders valuation layout shell', () => {
    render(<ValuationSuite dealId="deal-123" />)
    expect(screen.getByText(/valuations/i)).toBeInTheDocument()
  })

  it('shows loading indicator while valuations fetch', async () => {
    vi.mocked(valuationApi.listValuations).mockResolvedValueOnce({ items: [], total: 0 })
    render(<ValuationSuite dealId="deal-789" />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('submits new valuation when form completed', async () => {
    const user = userEvent.setup()
    vi.mocked(valuationApi.listValuations).mockResolvedValueOnce({ items: [], total: 0 })
    vi.mocked(valuationApi.createValuation).mockResolvedValueOnce({ id: 'val-1' })

    render(<ValuationSuite dealId="deal-new" />)

    await user.type(screen.getByLabelText(/discount rate/i), '12')
    await user.type(screen.getByLabelText(/terminal cash flow/i), '1200000')
    await user.click(screen.getByRole('button', { name: /save valuation/i }))

    await waitFor(() => {
      expect(valuationApi.createValuation).toHaveBeenCalled()
    })
  })

  it('allows adding comparable company to selected valuation', async () => {
    const user = userEvent.setup()
    vi.mocked(valuationApi.listValuations).mockResolvedValueOnce({
      items: [{ id: 'val-1', name: 'Base Case', enterpriseValue: 10500000 }],
      total: 1,
    })
    vi.mocked(valuationApi.addComparable).mockResolvedValueOnce({ id: 'comp-1' })

    render(<ValuationSuite dealId="deal-compare" />)

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

  it('displays scenario summary request and analytics summary', async () => {
    vi.mocked(valuationApi.listValuations).mockResolvedValueOnce({
      items: [{ id: 'val-analytics', name: 'Upside', enterpriseValue: 12000000 }],
      total: 1,
    })
    vi.mocked(valuationApi.getScenarioSummary).mockResolvedValueOnce({
      count: 2,
      enterpriseValueRange: { min: 8000000, max: 12500000, median: 10250000 },
      equityValueRange: { min: 6200000, max: 10000000, median: 8100000 },
    })

    render(<ValuationSuite dealId="deal-analytics" />)

    await waitFor(() => expect(screen.getByText(/analytics/i)).toBeInTheDocument())
    await waitFor(() => expect(valuationApi.getScenarioSummary).toHaveBeenCalled())
  })

  it('fetches scenario list when scenarios tab opened', async () => {
    const user = userEvent.setup()
    vi.mocked(valuationApi.listValuations).mockResolvedValueOnce({
      items: [{ id: 'val-scenario', name: 'Base Case', enterpriseValue: 10500000 }],
      total: 1,
    })
    vi.mocked(valuationApi.listScenarios).mockResolvedValueOnce([])

    render(<ValuationSuite dealId="deal-scenarios" />)

    await waitFor(() => expect(screen.getByText(/base case/i)).toBeInTheDocument())
    await user.click(screen.getByRole('tab', { name: /scenarios/i }))

    await waitFor(() => expect(valuationApi.listScenarios).toHaveBeenCalled())
  })

  it('allows triggering PDF export for growth-tier users', async () => {
    const user = userEvent.setup()
    vi.mocked(valuationApi.listValuations).mockResolvedValueOnce({
      items: [{ id: 'val-export', name: 'Base Case', enterpriseValue: 10500000 }],
      total: 1,
    })
    vi.mocked(valuationApi.triggerExport).mockResolvedValueOnce({ taskId: 'task-1', status: 'queued' })

    render(<ValuationSuite dealId="deal-export" />)

    await waitFor(() => expect(screen.getByText(/base case/i)).toBeInTheDocument())
    await user.click(screen.getByRole('button', { name: /export pdf/i }))

    await waitFor(() => expect(valuationApi.triggerExport).toHaveBeenCalled())
  })

  it('guards valuation workspace for growth-tier access', async () => {
    vi.mocked(valuationApi.listValuations).mockRejectedValueOnce({
      response: { status: 403 },
    })

    render(<ValuationSuite dealId="deal-403" />)

    await waitFor(() => expect(screen.getByText(/upgrade required/i)).toBeInTheDocument())
  })
})

