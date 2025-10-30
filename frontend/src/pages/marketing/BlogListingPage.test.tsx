import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import { BlogListingPage } from './BlogListingPage'

vi.mock('../../services/blogService', () => ({
  fetchBlogPosts: vi.fn(),
}))

const { fetchBlogPosts } = require('../../services/blogService') as {
  fetchBlogPosts: ReturnType<typeof vi.fn>
}

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
    fetchBlogPosts.mockResolvedValueOnce([
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
      expect(fetchBlogPosts).toHaveBeenCalledTimes(1)
      expect(screen.getByText(/How to Close Deals Faster/i)).toBeInTheDocument()
    })

    expect(screen.queryByText(/loading posts/i)).not.toBeInTheDocument()
  })

  it('shows a friendly error message when the API call fails', async () => {
    fetchBlogPosts.mockRejectedValueOnce(new Error('Network error'))

    renderWithRouter()

    await waitFor(() => {
      expect(fetchBlogPosts).toHaveBeenCalledTimes(1)
      expect(screen.getByText(/Unable to load blog posts/i)).toBeInTheDocument()
    })
  })
})
