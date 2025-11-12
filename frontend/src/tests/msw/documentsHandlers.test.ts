import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest'
import { setupServer } from 'msw/node'
import {
  listDocuments,
  listFolders,
  bulkMoveDocuments,
  bulkArchiveDocuments,
  restoreArchivedDocuments,
  bulkDeleteDocuments,
} from '../../services/api/documents'
import { documentHandlers, resetDocumentRoomFixtures } from './server'

const server = setupServer(...documentHandlers)

describe('MSW document handlers', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
  })

  afterAll(() => {
    server.close()
  })

  beforeEach(() => {
    resetDocumentRoomFixtures()
  })

  afterEach(() => {
    server.resetHandlers()
  })

  describe('Basic handlers', () => {
    it('returns mock root folders with child metadata', async () => {
      const folders = await listFolders('deal-msw', { includeTree: true })
      expect(folders.length).toBeGreaterThan(0)
      expect(folders[0]).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
      })
    })

    it('returns paginated document results', async () => {
      const response = await listDocuments('deal-msw', { page: 1, per_page: 10 })
      expect(response.items.length).toBeGreaterThan(0)
      expect(response.total).toBeGreaterThanOrEqual(response.items.length)
    })
  })

  describe('Bulk operations', () => {
    describe('bulkMoveDocuments', () => {
      it('moves multiple documents to target folder', async () => {
        const result = await bulkMoveDocuments('deal-msw', {
          document_ids: ['doc-financial-summary', 'doc-nda-template'],
          target_folder_id: 'folder-root',
        })

        expect(result.success).toBe(true)
        expect(result.moved_ids).toEqual(['doc-financial-summary', 'doc-nda-template'])
        expect(result.failures).toBeUndefined()
      })

      it('handles partial failures when document not found', async () => {
        const result = await bulkMoveDocuments('deal-msw', {
          document_ids: ['doc-financial-summary', 'doc-nonexistent'],
          target_folder_id: 'folder-root',
        })

        expect(result.success).toBe(false)
        expect(result.moved_ids).toEqual(['doc-financial-summary'])
        expect(result.failures).toHaveLength(1)
        expect(result.failures?.[0]).toMatchObject({
          id: 'doc-nonexistent',
          reason: 'Document not found',
        })
      })

      it('prevents moving archived documents', async () => {
        // First archive the document
        await bulkArchiveDocuments('deal-msw', {
          document_ids: ['doc-financial-summary'],
        })

        // Try to move archived document
        const result = await bulkMoveDocuments('deal-msw', {
          document_ids: ['doc-financial-summary'],
          target_folder_id: 'folder-root',
        })

        expect(result.success).toBe(false)
        expect(result.moved_ids).toEqual([])
        expect(result.failures).toHaveLength(1)
        expect(result.failures?.[0]).toMatchObject({
          id: 'doc-financial-summary',
          reason: 'Cannot move archived document',
        })
      })
    })

    describe('bulkArchiveDocuments', () => {
      it('archives multiple documents', async () => {
        const result = await bulkArchiveDocuments('deal-msw', {
          document_ids: ['doc-financial-summary', 'doc-nda-template'],
        })

        expect(result.success).toBe(true)
        expect(result.archived_ids).toEqual(['doc-financial-summary', 'doc-nda-template'])
        expect(result.failures).toBeUndefined()

        // Verify documents are archived
        const docs = await listDocuments('deal-msw', { include_archived: true })
        const archivedDoc = docs.items.find((d) => d.id === 'doc-financial-summary')
        expect(archivedDoc?.archived_at).toBeTruthy()
      })

      it('handles partial failures when document not found', async () => {
        const result = await bulkArchiveDocuments('deal-msw', {
          document_ids: ['doc-financial-summary', 'doc-nonexistent'],
        })

        expect(result.success).toBe(false)
        expect(result.archived_ids).toEqual(['doc-financial-summary'])
        expect(result.failures).toHaveLength(1)
        expect(result.failures?.[0]).toMatchObject({
          id: 'doc-nonexistent',
          reason: 'Document not found',
        })
      })

      it('prevents archiving already archived documents', async () => {
        // Archive once
        await bulkArchiveDocuments('deal-msw', {
          document_ids: ['doc-financial-summary'],
        })

        // Try to archive again
        const result = await bulkArchiveDocuments('deal-msw', {
          document_ids: ['doc-financial-summary'],
        })

        expect(result.success).toBe(false)
        expect(result.archived_ids).toEqual([])
        expect(result.failures).toHaveLength(1)
        expect(result.failures?.[0]).toMatchObject({
          id: 'doc-financial-summary',
          reason: 'Document already archived',
        })
      })
    })

    describe('restoreArchivedDocuments', () => {
      it('restores archived documents', async () => {
        // First archive
        await bulkArchiveDocuments('deal-msw', {
          document_ids: ['doc-financial-summary'],
        })

        // Then restore
        const result = await restoreArchivedDocuments('deal-msw', ['doc-financial-summary'])

        expect(result.restored_ids).toEqual(['doc-financial-summary'])

        // Verify document is no longer archived
        const docs = await listDocuments('deal-msw', { include_archived: false })
        const restoredDoc = docs.items.find((d) => d.id === 'doc-financial-summary')
        expect(restoredDoc).toBeTruthy()
        expect(restoredDoc?.archived_at).toBeNull()
      })

      it('handles nonexistent documents gracefully', async () => {
        const result = await restoreArchivedDocuments('deal-msw', ['doc-nonexistent'])

        expect(result.restored_ids).toEqual([])
      })

      it('only restores actually archived documents', async () => {
        // Try to restore a document that was never archived
        const result = await restoreArchivedDocuments('deal-msw', ['doc-financial-summary'])

        expect(result.restored_ids).toEqual([])
      })
    })

    describe('bulkDeleteDocuments', () => {
      it('deletes multiple documents', async () => {
        const result = await bulkDeleteDocuments('deal-msw', [
          'doc-financial-summary',
          'doc-nda-template',
        ])

        expect(result.success).toBe(true)
        expect(result.deleted_ids).toEqual(['doc-financial-summary', 'doc-nda-template'])
        expect(result.failures).toBeUndefined()

        // Verify documents no longer exist
        const docs = await listDocuments('deal-msw', { include_archived: true })
        const deletedDoc = docs.items.find((d) => d.id === 'doc-financial-summary')
        expect(deletedDoc).toBeUndefined()
      })

      it('handles partial failures when document not found', async () => {
        const result = await bulkDeleteDocuments('deal-msw', [
          'doc-financial-summary',
          'doc-nonexistent',
        ])

        expect(result.success).toBe(false)
        expect(result.deleted_ids).toEqual(['doc-financial-summary'])
        expect(result.failures).toHaveLength(1)
        expect(result.failures?.[0]).toMatchObject({
          id: 'doc-nonexistent',
          reason: 'Document not found',
        })
      })
    })
  })
})

