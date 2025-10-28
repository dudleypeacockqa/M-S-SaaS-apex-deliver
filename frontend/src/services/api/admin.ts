/**
 * Admin API Client
 *
 * Provides functions for calling admin endpoints.
 * All endpoints require admin role.
 */

import { apiClient } from './client'

/**
 * Dashboard Metrics Types
 */
export interface DashboardMetrics {
  users: {
    total: number;
    active_last_30_days: number;
    new_this_month: number;
  };
  organizations: {
    total: number;
    new_this_month: number;
  };
  revenue: {
    mrr: number;
    arr_projection: number;
  };
  activity: {
    deals_created_this_month: number;
    documents_uploaded_this_month: number;
  };
}

/**
 * User Types
 */
export interface User {
  id: string;
  clerk_user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  organization_id: string | null;
  created_at: string;
  last_active_at: string | null;
  deleted_at: string | null;
}

export interface PaginatedUsers {
  items: User[];
  total: number;
  page: number;
  per_page: number;
}

export interface UserUpdate {
  role?: string;
  first_name?: string;
  last_name?: string;
}

/**
 * Organization Types
 */
export interface Organization {
  id: string;
  name: string;
  subscription_tier: string;
  created_at: string;
  updated_at: string;
  user_count?: number;
}

export interface PaginatedOrganizations {
  items: Organization[];
  total: number;
  page: number;
  per_page: number;
}

export interface OrganizationUsers {
  organization_id: string;
  organization_name: string;
  users: User[];
  total_users: number;
}

export interface OrganizationMetrics {
  organization_id: string;
  organization_name: string;
  user_count: number;
  subscription_tier: string;
  created_at: string;
  deals_count: number;
  documents_count: number;
  active_users_last_30_days: number;
}

/**
 * System Health Types
 */
export interface SystemHealth {
  database: {
    status: string;
    connections: number;
  };
  clerk: {
    status: string;
    configured: boolean;
  };
  api_metrics: {
    avg_response_time_ms: string | number;
    requests_last_hour: string | number;
    error_rate: string | number;
    status: string;
  };
  environment: string;
  debug_mode: boolean;
}

/**
 * Dashboard API Functions
 */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  return apiClient.get<DashboardMetrics>('/api/admin/dashboard')
}

/**
 * User Management API Functions
 */
export async function listUsers(
  page: number = 1,
  perPage: number = 20,
  search?: string
): Promise<PaginatedUsers> {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  })

  if (search) {
    params.append('search', search)
  }

  return apiClient.get<PaginatedUsers>(`/api/admin/users?${params}`)
}

export async function getUserDetails(userId: string): Promise<User> {
  return apiClient.get<User>(`/api/admin/users/${userId}`)
}

export async function updateUser(userId: string, updates: UserUpdate): Promise<User> {
  return apiClient.put<User>(`/api/admin/users/${userId}`, updates)
}

export async function softDeleteUser(userId: string): Promise<{ message: string; user_id: string }> {
  return apiClient.delete<{ message: string; user_id: string }>(`/api/admin/users/${userId}`)
}

export async function restoreUser(userId: string): Promise<User> {
  return apiClient.post<User>(`/api/admin/users/${userId}/restore`)
}

/**
 * Organization Management API Functions
 */
export async function listOrganizations(
  page: number = 1,
  perPage: number = 20
): Promise<PaginatedOrganizations> {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  })

  return apiClient.get<PaginatedOrganizations>(`/api/admin/organizations?${params}`)
}

export async function getOrganizationDetails(orgId: string): Promise<Organization> {
  return apiClient.get<Organization>(`/api/admin/organizations/${orgId}`)
}

export async function getOrganizationUsers(orgId: string): Promise<OrganizationUsers> {
  return apiClient.get<OrganizationUsers>(`/api/admin/organizations/${orgId}/users`)
}

export async function getOrganizationMetrics(orgId: string): Promise<OrganizationMetrics> {
  return apiClient.get<OrganizationMetrics>(`/api/admin/organizations/${orgId}/metrics`)
}

/**
 * System Health API Functions
 */
export async function getSystemHealth(): Promise<SystemHealth> {
  return apiClient.get<SystemHealth>('/api/admin/system/health')
}
