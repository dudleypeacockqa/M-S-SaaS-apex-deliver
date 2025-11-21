import { useQuery } from '@tanstack/react-query';
import { pmiApi, type PMIDashboard } from '../services/pmiApi';

/**
 * Hook to fetch PMI dashboard data
 */
export function usePMIDashboard(projectId: string | null) {
  return useQuery({
    queryKey: ['pmi', 'dashboard', projectId],
    queryFn: () => pmiApi.getDashboard(projectId!),
    enabled: !!projectId,
  });
}

