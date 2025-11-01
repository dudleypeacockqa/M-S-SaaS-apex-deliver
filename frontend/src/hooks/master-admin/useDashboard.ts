/**
 * React Query hooks for Master Admin Dashboard
 */

import { useQuery } from '@tanstack/react-query'
import * as api from '@/services/api/masterAdmin'

// Query Keys
export const dashboardKeys = {
  all: ['master-admin', 'dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
}

/**
 * Get dashboard stats (score, streak, activities, prospects, deals, nudges)
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: api.getDashboardStats,
    // Refetch every 5 minutes to keep dashboard fresh
    refetchInterval: 5 * 60 * 1000,
  })
}
