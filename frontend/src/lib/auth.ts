/**
 * Authentication Utilities
 *
 * Centralized helpers for Clerk JWT token management in API calls.
 * Used by API service modules that cannot directly use React hooks.
 */

/**
 * Create authorization headers with JWT token
 *
 * @param token - JWT token from Clerk's getToken()
 * @returns Headers object with Authorization and Content-Type
 */
export function createAuthHeaders(token: string | null): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Handle API errors with proper error messages
 *
 * @param response - Fetch Response object
 * @param operation - Description of the operation (e.g., "fetch dashboard metrics")
 * @throws Error with descriptive message
 */
export async function handleApiError(response: Response, operation: string): Promise<never> {
  let errorMessage = `Failed to ${operation}: ${response.statusText}`;

  try {
    const errorData = await response.json();
    if (errorData.detail) {
      errorMessage = `Failed to ${operation}: ${errorData.detail}`;
    }
  } catch {
    // Response body not JSON, use status text
  }

  throw new Error(errorMessage);
}
