/**
 * API Service
 *
 * Centralized API communication with the backend.
 * Handles authentication tokens and error responses.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface User {
  id: string
  clerk_user_id: string
  email: string
  first_name: string | null
  last_name: string | null
  profile_image_url: string | null
  role: 'solo' | 'growth' | 'enterprise' | 'admin'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ApiError {
  error: {
    code: string
    message: string
    details?: Record<string, any>
  }
}

/**
 * Get current authenticated user from backend
 * Requires Clerk JWT token
 */
export async function getCurrentUser(token: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error: ApiError = await response.json()
    throw new Error(error.error.message || 'Failed to fetch user')
  }

  return response.json()
}

/**
 * Check if user has required role
 */
export function hasRole(user: User | null, requiredRole: string): boolean {
  if (!user) return false

  // Admin has access to everything
  if (user.role === 'admin') return true

  // Exact match required for other roles
  return user.role === requiredRole
}

/**
 * Get user's permission level (for hierarchical permissions)
 */
export function getPermissionLevel(role: string): number {
  const levels = {
    solo: 1,
    growth: 2,
    enterprise: 3,
    admin: 4,
  }
  return levels[role as keyof typeof levels] || 0
}

/**
 * Check if user meets minimum permission level
 */
export function meetsPermissionLevel(user: User | null, minimumRole: string): boolean {
  if (!user) return false

  const userLevel = getPermissionLevel(user.role)
  const requiredLevel = getPermissionLevel(minimumRole)

  return userLevel >= requiredLevel
}
