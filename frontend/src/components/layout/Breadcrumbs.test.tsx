import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Breadcrumbs } from './Breadcrumbs'

describe('Breadcrumbs Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render breadcrumb navigation', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Breadcrumbs />
      </MemoryRouter>
    )

    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument()
  })

  it('should render breadcrumb trail for nested routes', () => {
    render(
      <MemoryRouter initialEntries={['/deals/123/documents']}>
        <Breadcrumbs />
      </MemoryRouter>
    )

    // Should show: Home > Deals > 123 > Documents
    expect(screen.getByText(/Home/i)).toBeInTheDocument()
    expect(screen.getByText(/Deals/i)).toBeInTheDocument()
  })

  it('should handle root route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Breadcrumbs />
      </MemoryRouter>
    )

    // Root returns null, so breadcrumb nav should not be present
    expect(screen.queryByRole('navigation', { name: /breadcrumb/i })).not.toBeInTheDocument()
  })

  it('should make breadcrumb items clickable links', () => {
    render(
      <MemoryRouter initialEntries={['/deals/123']}>
        <Breadcrumbs />
      </MemoryRouter>
    )

    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
  })
})
