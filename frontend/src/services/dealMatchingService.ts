/**
 * Deal Matching Service - DEV-018 API Client
 * Handles all API calls for intelligent deal matching
 */

import api from './api';

export interface MatchCriteria {
  id: string;
  name: string;
  deal_type: 'buy_side' | 'sell_side';
  industries: string[];
  min_deal_size: string;
  max_deal_size: string;
  geographies?: string[];
  structures?: string[];
  negative_filters?: Record<string, unknown>;
  weights?: Record<string, number>;
  created_at: string;
}

export interface MatchCriteriaCreate {
  name: string;
  deal_type: 'buy_side' | 'sell_side';
  industries: string[];
  min_deal_size: number;
  max_deal_size: number;
  geographies?: string[];
  structures?: string[];
  negative_filters?: Record<string, unknown>;
  weights?: Record<string, number>;
}

export interface DealMatch {
  deal_id: string;
  deal_name: string;
  score: number;
  confidence: 'high' | 'medium' | 'low';
  explanation: {
    industry_match: { score: number; reason: string };
    size_match: { score: number; reason: string };
    geography_match: { score: number; reason: string };
    description_match: { score: number; reason: string };
  };
}

export interface FindMatchesRequest {
  criteria: {
    deal_type: string;
    industries: string[];
    min_deal_size: number;
    max_deal_size: number;
    geographies?: string[];
  };
  min_score?: number;
  limit?: number;
}

export interface FindMatchesResponse {
  matches: DealMatch[];
  total_count: number;
}

/**
 * Fetch all saved matching criteria for the current organization
 */
export async function fetchMatchCriteria(): Promise<MatchCriteria[]> {
  const response = await api.get<MatchCriteria[]>('/match-criteria');
  return response.data;
}

/**
 * Create new matching criteria
 */
export async function createMatchCriteria(criteria: MatchCriteriaCreate): Promise<MatchCriteria> {
  const response = await api.post<MatchCriteria>('/match-criteria', criteria);
  return response.data;
}

/**
 * Find matches for a specific deal using criteria
 */
export async function findMatchesForDeal(
  dealId: string,
  request: FindMatchesRequest
): Promise<FindMatchesResponse> {
  const response = await api.post<FindMatchesResponse>(
    `/deals/${dealId}/find-matches`,
    request
  );
  return response.data;
}

/**
 * List stored matches for a specific deal
 */
export async function listDealMatches(dealId: string): Promise<DealMatch[]> {
  const response = await api.get<DealMatch[]>(`/deals/${dealId}/matches`);
  return response.data;
}
