import React from 'react'
import { cn } from '../../styles/design-tokens'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  children,
  className,
  ...props
}) => {
  const baseStyles = 'rounded-lg transition-all duration-200'
  const variantStyles = {
    default: 'bg-white border border-gray-200',
    bordered: 'bg-white border-2 border-gray-300',
    elevated: 'bg-white shadow-md hover:shadow-lg',
  }
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }
  
  return <div className={cn(baseStyles, variantStyles[variant], paddingStyles[padding], className)} {...props}>{children}</div>
}

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
  <div className={cn('border-b border-gray-200 pb-4 mb-4', className)} {...props}>{children}</div>
)

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
  <div className={cn('', className)} {...props}>{children}</div>
)

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
  <div className={cn('flex items-center gap-2 justify-end border-t border-gray-200 pt-4 mt-4', className)} {...props}>{children}</div>
)
