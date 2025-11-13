import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DataRoom } from './DataRoom'

const documentWorkspaceSpy = vi.fn()

vi.mock('../documents/DocumentWorkspace', () => ({
  __esModule: true,
  default: (props: any) => {
    documentWorkspaceSpy(props)
    return (
      <div data-testid="document-workspace">
        <button onClick={() => props.onDocumentsLoaded?.([])}>mock-load</button>
        <button onClick={() => props.onError?.(new Error('Generic failure'))}>trigger-error</button>
        <button
          onClick={() =>
            props.onError?.({
              status: 403,
              data: {
                detail: {
                  message: 'Enterprise tier required',
                  required_tier_label: 'Enterprise',
                  upgrade_cta_url: 'https://example.com/pricing',
                },
              },
            })
          }
        >
          trigger-entitlement
        </button>
      </div>
    )
  },
}))

vi.mock('react-router-dom', () => ({
  useParams: () => ({ dealId: 'deal-123' }),
}))

describe('DataRoom', () => {
  beforeEach(() => {
    documentWorkspaceSpy.mockClear()
  })

  it('renders the document workspace shell with header copy', () => {
    render(<DataRoom />)

    expect(screen.getByRole('heading', { name: /data room/i })).toBeInTheDocument()
    expect(screen.getByText(/organise diligence files/i)).toBeInTheDocument()
    expect(screen.getByTestId('document-workspace')).toBeInTheDocument()
    expect(documentWorkspaceSpy).toHaveBeenCalledWith(
      expect.objectContaining({ dealId: 'deal-123', onError: expect.any(Function), onDocumentsLoaded: expect.any(Function) })
    )
  })

  it('shows an entitlement gate and hides the workspace when the API responds with 403', () => {
    render(<DataRoom />)

    fireEvent.click(screen.getByText('trigger-entitlement'))

    expect(screen.getByText(/access restricted/i)).toBeInTheDocument()
    expect(screen.getByText(/enterprise tier required/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /view pricing plans/i })).toHaveAttribute('href', 'https://example.com/pricing')
    expect(screen.queryByTestId('document-workspace')).not.toBeInTheDocument()
  })

  it('surfaces non-entitlement errors but keeps the workspace visible', () => {
    render(<DataRoom />)

    fireEvent.click(screen.getByText('trigger-error'))

    expect(screen.getByText(/generic failure/i)).toBeInTheDocument()
    expect(screen.getByTestId('document-workspace')).toBeInTheDocument()
  })

  it('clears transient error messaging once documents load successfully again', () => {
    render(<DataRoom />)

    fireEvent.click(screen.getByText('trigger-error'))
    expect(screen.getByText(/generic failure/i)).toBeInTheDocument()

    fireEvent.click(screen.getByText('mock-load'))
    expect(screen.queryByText(/generic failure/i)).not.toBeInTheDocument()
  })
})
