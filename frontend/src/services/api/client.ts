/**
 * Centralized API Client with Clerk Authentication
 *
 * Provides a fetch wrapper with automatic Clerk JWT token injection,
 * error handling, and retry logic.
 *
 * Usage:
 *   import { apiClient } from './client'
 *
 *   // GET request
 *   const data = await apiClient.get<ResponseType>('/api/endpoint')
 *
 *   // POST request
 *   const result = await apiClient.post<ResponseType>('/api/endpoint', { data })
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

/**
 * API Error class with HTTP status code
 */
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: Response
  ) {
    super(message)
    this.name = 'APIError'
  }
}

/**
 * Fetch options with optional body
 */
type ResponseType = 'json' | 'blob' | 'arrayBuffer' | 'text'

interface FetchOptions {
  method?: string
  headers?: HeadersInit
  body?: any
  timeout?: number
  contentType?: string | null
  responseType?: ResponseType
}

/**
 * Get Clerk JWT token from window.Clerk instance
 * This is a workaround since we can't use hooks outside React components
 */
async function getClerkToken(): Promise<string | null> {
  // Check if Clerk is loaded
  if (typeof window === 'undefined' || !window.Clerk) {
    console.warn('Clerk not loaded yet')
    return null
  }

  try {
    // Get the session token from Clerk
    const session = await window.Clerk.session
    if (!session) {
      console.warn('No active Clerk session')
      return null
    }

    // Get the JWT token
    const token = await session.getToken()
    return token
  } catch (error) {
    console.error('Failed to get Clerk token:', error)
    return null
  }
}

/**
 * Build authorization headers with Clerk JWT token
 */
export async function getAuthHeaders(contentType: string | null = 'application/json'): Promise<HeadersInit> {
  const headers: HeadersInit = {}

  const token = await getClerkToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // Only set Content-Type if specified (for binary downloads, omit it)
  if (contentType) {
    headers['Content-Type'] = contentType
  }

  return headers
}

/**
 * Execute a fetch request with automatic token injection and error handling
 */
async function fetchWithAuth<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const {
    method = 'GET',
    body,
    timeout = 30000,
    contentType,
    responseType = 'json',
    headers: customHeaders,
  } = options

  const resolvedContentType = contentType === undefined ? 'application/json' : contentType

  // Build headers with Clerk token and merge any custom overrides
  const headers = new Headers(await getAuthHeaders(resolvedContentType))

  if (customHeaders) {
    const overrides = new Headers(customHeaders)
    overrides.forEach((value, key) => {
      headers.set(key, value)
    })
  }

  // Build full URL
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`

  // Create abort controller for timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
    const isBlob = typeof Blob !== 'undefined' && body instanceof Blob
    const isArrayBuffer = typeof ArrayBuffer !== 'undefined' && body instanceof ArrayBuffer

    const shouldSerializeBody =
      body !== undefined &&
      body !== null &&
      typeof body === 'object' &&
      !isFormData &&
      !isBlob &&
      !isArrayBuffer &&
      (resolvedContentType ?? '').includes('application/json')

    const serializedBody =
      body === undefined || body === null ? undefined : shouldSerializeBody ? JSON.stringify(body) : body

    const response = await fetch(url, {
      method,
      headers,
      body: serializedBody,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    // Handle non-2xx responses
    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`

      // Try to parse error message from response
      try {
        const errorData = await response.json()
        errorMessage = errorData.detail || errorData.message || errorMessage
      } catch {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage
      }

      throw new APIError(errorMessage, response.status, response)
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T
    }

    // Parse response based on requested format
    switch (responseType) {
      case 'blob':
        return (await response.blob()) as T
      case 'arrayBuffer':
        return (await response.arrayBuffer()) as T
      case 'text':
        return (await response.text()) as T
      case 'json':
      default:
        return (await response.json()) as T
    }
  } catch (error) {
    clearTimeout(timeoutId)

    // Handle abort/timeout
    if (error instanceof Error && error.name === 'AbortError') {
      throw new APIError('Request timeout - the server took too long to respond', 408)
    }

    // Re-throw API errors
    if (error instanceof APIError) {
      throw error
    }

    // Handle network errors with more context
    const errorMessage = error instanceof Error ? error.message : 'Network request failed'
    
    // Provide more helpful error messages
    let userMessage = errorMessage
    if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
      const apiUrl = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`
      userMessage = `Unable to connect to the server. Please check:
1. The API server is running (${API_BASE_URL})
2. Your internet connection is working
3. CORS is properly configured
4. The endpoint is correct (${apiUrl})`
    }
    
    throw new APIError(userMessage, 0)
  }
}

/**
 * API Client with typed methods
 */
export const apiClient = {
  /**
   * GET request
   */
  get: <T>(endpoint: string, options?: Omit<FetchOptions, 'method' | 'body'>): Promise<T> => {
    return fetchWithAuth<T>(endpoint, { ...options, method: 'GET' })
  },

  /**
   * POST request
   */
  post: <T>(endpoint: string, body?: any, options?: Omit<FetchOptions, 'method' | 'body'>): Promise<T> => {
    return fetchWithAuth<T>(endpoint, { ...options, method: 'POST', body })
  },

  /**
   * PUT request
   */
  put: <T>(endpoint: string, body?: any, options?: Omit<FetchOptions, 'method' | 'body'>): Promise<T> => {
    return fetchWithAuth<T>(endpoint, { ...options, method: 'PUT', body })
  },

  /**
   * PATCH request
   */
  patch: <T>(endpoint: string, body?: any, options?: Omit<FetchOptions, 'method' | 'body'>): Promise<T> => {
    return fetchWithAuth<T>(endpoint, { ...options, method: 'PATCH', body })
  },

  /**
   * DELETE request
   */
  delete: <T>(endpoint: string, options?: Omit<FetchOptions, 'method' | 'body'>): Promise<T> => {
    return fetchWithAuth<T>(endpoint, { ...options, method: 'DELETE' })
  },
}

/**
 * Export types for external use
 */
export type { FetchOptions }
