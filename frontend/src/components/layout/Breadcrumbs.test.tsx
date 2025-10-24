import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it } from 'vitest'

import { Breadcrumbs } from './Breadcrumbs'

const renderBreadcrumbs = (initialEntry: string, routePath: string) => {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path={routePath} element={<Breadcrumbs />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Breadcrumbs', () => {
  it('does not render on the root path', () => {
    renderBreadcrumbs('/', '/')

    expect(screen.queryByRole('navigation', { name: /breadcrumb/i })).toBeNull()
  })

  it('renders a simple breadcrumb for top-level routes', () => {
    renderBreadcrumbs('/dashboard', 'dashboard')

    const nav = screen.getByRole('navigation', { name: /breadcrumb/i })
    expect(nav).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('renders breadcrumb trail for nested routes', () => {
    renderBreadcrumbs('/deals/123/documents', 'deals/:dealId/documents')

    const nav = screen.getByRole('navigation', { name: /breadcrumb/i })
    expect(nav).toBeInTheDocument()

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Deals')).toBeInTheDocument()
    expect(screen.getByText('Deal 123')).toBeInTheDocument()
    expect(screen.getByText('Documents')).toBeInTheDocument()
  })

  it('creates clickable links for intermediate breadcrumb items', () => {
    renderBreadcrumbs('/deals/123/documents', 'deals/:dealId/documents')

    const links = screen.getAllByRole('link')
    expect(links.map((link) => link.textContent)).toContain('Deals')
  })
})

