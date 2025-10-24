import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Breadcrumbs } from './Breadcrumbs'

describe('Breadcrumbs Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render breadcrumb navigation', () => {
    render(
      <BrowserRouter>
        <Breadcrumbs />
      </BrowserRouter>
    )

    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument()
  })

  it('should render breadcrumb trail for nested routes', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route
            path="/deals/:dealId/documents"
            element={<Breadcrumbs />}
          />
        </Routes>
      </BrowserRouter>
    )

    // Should show: Home > Deals > Deal Details > Documents
    expect(screen.getByText(/Home/i)).toBeInTheDocument()
  })

  it('should handle root route', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Breadcrumbs />} />
        </Routes>
      </BrowserRouter>
    )

    // Root should show just "Home" or be empty
    const nav = screen.getByRole('navigation', { name: /breadcrumb/i })
    expect(nav).toBeInTheDocument()
  })

  it('should make breadcrumb items clickable links', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/deals/123" element={<Breadcrumbs />} />
        </Routes>
      </BrowserRouter>
    )

    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
  })
})
