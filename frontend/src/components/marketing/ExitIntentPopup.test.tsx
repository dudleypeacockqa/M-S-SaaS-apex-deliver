import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { ExitIntentPopup } from './ExitIntentPopup'

describe('ExitIntentPopup', () => {
  beforeEach(() => {
    // Clear sessionStorage before each test
    sessionStorage.clear()
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('should not render initially', () => {
    render(<ExitIntentPopup />)
    expect(screen.queryByText(/Wait! Don't Miss Out/i)).not.toBeInTheDocument()
  })

  it('should render when mouse leaves viewport', () => {
    render(<ExitIntentPopup />)

    // Fast-forward past the 2-second delay
    act(() => {
      vi.advanceTimersByTime(2000)
    })

    // Trigger mouse leave event
    act(() => {
      fireEvent(document, new MouseEvent('mouseleave', { clientY: -1 }))
    })

    expect(screen.getByText(/Wait! Don't Miss Out/i)).toBeInTheDocument()
  })

  it('should display email form with all elements', () => {
    render(<ExitIntentPopup />)

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    act(() => {
      fireEvent(document, new MouseEvent('mouseleave', { clientY: -1 }))
    })

    expect(screen.getByPlaceholderText(/Enter your work email/i)).toBeInTheDocument()
    expect(screen.getByText(/Start Free 14-Day Trial/i)).toBeInTheDocument()
    expect(screen.getByText(/Just Browsing/i)).toBeInTheDocument()
  })

  it('should display 4 key benefits', () => {
    render(<ExitIntentPopup />)

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    act(() => {
      fireEvent(document, new MouseEvent('mouseleave', { clientY: -1 }))
    })

    expect(screen.getByText(/70% faster closures/i)).toBeInTheDocument()
    expect(screen.getByText(/AI-powered insights/i)).toBeInTheDocument()
    expect(screen.getByText(/Save £9,721\/year/i)).toBeInTheDocument()
    // Use getAllByText since "No credit card required" appears twice (in benefits and trust indicators)
    expect(screen.getAllByText(/No credit card required/i).length).toBeGreaterThanOrEqual(1)
  })

  it('should close when clicking Just Browsing button', () => {
    render(<ExitIntentPopup />)

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    act(() => {
      fireEvent(document, new MouseEvent('mouseleave', { clientY: -1 }))
    })

    const browsingButton = screen.getByText(/Just Browsing/i)

    act(() => {
      fireEvent.click(browsingButton)
    })

    expect(screen.queryByText(/Wait! Don't Miss Out/i)).not.toBeInTheDocument()
  })

  it('should close when clicking backdrop', () => {
    render(<ExitIntentPopup />)

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    act(() => {
      fireEvent(document, new MouseEvent('mouseleave', { clientY: -1 }))
    })

    // Find the backdrop div (it has the bg-black/60 class)
    const backdrop = document.querySelector('.bg-black\\/60') as HTMLElement

    act(() => {
      fireEvent.click(backdrop)
    })

    expect(screen.queryByText(/Wait! Don't Miss Out/i)).not.toBeInTheDocument()
  })

  it('should validate email is required', () => {
    render(<ExitIntentPopup />)

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    act(() => {
      fireEvent(document, new MouseEvent('mouseleave', { clientY: -1 }))
    })

    const submitButton = screen.getByText(/Start Free 14-Day Trial/i)
    fireEvent.click(submitButton)

    const emailInput = screen.getByPlaceholderText(/Enter your work email/i) as HTMLInputElement
    expect(emailInput.validity.valid).toBe(false)
  })

  it('should show success state after form submission', () => {
    render(<ExitIntentPopup />)

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    act(() => {
      fireEvent(document, new MouseEvent('mouseleave', { clientY: -1 }))
    })

    const emailInput = screen.getByPlaceholderText(/Enter your work email/i)
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })

    const submitButton = screen.getByText(/Start Free 14-Day Trial/i)
    fireEvent.click(submitButton)

    expect(screen.getByText(/Perfect! You're All Set/i)).toBeInTheDocument()
  })

  it('should not show again if already shown in session', () => {
    sessionStorage.setItem('exitIntentShown', 'true')
    render(<ExitIntentPopup />)

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    fireEvent(document, new MouseEvent('mouseleave', { clientY: -1 }))

    expect(screen.queryByText(/Wait! Don't Miss Out/i)).not.toBeInTheDocument()
  })

  it('should set sessionStorage when popup is shown', () => {
    render(<ExitIntentPopup />)

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    act(() => {
      fireEvent(document, new MouseEvent('mouseleave', { clientY: -1 }))
    })

    expect(sessionStorage.getItem('exitIntentShown')).toBe('true')
  })
})
