import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('../../services/newsletterService', () => ({
  subscribeToNewsletter: vi.fn(),
}))

vi.mock('../../lib/analytics', () => ({
  trackCtaClick: vi.fn(),
}))

import { subscribeToNewsletter } from '../../services/newsletterService'
import { trackCtaClick } from '../../lib/analytics'
import { OptInPopup } from './OptInPopup'

const mockedSubscribe = subscribeToNewsletter as unknown as vi.Mock
const mockedTrackCtaClick = trackCtaClick as unknown as vi.Mock

const renderPopup = () => render(<OptInPopup />)

describe('OptInPopup', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockedSubscribe.mockReset()
    mockedTrackCtaClick.mockReset()
    localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('becomes visible after the delay and submits successfully', async () => {
    mockedSubscribe.mockResolvedValueOnce({ success: true, message: 'ok' })

    renderPopup()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(90000)
    })

    expect(await screen.findByPlaceholderText(/enter your email/i)).toBeInTheDocument()

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    await user.type(screen.getByPlaceholderText(/enter your email/i), 'deal@example.com')
    await user.click(screen.getByRole('button', { name: /get free insights/i }))

    await waitFor(() => {
      expect(mockedSubscribe).toHaveBeenCalledWith({ email: 'deal@example.com', source: 'popup' })
    })
    expect(await screen.findByText(/you're all set/i)).toBeInTheDocument()
    expect(mockedTrackCtaClick).toHaveBeenCalledWith('email-optin', 'popup')
  })

  it('shows an error message when subscription fails', async () => {
    mockedSubscribe.mockRejectedValueOnce(new Error('network'))

    renderPopup()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(90000)
    })

    expect(await screen.findByPlaceholderText(/enter your email/i)).toBeInTheDocument()

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    await user.type(screen.getByPlaceholderText(/enter your email/i), 'deal@example.com')
    await user.click(screen.getByRole('button', { name: /get free insights/i }))

    await waitFor(() => {
      expect(screen.getByText(/failed to subscribe/i)).toBeInTheDocument()
    })
    expect(mockedTrackCtaClick).not.toHaveBeenCalled()
  })
})
