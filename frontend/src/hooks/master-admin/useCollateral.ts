/**
 * React Query Hooks for Master Admin Sales Collateral
 *
 * Provides hooks for sales collateral management:
 * - List collateral items with filters
 * - Get single collateral item
 * - Create, update, delete collateral
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '@/services/api/masterAdmin'
import type {
  AdminCollateral,
  AdminCollateralCreate,
  AdminCollateralUpdate,
  AdminCollateralListResponse,
  CollateralFilters,
} from '@/services/api/masterAdmin'

// Query Keys
export const collateralKeys = {
  all: ['master-admin', 'collateral'] as const,
  lists: () => [...collateralKeys.all, 'list'] as const,
  list: (filters?: CollateralFilters) => [...collateralKeys.lists(), { filters }] as const,
  details: () => [...collateralKeys.all, 'detail'] as const,
  detail: (id: number) => [...collateralKeys.details(), id] as const,
}

/**
 * List collateral items with optional filters
 */
export function useCollateral(filters?: CollateralFilters) {
  return useQuery({
    queryKey: collateralKeys.list(filters),
    queryFn: () => api.listCollateral(filters),
  })
}

/**
 * Get single collateral item by ID
 */
export function useCollateralItem(collateralId: number | null) {
  return useQuery({
    queryKey: collateralKeys.detail(collateralId!),
    queryFn: () => api.getCollateral(collateralId!),
    enabled: !!collateralId,
  })
}

/**
 * Create new collateral item
 */
export function useCreateCollateral() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (collateral: AdminCollateralCreate) => api.createCollateral(collateral),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collateralKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'dashboard'] })
    },
  })
}

/**
 * Update existing collateral item
 */
export function useUpdateCollateral() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ collateralId, update }: { collateralId: number; update: AdminCollateralUpdate }) =>
      api.updateCollateral(collateralId, update),
    onSuccess: (_, { collateralId }) => {
      queryClient.invalidateQueries({ queryKey: collateralKeys.lists() })
      queryClient.invalidateQueries({ queryKey: collateralKeys.detail(collateralId) })
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'dashboard'] })
    },
  })
}

/**
 * Delete collateral item
 */
export function useDeleteCollateral() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (collateralId: number) => api.deleteCollateral(collateralId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collateralKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'dashboard'] })
    },
  })
}
