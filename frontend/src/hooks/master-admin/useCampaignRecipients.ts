/**
 * React Query Hooks for Master Admin Campaign Recipients
 *
 * Provides hooks for campaign recipient management:
 * - List recipients for a campaign
 * - Add recipient to campaign
 * - Remove recipient from campaign
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '@/services/api/masterAdmin'
import type {
  AdminCampaignRecipient,
  AdminCampaignRecipientCreate,
  AdminCampaignRecipientListResponse,
  CampaignRecipientFilters,
} from '@/services/api/masterAdmin'
import { campaignKeys } from './useCampaigns'

// Query Keys
export const campaignRecipientKeys = {
  all: ['master-admin', 'campaign-recipients'] as const,
  byCampaign: (campaignId: number) => [...campaignRecipientKeys.all, 'campaign', campaignId] as const,
  list: (filters?: CampaignRecipientFilters) => [...campaignRecipientKeys.all, 'list', { filters }] as const,
}

/**
 * List recipients for a specific campaign
 */
export function useCampaignRecipients(campaignId: number | null, filters?: CampaignRecipientFilters) {
  return useQuery({
    queryKey: campaignRecipientKeys.byCampaign(campaignId!),
    queryFn: () => api.listCampaignRecipients({ ...filters, campaign_id: campaignId! }),
    enabled: !!campaignId,
  })
}

/**
 * List all campaign recipients (with filters)
 */
export function useAllCampaignRecipients(filters?: CampaignRecipientFilters) {
  return useQuery({
    queryKey: campaignRecipientKeys.list(filters),
    queryFn: () => api.listCampaignRecipients(filters),
  })
}

/**
 * Add recipient to campaign
 */
export function useAddCampaignRecipient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (recipient: AdminCampaignRecipientCreate) => api.createCampaignRecipient(recipient),
    onSuccess: (newRecipient) => {
      // Invalidate campaign recipients list
      queryClient.invalidateQueries({
        queryKey: campaignRecipientKeys.byCampaign(newRecipient.campaign_id),
      })
      // Invalidate all recipients list
      queryClient.invalidateQueries({ queryKey: campaignRecipientKeys.all })
      // Invalidate campaign detail (to update stats)
      queryClient.invalidateQueries({ queryKey: campaignKeys.detail(newRecipient.campaign_id) })
    },
  })
}

/**
 * Remove recipient from campaign
 */
export function useRemoveCampaignRecipient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ recipientId, campaignId }: { recipientId: number; campaignId: number }) =>
      api.deleteCampaignRecipient(recipientId),
    onSuccess: (_, { campaignId }) => {
      // Invalidate campaign recipients list
      queryClient.invalidateQueries({ queryKey: campaignRecipientKeys.byCampaign(campaignId) })
      // Invalidate all recipients list
      queryClient.invalidateQueries({ queryKey: campaignRecipientKeys.all })
      // Invalidate campaign detail (to update stats)
      queryClient.invalidateQueries({ queryKey: campaignKeys.detail(campaignId) })
    },
  })
}
