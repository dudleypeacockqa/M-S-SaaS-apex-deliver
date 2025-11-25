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

  it('renders CapLiquify + ApexDeliver headline copy', () => {
    renderComponent()
    expect(
      screen.getByRole('heading', { name: /ERP Implementation \+ CapLiquify & ApexDeliver in One Partner Stack/i })
    ).toBeInTheDocument()
  })

  it('shows the latest stats', () => {
    renderComponent()
    expect(screen.getByText('450+')).toBeInTheDocument()
    expect(screen.getByText('£2.8M')).toBeInTheDocument()
    expect(screen.getByText('120+')).toBeInTheDocument()
  })

  it('includes both primary and secondary CTAs', () => {
    renderComponent()
    expect(screen.getByRole('link', { name: /Book Implementation Blueprint/i })).toHaveAttribute('href', '/contact')
    expect(screen.getByRole('link', { name: /See CapLiquify \+ ApexDeliver Demo/i })).toHaveAttribute('href', '/sign-up')
  })

  it('lists trust indicators and ROI chips', () => {
    renderComponent()
    expect(screen.getByText(/FinanceFlo ERP \+ AI Studio/i)).toBeInTheDocument()
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
