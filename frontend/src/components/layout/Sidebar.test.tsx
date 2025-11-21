import { describe, expect, it, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'

import { Sidebar } from './Sidebar'

type MockUser = { publicMetadata?: Record<string, unknown> } | null

let mockUser: MockUser = { publicMetadata: { role: 'admin' } }

vi.mock('@clerk/clerk-react', () => ({
  useUser: () => ({ user: mockUser }),
  UserButton: () => <div data-testid="user-button" />,
}))

describe('Sidebar legacy navigation', () => {
  const renderSidebar = () =>
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    )

  beforeEach(() => {
    cleanup()
    mockUser = { publicMetadata: { role: 'admin' } }
  })

  it('hides master admin links for tenant admins', () => {
    renderSidebar()
    fireEvent.click(screen.getByRole('button', { name: /administration/i }))
    expect(screen.queryByText(/Master Admin/i)).not.toBeInTheDocument()
  })

  it('shows master admin links when role is master_admin', () => {
    mockUser = { publicMetadata: { role: 'master_admin' } }
    renderSidebar()
    fireEvent.click(screen.getByRole('button', { name: /administration/i }))
    expect(screen.getByText(/Master Admin/i)).toBeInTheDocument()
  })
})
