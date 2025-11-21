/**
 * Campaign API Client
 * 
 * TypeScript client for campaign management API endpoints.
 */
import { apiClient } from './client'

// Types
export interface Campaign {
  id: number
  user_id: string
  name: string
  type: 'email' | 'sms' | 'mixed' | 'voice' | 'linkedin' | 'multi_channel'
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled'
  subject?: string
  content: string
  template_id?: number
  settings?: Record<string, any>
  scheduled_at?: string
  started_at?: string
  sent_at?: string
  completed_at?: string
  total_recipients: number
  sent_count: number
  opened_count: number
  clicked_count: number
  created_at: string
  updated_at: string
}

export interface CampaignCreate {
  name: string
  type: 'email' | 'sms' | 'mixed' | 'voice' | 'linkedin' | 'multi_channel'
  subject?: string
  content: string
  template_id?: number
  settings?: Record<string, any>
}

export interface CampaignUpdate {
  name?: string
  status?: string
  subject?: string
  content?: string
  template_id?: number
  settings?: Record<string, any>
  scheduled_at?: string
}

export interface CampaignListResponse {
  items: Campaign[]
  total: number
  page: number
  per_page: number
}

export interface CampaignAnalytics {
  total_recipients: number
  sent_count: number
  opened_count: number
  clicked_count: number
  open_rate: number
  click_rate: number
  click_to_open_rate: number
  total_activities: number
}

export interface CampaignActivity {
  id: number
  organization_id: string
  campaign_id: number
  contact_id: number
  activity_type: string
  status: string
  metadata?: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at: string
}

export interface CampaignActivityListResponse {
  items: CampaignActivity[]
  total: number
  page: number
  per_page: number
}

export interface ScheduleCampaignRequest {
  schedule_at: string
}

// API Functions
export async function listCampaigns(params?: {
  page?: number
  per_page?: number
  status?: string
  type?: string
}): Promise<CampaignListResponse> {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.per_page) queryParams.append('per_page', params.per_page.toString())
  if (params?.status) queryParams.append('status', params.status)
  if (params?.type) queryParams.append('type', params.type)

  const query = queryParams.toString()
  return apiClient.get<CampaignListResponse>(`/api/master-admin/campaigns${query ? `?${query}` : ''}`)
}

export async function getCampaign(campaignId: number): Promise<Campaign> {
  return apiClient.get<Campaign>(`/api/master-admin/campaigns/${campaignId}`)
}

export async function createCampaign(campaign: CampaignCreate): Promise<Campaign> {
  return apiClient.post<Campaign>('/api/master-admin/campaigns', campaign)
}

export async function updateCampaign(campaignId: number, update: CampaignUpdate): Promise<Campaign> {
  return apiClient.put<Campaign>(`/api/master-admin/campaigns/${campaignId}`, update)
}

export async function deleteCampaign(campaignId: number): Promise<void> {
  return apiClient.delete<void>(`/api/master-admin/campaigns/${campaignId}`)
}

export async function scheduleCampaign(campaignId: number, scheduleAt: string): Promise<Campaign> {
  return apiClient.post<Campaign>(`/api/master-admin/campaigns/${campaignId}/schedule`, {
    schedule_at: scheduleAt,
  })
}

export async function executeCampaign(campaignId: number): Promise<{ sent_count: number; total_recipients: number }> {
  return apiClient.post<{ sent_count: number; total_recipients: number }>(`/api/master-admin/campaigns/${campaignId}/execute`)
}

export async function getCampaignAnalytics(campaignId: number): Promise<CampaignAnalytics> {
  return apiClient.get<CampaignAnalytics>(`/api/master-admin/campaigns/${campaignId}/analytics`)
}

export async function getCampaignActivities(campaignId: number, params?: {
  page?: number
  per_page?: number
}): Promise<CampaignActivityListResponse> {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.per_page) queryParams.append('per_page', params.per_page.toString())

  const query = queryParams.toString()
  return apiClient.get<CampaignActivityListResponse>(`/api/master-admin/campaigns/${campaignId}/activities${query ? `?${query}` : ''}`)
}

