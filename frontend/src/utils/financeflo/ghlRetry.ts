/**
 * GHL API Retry Logic with Exponential Backoff
 *
 * Implements automatic retry for failed GHL API calls with:
 * - Exponential backoff (2^attempt * base delay)
 * - Maximum retry attempts
 * - Specific retry conditions (network errors, 5xx errors)
 * - Logging of all retry attempts
 */

interface RetryOptions {
  maxAttempts?: number;
  baseDelay?: number; // milliseconds
  maxDelay?: number; // milliseconds
  retryableStatuses?: number[];
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  retryableStatuses: [408, 429, 500, 502, 503, 504], // Timeout, rate limit, server errors
};

/**
 * Sleep for specified milliseconds
 */
const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Calculate delay with exponential backoff
 */
const calculateDelay = (attempt: number, baseDelay: number, maxDelay: number): number => {
  const exponentialDelay = baseDelay * Math.pow(2, attempt);
  const jitter = Math.random() * 0.1 * exponentialDelay; // Add 0-10% jitter
  return Math.min(exponentialDelay + jitter, maxDelay);
};

/**
 * Determine if error is retryable
 */
const isRetryableError = (error: any, retryableStatuses: number[]): boolean => {
  // Network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return true;
  }

  // HTTP status codes
  if (error.status && retryableStatuses.includes(error.status)) {
    return true;
  }

  // Response object with status
  if (error.response?.status && retryableStatuses.includes(error.response.status)) {
    return true;
  }

  return false;
};

/**
 * Execute API call with retry logic
 *
 * @example
 * const result = await withRetry(
 *   () => fetch('https://api.example.com/data'),
 *   { maxAttempts: 3, baseDelay: 1000 }
 * );
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const config = { ...DEFAULT_OPTIONS, ...options };
  let lastError: any;

  for (let attempt = 0; attempt < config.maxAttempts; attempt++) {
    try {
      console.log(`🔄 GHL API Attempt ${attempt + 1}/${config.maxAttempts}`);

      const result = await fn();

      if (attempt > 0) {
        console.log(`✅ GHL API succeeded after ${attempt + 1} attempts`);
      }

      return result;
    } catch (error: any) {
      lastError = error;

      const isLastAttempt = attempt === config.maxAttempts - 1;
      const shouldRetry = isRetryableError(error, config.retryableStatuses);

      console.error(`❌ GHL API attempt ${attempt + 1} failed:`, {
        error: error.message || error,
        status: error.status || error.response?.status,
        shouldRetry,
        isLastAttempt,
      });

      if (isLastAttempt || !shouldRetry) {
        throw error;
      }

      // Calculate and wait for backoff delay
      const delay = calculateDelay(attempt, config.baseDelay, config.maxDelay);
      console.log(`⏳ Retrying in ${Math.round(delay)}ms...`);
      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Wrapper for GHL API calls with automatic retry
 *
 * @example
 * const response = await ghlApiCall('/v1/contacts/', {
 *   method: 'POST',
 *   headers: { 'Authorization': `Bearer ${apiKey}` },
 *   body: JSON.stringify(contactData)
 * });
 */
export async function ghlApiCall(
  url: string,
  options: RequestInit,
  retryOptions?: RetryOptions
): Promise<Response> {
  return withRetry(
    async () => {
      const response = await fetch(url, options);

      // Don't retry duplicate errors (422, 409) - these are expected
      if (response.status === 422 || response.status === 409) {
        return response;
      }

      // Throw for error statuses to trigger retry logic
      if (!response.ok) {
        const error: any = new Error(`HTTP ${response.status}: ${response.statusText}`);
        error.status = response.status;
        error.response = response;
        throw error;
      }

      return response;
    },
    retryOptions
  );
}

/**
 * Store failed submission to localStorage for manual recovery
 */
export function storeFailedSubmission(
  formType: string,
  formData: any,
  error: any
): void {
  try {
    const failedSubmissions = JSON.parse(
      localStorage.getItem('failedGHLSubmissions') || '[]'
    );

    failedSubmissions.push({
      id: Date.now().toString(),
      formType,
      formData,
      error: {
        message: error.message || String(error),
        status: error.status || error.response?.status,
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    });

    // Keep only last 50 failed submissions
    const recentFailed = failedSubmissions.slice(-50);
    localStorage.setItem('failedGHLSubmissions', JSON.stringify(recentFailed));

    console.warn('📦 Failed submission stored to localStorage:', {
      formType,
      totalFailed: recentFailed.length,
    });
  } catch (storageError) {
    console.error('Failed to store failed submission:', storageError);
  }
}

/**
 * Get all failed submissions from localStorage
 */
export function getFailedSubmissions(): any[] {
  try {
    return JSON.parse(localStorage.getItem('failedGHLSubmissions') || '[]');
  } catch {
    return [];
  }
}

/**
 * Clear all failed submissions from localStorage
 */
export function clearFailedSubmissions(): void {
  localStorage.removeItem('failedGHLSubmissions');
  console.log('🗑️ Cleared all failed submissions from localStorage');
}

/**
 * Export failed submissions as JSON for manual processing
 */
export function exportFailedSubmissions(): string {
  const failed = getFailedSubmissions();
  return JSON.stringify(failed, null, 2);
}
