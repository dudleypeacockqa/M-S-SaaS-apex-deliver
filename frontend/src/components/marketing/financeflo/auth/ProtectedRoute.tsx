import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
  requireTenant?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole,
  requireTenant = true 
}: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { currentTenant, loading: tenantLoading } = useTenant();
  const location = useLocation();

  // Show loading while checking authentication
  if (authLoading || (user && tenantLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Redirect to tenant setup if no tenant and required
  if (requireTenant && !currentTenant) {
    return <Navigate to="/app/setup" replace />;
  }

  // Check role permissions if required
  if (requiredRole && currentTenant) {
    // This would need to be implemented based on your role checking logic
    // For now, we'll allow access
  }

  return <>{children}</>;
};