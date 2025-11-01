/**
 * React Query hooks for Activities
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '@/services/api/masterAdmin'
import type {
  ActivityFilters,
  AdminActivityCreate,
  AdminActivityUpdate
} from '@/services/api/masterAdmin'

// Query Keys
export const activityKeys = {
  all: ['master-admin', 'activities'] as const,
  lists: () => [...activityKeys.all, 'list'] as const,
  list: (filters?: ActivityFilters) => [...activityKeys.lists(), filters] as const,
  detail: (id: number) => [...activityKeys.all, 'detail', id] as const,
}

/**
 * List activities with optional filters
 */
export function useActivities(filters?: ActivityFilters) {
  return useQuery({
    queryKey: activityKeys.list(filters),
    queryFn: () => api.listActivities(filters),
  })
}

/**
 * Get single activity by ID
 */
export function useActivity(activityId: number) {
  return useQuery({
    queryKey: activityKeys.detail(activityId),
    queryFn: () => api.getActivity(activityId),
    enabled: !!activityId,
  })
}

/**
 * Create a new activity
 */
export function useCreateActivity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (activity: AdminActivityCreate) => api.createActivity(activity),
    onSuccess: () => {
      // Invalidate activities list to refetch
      queryClient.invalidateQueries({ queryKey: activityKeys.lists() })
      // Invalidate scores to update score/streak
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'scores'] })
      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'dashboard'] })
    },
  })
}

/**
 * Update an existing activity
 */
export function useUpdateActivity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ activityId, update }: { activityId: number; update: AdminActivityUpdate }) =>
      api.updateActivity(activityId, update),
    onSuccess: (data) => {
      // Update the specific activity in cache
      queryClient.setQueryData(activityKeys.detail(data.id), data)
      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: activityKeys.lists() })
      // Invalidate scores
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'scores'] })
    },
  })
}

/**
 * Delete an activity
 */
export function useDeleteActivity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (activityId: number) => api.deleteActivity(activityId),
    onSuccess: (_, activityId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: activityKeys.detail(activityId) })
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: activityKeys.lists() })
      // Invalidate scores
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'scores'] })
      // Invalidate dashboard
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'dashboard'] })
    },
  })
}
