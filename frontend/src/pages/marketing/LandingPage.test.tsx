import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { LandingPage } from './LandingPage'

const renderPage = () => render(<BrowserRouter><LandingPage /></BrowserRouter>)

describe('LandingPage', () => {
  it('renders the enhanced hero section headline', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: /ERP Implementation \+ CapLiquify & ApexDeliver in One Partner Stack/i })).toBeInTheDocument()
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
    expect(screen.getAllByRole('link', { name: /Start Your Free Trial/i }).length).toBeGreaterThan(0)
  })

  it('renders case study callouts', () => {
    renderPage()
    expect(screen.getByText(/Proof from active portfolios/i)).toBeInTheDocument()
    expect(screen.getByText(/Unlocked £4\.2M/i)).toBeInTheDocument()
  })
})

// TDD RED PHASE: Performance Optimization Tests
// These tests will FAIL until we replace <img> with <OptimizedImage>
describe('LandingPage - Image Optimization (TDD)', () => {
  it('should use OptimizedImage component for dashboard preview (not plain img)', () => {
    renderPage()

    // Find the dashboard preview image
    const dashboardImg = screen.getByAltText(/dashboard/i)

    // FAILING TEST: Currently uses <img>, should use <picture> from OptimizedImage
    // OptimizedImage wraps img in <picture> element with WebP <source>
    const pictureParent = dashboardImg.closest('picture')
    expect(pictureParent).toBeTruthy()
    expect(pictureParent?.tagName).toBe('PICTURE')
  })

  it('should serve WebP format for dashboard preview image', () => {
    renderPage()

    const dashboardImg = screen.getByAltText(/dashboard/i)
    const pictureParent = dashboardImg.closest('picture')

    // FAILING TEST: Should have WebP source element
    const webpSource = pictureParent?.querySelector('source[type="image/webp"]')
    expect(webpSource).toBeTruthy()
    expect(webpSource?.getAttribute('srcSet')).toContain('.webp')
  })

  it('should have fallback PNG for dashboard preview', () => {
    renderPage()

    const dashboardImg = screen.getByAltText(/dashboard/i)

    // PASSING TEST: img should still reference .png for fallback
    expect(dashboardImg).toHaveAttribute('src')
    const src = dashboardImg.getAttribute('src')
    expect(src).toContain('.png')
  })

  it('should use lazy loading for below-fold images', () => {
    renderPage()

    const dashboardImg = screen.getByAltText(/dashboard/i)

    // PASSING TEST: Already has loading="lazy"
    expect(dashboardImg).toHaveAttribute('loading', 'lazy')
  })

  it('should have width and height to prevent CLS', () => {
    renderPage()

    const dashboardImg = screen.getByAltText(/dashboard/i)

    // FAILING TEST: Currently missing width/height attributes
    expect(dashboardImg).toHaveAttribute('width')
    expect(dashboardImg).toHaveAttribute('height')
  })
})
