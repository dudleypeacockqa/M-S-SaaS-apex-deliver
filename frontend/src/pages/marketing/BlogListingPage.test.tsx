import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

vi.mock('../../services/blogService', () => ({
  fetchBlogPosts: vi.fn(),
}))

import { fetchBlogPosts } from '../../services/blogService'
import { BlogListingPage } from './BlogListingPage'

const mockedFetchBlogPosts = fetchBlogPosts as unknown as vi.Mock

const renderWithRouter = () =>
  render(
    <BrowserRouter>
      <BlogListingPage />
    </BrowserRouter>
  )

describe('BlogListingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches and renders blog posts from the API', async () => {
    mockedFetchBlogPosts.mockResolvedValueOnce([
      {
        id: 1,
        title: 'How to Close Deals Faster',
        slug: 'close-deals-faster',
        excerpt: 'Speed up your M&A execution with these tactics.',
        author: 'Dudley Peacock',
        category: 'M&A Strategy',
        published_at: '2025-10-20',
        read_time_minutes: 8,
        featured_image_url: null,
      },
    ])

    renderWithRouter()

    expect(screen.getByText(/loading posts/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(mockedFetchBlogPosts).toHaveBeenCalledTimes(1)
      expect(mockedFetchBlogPosts).toHaveBeenCalledWith({ limit: 100 })
      expect(screen.getByText(/How to Close Deals Faster/i)).toBeInTheDocument()
    })

    expect(screen.queryByText(/loading posts/i)).not.toBeInTheDocument()
  })

  it('shows a friendly error message when the API call fails', async () => {
    mockedFetchBlogPosts.mockRejectedValueOnce(new Error('Network error'))

    renderWithRouter()

    await waitFor(() => {
      expect(mockedFetchBlogPosts).toHaveBeenCalledTimes(1)
      expect(screen.getByText(/Unable to load blog posts/i)).toBeInTheDocument()
    })
  })

  it('renders search input field', () => {
    mockedFetchBlogPosts.mockResolvedValueOnce([])
    renderWithRouter()
    expect(screen.getByPlaceholderText(/search blog posts/i)).toBeInTheDocument()
  })

  it('renders category filter buttons', async () => {
    mockedFetchBlogPosts.mockResolvedValueOnce([])
    renderWithRouter()
    
    await waitFor(() => {
        expect(screen.getByText(/all posts/i)).toBeInTheDocument()
    })
    expect(screen.getByText(/m&a strategy/i)).toBeInTheDocument()
    expect(screen.getByText(/financial planning/i)).toBeInTheDocument()
  })
})
