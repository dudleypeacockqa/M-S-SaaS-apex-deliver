import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { ShareLinkModal } from './ShareLinkModal'
import {
  listShareLinks,
  createShareLink,
  revokeShareLink,
} from '../../services/api/documents'

vi.mock('../../services/api/documents', () => ({
  listShareLinks: vi.fn(),
  createShareLink: vi.fn(),
  revokeShareLink: vi.fn(),
}))

const renderModal = (props: Parameters<typeof ShareLinkModal>[0]) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  const view = render(
    <QueryClientProvider client={queryClient}>
      <ShareLinkModal {...props} />
    </QueryClientProvider>
  )

  return { ...view, queryClient }
}

describe('ShareLinkModal', () => {
  beforeEach(() => {
    vi.mocked(listShareLinks).mockResolvedValue([])
    vi.mocked(createShareLink).mockResolvedValue({
      share_link_id: 'link-new',
      share_url: 'https://example.com/shared/link-new',
      expires_at: '2025-11-12T10:00:00Z',
      created_at: '2025-11-11T09:00:00Z',
      allow_download: true,
      password_required: false,
      access_count: 0,
    })
    vi.mocked(revokeShareLink).mockResolvedValue()
  })

  it('renders share link form when open', async () => {
    renderModal({ documentId: 'doc-1', documentName: 'NDA.pdf', isOpen: true, onClose: vi.fn() })

    expect(await screen.findByText(/share “nda.pdf”/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/expiration/i)).toHaveValue(7)
  })

  it('creates share link with form values', async () => {
    renderModal({ documentId: 'doc-1', isOpen: true, onClose: vi.fn() })

    const expiresInput = await screen.findByLabelText(/expiration/i)
    fireEvent.change(expiresInput, { target: { value: '14' } })
    const passwordToggle = screen.getByLabelText(/require password/i)
    fireEvent.click(passwordToggle)
    const passwordInput = await screen.findByLabelText(/password/i)
    fireEvent.change(passwordInput, { target: { value: 'StrongPass1' } })

    fireEvent.click(screen.getByRole('button', { name: /create share link/i }))

    await waitFor(() => {
      expect(createShareLink).toHaveBeenCalledWith('doc-1', {
        expires_in_days: 14,
        allow_download: true,
        password_protected: true,
        password: 'StrongPass1',
      })
    })
  })

  it('lists existing links and revokes one', async () => {
    vi.mocked(listShareLinks).mockResolvedValueOnce([
      {
        share_link_id: 'link-1',
        share_url: 'https://example.com/shared/link-1',
        expires_at: '2025-11-12T10:00:00Z',
        created_at: '2025-11-11T09:00:00Z',
        allow_download: true,
        password_required: false,
        access_count: 3,
      },
    ])

    renderModal({ documentId: 'doc-1', isOpen: true, onClose: vi.fn() })

    expect(await screen.findByText(/link-1/i)).toBeInTheDocument()

    const revokeButton = screen.getByRole('button', { name: /revoke/i })
    fireEvent.click(revokeButton)

    await waitFor(() => {
      expect(revokeShareLink).toHaveBeenCalledWith('doc-1', 'link-1')
    })
  })
})

