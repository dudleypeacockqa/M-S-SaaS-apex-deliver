/**
 * React Query Hooks for Deal Operations
 *
 * Provides hooks for fetching and mutating deal data with automatic caching and invalidation
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import * as dealsApi from '@/services/api/deals'
import type { Deal, DealCreate, DealUpdate, DealListParams, PaginatedDeals, DealStage } from '@/services/api/deals'

/**
 * Query Keys for Deals
 */
export const dealKeys = {
  all: ['deals'] as const,
  lists: () => [...dealKeys.all, 'list'] as const,
  list: (params?: DealListParams) => [...dealKeys.lists(), params] as const,
  details: () => [...dealKeys.all, 'detail'] as const,
  detail: (id: string) => [...dealKeys.details(), id] as const,
}

/**
 * Hook to fetch paginated list of deals
 */
export function useDeals(
  params?: DealListParams,
  options?: Omit<UseQueryOptions<PaginatedDeals, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: dealKeys.list(params),
    queryFn: () => dealsApi.listDeals(params),
    staleTime: 30000, // 30 seconds
    ...options,
  })
}

/**
 * Hook to fetch a single deal by ID
 */
export function useDeal(
  dealId: string,
  options?: Omit<UseQueryOptions<Deal, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: dealKeys.detail(dealId),
    queryFn: () => dealsApi.getDeal(dealId),
    enabled: !!dealId,
    staleTime: 60000, // 1 minute
    ...options,
  })
}

/**
 * Hook to create a new deal
 */
export function useCreateDeal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (deal: DealCreate) => dealsApi.createDeal(deal),
    onSuccess: (newDeal) => {
      // Invalidate lists to refetch with new deal
      queryClient.invalidateQueries({ queryKey: dealKeys.lists() })

      // Optionally set the new deal in cache
      queryClient.setQueryData(dealKeys.detail(newDeal.id), newDeal)
    },
  })
}

/**
 * Hook to update an existing deal
 */
export function useUpdateDeal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ dealId, updates }: { dealId: string; updates: DealUpdate }) =>
      dealsApi.updateDeal(dealId, updates),
    onSuccess: (updatedDeal) => {
      // Update the deal in cache
      queryClient.setQueryData(dealKeys.detail(updatedDeal.id), updatedDeal)

      // Invalidate lists to refetch with updated data
      queryClient.invalidateQueries({ queryKey: dealKeys.lists() })
    },
  })
}

/**
 * Hook to update deal stage (for Kanban drag-drop)
 */
export function useUpdateDealStage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ dealId, stage }: { dealId: string; stage: DealStage }) =>
      dealsApi.updateDealStage(dealId, stage),
    onMutate: async ({ dealId, stage }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: dealKeys.detail(dealId) })

      // Snapshot the previous value
      const previousDeal = queryClient.getQueryData<Deal>(dealKeys.detail(dealId))

      // Optimistically update the deal stage
      if (previousDeal) {
        queryClient.setQueryData<Deal>(dealKeys.detail(dealId), {
          ...previousDeal,
          stage,
          updated_at: new Date().toISOString(),
        })
      }

      // Return context with the previous value
      return { previousDeal }
    },
    onError: (_err, { dealId }, context) => {
      // Rollback on error
      if (context?.previousDeal) {
        queryClient.setQueryData(dealKeys.detail(dealId), context.previousDeal)
      }
    },
    onSettled: (_data, _error, { dealId }) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: dealKeys.detail(dealId) })
      queryClient.invalidateQueries({ queryKey: dealKeys.lists() })
    },
  })
}

/**
 * Hook to archive a deal
 */
export function useArchiveDeal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dealId: string) => dealsApi.archiveDeal(dealId),
    onSuccess: () => {
      // Invalidate all deal queries
      queryClient.invalidateQueries({ queryKey: dealKeys.all })
    },
  })
}

/**
 * Hook to unarchive a deal
 */
export function useUnarchiveDeal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dealId: string) => dealsApi.unarchiveDeal(dealId),
    onSuccess: (unarchivedDeal) => {
      // Update the deal in cache
      queryClient.setQueryData(dealKeys.detail(unarchivedDeal.id), unarchivedDeal)

      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: dealKeys.lists() })
    },
  })
}
