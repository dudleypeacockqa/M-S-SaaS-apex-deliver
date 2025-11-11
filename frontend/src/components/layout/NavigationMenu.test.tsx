import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { WORKSPACE_NAV_ITEMS } from '../../const'
import { NavigationMenu } from './NavigationMenu'

// Mock Clerk state
let mockUser = { publicMetadata: { role: 'solo' } }

const renderMenu = (initialPath = '/dashboard') =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <NavigationMenu />
    </MemoryRouter>
  )

vi.mock('@clerk/clerk-react', () => ({
  useUser: vi.fn(() => ({ user: mockUser })),
  UserButton: () => <div data-testid="user-button">User Menu</div>,
}))

describe('NavigationMenu Component', () => {
  beforeEach(() => {
    mockUser = { publicMetadata: { role: 'solo' } }
    vi.clearAllMocks()
  })

  it('renders navigation shell with brand and user menu', () => {
    renderMenu()

    expect(screen.getByRole('navigation', { name: /primary navigation/i })).toBeInTheDocument()
    expect(screen.getByText(/ApexDeliver/i)).toBeInTheDocument()
    expect(screen.getByTestId('user-button')).toBeInTheDocument()
  })

  it('shows base workspace links for solo users', () => {
    renderMenu()

    const soloVisible = WORKSPACE_NAV_ITEMS.filter((item) => item.roles.includes('solo')).map(
      (item) => item.label
    )

    soloVisible.forEach((label) => {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    })

    expect(screen.queryByRole('link', { name: /^Admin$/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Master Admin/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Podcast Studio/i })).not.toBeInTheDocument()
  })

  it('exposes podcast studio for growth users but still hides admin links', () => {
    mockUser = { publicMetadata: { role: 'growth' } }
    renderMenu()

    expect(screen.getByRole('link', { name: /Podcast Studio/i })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /^Admin$/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Master Admin/i })).not.toBeInTheDocument()
  })

  it('keeps admin controls hidden for enterprise users', () => {
    mockUser = { publicMetadata: { role: 'enterprise' } }
    renderMenu()

    expect(screen.getByRole('link', { name: /Podcast Studio/i })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /^Admin$/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Master Admin/i })).not.toBeInTheDocument()
  })

  it('renders admin + master admin pills for admin role', () => {
    mockUser = { publicMetadata: { role: 'admin' } }
    renderMenu('/admin')

    expect(screen.getByRole('link', { name: /^Admin$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Master Admin/i })).toBeInTheDocument()
  })

  it('highlights nested deal routes as active', () => {
    mockUser = { publicMetadata: { role: 'growth' } }
    renderMenu('/deals/12345')

    const dealsLink = screen.getByRole('link', { name: /^Deals$/i })
    expect(dealsLink).toHaveAttribute('aria-current', 'page')
  })

  it('points deals link to the canonical route', () => {
    renderMenu()

    const dealsLink = screen.getByRole('link', { name: /^Deals$/i })
    expect(dealsLink).toHaveAttribute('href', expect.stringContaining('/deals'))
  })
})

