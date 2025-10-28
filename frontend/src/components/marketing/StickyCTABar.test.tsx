import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
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

    // Reset scroll
    window.scrollY = 0
    document.documentElement.scrollHeight = 2000
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1000,
    })
  })

  it('should not render if dismissed in session', () => {
    sessionStorage.setItem('stickyCTADismissed', 'true')
    renderWithRouter(<StickyCTABar />)

    expect(screen.queryByText(/Start Your 14-Day Free Trial/i)).not.toBeInTheDocument()
  })

  it('should be hidden initially (before scrolling)', () => {
    renderWithRouter(<StickyCTABar />)

    const container = screen.getByText(/Start Your 14-Day Free Trial/i).closest('div')
    expect(container).toHaveClass('translate-y-full')
  })

  it('should show after scrolling past 50%', () => {
    renderWithRouter(<StickyCTABar />)

    // Simulate scrolling past 50%
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 600, // More than 50% of (2000 - 1000)
    })

    fireEvent.scroll(window)

    const container = screen.getByText(/Start Your 14-Day Free Trial/i).closest('div')
    expect(container).toHaveClass('translate-y-0')
  })

  it('should hide when scrolling back to top', () => {
    renderWithRouter(<StickyCTABar />)

    // Scroll down first
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 600,
    })
    fireEvent.scroll(window)

    // Then scroll back up
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 100, // Less than 50%
    })
    fireEvent.scroll(window)

    const container = screen.getByText(/Start Your 14-Day Free Trial/i).closest('div')
    expect(container).toHaveClass('translate-y-full')
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

    // Try to trigger scroll
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 600,
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
