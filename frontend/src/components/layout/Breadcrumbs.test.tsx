import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

import { Breadcrumbs } from './Breadcrumbs'

const renderWithRoute = (path: string, element = <Breadcrumbs />) => {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/" element={<div data-testid="root" />} />
        <Route path="/deals" element={element} />
        <Route path="/deals/:dealId" element={element} />
        <Route path="/deals/:dealId/documents" element={element} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Breadcrumbs', () => {
  it('renders nothing on the root route', () => {
    renderWithRoute('/')

    expect(screen.queryByRole('navigation', { name: /breadcrumb/i })).not.toBeInTheDocument()
  })

  it('renders breadcrumb trail for top-level route', () => {
    renderWithRoute('/deals')

    const nav = screen.getByRole('navigation', { name: /breadcrumb/i })
    expect(nav).toBeInTheDocument()
    expect(screen.getByText('Deals')).toBeInTheDocument()
  })

  it('renders nested breadcrumb trail', () => {
    renderWithRoute('/deals/123')

    const nav = screen.getByRole('navigation', { name: /breadcrumb/i })
    expect(nav).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Deals')).toBeInTheDocument()
    expect(screen.getByText('123')).toBeInTheDocument()
  })

  it('provides links for intermediate segments', () => {
    renderWithRoute('/deals/123/documents')

    const links = screen.getAllByRole('link')
    expect(links.map((link) => link.textContent)).toContain('Deals')
  })
})
