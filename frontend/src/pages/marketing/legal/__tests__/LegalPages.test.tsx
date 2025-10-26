import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import { TermsOfService } from '../TermsOfService'
import { PrivacyPolicy } from '../PrivacyPolicy'
import { CookiePolicy } from '../CookiePolicy'

const renderWithRouter = (component: React.ReactElement) => render(<BrowserRouter>{component}</BrowserRouter>)

describe('Legal Pages', () => {
  beforeEach(() => {
    document.title = ''
  })

  it('renders Terms of Service with last updated date and sections', () => {
    renderWithRouter(<TermsOfService />)

    expect(screen.getByRole('heading', { level: 1, name: /terms of service/i })).toBeInTheDocument()
    const lastUpdated = screen.getAllByText(/last updated/i)
    expect(lastUpdated[0]).toHaveTextContent(/2025-10-25/i)
    expect(screen.getByRole('heading', { level: 2, name: /acceptance of terms/i })).toBeInTheDocument()
    const tosSupportContacts = screen.getAllByText(/support@apexdeliver.com/i)
    expect(tosSupportContacts.length).toBeGreaterThan(0)
  })

  it('renders Privacy Policy with GDPR notice and DPO contact', () => {
    renderWithRouter(<PrivacyPolicy />)

    expect(screen.getByRole('heading', { level: 1, name: /privacy policy/i })).toBeInTheDocument()
    expect(screen.getByText(/gdpr compliant/i)).toBeInTheDocument()
    const privacyContacts = screen.getAllByText(/privacy@apexdeliver.com/i)
    expect(privacyContacts.length).toBeGreaterThan(0)
    expect(screen.getByRole('heading', { level: 2, name: /data controller/i })).toBeInTheDocument()
  })

  it('renders Cookie Policy with control information', () => {
    renderWithRouter(<CookiePolicy />)

    expect(screen.getByRole('heading', { level: 1, name: /cookie policy/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /types of cookies we use/i })).toBeInTheDocument()
    expect(screen.getByText(/privacy@apexdeliver.com/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: /cookie banner/i })).toBeInTheDocument()
  })
})

