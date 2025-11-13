import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CommunityFeed } from '../CommunityFeed'
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

describe('CommunityFeed', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render community feed title', () => {
    vi.mocked(communityApi.listPosts).mockResolvedValue({
      posts: [],
      total: 0,
      page: 1,
      page_size: 20,
      total_pages: 0,
    })

    render(<CommunityFeed />, { wrapper: createWrapper() })

    expect(screen.getByText('Community Feed')).toBeInTheDocument()
  })

  it('should render create post button', () => {
    vi.mocked(communityApi.listPosts).mockResolvedValue({
      posts: [],
      total: 0,
      page: 1,
      page_size: 20,
      total_pages: 0,
    })

    render(<CommunityFeed />, { wrapper: createWrapper() })

    expect(screen.getByTestId('create-post-button')).toBeInTheDocument()
  })

  it('should render search and filter controls', () => {
    vi.mocked(communityApi.listPosts).mockResolvedValue({
      posts: [],
      total: 0,
      page: 1,
      page_size: 20,
      total_pages: 0,
    })

    render(<CommunityFeed />, { wrapper: createWrapper() })

    expect(screen.getByTestId('search-input')).toBeInTheDocument()
    expect(screen.getByTestId('category-filter')).toBeInTheDocument()
    expect(screen.getByTestId('status-filter')).toBeInTheDocument()
  })

  it('should display loading state', () => {
    vi.mocked(communityApi.listPosts).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    )

    render(<CommunityFeed />, { wrapper: createWrapper() })

    expect(screen.getByText('Loading posts...')).toBeInTheDocument()
  })

  it('should display empty state when no posts', async () => {
    vi.mocked(communityApi.listPosts).mockResolvedValue({
      posts: [],
      total: 0,
      page: 1,
      page_size: 20,
      total_pages: 0,
    })

    render(<CommunityFeed />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText(/No posts found/i)).toBeInTheDocument()
    })
  })
})
