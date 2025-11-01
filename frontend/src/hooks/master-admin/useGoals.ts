/**
 * React Query hooks for Goals
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '@/services/api/masterAdmin'
import type { AdminGoalCreate, AdminGoalUpdate } from '@/services/api/masterAdmin'

// Query Keys
export const goalKeys = {
  all: ['master-admin', 'goals'] as const,
  current: () => [...goalKeys.all, 'current'] as const,
  byWeek: (weekStart: string) => [...goalKeys.all, 'week', weekStart] as const,
}

/**
 * Get current week's goal
 */
export function useCurrentGoal() {
  return useQuery({
    queryKey: goalKeys.current(),
    queryFn: api.getCurrentGoal,
    retry: 1, // Don't retry too many times if no goal exists
    // Don't throw error if no goal exists (404)
    throwOnError: (error: any) => error?.statusCode !== 404,
  })
}

/**
 * Get goal by week start date
 */
export function useGoalByWeek(weekStart: string) {
  return useQuery({
    queryKey: goalKeys.byWeek(weekStart),
    queryFn: () => api.getGoalByWeek(weekStart),
    enabled: !!weekStart,
    retry: 1,
    throwOnError: (error: any) => error?.statusCode !== 404,
  })
}

/**
 * Create a new goal
 */
export function useCreateGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (goal: AdminGoalCreate) => api.createGoal(goal),
    onSuccess: (data) => {
      // Update current goal cache
      queryClient.setQueryData(goalKeys.current(), data)
      // Update week-specific cache
      queryClient.setQueryData(goalKeys.byWeek(data.week_start), data)
      // Invalidate all goals
      queryClient.invalidateQueries({ queryKey: goalKeys.all })
    },
  })
}

/**
 * Update an existing goal
 */
export function useUpdateGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ goalId, update }: { goalId: number; update: AdminGoalUpdate }) =>
      api.updateGoal(goalId, update),
    onSuccess: (data) => {
      // Update current goal cache
      queryClient.setQueryData(goalKeys.current(), data)
      // Update week-specific cache
      queryClient.setQueryData(goalKeys.byWeek(data.week_start), data)
      // Invalidate all goals
      queryClient.invalidateQueries({ queryKey: goalKeys.all })
    },
  })
}
