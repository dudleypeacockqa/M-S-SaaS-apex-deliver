import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { StickyCTABar } from './StickyCTABar'

// Helper to render with router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('StickyCTABar', () => {
  beforeEach(() => {
    // Clear sessionStorage before each test
    sessionStorage.clear()

    // Mock scroll properties
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    })

    Object.defineProperty(document.documentElement, 'scrollHeight', {
      writable: true,
      configurable: true,
      value: 2000,
    })

    Object.defineProperty(document.documentElement, 'clientHeight', {
      writable: true,
      configurable: true,
      value: 1000,
    })

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1000,
    })

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
  })

  it('should not render if dismissed in session', () => {
    sessionStorage.setItem('stickyCTADismissed', 'true')
    renderWithRouter(<StickyCTABar />)

    expect(screen.queryByText(/Start Your 14-Day Free Trial/i)).not.toBeInTheDocument()
  })

  it('should be hidden initially (before scrolling)', () => {
    renderWithRouter(<StickyCTABar />)

    // Find the outer container div with fixed positioning
    const container = document.querySelector('.fixed.bottom-0') as HTMLElement
    expect(container).toHaveClass('translate-y-full')
  })

  it('should show after scrolling past 80%', async () => {
    renderWithRouter(<StickyCTABar />)

    // Simulate scrolling past 80%
    // Component shows bar when scrollPercentage > 80
    // Formula: (scrollY / (scrollHeight - innerHeight)) * 100 > 80
    // Required: scrollY > 0.8 * (2000 - 1000) = 800
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 850, // More than 80% of (2000 - 1000)
    })

    fireEvent.scroll(window)

    await waitFor(() => {
      const container = document.querySelector('.fixed.bottom-0') as HTMLElement
      expect(container).toHaveClass('translate-y-0')
    })
  })

  it('should hide when scrolling back to top', async () => {
    renderWithRouter(<StickyCTABar />)

    // Scroll down first (past 80%)
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 850,
    })
    fireEvent.scroll(window)

    // Then scroll back up (less than 80%)
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 100, // Less than 80%
    })
    fireEvent.scroll(window)

    await waitFor(() => {
      const container = document.querySelector('.fixed.bottom-0') as HTMLElement
      expect(container).toHaveClass('translate-y-full')
    })
  })

  it('should render all required elements', () => {
    renderWithRouter(<StickyCTABar />)

    expect(screen.getByText(/Start Your 14-Day Free Trial Today/i)).toBeInTheDocument()
    expect(screen.getByText(/Join 500\+ M&A professionals/i)).toBeInTheDocument()
    expect(screen.getByText(/Get Started/i)).toBeInTheDocument()
  })

  it('should have Get Started button linking to /sign-up', () => {
    renderWithRouter(<StickyCTABar />)

    const getStartedButton = screen.getByText(/Get Started/i).closest('a')
    expect(getStartedButton).toHaveAttribute('href', '/sign-up')
  })

  it('should dismiss and set sessionStorage when close button clicked', () => {
    renderWithRouter(<StickyCTABar />)

    const closeButton = screen.getByLabelText(/Close/i)
    fireEvent.click(closeButton)

    expect(sessionStorage.getItem('stickyCTADismissed')).toBe('true')
    expect(screen.queryByText(/Start Your 14-Day Free Trial/i)).not.toBeInTheDocument()
  })

  it('should not re-render after dismissal', () => {
    renderWithRouter(<StickyCTABar />)

    const closeButton = screen.getByLabelText(/Close/i)
    fireEvent.click(closeButton)

    // Try to trigger scroll (past 80%)
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 850,
    })
    fireEvent.scroll(window)

    expect(screen.queryByText(/Start Your 14-Day Free Trial/i)).not.toBeInTheDocument()
  })

  it('should have responsive design (icon should exist)', () => {
    renderWithRouter(<StickyCTABar />)

    // Check for icon SVG (email icon)
    const icons = document.querySelectorAll('svg')
    expect(icons.length).toBeGreaterThan(0)
  })
})
