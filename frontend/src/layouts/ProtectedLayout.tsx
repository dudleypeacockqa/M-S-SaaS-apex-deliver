import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'

import type { ProtectedRouteProps } from '../components/auth/ProtectedRoute'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'
import { SidebarNavigation } from '../components/layout/SidebarNavigation'
import { AppHeader } from '../components/layout/AppHeader'
import { useSidebar } from '../hooks/useSidebar'

interface ProtectedLayoutProps extends Pick<ProtectedRouteProps, 'requiredRole'> {
  children?: ReactNode
}

export const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ requiredRole, children }) => {
  const { isCollapsed } = useSidebar()

  return (
    <ProtectedRoute requiredRole={requiredRole}>
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-white">
        <SidebarNavigation />
        <div className={`tabular-nums transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:pl-16' : 'lg:pl-64'}`}>
          <AppHeader />
          <main className="min-h-[calc(100vh-4rem)] bg-slate-50/30">
            <section aria-label="Protected workspace" className="p-6 lg:p-8">
              <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl tabular-nums">
                {children ?? <Outlet />}
              </div>
            </section>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export const PublicLayout: React.FC = () => (
  <div style={{ minHeight: '100vh', background: 'white', color: '#0f172a' }}>
    <Outlet />
  </div>
)
