/**
 * React Query Hooks for Master Admin Campaigns
 *
 * Provides hooks for campaign management:
 * - List campaigns with filters
 * - Get single campaign
 * - Create, update, delete campaigns
 * - Send campaigns
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '@/services/api/masterAdmin'
import type {
  AdminCampaign,
  AdminCampaignCreate,
  AdminCampaignUpdate,
  AdminCampaignListResponse,
  CampaignFilters,
  CampaignSendRequest,
} from '@/services/api/masterAdmin'

// Query Keys
export const campaignKeys = {
  all: ['master-admin', 'campaigns'] as const,
  lists: () => [...campaignKeys.all, 'list'] as const,
  list: (filters?: CampaignFilters) => [...campaignKeys.lists(), { filters }] as const,
  details: () => [...campaignKeys.all, 'detail'] as const,
  detail: (id: number) => [...campaignKeys.details(), id] as const,
}

/**
 * List campaigns with optional filters
 */
export function useCampaigns(filters?: CampaignFilters) {
  return useQuery({
    queryKey: campaignKeys.list(filters),
    queryFn: () => api.listCampaigns(filters),
  })
}

/**
 * Get single campaign by ID
 */
export function useCampaign(campaignId: number | null) {
  return useQuery({
    queryKey: campaignKeys.detail(campaignId!),
    queryFn: () => api.getCampaign(campaignId!),
    enabled: !!campaignId,
  })
}

/**
 * Create new campaign
 */
export function useCreateCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (campaign: AdminCampaignCreate) => api.createCampaign(campaign),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'dashboard'] })
    },
  })
}

/**
 * Update existing campaign
 */
export function useUpdateCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ campaignId, update }: { campaignId: number; update: AdminCampaignUpdate }) =>
      api.updateCampaign(campaignId, update),
    onSuccess: (_, { campaignId }) => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() })
      queryClient.invalidateQueries({ queryKey: campaignKeys.detail(campaignId) })
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'dashboard'] })
    },
  })
}

/**
 * Delete campaign
 */
export function useDeleteCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (campaignId: number) => api.deleteCampaign(campaignId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'dashboard'] })
    },
  })
}

/**
 * Send campaign to recipients
 */
export function useSendCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ campaignId, request }: { campaignId: number; request: CampaignSendRequest }) =>
      api.sendCampaign(campaignId, request),
    onSuccess: (_, { campaignId }) => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.detail(campaignId) })
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'dashboard'] })
    },
  })
}
