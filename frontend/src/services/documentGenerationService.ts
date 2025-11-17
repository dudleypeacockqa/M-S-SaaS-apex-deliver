/**
 * Document Generation Service
 * Feature: F-009 Automated Document Generation
 *
 * Handles API calls for document templates and generated documents.
 */

import { apiClient } from './api/client';

// ============================================================================
// Type Definitions
// ============================================================================

export type TemplateStatus = 'draft' | 'active' | 'archived';
export type DocumentStatus = 'draft' | 'generated' | 'finalized' | 'sent';

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string | null;
  template_type: string | null;
  content: string;
  variables: string[];
  status: TemplateStatus;
  version: number;
  organization_id: string;
  created_by_user_id: string;
  created_at: string;
  updated_at: string | null;
}

export interface DocumentTemplateCreateInput {
  name: string;
  description?: string | null;
  template_type?: string | null;
  content: string;
  variables: string[];
  organization_id: string;
  created_by_user_id: string;
}

export interface DocumentTemplateUpdateInput {
  name?: string;
  description?: string | null;
  template_type?: string | null;
  content?: string;
  variables?: string[];
  status?: TemplateStatus;
  version?: number;
}

export interface GeneratedDocument {
  id: string;
  template_id: string;
  generated_content: string;
  variable_values: Record<string, any>;
  file_path: string | null;
  status: DocumentStatus;
  organization_id: string;
  generated_by_user_id: string;
  created_at: string;
  updated_at: string | null;
}

export interface TemplateRenderRequest {
  variable_values: Record<string, any>;
  generate_file?: boolean;
  file_format?: 'pdf' | 'docx';
}

export interface TemplateRenderResponse {
  generated_document_id: string;
  generated_content: string;
  file_path: string | null;
  status: DocumentStatus;
}

export interface TemplateListFilters {
  status?: TemplateStatus;
  template_type?: string;
  skip?: number;
  limit?: number;
}

export interface GeneratedDocumentListFilters {
  template_id?: string;
  status?: DocumentStatus;
  skip?: number;
  limit?: number;
}

// ============================================================================
// Template Management API
// ============================================================================

/**
 * Fetch all document templates with optional filters
 */
export async function fetchDocumentTemplates(
  filters?: TemplateListFilters
): Promise<DocumentTemplate[]> {
  const params = new URLSearchParams();

  if (filters?.status) params.append('status', filters.status);
  if (filters?.template_type) params.append('template_type', filters.template_type);
  if (filters?.skip !== undefined) params.append('skip', filters.skip.toString());
  if (filters?.limit !== undefined) params.append('limit', filters.limit.toString());

  const queryString = params.toString();
  const url = `/api/document-generation/templates${queryString ? `?${queryString}` : ''}`;

  const response = await apiClient.get<DocumentTemplate[]>(url);
  return response.data;
}

/**
 * Fetch a single document template by ID
 */
export async function fetchDocumentTemplate(
  templateId: string
): Promise<DocumentTemplate> {
  const response = await apiClient.get<DocumentTemplate>(
    `/api/document-generation/templates/${templateId}`
  );
  return response.data;
}

/**
 * Create a new document template
 */
export async function createDocumentTemplate(
  data: DocumentTemplateCreateInput
): Promise<DocumentTemplate> {
  const response = await apiClient.post<DocumentTemplate>(
    '/api/document-generation/templates',
    data
  );
  return response.data;
}

/**
 * Update an existing document template
 */
export async function updateDocumentTemplate(
  templateId: string,
  data: DocumentTemplateUpdateInput
): Promise<DocumentTemplate> {
  const response = await apiClient.put<DocumentTemplate>(
    `/api/document-generation/templates/${templateId}`,
    data
  );
  return response.data;
}

/**
 * Archive a document template (soft delete)
 */
export async function deleteDocumentTemplate(
  templateId: string
): Promise<void> {
  await apiClient.delete(`/api/document-generation/templates/${templateId}`);
}

// ============================================================================
// Document Generation API
// ============================================================================

/**
 * Generate a document from a template
 */
export async function generateDocument(
  templateId: string,
  renderRequest: TemplateRenderRequest
): Promise<TemplateRenderResponse> {
  const response = await apiClient.post<TemplateRenderResponse>(
    `/api/document-generation/templates/${templateId}/generate`,
    renderRequest
  );
  return response.data;
}

// ============================================================================
// Generated Documents API
// ============================================================================

/**
 * Fetch all generated documents with optional filters
 */
export async function fetchGeneratedDocuments(
  filters?: GeneratedDocumentListFilters
): Promise<GeneratedDocument[]> {
  const params = new URLSearchParams();

  if (filters?.template_id) params.append('template_id', filters.template_id);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.skip !== undefined) params.append('skip', filters.skip.toString());
  if (filters?.limit !== undefined) params.append('limit', filters.limit.toString());

  const queryString = params.toString();
  const url = `/api/document-generation/documents${queryString ? `?${queryString}` : ''}`;

  const response = await apiClient.get<GeneratedDocument[]>(url);
  return response.data;
}

/**
 * Fetch a single generated document by ID
 */
export async function fetchGeneratedDocument(
  documentId: string
): Promise<GeneratedDocument> {
  const response = await apiClient.get<GeneratedDocument>(
    `/api/document-generation/documents/${documentId}`
  );
  return response.data;
}

/**
 * Update the status of a generated document
 */
export async function updateGeneratedDocumentStatus(
  documentId: string,
  status: DocumentStatus
): Promise<GeneratedDocument> {
  const response = await apiClient.patch<GeneratedDocument>(
    `/api/document-generation/documents/${documentId}/status?status=${status}`
  );
  return response.data;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Extract variable names from template content ({{variable}})
 */
export function extractVariables(content: string): string[] {
  const regex = /\{\{(\w+)\}\}/g;
  const variables: string[] = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (!variables.includes(match[1])) {
      variables.push(match[1]);
    }
  }

  return variables;
}

/**
 * Validate that all required variables have values
 */
export function validateVariableValues(
  requiredVariables: string[],
  providedValues: Record<string, any>
): { valid: boolean; missing: string[] } {
  const missing = requiredVariables.filter(
    (variable) =>
      !Object.prototype.hasOwnProperty.call(providedValues, variable) ||
      providedValues[variable] === ''
  );

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Preview template content with variable values
 */
export function previewTemplateContent(
  content: string,
  variableValues: Record<string, any>
): string {
  let preview = content;

  Object.entries(variableValues).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    preview = preview.replace(regex, String(value));
  });

  return preview;
}
