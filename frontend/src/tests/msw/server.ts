const ensureLocalStorage = () => {
  if (typeof (globalThis as Record<string, unknown>).localStorage === 'object') {
    const existing = (globalThis as Record<string, unknown>).localStorage as Storage | undefined
    if (existing && typeof existing.getItem === 'function') {
      return
    }
  }
  let store = new Map<string, string>()
  const storage = {
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null
    },
    setItem(key: string, value: string) {
      store.set(key, String(value))
    },
    removeItem(key: string) {
      store.delete(key)
    },
    clear() {
      store = new Map()
    },
  }

  ;(globalThis as Record<string, unknown>).localStorage = storage
}

ensureLocalStorage()

const { http, HttpResponse } = await import('msw')

const API_BASE_URL = process.env.VITE_API_URL ?? 'http://localhost:8000'

interface FolderRecord {
  id: string
  name: string
  parentId: string | null
  createdAt: string
  updatedAt: string | null
}

interface DocumentRecord {
  id: string
  name: string
  fileType: string
  fileSize: number
  folderId: string | null
  version: number
  createdAt: string
  updatedAt: string | null
  archivedAt: string | null
}

interface PermissionRecord {
  id: string
  documentId: string
  userId: string
  userEmail: string
  role: 'viewer' | 'editor' | 'owner'
  createdAt: string
}

interface BlogPostRecord {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  category: string
  featured_image_url?: string | null
  read_time_minutes: number
  meta_description: string
  primary_keyword: string
  created_at: string
  updated_at: string | null
}

interface DealStore {
  folders: Map<string, FolderRecord>
  documents: Map<string, DocumentRecord>
  permissions: Map<string, PermissionRecord[]>
}

const deals = new Map<string, DealStore>()
const blogPosts: BlogPostRecord[] = [
  {
    id: 1,
    title: 'How to Accelerate M&A Execution in 2025',
    slug: 'accelerate-ma-execution',
    excerpt: 'Five practical levers elite deal teams use to compress diligence cycles without sacrificing quality.',
    content: '# Accelerate M&A Execution in 2025\n\nUse workflow automation, data rooms, and AI briefings to keep every workstream moving.',
    author: 'Darren Parsons',
    category: 'M&A Strategy',
    featured_image_url: null,
    read_time_minutes: 6,
    meta_description: 'Five tactics for faster, safer deals.',
    primary_keyword: 'ma execution playbook',
    created_at: '2025-10-01T00:00:00Z',
    updated_at: null,
  },
  {
    id: 2,
    title: 'FP&A Playbook for Post-Merger Integration',
    slug: 'fpa-post-merger-playbook',
    excerpt: 'Standardize cash reporting, integrate source systems, and align the exec dashboard in 30 days.',
    content: '# FP&A Playbook\n\nThis playbook highlights the first 30, 60, and 90 day FP&A checkpoints for PMI.',
    author: 'Cynthia Shaw',
    category: 'FP&A',
    featured_image_url: null,
    read_time_minutes: 8,
    meta_description: 'FP&A steps for confident PMI.',
    primary_keyword: 'fp&a integration checklist',
    created_at: '2025-09-20T00:00:00Z',
    updated_at: null,
  },
  {
    id: 3,
    title: 'Three Pricing Plays to Protect Margins During PMI',
    slug: 'pricing-plays-pmi',
    excerpt: 'Combine good-better-best packaging with win-back offers to keep revenue velocity.',
    content: '# Pricing Plays\n\nProtect pricing power while legal and finance focus on close activities.',
    author: 'Ariana Flores',
    category: 'Pricing Strategy',
    featured_image_url: null,
    read_time_minutes: 5,
    meta_description: 'Pricing tactics during post-merger integration.',
    primary_keyword: 'pricing strategy pmi',
    created_at: '2025-08-30T00:00:00Z',
    updated_at: null,
  },
]

const DEFAULT_DEAL_ID = 'deal-msw'
const DEFAULT_ORG_ID = 'org-msw'
const DEFAULT_USER_ID = 'user-msw'

