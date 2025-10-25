const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

type JsonHeaders = Record<string, string>

async function getAuthHeaders(contentType: 'json' | 'form' = 'json'): Promise<JsonHeaders> {
  const headers: JsonHeaders = {}

  if (contentType === 'json') {
    headers['Content-Type'] = 'application/json'
  }

  return headers
}

export interface CreateFolderParams {
  dealId: string
  name: string
  parentFolderId?: string
}

export interface FolderResponse {
  id: string
  name: string
  deal_id: string
  parent_folder_id: string | null
  organization_id: string
  created_by: string
  created_at: string
  updated_at: string | null
  children: FolderResponse[]
  document_count: number
}

export interface UploadDocumentParams {
  dealId: string
  file: File
  folderId?: string
}

export interface DocumentUploadResponse {
  id: string
  name: string
  file_size: number
  file_type: string
  version: number
  created_at: string
}

export interface DocumentListParams {
  dealId: string
  folderId?: string
  folder_id?: string // snake_case alias
  includeArchived?: boolean
  include_archived?: boolean // snake_case alias
  page?: number
  perPage?: number
  per_page?: number // snake_case alias
  search?: string
}

export interface PaginatedDocuments {
  items: Array<{
    id: string
    name: string
    file_size: number
    file_type: string
    deal_id: string
    folder_id: string | null
    organization_id: string
    uploaded_by: string
    version: number
    parent_document_id: string | null
    archived_at: string | null
    created_at: string
    updated_at: string | null
  }>
  total: number
  page: number
  per_page: number
  pages: number
}

export interface PermissionPayload {
  user_id: string
  permission_level: 'viewer' | 'editor' | 'owner'
}

export interface PermissionResponse {
  id: string
  document_id: string | null
  folder_id: string | null
  user_id: string
  permission_level: string
  granted_by: string
  created_at: string
}

// Function overloads for backward compatibility
export async function createFolder(dealId: string, name: string, parentFolderId?: string): Promise<FolderResponse>
export async function createFolder(params: CreateFolderParams): Promise<FolderResponse>
export async function createFolder(
  dealIdOrParams: string | CreateFolderParams,
  name?: string,
  parentFolderId?: string
): Promise<FolderResponse> {
  let params: CreateFolderParams

  if (typeof dealIdOrParams === 'string') {
    params = { dealId: dealIdOrParams, name: name!, parentFolderId }
  } else {
    params = dealIdOrParams
  }

  const response = await fetch(`${API_BASE_URL}/documents/folders`, {
    method: 'POST',
    headers: await getAuthHeaders('json'),
    body: JSON.stringify({
      deal_id: params.dealId,
      name: params.name,
      parent_folder_id: params.parentFolderId,
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }))
    throw new Error(error.detail || 'Failed to create folder')
  }

  return response.json()
}

// Function overloads for backward compatibility
export async function uploadDocument(dealId: string, file: File, folderId?: string): Promise<DocumentUploadResponse>
export async function uploadDocument(params: UploadDocumentParams): Promise<DocumentUploadResponse>
export async function uploadDocument(
  dealIdOrParams: string | UploadDocumentParams,
  file?: File,
  folderId?: string
): Promise<DocumentUploadResponse> {
  let params: UploadDocumentParams

  if (typeof dealIdOrParams === 'string') {
    params = { dealId: dealIdOrParams, file: file!, folderId }
  } else {
    params = dealIdOrParams
  }

  const form = new FormData()
  form.append('deal_id', params.dealId)
  if (params.folderId) {
    form.append('folder_id', params.folderId)
  }
  form.append('file', params.file)

  const response = await fetch(`${API_BASE_URL}/documents/upload`, {
    method: 'POST',
    headers: await getAuthHeaders('form'),
    body: form,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }))
    throw new Error(error.detail || 'Failed to upload document')
  }

  return response.json()
}

