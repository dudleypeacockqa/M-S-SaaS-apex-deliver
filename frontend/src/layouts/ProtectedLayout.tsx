import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'

import type { ProtectedRouteProps } from '../components/auth/ProtectedRoute'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'
import { Breadcrumbs } from '../components/layout/Breadcrumbs'
import { NavigationMenu } from '../components/layout/NavigationMenu'

interface ProtectedLayoutProps extends Pick<ProtectedRouteProps, 'requiredRole'> {
  children?: ReactNode
}

export const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ requiredRole, children }) => {
  return (
    <ProtectedRoute requiredRole={requiredRole}>
      <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a' }}>
        <NavigationMenu />
        <Breadcrumbs />
        <section
          aria-label="Protected workspace"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '2rem 1.5rem 3rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
          }}
        >
          {children ?? <Outlet />}
        </section>
      </div>
    </ProtectedRoute>
  )
}

export const PublicLayout: React.FC = () => (
  <div style={{ minHeight: '100vh', background: 'white', color: '#0f172a' }}>
    <Outlet />
  </div>
)
