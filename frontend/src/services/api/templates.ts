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
  
  const response = await apiClient.get(`/master-admin/templates?${queryParams.toString()}`)
  return response.data
}

export async function getTemplate(templateId: number): Promise<CampaignTemplate> {
  const response = await apiClient.get(`/master-admin/templates/${templateId}`)
  return response.data
}

export async function createTemplate(template: CampaignTemplateCreate): Promise<CampaignTemplate> {
  const response = await apiClient.post('/master-admin/templates', template)
  return response.data
}

export async function updateTemplate(templateId: number, update: CampaignTemplateUpdate): Promise<CampaignTemplate> {
  const response = await apiClient.put(`/master-admin/templates/${templateId}`, update)
  return response.data
}

export async function deleteTemplate(templateId: number): Promise<void> {
  await apiClient.delete(`/master-admin/templates/${templateId}`)
}

export async function renderTemplatePreview(templateId: number, contactData: Record<string, string>): Promise<TemplatePreviewResponse> {
  const response = await apiClient.post(`/master-admin/templates/${templateId}/preview`, {
    contact_data: contactData,
  })
  return response.data
}

