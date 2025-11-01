/**
 * ActivityForm Component Tests
 *
 * Tests for the activity logging form component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ActivityForm } from './ActivityForm'
import * as hooks from '@/hooks/master-admin'
import { ActivityType, ActivityStatus } from '@/services/api/masterAdmin'

// Mock the hooks
vi.mock('@/hooks/master-admin', () => ({
  useCreateActivity: vi.fn(),
}))

describe('ActivityForm', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
    vi.clearAllMocks()
  })

  const renderActivityForm = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <ActivityForm />
      </QueryClientProvider>
    )
  }

  describe('Form Rendering', () => {
    it('should render the form with all required fields', () => {
      vi.mocked(hooks.useCreateActivity).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderActivityForm()

      expect(screen.getByText('Log Activity')).toBeInTheDocument()
      expect(screen.getByLabelText(/Activity Type/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Status/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Date/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Notes/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Log Activity/i })).toBeInTheDocument()
    })

    it('should have default values for all fields', () => {
      vi.mocked(hooks.useCreateActivity).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderActivityForm()

      const typeSelect = screen.getByLabelText(/Activity Type/i) as HTMLSelectElement
      const statusSelect = screen.getByLabelText(/Status/i) as HTMLSelectElement
      const dateInput = screen.getByLabelText(/Date/i) as HTMLInputElement
      const amountInput = screen.getByLabelText(/Amount/i) as HTMLInputElement

      expect(typeSelect.value).toBe(ActivityType.DISCOVERY)
      expect(statusSelect.value).toBe(ActivityStatus.DONE)
      expect(dateInput.value).toBe(new Date().toISOString().split('T')[0]) // Today's date
      expect(amountInput.value).toBe('1')
    })

    it('should display all activity type options', () => {
      vi.mocked(hooks.useCreateActivity).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderActivityForm()

      const typeSelect = screen.getByLabelText(/Activity Type/i)
      expect(typeSelect).toContainHTML('Discovery')
      expect(typeSelect).toContainHTML('Email')
      expect(typeSelect).toContainHTML('Video')
      expect(typeSelect).toContainHTML('Call')
    })

    it('should display all status options', () => {
      vi.mocked(hooks.useCreateActivity).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderActivityForm()

      const statusSelect = screen.getByLabelText(/Status/i)
      expect(statusSelect).toContainHTML('Done')
      expect(statusSelect).toContainHTML('Pending')
      expect(statusSelect).toContainHTML('Cancelled')
    })
  })

  describe('Form Interaction', () => {
    it('should update activity type when changed', async () => {
      const user = userEvent.setup()
      vi.mocked(hooks.useCreateActivity).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderActivityForm()

      const typeSelect = screen.getByLabelText(/Activity Type/i) as HTMLSelectElement
      await user.selectOptions(typeSelect, ActivityType.EMAIL)

      expect(typeSelect.value).toBe(ActivityType.EMAIL)
    })

    it('should update status when changed', async () => {
      const user = userEvent.setup()
      vi.mocked(hooks.useCreateActivity).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderActivityForm()

      const statusSelect = screen.getByLabelText(/Status/i) as HTMLSelectElement
      await user.selectOptions(statusSelect, ActivityStatus.PENDING)

      expect(statusSelect.value).toBe(ActivityStatus.PENDING)
    })

    it('should update date when changed', async () => {
      const user = userEvent.setup()
      vi.mocked(hooks.useCreateActivity).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderActivityForm()

      const dateInput = screen.getByLabelText(/Date/i) as HTMLInputElement
      await user.clear(dateInput)
      await user.type(dateInput, '2025-11-15')

      expect(dateInput.value).toBe('2025-11-15')
    })

    it('should update amount when changed', async () => {
      const user = userEvent.setup()
      vi.mocked(hooks.useCreateActivity).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderActivityForm()

      const amountInput = screen.getByLabelText(/Amount/i) as HTMLInputElement
      await user.clear(amountInput)
      await user.type(amountInput, '5')

      expect(amountInput.value).toBe('5')
    })

    it('should update notes when changed', async () => {
      const user = userEvent.setup()
      vi.mocked(hooks.useCreateActivity).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderActivityForm()

      const notesTextarea = screen.getByLabelText(/Notes/i) as HTMLTextAreaElement
      await user.type(notesTextarea, 'Test note')

      expect(notesTextarea.value).toBe('Test note')
    })
  })

  describe('Form Submission', () => {
    it('should call createActivity mutation on form submit', async () => {
      const user = userEvent.setup()
      const mockCreateActivity = vi.fn().mockResolvedValue({
        id: 1,
        type: ActivityType.DISCOVERY,
        status: ActivityStatus.DONE,
        date: new Date().toISOString().split('T')[0],
        amount: 1,
      })

      vi.mocked(hooks.useCreateActivity).mockReturnValue({
        mutateAsync: mockCreateActivity,
        isPending: false,
      } as any)

      renderActivityForm()

      const submitButton = screen.getByRole('button', { name: /Log Activity/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockCreateActivity).toHaveBeenCalledWith({
          type: ActivityType.DISCOVERY,
          status: ActivityStatus.DONE,
          date: new Date().toISOString().split('T')[0],
          amount: 1,
          notes: '',
        })
      })
    })

    it('should submit form with all field values', async () => {
      const user = userEvent.setup()
      const mockCreateActivity = vi.fn().mockResolvedValue({})

      vi.mocked(hooks.useCreateActivity).mockReturnValue({
        mutateAsync: mockCreateActivity,
        isPending: false,
      } as any)

      renderActivityForm()

      // Fill in form
      await user.selectOptions(screen.getByLabelText(/Activity Type/i), ActivityType.EMAIL)
      await user.selectOptions(screen.getByLabelText(/Status/i), ActivityStatus.PENDING)

      const dateInput = screen.getByLabelText(/Date/i)
      await user.clear(dateInput)
      await user.type(dateInput, '2025-11-15')

      const amountInput = screen.getByLabelText(/Amount/i)
      await user.clear(amountInput)
      await user.type(amountInput, '3')

      await user.type(screen.getByLabelText(/Notes/i), 'Test activity note')

      // Submit
      await user.click(screen.getByRole('button', { name: /Log Activity/i }))

      await waitFor(() => {
        expect(mockCreateActivity).toHaveBeenCalledWith({
          type: ActivityType.EMAIL,
          status: ActivityStatus.PENDING,
          date: '2025-11-15',
          amount: 3,
          notes: 'Test activity note',
        })
      })
    })

    it('should reset form after successful submission', async () => {
      const user = userEvent.setup()
      const mockCreateActivity = vi.fn().mockResolvedValue({})

      vi.mocked(hooks.useCreateActivity).mockReturnValue({
        mutateAsync: mockCreateActivity,
        isPending: false,
      } as any)

      renderActivityForm()

      // Change values
      await user.selectOptions(screen.getByLabelText(/Activity Type/i), ActivityType.VIDEO)
      await user.type(screen.getByLabelText(/Notes/i), 'Test note')

      // Submit
      await user.click(screen.getByRole('button', { name: /Log Activity/i }))

      await waitFor(() => {
        expect(mockCreateActivity).toHaveBeenCalled()
      })

      // Check form reset
      const typeSelect = screen.getByLabelText(/Activity Type/i) as HTMLSelectElement
      const notesTextarea = screen.getByLabelText(/Notes/i) as HTMLTextAreaElement

      expect(typeSelect.value).toBe(ActivityType.DISCOVERY) // Back to default
      expect(notesTextarea.value).toBe('') // Cleared
    })

    it('should show loading state on submit button while submitting', async () => {
      const user = userEvent.setup()

      vi.mocked(hooks.useCreateActivity).mockReturnValue({
        mutateAsync: vi.fn().mockImplementation(() => new Promise(() => {})), // Never resolves
        isPending: true,
      } as any)

      renderActivityForm()

      const submitButton = screen.getByRole('button', { name: /Log Activity/i })
      expect(submitButton).toHaveAttribute('aria-busy', 'true')
    })

    it('should not reset form if submission fails', async () => {
      const user = userEvent.setup()
      const mockCreateActivity = vi.fn().mockRejectedValue(new Error('Failed to create'))

      vi.mocked(hooks.useCreateActivity).mockReturnValue({
        mutateAsync: mockCreateActivity,
        isPending: false,
      } as any)

      renderActivityForm()

      // Change value
      await user.type(screen.getByLabelText(/Notes/i), 'Test note')

      // Submit
      await user.click(screen.getByRole('button', { name: /Log Activity/i }))

      await waitFor(() => {
        expect(mockCreateActivity).toHaveBeenCalled()
      })

      // Form should NOT reset on error
      const notesTextarea = screen.getByLabelText(/Notes/i) as HTMLTextAreaElement
      expect(notesTextarea.value).toBe('Test note') // Still has value
    })
  })

  describe('Validation', () => {
    it('should have required attribute on activity type select', () => {
      vi.mocked(hooks.useCreateActivity).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderActivityForm()

      const typeSelect = screen.getByLabelText(/Activity Type/i)
      expect(typeSelect).toHaveAttribute('required')
    })

    it('should have required attribute on status select', () => {
      vi.mocked(hooks.useCreateActivity).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderActivityForm()

      const statusSelect = screen.getByLabelText(/Status/i)
      expect(statusSelect).toHaveAttribute('required')
    })

    it('should have required attribute on date input', () => {
      vi.mocked(hooks.useCreateActivity).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderActivityForm()

      const dateInput = screen.getByLabelText(/Date/i)
      expect(dateInput).toHaveAttribute('required')
    })

    it('should have min attribute on amount input', () => {
      vi.mocked(hooks.useCreateActivity).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderActivityForm()

      const amountInput = screen.getByLabelText(/Amount/i)
      expect(amountInput).toHaveAttribute('min', '1')
      expect(amountInput).toHaveAttribute('type', 'number')
    })
  })

  describe('Accessibility', () => {
    it('should have proper labels for all form fields', () => {
      vi.mocked(hooks.useCreateActivity).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderActivityForm()

      expect(screen.getByLabelText(/Activity Type/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Status/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Date/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Notes/i)).toBeInTheDocument()
    })

    it('should have accessible submit button', () => {
      vi.mocked(hooks.useCreateActivity).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderActivityForm()

      const submitButton = screen.getByRole('button', { name: /Log Activity/i })
      expect(submitButton).toHaveAttribute('type', 'submit')
    })
  })
})
