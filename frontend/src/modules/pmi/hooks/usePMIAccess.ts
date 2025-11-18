import { useQuery } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-react';
import { entitlementService } from '../../../services/api/entitlements';

/**
 * Hook to check PMI module access
 */
export function usePMIAccess() {
  const { user } = useUser();

  const { data: hasAccess, isLoading } = useQuery({
    queryKey: ['pmi', 'access', user?.id],
    queryFn: async () => {
      if (!user) return false;
      return entitlementService.checkFeatureAccess('pmi_module');
    },
    enabled: !!user,
  });

  return {
    hasAccess: hasAccess ?? false,
    isLoading,
  };
}

