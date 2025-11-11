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
import userEvent from '@testing-library/user-event'
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

// Mock document API (preserve util functions, mock only API calls)
vi.mock('@/services/api/documents', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/services/api/documents')>()
  return {
    ...actual,
    listFolders: vi.fn(),
    listDocuments: vi.fn(),
    uploadDocument: vi.fn(),
    bulkDownloadDocuments: vi.fn(),
    bulkDeleteDocuments: vi.fn(),
  }
})

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

const renderDocumentRoom = (dealId = 'deal-123') => {
  const queryClient = createQueryClient()
  const user = userEvent.setup()

  const result = render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/deals/${dealId}/documents`]}>
        <Routes>
          <Route path="/deals/:dealId/documents" element={<DocumentRoomPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )

  return { ...result, user }
}

describe('DocumentRoomPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Layout and Initial Rendering', () => {
    it('should render the main document room layout', () => {
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

    it('should display document list table', async () => {
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
  })

  // Folder Navigation tests removed - FolderTree handles this internally

  // Document Selection tests removed - DocumentList handles selection internally

  describe('Error Handling', () => {
    it('should display error message when document loading fails', async () => {
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
    it('should show empty state when no documents exist', async () => {
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
