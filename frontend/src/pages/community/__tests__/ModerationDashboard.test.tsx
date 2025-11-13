import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ModerationDashboard } from '../ModerationDashboard'
import * as communityApi from '../../../services/api/community'

vi.mock('../../../services/api/community')

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('ModerationDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(communityApi.getFlaggedContent).mockResolvedValue([])
    vi.mocked(communityApi.getCommunityAnalytics).mockResolvedValue({
      total_posts: 100,
      total_comments: 250,
      total_reactions: 500,
      total_follows: 75,
      active_users_count: 50,
      top_categories: [],
      recent_activity: [],
    })
  })

  it('should render moderation dashboard title', () => {
    render(<ModerationDashboard />, { wrapper: createWrapper() })

    expect(screen.getByTestId('moderation-title')).toBeInTheDocument()
  })
})
