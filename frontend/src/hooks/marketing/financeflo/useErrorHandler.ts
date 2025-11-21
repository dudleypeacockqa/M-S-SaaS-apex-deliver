// Error handling hook with consistent error reporting
import { useCallback } from 'react';
import { toast } from '@/hooks/marketing/financeflo/use-toast';
import { logger } from '@/utils/logger';

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  [key: string]: unknown;
}

export interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  fallbackMessage?: string;
}

export const useErrorHandler = () => {
  const handleError = useCallback((
    error: Error | unknown,
    context: ErrorContext = {},
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      logError = true,
      fallbackMessage = 'An unexpected error occurred. Please try again.'
    } = options;

    // Ensure we have an Error object
    const errorObj = error instanceof Error 
      ? error 
      : new Error(typeof error === 'string' ? error : 'Unknown error');

    // Log the error
    if (logError) {
      logger.error('Application error occurred', errorObj, context);
    }

    // Show user-friendly toast
    if (showToast) {
      const userMessage = getUserFriendlyMessage(errorObj, fallbackMessage);
      
      toast({
        title: 'Something went wrong',
        description: userMessage,
        variant: 'destructive',
      });
    }

    return errorObj;
  }, []);

  const handleAsyncError = useCallback(async <T>(
    asyncOperation: () => Promise<T>,
    context: ErrorContext = {},
    options: ErrorHandlerOptions = {}
  ): Promise<T | null> => {
    try {
      return await asyncOperation();
    } catch (error) {
      handleError(error, context, options);
      return null;
    }
  }, [handleError]);

  return {
    handleError,
    handleAsyncError
  };
};

// Helper function to convert technical errors to user-friendly messages
function getUserFriendlyMessage(error: Error, fallback: string): string {
  const message = error.message.toLowerCase();

  if (message.includes('network') || message.includes('fetch')) {
    return 'Network connection issue. Please check your internet connection and try again.';
  }

  if (message.includes('unauthorized') || message.includes('403')) {
    return 'You don\'t have permission to perform this action.';
  }

  if (message.includes('not found') || message.includes('404')) {
    return 'The requested resource could not be found.';
  }

  if (message.includes('timeout')) {
    return 'The operation timed out. Please try again.';
  }

  if (message.includes('validation') || message.includes('invalid')) {
    return 'Please check your input and try again.';
  }

  return fallback;
}

export default useErrorHandler;
