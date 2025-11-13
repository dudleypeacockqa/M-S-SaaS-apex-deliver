import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import { BlogListingPage } from '../BlogListingPage'
import { setBlogApiFailure } from '../../../tests/msw/server'

const renderPage = () => render(
  <BrowserRouter>
    <BlogListingPage />
  </BrowserRouter>
)

describe('BlogListingPage contract', () => {
  beforeEach(() => {
    // Reset blog API failure state before each test
    setBlogApiFailure(false)
  })

  it('shows a friendly outage message when the blog API fails', async () => {
    // Set blog API to fail
    setBlogApiFailure(true)

    renderPage()

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Unable to load blog posts. Please try again later.')
    }, { timeout: 5000 })
  })
})
