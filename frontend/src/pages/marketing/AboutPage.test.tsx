import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import { AboutPage } from './AboutPage'

const renderAbout = () => render(<BrowserRouter><AboutPage /></BrowserRouter>)

describe('AboutPage', () => {
  it('sets the document title and renders the hero heading', () => {
    renderAbout()

    expect(document.title).toContain('About')
    expect(screen.getByRole('heading', { level: 1, name: /our mission.*empower ambitious businesses/i })).toBeInTheDocument()
  })

  it('displays mission, vision, and founder story content', () => {
    renderAbout()

    expect(screen.getByText(/every business.*deserves access to the same level of financial and strategic tooling/i)).toBeInTheDocument()
    expect(screen.getByText(/we envision a future where every business has the financial intelligence/i)).toBeInTheDocument()
      expect(screen.getByText(/founded by dudley peacock/i)).toBeInTheDocument()
  })

  it('includes value statements and call to action', () => {
    renderAbout()

    expect(screen.getByText(/user-first design/i)).toBeInTheDocument()
    expect(screen.getByText(/security & trust/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /start your free trial/i })).toBeInTheDocument()
  })
})

