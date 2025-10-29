const API_BASE = '/api';

export interface FindMatchesRequest {
  criteria_id?: string;
  criteria?: any;
  top_n?: number;
  min_score?: number;
}

export interface FindMatchesResponse {
  matches: any[];
  total_count: number;
}

export interface SaveMatchRequest {
  dealId: string;
  matchedDealId: string;
  score: number;
  confidence: string;
  explanation: any;
}

export async function findMatchesForDeal(
  dealId: string,
  request: FindMatchesRequest
): Promise<FindMatchesResponse> {
  const response = await fetch(`${API_BASE}/deals/${dealId}/find-matches`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to find matches');
  }

  return response.json();
}

export async function saveMatch(data: SaveMatchRequest): Promise<any> {
  const response = await fetch(`${API_BASE}/deal-matching/matches`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    },
    body: JSON.stringify({
      deal_id: data.dealId,
      matched_deal_id: data.matchedDealId,
      score: data.score,
      confidence: data.confidence,
      explanation: data.explanation,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to save match');
  }

  return response.json();
}

export async function updateMatchStatus(
  matchId: string,
  status: 'saved' | 'passed'
): Promise<any> {
  const response = await fetch(`${API_BASE}/deal-matching/matches/${matchId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error('Failed to update match status');
  }

  return response.json();
}
