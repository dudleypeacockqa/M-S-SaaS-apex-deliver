/**
 * PageSection Component
 * Provides consistent section spacing and background options for marketing pages
 */

import React from 'react'
import { cn } from '../../styles/design-tokens'

export interface PageSectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'gray' | 'gradient' | 'dark'
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
}

export const PageSection: React.FC<PageSectionProps> = ({
  variant = 'default',
  spacing = 'lg',
  fullWidth = false,
  children,
  className,
  ...props
}) => {
  // Variant styles
  const variantStyles = {
    default: 'bg-white',
    gray: 'bg-gray-50',
    gradient: 'bg-gradient-to-br from-blue-50 via-white to-teal-50',
    dark: 'bg-gray-900 text-white',
  }

  // Spacing styles (vertical padding)
  const spacingStyles = {
    none: 'py-0',
    sm: 'py-8 md:py-12',
    md: 'py-12 md:py-16',
    lg: 'py-16 md:py-24',
    xl: 'py-24 md:py-32',
  }

  return (
    <section
      className={cn(variantStyles[variant], spacingStyles[spacing], className)}
      {...props}
    >
      {fullWidth ? children : <div className="container mx-auto px-4 md:px-6 lg:px-8">{children}</div>}
    </section>
  )
}

export default PageSection
