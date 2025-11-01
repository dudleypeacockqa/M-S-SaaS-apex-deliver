/**
 * React Query hooks for Scores & Streaks
 */

import { useQuery } from '@tanstack/react-query'
import * as api from '@/services/api/masterAdmin'

// Query Keys
export const scoreKeys = {
  all: ['master-admin', 'scores'] as const,
  today: () => [...scoreKeys.all, 'today'] as const,
  streak: () => [...scoreKeys.all, 'streak'] as const,
  byDate: (date: string) => [...scoreKeys.all, 'date', date] as const,
  weekly: (weekStart: string) => [...scoreKeys.all, 'week', weekStart] as const,
}

/**
 * Get today's score
 */
export function useTodayScore() {
  return useQuery({
    queryKey: scoreKeys.today(),
    queryFn: api.getTodayScore,
    retry: 1,
    throwOnError: (error: any) => error?.statusCode !== 404,
    // Refetch every 5 minutes to keep score up to date
    refetchInterval: 5 * 60 * 1000,
  })
}

/**
 * Get current streak
 */
export function useCurrentStreak() {
  return useQuery({
    queryKey: scoreKeys.streak(),
    queryFn: api.getCurrentStreak,
    retry: 1,
    throwOnError: (error: any) => error?.statusCode !== 404,
    // Refetch every 5 minutes
    refetchInterval: 5 * 60 * 1000,
  })
}

/**
 * Get score for specific date
 */
export function useScoreByDate(date: string) {
  return useQuery({
    queryKey: scoreKeys.byDate(date),
    queryFn: () => api.getScoreByDate(date),
    enabled: !!date,
    retry: 1,
    throwOnError: (error: any) => error?.statusCode !== 404,
  })
}

/**
 * Get weekly scores (all days in a week)
 */
export function useWeeklyScores(weekStart: string) {
  return useQuery({
    queryKey: scoreKeys.weekly(weekStart),
    queryFn: () => api.getWeeklyScores(weekStart),
    enabled: !!weekStart,
    retry: 1,
  })
}
