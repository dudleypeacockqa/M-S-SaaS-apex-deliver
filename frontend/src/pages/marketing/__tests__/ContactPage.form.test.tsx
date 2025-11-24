import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import { ContactPage } from '../ContactPage'

const renderPage = () => render(
  <BrowserRouter>
    <ContactPage />
  </BrowserRouter>
)

describe('ContactPage marketing contract', () => {
  it('emits schema metadata using the financeflo.ai domain', () => {
    const { container } = renderPage()

    const schemaNode = container.querySelector('script[type="application/ld+json"]')
    expect(schemaNode).toBeTruthy()

    const parsed = schemaNode && JSON.parse(schemaNode.textContent ?? '{}')
    expect(parsed?.url).toBe('https://financeflo.ai/contact')
  })
})
