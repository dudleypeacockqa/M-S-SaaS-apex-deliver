/**
 * React Query hooks for Prospects
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '@/services/api/masterAdmin'
import type {
  ProspectFilters,
  AdminProspectCreate,
  AdminProspectUpdate,
} from '@/services/api/masterAdmin'

// Query Keys
export const prospectKeys = {
  all: ['master-admin', 'prospects'] as const,
  lists: () => [...prospectKeys.all, 'list'] as const,
  list: (filters?: ProspectFilters) => [...prospectKeys.lists(), filters] as const,
  detail: (id: number) => [...prospectKeys.all, 'detail', id] as const,
}

/**
 * List prospects with optional filters
 */
export function useProspects(filters?: ProspectFilters) {
  return useQuery({
    queryKey: prospectKeys.list(filters),
    queryFn: () => api.listProspects(filters),
  })
}

/**
 * Get single prospect by ID
 */
export function useProspect(prospectId: number) {
  return useQuery({
    queryKey: prospectKeys.detail(prospectId),
    queryFn: () => api.getProspect(prospectId),
    enabled: !!prospectId,
  })
}

/**
 * Create a new prospect
 */
export function useCreateProspect() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (prospect: AdminProspectCreate) => api.createProspect(prospect),
    onSuccess: () => {
      // Invalidate prospects list to refetch
      queryClient.invalidateQueries({ queryKey: prospectKeys.lists() })
      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'dashboard'] })
    },
  })
}

/**
 * Update an existing prospect
 */
export function useUpdateProspect() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ prospectId, update }: { prospectId: number; update: AdminProspectUpdate }) =>
      api.updateProspect(prospectId, update),
    onSuccess: (data) => {
      // Update the specific prospect in cache
      queryClient.setQueryData(prospectKeys.detail(data.id), data)
      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: prospectKeys.lists() })
      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'dashboard'] })
    },
  })
}

/**
 * Delete a prospect
 */
export function useDeleteProspect() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (prospectId: number) => api.deleteProspect(prospectId),
    onSuccess: (_, prospectId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: prospectKeys.detail(prospectId) })
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: prospectKeys.lists() })
      // Invalidate dashboard
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'dashboard'] })
    },
  })
}
