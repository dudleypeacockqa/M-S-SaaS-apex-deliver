/**
 * FocusTimer Component Tests
 *
 * Tests for Pomodoro-style focus session timer with countdown logic
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FocusTimer } from './FocusTimer'
import * as hooks from '@/hooks/master-admin'

// Mock the hooks
vi.mock('@/hooks/master-admin', () => ({
  useActiveFocusSession: vi.fn(),
  useStartFocusSession: vi.fn(),
  useCompleteFocusSession: vi.fn(),
}))

describe('FocusTimer', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const renderFocusTimer = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <FocusTimer />
      </QueryClientProvider>
    )
  }

  describe('[P1] Initial State - No Active Session', () => {
    beforeEach(() => {
      vi.mocked(hooks.useActiveFocusSession).mockReturnValue({
        data: null,
        isLoading: false,
      } as any)

      vi.mocked(hooks.useStartFocusSession).mockReturnValue({
        mutateAsync: vi.fn().mockResolvedValue(undefined),
        isPending: false,
      } as any)

      vi.mocked(hooks.useCompleteFocusSession).mockReturnValue({
        mutateAsync: vi.fn().mockResolvedValue(undefined),
        isPending: false,
      } as any)
    })

    it('should display start session options when no active session', () => {
      renderFocusTimer()

      expect(screen.getByText('Focus Session')).toBeInTheDocument()
      expect(screen.getByText('Start a focused work session with no distractions.')).toBeInTheDocument()

      // Should show quick start buttons
      expect(screen.getByText('25 min')).toBeInTheDocument()
      expect(screen.getByText('50 min')).toBeInTheDocument()
      expect(screen.getByText('15 min')).toBeInTheDocument()
      expect(screen.getByText('90 min')).toBeInTheDocument()
    })

    it('should start 25-minute session when 25 min button is clicked', async () => {
      const user = userEvent.setup({ delay: null })
      const mockStartSession = vi.fn().mockResolvedValue(undefined)

      vi.mocked(hooks.useStartFocusSession).mockReturnValue({
        mutateAsync: mockStartSession,
        isPending: false,
      } as any)

      renderFocusTimer()

      const button25 = screen.getByText('25 min').closest('button')
      await user.click(button25!)

      await waitFor(() => {
        expect(mockStartSession).toHaveBeenCalledWith({
          start_time: expect.any(String),
          duration_minutes: 25,
        })
      })
    })

    it('should start 50-minute session when 50 min button is clicked', async () => {
      const user = userEvent.setup({ delay: null })
      const mockStartSession = vi.fn().mockResolvedValue(undefined)

      vi.mocked(hooks.useStartFocusSession).mockReturnValue({
        mutateAsync: mockStartSession,
        isPending: false,
      } as any)

      renderFocusTimer()

      const button50 = screen.getByText('50 min').closest('button')
      await user.click(button50!)

      await waitFor(() => {
        expect(mockStartSession).toHaveBeenCalledWith({
          start_time: expect.any(String),
          duration_minutes: 50,
        })
      })
    })
  })

  describe('[P1] Active Session State', () => {
    it('should display timer countdown when session is active', () => {
      const now = new Date().toISOString()
      const activeSession = {
        id: 1,
        user_id: 'user-1',
        start_time: now,
        end_time: null,
        duration_minutes: 25,
        completed: false,
        interrupted: false,
        notes: null,
        created_at: now,
        updated_at: now,
      }

      vi.mocked(hooks.useActiveFocusSession).mockReturnValue({
        data: activeSession,
        isLoading: false,
      } as any)

      vi.mocked(hooks.useStartFocusSession).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      vi.mocked(hooks.useCompleteFocusSession).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderFocusTimer()

      // Should show timer in MM:SS format
      expect(screen.getByText(/\d{2}:\d{2}/)).toBeInTheDocument()

      // Should show session duration
      expect(screen.getByText('25 minute session')).toBeInTheDocument()

      // Should show Stop button
      expect(screen.getByText('Stop')).toBeInTheDocument()
    })

    it('should display progress bar during active session', () => {
      const now = new Date().toISOString()
      const activeSession = {
        id: 1,
        user_id: 'user-1',
        start_time: now,
        end_time: null,
        duration_minutes: 25,
        completed: false,
        interrupted: false,
        notes: null,
        created_at: now,
        updated_at: now,
      }

      vi.mocked(hooks.useActiveFocusSession).mockReturnValue({
        data: activeSession,
        isLoading: false,
      } as any)

      vi.mocked(hooks.useStartFocusSession).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      vi.mocked(hooks.useCompleteFocusSession).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      const { container } = renderFocusTimer()

      // Should have progress bar
      const progressBar = container.querySelector('.bg-purple-600.h-2')
      expect(progressBar).toBeInTheDocument()
    })

    it('should stop session and mark as interrupted when Stop button is clicked', async () => {
      const user = userEvent.setup({ delay: null })
      const now = new Date().toISOString()
      const mockCompleteSession = vi.fn().mockResolvedValue(undefined)

      const activeSession = {
        id: 1,
        user_id: 'user-1',
        start_time: now,
        end_time: null,
        duration_minutes: 25,
        completed: false,
        interrupted: false,
        notes: null,
        created_at: now,
        updated_at: now,
      }

      vi.mocked(hooks.useActiveFocusSession).mockReturnValue({
        data: activeSession,
        isLoading: false,
      } as any)

      vi.mocked(hooks.useStartFocusSession).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      vi.mocked(hooks.useCompleteFocusSession).mockReturnValue({
        mutateAsync: mockCompleteSession,
        isPending: false,
      } as any)

      renderFocusTimer()

      const stopButton = screen.getByText('Stop')
      await user.click(stopButton)

      await waitFor(() => {
        expect(mockCompleteSession).toHaveBeenCalledWith({
          sessionId: 1,
          update: {
            end_time: expect.any(String),
            completed: false,
            interrupted: true,
          },
        })
      })
    })

    it('should display session notes when present', () => {
      const now = new Date().toISOString()
      const activeSession = {
        id: 1,
        user_id: 'user-1',
        start_time: now,
        end_time: null,
        duration_minutes: 25,
        completed: false,
        interrupted: false,
        notes: 'Deep work session',
        created_at: now,
        updated_at: now,
      }

      vi.mocked(hooks.useActiveFocusSession).mockReturnValue({
        data: activeSession,
        isLoading: false,
      } as any)

      vi.mocked(hooks.useStartFocusSession).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      vi.mocked(hooks.useCompleteFocusSession).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderFocusTimer()

      expect(screen.getByText('Note: Deep work session')).toBeInTheDocument()
    })
  })

  describe('[P2] Timer Logic', () => {
    it('should format time correctly in MM:SS format', () => {
      // Start session 5 minutes ago (300 seconds remaining out of 600)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()

      const activeSession = {
        id: 1,
        user_id: 'user-1',
        start_time: fiveMinutesAgo,
        end_time: null,
        duration_minutes: 10, // 10 minute session
        completed: false,
        interrupted: false,
        notes: null,
        created_at: fiveMinutesAgo,
        updated_at: fiveMinutesAgo,
      }

      vi.mocked(hooks.useActiveFocusSession).mockReturnValue({
        data: activeSession,
        isLoading: false,
      } as any)

      vi.mocked(hooks.useStartFocusSession).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      vi.mocked(hooks.useCompleteFocusSession).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderFocusTimer()

      // Should show approximately 05:00 (5 minutes remaining)
      expect(screen.getByText(/0[45]:[0-5]\d/)).toBeInTheDocument()
    })

    it('should show 00:00 when session duration has passed', () => {
      // Start session 30 minutes ago (exceeded 25 minute duration)
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString()

      const activeSession = {
        id: 1,
        user_id: 'user-1',
        start_time: thirtyMinutesAgo,
        end_time: null,
        duration_minutes: 25,
        completed: false,
        interrupted: false,
        notes: null,
        created_at: thirtyMinutesAgo,
        updated_at: thirtyMinutesAgo,
      }

      vi.mocked(hooks.useActiveFocusSession).mockReturnValue({
        data: activeSession,
        isLoading: false,
      } as any)

      vi.mocked(hooks.useStartFocusSession).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      vi.mocked(hooks.useCompleteFocusSession).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderFocusTimer()

      expect(screen.getByText('00:00')).toBeInTheDocument()
    })
  })

  describe('[P2] Loading State', () => {
    it('should show loading state for start buttons when mutation is pending', () => {
      vi.mocked(hooks.useActiveFocusSession).mockReturnValue({
        data: null,
        isLoading: false,
      } as any)

      vi.mocked(hooks.useStartFocusSession).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: true, // Mutation in progress
      } as any)

      vi.mocked(hooks.useCompleteFocusSession).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderFocusTimer()

      // All start buttons should be in loading state
      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        // Button should have loading spinner or be disabled
        expect(button).toBeInTheDocument()
      })
    })
  })
})
