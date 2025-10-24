/**
 * Admin API Client
 *
 * Provides functions for calling admin endpoints.
 * All endpoints require admin role.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Get authorization headers with Clerk JWT token
 */
async function getAuthHeaders(): Promise<HeadersInit> {
  // In production, this would get the token from Clerk
  // For now, we'll implement a basic version
  return {
    'Content-Type': 'application/json',
  };
}

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
  const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard metrics: ${response.statusText}`);
  }

  return response.json();
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
  });

  if (search) {
    params.append('search', search);
  }

  const response = await fetch(
    `${API_BASE_URL}/api/admin/users?${params}`,
    {
      headers: await getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.statusText}`);
  }

  return response.json();
}

export async function getUserDetails(userId: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user details: ${response.statusText}`);
  }

  return response.json();
}

export async function updateUser(userId: string, updates: UserUpdate): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
    method: 'PUT',
    headers: await getAuthHeaders(),
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(`Failed to update user: ${response.statusText}`);
  }

  return response.json();
}

export async function softDeleteUser(userId: string): Promise<{ message: string; user_id: string }> {
  const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
    method: 'DELETE',
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete user: ${response.statusText}`);
  }

  return response.json();
}

export async function restoreUser(userId: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/restore`, {
    method: 'POST',
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to restore user: ${response.statusText}`);
  }

  return response.json();
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
  });

  const response = await fetch(
    `${API_BASE_URL}/api/admin/organizations?${params}`,
    {
      headers: await getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch organizations: ${response.statusText}`);
  }

  return response.json();
}

export async function getOrganizationDetails(orgId: string): Promise<Organization> {
  const response = await fetch(`${API_BASE_URL}/api/admin/organizations/${orgId}`, {
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch organization details: ${response.statusText}`);
  }

  return response.json();
}

export async function getOrganizationUsers(orgId: string): Promise<OrganizationUsers> {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/organizations/${orgId}/users`,
    {
      headers: await getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch organization users: ${response.statusText}`);
  }

  return response.json();
}

export async function getOrganizationMetrics(orgId: string): Promise<OrganizationMetrics> {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/organizations/${orgId}/metrics`,
    {
      headers: await getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch organization metrics: ${response.statusText}`);
  }

  return response.json();
}

/**
 * System Health API Functions
 */
export async function getSystemHealth(): Promise<SystemHealth> {
  const response = await fetch(`${API_BASE_URL}/api/admin/system/health`, {
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch system health: ${response.statusText}`);
  }

  return response.json();
}
