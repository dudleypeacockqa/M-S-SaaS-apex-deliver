import api from './api'

export interface MatchCriteria {
  id: string
  user_id: string
  organization_id: string
  name: string
  deal_type: 'buy_side' | 'sell_side'
  industries: string[]
  min_deal_size: string
  max_deal_size: string
  geographies?: string[]
  structures?: string[]
  negative_filters?: Record<string, unknown>
  weights?: Record<string, number>
  created_at: string
}

export interface MatchExplanationDetail {
  score: number
  reason: string
}

export interface MatchExplanation {
  industry_match: MatchExplanationDetail
  size_match: MatchExplanationDetail
  geography_match: MatchExplanationDetail
  description_match: MatchExplanationDetail
}

export interface DealMatch {
  id?: string
  dealId: string
  matchedDealId?: string
  dealName: string
  score: number
  confidence: 'high' | 'medium' | 'low'
  explanation: MatchExplanation
  status?: string
  createdAt?: string
}

export interface FindMatchesRequest {
  criteria_id?: string
  criteria?: Record<string, unknown>
  top_n?: number
  min_score?: number
}

export interface FindMatchesResponse {
  matches: DealMatch[]
  total_count: number
}

type MatchCriteriaDto = MatchCriteria

type MatchDto = {
  id?: string
  deal_id: string
  matched_deal_id?: string
  deal_name?: string
  match_score?: number
  score?: number
  confidence: 'high' | 'medium' | 'low'
  explanation?: Record<string, { score?: number; reason?: string }>
  status?: string
  created_at?: string
}

const fallbackDetail: MatchExplanationDetail = { score: 0, reason: 'No data provided.' }

function normalizeDetail(detail?: { score?: number; reason?: string }): MatchExplanationDetail {
  if (!detail) {
    return fallbackDetail
  }
  const score = typeof detail.score === 'number' ? detail.score : 0
  const reason = detail.reason || fallbackDetail.reason
  return { score, reason }
}

function transformMatch(dto: MatchDto): DealMatch {
  const explanation = dto.explanation || {}
  return {
    id: dto.id,
    dealId: dto.deal_id,
    matchedDealId: dto.matched_deal_id,
    dealName: dto.deal_name || dto.matched_deal_id || 'Unknown deal',
    score: typeof dto.score === 'number' ? dto.score : dto.match_score ?? 0,
    confidence: dto.confidence,
    explanation: {
      industry_match: normalizeDetail(explanation.industry_match),
      size_match: normalizeDetail(explanation.size_match),
      geography_match: normalizeDetail(explanation.geography_match),
      description_match: normalizeDetail(explanation.description_match),
    },
    status: dto.status,
    createdAt: dto.created_at,
  }
}

export async function fetchMatchCriteria(): Promise<MatchCriteria[]> {
  const { data } = await api.get<MatchCriteriaDto[]>('/match-criteria')
  return data
}

export async function createMatchCriteria(payload: Omit<MatchCriteria, 'id' | 'user_id' | 'organization_id' | 'created_at'>): Promise<MatchCriteria> {
  const { data } = await api.post<MatchCriteriaDto>('/match-criteria', payload)
  return data
}

export async function findMatchesForDeal(
  dealId: string,
  request: FindMatchesRequest,
): Promise<FindMatchesResponse> {
  const { data } = await api.post<{ matches: MatchDto[]; total_count: number }>(
    `/deals/${dealId}/find-matches`,
    request,
  )

  return {
    matches: (data.matches || []).map(transformMatch),
    total_count: data.total_count ?? data.matches?.length ?? 0,
  }
}

export async function listDealMatches(dealId: string): Promise<DealMatch[]> {
  const { data } = await api.get<MatchDto[]>(`/deals/${dealId}/matches`)
  return (data || []).map(transformMatch)
}
