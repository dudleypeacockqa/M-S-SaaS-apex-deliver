/**
 * React Query hooks for Focus Sessions
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '@/services/api/masterAdmin'
import type { AdminFocusSessionCreate, AdminFocusSessionUpdate } from '@/services/api/masterAdmin'

// Query Keys
export const focusSessionKeys = {
  all: ['master-admin', 'focus-sessions'] as const,
  active: () => [...focusSessionKeys.all, 'active'] as const,
}

/**
 * Get active focus session (if any)
 */
export function useActiveFocusSession() {
  return useQuery({
    queryKey: focusSessionKeys.active(),
    queryFn: api.getActiveFocusSession,
    // Refetch every 30 seconds to track session progress
    refetchInterval: 30 * 1000,
    // Don't throw if no active session
    retry: false,
  })
}

/**
 * Start a new focus session
 */
export function useStartFocusSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (session: AdminFocusSessionCreate) => api.startFocusSession(session),
    onSuccess: (data) => {
      // Set active session cache
      queryClient.setQueryData(focusSessionKeys.active(), data)
      // Invalidate all focus sessions
      queryClient.invalidateQueries({ queryKey: focusSessionKeys.all })
    },
  })
}

/**
 * Complete focus session
 */
export function useCompleteFocusSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ sessionId, update }: { sessionId: number; update: AdminFocusSessionUpdate }) =>
      api.completeFocusSession(sessionId, update),
    onSuccess: () => {
      // Clear active session (now completed)
      queryClient.setQueryData(focusSessionKeys.active(), null)
      // Invalidate all sessions
      queryClient.invalidateQueries({ queryKey: focusSessionKeys.all })
      // Invalidate scores (focus session might affect score)
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'scores'] })
      // Invalidate dashboard
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'dashboard'] })
    },
  })
}
