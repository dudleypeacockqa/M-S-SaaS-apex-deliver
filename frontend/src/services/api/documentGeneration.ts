import { apiClient } from './client'

// Updated to use new document-generation API routes
const BASE_PATH = '/api/document-generation'
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface GeneratedDocument {
  id: string
  template_id: string
  generated_content: string
  variable_values: Record<string, unknown>
  status: string
  file_path?: string
  organization_id: string
  generated_by_user_id: string
  created_at: string
  updated_at?: string
}

export interface DocumentTemplate {
  id: string
  name: string
  description?: string
  template_type?: string
  content: string
  variables: string[]
  status: string
  version: number
  organization_id: string
  created_by_user_id: string
  created_at: string
  updated_at?: string
}

export interface ApplyTemplateOptions {
  dealId?: string
  context?: string
}

export interface AISuggestion {
  id: string
  title: string
  content: string
  confidence?: number
  reasoning?: string
}

export interface FetchSuggestionOptions {
  context?: string
  content?: string
  tone?: string
}

export interface ExportRequest {
  format: string
  options?: Record<string, unknown>
}

export interface ExportResponse {
  file_name?: string
  file_type?: string
  download_url?: string
  file_content?: string
}

export interface DocumentVersionSummary {
  id: string
  label: string
  created_at: string
  created_by?: string
  summary?: string
}

export interface CollaboratorPresence {
  user_id: string
  name: string
  status: 'editing' | 'reviewing' | 'viewing'
}

export function fetchDocument(documentId: string): Promise<GeneratedDocument> {
  return apiClient.get<GeneratedDocument>(`${BASE_PATH}/documents/${documentId}`)
}

export function saveDocument(
  documentId: string,
  payload: Partial<{ content: string; title: string; context: string; metadata: Record<string, unknown> }>
): Promise<GeneratedDocument> {
  // Map old payload to new API structure
  // Note: New API may not support all old fields - may need to update DocumentEditor
  const updatePayload: { status?: string; file_path?: string } = {}
  if (payload.content) {
    // Content updates might need a different endpoint - checking backend routes
    // For now, map to status update if needed
  }
  return apiClient.patch<GeneratedDocument>(`${BASE_PATH}/documents/${documentId}/status?status=draft`, updatePayload)
}

export function listTemplates(
  status?: string,
  template_type?: string,
  skip = 0,
  limit = 100
): Promise<DocumentTemplate[]> {
  const params = new URLSearchParams()
  if (status) params.append('status', status)
  if (template_type) params.append('template_type', template_type)
  params.append('skip', skip.toString())
  params.append('limit', limit.toString())
  
  return apiClient.get<DocumentTemplate[]>(`${BASE_PATH}/templates?${params.toString()}`)
}

export function applyTemplateToDocument(
  documentId: string,
  templateId: string,
  options: ApplyTemplateOptions = {}
): Promise<{ generated_document_id: string; generated_content: string; file_path?: string; status: string }> {
  // New API: POST /api/document-generation/templates/{template_id}/generate
  return apiClient.post<{ generated_document_id: string; generated_content: string; file_path?: string; status: string }>(
    `${BASE_PATH}/templates/${templateId}/generate`,
    {
      variable_values: {
        deal_id: options.dealId,
        context: options.context,
      },
      generate_pdf: false,
      generate_docx: false,
    }
  )
}

export function fetchAISuggestions(
  documentId: string,
  options: FetchSuggestionOptions = {}
): Promise<AISuggestion[]> {
  return apiClient.post<AISuggestion[]>(`${BASE_PATH}/${documentId}/ai/suggestions`, options)
}

export function acceptAISuggestion(documentId: string, suggestionId: string): Promise<AISuggestion> {
  return apiClient.post<AISuggestion>(`${BASE_PATH}/${documentId}/ai/suggestions/${suggestionId}/accept`)
}

export function rejectAISuggestion(documentId: string, suggestionId: string): Promise<AISuggestion> {
  return apiClient.post<AISuggestion>(`${BASE_PATH}/${documentId}/ai/suggestions/${suggestionId}/reject`)
}

export function exportDocument(documentId: string, request: ExportRequest): Promise<ExportResponse> {
  return apiClient.post<ExportResponse>(`${BASE_PATH}/${documentId}/export`, request)
}

export function listDocumentVersions(documentId: string): Promise<DocumentVersionSummary[]> {
  return apiClient.get<DocumentVersionSummary[]>(`${BASE_PATH}/${documentId}/versions`)
}

export function restoreDocumentVersion(
  documentId: string,
  versionId: string
): Promise<GeneratedDocument> {
  return apiClient.post<GeneratedDocument>(`${BASE_PATH}/${documentId}/versions/${versionId}/restore`)
}

export type PresenceCallback = (presence: CollaboratorPresence[]) => void

export function subscribeToPresence(documentId: string, callback: PresenceCallback): () => void {
  if (typeof window === 'undefined') {
    return () => {}
  }

  const sourceUrl = `${API_BASE_URL}${BASE_PATH}/${documentId}/presence`

  if (typeof EventSource === 'undefined') {
    let cancelled = false
    const interval = window.setInterval(() => {
      if (!cancelled) {
        callback([])
      }
    }, 30000)

    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }

  const eventSource = new EventSource(sourceUrl)
  eventSource.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data) as CollaboratorPresence[]
      callback(payload)
    } catch (error) {
      console.warn('Failed to parse presence payload', error)
    }
  }

  eventSource.onerror = () => {
    eventSource.close()
  }

  return () => {
    eventSource.close()
  }
}
