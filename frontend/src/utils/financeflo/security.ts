// Security utilities for application hardening
import { logger } from '@/utils/logger';

// XSS Protection - Sanitize HTML content
export const sanitizeHTML = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

// CSP (Content Security Policy) utilities
export const validateExternalResource = (url: string): boolean => {
  const allowedDomains = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'cdn.jsdelivr.net',
    'unpkg.com'
  ];
  
  try {
    const urlObj = new URL(url);
    return allowedDomains.includes(urlObj.hostname);
  } catch {
    logger.warn('Invalid URL provided for validation', { url });
    return false;
  }
};

// Rate limiting for API calls
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly maxRequests: number;
  private readonly timeWindow: number;

  constructor(maxRequests = 10, timeWindowMs = 60000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside time window
    const validRequests = requests.filter(time => now - time < this.timeWindow);
    
    if (validRequests.length >= this.maxRequests) {
      logger.warn('Rate limit exceeded', { identifier, requests: validRequests.length });
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    return true;
  }
}

export const apiRateLimiter = new RateLimiter();

// Input validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
  return phoneRegex.test(phone);
};

export const sanitizeInput = (input: string): string => {
  return input.replace(/[<>"';()&+]/g, "");
};

// Session security
export const generateSecureToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};