/**
 * React Query Hooks for Campaigns
 * 
 * Provides hooks for campaign management.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '@/services/api/campaigns'
import type {
  Campaign,
  CampaignCreate,
  CampaignUpdate,
  CampaignListResponse,
  CampaignAnalytics,
  CampaignActivityListResponse,
} from '@/services/api/campaigns'

// Query Keys
export const campaignKeys = {
  all: ['campaigns'] as const,
  lists: () => [...campaignKeys.all, 'list'] as const,
  list: (filters?: { page?: number; per_page?: number; status?: string; type?: string }) =>
    [...campaignKeys.lists(), { filters }] as const,
  details: () => [...campaignKeys.all, 'detail'] as const,
  detail: (id: number) => [...campaignKeys.details(), id] as const,
  analytics: (id: number) => [...campaignKeys.detail(id), 'analytics'] as const,
  activities: (id: number, filters?: { page?: number; per_page?: number }) =>
    [...campaignKeys.detail(id), 'activities', { filters }] as const,
}

/**
 * List campaigns with optional filters
 */
export function useCampaigns(filters?: { page?: number; per_page?: number; status?: string; type?: string }) {
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
 * Get campaign analytics
 */
export function useCampaignAnalytics(campaignId: number | null) {
  return useQuery({
    queryKey: campaignKeys.analytics(campaignId!),
    queryFn: () => api.getCampaignAnalytics(campaignId!),
    enabled: !!campaignId,
  })
}

/**
 * Get campaign activities
 */
export function useCampaignActivities(campaignId: number | null, filters?: { page?: number; per_page?: number }) {
  return useQuery({
    queryKey: campaignKeys.activities(campaignId!, filters),
    queryFn: () => api.getCampaignActivities(campaignId!, filters),
    enabled: !!campaignId,
  })
}

/**
 * Create new campaign
 */
export function useCreateCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (campaign: CampaignCreate) => api.createCampaign(campaign),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() })
    },
  })
}

/**
 * Update existing campaign
 */
export function useUpdateCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ campaignId, update }: { campaignId: number; update: CampaignUpdate }) =>
      api.updateCampaign(campaignId, update),
    onSuccess: (_, { campaignId }) => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() })
      queryClient.invalidateQueries({ queryKey: campaignKeys.detail(campaignId) })
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
    },
  })
}

/**
 * Schedule campaign
 */
export function useScheduleCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ campaignId, scheduleAt }: { campaignId: number; scheduleAt: string }) =>
      api.scheduleCampaign(campaignId, scheduleAt),
    onSuccess: (_, { campaignId }) => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.detail(campaignId) })
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() })
    },
  })
}

/**
 * Execute campaign
 */
export function useExecuteCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (campaignId: number) => api.executeCampaign(campaignId),
    onSuccess: (_, campaignId) => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.detail(campaignId) })
      queryClient.invalidateQueries({ queryKey: campaignKeys.analytics(campaignId) })
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() })
    },
  })
}

