import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import { BlogListingPage } from '../BlogListingPage'
import { fetchBlogPosts } from '../../../services/blogService'

vi.mock('../../../services/blogService', () => ({
  fetchBlogPosts: vi.fn(),
}))

const mockedFetch = vi.mocked(fetchBlogPosts)

const renderPage = () => render(
  <BrowserRouter>
    <BlogListingPage />
  </BrowserRouter>
)

describe('BlogListingPage contract', () => {
  it('shows a friendly outage message when the blog API fails', async () => {
    mockedFetch.mockRejectedValueOnce(new Error('network down'))

    renderPage()

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Blog content is temporarily unavailable. Please check back soon.')
    })
  })
})
