/**
 * GoalCard Component Tests
 *
 * Tests for the weekly goals display and editing component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GoalCard } from './GoalCard'
import * as hooks from '@/hooks/master-admin'

// Mock the hooks
vi.mock('@/hooks/master-admin', () => ({
  useCurrentGoal: vi.fn(),
  useCreateGoal: vi.fn(),
  useUpdateGoal: vi.fn(),
}))

describe('GoalCard', () => {
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

  const renderGoalCard = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <GoalCard />
      </QueryClientProvider>
    )
  }

  describe('Loading State', () => {
    it('should display loading skeleton when data is loading', () => {
      vi.mocked(hooks.useCurrentGoal).mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as any)

      vi.mocked(hooks.useCreateGoal).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      vi.mocked(hooks.useUpdateGoal).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderGoalCard()

      // Check for loading animation
      const loadingSkeleton = screen.getByRole('generic', { hidden: true })
      expect(loadingSkeleton.className).toContain('animate-pulse')
    })
  })

  describe('Display Mode - No Goal', () => {
    beforeEach(() => {
      vi.mocked(hooks.useCurrentGoal).mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
      } as any)

      vi.mocked(hooks.useCreateGoal).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      vi.mocked(hooks.useUpdateGoal).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)
    })

    it('should show "no goals" message when no goal exists', () => {
      renderGoalCard()

      expect(screen.getByText('No goals set for this week')).toBeInTheDocument()
      expect(screen.getByText('Set Weekly Goals')).toBeInTheDocument()
    })

    it('should display header with title and icon', () => {
      renderGoalCard()

      expect(screen.getByText('Weekly Goals')).toBeInTheDocument()
      // Target icon should be present
      const header = screen.getByText('Weekly Goals').closest('div')
      expect(header).toBeInTheDocument()
    })

    it('should show all goal categories with zero values', () => {
      renderGoalCard()

      expect(screen.getByText('🔍 Discoveries')).toBeInTheDocument()
      expect(screen.getByText('📧 Emails')).toBeInTheDocument()
      expect(screen.getByText('🎥 Videos')).toBeInTheDocument()
      expect(screen.getByText('📞 Calls')).toBeInTheDocument()

      // All should show 0
      const values = screen.getAllByText('0')
      expect(values.length).toBeGreaterThanOrEqual(4)
    })
  })

  describe('Display Mode - With Goal', () => {
    const mockGoal = {
      id: 1,
      user_id: 'user-123',
      week_start: '2025-10-28',
      target_discoveries: 10,
      target_emails: 25,
      target_videos: 5,
      target_calls: 8,
      created_at: '2025-10-28T00:00:00Z',
      updated_at: '2025-10-28T00:00:00Z',
    }

    beforeEach(() => {
      vi.mocked(hooks.useCurrentGoal).mockReturnValue({
        data: mockGoal,
        isLoading: false,
        error: null,
      } as any)

      vi.mocked(hooks.useCreateGoal).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      vi.mocked(hooks.useUpdateGoal).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)
    })

    it('should display goal values when goal exists', () => {
      renderGoalCard()

      expect(screen.getByText('10')).toBeInTheDocument() // Discoveries
      expect(screen.getByText('25')).toBeInTheDocument() // Emails
      expect(screen.getByText('5')).toBeInTheDocument() // Videos
      expect(screen.getByText('8')).toBeInTheDocument() // Calls
    })

    it('should show edit button when not editing', () => {
      renderGoalCard()

      const editButton = screen.getByRole('button', { name: /edit goals/i })
      expect(editButton).toBeInTheDocument()
    })

    it('should not show "no goals" message when goal exists', () => {
      renderGoalCard()

      expect(screen.queryByText('No goals set for this week')).not.toBeInTheDocument()
    })
  })

  describe('Edit Mode', () => {
    const mockGoal = {
      id: 1,
      user_id: 'user-123',
      week_start: '2025-10-28',
      target_discoveries: 10,
      target_emails: 25,
      target_videos: 5,
      target_calls: 8,
      created_at: '2025-10-28T00:00:00Z',
      updated_at: '2025-10-28T00:00:00Z',
    }

    beforeEach(() => {
      vi.mocked(hooks.useCurrentGoal).mockReturnValue({
        data: mockGoal,
        isLoading: false,
        error: null,
      } as any)

      vi.mocked(hooks.useCreateGoal).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      vi.mocked(hooks.useUpdateGoal).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)
    })

    it('should enter edit mode when edit button is clicked', async () => {
      const user = userEvent.setup()
      renderGoalCard()

      const editButton = screen.getByRole('button', { name: /edit goals/i })
      await user.click(editButton)

      // Should show input fields
      const inputs = screen.getAllByRole('spinbutton')
      expect(inputs).toHaveLength(4)

      // Should show Save and Cancel buttons
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()

      // Edit button should be hidden
      expect(screen.queryByRole('button', { name: /edit goals/i })).not.toBeInTheDocument()
    })

    it('should populate inputs with current goal values in edit mode', async () => {
      const user = userEvent.setup()
      renderGoalCard()

      await user.click(screen.getByRole('button', { name: /edit goals/i }))

      const inputs = screen.getAllByRole('spinbutton') as HTMLInputElement[]
      expect(inputs[0].value).toBe('10') // Discoveries
      expect(inputs[1].value).toBe('25') // Emails
      expect(inputs[2].value).toBe('5') // Videos
      expect(inputs[3].value).toBe('8') // Calls
    })

    it('should update input values when changed', async () => {
      const user = userEvent.setup()
      renderGoalCard()

      await user.click(screen.getByRole('button', { name: /edit goals/i }))

      const inputs = screen.getAllByRole('spinbutton') as HTMLInputElement[]
      await user.clear(inputs[0])
      await user.type(inputs[0], '15')

      expect(inputs[0].value).toBe('15')
    })

    it('should exit edit mode when cancel is clicked', async () => {
      const user = userEvent.setup()
      renderGoalCard()

      await user.click(screen.getByRole('button', { name: /edit goals/i }))
      await user.click(screen.getByRole('button', { name: /cancel/i }))

      // Should be back in display mode
      expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: /edit goals/i })).toBeInTheDocument()
    })
  })

  describe('Update Goal Flow', () => {
    const mockGoal = {
      id: 1,
      user_id: 'user-123',
      week_start: '2025-10-28',
      target_discoveries: 10,
      target_emails: 25,
      target_videos: 5,
      target_calls: 8,
      created_at: '2025-10-28T00:00:00Z',
      updated_at: '2025-10-28T00:00:00Z',
    }

    it('should call updateGoal mutation when saving existing goal', async () => {
      const user = userEvent.setup()
      const mockUpdateGoal = vi.fn().mockResolvedValue(mockGoal)

      vi.mocked(hooks.useCurrentGoal).mockReturnValue({
        data: mockGoal,
        isLoading: false,
        error: null,
      } as any)

      vi.mocked(hooks.useUpdateGoal).mockReturnValue({
        mutateAsync: mockUpdateGoal,
        isPending: false,
      } as any)

      vi.mocked(hooks.useCreateGoal).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderGoalCard()

      // Enter edit mode
      await user.click(screen.getByRole('button', { name: /edit goals/i }))

      // Change a value
      const inputs = screen.getAllByRole('spinbutton') as HTMLInputElement[]
      await user.clear(inputs[0])
      await user.type(inputs[0], '20')

      // Save
      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(mockUpdateGoal).toHaveBeenCalledWith({
          goalId: 1,
          update: {
            target_discoveries: 20,
            target_emails: 25,
            target_videos: 5,
            target_calls: 8,
          },
        })
      })
    })

    it('should show loading state on Save button while updating', async () => {
      const user = userEvent.setup()

      vi.mocked(hooks.useCurrentGoal).mockReturnValue({
        data: mockGoal,
        isLoading: false,
        error: null,
      } as any)

      vi.mocked(hooks.useUpdateGoal).mockReturnValue({
        mutateAsync: vi.fn().mockImplementation(() => new Promise(() => {})), // Never resolves
        isPending: true,
      } as any)

      vi.mocked(hooks.useCreateGoal).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderGoalCard()

      await user.click(screen.getByRole('button', { name: /edit goals/i }))

      const saveButton = screen.getByRole('button', { name: /save/i })
      expect(saveButton).toHaveAttribute('aria-busy', 'true')
    })
  })

  describe('Create Goal Flow', () => {
    it('should call createGoal mutation when saving new goal', async () => {
      const user = userEvent.setup()
      const mockCreateGoal = vi.fn().mockResolvedValue({
        id: 2,
        user_id: 'user-123',
        week_start: '2025-10-28',
        target_discoveries: 15,
        target_emails: 30,
        target_videos: 10,
        target_calls: 12,
      })

      vi.mocked(hooks.useCurrentGoal).mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
      } as any)

      vi.mocked(hooks.useCreateGoal).mockReturnValue({
        mutateAsync: mockCreateGoal,
        isPending: false,
      } as any)

      vi.mocked(hooks.useUpdateGoal).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderGoalCard()

      // Click "Set Weekly Goals"
      await user.click(screen.getByText('Set Weekly Goals'))

      // Fill in values
      const inputs = screen.getAllByRole('spinbutton') as HTMLInputElement[]
      await user.type(inputs[0], '15')
      await user.type(inputs[1], '30')
      await user.type(inputs[2], '10')
      await user.type(inputs[3], '12')

      // Save
      await user.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(mockCreateGoal).toHaveBeenCalledWith(
          expect.objectContaining({
            week_start: expect.any(String),
            target_discoveries: 15,
            target_emails: 30,
            target_videos: 10,
            target_calls: 12,
          })
        )
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper aria-label on edit button', () => {
      vi.mocked(hooks.useCurrentGoal).mockReturnValue({
        data: {
          id: 1,
          user_id: 'user-123',
          week_start: '2025-10-28',
          target_discoveries: 10,
          target_emails: 25,
          target_videos: 5,
          target_calls: 8,
          created_at: '2025-10-28T00:00:00Z',
          updated_at: '2025-10-28T00:00:00Z',
        },
        isLoading: false,
        error: null,
      } as any)

      vi.mocked(hooks.useCreateGoal).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      vi.mocked(hooks.useUpdateGoal).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderGoalCard()

      const editButton = screen.getByRole('button', { name: /edit goals/i })
      expect(editButton).toHaveAttribute('aria-label', 'Edit goals')
    })

    it('should have accessible number inputs with min value', async () => {
      const user = userEvent.setup()

      vi.mocked(hooks.useCurrentGoal).mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
      } as any)

      vi.mocked(hooks.useCreateGoal).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      vi.mocked(hooks.useUpdateGoal).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderGoalCard()

      await user.click(screen.getByText('Set Weekly Goals'))

      const inputs = screen.getAllByRole('spinbutton') as HTMLInputElement[]
      inputs.forEach((input) => {
        expect(input).toHaveAttribute('min', '0')
        expect(input).toHaveAttribute('type', 'number')
      })
    })
  })
})
