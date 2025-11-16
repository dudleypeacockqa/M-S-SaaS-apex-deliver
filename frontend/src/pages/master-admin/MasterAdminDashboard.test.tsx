import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as ReactRouterDom from 'react-router-dom'

import { renderWithQueryClient } from '../../setupTests'
import { MasterAdminDashboard } from './MasterAdminDashboard'
import * as masterAdminHooks from '@/hooks/master-admin'

const navigateMock = vi.fn()

vi.mock('@/components/master-admin/shared', () => ({
  ScoreDisplay: ({ score }: { score: number }) => (
    <div data-testid="score-display">Score: {score}</div>
  ),
  StreakCounter: ({ streakDays }: { streakDays: number }) => (
    <div data-testid="streak-counter">Streak: {streakDays}</div>
  ),
  StatCard: ({ title, value, onClick }: { title: string; value: number; onClick: () => void }) => (
    <button type="button" data-testid={`stat-card-${title}`} onClick={onClick}>
      {title}: {value}
    </button>
  ),
  QuickActionButton: ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button type="button" data-testid={`quick-action-${label}`} onClick={onClick}>
      {label}
    </button>
  ),
}))

vi.mock('@/hooks/master-admin', () => ({
  useDashboardStats: vi.fn(),
  useTodayScore: vi.fn(),
  useCurrentStreak: vi.fn(),
}))

const renderPage = () =>
  renderWithQueryClient(
    <ReactRouterDom.MemoryRouter>
      <MasterAdminDashboard />
    </ReactRouterDom.MemoryRouter>,
  )

describe('MasterAdminDashboard page', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
    navigateMock.mockReset()

    vi.spyOn(ReactRouterDom, 'useNavigate').mockReturnValue(navigateMock)

    vi.mocked(masterAdminHooks.useDashboardStats).mockReturnValue({
      data: {
        activities_today: 7,
        prospects_active: 4,
        deals_active: 3,
        unread_nudges: 2,
        score: 70,
        streak: 5,
      },
      isLoading: false,
    } as any)

    vi.mocked(masterAdminHooks.useTodayScore).mockReturnValue({
      data: { score: 82 },
      isLoading: false,
    } as any)

    vi.mocked(masterAdminHooks.useCurrentStreak).mockReturnValue({
      data: { streak_days: 6 },
      isLoading: false,
    } as any)
  })

  it('renders hero metrics, stat cards, and quick actions', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: /master admin dashboard/i })).toBeInTheDocument()
    expect(screen.getByTestId('score-display')).toHaveTextContent('82')
    expect(screen.getByTestId('streak-counter')).toHaveTextContent('6')

    expect(screen.getByTestId('stat-card-Activities Today')).toHaveTextContent('7')
    expect(screen.getByTestId('stat-card-Active Prospects')).toHaveTextContent('4')
    expect(screen.getByTestId('stat-card-Active Deals')).toHaveTextContent('3')
    expect(screen.getByTestId('stat-card-Unread Nudges')).toHaveTextContent('2')

    expect(screen.getByTestId('quick-action-Log Activity')).toBeInTheDocument()
    expect(screen.getByTestId('quick-action-Start Focus')).toBeInTheDocument()
    expect(screen.getByTestId('quick-action-Add Prospect')).toBeInTheDocument()
    expect(screen.getByTestId('quick-action-Set Goals')).toBeInTheDocument()
  })

  it('shows loading state while stats are loading', () => {
    vi.mocked(masterAdminHooks.useDashboardStats).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any)

    renderPage()

    expect(screen.getByTestId('dashboard-loading')).toBeInTheDocument()
  })

  it('navigates to modules when actions are clicked', async () => {
    renderPage()

    const user = userEvent.setup()
    await user.click(screen.getByTestId('quick-action-Log Activity'))
    expect(navigateMock).toHaveBeenCalledWith('/master-admin/activity')

    await user.click(screen.getByTestId('stat-card-Active Deals'))
    expect(navigateMock).toHaveBeenCalledWith('/master-admin/deals')
  })
})
