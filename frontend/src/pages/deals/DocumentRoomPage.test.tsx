/**
 * DocumentRoomPage Component Tests (TDD: RED Phase)
 *
 * Tests for the main Document Room page integrating:
 * - FolderTree (hierarchical navigation)
 * - DocumentList (document listing)
 * - UploadPanel (file uploads)
 * - BulkActionsToolbar (multi-select operations)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { DocumentRoomPage } from './DocumentRoomPage'
import * as documentApi from '@/services/api/documents'

// Mock Clerk auth
vi.mock('@clerk/clerk-react', () => ({
  useAuth: () => ({ isLoaded: true, isSignedIn: true }),
  useUser: () => ({
    isLoaded: true,
    isSignedIn: true,
    user: {
      id: 'user_123',
      primaryEmailAddress: { emailAddress: 'test@example.com' },
      fullName: 'Test User',
    },
  }),
  useOrganization: () => ({
    isLoaded: true,
    organization: {
      id: 'org_123',
      name: 'Test Org',
    },
  }),
}))

// Mock document API
vi.mock('@/services/api/documents', () => ({
  listFolders: vi.fn(),
  listDocuments: vi.fn(),
  uploadDocument: vi.fn(),
  bulkDownloadDocuments: vi.fn(),
  bulkDeleteDocuments: vi.fn(),
}))

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

const renderDocumentRoom = (dealId = 'deal-123') => {
  const queryClient = createQueryClient()

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/deals/${dealId}/documents`]}>
        <Routes>
          <Route path="/deals/:dealId/documents" element={<DocumentRoomPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('DocumentRoomPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Layout and Initial Rendering', () => {
    it('should render the main document room layout', () => {
      vi.mocked(documentApi.listFolders).mockResolvedValue([])
      vi.mocked(documentApi.listDocuments).mockResolvedValue({
        items: [],
        total: 0,
        page: 1,
        per_page: 50,
        pages: 1,
      })

      renderDocumentRoom()

      expect(screen.getByRole('heading', { name: /document room/i })).toBeInTheDocument()
    })

    it('should display folder tree navigation', async () => {
      vi.mocked(documentApi.listFolders).mockResolvedValue([
        {
          id: 'folder-1',
          name: 'Financial Statements',
          parent_folder_id: null,
          deal_id: 'deal-123',
          created_at: '2025-11-01T00:00:00Z',
          document_count: 5,
        },
        {
          id: 'folder-2',
          name: 'Legal Documents',
          parent_folder_id: null,
          deal_id: 'deal-123',
          created_at: '2025-11-02T00:00:00Z',
          document_count: 3,
        },
      ])
      vi.mocked(documentApi.listDocuments).mockResolvedValue({
        items: [],
        total: 0,
        page: 1,
        per_page: 50,
        pages: 1,
      })

      renderDocumentRoom()

      await waitFor(() => {
        expect(screen.getByText('Financial Statements')).toBeInTheDocument()
        expect(screen.getByText('Legal Documents')).toBeInTheDocument()
      })
    })

    it('should display document list table', async () => {
      vi.mocked(documentApi.listFolders).mockResolvedValue([])
      vi.mocked(documentApi.listDocuments).mockResolvedValue({
        items: [
          {
            id: 'doc-1',
            name: '2024-Q4-Financials.pdf',
            file_type: 'application/pdf',
            file_size: 2048000,
            deal_id: 'deal-123',
            folder_id: null,
            uploaded_by: 'user_123',
            uploaded_by_name: 'Test User',
            created_at: '2025-11-01T10:00:00Z',
            updated_at: '2025-11-01T10:00:00Z',
          },
        ],
        total: 1,
        page: 1,
        per_page: 50,
        pages: 1,
      })

      renderDocumentRoom()

      await waitFor(() => {
        expect(screen.getByText('2024-Q4-Financials.pdf')).toBeInTheDocument()
      })
    })

    it('should display upload panel', () => {
      vi.mocked(documentApi.listFolders).mockResolvedValue([])
      vi.mocked(documentApi.listDocuments).mockResolvedValue({
        items: [],
        total: 0,
        page: 1,
        per_page: 50,
        pages: 1,
      })

      renderDocumentRoom()

      expect(screen.getByText(/drag.*drop.*files/i)).toBeInTheDocument()
    })
  })

  describe('Folder Navigation', () => {
    it('should filter documents when folder is selected', async () => {
      vi.mocked(documentApi.listFolders).mockResolvedValue([
        {
          id: 'folder-1',
          name: 'Financial Statements',
          parent_folder_id: null,
          deal_id: 'deal-123',
          created_at: '2025-11-01T00:00:00Z',
          document_count: 2,
        },
      ])
      vi.mocked(documentApi.listDocuments)
        .mockResolvedValueOnce({
          items: [],
          total: 0,
          page: 1,
          per_page: 50,
          pages: 1,
        })
        .mockResolvedValueOnce({
          items: [
            {
              id: 'doc-1',
              name: 'Balance-Sheet.pdf',
              file_type: 'application/pdf',
              file_size: 1024000,
              deal_id: 'deal-123',
              folder_id: 'folder-1',
              uploaded_by: 'user_123',
              uploaded_by_name: 'Test User',
              created_at: '2025-11-01T10:00:00Z',
              updated_at: '2025-11-01T10:00:00Z',
            },
          ],
          total: 1,
          page: 1,
          per_page: 50,
          pages: 1,
        })

      const { user } = renderDocumentRoom()

      await waitFor(() => {
        expect(screen.getByText('Financial Statements')).toBeInTheDocument()
      })

      // Click on folder
      await user.click(screen.getByText('Financial Statements'))

      // Should call listDocuments with folder filter
      await waitFor(() => {
        expect(documentApi.listDocuments).toHaveBeenCalledWith(
          'deal-123',
          expect.objectContaining({
            folder_id: 'folder-1',
          })
        )
      })
    })

    it('should show breadcrumb navigation for current folder', async () => {
      vi.mocked(documentApi.listFolders).mockResolvedValue([
        {
          id: 'folder-1',
          name: 'Financial Statements',
          parent_folder_id: null,
          deal_id: 'deal-123',
          created_at: '2025-11-01T00:00:00Z',
          document_count: 2,
        },
        {
          id: 'folder-2',
          name: '2024 Q4',
          parent_folder_id: 'folder-1',
          deal_id: 'deal-123',
          created_at: '2025-11-02T00:00:00Z',
          document_count: 1,
        },
      ])
      vi.mocked(documentApi.listDocuments).mockResolvedValue({
        items: [],
        total: 0,
        page: 1,
        per_page: 50,
        pages: 1,
      })

      const { user } = renderDocumentRoom()

      await waitFor(() => {
        expect(screen.getByText('Financial Statements')).toBeInTheDocument()
      })

      // Click on nested folder
      await user.click(screen.getByText('2024 Q4'))

      // Should show breadcrumb
      await waitFor(() => {
        const breadcrumb = screen.getByRole('navigation', { name: /breadcrumb/i })
        expect(within(breadcrumb).getByText('Financial Statements')).toBeInTheDocument()
        expect(within(breadcrumb).getByText('2024 Q4')).toBeInTheDocument()
      })
    })
  })

  describe('Document Selection and Bulk Actions', () => {
    it('should enable bulk actions when documents are selected', async () => {
      vi.mocked(documentApi.listFolders).mockResolvedValue([])
      vi.mocked(documentApi.listDocuments).mockResolvedValue({
        items: [
          {
            id: 'doc-1',
            name: 'Document1.pdf',
            file_type: 'application/pdf',
            file_size: 1024000,
            deal_id: 'deal-123',
            folder_id: null,
            uploaded_by: 'user_123',
            uploaded_by_name: 'Test User',
            created_at: '2025-11-01T10:00:00Z',
            updated_at: '2025-11-01T10:00:00Z',
          },
          {
            id: 'doc-2',
            name: 'Document2.pdf',
            file_type: 'application/pdf',
            file_size: 2048000,
            deal_id: 'deal-123',
            folder_id: null,
            uploaded_by: 'user_123',
            uploaded_by_name: 'Test User',
            created_at: '2025-11-02T10:00:00Z',
            updated_at: '2025-11-02T10:00:00Z',
          },
        ],
        total: 2,
        page: 1,
        per_page: 50,
        pages: 1,
      })

      const { user } = renderDocumentRoom()

      await waitFor(() => {
        expect(screen.getByText('Document1.pdf')).toBeInTheDocument()
      })

      // Select first document
      const checkbox1 = screen.getAllByRole('checkbox')[0]
      await user.click(checkbox1)

      // Bulk actions should be enabled
      await waitFor(() => {
        const downloadButton = screen.getByRole('button', { name: /download.*selected/i })
        expect(downloadButton).toBeEnabled()
      })
    })

    it('should show selection count when documents are selected', async () => {
      vi.mocked(documentApi.listFolders).mockResolvedValue([])
      vi.mocked(documentApi.listDocuments).mockResolvedValue({
        items: [
          {
            id: 'doc-1',
            name: 'Document1.pdf',
            file_type: 'application/pdf',
            file_size: 1024000,
            deal_id: 'deal-123',
            folder_id: null,
            uploaded_by: 'user_123',
            uploaded_by_name: 'Test User',
            created_at: '2025-11-01T10:00:00Z',
            updated_at: '2025-11-01T10:00:00Z',
          },
        ],
        total: 1,
        page: 1,
        per_page: 50,
        pages: 1,
      })

      const { user } = renderDocumentRoom()

      await waitFor(() => {
        expect(screen.getByText('Document1.pdf')).toBeInTheDocument()
      })

      // Select document
      const checkbox = screen.getAllByRole('checkbox')[0]
      await user.click(checkbox)

      // Should show selection count
      await waitFor(() => {
        expect(screen.getByText(/1.*selected/i)).toBeInTheDocument()
      })
    })
  })

  describe('Error Handling', () => {
    it('should display error message when folder loading fails', async () => {
      vi.mocked(documentApi.listFolders).mockRejectedValue(new Error('Failed to load folders'))
      vi.mocked(documentApi.listDocuments).mockResolvedValue({
        items: [],
        total: 0,
        page: 1,
        per_page: 50,
        pages: 1,
      })

      renderDocumentRoom()

      await waitFor(() => {
        expect(screen.getByText(/failed.*load.*folders/i)).toBeInTheDocument()
      })
    })

    it('should display error message when document loading fails', async () => {
      vi.mocked(documentApi.listFolders).mockResolvedValue([])
      vi.mocked(documentApi.listDocuments).mockRejectedValue(new Error('Failed to load documents'))

      renderDocumentRoom()

      await waitFor(() => {
        expect(screen.getByText(/failed.*load.*documents/i)).toBeInTheDocument()
      })
    })
  })

  describe('Loading States', () => {
    it('should show loading spinner while fetching data', () => {
      vi.mocked(documentApi.listFolders).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve([]), 1000))
      )
      vi.mocked(documentApi.listDocuments).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  items: [],
                  total: 0,
                  page: 1,
                  per_page: 50,
                  pages: 1,
                }),
              1000
            )
          )
      )

      renderDocumentRoom()

      expect(screen.getByRole('status')).toBeInTheDocument()
      expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })
  })

  describe('Empty States', () => {
    it('should show empty state when no folders exist', async () => {
      vi.mocked(documentApi.listFolders).mockResolvedValue([])
      vi.mocked(documentApi.listDocuments).mockResolvedValue({
        items: [],
        total: 0,
        page: 1,
        per_page: 50,
        pages: 1,
      })

      renderDocumentRoom()

      await waitFor(() => {
        expect(screen.getByText(/no folders/i)).toBeInTheDocument()
      })
    })

    it('should show empty state when no documents exist', async () => {
      vi.mocked(documentApi.listFolders).mockResolvedValue([])
      vi.mocked(documentApi.listDocuments).mockResolvedValue({
        items: [],
        total: 0,
        page: 1,
        per_page: 50,
        pages: 1,
      })

      renderDocumentRoom()

      await waitFor(() => {
        expect(screen.getByText(/no documents/i)).toBeInTheDocument()
      })
    })

    it('should show call-to-action to upload first document', async () => {
      vi.mocked(documentApi.listFolders).mockResolvedValue([])
      vi.mocked(documentApi.listDocuments).mockResolvedValue({
        items: [],
        total: 0,
        page: 1,
        per_page: 50,
        pages: 1,
      })

      renderDocumentRoom()

      await waitFor(() => {
        expect(screen.getByText(/upload.*first.*document/i)).toBeInTheDocument()
      })
    })
  })
})
