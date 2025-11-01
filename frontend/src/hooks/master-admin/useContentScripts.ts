/**
 * React Query Hooks for Master Admin Content Scripts
 *
 * Provides hooks for content script management:
 * - List content scripts with filters
 * - Get single content script
 * - Create, update, delete content scripts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '@/services/api/masterAdmin'
import type {
  AdminContentScript,
  AdminContentScriptCreate,
  AdminContentScriptUpdate,
  AdminContentScriptListResponse,
  ContentScriptFilters,
} from '@/services/api/masterAdmin'

// Query Keys
export const contentScriptKeys = {
  all: ['master-admin', 'content-scripts'] as const,
  lists: () => [...contentScriptKeys.all, 'list'] as const,
  list: (filters?: ContentScriptFilters) => [...contentScriptKeys.lists(), { filters }] as const,
  details: () => [...contentScriptKeys.all, 'detail'] as const,
  detail: (id: number) => [...contentScriptKeys.details(), id] as const,
}

/**
 * List content scripts with optional filters
 */
export function useContentScripts(filters?: ContentScriptFilters) {
  return useQuery({
    queryKey: contentScriptKeys.list(filters),
    queryFn: () => api.listContentScripts(filters),
  })
}

/**
 * Get single content script by ID
 */
export function useContentScript(scriptId: number | null) {
  return useQuery({
    queryKey: contentScriptKeys.detail(scriptId!),
    queryFn: () => api.getContentScript(scriptId!),
    enabled: !!scriptId,
  })
}

/**
 * Create new content script
 */
export function useCreateContentScript() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (script: AdminContentScriptCreate) => api.createContentScript(script),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentScriptKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'dashboard'] })
    },
  })
}

/**
 * Update existing content script
 */
export function useUpdateContentScript() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ scriptId, update }: { scriptId: number; update: AdminContentScriptUpdate }) =>
      api.updateContentScript(scriptId, update),
    onSuccess: (_, { scriptId }) => {
      queryClient.invalidateQueries({ queryKey: contentScriptKeys.lists() })
      queryClient.invalidateQueries({ queryKey: contentScriptKeys.detail(scriptId) })
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'dashboard'] })
    },
  })
}

/**
 * Delete content script
 */
export function useDeleteContentScript() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (scriptId: number) => api.deleteContentScript(scriptId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentScriptKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'dashboard'] })
    },
  })
}
