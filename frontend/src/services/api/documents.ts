/**
 * Document API Client
 *
 * Provides TypeScript client for document management operations.
 * Uses fetch-based approach matching deals.ts pattern.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function getAuthHeaders(): Promise<HeadersInit> {
  return {
    'Content-Type': 'application/json',
  };
}

export interface Document {
  id: string;
  name: string;
  file_size: number;
  file_type: string;
  deal_id: string;
  folder_id: string | null;
  organization_id: string;
  uploaded_by: string;
  version: number;
  created_at: string;
  updated_at: string | null;
  archived_at: string | null;
}

export interface Folder {
  id: string;
  name: string;
  deal_id: string;
  parent_folder_id: string | null;
  organization_id: string;
  created_at: string;
  updated_at: string | null;
}

export interface DocumentListParams {
  page?: number;
  per_page?: number;
  folder_id?: string;
  search?: string;
  file_type?: string;
  include_archived?: boolean;
}

export interface PaginatedDocuments {
  items: Document[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

/**
 * Upload a document to a deal's data room
 */
export async function uploadDocument(
  dealId: string,
  file: File,
  folderId?: string
): Promise<Document> {
  const formData = new FormData();
  formData.append('file', file);
  if (folderId) {
    formData.append('folder_id', folderId);
  }

  const response = await fetch(`${API_BASE_URL}/api/deals/${dealId}/documents`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Upload failed' }));
    throw new Error(error.detail || 'Failed to upload document');
  }

  return response.json();
}

/**
 * List documents in a deal's data room with pagination and filters
 */
export async function listDocuments(
  dealId: string,
  params?: DocumentListParams
): Promise<PaginatedDocuments> {
  const queryParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
  }

  const url = `${API_BASE_URL}/api/deals/${dealId}/documents${
    queryParams.toString() ? `?${queryParams}` : ''
  }`;

  const headers = await getAuthHeaders();
  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error('Failed to list documents');
  }

  return response.json();
}

/**
 * Download a document (opens in new tab)
 */
export async function downloadDocument(dealId: string, documentId: string): Promise<void> {
  window.open(`${API_BASE_URL}/api/deals/${dealId}/documents/${documentId}/download`, '_blank');
}

/**
 * Archive a document (soft delete)
 */
export async function archiveDocument(dealId: string, documentId: string): Promise<Document> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/deals/${dealId}/documents/${documentId}/archive`, {
    method: 'POST',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to archive document');
  }

  return response.json();
}

/**
 * Restore an archived document
 */
export async function restoreDocument(dealId: string, documentId: string): Promise<Document> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/deals/${dealId}/documents/${documentId}/restore`, {
    method: 'POST',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to restore document');
  }

  return response.json();
}

/**
 * Create a folder in the data room
 */
export async function createFolder(
  dealId: string,
  name: string,
  parentFolderId?: string
): Promise<Folder> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/deals/${dealId}/folders`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name,
      parent_folder_id: parentFolderId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create folder');
  }

  return response.json();
}

/**
 * List folders in the data room
 */
export async function listFolders(dealId: string): Promise<Folder[]> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/deals/${dealId}/folders`, { headers });

  if (!response.ok) {
    throw new Error('Failed to list folders');
  }

  return response.json();
}

// Helper functions

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get file icon emoji based on file type
 */
export function getFileIcon(fileType: string): string {
  if (fileType.includes('pdf')) return '📄';
  if (fileType.includes('word')) return '📝';
  if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
  if (fileType.includes('powerpoint') || fileType.includes('presentation')) return '📽️';
  if (fileType.includes('image')) return '🖼️';
  if (fileType.includes('text')) return '📃';
  if (fileType.includes('csv')) return '📊';
  return '📎';
}

/**
 * Allowed file types for upload
 */
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
  'application/msword', // DOC
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
  'application/vnd.ms-excel', // XLS
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX
  'application/vnd.ms-powerpoint', // PPT
  'text/plain',
  'text/csv',
  'image/png',
  'image/jpeg',
  'image/gif',
];

/**
 * Maximum file size (50MB)
 */
export const MAX_FILE_SIZE = 50 * 1024 * 1024;
