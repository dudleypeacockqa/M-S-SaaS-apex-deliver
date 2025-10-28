import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ExitIntentPopup } from './ExitIntentPopup'

describe('ExitIntentPopup', () => {
  beforeEach(() => {
    // Clear sessionStorage before each test
    sessionStorage.clear()
    vi.clearAllMocks()
  })

  it('should not render initially', () => {
    render(<ExitIntentPopup />)
    expect(screen.queryByText(/Wait! Don't Miss Out/i)).not.toBeInTheDocument()
  })

  it('should render when mouse leaves viewport', async () => {
    render(<ExitIntentPopup />)

    // Wait for the 2-second delay
    await waitFor(() => {
      fireEvent(document, new MouseEvent('mouseleave', { clientY: -1 }))
    }, { timeout: 3000 })

    await waitFor(() => {
      expect(screen.getByText(/Wait! Don't Miss Out/i)).toBeInTheDocument()
    })
  })

  it('should display email form with all elements', async () => {
    render(<ExitIntentPopup />)

    await waitFor(() => {
      fireEvent(document, new MouseEvent('mouseleave', { clientY: -1 }))
    }, { timeout: 3000 })

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter your work email/i)).toBeInTheDocument()
      expect(screen.getByText(/Start Free 14-Day Trial/i)).toBeInTheDocument()
      expect(screen.getByText(/Just Browsing/i)).toBeInTheDocument()
    })
  })

  it('should display 4 key benefits', async () => {
    render(<ExitIntentPopup />)

    await waitFor(() => {
      fireEvent(document, new MouseEvent('mouseleave', { clientY: -1 }))
    }, { timeout: 3000 })

    await waitFor(() => {
      expect(screen.getByText(/70% faster closures/i)).toBeInTheDocument()
      expect(screen.getByText(/AI-powered insights/i)).toBeInTheDocument()
      expect(screen.getByText(/Save £9,721\/year/i)).toBeInTheDocument()
      expect(screen.getByText(/No credit card required/i)).toBeInTheDocument()
    })
  })

  it('should close when clicking Just Browsing button', async () => {
    render(<ExitIntentPopup />)

    await waitFor(() => {
      fireEvent(document, new MouseEvent('mouseleave', { clientY: -1 }))
    }, { timeout: 3000 })

    const browsingButton = await screen.findByText(/Just Browsing/i)
    fireEvent.click(browsingButton)

    await waitFor(() => {
      expect(screen.queryByText(/Wait! Don't Miss Out/i)).not.toBeInTheDocument()
    })
  })

  it('should close when clicking backdrop', async () => {
    render(<ExitIntentPopup />)

    await waitFor(() => {
      fireEvent(document, new MouseEvent('mouseleave', { clientY: -1 }))
    }, { timeout: 3000 })

    const backdrop = await screen.findByText(/Wait! Don't Miss Out/i)
    const backdropDiv = backdrop.closest('.fixed')?.previousSibling as HTMLElement

    if (backdropDiv) {
      fireEvent.click(backdropDiv)
    }

    await waitFor(() => {
      expect(screen.queryByText(/Wait! Don't Miss Out/i)).not.toBeInTheDocument()
    })
  })

  it('should validate email is required', async () => {
    render(<ExitIntentPopup />)

    await waitFor(() => {
      fireEvent(document, new MouseEvent('mouseleave', { clientY: -1 }))
    }, { timeout: 3000 })

    const submitButton = await screen.findByText(/Start Free 14-Day Trial/i)
    fireEvent.click(submitButton)

    const emailInput = screen.getByPlaceholderText(/Enter your work email/i) as HTMLInputElement
    expect(emailInput.validity.valid).toBe(false)
  })

  it('should show success state after form submission', async () => {
    // Mock window.location.href
    delete (window as any).location
    window.location = { href: '' } as any

    render(<ExitIntentPopup />)

    await waitFor(() => {
      fireEvent(document, new MouseEvent('mouseleave', { clientY: -1 }))
    }, { timeout: 3000 })

    const emailInput = await screen.findByPlaceholderText(/Enter your work email/i)
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })

    const submitButton = screen.getByText(/Start Free 14-Day Trial/i)
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/Perfect! You're All Set/i)).toBeInTheDocument()
    })
  })

  it('should not show again if already shown in session', () => {
    sessionStorage.setItem('exitIntentShown', 'true')
    render(<ExitIntentPopup />)

    fireEvent(document, new MouseEvent('mouseleave', { clientY: -1 }))

    expect(screen.queryByText(/Wait! Don't Miss Out/i)).not.toBeInTheDocument()
  })

  it('should set sessionStorage when popup is shown', async () => {
    render(<ExitIntentPopup />)

    await waitFor(() => {
      fireEvent(document, new MouseEvent('mouseleave', { clientY: -1 }))
    }, { timeout: 3000 })

    await waitFor(() => {
      expect(sessionStorage.getItem('exitIntentShown')).toBe('true')
    })
  })
})
