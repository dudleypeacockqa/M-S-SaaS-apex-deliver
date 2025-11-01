/**
 * React Query Hooks for Master Admin Lead Captures
 *
 * Provides hooks for lead capture management:
 * - List lead captures with filters
 * - Get single lead capture
 * - Create, update, delete lead captures
 * - Sync with GoHighLevel
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '@/services/api/masterAdmin'
import type {
  AdminLeadCapture,
  AdminLeadCaptureCreate,
  AdminLeadCaptureUpdate,
  AdminLeadCaptureListResponse,
  LeadCaptureFilters,
} from '@/services/api/masterAdmin'

// Query Keys
export const leadCaptureKeys = {
  all: ['master-admin', 'lead-captures'] as const,
  lists: () => [...leadCaptureKeys.all, 'list'] as const,
  list: (filters?: LeadCaptureFilters) => [...leadCaptureKeys.lists(), { filters }] as const,
  details: () => [...leadCaptureKeys.all, 'detail'] as const,
  detail: (id: number) => [...leadCaptureKeys.details(), id] as const,
}

/**
 * List lead captures with optional filters
 */
export function useLeadCaptures(filters?: LeadCaptureFilters) {
  return useQuery({
    queryKey: leadCaptureKeys.list(filters),
    queryFn: () => api.listLeadCaptures(filters),
  })
}

/**
 * Get single lead capture by ID
 */
export function useLeadCapture(captureId: number | null) {
  return useQuery({
    queryKey: leadCaptureKeys.detail(captureId!),
    queryFn: () => api.getLeadCapture(captureId!),
    enabled: !!captureId,
  })
}

/**
 * Create new lead capture
 */
export function useCreateLeadCapture() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (capture: AdminLeadCaptureCreate) => api.createLeadCapture(capture),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadCaptureKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'dashboard'] })
    },
  })
}

/**
 * Update existing lead capture
 */
export function useUpdateLeadCapture() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ captureId, update }: { captureId: number; update: AdminLeadCaptureUpdate }) =>
      api.updateLeadCapture(captureId, update),
    onSuccess: (_, { captureId }) => {
      queryClient.invalidateQueries({ queryKey: leadCaptureKeys.lists() })
      queryClient.invalidateQueries({ queryKey: leadCaptureKeys.detail(captureId) })
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'dashboard'] })
    },
  })
}

/**
 * Delete lead capture
 */
export function useDeleteLeadCapture() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (captureId: number) => api.deleteLeadCapture(captureId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadCaptureKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'dashboard'] })
    },
  })
}
