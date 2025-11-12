import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { EnhancedHeroSection } from './EnhancedHeroSection'

const renderComponent = () =>
  render(
    <BrowserRouter>
      <EnhancedHeroSection />
    </BrowserRouter>
  )

describe('EnhancedHeroSection', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders CapLiquify headline and pricing statement', () => {
    renderComponent()
    expect(
      screen.getByText(/13-Week Cash Forecasting, Working Capital & Deal Execution in One Stack/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/£598\/mo \+ £2,500 setup/i)).toBeInTheDocument()
  })

  it('shows the latest stats', () => {
    renderComponent()
    expect(screen.getByText('95.8%')).toBeInTheDocument()
    expect(screen.getByText('£2.8M')).toBeInTheDocument()
    expect(screen.getByText('12 hrs')).toBeInTheDocument()
  })

  it('includes both primary and secondary CTAs', () => {
    renderComponent()
    expect(screen.getByRole('link', { name: /Start Free 14-Day Trial/i })).toHaveAttribute('href', '/sign-up')
    expect(screen.getByRole('link', { name: /See Pricing & Setup/i })).toHaveAttribute('href', '/pricing')
  })

  it('lists trust indicators and ROI chips', () => {
    renderComponent()
    expect(screen.getByText(/95%\+ forecast accuracy/i)).toBeInTheDocument()
    expect(screen.getByText(/SOC 2 • GDPR • ISO 27001/i)).toBeInTheDocument()
    expect(screen.getByText(/450\+ finance & deal teams/i)).toBeInTheDocument()
    expect(screen.getByText(/500% average ROI/i)).toBeInTheDocument()
  })

  it('cycles through testimonials', () => {
    renderComponent()
    act(() => {
      vi.advanceTimersByTime(5500)
    })
    expect(screen.getByText(/TechVentures/i)).toBeInTheDocument()
  })

  it('renders the dashboard mockup', () => {
    renderComponent()
    expect(screen.getAllByText(/13-week cash forecast/i).length).toBeGreaterThan(0)
  })
})
