const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

type JsonHeaders = Record<string, string>

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"

type PermissionLevel = "viewer" | "editor" | "owner"

type FetchOptions = {
  method?: HttpMethod
  headers?: HeadersInit
  body?: BodyInit | null
}

async function getAuthHeaders(contentType: "json" | "form" = "json"): Promise<JsonHeaders> {
  const headers: JsonHeaders = {}

  if (contentType === "json") {
    headers["Content-Type"] = "application/json"
  }

  return headers
}

function buildDealUrl(dealId: string, path: string): string {
  return `${API_BASE_URL}/api/deals/${dealId}${path}`
}

async function request<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const response = await fetch(url, options)

  if (!response.ok) {
    const errorBody = await response
      .json()
      .catch(() => ({ detail: response.statusText || "Request failed" }))

    const error = new Error(errorBody.detail || "Request failed") as Error & {
      status?: number
      data?: unknown
      detail?: string
    }
    error.status = response.status
    error.data = errorBody
    error.detail = errorBody.detail
    throw error
  }

  return response.json() as Promise<T>
}

export interface Document {
  id: string
  name: string
  file_size: number
  file_type: string
  deal_id: string
  folder_id: string | null
  organization_id: string
  uploaded_by: string
  version: number
  created_at: string
  updated_at: string | null
  archived_at: string | null
}

export interface DocumentUploadResponse {
  id: string
  name: string
  file_size: number
  file_type: string
  version: number
  created_at: string
}

export interface Folder {
  id: string
  name: string
  deal_id: string
  parent_folder_id: string | null
  organization_id: string
  created_by: string
  created_at: string
  updated_at: string | null
  document_count: number
  children: Folder[]
}

export interface DocumentListParams {
  page?: number
  per_page?: number
  folder_id?: string
  search?: string
  file_type?: string
  include_archived?: boolean
}

export interface PaginatedDocuments {
  items: Document[]
  total: number
  page: number
  per_page: number
  pages: number
}

export interface CreateFolderPayload {
  name: string
  parent_folder_id?: string | null
}

export interface PermissionPayload {
  user_id: string
  permission_level: PermissionLevel
  folder_id?: string | null
}

export interface PermissionResponse {
  id: string
  document_id: string | null
  folder_id: string | null
  user_id: string
  permission_level: PermissionLevel
  granted_by: string
  created_at: string
}

export async function createFolder(dealId: string, payload: CreateFolderPayload): Promise<Folder> {
  const headers = await getAuthHeaders("json")

  return request<Folder>(buildDealUrl(dealId, "/folders"), {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: payload.name,
      parent_folder_id: payload.parent_folder_id ?? null,
    }),
  })
}

export async function listFolders(dealId: string): Promise<Folder[]> {
  const headers = await getAuthHeaders("json")

  return request<Folder[]>(buildDealUrl(dealId, "/folders"), {
    method: "GET",
    headers,
  })
}

export async function uploadDocument(
  dealId: string,
  file: File,
  options: { folderId?: string } = {}
): Promise<DocumentUploadResponse> {
  const formData = new FormData()
  formData.append("file", file)

  if (options.folderId) {
    formData.append("folder_id", options.folderId)
  }

  const response = await fetch(buildDealUrl(dealId, "/documents"), {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: response.statusText || "Upload failed" }))
    throw new Error(error.detail || "Failed to upload document")
  }

  const json = await response.json()

  return {
    id: json.id,
    name: json.name,
    file_size: json.file_size,
    file_type: json.file_type,
    version: json.version,
    created_at: json.created_at,
  }
}

export async function listDocuments(
  dealId: string,
  params: DocumentListParams = {}
): Promise<PaginatedDocuments> {
  const query = new URLSearchParams()

  if (params.page) query.append("page", String(params.page))
  if (params.per_page) query.append("per_page", String(params.per_page))
  if (params.folder_id) query.append("folder_id", params.folder_id)
  if (params.search) query.append("search", params.search)
  if (params.file_type) query.append("file_type", params.file_type)
  if (params.include_archived) query.append("include_archived", "true")

  const headers = await getAuthHeaders("json")
  const url = `${buildDealUrl(dealId, "/documents")}${query.toString() ? `?${query}` : ""}`

  return request<PaginatedDocuments>(url, {
    method: "GET",
    headers,
  })
}

export async function downloadDocument(dealId: string, documentId: string): Promise<string> {
  const headers = await getAuthHeaders("json")
  const response = await fetch(buildDealUrl(dealId, `/documents/${documentId}/download`), {
    method: "GET",
    headers,
  })

  if (!response.ok) {
    throw new Error("Failed to download document")
  }

  const blob = await response.blob()
  return URL.createObjectURL(blob)
}

export async function archiveDocument(dealId: string, documentId: string): Promise<Document> {
  const headers = await getAuthHeaders("json")

  return request<Document>(buildDealUrl(dealId, `/documents/${documentId}/archive`), {
    method: "POST",
    headers,
  })
}

export async function restoreDocument(dealId: string, documentId: string): Promise<Document> {
  const headers = await getAuthHeaders("json")

  return request<Document>(buildDealUrl(dealId, `/documents/${documentId}/restore`), {
    method: "POST",
    headers,
  })
}

export async function addDocumentPermission(
  dealId: string,
  documentId: string,
  payload: PermissionPayload
): Promise<PermissionResponse> {
  const headers = await getAuthHeaders("json")

  return request<PermissionResponse>(
    buildDealUrl(dealId, `/documents/${documentId}/permissions`),
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        user_id: payload.user_id,
        permission_level: payload.permission_level,
        folder_id: payload.folder_id ?? null,
      }),
    }
  )
}

export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.msword",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-powerpoint",
  "text/plain",
  "text/csv",
  "image/png",
  "image/jpeg",
  "image/gif",
]

export const MAX_FILE_SIZE = 50 * 1024 * 1024

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export function getFileIcon(fileType: string): string {
  const iconMap: Record<string, string> = {
    "application/pdf": "📄",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "📝",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "📊",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "📽️",
    "application/msword": "📝",
    "application/vnd.ms-excel": "📊",
    "application/vnd.ms-powerpoint": "📽️",
    "text/plain": "📃",
    "text/csv": "📊",
    "image/png": "🖼️",
    "image/jpeg": "🖼️",
    "image/gif": "🖼️",
  }

  return iconMap[fileType] || "📎"
}

// Bulk operations
export interface BulkDeleteResponse {
  deleted_count: number
  deleted_ids: string[]
  failed_ids: string[]
  failed_reasons: Record<string, string>
}

export async function bulkDownloadDocuments(dealId: string, documentIds: string[]): Promise<string> {
  const headers = await getAuthHeaders()
  const response = await fetch(buildDealUrl(dealId, "/documents/bulk-download"), {
    method: "POST",
    headers,
    body: JSON.stringify({ document_ids: documentIds }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }))
    throw new Error(error.detail || "Failed to download documents")
  }

  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  return url
}

export async function bulkDeleteDocuments(dealId: string, documentIds: string[]): Promise<BulkDeleteResponse> {
  const headers = await getAuthHeaders()
  return request<BulkDeleteResponse>(buildDealUrl(dealId, "/documents/bulk-delete"), {
    method: "POST",
    headers,
    body: JSON.stringify({ document_ids: documentIds }),
  })
}