// Function overloads for backward compatibility
export async function listDocuments(dealId: string, options?: Omit<DocumentListParams, 'dealId'>): Promise<PaginatedDocuments>
export async function listDocuments(params: DocumentListParams): Promise<PaginatedDocuments>
export async function listDocuments(
  dealIdOrParams: string | DocumentListParams,
  options?: Omit<DocumentListParams, 'dealId'>
): Promise<PaginatedDocuments> {
  let params: DocumentListParams

  if (typeof dealIdOrParams === 'string') {
    params = { dealId: dealIdOrParams, ...options }
  } else {
    params = dealIdOrParams
  }

  const searchParams = new URLSearchParams({ deal_id: params.dealId })

  // Handle both camelCase and snake_case
  const folderId = params.folderId || params.folder_id
  const includeArchived = params.includeArchived || params.include_archived
  const perPage = params.perPage || params.per_page

  if (folderId) searchParams.append('folder_id', folderId)
  if (includeArchived) searchParams.append('include_archived', 'true')
  if (params.page) searchParams.append('page', params.page.toString())
  if (perPage) searchParams.append('per_page', perPage.toString())
  if (params.search) searchParams.append('search', params.search)

  const response = await fetch(`${API_BASE_URL}/documents?${searchParams}`, {
    method: 'GET',
    headers: await getAuthHeaders('json'),
  })

  if (!response.ok) {
    throw new Error('Failed to list documents')
  }

  return response.json()
}

// Function overloads for backward compatibility
export async function downloadDocument(dealId: string, documentId: string): Promise<string>
export async function downloadDocument(documentId: string): Promise<string>
export async function downloadDocument(dealIdOrDocumentId: string, documentId?: string): Promise<string> {
  const actualDocumentId = documentId || dealIdOrDocumentId

  const response = await fetch(`${API_BASE_URL}/documents/${actualDocumentId}/download`, {
    method: 'GET',
    headers: await getAuthHeaders('json'),
  })

  if (!response.ok) {
    throw new Error('Failed to download document')
  }

  const blob = await response.blob()
  return URL.createObjectURL(blob)
}

export async function addDocumentPermission(
  documentId: string,
  payload: PermissionPayload,
): Promise<PermissionResponse> {
  const response = await fetch(`${API_BASE_URL}/documents/${documentId}/permissions`, {
    method: 'POST',
    headers: await getAuthHeaders('json'),
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }))
    throw new Error(error.detail || 'Failed to update permissions')
  }

  return response.json()
}

/**
 * List folders for a deal
 */
export async function listFolders(dealId: string): Promise<FolderResponse[]> {
  const response = await fetch(`${API_BASE_URL}/api/deals/${dealId}/folders`, {
    method: 'GET',
    headers: await getAuthHeaders('json'),
  })

  if (!response.ok) {
    throw new Error('Failed to list folders')
  }

  return response.json()
}

/**
 * Archive a document (soft delete)
 */
export async function archiveDocument(dealId: string, documentId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/deals/${dealId}/documents/${documentId}/archive`, {
    method: 'POST',
    headers: await getAuthHeaders('json'),
  })

  if (!response.ok) {
    throw new Error('Failed to archive document')
  }
}

// Export Document type (extracted from PaginatedDocuments)
export type Document = PaginatedDocuments['items'][number]

// Export Folder type alias for backward compatibility
export type Folder = FolderResponse

// File upload constants
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX
  'application/msword', // DOC
  'application/vnd.ms-excel', // XLS
  'application/vnd.ms-powerpoint', // PPT
  'text/plain',
  'text/csv',
  'image/png',
  'image/jpeg',
  'image/jpg',
]

export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Get file icon based on file type
 */
export function getFileIcon(fileType: string): string {
  const iconMap: Record<string, string> = {
    'application/pdf': '📄',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': '📽️',
    'application/msword': '📝',
    'application/vnd.ms-excel': '📊',
    'application/vnd.ms-powerpoint': '📽️',
    'text/plain': '📃',
    'text/csv': '📊',
    'image/png': '🖼️',
    'image/jpeg': '🖼️',
    'image/jpg': '🖼️',
  }

  return iconMap[fileType] || '📎'
}
