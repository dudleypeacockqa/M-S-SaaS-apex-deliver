// Code quality utilities and helpers
import { logger } from '@/utils/logger';

// Type-safe error handling
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Result type for better error handling
export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

export const createResult = <T>(data: T): Result<T> => ({
  success: true,
  data
});

export const createError = <E extends Error>(error: E): Result<never, E> => ({
  success: false,
  error
});

// Async wrapper with error handling
export const safeAsync = async <T>(
  operation: () => Promise<T>,
  errorMessage = 'Operation failed'
): Promise<Result<T>> => {
  try {
    const data = await operation();
    return createResult(data);
  } catch (error) {
    logger.error(errorMessage, error as Error);
    return createError(error as Error);
  }
};

// Validation helpers
export const validate = <T>(
  data: unknown,
  validator: (data: unknown) => data is T,
  errorMessage = 'Validation failed'
): Result<T> => {
  if (validator(data)) {
    return createResult(data);
  }
  return createError(new AppError(errorMessage, 'VALIDATION_ERROR', 400));
};

// Retry mechanism with exponential backoff
export const retry = async <T>(
  operation: () => Promise<T>,
  maxAttempts = 3,
  baseDelay = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts) {
        throw lastError;
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      logger.warn(`Operation failed, retrying in ${delay}ms`, { 
        attempt, 
        maxAttempts, 
        error: lastError.message 
      });
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
};

// Environment-specific utilities
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// Debug helpers (only in development)
export const debugOnly = (fn: () => void) => {
  if (isDevelopment) {
    fn();
  }
};

// Performance profiling
export const profile = <T extends any[], R>(
  fn: (...args: T) => R,
  name: string
) => {
  return (...args: T): R => {
    if (!isDevelopment) {
      return fn(...args);
    }
    
    console.time(name);
    const result = fn(...args);
    console.timeEnd(name);
    return result;
  };
};

// Type guards
export const isString = (value: unknown): value is string => 
  typeof value === 'string';

export const isNumber = (value: unknown): value is number => 
  typeof value === 'number' && !isNaN(value);

export const isObject = (value: unknown): value is Record<string, unknown> => 
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const isArray = <T>(value: unknown): value is T[] => 
  Array.isArray(value);

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};