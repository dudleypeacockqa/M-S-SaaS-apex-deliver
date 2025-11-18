import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pmiApi, type PMIProject, type PMIProjectCreate } from '../services/pmiApi';

/**
 * Hook to fetch PMI project by ID
 */
export function usePMIProject(projectId: string | null) {
  return useQuery({
    queryKey: ['pmi', 'project', projectId],
    queryFn: () => pmiApi.getProject(projectId!),
    enabled: !!projectId,
  });
}

/**
 * Hook to list PMI projects
 */
export function usePMIProjects(params?: {
  page?: number;
  per_page?: number;
  status?: PMIProject['status'];
  deal_id?: string;
}) {
  return useQuery({
    queryKey: ['pmi', 'projects', params],
    queryFn: () => pmiApi.listProjects(params),
  });
}

/**
 * Hook to create PMI project
 */
export function useCreatePMIProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PMIProjectCreate) => pmiApi.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pmi', 'projects'] });
    },
  });
}

/**
 * Hook to update PMI project
 */
export function useUpdatePMIProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: Partial<PMIProject> }) =>
      pmiApi.updateProject(projectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pmi', 'project', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['pmi', 'projects'] });
    },
  });
}

