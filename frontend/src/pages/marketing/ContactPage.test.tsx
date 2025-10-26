import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'

import { ContactPage } from './ContactPage'

const renderContact = () => render(<BrowserRouter><ContactPage /></BrowserRouter>)

describe('ContactPage', () => {
  beforeEach(() => {
    document.title = ''
  })

  it('renders header, contact form, and information sections', () => {
    renderContact()

    expect(document.title).toContain('Contact Us')
    expect(screen.getByRole('heading', { level: 1, name: /get in touch/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByText(/support@apexdeliver.com/i)).toBeInTheDocument()
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

    expect(screen.getByText(/message sent/i)).toBeInTheDocument()
    expect(container.querySelector('form')).not.toBeInTheDocument()
  }, 15000)
})

