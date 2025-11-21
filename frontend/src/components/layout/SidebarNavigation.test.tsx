import { describe, expect, it, beforeEach, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { render, screen, cleanup } from '@testing-library/react'

import { SidebarNavigation } from './SidebarNavigation'

type MockUser = { publicMetadata?: Record<string, unknown> } | null

let mockUser: MockUser = { publicMetadata: { role: 'admin' } }

vi.mock('@clerk/clerk-react', () => ({
  useUser: () => ({ user: mockUser }),
  UserButton: () => <div data-testid="user-button" />,
}))

describe('SidebarNavigation', () => {
  const renderSidebarNavigation = () =>
    render(
      <MemoryRouter>
        <SidebarNavigation />
      </MemoryRouter>,
    )

  beforeEach(() => {
    cleanup()
    mockUser = { publicMetadata: { role: 'admin' } }
  })

  it('hides master-admin navigation from tenant admins', () => {
    renderSidebarNavigation()
    expect(screen.queryByText(/Master Admin/i)).not.toBeInTheDocument()
  })

  it('shows master-admin navigation for master admins only', () => {
    mockUser = { publicMetadata: { role: 'master_admin' } }
    renderSidebarNavigation()
    expect(screen.getByText(/Master Admin/i)).toBeInTheDocument()
  })
})
