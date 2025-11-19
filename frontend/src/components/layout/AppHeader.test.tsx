import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppHeader } from './AppHeader'

vi.mock('@clerk/clerk-react', () => ({
  UserButton: () => <div data-testid="user-button" />,
}))

vi.mock('./ContextualSubMenu', () => ({
  ContextualSubMenu: () => <div data-testid="contextual-submenu" />,
}))

vi.mock('../common/CommandPalette', () => ({
  CommandPalette: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
    <div>
      {isOpen && (
        <button data-testid="command-palette" onClick={onClose}>
          close
        </button>
      )}
    </div>
  ),
}))

describe('AppHeader', () => {
  const renderHeader = (path: string = '/dashboard') =>
    render(
      <MemoryRouter initialEntries={[path]}>
        <AppHeader />
      </MemoryRouter>
    )

  it('labels the create button based on the current route', () => {
    renderHeader('/deals')
    expect(screen.getByRole('button', { name: /new deal/i })).toBeInTheDocument()

    renderHeader('/documents')
    expect(screen.getByRole('button', { name: /upload document/i })).toBeInTheDocument()
  })

  it('opens the quick create flyout when clicking the create button', () => {
    renderHeader('/deals')
    const button = screen.getByRole('button', { name: /new deal/i })
    fireEvent.click(button)
    expect(screen.getByText(/quick create/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /new task/i })).toBeInTheDocument()
  })

  it('shows notification popover when bell icon is pressed', () => {
    renderHeader('/dashboard')
    const bellButton = screen.getByLabelText(/notifications/i)
    fireEvent.click(bellButton)
    expect(screen.getByText(/deal moved to negotiation/i)).toBeInTheDocument()
    expect(screen.getByText(/fp&a model refreshed/i)).toBeInTheDocument()
  })
})
