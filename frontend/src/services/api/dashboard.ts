/**
 * Dashboard API Client
 *
 * Provides functions for calling tenant dashboard endpoints.
 * All endpoints are tenant-scoped.
 */

import { apiClient } from './client'

/**
 * Dashboard Summary Types
 */
export interface DashboardSummary {
  deals: {
    total: number
    active: number
    this_month: number
    pipeline_value: number
  }
  activity: {
    deals_created_this_week: number
    documents_uploaded_this_week: number
    tasks_due_this_week: number
  }
  quick_stats: {
    avg_deal_size: number
    conversion_rate: number
    active_users: number
  }
}

export interface ActivityItem {
  id: string
  type: 'deal_created' | 'deal_updated' | 'document_uploaded' | 'task_completed'
  description: string
  timestamp: string
  user?: {
    name: string
    email: string
  }
}

export interface RecentActivity {
  items: ActivityItem[]
  total: number
}

export interface Task {
  id: string
  title: string
  due_date: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in_progress' | 'completed'
}

export interface UpcomingTasks {
  items: Task[]
  total: number
}

export interface FinancialInsights {
  total_deal_value: number
  avg_deal_size: number
  deals_with_financials: number
  insights: string[]
}

/**
 * Dashboard API Functions
 */
export async function getDashboardSummary(): Promise<DashboardSummary> {
  return apiClient.get<DashboardSummary>('/api/dashboard/summary')
}

export async function getRecentActivity(limit?: number): Promise<RecentActivity> {
  const params = limit ? `?limit=${limit}` : ''
  return apiClient.get<RecentActivity>(`/api/dashboard/recent-activity${params}`)
}

export async function getUpcomingTasks(): Promise<UpcomingTasks> {
  return apiClient.get<UpcomingTasks>('/api/dashboard/tasks')
}

export async function getFinancialInsights(): Promise<FinancialInsights> {
  return apiClient.get<FinancialInsights>('/api/dashboard/financial-insights')
}
