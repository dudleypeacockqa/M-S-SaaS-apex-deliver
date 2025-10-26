/**
 * Financial Intelligence API Client - DEV-010
 * Handles financial ratio calculations, connections, and narratives
 */

import api from '../api';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface FinancialRatiosResponse {
  deal_id: string;
  organization_id: string;

  // Liquidity Ratios (5)
  current_ratio?: number;
  quick_ratio?: number;
  cash_ratio?: number;
  operating_cash_flow_ratio?: number;
  defensive_interval_ratio?: number;

  // Profitability Ratios (8)
  gross_profit_margin?: number;
  operating_profit_margin?: number;
  net_profit_margin?: number;
  return_on_assets?: number;
  return_on_equity?: number;
  return_on_invested_capital?: number;
  ebitda_margin?: number;
  ebit_margin?: number;

  // Leverage Ratios (6)
  debt_to_equity?: number;
  debt_to_assets?: number;
  equity_multiplier?: number;
  interest_coverage?: number;
  debt_service_coverage?: number;
  financial_leverage?: number;

  calculated_at: string;
  data_quality: 'complete' | 'partial' | 'minimal';
}

export interface FinancialDataInput {
  // Balance Sheet
  current_assets?: number;
  current_liabilities?: number;
  inventory?: number;
  cash?: number;
  marketable_securities?: number;
  receivables?: number;
  total_assets?: number;
  total_debt?: number;
  total_equity?: number;
  shareholders_equity?: number;

  // Income Statement
  revenue?: number;
  cogs?: number;
  operating_income?: number;
  ebit?: number;
  ebitda?: number;
  net_income?: number;
  interest_expense?: number;

  // Cash Flow Statement
  operating_cash_flow?: number;
  daily_operating_expenses?: number;
  total_debt_service?: number;

  // Additional
  nopat?: number;
  invested_capital?: number;
}

export interface FinancialConnectionResponse {
  id: string;
  deal_id: string;
  platform: 'xero' | 'quickbooks';
  connection_status: 'active' | 'expired' | 'revoked' | 'error';
  last_sync_at?: string;
  created_at: string;
}

export interface FinancialNarrativeResponse {
  id: string;
  deal_id: string;
  summary: string;
  strengths?: string[];
  weaknesses?: string[];
  red_flags?: string[];
  readiness_score?: number;
  readiness_score_breakdown?: {
    data_quality_score?: number;
    financial_health_score?: number;
    growth_trajectory_score?: number;
    risk_assessment_score?: number;
  };
  generated_at: string;
  ai_model: string;
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Calculate financial ratios from provided financial data
 */
export async function calculateFinancialRatios(
  dealId: string,
  financialData: FinancialDataInput
): Promise<FinancialRatiosResponse> {
  const response = await api.post<FinancialRatiosResponse>(
    `/deals/${dealId}/financial/calculate-ratios`,
    financialData
  );
  return response.data;
}

/**
 * Get financial connections for a deal
 */
export async function getFinancialConnections(
  dealId: string
): Promise<FinancialConnectionResponse[]> {
  const response = await api.get<FinancialConnectionResponse[]>(
    `/deals/${dealId}/financial/connections`
  );
  return response.data;
}

/**
 * Get AI-generated financial narrative for a deal
 */
export async function getFinancialNarrative(
  dealId: string
): Promise<FinancialNarrativeResponse> {
  const response = await api.get<FinancialNarrativeResponse>(
    `/deals/${dealId}/financial/narrative`
  );
  return response.data;
}

/**
 * Get stored financial ratios for a deal
 */
export async function getFinancialRatios(
  dealId: string
): Promise<FinancialRatiosResponse> {
  const response = await api.get<FinancialRatiosResponse>(
    `/deals/${dealId}/financial/ratios`
  );
  return response.data;
}

export default {
  calculateFinancialRatios,
  getFinancialConnections,
  getFinancialNarrative,
  getFinancialRatios,
};
