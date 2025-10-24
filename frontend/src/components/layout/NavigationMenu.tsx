import { Link, useLocation } from 'react-router-dom'
import { useUser, UserButton } from '@clerk/clerk-react'

/**
 * NavigationMenu Component
 *
 * Main navigation menu with role-based link visibility.
 * Shows different navigation items based on user role:
 * - Solo: Dashboard, Deals
 * - Growth: Dashboard, Deals, Analytics
 * - Enterprise: All Growth features + API
 * - Admin: All features + Admin Portal
 */
export const NavigationMenu: React.FC = () => {
  const location = useLocation()
  const { user } = useUser()

  // Get user role from Clerk public metadata
  const userRole = (user?.publicMetadata?.role as string) || 'solo'

  const isActive = (path: string) => {
    return location.pathname.startsWith(path)
  }

  const linkStyle = (path: string) => ({
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    textDecoration: 'none',
    color: isActive(path) ? '#667eea' : '#333',
    background: isActive(path) ? '#f3f4f6' : 'transparent',
    fontWeight: isActive(path) ? '600' : '400',
    transition: 'all 0.2s'
  })

  // Determine which links to show based on role
  const showAdminLink = userRole === 'admin'

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem 2rem',
        background: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}
    >
      {/* Logo / Brand */}
      <div style={{ marginRight: 'auto', fontWeight: '700', fontSize: '1.25rem', color: '#667eea' }}>
        ApexDeliver
      </div>

      {/* Navigation Links */}
      <Link to="/dashboard" style={linkStyle('/dashboard')}>
        Dashboard
      </Link>

      <Link to="/deals" style={linkStyle('/deals')}>
        Deals
      </Link>

      {/* Admin link - only visible to admins */}
      {showAdminLink && (
        <Link to="/admin" style={linkStyle('/admin')}>
          Admin
        </Link>
      )}

      {/* User button from Clerk */}
      <UserButton afterSignOutUrl="/" />
    </nav>
  )
}
