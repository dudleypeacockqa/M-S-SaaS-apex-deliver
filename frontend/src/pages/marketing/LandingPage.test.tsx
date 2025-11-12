import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { LandingPage } from './LandingPage'

const renderPage = () => render(<BrowserRouter><LandingPage /></BrowserRouter>)

describe('LandingPage', () => {
  it('renders the enhanced hero section headline', () => {
    renderPage()
    expect(screen.getByText(/13-Week Cash Forecasting/i)).toBeInTheDocument()
  })

  it('includes trust badge section', () => {
    renderPage()
    expect(screen.getByText(/Enterprise-Grade Security & Compliance/i)).toBeInTheDocument()
  })

  it('highlights CapLiquify FP&A messaging', () => {
    renderPage()
    expect(screen.getByText(/CapLiquify FP&A in action/i)).toBeInTheDocument()
    expect(screen.getByText(/13-week rolling cash forecast/i)).toBeInTheDocument()
  })

  it('adds quantified social proof stats and logos', () => {
    renderPage()
    expect(screen.getByText(/finance & deal teams onboarded/i)).toBeInTheDocument()
    expect(screen.getAllByText(/reduction in manual prep/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/Customer logos/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Brookline Partners/i).length).toBeGreaterThan(0)
  })

  it('renders the how it works steps', () => {
    renderPage()
    expect(screen.getByText(/Connect your ledgers/i)).toBeInTheDocument()
    expect(screen.getByText(/Execute inside ApexDeliver/i)).toBeInTheDocument()
  })

  it('shows pricing teaser information', () => {
    renderPage()
    expect(screen.getAllByText(/CapLiquify FP&A/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/£598\/mo \+ £2,500 setup/i).length).toBeGreaterThan(0)
  })

  it('maintains CTA section at the end', () => {
    renderPage()
    expect(screen.getAllByRole('link', { name: /Start Free/i }).length).toBeGreaterThan(0)
  })

  it('renders case study callouts', () => {
    renderPage()
    expect(screen.getByText(/Proof from active portfolios/i)).toBeInTheDocument()
    expect(screen.getByText(/Unlocked £4\.2M/i)).toBeInTheDocument()
  })
})
