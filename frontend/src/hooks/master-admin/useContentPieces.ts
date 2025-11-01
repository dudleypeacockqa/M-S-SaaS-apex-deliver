/**
 * React Query Hooks for Master Admin Content Pieces
 *
 * Provides hooks for content piece management:
 * - List content pieces with filters
 * - Get single content piece
 * - Create, update, delete content pieces
 * - Publish content pieces
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '@/services/api/masterAdmin'
import type {
  AdminContentPiece,
  AdminContentPieceCreate,
  AdminContentPieceUpdate,
  AdminContentPieceListResponse,
  ContentPieceFilters,
} from '@/services/api/masterAdmin'

// Query Keys
export const contentPieceKeys = {
  all: ['master-admin', 'content-pieces'] as const,
  lists: () => [...contentPieceKeys.all, 'list'] as const,
  list: (filters?: ContentPieceFilters) => [...contentPieceKeys.lists(), { filters }] as const,
  details: () => [...contentPieceKeys.all, 'detail'] as const,
  detail: (id: number) => [...contentPieceKeys.details(), id] as const,
}

/**
 * List content pieces with optional filters
 */
export function useContentPieces(filters?: ContentPieceFilters) {
  return useQuery({
    queryKey: contentPieceKeys.list(filters),
    queryFn: () => api.listContentPieces(filters),
  })
}

/**
 * Get single content piece by ID
 */
export function useContentPiece(pieceId: number | null) {
  return useQuery({
    queryKey: contentPieceKeys.detail(pieceId!),
    queryFn: () => api.getContentPiece(pieceId!),
    enabled: !!pieceId,
  })
}

/**
 * Create new content piece
 */
export function useCreateContentPiece() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (piece: AdminContentPieceCreate) => api.createContentPiece(piece),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentPieceKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'dashboard'] })
    },
  })
}

/**
 * Update existing content piece
 */
export function useUpdateContentPiece() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ pieceId, update }: { pieceId: number; update: AdminContentPieceUpdate }) =>
      api.updateContentPiece(pieceId, update),
    onSuccess: (_, { pieceId }) => {
      queryClient.invalidateQueries({ queryKey: contentPieceKeys.lists() })
      queryClient.invalidateQueries({ queryKey: contentPieceKeys.detail(pieceId) })
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'dashboard'] })
    },
  })
}

/**
 * Delete content piece
 */
export function useDeleteContentPiece() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (pieceId: number) => api.deleteContentPiece(pieceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentPieceKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'dashboard'] })
    },
  })
}
