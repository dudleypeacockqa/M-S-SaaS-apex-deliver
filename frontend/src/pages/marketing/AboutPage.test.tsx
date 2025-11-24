import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import { AboutPage } from './AboutPage'

const renderAbout = () => render(<BrowserRouter><AboutPage /></BrowserRouter>)

describe('AboutPage', () => {
  it('sets the document title and renders the hero heading', () => {
    renderAbout()

    expect(document.title).toContain('About')
    expect(screen.getByRole('heading', { level: 1, name: /financeflo is the erp \+ ai partner/i })).toBeInTheDocument()
  })

  it('displays mission, vision, and founder story content', () => {
    renderAbout()

    expect(screen.getByText(/give every finance, deal, and gtm team the ERP backbone/i)).toBeInTheDocument()
    expect(screen.getByText(/founded by dudley peacock/i)).toBeInTheDocument()
  })

  it('includes value statements and call to action', () => {
    renderAbout()

    expect(screen.getByText(/erp \+ ai operators/i)).toBeInTheDocument()
    expect(screen.getByText(/security & trust/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /book implementation blueprint/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /start capliquify \+ apexdeliver trial/i })).toBeInTheDocument()
  })
})

