import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pmiApi, type PMIWorkstream, type PMIWorkstreamCreate } from '../services/pmiApi';

/**
 * Hook to fetch workstreams for a project
 */
export function useWorkstreams(projectId: string | null) {
  return useQuery({
    queryKey: ['pmi', 'workstreams', projectId],
    queryFn: () => pmiApi.listWorkstreams(projectId!),
    enabled: !!projectId,
  });
}

/**
 * Hook to create workstream
 */
export function useCreateWorkstream() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: PMIWorkstreamCreate }) =>
      pmiApi.createWorkstream(projectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pmi', 'workstreams', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['pmi', 'dashboard', variables.projectId] });
    },
  });
}

/**
 * Hook to update workstream
 */
export function useUpdateWorkstream() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workstreamId, data }: { workstreamId: string; data: Partial<PMIWorkstream> }) =>
      pmiApi.updateWorkstream(workstreamId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pmi', 'workstreams'] });
      queryClient.invalidateQueries({ queryKey: ['pmi', 'dashboard'] });
    },
  });
}

