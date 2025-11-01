/**
 * React Query hooks for Nudges
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '@/services/api/masterAdmin'
import type { AdminNudgeCreate } from '@/services/api/masterAdmin'

// Query Keys
export const nudgeKeys = {
  all: ['master-admin', 'nudges'] as const,
  unread: () => [...nudgeKeys.all, 'unread'] as const,
}

/**
 * Get unread nudges
 */
export function useUnreadNudges() {
  return useQuery({
    queryKey: nudgeKeys.unread(),
    queryFn: api.getUnreadNudges,
    // Refetch every 2 minutes to show new nudges
    refetchInterval: 2 * 60 * 1000,
  })
}

/**
 * Create a new nudge
 */
export function useCreateNudge() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (nudge: AdminNudgeCreate) => api.createNudge(nudge),
    onSuccess: () => {
      // Invalidate unread nudges to refetch
      queryClient.invalidateQueries({ queryKey: nudgeKeys.unread() })
      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'dashboard'] })
    },
  })
}

/**
 * Mark nudge as read
 */
export function useMarkNudgeAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (nudgeId: number) => api.markNudgeAsRead(nudgeId),
    onSuccess: () => {
      // Invalidate unread nudges
      queryClient.invalidateQueries({ queryKey: nudgeKeys.unread() })
      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'dashboard'] })
    },
  })
}
