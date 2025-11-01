/**
 * CreateDealModal Component Tests
 *
 * Tests for the deal creation/edit modal component
 * TDD: RED PHASE - Writing tests first
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CreateDealModal } from './CreateDealModal'
import type { Deal } from '@/services/api/deals'

// Mock the deals hooks
vi.mock('@/hooks/deals', () => ({
  useCreateDeal: () => ({
    mutateAsync: vi.fn().mockResolvedValue({ id: 'new-deal-id' }),
    isPending: false,
    isError: false,
    error: null,
  }),
  useUpdateDeal: () => ({
    mutateAsync: vi.fn().mockResolvedValue({ id: 'updated-deal-id' }),
    isPending: false,
    isError: false,
    error: null,
  }),
}))

describe('CreateDealModal', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  const mockOnClose = vi.fn()
  const mockOnSuccess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderModal = (props = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <CreateDealModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
          {...props}
        />
      </QueryClientProvider>
    )
  }

  describe('Rendering - Create Mode', () => {
    it('should render modal when isOpen is true', () => {
      renderModal()

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('should not render modal when isOpen is false', () => {
      renderModal({ isOpen: false })

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should render correct title for create mode', () => {
      renderModal()

      expect(screen.getByRole('heading', { name: /create new deal/i })).toBeInTheDocument()
    })

    it('should render all form fields', () => {
      renderModal()

      expect(screen.getByLabelText(/deal name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/target company/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/industry/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/deal size/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/currency/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/stage/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    })

    it('should render action buttons', () => {
      renderModal()

      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /create deal/i })).toBeInTheDocument()
    })
  })

  describe('Rendering - Edit Mode', () => {
    const existingDeal: Deal = {
      id: '123',
      name: 'Existing Deal',
      target_company: 'Existing Company',
      industry: 'Technology',
      deal_size: 1000000,
      currency: 'GBP',
      stage: 'due_diligence',
      description: 'Existing description',
      owner_id: 'owner-1',
      organization_id: 'org-1',
      archived_at: null,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    }

    it('should render correct title for edit mode', () => {
      renderModal({ deal: existingDeal })

      expect(screen.getByRole('heading', { name: /edit deal/i })).toBeInTheDocument()
    })

    it('should pre-fill form fields with existing deal data', () => {
      renderModal({ deal: existingDeal })

      expect(screen.getByDisplayValue('Existing Deal')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Existing Company')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Technology')).toBeInTheDocument()
      expect(screen.getByDisplayValue('1000000')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Existing description')).toBeInTheDocument()
    })

    it('should render update button instead of create', () => {
      renderModal({ deal: existingDeal })

      expect(screen.getByRole('button', { name: /update deal/i })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /create deal/i })).not.toBeInTheDocument()
    })
  })

  describe('Form Validation', () => {
    it('should show error for empty deal name', async () => {
      const user = userEvent.setup()
      renderModal()

      const submitButton = screen.getByRole('button', { name: /create deal/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/deal name is required/i)).toBeInTheDocument()
      })
    })

    it('should show error for empty target company', async () => {
      const user = userEvent.setup()
      renderModal()

      const dealName = screen.getByLabelText(/deal name/i)
      await user.type(dealName, 'Test Deal')

      const submitButton = screen.getByRole('button', { name: /create deal/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/target company is required/i)).toBeInTheDocument()
      })
    })

    it('should show error for negative deal size', async () => {
      const user = userEvent.setup()
      renderModal()

      const dealSize = screen.getByLabelText(/deal size/i)
      await user.type(dealSize, '-1000')

      await waitFor(() => {
        expect(screen.getByText(/deal size must be positive/i)).toBeInTheDocument()
      })
    })

    it('should not show errors when all required fields are filled', async () => {
      const user = userEvent.setup()
      renderModal()

      await user.type(screen.getByLabelText(/deal name/i), 'Test Deal')
      await user.type(screen.getByLabelText(/target company/i), 'Test Company')

      expect(screen.queryByText(/is required/i)).not.toBeInTheDocument()
    })
  })

  describe('Form Submission - Create', () => {
    it('should call onCreate when form is submitted with valid data', async () => {
      const user = userEvent.setup()
      const mockOnCreate = vi.fn()
      renderModal({ onCreate: mockOnCreate })

      await user.type(screen.getByLabelText(/deal name/i), 'New Deal')
      await user.type(screen.getByLabelText(/target company/i), 'New Company')
      await user.type(screen.getByLabelText(/industry/i), 'Healthcare')
      await user.type(screen.getByLabelText(/deal size/i), '2500000')

      const submitButton = screen.getByRole('button', { name: /create deal/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockOnCreate).toHaveBeenCalledWith({
          name: 'New Deal',
          target_company: 'New Company',
          industry: 'Healthcare',
          deal_size: 2500000,
          currency: 'GBP',
          stage: 'sourcing',
        })
      })
    })

    it('should call onSuccess after successful creation', async () => {
      const user = userEvent.setup()
      renderModal()

      await user.type(screen.getByLabelText(/deal name/i), 'New Deal')
      await user.type(screen.getByLabelText(/target company/i), 'New Company')

      const submitButton = screen.getByRole('button', { name: /create deal/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled()
      })
    })

    it('should close modal after successful creation', async () => {
      const user = userEvent.setup()
      renderModal()

      await user.type(screen.getByLabelText(/deal name/i), 'New Deal')
      await user.type(screen.getByLabelText(/target company/i), 'New Company')

      const submitButton = screen.getByRole('button', { name: /create deal/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled()
      })
    })

    it('should disable submit button while submitting', async () => {
      const user = userEvent.setup()
      renderModal()

      await user.type(screen.getByLabelText(/deal name/i), 'New Deal')
      await user.type(screen.getByLabelText(/target company/i), 'New Company')

      const submitButton = screen.getByRole('button', { name: /create deal/i })
      await user.click(submitButton)

      // Button should be disabled during submission
      expect(submitButton).toBeDisabled()
    })
  })

  describe('Form Submission - Edit', () => {
    const existingDeal: Deal = {
      id: '123',
      name: 'Original Deal',
      target_company: 'Original Company',
      industry: 'Finance',
      deal_size: 500000,
      currency: 'GBP',
      stage: 'evaluation',
      description: 'Original description',
      owner_id: 'owner-1',
      organization_id: 'org-1',
      archived_at: null,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    }

    it('should call onUpdate when editing existing deal', async () => {
      const user = userEvent.setup()
      const mockOnUpdate = vi.fn()
      renderModal({ deal: existingDeal, onUpdate: mockOnUpdate })

      const dealName = screen.getByLabelText(/deal name/i)
      await user.clear(dealName)
      await user.type(dealName, 'Updated Deal')

      const submitButton = screen.getByRole('button', { name: /update deal/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalledWith('123', expect.objectContaining({
          name: 'Updated Deal',
        }))
      })
    })
  })

  describe('Modal Actions', () => {
    it('should call onClose when cancel button is clicked', async () => {
      const user = userEvent.setup()
      renderModal()

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      await user.click(cancelButton)

      expect(mockOnClose).toHaveBeenCalled()
    })

    it('should call onClose when clicking outside modal', async () => {
      const user = userEvent.setup()
      const { container } = renderModal()

      const backdrop = container.querySelector('[data-testid="modal-backdrop"]')
      if (backdrop) {
        await user.click(backdrop)
        expect(mockOnClose).toHaveBeenCalled()
      }
    })

    it('should call onClose when pressing Escape key', async () => {
      const user = userEvent.setup()
      renderModal()

      await user.keyboard('{Escape}')

      expect(mockOnClose).toHaveBeenCalled()
    })

    it('should reset form when closing and reopening', async () => {
      const user = userEvent.setup()
      const { rerender } = renderModal()

      // Fill in form
      await user.type(screen.getByLabelText(/deal name/i), 'Test')

      // Close modal
      rerender(
        <QueryClientProvider client={queryClient}>
          <CreateDealModal
            isOpen={false}
            onClose={mockOnClose}
            onSuccess={mockOnSuccess}
          />
        </QueryClientProvider>
      )

      // Reopen modal
      rerender(
        <QueryClientProvider client={queryClient}>
          <CreateDealModal
            isOpen={true}
            onClose={mockOnClose}
            onSuccess={mockOnSuccess}
          />
        </QueryClientProvider>
      )

      // Form should be reset
      const dealName = screen.getByLabelText(/deal name/i) as HTMLInputElement
      expect(dealName.value).toBe('')
    })
  })

  describe('Stage Selection', () => {
    it('should render all pipeline stages in dropdown', () => {
      renderModal()

      const stageSelect = screen.getByLabelText(/stage/i)
      const options = stageSelect.querySelectorAll('option')

      expect(options.length).toBe(5) // 5 active pipeline stages
      expect(Array.from(options).map(o => o.textContent)).toEqual([
        'Sourcing',
        'Evaluation',
        'Due Diligence',
        'Negotiation',
        'Closing',
      ])
    })

    it('should default to sourcing stage for new deals', () => {
      renderModal()

      const stageSelect = screen.getByLabelText(/stage/i) as HTMLSelectElement
      expect(stageSelect.value).toBe('sourcing')
    })
  })

  describe('Currency Selection', () => {
    it('should render currency options', () => {
      renderModal()

      const currencySelect = screen.getByLabelText(/currency/i)
      const options = currencySelect.querySelectorAll('option')

      expect(options.length).toBeGreaterThanOrEqual(3) // GBP, USD, EUR at minimum
    })

    it('should default to GBP currency', () => {
      renderModal()

      const currencySelect = screen.getByLabelText(/currency/i) as HTMLSelectElement
      expect(currencySelect.value).toBe('GBP')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels for all inputs', () => {
      renderModal()

      expect(screen.getByLabelText(/deal name/i)).toHaveAttribute('aria-label')
      expect(screen.getByLabelText(/target company/i)).toHaveAttribute('aria-label')
    })

    it('should set focus on first input when modal opens', () => {
      renderModal()

      const dealName = screen.getByLabelText(/deal name/i)
      expect(dealName).toHaveFocus()
    })

    it('should trap focus within modal', async () => {
      const user = userEvent.setup()
      renderModal()

      // Tab through all focusable elements
      await user.tab()
      await user.tab()
      await user.tab()
      await user.tab()
      await user.tab()
      await user.tab()
      await user.tab()
      await user.tab()

      // Focus should cycle back to first element
      const dealName = screen.getByLabelText(/deal name/i)
      expect(document.activeElement).toBeInTheDocument()
    })

    it('should have proper heading hierarchy', () => {
      renderModal()

      const heading = screen.getByRole('heading', { name: /create new deal/i })
      expect(heading.tagName).toBe('H2')
    })
  })
})
