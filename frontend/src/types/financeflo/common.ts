// Common TypeScript type definitions
// Centralized types used across the application

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ContactFormData extends Record<string, unknown> {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyName?: string;
  companySize?: string;
  annualRevenue?: string;
  currentERP?: string;
  painPoints?: string;
  timeframe?: string;
  preferredContactMethod?: 'phone' | 'email' | 'text' | 'any';
  country?: string;
  timezone?: string;
  source?: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  interestLevel?: string;
  // IntelliFlow-specific fields
  integrationChallenges?: string;
  systemsToConnect?: string;
  aiAutomationInterest?: 'high' | 'medium' | 'low' | 'exploring';
  preferredDemoType?: 'natural-language' | 'predictive-analytics' | 'self-healing' | 'full-platform' | 'custom';
  currentIntegrationMethod?: 'manual' | 'basic-automation' | 'custom-scripts' | 'existing-platform' | 'none';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  order?: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  category: string;
  tags: string[];
  featured: boolean;
  seoTitle?: string;
  metaDescription?: string;
  imageUrl?: string;
}

export interface ERPSolution {
  id: string;
  name: string;
  description: string;
  features: string[];
  industries: string[];
  pricing?: {
    starting: number;
    model: 'per-user' | 'flat-rate' | 'custom';
  };
  integrations: string[];
}

export interface Industry {
  id: string;
  name: string;
  slug: string;
  description: string;
  challenges: string[];
  solutions: string[];
  caseStudies?: CaseStudy[];
}

export interface CaseStudy {
  id: string;
  title: string;
  industry: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    improvement: string;
  }[];
  testimonial?: {
    quote: string;
    author: string;
    company: string;
    role: string;
  };
}

export interface VSLData {
  industry: string;
  headline: string;
  subheadline: string;
  problems: string[];
  solutions: string[];
  benefits: string[];
  cta: {
    primary: string;
    secondary?: string;
  };
  videoUrl?: string;
  audioUrl?: string;
}

// Utility types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type FormFieldError = {
  field: string;
  message: string;
};

export type ValidationResult = {
  isValid: boolean;
  errors: FormFieldError[];
};

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ResponsiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

// Event tracking types
export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  customProperties?: Record<string, unknown>;
}

export default {};