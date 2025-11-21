import { useCallback, useState } from 'react';
import { logger } from '@/utils/logger';

interface NetworkState {
  isOnline: boolean;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook for handling network operations with error handling and retry logic
 */
export const useNetworkHandler = () => {
  const [state, setState] = useState<NetworkState>({
    isOnline: navigator.onLine,
    loading: false,
    error: null
  });

  const handleRequest = useCallback(async <T>(
    request: () => Promise<T>,
    options: {
      retries?: number;
      retryDelay?: number;
      timeout?: number;
    } = {}
  ): Promise<T | null> => {
    const { retries = 3, retryDelay = 1000, timeout = 10000 } = options;
    
    setState(prev => ({ ...prev, loading: true, error: null }));

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Check if we're online
        if (!navigator.onLine) {
          throw new Error('No internet connection');
        }

        // Create timeout promise
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), timeout);
        });

        // Race between request and timeout
        const result = await Promise.race([request(), timeoutPromise]);
        
        setState(prev => ({ ...prev, loading: false, error: null }));
        return result;
      } catch (error) {
        const isLastAttempt = attempt === retries;
        const errorMessage = error instanceof Error ? error.message : 'Network request failed';
        
        if (isLastAttempt) {
          setState(prev => ({ ...prev, loading: false, error: errorMessage }));
          logger.error('Network request failed after retries', error instanceof Error ? error : new Error(errorMessage), {
            attempts: attempt + 1,
            url: window.location.href
          });
          return null;
        }

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
      }
    }

    return null;
  }, []);

  const checkConnection = useCallback(() => {
    setState(prev => ({ ...prev, isOnline: navigator.onLine }));
  }, []);

  return {
    ...state,
    handleRequest,
    checkConnection
  };
};

export default useNetworkHandler;