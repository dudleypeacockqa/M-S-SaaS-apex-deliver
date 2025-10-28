export interface Valuation {
  id: string
  deal_id: string
  organization_id: string
  forecast_years: number
  discount_rate: number
  terminal_growth_rate: number | null
  terminal_ebitda_multiple: number | null
  terminal_method: 'gordon_growth' | 'exit_multiple'
  cash_flows: number[]
  terminal_cash_flow: number
  enterprise_value: number | null
  equity_value: number | null
  implied_share_price: number | null
  net_debt: number
  shares_outstanding: number | null
  created_by: string
  created_at: string
  updated_at: string | null
}

export interface ValuationCreateRequest {
  forecast_years: number
  discount_rate: number
  terminal_growth_rate?: number | null
  terminal_ebitda_multiple?: number | null
  terminal_method: 'gordon_growth' | 'exit_multiple'
  cash_flows: number[]
  terminal_cash_flow: number
  net_debt?: number
  shares_outstanding?: number | null
}

export type ValuationUpdateRequest = Partial<ValuationCreateRequest>

export interface ComparableCompany {
  id: string
  valuation_id: string
  organization_id: string
  company_name: string
  ev_revenue_multiple: number | null
  ev_ebitda_multiple: number | null
  weight: number
  is_outlier: string
  created_at: string
  updated_at: string | null
  notes: string | null
}

export interface ComparableCompanyCreate {
  company_name: string
  ev_revenue_multiple?: number | null
  ev_ebitda_multiple?: number | null
  weight?: number
  is_outlier?: 'true' | 'false'
  notes?: string | null
}

export interface ComparableSummaryMetrics {
  count: number
  min: number | null
  max: number | null
  median: number | null
  weighted_average: number | null
  implied_enterprise_value_min: number | null
  implied_enterprise_value_median: number | null
  implied_enterprise_value_max: number | null
  implied_enterprise_value_weighted: number | null
  excluded_outliers: number
}

export interface ComparableSummaryResponse {
  ev_revenue: ComparableSummaryMetrics
  ev_ebitda: ComparableSummaryMetrics
}

export interface PrecedentTransaction {
  id: string
  valuation_id: string
  organization_id: string
  target_company: string
  acquirer_company: string
  ev_ebitda_multiple: number | null
  ev_revenue_multiple: number | null
  weight: number
  is_stale: string
  announcement_date: string | null
  created_at: string
  updated_at: string | null
}

export interface PrecedentTransactionCreate {
  target_company: string
  acquirer_company: string
  ev_ebitda_multiple?: number | null
  ev_revenue_multiple?: number | null
  weight?: number
  announcement_date?: string | null
  notes?: string | null
}

export interface PrecedentSummaryMetrics {
  count: number
  min: number | null
  max: number | null
  median: number | null
  weighted_average: number | null
  implied_enterprise_value_median: number | null
  implied_enterprise_value_weighted: number | null
}

export interface PrecedentSummaryResponse {
  ev_ebitda: PrecedentSummaryMetrics
  stale_count: number
}

export interface ValuationScenario {
  id: string
  valuation_id: string
  organization_id: string
  name: string
  description: string | null
  assumptions: Record<string, unknown>
  enterprise_value: number | null
  equity_value: number | null
  created_at: string
  updated_at: string | null
}

export interface ScenarioCreateRequest {
  name: string
  description?: string | null
  assumptions: Record<string, unknown>
}

export interface ScenarioSummaryResponse {
  count: number
  enterprise_value_range: {
    min: number | null
    max: number | null
    median: number | null
  }
  equity_value_range: {
    min: number | null
    max: number | null
    median: number | null
  }
}

export interface MonteCarloRequest {
  iterations?: number
  seed?: number
}

export interface MonteCarloResponse {
  iterations: number
  seed: number | null
  mean_enterprise_value: number
  percentiles: {
    p10: number
    p50: number
    p90: number
  }
}

export interface ValuationExportResponse {
  status: string
  task_id: string
  export_type: 'pdf' | 'excel'
  export_format: string | null
}

import { api } from './api'

export async function listValuations(dealId: string): Promise<Valuation[]> {
  const response = await api.get<Valuation[]>(`/deals/${dealId}/valuations`)
  return response.data
}

