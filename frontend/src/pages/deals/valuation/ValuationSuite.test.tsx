import React from 'react'
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
  listComparableCompanies: vi.fn(),
  listPrecedentTransactions: vi.fn(),
  getScenarioSummary: vi.fn(),
  getComparableSummary: vi.fn(),
  getPrecedentSummary: vi.fn(),
  runMonteCarlo: vi.fn(),
  triggerExport: vi.fn(),
  getExportStatus: vi.fn(),
  addComparableCompany: vi.fn(),
  addPrecedentTransaction: vi.fn(),
  createScenario: vi.fn(),
}))

vi.mock('@/hooks/useRecharts', () => {
  const ChartWrapper = ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="mock-chart">{children}</div>
  )

  const stub = {
    ResponsiveContainer: ChartWrapper,
    BarChart: ChartWrapper,
    CartesianGrid: () => null,
    XAxis: () => null,
    YAxis: () => null,
    Tooltip: () => null,
    Legend: () => null,
    Bar: () => null,
  }

  return {
    useRecharts: () => stub,
  }
})

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
    vi.mocked(valuationApi.listScenarios).mockResolvedValue([])
    vi.mocked(valuationApi.listComparableCompanies).mockResolvedValue([])
    vi.mocked(valuationApi.listPrecedentTransactions).mockResolvedValue([])
    vi.mocked(valuationApi.getScenarioSummary).mockResolvedValue({
      count: 0,
      enterprise_value_range: { min: null, max: null, median: null },
      equity_value_range: { min: null, max: null, median: null },
    })
    // Default mock for export status polling
    vi.mocked(valuationApi.getExportStatus).mockResolvedValue({
      id: 'export-1',
      valuation_id: 'val-001',
      organization_id: 'org-1',
      export_type: 'pdf',
      export_format: 'summary',
      status: 'queued',
      task_id: 'task-1',
      scenario_id: null,
      download_url: null,
      file_size_bytes: null,
      exported_by: 'user-1',
      exported_at: '2025-01-01T00:00:00Z',
      completed_at: null,
    })
  })

  it('renders valuation layout shell', async () => {
    vi.mocked(valuationApi.listValuations).mockResolvedValue([
      { id: 'val-001', enterprise_value: 10000000, equity_value: 8000000, deal_id: 'deal-123', organization_id: 'org-1', forecast_years: 5, discount_rate: 12, terminal_growth_rate: 2.5, terminal_method: 'gordon_growth', cash_flows: [1000000, 1100000, 1200000, 1300000, 1400000], terminal_cash_flow: 1500000, net_debt: 500000, shares_outstanding: 1000000, implied_share_price: 75.0, created_by: 'user-1', created_at: '2025-01-01', updated_at: null }
    ])
    renderSuite()
    await waitFor(() => {
      expect(screen.getByText(/valuation suite/i)).toBeInTheDocument()
    })
  })

  it('shows loading indicator while valuations fetch', async () => {
    const pendingPromise = new Promise<never>(() => {})
    vi.mocked(valuationApi.listValuations).mockImplementationOnce(() => pendingPromise)
    renderSuite('/deals/deal-789/valuations/val-001')
    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument()
  })

  it('shows upgrade messaging when valuations endpoint rejects with entitlement error', async () => {
    vi.mocked(valuationApi.listValuations).mockRejectedValueOnce({
      response: {
        status: 403,
        data: {
          detail: {
            message: 'Upgrade to the Growth tier to unlock full valuation analytics.',
            required_tier_label: 'Growth',
            upgrade_cta_url: '/billing/upgrade',
          },
        },
      },
    })

    renderSuite('/deals/deal-upgrade/valuations/val-entitlement')

    const upgradeHeading = await screen.findByRole('heading', { name: /upgrade required/i })
    expect(upgradeHeading).toBeInTheDocument()
    expect(
      screen.getByText('The valuation workspace is available to Growth tier and above.'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Upgrade to the Growth tier to unlock full valuation analytics.'),
    ).toBeInTheDocument()
    const upgradeLink = screen.getByRole('link', { name: /view pricing plans/i })
    expect(upgradeLink).toHaveAttribute('href', '/billing/upgrade')
  })

  it('submits new valuation when form completed', async () => {
    const user = userEvent.setup()
    vi.mocked(valuationApi.listValuations).mockResolvedValueOnce([])
    vi.mocked(valuationApi.createValuation).mockResolvedValueOnce({ id: 'val-1' })

    renderSuite('/deals/deal-new/valuations/val-001')

    // Wait for the modal to appear after query resolves (empty valuations list)
    const discountRateInput = await screen.findByLabelText(/discount rate/i)
    const terminalCashFlowInput = await screen.findByLabelText(/terminal cash flow/i)
    const saveButton = await screen.findByRole('button', { name: /save valuation/i })

    await user.type(discountRateInput, '12')
    await user.type(terminalCashFlowInput, '1200000')
    await user.click(saveButton)

    await waitFor(() => {
      expect(valuationApi.createValuation).toHaveBeenCalled()
    })
  })

  it('allows adding comparable company to selected valuation', async () => {
    const user = userEvent.setup()
    vi.mocked(valuationApi.listValuations).mockResolvedValueOnce([
      { id: 'val-001', enterprise_value: 10500000, equity_value: 8000000, deal_id: 'deal-compare', organization_id: 'org-1', forecast_years: 5, discount_rate: 12, terminal_growth_rate: 2.5, terminal_method: 'gordon_growth', cash_flows: [1000000, 1100000, 1200000, 1300000, 1400000], terminal_cash_flow: 1500000, net_debt: 500000, shares_outstanding: 1000000, implied_share_price: 75.0, created_by: 'user-1', created_at: '2025-01-01', updated_at: null }
    ])
    vi.mocked(valuationApi.addComparableCompany).mockResolvedValueOnce({ id: 'comp-1', valuation_id: 'val-1', organization_id: 'org-1', company_name: 'PeerCo', ev_revenue_multiple: null, ev_ebitda_multiple: 9.0, weight: 1.0, is_outlier: 'false', notes: null, created_at: '2025-01-01', updated_at: null })

    renderSuite('/deals/deal-compare/valuations/val-001')

    await waitFor(() => expect(screen.getByText(/£10,500,000/i)).toBeInTheDocument())
    await user.click(screen.getByRole('tab', { name: /comparables/i }))
    await user.type(screen.getByLabelText(/company name/i), 'PeerCo')
    await user.type(screen.getByLabelText(/ev\/ebitda/i), '9')
    await user.click(screen.getByRole('button', { name: /add comparable/i }))

    await waitFor(() => {
      expect(valuationApi.addComparableCompany).toHaveBeenCalledWith('deal-compare', 'val-001', expect.objectContaining({ company_name: 'PeerCo' }))
    })
  })

  it('allows adding precedent transaction to selected valuation', async () => {
    const user = userEvent.setup({ delay: 0 })
    vi.mocked(valuationApi.listValuations).mockResolvedValueOnce([
      { id: 'val-002', enterprise_value: 12000000, equity_value: 9500000, deal_id: 'deal-precedent', organization_id: 'org-1', forecast_years: 5, discount_rate: 11, terminal_growth_rate: 2.5, terminal_method: 'gordon_growth', cash_flows: [1000000, 1100000, 1200000, 1300000, 1400000], terminal_cash_flow: 1500000, net_debt: 500000, shares_outstanding: 1000000, implied_share_price: 95.0, created_by: 'user-1', created_at: '2025-01-01', updated_at: null }
    ])
    vi.mocked(valuationApi.addPrecedentTransaction).mockResolvedValueOnce({ id: 'txn-1', valuation_id: 'val-002', organization_id: 'org-1', target_company: 'Target Corp', acquirer_company: 'Acquirer Inc', ev_ebitda_multiple: 8.5, ev_revenue_multiple: null, weight: 1.0, is_stale: 'false', announcement_date: '2024-06-15', notes: null, created_at: '2025-01-01', updated_at: null })

    renderSuite('/deals/deal-precedent/valuations/val-002')

    await waitFor(() => expect(screen.getByText(/£12,000,000/i)).toBeInTheDocument())
    await user.click(screen.getByRole('tab', { name: /precedents/i }))

    const targetInput = await screen.findByLabelText(/target company/i)
    const acquirerInput = await screen.findByLabelText(/acquirer company/i)
    const evEbitdaInput = await screen.findByLabelText(/ev\/ebitda/i)
    const dateInput = await screen.findByLabelText(/announcement date/i)
    const addButton = await screen.findByRole('button', { name: /add precedent/i })

    await user.type(targetInput, 'Target Corp')
    await user.type(acquirerInput, 'Acquirer Inc')
    await user.type(evEbitdaInput, '8.5')
    await user.type(dateInput, '2024-06-15')
    await user.click(addButton)

    await waitFor(() => {
      expect(valuationApi.addPrecedentTransaction).toHaveBeenCalledWith('deal-precedent', 'val-002', expect.objectContaining({ target_company: 'Target Corp', acquirer_company: 'Acquirer Inc' }))
    }, { timeout: 15000 })
  }, 20000)

  // TODO: Test skipped - need to add analytics view or clarify what this test is checking
  it('displays scenario summary insights with analytics metrics', async () => {
    vi.mocked(valuationApi.listValuations).mockResolvedValueOnce([
      { id: 'val-analytics', enterprise_value: 12000000, equity_value: 9000000, deal_id: 'deal-analytics', organization_id: 'org-1', forecast_years: 5, discount_rate: 12, terminal_growth_rate: 2.5, terminal_method: 'gordon_growth', cash_flows: [1000000, 1100000, 1200000, 1300000, 1400000], terminal_cash_flow: 1500000, net_debt: 500000, shares_outstanding: 1000000, implied_share_price: 75.0, created_by: 'user-1', created_at: '2025-01-01', updated_at: null }
    ])
    vi.mocked(valuationApi.getScenarioSummary).mockResolvedValueOnce({
      count: 2,
      enterprise_value_range: { min: 8000000, max: 12500000, median: 10250000 },
      equity_value_range: { min: 6200000, max: 10000000, median: 8100000 },
    })

    renderSuite('/deals/deal-analytics/valuations/val-analytics')

    const analyticsHeading = await screen.findByRole('heading', { name: /analytics summary/i })
    expect(analyticsHeading).toBeInTheDocument()
    await waitFor(() => expect(valuationApi.getScenarioSummary).toHaveBeenCalled())

    expect(screen.getByText(/scenarios analysed/i)).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText(/ev median/i)).toBeInTheDocument()
    expect(screen.getByText('£10,250,000')).toBeInTheDocument()
    expect(screen.getByText(/equity median/i)).toBeInTheDocument()
    expect(screen.getByText('£8,100,000')).toBeInTheDocument()
    expect(screen.getByText(/ev range/i)).toBeInTheDocument()
    expect(screen.getByText('£8,000,000 – £12,500,000')).toBeInTheDocument()
    expect(screen.getByText(/equity range/i)).toBeInTheDocument()
    expect(screen.getByText('£6,200,000 – £10,000,000')).toBeInTheDocument()
  })

  it('applies responsive layout classes to analytics metrics grid', async () => {
    vi.mocked(valuationApi.listValuations).mockResolvedValue([
      { id: 'val-responsive', enterprise_value: 12500000, equity_value: 9500000, deal_id: 'deal-responsive', organization_id: 'org-1', forecast_years: 5, discount_rate: 12, terminal_growth_rate: 3, terminal_method: 'gordon_growth', cash_flows: [1000000, 1100000, 1200000, 1300000, 1400000], terminal_cash_flow: 1500000, net_debt: 500000, shares_outstanding: 1000000, implied_share_price: 75.0, created_by: 'user-1', created_at: '2025-01-01', updated_at: null }
    ])
    vi.mocked(valuationApi.getScenarioSummary).mockResolvedValue({
      count: 3,
      enterprise_value_range: { min: 9000000, max: 14000000, median: 11500000 },
      equity_value_range: { min: 7000000, max: 10500000, median: 8800000 },
    })

    renderSuite('/deals/deal-responsive/valuations/val-responsive')

    await screen.findByRole('heading', { name: /analytics summary/i })
    const gridContainer = await screen.findByTestId('analytics-metrics-grid', {}, { timeout: 5000 })
    expect(gridContainer.className).toContain('grid-cols-1')
    expect(gridContainer.className).toContain('md:grid-cols-5')
  })

  it('allows creating a new scenario with JSON assumptions', async () => {
    const user = userEvent.setup({ delay: 0 })
    vi.mocked(valuationApi.listValuations).mockResolvedValueOnce([
      { id: 'val-scenarios', enterprise_value: 10500000, equity_value: 8000000, deal_id: 'deal-scenarios', organization_id: 'org-1', forecast_years: 5, discount_rate: 12, terminal_growth_rate: 2.5, terminal_method: 'gordon_growth', cash_flows: [1000000, 1100000, 1200000, 1300000, 1400000], terminal_cash_flow: 1500000, net_debt: 500000, shares_outstanding: 1000000, implied_share_price: 75.0, created_by: 'user-1', created_at: '2025-01-01', updated_at: null }
    ])
    vi.mocked(valuationApi.listScenarios).mockResolvedValueOnce([])
    vi.mocked(valuationApi.listScenarios).mockResolvedValue([
      { id: 'scenario-upside', valuation_id: 'val-scenarios', organization_id: 'org-1', name: 'Upside Case', description: 'Revenue beats plan', assumptions: { revenue_growth: 0.18 }, enterprise_value: 11800000, equity_value: 9300000, created_at: '2025-01-01', updated_at: null },
    ])
    vi.mocked(valuationApi.createScenario).mockResolvedValueOnce({
      id: 'scenario-upside',
      valuation_id: 'val-scenarios',
      organization_id: 'org-1',
      name: 'Upside Case',
      description: 'Revenue beats plan',
      assumptions: { revenue_growth: 0.18 },
      enterprise_value: 11800000,
      equity_value: 9300000,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: null,
    })

    renderSuite('/deals/deal-scenarios/valuations/val-scenarios')

    await waitFor(() => expect(screen.getByText(/£10,500,000/i)).toBeInTheDocument())
    await user.click(screen.getByRole('tab', { name: /scenarios/i }))
    await user.click(await screen.findByRole('button', { name: /add scenario/i }))

    await user.type(await screen.findByLabelText(/scenario name/i), 'Upside Case')
    await user.type(screen.getByLabelText(/description/i), 'Revenue beats plan')
    const assumptionsInput = screen.getByLabelText(/assumptions json/i)
    await user.clear(assumptionsInput)
    await user.paste('{"revenue_growth":0.18}')
    await user.click(screen.getByRole('button', { name: /save scenario/i }))

    await waitFor(() => {
      expect(valuationApi.createScenario).toHaveBeenCalledWith('deal-scenarios', 'val-scenarios', {
        name: 'Upside Case',
        description: 'Revenue beats plan',
        assumptions: { revenue_growth: 0.18 },
      })
    })

    expect(
      await screen.findByText(/scenario saved successfully/i),
    ).toBeInTheDocument()
    expect(await screen.findByText(/upside case/i)).toBeInTheDocument()
  }, 15000)

  it('shows validation error when scenario assumptions JSON is invalid', async () => {
    const user = userEvent.setup()
    vi.mocked(valuationApi.listValuations).mockResolvedValueOnce([
      { id: 'val-scenarios', enterprise_value: 10500000, equity_value: 8000000, deal_id: 'deal-scenarios', organization_id: 'org-1', forecast_years: 5, discount_rate: 12, terminal_growth_rate: 2.5, terminal_method: 'gordon_growth', cash_flows: [1000000, 1100000, 1200000, 1300000, 1400000], terminal_cash_flow: 1500000, net_debt: 500000, shares_outstanding: 1000000, implied_share_price: 75.0, created_by: 'user-1', created_at: '2025-01-01', updated_at: null }
    ])
    vi.mocked(valuationApi.listScenarios).mockResolvedValueOnce([])

    renderSuite('/deals/deal-scenarios/valuations/val-scenarios')

    await waitFor(() => expect(screen.getByText(/£10,500,000/i)).toBeInTheDocument())
    await user.click(screen.getByRole('tab', { name: /scenarios/i }))
    await user.click(await screen.findByRole('button', { name: /add scenario/i }))

    await user.type(await screen.findByLabelText(/scenario name/i), 'Broken JSON')
    await user.clear(screen.getByLabelText(/assumptions json/i))
    await user.paste('{not valid')
    await user.click(screen.getByRole('button', { name: /save scenario/i }))

    expect(await screen.findByText(/assumptions must be valid json/i)).toBeInTheDocument()
    expect(valuationApi.createScenario).not.toHaveBeenCalled()
  })

  it('fetches scenario list when scenarios tab opened', async () => {
    const user = userEvent.setup()
    vi.mocked(valuationApi.listValuations).mockResolvedValueOnce([
      { id: 'val-scenario', enterprise_value: 10500000, equity_value: 8000000, deal_id: 'deal-scenarios', organization_id: 'org-1', forecast_years: 5, discount_rate: 12, terminal_growth_rate: 2.5, terminal_method: 'gordon_growth', cash_flows: [1000000, 1100000, 1200000, 1300000, 1400000], terminal_cash_flow: 1500000, net_debt: 500000, shares_outstanding: 1000000, implied_share_price: 75.0, created_by: 'user-1', created_at: '2025-01-01', updated_at: null }
    ])
    vi.mocked(valuationApi.listScenarios).mockResolvedValueOnce([])

    renderSuite('/deals/deal-scenarios/valuations/val-scenario')

    await waitFor(() => expect(screen.getByText(/£10,500,000/i)).toBeInTheDocument())
    await user.click(screen.getByRole('tab', { name: /scenarios/i }))

    await waitFor(() => expect(valuationApi.listScenarios).toHaveBeenCalled())
  })

  it('shows detailed confirmation after queuing an export', async () => {
    const user = userEvent.setup()
    vi.mocked(valuationApi.listValuations).mockResolvedValueOnce([
      { id: 'val-export', enterprise_value: 10500000, equity_value: 8000000, deal_id: 'deal-export', organization_id: 'org-1', forecast_years: 5, discount_rate: 12, terminal_growth_rate: 2.5, terminal_method: 'gordon_growth', cash_flows: [1000000, 1100000, 1200000, 1300000, 1400000], terminal_cash_flow: 1500000, net_debt: 500000, shares_outstanding: 1000000, implied_share_price: 75.0, created_by: 'user-1', created_at: '2025-01-01', updated_at: null }
    ])
    vi.mocked(valuationApi.triggerExport).mockResolvedValueOnce({ task_id: 'task-1', status: 'queued', export_type: 'pdf', export_format: 'summary' })

    renderSuite('/deals/deal-export/valuations/val-export')

    await waitFor(() => expect(screen.getByText(/£10,500,000/i)).toBeInTheDocument())
    await user.click(screen.getByRole('tab', { name: /exports/i }))
    await user.click(screen.getByRole('button', { name: /queue export/i }))

    await waitFor(() => expect(valuationApi.triggerExport).toHaveBeenCalled())
    expect(
      await screen.findByText(/export queued: pdf \(summary\) · task id task-1/i),
    ).toBeInTheDocument()
  })

  it('shows upgrade messaging when export is blocked by entitlement', async () => {
    const user = userEvent.setup()
    vi.mocked(valuationApi.listValuations).mockResolvedValueOnce([
      { id: 'val-upgrade', enterprise_value: 10500000, equity_value: 8000000, deal_id: 'deal-upgrade', organization_id: 'org-1', forecast_years: 5, discount_rate: 12, terminal_growth_rate: 2.5, terminal_method: 'gordon_growth', cash_flows: [1000000, 1100000, 1200000, 1300000, 1400000], terminal_cash_flow: 1500000, net_debt: 500000, shares_outstanding: 1000000, implied_share_price: 75.0, created_by: 'user-1', created_at: '2025-01-01', updated_at: null }
    ])
    vi.mocked(valuationApi.triggerExport).mockRejectedValueOnce({
      response: {
        status: 403,
        data: {
          detail: {
            message: 'Upgrade to the Growth Plan to export valuations.',
            required_tier_label: 'Growth',
            upgrade_cta_url: 'https://app.example.com/upgrade',
          },
        },
      },
    } as any)

    renderSuite('/deals/deal-upgrade/valuations/val-upgrade')

    await waitFor(() => expect(screen.getByText(/10,500,000/i)).toBeInTheDocument())
    await user.click(screen.getByRole('tab', { name: /exports/i }))
    await user.click(screen.getByRole('button', { name: /queue export/i }))

    await waitFor(() => expect(valuationApi.triggerExport).toHaveBeenCalled())
    expect(
      await screen.findByText(/upgrade to the growth plan to export valuations/i),
    ).toBeInTheDocument()
    expect(screen.getByText(/available on the growth plan/i)).toBeInTheDocument()
    const upgradeLink = screen.getByRole('link', { name: /upgrade now/i })
    expect(upgradeLink).toHaveAttribute('href', 'https://app.example.com/upgrade')
    expect(upgradeLink).toHaveAttribute('target', '_blank')
  })

  it('displays export template selector with PDF, DOCX, and HTML options', async () => {
    const user = userEvent.setup()
    vi.mocked(valuationApi.listValuations).mockResolvedValueOnce([
      { id: 'val-template', enterprise_value: 10500000, equity_value: 8000000, deal_id: 'deal-template', organization_id: 'org-1', forecast_years: 5, discount_rate: 12, terminal_growth_rate: 2.5, terminal_method: 'gordon_growth', cash_flows: [1000000, 1100000, 1200000, 1300000, 1400000], terminal_cash_flow: 1500000, net_debt: 500000, shares_outstanding: 1000000, implied_share_price: 75.0, created_by: 'user-1', created_at: '2025-01-01', updated_at: null }
    ])

    renderSuite('/deals/deal-template/valuations/val-template')

    await waitFor(() => expect(screen.getByText(/£10,500,000/i)).toBeInTheDocument())
    await user.click(screen.getByRole('tab', { name: /exports/i }))

    // Template selector should be visible
    expect(await screen.findByLabelText(/export format/i)).toBeInTheDocument()
    expect(await screen.findByLabelText(/export template/i)).toBeInTheDocument()

    // Should have format options
    const formatSelect = await screen.findByLabelText(/export format/i)
    await user.click(formatSelect)
    expect(await screen.findByRole('option', { name: /pdf/i })).toBeInTheDocument()
    expect(await screen.findByRole('option', { name: /docx/i })).toBeInTheDocument()
    expect(await screen.findByRole('option', { name: /html/i })).toBeInTheDocument()
  })

  it('allows selecting export template (executive summary, detailed, custom)', async () => {
    const user = userEvent.setup()
    vi.mocked(valuationApi.listValuations).mockResolvedValueOnce([
      { id: 'val-template-select', enterprise_value: 10500000, equity_value: 8000000, deal_id: 'deal-template-select', organization_id: 'org-1', forecast_years: 5, discount_rate: 12, terminal_growth_rate: 2.5, terminal_method: 'gordon_growth', cash_flows: [1000000, 1100000, 1200000, 1300000, 1400000], terminal_cash_flow: 1500000, net_debt: 500000, shares_outstanding: 1000000, implied_share_price: 75.0, created_by: 'user-1', created_at: '2025-01-01', updated_at: null }
    ])
    vi.mocked(valuationApi.triggerExport).mockResolvedValueOnce({ task_id: 'task-2', status: 'queued', export_type: 'docx', export_format: 'executive_summary' })

    renderSuite('/deals/deal-template-select/valuations/val-template-select')

    await waitFor(() => expect(screen.getByText(/£10,500,000/i)).toBeInTheDocument())
    await user.click(screen.getByRole('tab', { name: /exports/i }))

    // Select DOCX format
    const formatSelect = await screen.findByLabelText(/export format/i)
    await user.selectOptions(formatSelect, 'excel')

    // Select executive summary template
    const templateSelect = await screen.findByLabelText(/export template/i)
    await user.selectOptions(templateSelect, 'summary')

    // Queue export
    await user.click(screen.getByRole('button', { name: /queue export/i }))

    await waitFor(() => {
      expect(valuationApi.triggerExport).toHaveBeenCalledWith('deal-template-select', 'val-template-select', 'excel', 'summary')
    })
  })

  it('displays scenario comparison chart with multiple scenarios', async () => {
    vi.mocked(valuationApi.listValuations).mockResolvedValueOnce([
      { id: 'val-chart', enterprise_value: 10500000, equity_value: 8000000, deal_id: 'deal-chart', organization_id: 'org-1', forecast_years: 5, discount_rate: 12, terminal_growth_rate: 2.5, terminal_method: 'gordon_growth', cash_flows: [1000000, 1100000, 1200000, 1300000, 1400000], terminal_cash_flow: 1500000, net_debt: 500000, shares_outstanding: 1000000, implied_share_price: 75.0, created_by: 'user-1', created_at: '2025-01-01', updated_at: null }
    ])
    vi.mocked(valuationApi.listScenarios).mockResolvedValueOnce([
      { id: 'scenario-base', valuation_id: 'val-chart', organization_id: 'org-1', name: 'Base Case', description: 'Baseline assumptions', assumptions: {}, enterprise_value: 10500000, equity_value: 8000000, created_at: '2025-01-01', updated_at: null },
      { id: 'scenario-upside', valuation_id: 'val-chart', organization_id: 'org-1', name: 'Upside Case', description: 'Optimistic growth', assumptions: { revenue_growth: 0.18 }, enterprise_value: 12500000, equity_value: 9500000, created_at: '2025-01-01', updated_at: null },
      { id: 'scenario-downside', valuation_id: 'val-chart', organization_id: 'org-1', name: 'Downside Case', description: 'Conservative assumptions', assumptions: { revenue_growth: 0.08 }, enterprise_value: 9000000, equity_value: 7000000, created_at: '2025-01-01', updated_at: null },
    ])

    renderSuite('/deals/deal-chart/valuations/val-chart')

    await waitFor(() => expect(screen.getByText(/£10,500,000/i)).toBeInTheDocument())
    await userEvent.setup().click(screen.getByRole('tab', { name: /scenarios/i }))

    // Scenario comparison chart should be visible
    await waitFor(() => {
      expect(screen.getByText(/scenario comparison/i)).toBeInTheDocument()
    })

    // Chart should display all three scenarios
    expect(screen.getAllByText(/base case/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/upside case/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/downside case/i).length).toBeGreaterThanOrEqual(1)

    // Chart should show enterprise values in scenario details
    expect(await screen.findByText(/£10,500,000/i)).toBeInTheDocument()
    expect(await screen.findByText(/£12,500,000/i)).toBeInTheDocument()
    expect(await screen.findByText(/£9,000,000/i)).toBeInTheDocument()
  })

  // TODO: Add 403 error handling with upgrade message to component
  it('guards valuation workspace for growth-tier access with upgrade messaging', async () => {
    vi.mocked(valuationApi.listValuations).mockRejectedValueOnce({
      response: {
        status: 403,
        data: {
          detail: {
            message: 'Upgrade to Growth tier to unlock valuation analytics and exports.',
            upgrade_cta_url: '/billing/upgrade',
          },
        },
      },
    })

    renderSuite('/deals/deal-403/valuations/val-403')

    await waitFor(() => expect(screen.getByText(/upgrade required/i)).toBeInTheDocument())
    expect(
      screen.getByText(/upgrade to growth tier to unlock valuation analytics and exports/i),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /view pricing plans/i })).toHaveAttribute('href', '/billing/upgrade')
  })

  it('runs Monte Carlo simulation and displays percentile summary', async () => {
    const user = userEvent.setup()
    vi.mocked(valuationApi.listValuations).mockResolvedValueOnce([
      {
        id: 'val-sim',
        enterprise_value: 10500000,
        equity_value: 8000000,
        deal_id: 'deal-sim',
        organization_id: 'org-1',
        forecast_years: 5,
        discount_rate: 12,
        terminal_growth_rate: 2.5,
        terminal_method: 'gordon_growth',
        cash_flows: [1000000, 1100000, 1200000, 1300000, 1400000],
        terminal_cash_flow: 1500000,
        net_debt: 500000,
        shares_outstanding: 1000000,
        implied_share_price: 75.0,
        created_by: 'user-1',
        created_at: '2025-01-01',
        updated_at: null,
      },
    ])
    vi.mocked(valuationApi.runMonteCarlo).mockResolvedValueOnce({
      iterations: 250,
      seed: 42,
      mean_enterprise_value: 12500000,
      percentiles: {
        p10: 9000000,
        p50: 12000000,
        p90: 15000000,
      },
    })

    renderSuite('/deals/deal-sim/valuations/val-sim')

    await waitFor(() => expect(screen.getByText(/£10,500,000/i)).toBeInTheDocument())

    const iterationsInput = screen.getByLabelText(/iterations/i)
    await user.clear(iterationsInput)
    await user.type(iterationsInput, '250')

    const seedInput = screen.getByLabelText(/seed/i)
    await user.type(seedInput, '42')

    await user.click(screen.getByRole('button', { name: /run simulation/i }))

    await waitFor(() => {
      expect(valuationApi.runMonteCarlo).toHaveBeenCalledWith('deal-sim', 'val-sim', {
        iterations: 250,
        seed: 42,
      })
    })

    expect(await screen.findByText('250')).toBeInTheDocument()
    expect(await screen.findByText('£12,500,000')).toBeInTheDocument()
    expect(await screen.findByText('£9,000,000')).toBeInTheDocument()
    expect(await screen.findByText('£15,000,000')).toBeInTheDocument()
  })
})

