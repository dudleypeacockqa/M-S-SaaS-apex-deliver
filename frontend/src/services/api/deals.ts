/**
 * Deals API Client
 *
 * Provides functions for calling deal CRUD endpoints.
 * All endpoints require authentication and are organization-scoped.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Get authorization headers with Clerk JWT token
 */
async function getAuthHeaders(): Promise<HeadersInit> {
  // In production, this would get the token from Clerk
  // For now, we'll implement a basic version
  return {
    'Content-Type': 'application/json',
  };
}

/**
 * Deal Types
 */
export type DealStage =
  | 'sourcing'
  | 'evaluation'
  | 'due_diligence'
  | 'negotiation'
  | 'closing'
  | 'won'
  | 'lost';

export interface Deal {
  id: string;
  name: string;
  target_company: string;
  industry: string | null;
  deal_size: number | null;
  currency: string;
  stage: DealStage;
  owner_id: string;
  organization_id: string;
  description: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DealCreate {
  name: string;
  target_company: string;
  industry?: string;
  deal_size?: number;
  currency?: string;
  stage?: DealStage;
  description?: string;
}

export interface DealUpdate {
  name?: string;
  target_company?: string;
  industry?: string;
  deal_size?: number;
  currency?: string;
  stage?: DealStage;
  description?: string;
}

export interface DealListParams {
  page?: number;
  per_page?: number;
  stage?: DealStage;
  search?: string;
  sort_by?: 'created_at' | 'updated_at' | 'deal_size' | 'name';
  sort_order?: 'asc' | 'desc';
  include_archived?: boolean;
}

export interface PaginatedDeals {
  items: Deal[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

/**
 * Deal CRUD Functions
 */

/**
 * Create a new deal
 */
export async function createDeal(deal: DealCreate): Promise<Deal> {
  const response = await fetch(`${API_BASE_URL}/api/deals`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(deal),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || `Failed to create deal: ${response.statusText}`);
  }

  return response.json();
}

/**
 * List deals with filters and pagination
 */
export async function listDeals(params: DealListParams = {}): Promise<PaginatedDeals> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.append('page', params.page.toString());
  if (params.per_page) searchParams.append('per_page', params.per_page.toString());
  if (params.stage) searchParams.append('stage', params.stage);
  if (params.search) searchParams.append('search', params.search);
  if (params.sort_by) searchParams.append('sort_by', params.sort_by);
  if (params.sort_order) searchParams.append('sort_order', params.sort_order);
  if (params.include_archived === true) searchParams.append('include_archived', 'true');

  const url = `${API_BASE_URL}/api/deals?${searchParams}`;
  const response = await fetch(url, {
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch deals: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get a single deal by ID
 */
export async function getDeal(dealId: string): Promise<Deal> {
  const response = await fetch(`${API_BASE_URL}/api/deals/${dealId}`, {
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Deal not found');
    }
    if (response.status === 403) {
      throw new Error('You do not have permission to view this deal');
    }
    throw new Error(`Failed to fetch deal: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Update a deal
 */
export async function updateDeal(dealId: string, updates: DealUpdate): Promise<Deal> {
  const response = await fetch(`${API_BASE_URL}/api/deals/${dealId}`, {
    method: 'PUT',
    headers: await getAuthHeaders(),
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || `Failed to update deal: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Archive a deal (soft delete)
 */
export async function archiveDeal(dealId: string): Promise<{ message: string; deal_id: string }> {
  const response = await fetch(`${API_BASE_URL}/api/deals/${dealId}/archive`, {
    method: 'POST',
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to archive deal: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Unarchive a deal
 */
export async function unarchiveDeal(dealId: string): Promise<Deal> {
  const response = await fetch(`${API_BASE_URL}/api/deals/${dealId}/unarchive`, {
    method: 'POST',
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to unarchive deal: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Helper function to format currency
 */
export function formatCurrency(amount: number | null, currency: string = 'GBP'): string {
  if (amount === null) return 'N/A';

  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Helper function to get stage display name
 */
export function getStageDisplayName(stage: DealStage): string {
  const stageNames: Record<DealStage, string> = {
    sourcing: 'Sourcing',
    evaluation: 'Evaluation',
    due_diligence: 'Due Diligence',
    negotiation: 'Negotiation',
    closing: 'Closing',
    won: 'Won',
    lost: 'Lost',
  };
  return stageNames[stage] || stage;
}

/**
 * Helper function to get stage color
 */
export function getStageColor(stage: DealStage): string {
  const stageColors: Record<DealStage, string> = {
    sourcing: '#64748b',
    evaluation: '#3b82f6',
    due_diligence: '#8b5cf6',
    negotiation: '#f59e0b',
    closing: '#10b981',
    won: '#16a34a',
    lost: '#dc2626',
  };
  return stageColors[stage] || '#64748b';
}
