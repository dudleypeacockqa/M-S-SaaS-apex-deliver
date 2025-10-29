import { apiClient } from './client'

const BASE_PATH = '/api/v1/documents'
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface GeneratedDocument {
  id: string
  title?: string
  content: string
  updated_at?: string
  last_saved_by?: string
}

export interface DocumentTemplate {
  id: string
  name: string
  category?: string
  description?: string
  last_updated?: string
  estimated_length?: string
  industries?: string[]
  tags?: string[]
  sample_excerpt?: string
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
  return apiClient.get<GeneratedDocument>(`${BASE_PATH}/${documentId}`)
}

export function saveDocument(
  documentId: string,
  payload: Partial<{ content: string; title: string; context: string; metadata: Record<string, unknown> }>
): Promise<GeneratedDocument> {
  return apiClient.patch<GeneratedDocument>(`${BASE_PATH}/${documentId}`, payload)
}

export function listTemplates(): Promise<DocumentTemplate[]> {
  return apiClient.get<DocumentTemplate[]>(`${BASE_PATH}/templates`)
}

export function applyTemplateToDocument(
  documentId: string,
  templateId: string,
  options: ApplyTemplateOptions = {}
): Promise<GeneratedDocument> {
  return apiClient.post<GeneratedDocument>(`${BASE_PATH}/generate`, {
    document_id: documentId,
    template_id: templateId,
    deal_id: options.dealId,
    context: options.context,
  })
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
