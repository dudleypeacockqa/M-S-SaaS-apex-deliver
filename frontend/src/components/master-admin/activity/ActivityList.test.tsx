/**
 * ActivityList Component Tests
 *
 * Comprehensive test suite for the activity list with filters and pagination
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ActivityList } from './ActivityList'
import * as hooks from '@/hooks/master-admin'
import { ActivityType, ActivityStatus } from '@/services/api/masterAdmin'

// Mock the hooks
vi.mock('@/hooks/master-admin', () => ({
  useActivities: vi.fn(),
  useDeleteActivity: vi.fn(),
}))

describe('ActivityList', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
    vi.clearAllMocks()

    // Mock window.confirm
    vi.stubGlobal('confirm', vi.fn(() => true))
  })

  const renderActivityList = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <ActivityList />
      </QueryClientProvider>
    )
  }

  const mockActivities = {
    items: [
      {
        id: 1,
        type: ActivityType.DISCOVERY,
        status: ActivityStatus.DONE,
        date: '2025-11-01',
        amount: 1,
        notes: 'Found new prospect',
        user_id: 'user-1',
        prospect_id: null,
        created_at: '2025-11-01T10:00:00Z',
        updated_at: '2025-11-01T10:00:00Z',
      },
      {
        id: 2,
        type: ActivityType.EMAIL,
        status: ActivityStatus.PENDING,
        date: '2025-11-02',
        amount: 3,
        notes: null,
        user_id: 'user-1',
        prospect_id: 1,
        created_at: '2025-11-02T10:00:00Z',
        updated_at: '2025-11-02T10:00:00Z',
      },
    ],
    total: 2,
    page: 1,
    per_page: 20,
  }

  describe('[P1] Display and Loading States', () => {
    it('should display loading skeleton when data is loading', () => {
      vi.mocked(hooks.useActivities).mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as any)

      vi.mocked(hooks.useDeleteActivity).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderActivityList()

      // Should show loading skeleton
      const pulsingElements = screen.getAllByRole('generic').filter((el) =>
        el.className.includes('animate-pulse')
      )
      expect(pulsingElements.length).toBeGreaterThan(0)
    })

    it('should display activities after loading', () => {
      vi.mocked(hooks.useActivities).mockReturnValue({
        data: mockActivities,
        isLoading: false,
        error: null,
      } as any)

      vi.mocked(hooks.useDeleteActivity).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderActivityList()

      // Header should show total count
      expect(screen.getByText('2 total')).toBeInTheDocument()

      // Activities should be displayed
      expect(screen.getByText('discovery', { exact: false })).toBeInTheDocument()
      expect(screen.getByText('Found new prospect')).toBeInTheDocument()
      expect(screen.getByText('email', { exact: false })).toBeInTheDocument()
    })

    it('should show empty state when no activities exist', () => {
      vi.mocked(hooks.useActivities).mockReturnValue({
        data: { items: [], total: 0, page: 1, per_page: 20 },
        isLoading: false,
        error: null,
      } as any)

      vi.mocked(hooks.useDeleteActivity).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderActivityList()

      expect(screen.getByText('No activities found.')).toBeInTheDocument()
      expect(screen.getByText('Start logging your activities above!')).toBeInTheDocument()
    })
  })

  describe('[P1] Filtering', () => {
    it('should filter activities by type', async () => {
      const user = userEvent.setup()
      const mockUseActivities = vi.fn().mockReturnValue({
        data: mockActivities,
        isLoading: false,
        error: null,
      })

      vi.mocked(hooks.useActivities).mockImplementation(mockUseActivities)
      vi.mocked(hooks.useDeleteActivity).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderActivityList()

      // Find and change activity type filter
      const typeFilter = screen.getByDisplayValue('All Types')
      await user.selectOptions(typeFilter, ActivityType.DISCOVERY)

      await waitFor(() => {
        expect(mockUseActivities).toHaveBeenCalledWith(
          expect.objectContaining({
            activity_type: ActivityType.DISCOVERY,
            page: 1,
          })
        )
      })
    })

    it('should filter activities by date range', async () => {
      const user = userEvent.setup()
      const mockUseActivities = vi.fn().mockReturnValue({
        data: mockActivities,
        isLoading: false,
        error: null,
      })

      vi.mocked(hooks.useActivities).mockImplementation(mockUseActivities)
      vi.mocked(hooks.useDeleteActivity).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderActivityList()

      // Set date range
      const dateInputs = screen.getAllByPlaceholderText(/date/i)
      await user.type(dateInputs[0], '2025-11-01')
      await user.type(dateInputs[1], '2025-11-30')

      await waitFor(() => {
        expect(mockUseActivities).toHaveBeenCalledWith(
          expect.objectContaining({
            start_date: '2025-11-01',
            end_date: '2025-11-30',
            page: 1,
          })
        )
      })
    })
  })

  describe('[P1] Activity Display', () => {
    beforeEach(() => {
      vi.mocked(hooks.useActivities).mockReturnValue({
        data: mockActivities,
        isLoading: false,
        error: null,
      } as any)

      vi.mocked(hooks.useDeleteActivity).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)
    })

    it('should display activity with correct icon for each type', () => {
      renderActivityList()

      // Discovery activity should show 🔍
      expect(screen.getByText('🔍')).toBeInTheDocument()

      // Email activity should show 📧
      expect(screen.getByText('📧')).toBeInTheDocument()
    })

    it('should display status badge for each activity', () => {
      renderActivityList()

      // Should show Done and Pending badges
      expect(screen.getByText('Done')).toBeInTheDocument()
      expect(screen.getByText('Pending')).toBeInTheDocument()
    })

    it('should display amount multiplier when amount > 1', () => {
      renderActivityList()

      // Second activity has amount: 3
      expect(screen.getByText('× 3')).toBeInTheDocument()
    })

    it('should display notes when present', () => {
      renderActivityList()

      expect(screen.getByText('Found new prospect')).toBeInTheDocument()
    })
  })

  describe('[P1] Delete Functionality', () => {
    it('should delete activity when delete button is clicked and confirmed', async () => {
      const user = userEvent.setup()
      const mockDeleteActivity = vi.fn().mockResolvedValue(undefined)

      vi.mocked(hooks.useActivities).mockReturnValue({
        data: mockActivities,
        isLoading: false,
        error: null,
      } as any)

      vi.mocked(hooks.useDeleteActivity).mockReturnValue({
        mutateAsync: mockDeleteActivity,
        isPending: false,
      } as any)

      renderActivityList()

      // Click first delete button
      const deleteButtons = screen.getAllByLabelText('Delete activity')
      await user.click(deleteButtons[0])

      await waitFor(() => {
        expect(mockDeleteActivity).toHaveBeenCalledWith(1)
      })
    })

    it('should not delete activity when confirmation is cancelled', async () => {
      const user = userEvent.setup()
      const mockDeleteActivity = vi.fn()

      // Mock confirm to return false
      vi.stubGlobal('confirm', vi.fn(() => false))

      vi.mocked(hooks.useActivities).mockReturnValue({
        data: mockActivities,
        isLoading: false,
        error: null,
      } as any)

      vi.mocked(hooks.useDeleteActivity).mockReturnValue({
        mutateAsync: mockDeleteActivity,
        isPending: false,
      } as any)

      renderActivityList()

      // Click delete button
      const deleteButtons = screen.getAllByLabelText('Delete activity')
      await user.click(deleteButtons[0])

      // Delete should not be called
      expect(mockDeleteActivity).not.toHaveBeenCalled()
    })
  })

  describe('[P2] Pagination', () => {
    it('should show pagination controls when total > per_page', () => {
      vi.mocked(hooks.useActivities).mockReturnValue({
        data: { ...mockActivities, total: 30 },
        isLoading: false,
        error: null,
      } as any)

      vi.mocked(hooks.useDeleteActivity).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderActivityList()

      expect(screen.getByText('Previous')).toBeInTheDocument()
      expect(screen.getByText('Next')).toBeInTheDocument()
      expect(screen.getByText('Showing 1 to 20 of 30')).toBeInTheDocument()
    })

    it('should disable Previous button on first page', () => {
      vi.mocked(hooks.useActivities).mockReturnValue({
        data: { ...mockActivities, total: 30, page: 1 },
        isLoading: false,
        error: null,
      } as any)

      vi.mocked(hooks.useDeleteActivity).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderActivityList()

      const prevButton = screen.getByText('Previous').closest('button')
      expect(prevButton).toBeDisabled()
    })

    it('should disable Next button on last page', () => {
      vi.mocked(hooks.useActivities).mockReturnValue({
        data: { ...mockActivities, total: 30, page: 2, per_page: 20 },
        isLoading: false,
        error: null,
      } as any)

      vi.mocked(hooks.useDeleteActivity).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderActivityList()

      const nextButton = screen.getByText('Next').closest('button')
      expect(nextButton).toBeDisabled()
    })

    it('should navigate to next page when Next is clicked', async () => {
      const user = userEvent.setup()
      const mockUseActivities = vi.fn().mockReturnValue({
        data: { ...mockActivities, total: 30, page: 1 },
        isLoading: false,
        error: null,
      })

      vi.mocked(hooks.useActivities).mockImplementation(mockUseActivities)
      vi.mocked(hooks.useDeleteActivity).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderActivityList()

      const nextButton = screen.getByText('Next')
      await user.click(nextButton)

      await waitFor(() => {
        expect(mockUseActivities).toHaveBeenCalledWith(
          expect.objectContaining({
            page: 2,
          })
        )
      })
    })
  })
})