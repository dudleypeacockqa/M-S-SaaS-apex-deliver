/**
 * React Query Hooks for Master Admin Collateral Usage
 *
 * Provides hooks for collateral usage tracking:
 * - List collateral usage events with filters
 * - Create usage event (track download/view)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '@/services/api/masterAdmin'
import type {
  AdminCollateralUsage,
  AdminCollateralUsageCreate,
  AdminCollateralUsageListResponse,
  CollateralUsageFilters,
} from '@/services/api/masterAdmin'
import { collateralKeys } from './useCollateral'

// Query Keys
export const collateralUsageKeys = {
  all: ['master-admin', 'collateral-usage'] as const,
  lists: () => [...collateralUsageKeys.all, 'list'] as const,
  list: (filters?: CollateralUsageFilters) => [...collateralUsageKeys.lists(), { filters }] as const,
  byCollateral: (collateralId: number) => [...collateralUsageKeys.all, 'collateral', collateralId] as const,
}

/**
 * List collateral usage events with optional filters
 */
export function useCollateralUsage(filters?: CollateralUsageFilters) {
  return useQuery({
    queryKey: collateralUsageKeys.list(filters),
    queryFn: () => api.listCollateralUsage(filters),
  })
}

/**
 * Get collateral usage for specific collateral item
 */
export function useCollateralUsageByItem(collateralId: number | null) {
  return useQuery({
    queryKey: collateralUsageKeys.byCollateral(collateralId!),
    queryFn: () => api.listCollateralUsage({ collateral_id: collateralId! }),
    enabled: !!collateralId,
  })
}

/**
 * Track collateral usage (download/view)
 */
export function useTrackCollateralUsage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (usage: AdminCollateralUsageCreate) => api.createCollateralUsage(usage),
    onSuccess: (newUsage) => {
      // Invalidate usage lists
      queryClient.invalidateQueries({ queryKey: collateralUsageKeys.lists() })
      queryClient.invalidateQueries({ queryKey: collateralUsageKeys.byCollateral(newUsage.collateral_id) })
      // Invalidate collateral detail (to update usage count)
      queryClient.invalidateQueries({ queryKey: collateralKeys.detail(newUsage.collateral_id) })
    },
  })
}
