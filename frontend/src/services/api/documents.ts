const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

type JsonHeaders = Record<string, string>

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export type PermissionLevel = "viewer" | "editor" | "owner"

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
  parent_id?: string | null
  organization_id: string
  created_by: string
  created_at: string
  updated_at: string | null
  document_count: number
  children?: Folder[]
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
  parent_id?: string | null
  parent_folder_id?: string | null
}

export interface DocumentPermission {
  id: string
  document_id: string
  user_id: string
  user_email: string
  role: PermissionLevel
  created_at: string
}

const normalisePermission = (permission: DocumentPermissionResponse): DocumentPermission => ({
  id: permission.id,
  document_id: permission.document_id,
  user_id: permission.user_id,
  user_email: permission.user_email ?? permission.user_id,
  role: permission.permission_level,
  created_at: permission.created_at,
})

export interface DocumentPermissionResponse {
  id: string
  document_id: string
  folder_id?: string | null
  user_id: string
  user_email?: string
  permission_level: PermissionLevel
  created_at: string
}

export async function createFolder(
  dealId: string,
  payload: CreateFolderPayload
): Promise<Folder> {
  const headers = await getAuthHeaders("json")
  const parentId = payload.parent_id ?? payload.parent_folder_id ?? null

  return request<Folder>(buildDealUrl(dealId, "/folders"), {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: payload.name,
      parent_folder_id: parentId,
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

export async function updateFolder(
  dealId: string,
  folderId: string,
  payload: Partial<{ name: string; parent_id: string | null; parent_folder_id: string | null }>
): Promise<Folder> {
  const headers = await getAuthHeaders("json")

  const bodyPayload: Record<string, unknown> = {}
  if (payload.name !== undefined) bodyPayload.name = payload.name
  const parent = payload.parent_id ?? payload.parent_folder_id
  if (parent !== undefined) bodyPayload.parent_folder_id = parent

  return request<Folder>(buildDealUrl(dealId, `/folders/${folderId}`), {
    method: "PATCH",
    headers,
    body: JSON.stringify(bodyPayload),
  })
}

export async function deleteFolder(dealId: string, folderId: string): Promise<void> {
  const headers = await getAuthHeaders("json")

  await request<void>(buildDealUrl(dealId, `/folders/${folderId}`), {
    method: "DELETE",
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

export async function deleteDocument(dealId: string, documentId: string): Promise<void> {
  const headers = await getAuthHeaders("json")

  await fetch(buildDealUrl(dealId, `/documents/${documentId}`), {
    method: "DELETE",
    headers,
  })
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

export async function listPermissions(documentId: string): Promise<DocumentPermission[]> {

  const headers = await getAuthHeaders("json")



  const response = await request<DocumentPermissionResponse[]>(

    API_BASE_URL + "/api/documents/" + documentId + "/permissions",

    {

      method: "GET",

      headers,

    }

  )



  return response.map(normalisePermission)

}



export async function addPermission(

  documentId: string,

  payload: { user_email: string; role: PermissionLevel }

): Promise<DocumentPermission> {

  const headers = await getAuthHeaders("json")



  const response = await request<DocumentPermissionResponse>(

    API_BASE_URL + "/api/documents/" + documentId + "/permissions",

    {

      method: "POST",

      headers,

      body: JSON.stringify({

        user_email: payload.user_email,

        permission_level: payload.role,

      }),

    }

  )



  return normalisePermission(response)

}



export async function updatePermission(

  permissionId: string,

  payload: { role: PermissionLevel }

): Promise<DocumentPermission> {

  const headers = await getAuthHeaders("json")



  const response = await request<DocumentPermissionResponse>(

    API_BASE_URL + "/api/permissions/" + permissionId,

    {

      method: "PATCH",

      headers,

      body: JSON.stringify({ permission_level: payload.role }),

    }

  )



  return normalisePermission(response)

}



export async function removePermission(permissionId: string): Promise<void> {

  const headers = await getAuthHeaders("json")



  await request<void>(API_BASE_URL + "/api/permissions/" + permissionId, {

    method: "DELETE",

    headers,

  })

}



export async function listDocumentPermissions(

  dealId: string,

  documentId: string

): Promise<DocumentPermissionResponse[]> {

  const headers = await getAuthHeaders("json")



  return request<DocumentPermissionResponse[]>(

    buildDealUrl(dealId, "/documents/" + documentId + "/permissions"),

    {

      method: "GET",

      headers,

    }

  )

}



export async function addDocumentPermission(

  dealId: string,

  documentId: string,

  payload: { user_id: string; permission_level: PermissionLevel }

): Promise<DocumentPermissionResponse> {

  const headers = await getAuthHeaders("json")



  return request<DocumentPermissionResponse>(

    buildDealUrl(dealId, "/documents/" + documentId + "/permissions"),

    {

      method: "POST",

      headers,

      body: JSON.stringify(payload),

    }

  )

}



export async function updateDocumentPermission(

  permissionId: string,

  payload: { permission_level: PermissionLevel }

): Promise<DocumentPermissionResponse> {

  const headers = await getAuthHeaders("json")



  return request<DocumentPermissionResponse>(

    API_BASE_URL + "/api/permissions/" + permissionId,

    {

      method: "PATCH",

      headers,

      body: JSON.stringify(payload),

    }

  )

}



export async function removeDocumentPermission(permissionId: string): Promise<void> {

  await removePermission(permissionId)

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

export interface BulkOperationFailure {
  id: string
  reason: string
}

export interface BulkMovePayload {
  document_ids: string[]
  target_folder_id: string
}

export interface BulkMoveResult {
  success: boolean
  moved_ids: string[]
  failures?: BulkOperationFailure[]
}

export async function bulkMoveDocuments(
  dealId: string,
  payload: BulkMovePayload
): Promise<BulkMoveResult> {
  const headers = await getAuthHeaders()
  return request<BulkMoveResult>(buildDealUrl(dealId, "/documents/bulk-move"), {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  })
}

export interface BulkArchivePayload {
  document_ids: string[]
}

export interface BulkArchiveResult {
  success: boolean
  archived_ids: string[]
  failures?: BulkOperationFailure[]
}

export async function bulkArchiveDocuments(
  dealId: string,
  payload: BulkArchivePayload
): Promise<BulkArchiveResult> {
  const headers = await getAuthHeaders()
  return request<BulkArchiveResult>(buildDealUrl(dealId, "/documents/bulk-archive"), {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  })
}

export async function restoreArchivedDocuments(
  dealId: string,
  documentIds: string[]
): Promise<{ restored_ids: string[] }> {
  const headers = await getAuthHeaders()
  return request<{ restored_ids: string[] }>(buildDealUrl(dealId, "/documents/bulk-restore"), {
    method: "POST",
    headers,
    body: JSON.stringify({ document_ids: documentIds }),
  })
}

