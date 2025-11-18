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
  
  const response = await apiClient.get(`/master-admin/campaigns?${queryParams.toString()}`)
  return response.data
}

export async function getCampaign(campaignId: number): Promise<Campaign> {
  const response = await apiClient.get(`/master-admin/campaigns/${campaignId}`)
  return response.data
}

export async function createCampaign(campaign: CampaignCreate): Promise<Campaign> {
  const response = await apiClient.post('/master-admin/campaigns', campaign)
  return response.data
}

export async function updateCampaign(campaignId: number, update: CampaignUpdate): Promise<Campaign> {
  const response = await apiClient.put(`/master-admin/campaigns/${campaignId}`, update)
  return response.data
}

export async function deleteCampaign(campaignId: number): Promise<void> {
  await apiClient.delete(`/master-admin/campaigns/${campaignId}`)
}

export async function scheduleCampaign(campaignId: number, scheduleAt: string): Promise<Campaign> {
  const response = await apiClient.post(`/master-admin/campaigns/${campaignId}/schedule`, {
    schedule_at: scheduleAt,
  })
  return response.data
}

export async function executeCampaign(campaignId: number): Promise<{ sent_count: number; total_recipients: number }> {
  const response = await apiClient.post(`/master-admin/campaigns/${campaignId}/execute`)
  return response.data
}

export async function getCampaignAnalytics(campaignId: number): Promise<CampaignAnalytics> {
  const response = await apiClient.get(`/master-admin/campaigns/${campaignId}/analytics`)
  return response.data
}

export async function getCampaignActivities(campaignId: number, params?: {
  page?: number
  per_page?: number
}): Promise<CampaignActivityListResponse> {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.per_page) queryParams.append('per_page', params.per_page.toString())
  
  const response = await apiClient.get(`/master-admin/campaigns/${campaignId}/activities?${queryParams.toString()}`)
  return response.data
}

