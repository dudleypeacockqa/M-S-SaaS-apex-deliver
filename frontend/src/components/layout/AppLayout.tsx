import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'

import { NavigationMenu } from './NavigationMenu'
import { Breadcrumbs } from './Breadcrumbs'

export interface AppLayoutProps {
  children?: ReactNode
}

/**
 * AppLayout - Main layout wrapper for protected pages
 *
 * Provides consistent layout structure with:
 * - NavigationMenu (sticky header with role-based links)
 * - Breadcrumbs (contextual navigation path)
 * - Main content area (from children or Outlet for nested routes)
 */
export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavigationMenu />
      <Breadcrumbs />

      <section
        aria-label="Application content"
        style={{
          flexGrow: 1,
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          padding: '2rem 1.5rem',
        }}
      >
        {children || <Outlet />}
      </section>
    </div>
  )
}
