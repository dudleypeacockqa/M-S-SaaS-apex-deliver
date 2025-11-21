import type { ReactNode } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { Navigate, useLocation } from 'react-router-dom'

import { BrandedLoader } from '../common/BrandedLoader'

export type UserRole = 'solo' | 'growth' | 'enterprise' | 'admin' | 'master_admin'

export interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: UserRole | UserRole[]
}

const resolveRole = (role: unknown): UserRole => {
  if (role === 'growth' || role === 'enterprise' || role === 'admin' || role === 'master_admin') {
    return role as UserRole
  }
  return 'solo'
}

const hasRequiredRole = (userRole: UserRole, requirement?: UserRole | UserRole[]): boolean => {
  if (!requirement) {
    return true
  }
  if (Array.isArray(requirement)) {
    return requirement.includes(userRole)
  }
  return userRole === requirement
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isLoaded, isSignedIn } = useAuth()
  const { user } = useUser()
  const location = useLocation()

  if (!isLoaded) {
    return <BrandedLoader />
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />
  }

  const userRole = resolveRole(user?.publicMetadata?.role)

  if (!hasRequiredRole(userRole, requiredRole)) {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{ from: location.pathname, requiredRole }}
      />
    )
  }

  return <>{children}</>
}
