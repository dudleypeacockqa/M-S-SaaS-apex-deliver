import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as ReactRouterDom from 'react-router-dom'

import { renderWithQueryClient } from '../../setupTests'
import { ActivityTracker } from './ActivityTracker'
import * as masterAdminHooks from '@/hooks/master-admin'

const navigateMock = vi.fn()

vi.mock('@/components/master-admin/activity', () => ({
  GoalCard: () => <div data-testid="goal-card">GoalCard</div>,
  ActivityForm: () => <div data-testid="activity-form">ActivityForm</div>,
  ActivityList: () => <div data-testid="activity-list">ActivityList</div>,
  FocusTimer: () => <div data-testid="focus-timer">FocusTimer</div>,
  NudgePanel: () => <div data-testid="nudge-panel">NudgePanel</div>,
}))

vi.mock('@/components/master-admin/shared', () => ({
  ScoreDisplay: ({ score }: { score: number }) => (
    <div data-testid="score-display">Score: {score}</div>
  ),
  StreakCounter: ({ streakDays }: { streakDays: number }) => (
    <div data-testid="streak-counter">Streak: {streakDays}</div>
  ),
}))

vi.mock('@/hooks/master-admin', () => ({
  useTodayScore: vi.fn(),
  useCurrentStreak: vi.fn(),
}))

const renderPage = () =>
  renderWithQueryClient(
    <ReactRouterDom.MemoryRouter>
      <ActivityTracker />
    </ReactRouterDom.MemoryRouter>,
  )

describe('ActivityTracker page', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
    navigateMock.mockReset()

    vi.spyOn(ReactRouterDom, 'useNavigate').mockReturnValue(navigateMock)

    vi.mocked(masterAdminHooks.useTodayScore).mockReturnValue({
      data: { score: 88 },
      isLoading: false,
    } as any)

    vi.mocked(masterAdminHooks.useCurrentStreak).mockReturnValue({
      data: { streak_days: 6 },
      isLoading: false,
    } as any)
  })

  it('renders hero stats and master admin modules', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: /activity tracker/i })).toBeInTheDocument()
    expect(screen.getByText(/log your daily activities/i)).toBeInTheDocument()

    expect(screen.getByTestId('goal-card')).toBeInTheDocument()
    expect(screen.getByTestId('activity-form')).toBeInTheDocument()
    expect(screen.getByTestId('activity-list')).toBeInTheDocument()
    expect(screen.getByTestId('focus-timer')).toBeInTheDocument()
    expect(screen.getByTestId('nudge-panel')).toBeInTheDocument()

    expect(screen.getByTestId('score-display')).toHaveTextContent('88')
    expect(screen.getByTestId('streak-counter')).toHaveTextContent('6')
  })

  it('falls back to zero when score and streak queries are empty', () => {
    vi.mocked(masterAdminHooks.useTodayScore).mockReturnValue({
      data: undefined,
      isLoading: false,
    } as any)
    vi.mocked(masterAdminHooks.useCurrentStreak).mockReturnValue({
      data: undefined,
      isLoading: false,
    } as any)

    renderPage()

    expect(screen.getByTestId('score-display')).toHaveTextContent('0')
    expect(screen.getByTestId('streak-counter')).toHaveTextContent('0')
  })

  it('navigates back to dashboard when the back button is clicked', async () => {
    renderPage()

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /back to dashboard/i }))

    expect(navigateMock).toHaveBeenCalledWith('/master-admin')
  })
})
