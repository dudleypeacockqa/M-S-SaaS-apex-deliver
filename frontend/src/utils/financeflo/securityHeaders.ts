// Security headers and CSP configuration
import { logger } from '@/utils/logger';

export interface SecurityConfig {
  enableCSP: boolean;
  enableHSTS: boolean;
  enableXFrameOptions: boolean;
  enableXContentTypeOptions: boolean;
  enableReferrerPolicy: boolean;
  enablePermissionsPolicy: boolean;
}

// Content Security Policy configuration
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for React development
    "https://fonts.googleapis.com",
    "https://cdn.jsdelivr.net"
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for CSS-in-JS
    "https://fonts.googleapis.com"
  ],
  'img-src': [
    "'self'",
    "data:",
    "https:",
    "blob:"
  ],
  'font-src': [
    "'self'",
    "https://fonts.gstatic.com"
  ],
  'connect-src': [
    "'self'",
    "https://xxfarvjktmphktsxsryq.supabase.co",
    "wss://xxfarvjktmphktsxsryq.supabase.co"
  ],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'object-src': ["'none'"],
  'media-src': ["'self'"]
};

export const generateCSPHeader = (): string => {
  const directives = Object.entries(CSP_DIRECTIVES)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
  
  logger.info('Generated CSP header', { directives });
  return directives;
};

export const SECURITY_HEADERS = {
  // Content Security Policy
  'Content-Security-Policy': generateCSPHeader(),
  
  // HSTS
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // X-Frame-Options
  'X-Frame-Options': 'DENY',
  
  // X-Content-Type-Options
  'X-Content-Type-Options': 'nosniff',
  
  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions Policy
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  
  // X-XSS-Protection (legacy but still useful)
  'X-XSS-Protection': '1; mode=block'
};

export const applySecurityHeaders = (config: SecurityConfig = {
  enableCSP: true,
  enableHSTS: true,
  enableXFrameOptions: true,
  enableXContentTypeOptions: true,
  enableReferrerPolicy: true,
  enablePermissionsPolicy: true
}): Record<string, string> => {
  const headers: Record<string, string> = {};
  
  if (config.enableCSP) {
    headers['Content-Security-Policy'] = SECURITY_HEADERS['Content-Security-Policy'];
  }
  
  if (config.enableHSTS) {
    headers['Strict-Transport-Security'] = SECURITY_HEADERS['Strict-Transport-Security'];
  }
  
  if (config.enableXFrameOptions) {
    headers['X-Frame-Options'] = SECURITY_HEADERS['X-Frame-Options'];
  }
  
  if (config.enableXContentTypeOptions) {
    headers['X-Content-Type-Options'] = SECURITY_HEADERS['X-Content-Type-Options'];
  }
  
  if (config.enableReferrerPolicy) {
    headers['Referrer-Policy'] = SECURITY_HEADERS['Referrer-Policy'];
  }
  
  if (config.enablePermissionsPolicy) {
    headers['Permissions-Policy'] = SECURITY_HEADERS['Permissions-Policy'];
  }
  
  logger.info('Applied security headers', { enabledHeaders: Object.keys(headers) });
  return headers;
};

// Security header validation
export const validateSecurityHeaders = (headers: Record<string, string>): boolean => {
  const requiredHeaders = [
    'Content-Security-Policy',
    'X-Frame-Options',
    'X-Content-Type-Options'
  ];
  
  const missingHeaders = requiredHeaders.filter(header => !headers[header]);
  
  if (missingHeaders.length > 0) {
    logger.warn('Missing required security headers', { missingHeaders });
    return false;
  }
  
  return true;
};