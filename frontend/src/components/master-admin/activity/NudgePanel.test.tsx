/**
 * NudgePanel Component Tests
 *
 * Tests for notification/nudge display and management
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NudgePanel } from './NudgePanel'
import * as hooks from '@/hooks/master-admin'
import { NudgeType, NudgePriority } from '@/services/api/masterAdmin'

// Mock the hooks
vi.mock('@/hooks/master-admin', () => ({
  useUnreadNudges: vi.fn(),
  useMarkNudgeAsRead: vi.fn(),
}))

describe('NudgePanel', () => {
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

  const renderNudgePanel = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <NudgePanel />
      </QueryClientProvider>
    )
  }

  const mockNudges = {
    items: [
      {
        id: 1,
        user_id: 'user-1',
        type: NudgeType.REMINDER,
        message: 'Follow up with prospect from last week',
        priority: NudgePriority.HIGH,
        read: false,
        action_url: '/prospects/123',
        created_at: '2025-11-01T10:00:00Z',
        expires_at: null,
      },
      {
        id: 2,
        user_id: 'user-1',
        type: NudgeType.GOAL_PROGRESS,
        message: "You're 80% towards your weekly discovery goal!",
        priority: NudgePriority.NORMAL,
        read: false,
        action_url: null,
        created_at: '2025-11-01T12:00:00Z',
        expires_at: null,
      },
      {
        id: 3,
        user_id: 'user-1',
        type: NudgeType.SYSTEM,
        message: 'Urgent: Database maintenance scheduled for tonight',
        priority: NudgePriority.URGENT,
        read: false,
        action_url: 'https://status.example.com',
        created_at: '2025-11-01T14:00:00Z',
        expires_at: '2025-11-02T00:00:00Z',
      },
    ],
    total: 3,
    page: 1,
    per_page: 20,
  }

  describe('[P1] Loading and Display States', () => {
    it('should display loading skeleton when data is loading', () => {
      vi.mocked(hooks.useUnreadNudges).mockReturnValue({
        data: undefined,
        isLoading: true,
      } as any)

      vi.mocked(hooks.useMarkNudgeAsRead).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderNudgePanel()

      // Should show loading skeleton
      const pulsingElements = screen.getAllByRole('generic').filter((el) =>
        el.className.includes('animate-pulse')
      )
      expect(pulsingElements.length).toBeGreaterThan(0)
    })

    it('should display unread nudges after loading', () => {
      vi.mocked(hooks.useUnreadNudges).mockReturnValue({
        data: mockNudges,
        isLoading: false,
      } as any)

      vi.mocked(hooks.useMarkNudgeAsRead).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderNudgePanel()

      // Header should show count
      expect(screen.getByText('3 unread')).toBeInTheDocument()

      // All nudges should be displayed
      expect(screen.getByText('Follow up with prospect from last week')).toBeInTheDocument()
      expect(screen.getByText("You're 80% towards your weekly discovery goal!")).toBeInTheDocument()
      expect(screen.getByText('Urgent: Database maintenance scheduled for tonight')).toBeInTheDocument()
    })

    it('should show empty state when no nudges exist', () => {
      vi.mocked(hooks.useUnreadNudges).mockReturnValue({
        data: { items: [], total: 0, page: 1, per_page: 20 },
        isLoading: false,
      } as any)

      vi.mocked(hooks.useMarkNudgeAsRead).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderNudgePanel()

      expect(screen.getByText('No new nudges')).toBeInTheDocument()
      expect(screen.getByText("You're all caught up!")).toBeInTheDocument()
    })
  })

  describe('[P1] Priority Styling', () => {
    beforeEach(() => {
      vi.mocked(hooks.useUnreadNudges).mockReturnValue({
        data: mockNudges,
        isLoading: false,
      } as any)

      vi.mocked(hooks.useMarkNudgeAsRead).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)
    })

    it('should display correct priority icon for each nudge', () => {
      renderNudgePanel()

      // URGENT should show 🔴
      expect(screen.getByText('🔴')).toBeInTheDocument()

      // HIGH should show 🟠
      expect(screen.getByText('🟠')).toBeInTheDocument()

      // NORMAL should show 🔵
      expect(screen.getByText('🔵')).toBeInTheDocument()
    })

    it('should display nudge type labels', () => {
      renderNudgePanel()

      expect(screen.getByText('REMINDER')).toBeInTheDocument()
      expect(screen.getByText('GOAL_PROGRESS')).toBeInTheDocument()
      expect(screen.getByText('SYSTEM')).toBeInTheDocument()
    })

    it('should display action URL link when present', () => {
      renderNudgePanel()

      const actionLinks = screen.getAllByText('Take Action')
      expect(actionLinks).toHaveLength(2) // First and third nudges have action URLs

      // Check first link
      expect(actionLinks[0]).toHaveAttribute('href', '/prospects/123')
      expect(actionLinks[0]).toHaveAttribute('target', '_blank')

      // Check third link (system nudge)
      expect(actionLinks[1]).toHaveAttribute('href', 'https://status.example.com')
    })

    it('should not display action URL link when not present', () => {
      renderNudgePanel()

      // Second nudge has no action_url
      const nudgeTexts = screen.getAllByText(/80% towards/)
      const parentDiv = nudgeTexts[0].closest('div')

      // Should not have "Take Action" link in this nudge
      expect(within(parentDiv!).queryByText('Take Action')).not.toBeInTheDocument()
    })
  })

  describe('[P1] Dismiss Functionality', () => {
    it('should mark nudge as read when dismiss button is clicked', async () => {
      const user = userEvent.setup()
      const mockMarkAsRead = vi.fn().mockResolvedValue(undefined)

      vi.mocked(hooks.useUnreadNudges).mockReturnValue({
        data: mockNudges,
        isLoading: false,
      } as any)

      vi.mocked(hooks.useMarkNudgeAsRead).mockReturnValue({
        mutateAsync: mockMarkAsRead,
        isPending: false,
      } as any)

      renderNudgePanel()

      // Click first dismiss button
      const dismissButtons = screen.getAllByLabelText('Dismiss nudge')
      await user.click(dismissButtons[0])

      await waitFor(() => {
        expect(mockMarkAsRead).toHaveBeenCalledWith(1)
      })
    })

    it('should handle dismiss errors gracefully', async () => {
      const user = userEvent.setup()
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const mockMarkAsRead = vi.fn().mockRejectedValue(new Error('Network error'))

      vi.mocked(hooks.useUnreadNudges).mockReturnValue({
        data: mockNudges,
        isLoading: false,
      } as any)

      vi.mocked(hooks.useMarkNudgeAsRead).mockReturnValue({
        mutateAsync: mockMarkAsRead,
        isPending: false,
      } as any)

      renderNudgePanel()

      // Click dismiss button
      const dismissButtons = screen.getAllByLabelText('Dismiss nudge')
      await user.click(dismissButtons[0])

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Failed to mark nudge as read:',
          expect.any(Error)
        )
      })

      consoleSpy.mockRestore()
    })
  })

  describe('[P2] Timestamp Display', () => {
    it('should display creation timestamp for each nudge', () => {
      vi.mocked(hooks.useUnreadNudges).mockReturnValue({
        data: mockNudges,
        isLoading: false,
      } as any)

      vi.mocked(hooks.useMarkNudgeAsRead).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderNudgePanel()

      // Should display timestamps (exact format depends on locale)
      const timestamps = screen.getAllByText(/202[0-9]|AM|PM|:/i)
      expect(timestamps.length).toBeGreaterThan(0)
    })
  })

  describe('[P2] Scrollable Container', () => {
    it('should have max height and overflow scroll for many nudges', () => {
      // Create 10 nudges to test scrolling
      const manyNudges = {
        items: Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          user_id: 'user-1',
          type: NudgeType.REMINDER,
          message: `Nudge ${i + 1}`,
          priority: NudgePriority.NORMAL,
          read: false,
          action_url: null,
          created_at: new Date().toISOString(),
          expires_at: null,
        })),
        total: 10,
        page: 1,
        per_page: 20,
      }

      vi.mocked(hooks.useUnreadNudges).mockReturnValue({
        data: manyNudges,
        isLoading: false,
      } as any)

      vi.mocked(hooks.useMarkNudgeAsRead).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      const { container } = renderNudgePanel()

      // Should have overflow-y-auto class
      const scrollContainer = container.querySelector('.max-h-96.overflow-y-auto')
      expect(scrollContainer).toBeInTheDocument()
    })
  })
})

// Helper function to access within utility
function within(element: HTMLElement) {
  return {
    queryByText: (text: string | RegExp) => {
      const matches = Array.from(element.querySelectorAll('*')).filter((el) => {
        const textContent = el.textContent || ''
        return typeof text === 'string'
          ? textContent.includes(text)
          : text.test(textContent)
      })
      return matches[0] as HTMLElement | null
    },
  }
}
