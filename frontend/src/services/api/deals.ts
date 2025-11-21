/**
 * Deals API Client
 *
 * Provides functions for calling deal CRUD endpoints.
 * All endpoints require authentication and are organization-scoped.
 */

import { apiClient } from './client'

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
  return apiClient.post<Deal>('/api/deals', deal)
}

/**
 * List deals with filters and pagination
 */
export async function listDeals(params: DealListParams = {}): Promise<PaginatedDeals> {
  const searchParams = new URLSearchParams()

  if (params.page) searchParams.append('page', params.page.toString())
  if (params.per_page) searchParams.append('per_page', params.per_page.toString())
  if (params.stage) searchParams.append('stage', params.stage)
  if (params.search) searchParams.append('search', params.search)
  if (params.sort_by) searchParams.append('sort_by', params.sort_by)
  if (params.sort_order) searchParams.append('sort_order', params.sort_order)
  if (params.include_archived === true) searchParams.append('include_archived', 'true')

  return apiClient.get<PaginatedDeals>(`/api/deals?${searchParams}`)
}

/**
 * Get a single deal by ID
 */
export async function getDeal(dealId: string): Promise<Deal> {
  return apiClient.get<Deal>(`/api/deals/${dealId}`)
}

/**
 * Update a deal
 */
export async function updateDeal(dealId: string, updates: DealUpdate): Promise<Deal> {
  return apiClient.put<Deal>(`/api/deals/${dealId}`, updates)
}

/**
 * Update deal stage (for Kanban drag-drop)
 */
export async function updateDealStage(dealId: string, stage: DealStage): Promise<Deal> {
  return apiClient.put<Deal>(`/api/deals/${dealId}/stage`, { stage })
}

/**
 * Archive a deal (soft delete)
 */
export async function archiveDeal(dealId: string): Promise<{ message: string; deal_id: string }> {
  return apiClient.post<{ message: string; deal_id: string }>(`/api/deals/${dealId}/archive`)
}

/**
 * Unarchive a deal
 */
export async function unarchiveDeal(dealId: string): Promise<Deal> {
  return apiClient.post<Deal>(`/api/deals/${dealId}/unarchive`)
}

/**
 * Helper function to format currency
 */
export function formatCurrency(amount: number | null, currency: string = 'GBP'): string {
  if (amount === null || Number.isNaN(amount)) return 'N/A';

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
