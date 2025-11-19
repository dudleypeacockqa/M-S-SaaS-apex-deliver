/**
 * Design System Tokens - ApexDeliver Brand
 * Centralized design tokens for consistent styling across the platform
 */

export const colors = {
  primary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    DEFAULT: '#4f46e5',
  },
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5f5',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  success: {
    500: '#10b981',
    600: '#059669',
    DEFAULT: '#10b981',
  },
  warning: {
    500: '#f97316',
    600: '#ea580c',
    DEFAULT: '#f97316',
  },
  danger: {
    500: '#ef4444',
    600: '#dc2626',
    DEFAULT: '#ef4444',
  },
}

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
}

export const radii = {
  sm: '0.375rem',
  md: '0.75rem',
  lg: '1rem',
  pill: '999px',
}

export const shadows = {
  sm: '0 1px 2px rgba(15, 23, 42, 0.08)',
  md: '0 10px 25px rgba(15, 23, 42, 0.08)',
  lg: '0 25px 50px rgba(15, 23, 42, 0.06)',
}

export const gradients = {
  brand: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #0ea5e9 100%)',
  slate: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
}

/**
 * Utility function to generate CSS class names from design tokens
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ')
}

export default { colors, spacing, radii, shadows, gradients, cn }
