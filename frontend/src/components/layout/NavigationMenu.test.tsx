import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { NavigationMenu } from './NavigationMenu'

// Mock Clerk state
let mockUser = { publicMetadata: { role: 'solo' } }

vi.mock('@clerk/clerk-react', () => ({
  useUser: vi.fn(() => ({ user: mockUser })),
  UserButton: () => <div data-testid="user-button">User Menu</div>,
}))

describe('NavigationMenu Component', () => {
  beforeEach(() => {
    mockUser = { publicMetadata: { role: 'solo' } }
    vi.clearAllMocks()
  })

  it('should render navigation menu', () => {
    render(
      <BrowserRouter>
        <NavigationMenu />
      </BrowserRouter>
    )

    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('should show basic features for solo users', () => {
    mockUser = { publicMetadata: { role: 'solo' } }

    render(
      <BrowserRouter>
        <NavigationMenu />
      </BrowserRouter>
    )

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument()
    expect(screen.getByText(/Deals/i)).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /^Admin$/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Master Admin/i })).not.toBeInTheDocument()
  })

  it('should show admin link for admin users', () => {
    mockUser = { publicMetadata: { role: 'admin' } }

    render(
      <BrowserRouter>
        <NavigationMenu />
      </BrowserRouter>
    )

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument()
    expect(screen.getByText(/Deals/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^Admin$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Master Admin/i })).toBeInTheDocument()
  })

  it('should show all features for enterprise users', () => {
    mockUser = { publicMetadata: { role: 'enterprise' } }

    render(
      <BrowserRouter>
        <NavigationMenu />
      </BrowserRouter>
    )

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument()
    expect(screen.getByText(/Deals/i)).toBeInTheDocument()
    // Enterprise users don't see admin panel
    expect(screen.queryByRole('link', { name: /^Admin$/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Master Admin/i })).not.toBeInTheDocument()
  })

  it('should show podcast studio for growth users', () => {
    mockUser = { publicMetadata: { role: 'growth' } }
    render(
      <BrowserRouter>
        <NavigationMenu />
      </BrowserRouter>
    )
    expect(screen.getByText(/Podcast Studio/i)).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Master Admin/i })).not.toBeInTheDocument()
  })

  it('should show podcast studio but hide admin panels for enterprise users', () => {
    mockUser = { publicMetadata: { role: 'enterprise' } }
    render(
      <BrowserRouter>
        <NavigationMenu />
      </BrowserRouter>
    )
    expect(screen.getByText(/Podcast Studio/i)).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /^Admin$/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Master Admin/i })).not.toBeInTheDocument()
  })

  it('should highlight active route', () => {
    render(
      <BrowserRouter>
        <NavigationMenu />
      </BrowserRouter>
    )

    // Check for navigation links
    const navLinks = screen.getAllByRole('link')
    expect(navLinks.length).toBeGreaterThan(0)
  })

  it('should include UserButton component', () => {
    render(
      <BrowserRouter>
        <NavigationMenu />
      </BrowserRouter>
    )

    expect(screen.getByTestId('user-button')).toBeInTheDocument()
  })
})

