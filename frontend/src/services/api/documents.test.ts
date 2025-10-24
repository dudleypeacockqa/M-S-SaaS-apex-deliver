import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  createFolder,
  listDocuments,
  uploadDocument,
  downloadDocument,
  addDocumentPermission,
} from './documents'

describe('documents API client', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    vi.useFakeTimers()
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
    global.fetch = originalFetch
  })

  it('creates a folder via POST /documents/folders', async () => {
    const mockResponse = {
      id: 'folder-1',
      name: 'Financials',
      deal_id: 'deal-1',
      parent_folder_id: null,
      organization_id: 'org-1',
      created_by: 'user-1',
      created_at: '2025-10-24T00:00:00Z',
      updated_at: null,
      children: [],
      document_count: 0,
    }

    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(mockResponse), { status: 201 })
    )

    const result = await createFolder({ dealId: 'deal-1', name: 'Financials' })

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/documents\/folders$/),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ deal_id: 'deal-1', name: 'Financials', parent_folder_id: undefined }),
      })
    )
    expect(result).toEqual(mockResponse)
  })

  it('uploads a document using multipart form data', async () => {
    const mockFile = new File(['contents'], 'report.pdf', { type: 'application/pdf' })
    const mockResponse = { id: 'doc-1', name: 'report.pdf', version: 1, file_size: 8, file_type: 'application/pdf', created_at: '2025-10-24T00:00:00Z' }
    vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify(mockResponse), { status: 201 }))

    const result = await uploadDocument({ dealId: 'deal-1', file: mockFile })

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/documents\/upload$/),
      expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData),
      })
    )
    expect(result).toEqual(mockResponse)
  })

  it('lists documents with query parameters', async () => {
    const mockList = { items: [], total: 0, page: 1, per_page: 50, pages: 0 }
    vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify(mockList), { status: 200 }))

    const result = await listDocuments({ dealId: 'deal-1', folderId: 'folder-1' })

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('deal_id=deal-1'),
      expect.objectContaining({ method: 'GET' })
    )
    expect(result).toEqual(mockList)
  })

  it('downloads a document and returns blob URL', async () => {
    const blob = new Blob(['doc'], { type: 'application/pdf' })
    vi.mocked(fetch).mockResolvedValueOnce(new Response(blob, { status: 200, headers: { 'Content-Type': 'application/pdf' } }))

    const url = await downloadDocument('doc-123')

    expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\/documents\/doc-123\/download$/), expect.any(Object))
    expect(url).toContain('blob:')
  })

  it('adds a document permission via POST', async () => {
    const mockResponse = { id: 'perm-1', document_id: 'doc-1', folder_id: null, user_id: 'user-2', permission_level: 'viewer', granted_by: 'user-1', created_at: '2025-10-24T00:00:00Z' }
    vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify(mockResponse), { status: 201 }))

    const result = await addDocumentPermission('doc-1', { user_id: 'user-2', permission_level: 'viewer' })

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/documents\/doc-1\/permissions$/),
      expect.objectContaining({ method: 'POST' })
    )
    expect(result).toEqual(mockResponse)
  })
})
