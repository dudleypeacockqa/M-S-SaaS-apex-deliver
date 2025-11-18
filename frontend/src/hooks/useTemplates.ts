/**
 * React Query Hooks for Templates
 * 
 * Provides hooks for campaign template management.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '@/services/api/templates'
import type {
  CampaignTemplate,
  CampaignTemplateCreate,
  CampaignTemplateUpdate,
  CampaignTemplateListResponse,
  TemplatePreviewRequest,
  TemplatePreviewResponse,
} from '@/services/api/templates'

// Query Keys
export const templateKeys = {
  all: ['templates'] as const,
  lists: () => [...templateKeys.all, 'list'] as const,
  list: (filters?: { type?: string; is_default?: boolean }) =>
    [...templateKeys.lists(), { filters }] as const,
  details: () => [...templateKeys.all, 'detail'] as const,
  detail: (id: number) => [...templateKeys.details(), id] as const,
}

/**
 * List templates with optional filters
 */
export function useTemplates(filters?: { type?: string; is_default?: boolean }) {
  return useQuery({
    queryKey: templateKeys.list(filters),
    queryFn: () => api.listTemplates(filters),
  })
}

/**
 * Get single template by ID
 */
export function useTemplate(templateId: number | null) {
  return useQuery({
    queryKey: templateKeys.detail(templateId!),
    queryFn: () => api.getTemplate(templateId!),
    enabled: !!templateId,
  })
}

/**
 * Create new template
 */
export function useCreateTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (template: CampaignTemplateCreate) => api.createTemplate(template),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() })
    },
  })
}

/**
 * Update existing template
 */
export function useUpdateTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ templateId, update }: { templateId: number; update: CampaignTemplateUpdate }) =>
      api.updateTemplate(templateId, update),
    onSuccess: (_, { templateId }) => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() })
      queryClient.invalidateQueries({ queryKey: templateKeys.detail(templateId) })
    },
  })
}

/**
 * Delete template
 */
export function useDeleteTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (templateId: number) => api.deleteTemplate(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() })
    },
  })
}

/**
 * Render template preview
 */
export function useRenderTemplatePreview() {
  return useMutation({
    mutationFn: ({ templateId, contactData }: { templateId: number; contactData: Record<string, string> }) =>
      api.renderTemplatePreview(templateId, contactData),
  })
}

