/**
 * Template API Client
 * 
 * TypeScript client for campaign template API endpoints.
 */
import { apiClient } from './client'

// Types
export interface CampaignTemplate {
  id: number
  organization_id: string
  name: string
  subject?: string
  content: string
  type: 'email' | 'voice' | 'linkedin' | 'multi_channel'
  variables?: string[]
  is_default: boolean
  created_by?: string
  created_at: string
  updated_at: string
}

export interface CampaignTemplateCreate {
  name: string
  subject?: string
  content: string
  type: 'email' | 'voice' | 'linkedin' | 'multi_channel'
  variables?: string[]
  is_default?: boolean
}

export interface CampaignTemplateUpdate {
  name?: string
  subject?: string
  content?: string
  type?: string
  is_default?: boolean
}

export interface CampaignTemplateListResponse {
  items: CampaignTemplate[]
  total: number
}

export interface TemplatePreviewRequest {
  contact_data: Record<string, string>
}

export interface TemplatePreviewResponse {
  subject: string
  content: string
}

// API Functions
export async function listTemplates(params?: {
  type?: string
  is_default?: boolean
}): Promise<CampaignTemplateListResponse> {
  const queryParams = new URLSearchParams()
  if (params?.type) queryParams.append('type', params.type)
  if (params?.is_default !== undefined) queryParams.append('is_default', params.is_default.toString())

  const query = queryParams.toString()
  return apiClient.get<CampaignTemplateListResponse>(`/api/master-admin/templates${query ? `?${query}` : ''}`)
}

export async function getTemplate(templateId: number): Promise<CampaignTemplate> {
  return apiClient.get<CampaignTemplate>(`/api/master-admin/templates/${templateId}`)
}

export async function createTemplate(template: CampaignTemplateCreate): Promise<CampaignTemplate> {
  return apiClient.post<CampaignTemplate>('/api/master-admin/templates', template)
}

export async function updateTemplate(templateId: number, update: CampaignTemplateUpdate): Promise<CampaignTemplate> {
  return apiClient.put<CampaignTemplate>(`/api/master-admin/templates/${templateId}`, update)
}

export async function deleteTemplate(templateId: number): Promise<void> {
  return apiClient.delete<void>(`/api/master-admin/templates/${templateId}`)
}

export async function renderTemplatePreview(templateId: number, contactData: Record<string, string>): Promise<TemplatePreviewResponse> {
  return apiClient.post<TemplatePreviewResponse>(`/api/master-admin/templates/${templateId}/preview`, {
    contact_data: contactData,
  })
}

