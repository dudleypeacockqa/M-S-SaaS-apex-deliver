import { useAuth } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'
import { LoadingSpinner } from '../common/LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
}

/**
 * ProtectedRoute Component
 *
 * Wraps routes that require authentication. Redirects unauthenticated users to sign-in.
 * Optionally enforces role-based access control.
 *
 * @param children - The protected content to render
 * @param requiredRole - Optional role requirement (e.g., 'admin')
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole
}) => {
  const { isSignedIn, isLoaded } = useAuth()

  // Show loading spinner while authentication state is being determined
  if (!isLoaded) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <LoadingSpinner />
      </div>
    )
  }

  // Redirect to home page if user is not signed in
  if (!isSignedIn) {
    return <Navigate to="/" replace />
  }

  // TODO: Implement role-based access control when user role is available
  // For now, allow all authenticated users
  if (requiredRole) {
    // Future implementation:
    // const { user } = useUser()
    // if (user?.publicMetadata?.role !== requiredRole) {
    //   return <Navigate to="/unauthorized" replace />
    // }
  }

  // Render protected content for authenticated users
  return <>{children}</>
}