const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`

const ensureDeal = (dealId: string): DealStore => {
  if (!deals.has(dealId)) {
    deals.set(dealId, {
      folders: new Map(),
      documents: new Map(),
      permissions: new Map(),
    })
    seedDeal(dealId)
  }
  return deals.get(dealId)!
}

const seedDeal = (dealId: string) => {
  const deal = deals.get(dealId)!
  const now = new Date().toISOString()

  const rootFolder: FolderRecord = {
    id: 'folder-root',
    name: 'Root Documents',
    parentId: null,
    createdAt: now,
    updatedAt: null,
  }

  const financeFolder: FolderRecord = {
    id: 'folder-finance',
    name: 'Financials',
    parentId: 'folder-root',
    createdAt: now,
    updatedAt: null,
  }

  const legalFolder: FolderRecord = {
    id: 'folder-legal',
    name: 'Legal',
    parentId: 'folder-root',
    createdAt: now,
    updatedAt: null,
  }

  const ndaFolder: FolderRecord = {
    id: 'folder-nda',
    name: 'NDAs',
    parentId: 'folder-legal',
    createdAt: now,
    updatedAt: null,
  }

  ;[rootFolder, financeFolder, legalFolder, ndaFolder].forEach((folder) =>
    deal.folders.set(folder.id, folder)
  )

  const documents: DocumentRecord[] = [
    {
      id: 'doc-financial-summary',
      name: 'Financial Summary.pdf',
      fileType: 'application/pdf',
      fileSize: 1_024_000,
      folderId: 'folder-finance',
      version: 1,
      createdAt: now,
      updatedAt: null,
      archivedAt: null,
    },
    {
      id: 'doc-nda-template',
      name: 'NDA Template.docx',
      fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      fileSize: 256_000,
      folderId: 'folder-nda',
      version: 3,
      createdAt: now,
      updatedAt: now,
      archivedAt: null,
    },
    {
      id: 'doc-master-pipeline',
      name: 'Deal Pipeline.xlsx',
      fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      fileSize: 512_000,
      folderId: null,
      version: 2,
      createdAt: now,
      updatedAt: now,
      archivedAt: null,
    },
  ]

  documents.forEach((document) => deal.documents.set(document.id, document))

  deal.permissions.set('doc-financial-summary', [
    {
      id: 'perm-1',
      documentId: 'doc-financial-summary',
      userId: DEFAULT_USER_ID,
      userEmail: 'analyst@example.com',
      role: 'editor',
      createdAt: now,
    },
  ])
}

const resetDocumentRoomFixtures = () => {
  deals.clear()
  ensureDeal(DEFAULT_DEAL_ID)
}

resetDocumentRoomFixtures()

const serializeFolder = (
  dealId: string,
  folder: FolderRecord,
  includeChildren = false
) => {
  const deal = ensureDeal(dealId)
  const children = Array.from(deal.folders.values()).filter((child) => child.parentId === folder.id)

  return {
    id: folder.id,
    name: folder.name,
    deal_id: dealId,
    parent_folder_id: folder.parentId,
    organization_id: DEFAULT_ORG_ID,
    created_by: DEFAULT_USER_ID,
    created_at: folder.createdAt,
    updated_at: folder.updatedAt,
    document_count: Array.from(deal.documents.values()).filter(
      (doc) => doc.folderId === folder.id
    ).length,
    has_children: children.length > 0,
    ...(includeChildren
      ? {
          children: children.map((child) => serializeFolder(dealId, child, true)),
        }
      : {}),
  }
}

const collectAllFolders = (dealId: string) => {
  const deal = ensureDeal(dealId)
  return Array.from(deal.folders.values()).map((folder) => serializeFolder(dealId, folder, false))
}

const parseSearchParams = (url: string) => {
  const parsed = new URL(url)
  return parsed.searchParams
}

const listFolderHandler = http.get(`${API_BASE_URL}/api/deals/:dealId/folders`, ({ request, params }) => {
  const dealId = params.dealId as string
  const searchParams = parseSearchParams(request.url)
  const parentIdParam = searchParams.get('parent_id')
  const search = searchParams.get('search')
  const includeTree = searchParams.get('include_tree') === 'true'

  const deal = ensureDeal(dealId)

  if (search) {
    const term = search.toLowerCase()
    const matches = Array.from(deal.folders.values())
      .filter((folder) => folder.name.toLowerCase().includes(term))
      .map((folder) => serializeFolder(dealId, folder, false))
    return HttpResponse.json(matches)
  }

  if (includeTree) {
    const roots = Array.from(deal.folders.values()).filter((folder) => folder.parentId === null)
    return HttpResponse.json(roots.map((folder) => serializeFolder(dealId, folder, true)))
  }

  const parentId = parentIdParam === '' ? null : parentIdParam
  const folders = Array.from(deal.folders.values()).filter(
    (folder) => folder.parentId === parentId
  )

  return HttpResponse.json(folders.map((folder) => serializeFolder(dealId, folder, false)))
})

const createFolderHandler = http.post(
  `${API_BASE_URL}/api/deals/:dealId/folders`,
  async ({ request, params }) => {
    const body = (await request.json()) as { name: string; parent_folder_id?: string | null }
    const dealId = params.dealId as string
    const deal = ensureDeal(dealId)
    const now = new Date().toISOString()

    const folder: FolderRecord = {
      id: generateId('folder'),
      name: body.name,
      parentId: body.parent_folder_id ?? null,
      createdAt: now,
      updatedAt: null,
    }

    deal.folders.set(folder.id, folder)
    return HttpResponse.json(serializeFolder(dealId, folder, false), { status: 201 })
  }
)

const updateFolderHandler = http.patch(
  `${API_BASE_URL}/api/deals/:dealId/folders/:folderId`,
  async ({ request, params }) => {
    const { folderId, dealId } = params as { folderId: string; dealId: string }
    const body = (await request.json()) as { name?: string; parent_folder_id?: string | null }

    const deal = ensureDeal(dealId)
    const folder = deal.folders.get(folderId)
    if (!folder) {
      return HttpResponse.json({ detail: 'Folder not found' }, { status: 404 })
    }

    if (body.name !== undefined) {
      folder.name = body.name
    }
    if (body.parent_folder_id !== undefined) {
      folder.parentId = body.parent_folder_id ?? null
    }
    folder.updatedAt = new Date().toISOString()

    return HttpResponse.json(serializeFolder(dealId, folder, false))
  }
)

const deleteFolderHandler = http.delete(
  `${API_BASE_URL}/api/deals/:dealId/folders/:folderId`,
  ({ params }) => {
    const { dealId, folderId } = params as { dealId: string; folderId: string }
    const deal = ensureDeal(dealId)

    deal.folders.delete(folderId)
    Array.from(deal.documents.values()).forEach((doc) => {
      if (doc.folderId === folderId) {
        doc.folderId = null
      }
    })

    return HttpResponse.json({}, { status: 204 })
  }
)

const listDocumentsHandler = http.get(
  `${API_BASE_URL}/api/deals/:dealId/documents`,
  ({ request, params }) => {
    const { dealId } = params as { dealId: string }
    const searchParams = parseSearchParams(request.url)

    const page = Number(searchParams.get('page') ?? '1')
    const perPage = Number(searchParams.get('per_page') ?? '25')
    const folderId = searchParams.get('folder_id')
    const search = searchParams.get('search')
    const includeArchived = searchParams.get('include_archived') === 'true'

    const deal = ensureDeal(dealId)

    const filtered = Array.from(deal.documents.values()).filter((doc) => {
      if (!includeArchived && doc.archivedAt) return false
      if (folderId && doc.folderId !== folderId) return false
      if (search && !doc.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })

    const total = filtered.length
    const pages = Math.max(1, Math.ceil(total / perPage))
    const start = (page - 1) * perPage
    const items = filtered.slice(start, start + perPage).map((doc) => ({
      id: doc.id,
      name: doc.name,
      file_size: doc.fileSize,
      file_type: doc.fileType,
      deal_id: dealId,
      folder_id: doc.folderId,
      organization_id: DEFAULT_ORG_ID,
      uploaded_by: DEFAULT_USER_ID,
      version: doc.version,
      created_at: doc.createdAt,
      updated_at: doc.updatedAt,
      archived_at: doc.archivedAt,
    }))

    return HttpResponse.json({
      items,
      total,
      page,
      per_page: perPage,
      pages,
    })
  }
)

const archiveDocumentHandler = http.post(
  `${API_BASE_URL}/api/deals/:dealId/documents/:documentId/archive`,
  ({ params }) => {
    const { dealId, documentId } = params as { dealId: string; documentId: string }
    const deal = ensureDeal(dealId)
    const document = deal.documents.get(documentId)
    if (!document) {
      return HttpResponse.json({ detail: 'Document not found' }, { status: 404 })
    }
    document.archivedAt = new Date().toISOString()
    return HttpResponse.json({
      id: document.id,
      name: document.name,
      file_size: document.fileSize,
      file_type: document.fileType,
      deal_id: dealId,
      folder_id: document.folderId,
      organization_id: DEFAULT_ORG_ID,
      uploaded_by: DEFAULT_USER_ID,
      version: document.version,
      created_at: document.createdAt,
      updated_at: document.updatedAt,
      archived_at: document.archivedAt,
    })
  }
)

const restoreDocumentHandler = http.post(
  `${API_BASE_URL}/api/deals/:dealId/documents/:documentId/restore`,
  ({ params }) => {
    const { dealId, documentId } = params as { dealId: string; documentId: string }
    const deal = ensureDeal(dealId)
    const document = deal.documents.get(documentId)
    if (!document) {
      return HttpResponse.json({ detail: 'Document not found' }, { status: 404 })
    }
    document.archivedAt = null
    return HttpResponse.json({
      id: document.id,
      name: document.name,
      file_size: document.fileSize,
      file_type: document.fileType,
      deal_id: dealId,
      folder_id: document.folderId,
      organization_id: DEFAULT_ORG_ID,
      uploaded_by: DEFAULT_USER_ID,
      version: document.version,
      created_at: document.createdAt,
      updated_at: document.updatedAt,
      archived_at: document.archivedAt,
    })
  }
)

const deleteDocumentHandler = http.delete(
  `${API_BASE_URL}/api/deals/:dealId/documents/:documentId`,
  ({ params }) => {
    const { dealId, documentId } = params as { dealId: string; documentId: string }
    const deal = ensureDeal(dealId)
    deal.documents.delete(documentId)
    deal.permissions.delete(documentId)
    return HttpResponse.json({}, { status: 204 })
  }
)

const uploadDocumentHandler = http.post(
  `${API_BASE_URL}/api/deals/:dealId/documents`,
  async ({ request, params }) => {
    const { dealId } = params as { dealId: string }
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folderId = formData.get('folder_id')

    if (!file) {
      return HttpResponse.json({ detail: 'file field is required' }, { status: 400 })
    }

    const deal = ensureDeal(dealId)
    const id = generateId('doc')
    const now = new Date().toISOString()

    const record: DocumentRecord = {
      id,
      name: file.name,
      fileType: file.type || 'application/octet-stream',
      fileSize: file.size,
      folderId: folderId ? String(folderId) : null,
      version: 1,
      createdAt: now,
      updatedAt: null,
      archivedAt: null,
    }

    deal.documents.set(id, record)

    return HttpResponse.json(
      {
        id: record.id,
        name: record.name,
        file_size: record.fileSize,
        file_type: record.fileType,
        version: record.version,
        created_at: record.createdAt,
      },
      { status: 201 }
    )
  }
)

const downloadDocumentHandler = http.get(
  `${API_BASE_URL}/api/deals/:dealId/documents/:documentId/download`,
  ({ params }) => {
    const { dealId, documentId } = params as { dealId: string; documentId: string }
    const deal = ensureDeal(dealId)
    const document = deal.documents.get(documentId)
    if (!document) {
      return HttpResponse.json({ detail: 'Document not found' }, { status: 404 })
    }
    const encoder = new TextEncoder()
    return new HttpResponse(encoder.encode(`Mock content for ${document.name}`), {
      status: 200,
      headers: { 'Content-Type': document.fileType },
    })
  }
)

const listPermissionsHandler = http.get(
  `${API_BASE_URL}/api/documents/:documentId/permissions`,
  ({ params }) => {
    const { documentId } = params as { documentId: string }

    for (const [dealId, deal] of deals.entries()) {
      const permissions = deal.permissions.get(documentId)
      if (permissions) {
        return HttpResponse.json(
          permissions.map((permission) => ({
            id: permission.id,
            document_id: documentId,
            user_id: permission.userId,
            user_email: permission.userEmail,
            permission_level: permission.role,
            created_at: permission.createdAt,
          }))
        )
      }
    }

    return HttpResponse.json([])
  }
)

const addPermissionHandler = http.post(
  `${API_BASE_URL}/api/documents/:documentId/permissions`,
  async ({ request, params }) => {
    const { documentId } = params as { documentId: string }
    const body = (await request.json()) as { user_email: string; permission_level: PermissionRecord['role'] }

    for (const deal of deals.values()) {
      if (deal.documents.has(documentId)) {
        const now = new Date().toISOString()
        const record: PermissionRecord = {
          id: generateId('perm'),
          documentId,
          userId: body.user_email,
          userEmail: body.user_email,
          role: body.permission_level,
          createdAt: now,
        }
        const permissions = deal.permissions.get(documentId) ?? []
        permissions.push(record)
        deal.permissions.set(documentId, permissions)

        return HttpResponse.json({
          id: record.id,
          document_id: documentId,
          user_id: record.userId,
          user_email: record.userEmail,
          permission_level: record.role,
          created_at: record.createdAt,
        })
      }
    }

    return HttpResponse.json({ detail: 'Document not found' }, { status: 404 })
  }
)

const updatePermissionHandler = http.patch(
  `${API_BASE_URL}/api/documents/:documentId/permissions/:permissionId`,
  async ({ request, params }) => {
    const { documentId, permissionId } = params as { documentId: string; permissionId: string }
    const body = (await request.json()) as { permission_level?: PermissionRecord['role'] }

    for (const deal of deals.values()) {
      const permissions = deal.permissions.get(documentId)
      if (!permissions) continue

      const permission = permissions.find((item) => item.id === permissionId)
      if (!permission) continue

      if (body.permission_level) {
        permission.role = body.permission_level
      }

      return HttpResponse.json({
        id: permission.id,
        document_id: documentId,
        user_id: permission.userId,
        user_email: permission.userEmail,
        permission_level: permission.role,
        created_at: permission.createdAt,
      })
    }

    return HttpResponse.json({ detail: 'Permission not found' }, { status: 404 })
  }
)

const deletePermissionHandler = http.delete(
  `${API_BASE_URL}/api/documents/:documentId/permissions/:permissionId`,
  ({ params }) => {
    const { documentId, permissionId } = params as { documentId: string; permissionId: string }

    for (const deal of deals.values()) {
      const permissions = deal.permissions.get(documentId)
      if (!permissions) continue

      deal.permissions.set(
        documentId,
        permissions.filter((permission) => permission.id !== permissionId)
      )
      break
    }

    return HttpResponse.json({}, { status: 204 })
  }
)

const bulkMoveDocumentsHandler = http.post(
  `${API_BASE_URL}/api/deals/:dealId/documents/bulk-move`,
  async ({ request, params }) => {
    const { dealId } = params as { dealId: string }
    const body = (await request.json()) as { document_ids: string[]; target_folder_id: string }
    const deal = ensureDeal(dealId)

    const movedIds: string[] = []
    const failures: Array<{ id: string; reason: string }> = []

    for (const docId of body.document_ids) {
      const document = deal.documents.get(docId)
      if (!document) {
        failures.push({ id: docId, reason: 'Document not found' })
        continue
      }

      if (document.archivedAt) {
        failures.push({ id: docId, reason: 'Cannot move archived document' })
        continue
      }

      document.folderId = body.target_folder_id
      document.updatedAt = new Date().toISOString()
      movedIds.push(docId)
    }

    return HttpResponse.json({
      success: failures.length === 0,
      moved_ids: movedIds,
      failures: failures.length > 0 ? failures : undefined,
    })
  }
)

const bulkArchiveDocumentsHandler = http.post(
  `${API_BASE_URL}/api/deals/:dealId/documents/bulk-archive`,
  async ({ request, params }) => {
    const { dealId } = params as { dealId: string }
    const body = (await request.json()) as { document_ids: string[] }
    const deal = ensureDeal(dealId)

    const archivedIds: string[] = []
    const failures: Array<{ id: string; reason: string }> = []

    for (const docId of body.document_ids) {
      const document = deal.documents.get(docId)
      if (!document) {
        failures.push({ id: docId, reason: 'Document not found' })
        continue
      }

      if (document.archivedAt) {
        failures.push({ id: docId, reason: 'Document already archived' })
        continue
      }

      document.archivedAt = new Date().toISOString()
      document.updatedAt = new Date().toISOString()
      archivedIds.push(docId)
    }

    return HttpResponse.json({
      success: failures.length === 0,
      archived_ids: archivedIds,
      failures: failures.length > 0 ? failures : undefined,
    })
  }
)

const bulkRestoreDocumentsHandler = http.post(
  `${API_BASE_URL}/api/deals/:dealId/documents/bulk-restore`,
  async ({ request, params }) => {
    const { dealId } = params as { dealId: string }
    const body = (await request.json()) as { document_ids: string[] }
    const deal = ensureDeal(dealId)

    const restoredIds: string[] = []

    for (const docId of body.document_ids) {
      const document = deal.documents.get(docId)
      if (document && document.archivedAt) {
        document.archivedAt = null
        document.updatedAt = new Date().toISOString()
        restoredIds.push(docId)
      }
    }

    return HttpResponse.json({
      restored_ids: restoredIds,
    })
  }
)

const bulkDeleteDocumentsHandler = http.post(
  `${API_BASE_URL}/api/deals/:dealId/documents/bulk-delete`,
  async ({ request, params }) => {
    const { dealId } = params as { dealId: string }
    const body = (await request.json()) as { document_ids: string[] }
    const deal = ensureDeal(dealId)

    const deletedIds: string[] = []
    const failures: Array<{ id: string; reason: string }> = []

    for (const docId of body.document_ids) {
      const document = deal.documents.get(docId)
      if (!document) {
        failures.push({ id: docId, reason: 'Document not found' })
        continue
      }

      deal.documents.delete(docId)
      deal.permissions.delete(docId)
      deletedIds.push(docId)
    }

    return HttpResponse.json({
      success: failures.length === 0,
      deleted_ids: deletedIds,
      failures: failures.length > 0 ? failures : undefined,
    })
  }
)

export const documentHandlers = [
  listFolderHandler,
  createFolderHandler,
  updateFolderHandler,
  deleteFolderHandler,
  listDocumentsHandler,
  archiveDocumentHandler,
  restoreDocumentHandler,
  deleteDocumentHandler,
  uploadDocumentHandler,
  downloadDocumentHandler,
  listPermissionsHandler,
  addPermissionHandler,
  updatePermissionHandler,
  deletePermissionHandler,
  bulkMoveDocumentsHandler,
  bulkArchiveDocumentsHandler,
  bulkRestoreDocumentsHandler,
  bulkDeleteDocumentsHandler,
]

const blogListHandler = http.get(`${API_BASE_URL}/api/blog`, ({ request }) => {
  const url = new URL(request.url)
  const category = url.searchParams.get('category')
  const search = url.searchParams.get('search')
  const limitParam = url.searchParams.get('limit')
  let results = blogPosts

  if (category && category !== 'All Posts') {
    results = results.filter((post) => post.category === category)
  }

  if (search) {
    const lowered = search.toLowerCase()
    results = results.filter((post) =>
      post.title.toLowerCase().includes(lowered) || post.excerpt.toLowerCase().includes(lowered)
    )
  }

  if (limitParam) {
    const limit = Number(limitParam)
    if (!Number.isNaN(limit) && limit > 0) {
      results = results.slice(0, limit)
    }
  }

  return HttpResponse.json(results)
})

const blogDetailHandler = http.get(`${API_BASE_URL}/api/blog/:slug`, ({ params }) => {
  const slug = params.slug as string
  const post = blogPosts.find((entry) => entry.slug === slug)
  if (!post) {
    return HttpResponse.json({ detail: 'Not found' }, { status: 404 })
  }
  return HttpResponse.json(post)
})

const contactHandler = http.post(`${API_BASE_URL}/marketing/contact`, async ({ request }) => {
  try {
    await request.json()
  } catch {
    // ignore parse errors in tests
  }
  return HttpResponse.json({ success: true, message: 'Thanks for contacting us!' })
})

export const mswHandlers = [...documentHandlers, blogListHandler, blogDetailHandler, contactHandler]

export { resetDocumentRoomFixtures, collectAllFolders }

