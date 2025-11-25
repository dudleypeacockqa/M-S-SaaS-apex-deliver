import { describe, it, beforeEach, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Navigation } from '../Navigation'

const renderNavigation = () =>
  render(
    <BrowserRouter>
      <Navigation />
    </BrowserRouter>,
  )

describe('FinanceFlo Navigation', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 1440,
    })
    fireEvent(window, new Event('resize'))
  })

  it('opens and closes desktop dropdowns on hover', async () => {
    renderNavigation()

    const industriesTrigger = screen.getAllByRole('button', { name: /Industries/i })[0]
    const industriesContainer = industriesTrigger.closest('div')
    fireEvent.mouseEnter(industriesContainer!)

    const constructionLink = await screen.findByRole('menuitem', { name: /Construction/i })
    expect(constructionLink).toBeVisible()

    fireEvent.mouseLeave(industriesContainer!)

    await waitFor(() => {
      expect(screen.queryByRole('menuitem', { name: /Construction/i })).not.toBeInTheDocument()
    })
  })

  it('closes the previously open menu when another dropdown opens', async () => {
    renderNavigation()

    const industriesTrigger = screen.getAllByRole('button', { name: /Industries/i })[0]
    const resourcesTrigger = screen.getAllByRole('button', { name: /Resources/i })[0]
    const industriesContainer = industriesTrigger.closest('div')
    const resourcesContainer = resourcesTrigger.closest('div')

    fireEvent.mouseEnter(industriesContainer!)
    await screen.findByRole('menuitem', { name: /Construction/i })

    fireEvent.mouseEnter(resourcesContainer!)
    const workingCapitalLink = await screen.findByRole('menuitem', { name: /Working Capital Calculator/i })
    expect(workingCapitalLink).toBeVisible()

    expect(screen.queryByRole('menuitem', { name: /Construction/i })).not.toBeInTheDocument()
  })
})

