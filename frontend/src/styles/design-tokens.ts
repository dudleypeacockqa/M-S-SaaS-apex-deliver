/**
 * Design System Tokens - ApexDeliver Brand
 * Centralized design tokens for consistent styling across the platform
 */

export const colors = {
  // Primary Brand Colors (Professional Blue)
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    DEFAULT: '#3b82f6',
  },
  success: {
    500: '#22c55e',
    DEFAULT: '#22c55e',
  },
  warning: {
    500: '#f59e0b',
    DEFAULT: '#f59e0b',
  },
  danger: {
    500: '#ef4444',
    DEFAULT: '#ef4444',
  },
}

/**
 * Utility function to generate CSS class names from design tokens
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ')
}

export default { colors, cn }
