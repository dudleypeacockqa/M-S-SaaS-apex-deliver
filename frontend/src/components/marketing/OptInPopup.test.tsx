import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
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

const renderPopup = (props: Partial<React.ComponentProps<typeof OptInPopup>> = {}) =>
  render(<OptInPopup delayMs={0} {...props} />)

describe('OptInPopup', () => {
  beforeEach(() => {
    mockedSubscribe.mockReset()
    mockedTrackCtaClick.mockReset()
    localStorage.clear()
  })

  it('becomes visible after the delay and submits successfully', async () => {
    mockedSubscribe.mockResolvedValueOnce({ success: true, message: 'ok' })

    renderPopup()

    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument()

    const user = userEvent.setup()
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

    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument()

    const user = userEvent.setup()
    await user.type(screen.getByPlaceholderText(/enter your email/i), 'deal@example.com')
    await user.click(screen.getByRole('button', { name: /get free insights/i }))

    await waitFor(() => {
      expect(screen.getByText(/failed to subscribe/i)).toBeInTheDocument()
    })
    expect(mockedTrackCtaClick).not.toHaveBeenCalled()
  })
})
