/**
 * useCurrentUser Hook
 *
 * Fetches and caches the current user from the backend.
 * Integrates with Clerk for authentication token.
 */

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { getCurrentUser, type User } from '../services/api'

interface UseCurrentUserResult {
  user: User | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useCurrentUser(): UseCurrentUserResult {
  const { getToken, isSignedIn, isLoaded } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchUser = async () => {
    if (!isSignedIn || !isLoaded) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const token = await getToken()
      if (!token) {
        throw new Error('No authentication token available')
      }

      const userData = await getCurrentUser(token)
      setUser(userData)
    } catch (err) {
      console.error('Failed to fetch user:', err)
      setError(err instanceof Error ? err : new Error('Unknown error'))
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [isSignedIn, isLoaded])

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
  }
}
