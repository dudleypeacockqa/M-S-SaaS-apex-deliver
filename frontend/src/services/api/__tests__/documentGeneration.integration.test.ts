/**
 * Document Generation API Integration Tests
 * 
 * Tests the integration between frontend service and backend API
 * Following TDD: RED → GREEN → REFACTOR
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  fetchDocument,
  saveDocument,
  listTemplates,
  applyTemplateToDocument,
  fetchAISuggestions,
  exportDocument,
  listDocumentVersions,
  restoreDocumentVersion,
} from '../documentGeneration'
import { apiClient } from '../client'

// Mock the API client
vi.mock('../client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}))

describe('Document Generation API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Template CRUD Operations', () => {
    it('should list templates with filters', async () => {
      const mockTemplates = [
        {
          id: 'template-1',
          name: 'Test Template',
          description: 'A test template',
          template_type: 'legal',
          content: 'Hello {{name}}',
          variables: ['name'],
          status: 'active',
          version: 1,
          organization_id: 'org-1',
          created_by_user_id: 'user-1',
          created_at: '2025-11-13T00:00:00Z',
        },
      ]

      vi.mocked(apiClient.get).mockResolvedValue(mockTemplates)

      const result = await listTemplates('active', 'legal', 0, 10)

      expect(apiClient.get).toHaveBeenCalledWith(
        '/api/document-generation/templates?status=active&template_type=legal&skip=0&limit=10'
      )
      expect(result).toEqual(mockTemplates)
    })

    it('should apply template to document', async () => {
      const mockResponse = {
        generated_document_id: 'doc-1',
        generated_content: 'Hello John',
        file_path: null,
        status: 'generated',
      }

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse)

      const result = await applyTemplateToDocument('doc-1', 'template-1', {
        dealId: 'deal-1',
        context: 'test context',
      })

      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/document-generation/templates/template-1/generate',
        {
          variable_values: {
            deal_id: 'deal-1',
            context: 'test context',
          },
          generate_pdf: false,
          generate_docx: false,
        }
      )
      expect(result).toEqual(mockResponse)
    })
  })

  describe('Document Export Operations', () => {
    it('should export document as PDF', async () => {
      const mockExportResponse = {
        file_name: 'document.pdf',
        file_type: 'application/pdf',
        download_url: 'https://example.com/download/document.pdf',
        file_content: undefined,
      }

      vi.mocked(apiClient.post).mockResolvedValue(mockExportResponse)

      const result = await exportDocument('doc-1', {
        format: 'application/pdf',
        options: { margin: 15 },
      })

      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/document-generation/documents/doc-1/export',
        {
          format: 'application/pdf',
          options: { margin: 15 },
        }
      )
      expect(result).toEqual(mockExportResponse)
    })

    it('should export document as DOCX', async () => {
      const mockExportResponse = {
        file_name: 'document.docx',
        file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        download_url: 'https://example.com/download/document.docx',
        file_content: undefined,
      }

      vi.mocked(apiClient.post).mockResolvedValue(mockExportResponse)

      const result = await exportDocument('doc-1', {
        format: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        options: { margin: 20, fontFamily: 'Arial' },
      })

      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/document-generation/documents/doc-1/export',
        {
          format: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          options: { margin: 20, fontFamily: 'Arial' },
        }
      )
      expect(result).toEqual(mockExportResponse)
    })

    it('should export document synchronously (current implementation)', async () => {
      // Current implementation: export is synchronous, returns file info directly
      // Future enhancement: can add async job queue + polling for large documents
      const mockExportResponse = {
        file_name: 'document.pdf',
        file_type: 'application/pdf',
        download_url: 'https://example.com/download/document.pdf',
        file_content: undefined,
        job_id: undefined,
        status: undefined,
      }

      vi.mocked(apiClient.post).mockResolvedValue(mockExportResponse)

      const result = await exportDocument('doc-1', {
        format: 'application/pdf',
        options: {},
      })

      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/document-generation/documents/doc-1/export',
        {
          format: 'application/pdf',
          options: {},
        }
      )
      expect(result).toEqual(mockExportResponse)
      expect(result.file_name).toBe('document.pdf')
    })
  })

  describe('Document Operations', () => {
    it('should fetch document by ID', async () => {
      const mockDocument = {
        id: 'doc-1',
        template_id: 'template-1',
        generated_content: 'Hello World',
        variable_values: { name: 'World' },
        status: 'generated',
        file_path: null,
        organization_id: 'org-1',
        generated_by_user_id: 'user-1',
        created_at: '2025-11-13T00:00:00Z',
      }

      vi.mocked(apiClient.get).mockResolvedValue(mockDocument)

      const result = await fetchDocument('doc-1')

      expect(apiClient.get).toHaveBeenCalledWith(
        '/api/document-generation/documents/doc-1'
      )
      expect(result).toEqual(mockDocument)
    })

    it('should save document updates', async () => {
      const mockUpdatedDocument = {
        id: 'doc-1',
        template_id: 'template-1',
        generated_content: 'Updated content',
        variable_values: {},
        status: 'draft',
        file_path: null,
        organization_id: 'org-1',
        generated_by_user_id: 'user-1',
        created_at: '2025-11-13T00:00:00Z',
        updated_at: '2025-11-13T01:00:00Z',
      }

      vi.mocked(apiClient.patch).mockResolvedValue(mockUpdatedDocument)

      const result = await saveDocument('doc-1', {
        content: 'Updated content',
        title: 'Updated Title',
      })

      expect(apiClient.patch).toHaveBeenCalledWith(
        '/api/document-generation/documents/doc-1',
        {
          generated_content: 'Updated content',
          status: 'draft',
        }
      )
      expect(result).toEqual(mockUpdatedDocument)
    })

    it('should list document versions', async () => {
      const mockVersions = [
        {
          id: 'version-1',
          label: 'Version 1',
          created_at: '2025-11-13T00:00:00Z',
          created_by: 'user-1',
          summary: 'Initial version',
        },
      ]

      vi.mocked(apiClient.get).mockResolvedValue(mockVersions)

      const result = await listDocumentVersions('doc-1')

      expect(apiClient.get).toHaveBeenCalledWith(
        '/api/document-generation/documents/doc-1/versions'
      )
      expect(result).toEqual(mockVersions)
    })

    it('should restore document version', async () => {
      const mockRestoredDocument = {
        id: 'doc-1',
        template_id: 'template-1',
        generated_content: 'Restored content',
        variable_values: {},
        status: 'draft',
        file_path: null,
        organization_id: 'org-1',
        generated_by_user_id: 'user-1',
        created_at: '2025-11-13T00:00:00Z',
      }

      vi.mocked(apiClient.post).mockResolvedValue(mockRestoredDocument)

      const result = await restoreDocumentVersion('doc-1', 'version-1')

      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/document-generation/documents/doc-1/versions/version-1/restore'
      )
      expect(result).toEqual(mockRestoredDocument)
    })
  })

  describe('AI Suggestions', () => {
    it('should fetch AI suggestions', async () => {
      const mockSuggestions = [
        {
          id: 'suggestion-1',
          title: 'Improve clarity',
          content: 'Consider rephrasing this section',
          confidence: 0.85,
          reasoning: 'The current wording is ambiguous',
        },
      ]

      vi.mocked(apiClient.post).mockResolvedValue(mockSuggestions)

      const result = await fetchAISuggestions('doc-1', {
        context: 'legal document',
        content: 'Current content',
        tone: 'professional',
      })

      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/document-generation/documents/doc-1/ai/suggestions',
        {
          context: 'legal document',
          content: 'Current content',
          tone: 'professional',
        }
      )
      expect(result).toEqual(mockSuggestions)
    })
  })
})

