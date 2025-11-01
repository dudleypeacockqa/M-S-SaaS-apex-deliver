/**
 * React Query hooks for Deals
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '@/services/api/masterAdmin'
import type {
  DealFilters,
  AdminDealCreate,
  AdminDealUpdate,
} from '@/services/api/masterAdmin'

// Query Keys
export const dealKeys = {
  all: ['master-admin', 'deals'] as const,
  lists: () => [...dealKeys.all, 'list'] as const,
  list: (filters?: DealFilters) => [...dealKeys.lists(), filters] as const,
}

/**
 * List deals with optional filters
 */
export function useDeals(filters?: DealFilters) {
  return useQuery({
    queryKey: dealKeys.list(filters),
    queryFn: () => api.listDeals(filters),
  })
}

/**
 * Create a new deal
 */
export function useCreateDeal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (deal: AdminDealCreate) => api.createDeal(deal),
    onSuccess: () => {
      // Invalidate deals list to refetch
      queryClient.invalidateQueries({ queryKey: dealKeys.lists() })
      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'dashboard'] })
      // Invalidate prospects (since deals are linked to prospects)
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'prospects'] })
    },
  })
}

/**
 * Update an existing deal
 */
export function useUpdateDeal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ dealId, update }: { dealId: number; update: AdminDealUpdate }) =>
      api.updateDeal(dealId, update),
    onSuccess: () => {
      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: dealKeys.lists() })
      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'dashboard'] })
    },
  })
}

/**
 * Delete a deal
 */
export function useDeleteDeal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dealId: number) => api.deleteDeal(dealId),
    onSuccess: () => {
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: dealKeys.lists() })
      // Invalidate dashboard
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'dashboard'] })
    },
  })
}
