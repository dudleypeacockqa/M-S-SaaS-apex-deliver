import React from 'react'
import { cn } from '../../styles/design-tokens'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral'
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  className,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-1 text-sm font-medium rounded-md'
  const variantStyles = {
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    neutral: 'bg-gray-100 text-gray-800',
  }
  
  return <span className={cn(baseStyles, variantStyles[variant], className)} {...props}>{children}</span>
}
