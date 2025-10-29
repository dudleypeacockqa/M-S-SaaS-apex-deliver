import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import { NewDealPage } from './NewDealPage'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const mockCreateDeal = vi.fn()

vi.mock('../../services/api/deals', async () => {
  const actual = await vi.importActual<typeof import('../../services/api/deals')>('../../services/api/deals')
  return {
    ...actual,
    createDeal: (...args: Parameters<typeof actual.createDeal>) => mockCreateDeal(...args),
  }
})

const renderPage = () =>
  render(
    <MemoryRouter>
      <NewDealPage />
    </MemoryRouter>
  )

describe('NewDealPage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('shows validation errors when required fields missing', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: /create deal/i }))

    expect(await screen.findByText(/deal name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/target company is required/i)).toBeInTheDocument()
    expect(mockCreateDeal).not.toHaveBeenCalled()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('submits payload and navigates to deal details on success', async () => {
    const user = userEvent.setup()
    mockCreateDeal.mockResolvedValueOnce({ id: 'deal-123' })

    renderPage()

    await user.type(screen.getByLabelText(/deal name/i), 'Acme Acquisition')
    await user.type(screen.getByLabelText(/target company/i), 'Acme Ltd')
    await user.type(screen.getByLabelText(/industry/i), 'Manufacturing')
    await user.type(screen.getByLabelText(/deal size/i), '5000000')
    await user.selectOptions(screen.getByLabelText(/currency/i), 'USD')
    await user.selectOptions(screen.getByLabelText(/initial stage/i), 'negotiation')
    await user.type(screen.getByLabelText(/description/i), 'Strategic acquisition')

    await user.click(screen.getByRole('button', { name: /create deal/i }))

    await waitFor(() => {
      expect(mockCreateDeal).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Acme Acquisition',
          target_company: 'Acme Ltd',
          industry: 'Manufacturing',
          deal_size: 5000000,
          currency: 'USD',
          stage: 'negotiation',
          description: 'Strategic acquisition',
        })
      )
    })

    expect(mockNavigate).toHaveBeenCalledWith('/deals/deal-123')
  })

  it('displays backend error when createDeal rejects', async () => {
    const user = userEvent.setup()
    mockCreateDeal.mockRejectedValueOnce(new Error('Failed to create deal'))

    renderPage()

    await user.type(screen.getByLabelText(/deal name/i), 'Error Deal')
    await user.type(screen.getByLabelText(/target company/i), 'Error Co')
    await user.click(screen.getByRole('button', { name: /create deal/i }))

    expect(await screen.findByText(/failed to create deal/i)).toBeInTheDocument()
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})

