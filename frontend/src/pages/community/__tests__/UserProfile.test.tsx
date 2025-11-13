import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { UserProfile } from '../UserProfile'
import * as communityApi from '../../../services/api/community'

vi.mock('../../../services/api/community')

const createWrapper = (userId: string = 'user-123') => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/community/profile/${userId}`]}>
        <Routes>
          <Route path="/community/profile/:userId" element={children} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('UserProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(communityApi.listPosts).mockResolvedValue({
      posts: [],
      total: 0,
      page: 1,
      page_size: 20,
      total_pages: 0,
    })
    vi.mocked(communityApi.getFollowStats).mockResolvedValue({
      user_id: 'user-123',
      followers_count: 10,
      following_count: 5,
      is_following: false,
    })
  })

  it('should render user profile title', () => {
    render(<UserProfile />, { wrapper: createWrapper() })

    expect(screen.getByTestId('user-profile-title')).toBeInTheDocument()
  })

  it('should render follow button', () => {
    render(<UserProfile />, { wrapper: createWrapper() })

    expect(screen.getByTestId('follow-button')).toBeInTheDocument()
  })
})
