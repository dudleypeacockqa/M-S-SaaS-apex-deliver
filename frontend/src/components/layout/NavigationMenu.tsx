import { NavLink } from 'react-router-dom'
import { useUser, UserButton } from '@clerk/clerk-react'

import type { UserRole } from '../auth/ProtectedRoute'

const linkPalette = {
  default: '#0f172a',
  muted: '#64748b',
  highlight: '#4f46e5',
}

interface NavigationItem {
  to: string
  label: string
  roles: UserRole[]
  exact?: boolean
}

const navigationItems: NavigationItem[] = [
  {
    to: '/dashboard/overview',
    label: 'Dashboard',
    roles: ['solo', 'growth', 'enterprise', 'admin'],
  },
  {
    to: '/deals/pipeline',
    label: 'Deals',
    roles: ['solo', 'growth', 'enterprise', 'admin'],
  },
  {
    to: '/podcast-studio',
    label: 'Podcast Studio',
    roles: ['growth', 'enterprise', 'admin'],
  },
  {
    to: '/admin/dashboard',
    label: 'Admin',
    roles: ['admin'],
  },
]

const resolveRole = (role: unknown): UserRole => {
  if (role === 'growth' || role === 'enterprise' || role === 'admin') {
    return role
  }
  return 'solo'
}

export const NavigationMenu: React.FC = () => {
  const { user } = useUser()
  const role = resolveRole(user?.publicMetadata?.role)

  const visibleLinks = navigationItems.filter((item) => item.roles.includes(role))

  return (
    <nav
      aria-label="Primary navigation"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <div
        style={{
          margin: '0 auto',
          maxWidth: '1200px',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
        }}
      >
        <span style={{ fontWeight: 700, fontSize: '1.25rem', color: linkPalette.highlight }}>
          ApexDeliver
        </span>

        <div style={{ display: 'flex', gap: '0.75rem', flexGrow: 1 }}>
          {visibleLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              style={({ isActive }) => ({
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.9rem',
                borderRadius: '9999px',
                textDecoration: 'none',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? linkPalette.highlight : linkPalette.muted,
                background: isActive ? 'rgba(79, 70, 229, 0.12)' : 'transparent',
                transition: 'color 0.2s ease',
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <UserButton data-testid="user-button" />
      </div>
    </nav>
  )
}

