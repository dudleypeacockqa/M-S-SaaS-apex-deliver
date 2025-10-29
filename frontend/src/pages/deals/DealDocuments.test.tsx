import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import * as documentsApi from '../../services/api/documents'
import { DealDocuments } from './DealDocuments'

vi.mock('../../services/api/documents', async (original) => {
  const actual = await original()
  return {
    ...actual,
    listDocuments: vi.fn(),
    uploadDocument: vi.fn(),
  }
})

const mockedDocuments = documentsApi as unknown as {
  listDocuments: ReturnType<typeof vi.fn>
  uploadDocument: ReturnType<typeof vi.fn>
}

const renderDocuments = (initialEntry = '/deals/deal-123/documents') => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/deals/:dealId/documents" element={<DealDocuments />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('DealDocuments', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mockedDocuments.listDocuments.mockResolvedValue({
      items: [
        {
          id: 'doc-1',
          name: 'financials.pdf',
          file_size: 1048576,
          file_type: 'application/pdf',
          deal_id: 'deal-123',
          folder_id: null,
          organization_id: 'org-1',
          uploaded_by: 'user-1',
          version: 3,
          created_at: new Date('2025-10-01T12:00:00Z').toISOString(),
          updated_at: null,
          archived_at: null,
        },
      ],
      total: 1,
      page: 1,
      per_page: 25,
      pages: 1,
    })
    mockedDocuments.uploadDocument.mockResolvedValue({
      id: 'doc-2',
      name: 'cap-table.xlsx',
      file_size: 2048,
      file_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      version: 1,
      created_at: new Date('2025-10-02T10:30:00Z').toISOString(),
    })
  })

  it('renders document rows with formatted size, version badge, and action buttons', async () => {
    renderDocuments()

    await waitFor(() => expect(mockedDocuments.listDocuments).toHaveBeenCalledTimes(1))

    const table = await screen.findByRole('table', { name: /documents/i })
    const row = within(table).getByRole('row', { name: /financials\.pdf/i })
    expect(within(row).getByText('financials.pdf')).toBeInTheDocument()
    expect(within(row).getByText('1 MB')).toBeInTheDocument()
    expect(within(row).getByText('v3')).toBeInTheDocument()
    expect(within(row).getByRole('button', { name: /download/i })).toBeDisabled()
  })

  it('uploads a document and refetches the list', async () => {
    renderDocuments()

    await waitFor(() => expect(mockedDocuments.listDocuments).toHaveBeenCalledTimes(1))

    const file = new File(['data'], 'cap-table.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const fileInput = screen.getByLabelText(/upload document/i)
    await userEvent.upload(fileInput, file)

    await waitFor(() => expect(mockedDocuments.uploadDocument).toHaveBeenCalledWith('deal-123', expect.any(File), expect.any(Object)))
    await waitFor(() => expect(mockedDocuments.listDocuments).toHaveBeenCalledTimes(2))
  })

  it('shows empty state when no documents are returned', async () => {
    mockedDocuments.listDocuments.mockResolvedValueOnce({ items: [], total: 0, page: 1, per_page: 25, pages: 1 })

    renderDocuments()

    expect(await screen.findByText(/no documents uploaded yet/i)).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: /upload document/i })).toBeEnabled()
  })
})
