import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { AccessLogDrawer } from './AccessLogDrawer'
import { listDocumentAccessLogs } from '../../services/api/documents'

vi.mock('../../services/api/documents', () => ({
  listDocumentAccessLogs: vi.fn(),
}))

const renderDrawer = (props: Parameters<typeof AccessLogDrawer>[0]) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  const view = render(
    <QueryClientProvider client={queryClient}>
      <AccessLogDrawer {...props} />
    </QueryClientProvider>
  )

  return { ...view, queryClient }
}

describe('AccessLogDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('renders nothing when drawer is closed', () => {
    const { container } = renderDrawer({
      dealId: 'deal-1',
      documentId: null,
      isOpen: false,
      onClose: vi.fn(),
    })

    expect(container).toBeEmptyDOMElement()
  })

  it('shows logs when query resolves', async () => {
    vi.mocked(listDocumentAccessLogs).mockResolvedValueOnce([
      {
        id: 'log-1',
        document_id: 'doc-1',
        user_id: 'user-1',
        user_name: 'Alex Analyst',
        action: 'view',
        ip_address: '127.0.0.1',
        user_agent: 'Vitest',
        created_at: '2025-11-12T10:00:00Z',
      },
    ])

    renderDrawer({
      dealId: 'deal-1',
      documentId: 'doc-1',
      documentName: 'SPA.pdf',
      isOpen: true,
      onClose: vi.fn(),
    })

    expect(await screen.findByText(/activity • spa\.pdf/i)).toBeInTheDocument()
    expect(await screen.findByText(/alex analyst/i)).toBeInTheDocument()
    expect(listDocumentAccessLogs).toHaveBeenCalledWith('deal-1', 'doc-1', { limit: 100 })
  })

  it('shows empty state when there are no logs', async () => {
    vi.mocked(listDocumentAccessLogs).mockResolvedValueOnce([])

    renderDrawer({
      dealId: 'deal-1',
      documentId: 'doc-2',
      isOpen: true,
      onClose: vi.fn(),
    })

    expect(await screen.findByText(/no activity recorded yet/i)).toBeInTheDocument()
  })

  it('surfaces error state and retries on demand', async () => {
    vi.mocked(listDocumentAccessLogs)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce([
        {
          id: 'log-2',
          document_id: 'doc-3',
          user_id: 'user-9',
          action: 'download',
          created_at: '2025-11-12T12:00:00Z',
        },
      ])

    renderDrawer({
      dealId: 'deal-1',
      documentId: 'doc-3',
      isOpen: true,
      onClose: vi.fn(),
    })

    expect(await screen.findByText(/network error/i)).toBeInTheDocument()

    const retryButton = screen.getByRole('button', { name: /retry/i })
    fireEvent.click(retryButton)

    await waitFor(() => {
      expect(listDocumentAccessLogs).toHaveBeenCalledTimes(2)
      expect(screen.getByText(/download/i)).toBeInTheDocument()
    })
  })

  it('filters logs by action when a filter is selected', async () => {
    vi.mocked(listDocumentAccessLogs).mockResolvedValueOnce([
      {
        id: 'log-view',
        document_id: 'doc-1',
        user_id: 'viewer',
        action: 'view',
        created_at: '2025-11-12T10:00:00Z',
      },
      {
        id: 'log-download',
        document_id: 'doc-1',
        user_id: 'downloader',
        action: 'download',
        created_at: '2025-11-12T10:05:00Z',
      },
    ])

    renderDrawer({
      dealId: 'deal-1',
      documentId: 'doc-1',
      isOpen: true,
      onClose: vi.fn(),
    })

    const select = await screen.findByLabelText(/action filter/i)
    fireEvent.change(select, { target: { value: 'download' } })

    await waitFor(() => {
      expect(screen.getByText(/downloader/i)).toBeInTheDocument()
      expect(screen.queryByText(/viewer/i)).not.toBeInTheDocument()
    })
  })

  it('downloads the filtered logs as CSV', async () => {
    vi.mocked(listDocumentAccessLogs).mockResolvedValueOnce([
      {
        id: 'log-download',
        document_id: 'doc-1',
        user_id: 'downloader',
        action: 'download',
        created_at: '2025-11-12T10:05:00Z',
        ip_address: '10.0.0.1',
        user_agent: 'Vitest',
      },
    ])

    const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:csv')
    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    renderDrawer({
      dealId: 'deal-1',
      documentId: 'doc-1',
      documentName: 'SPA.pdf',
      isOpen: true,
      onClose: vi.fn(),
    })

    await screen.findByText(/downloader/i)
    const downloadButton = screen.getByRole('button', { name: /download csv/i })
    fireEvent.click(downloadButton)

    await waitFor(() => {
      expect(createObjectURLSpy).toHaveBeenCalledTimes(1)
      expect(clickSpy).toHaveBeenCalledTimes(1)
      expect(revokeSpy).toHaveBeenCalledWith('blob:csv')
    })

    createObjectURLSpy.mockRestore()
    revokeSpy.mockRestore()
    clickSpy.mockRestore()
  })
})