export async function createValuation(dealId: string, payload: ValuationCreateRequest): Promise<Valuation> {
  const response = await api.post<Valuation>(`/deals/${dealId}/valuations`, payload)
  return response.data
}

export async function updateValuation(
  dealId: string,
  valuationId: string,
  payload: ValuationUpdateRequest,
): Promise<Valuation> {
  const response = await api.put<Valuation>(`/deals/${dealId}/valuations/${valuationId}`, payload)
  return response.data
}

export async function deleteValuation(dealId: string, valuationId: string): Promise<void> {
  await api.delete(`/deals/${dealId}/valuations/${valuationId}`)
}

export async function listComparableCompanies(
  dealId: string,
  valuationId: string,
): Promise<ComparableCompany[]> {
  const response = await api.get<ComparableCompany[]>(
    `/deals/${dealId}/valuations/${valuationId}/comparables`,
  )
  return response.data
}

export async function addComparableCompany(
  dealId: string,
  valuationId: string,
  payload: ComparableCompanyCreate,
): Promise<ComparableCompany> {
  const response = await api.post<ComparableCompany>(
    `/deals/${dealId}/valuations/${valuationId}/comparables`,
    payload,
  )
  return response.data
}

export async function getComparableSummary(
  dealId: string,
  valuationId: string,
): Promise<ComparableSummaryResponse> {
  const response = await api.get<ComparableSummaryResponse>(
    `/deals/${dealId}/valuations/${valuationId}/comparables/summary`,
  )
  return response.data
}

export async function listPrecedentTransactions(
  dealId: string,
  valuationId: string,
): Promise<PrecedentTransaction[]> {
  const response = await api.get<PrecedentTransaction[]>(
    `/deals/${dealId}/valuations/${valuationId}/transactions`,
  )
  return response.data
}

export async function addPrecedentTransaction(
  dealId: string,
  valuationId: string,
  payload: PrecedentTransactionCreate,
): Promise<PrecedentTransaction> {
  const response = await api.post<PrecedentTransaction>(
    `/deals/${dealId}/valuations/${valuationId}/transactions`,
    payload,
  )
  return response.data
}

export async function getPrecedentSummary(
  dealId: string,
  valuationId: string,
): Promise<PrecedentSummaryResponse> {
  const response = await api.get<PrecedentSummaryResponse>(
    `/deals/${dealId}/valuations/${valuationId}/transactions/summary`,
  )
  return response.data
}

export async function listScenarios(
  dealId: string,
  valuationId: string,
): Promise<ValuationScenario[]> {
  const response = await api.get<ValuationScenario[]>(
    `/deals/${dealId}/valuations/${valuationId}/scenarios`,
  )
  return response.data
}

export async function createScenario(
  dealId: string,
  valuationId: string,
  payload: ScenarioCreateRequest,
): Promise<ValuationScenario> {
  const response = await api.post<ValuationScenario>(
    `/deals/${dealId}/valuations/${valuationId}/scenarios`,
    payload,
  )
  return response.data
}

export async function getScenarioSummary(
  dealId: string,
  valuationId: string,
): Promise<ScenarioSummaryResponse> {
  const response = await api.get<ScenarioSummaryResponse>(
    `/deals/${dealId}/valuations/${valuationId}/scenarios/summary`,
  )
  return response.data
}

export async function runMonteCarlo(
  dealId: string,
  valuationId: string,
  payload: MonteCarloRequest,
): Promise<MonteCarloResponse> {
  const response = await api.post<MonteCarloResponse>(
    `/deals/${dealId}/valuations/${valuationId}/monte-carlo`,
    payload,
  )
  return response.data
}

export async function triggerExport(
  dealId: string,
  valuationId: string,
  exportType: 'pdf' | 'excel',
  exportFormat: string | null,
): Promise<ValuationExportResponse> {
  const response = await api.post<ValuationExportResponse>(
    `/deals/${dealId}/valuations/${valuationId}/exports`,
    {
      export_type: exportType,
      export_format: exportFormat,
    },
  )
  return response.data
}

export default {
  listValuations,
  createValuation,
  updateValuation,
  deleteValuation,
  listComparableCompanies,
  addComparableCompany,
  getComparableSummary,
  listPrecedentTransactions,
  addPrecedentTransaction,
  getPrecedentSummary,
  listScenarios,
  createScenario,
  getScenarioSummary,
  runMonteCarlo,
  triggerExport,
}
