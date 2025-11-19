import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CommunityFeed } from '../CommunityFeed'
import * as communityApi from '../../../services/api/community'

vi.mock('../../../services/api/community')

const renderWithQueryClient = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  vi.mocked(communityApi.listPosts).mockResolvedValue({
    posts: [],
    total: 0,
    page: 1,
    page_size: 20,
    total_pages: 0,
  })

  render(
    <QueryClientProvider client={queryClient}>
      <CommunityFeed />
    </QueryClientProvider>,
  )
}

describe('CommunityFeed in moderation mode', () => {
  it('renders moderation ready guidance', () => {
    renderWithQueryClient()
    expect(screen.getByText(/moderation checklist/i)).toBeInTheDocument()
  })
})
