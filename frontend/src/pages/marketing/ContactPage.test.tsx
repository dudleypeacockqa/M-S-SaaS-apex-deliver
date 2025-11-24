import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'

vi.mock('../../services/contactService', () => ({
  submitContactForm: vi.fn(),
}))

import { submitContactForm } from '../../services/contactService'
import { ContactPage } from './ContactPage'

const mockedSubmitContactForm = submitContactForm as unknown as vi.Mock

const renderContact = () => render(<BrowserRouter><ContactPage /></BrowserRouter>)

describe('ContactPage', () => {
  beforeEach(() => {
    document.title = ''
    document.head.innerHTML = ''
    document.body.innerHTML = ''
    mockedSubmitContactForm.mockReset()
    mockedSubmitContactForm.mockResolvedValue({ success: true, message: 'ok', id: 1 })
  })

  it('renders header, contact form, and information sections', () => {
    renderContact()

    expect(document.title).toContain('Contact')
    expect(screen.getByRole('heading', { level: 1, name: /growth journey/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByText(/support@financeflo.ai/i)).toBeInTheDocument()
    expect(screen.getByText(/data protection officer/i)).toBeInTheDocument()
  })

  it('validates required fields before submission', async () => {
    renderContact()
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(screen.getByLabelText(/name/i)).toBeInvalid()
    expect(screen.getByLabelText(/email/i)).toBeInvalid()
    expect(screen.getByLabelText(/message/i)).toBeInvalid()
  })

  it('submits form and shows confirmation message', async () => {
    const { container } = renderContact()
    const user = userEvent.setup({ delay: 5 })

    await user.type(screen.getByLabelText(/name/i), 'Jane Doe')
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com')
    await user.selectOptions(screen.getByLabelText(/subject/i), 'demo')
    await user.type(screen.getByLabelText(/message/i), 'Looking for a demo next week.')

    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(mockedSubmitContactForm).toHaveBeenCalledTimes(1)
    expect(screen.getByText(/message sent/i)).toBeInTheDocument()
    expect(container.querySelector('form')).not.toBeInTheDocument()
  }, 15000)

  it('shows error state when submission fails', async () => {
    mockedSubmitContactForm.mockRejectedValueOnce(new Error('Network error'))

    renderContact()
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/name/i), 'Jane Doe')
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com')
    await user.type(screen.getByLabelText(/message/i), 'This message should fail.')

    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(await screen.findByText(/Failed to send message/i)).toBeInTheDocument()
  })

  it('defines canonical and og:url metadata for the contact domain path', () => {
    renderContact()

    const canonical = document.querySelector('link[rel="canonical"]')
    expect(canonical).not.toBeNull()
    expect(canonical?.getAttribute('href')).toBe('https://financeflo.ai/contact')

    const ogUrlMeta = document.querySelector('meta[property="og:url"]')
    expect(ogUrlMeta).not.toBeNull()
    expect(ogUrlMeta?.getAttribute('content')).toBe('https://financeflo.ai/contact')
  })
})

