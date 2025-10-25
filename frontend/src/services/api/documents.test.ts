import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  createFolder,
  listDocuments,
  uploadDocument,
  downloadDocument,
  addDocumentPermission,
} from "./documents"

describe("documents API client", () => {
  const originalFetch = global.fetch
  let originalCreateObjectURL: typeof URL.createObjectURL

  beforeEach(() => {
    global.fetch = vi.fn()
    originalCreateObjectURL = URL.createObjectURL
    URL.createObjectURL = vi.fn().mockReturnValue("blob:mock")
  })

  afterEach(() => {
    global.fetch = originalFetch
    URL.createObjectURL = originalCreateObjectURL
    vi.clearAllMocks()
  })

  it("creates a folder via POST /documents/folders", async () => {
    const mockResponse = {
      id: "folder-1",
      name: "Financials",
      deal_id: "deal-1",
      parent_folder_id: null,
      organization_id: "org-1",
      created_by: "user-1",
      created_at: "2025-10-24T00:00:00Z",
      updated_at: null,
      children: [],
      document_count: 0,
    };

    (fetch as unknown as vi.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify(mockResponse), { status: 201 })
    )

    const result = await createFolder("deal-1", { name: "Financials" } as any)

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/deals\/deal-1\/folders$/),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          name: "Financials",
          parent_folder_id: null,
        }),
      })
    )
    expect(result).toEqual(mockResponse)
  })

  it("uploads a document using multipart form data", async () => {
    const mockFile = new File(["contents"], "report.pdf", { type: "application/pdf" })
    const mockResponse = {
      id: "doc-1",
      name: "report.pdf",
      version: 1,
      file_size: 8,
      file_type: "application/pdf",
      created_at: "2025-10-24T00:00:00Z",
    };
    (fetch as unknown as vi.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify(mockResponse), { status: 201 })
    )

    const result = await uploadDocument("deal-1", mockFile)

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/deals\/deal-1\/documents$/),
      expect.objectContaining({
        method: "POST",
        body: expect.any(FormData),
      })
    )
    expect(result).toEqual({
      id: "doc-1",
      name: "report.pdf",
      file_size: 8,
      file_type: "application/pdf",
      version: 1,
      created_at: "2025-10-24T00:00:00Z",
    })
  })

  it("lists documents with query parameters", async () => {
    const mockList = { items: [], total: 0, page: 1, per_page: 50, pages: 0 };
    (fetch as unknown as vi.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify(mockList), { status: 200 })
    )

    const result = await listDocuments("deal-1", { folder_id: "folder-1" })

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/deals/deal-1/documents"),
      expect.objectContaining({ method: "GET" })
    )
    expect(result).toEqual(mockList)
  })

  it("downloads a document and returns blob URL", async () => {
    const blob = new Blob(["doc"], { type: "application/pdf" });
    (fetch as unknown as vi.Mock).mockResolvedValueOnce(
      new Response(blob, { status: 200, headers: { "Content-Type": "application/pdf" } })
    )

    const url = await downloadDocument("deal-1", "doc-123")

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/deals\/deal-1\/documents\/doc-123\/download$/),
      expect.objectContaining({ method: "GET" })
    )
    expect(url).toBe("blob:mock")
  })

  it("adds a document permission via POST", async () => {
    const mockResponse = {
      id: "perm-1",
      document_id: "doc-1",
      folder_id: null,
      user_id: "user-2",
      permission_level: "viewer",
      granted_by: "user-1",
      created_at: "2025-10-24T00:00:00Z",
    };
    (fetch as unknown as vi.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify(mockResponse), { status: 201 })
    )

    const result = await addDocumentPermission("deal-1", "doc-1", {
      user_id: "user-2",
      permission_level: "viewer",
    })

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/deals\/deal-1\/documents\/doc-1\/permissions$/),
      expect.objectContaining({ method: "POST" })
    )
    expect(result).toEqual(mockResponse)
  })
})
