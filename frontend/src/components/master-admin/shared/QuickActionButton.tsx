/**
 * QuickActionButton Component
 *
 * Large action button with icon for dashboard quick actions
 */

import React from 'react'
import { cn } from '@/styles/design-tokens'
import { LucideIcon } from '@/lib/icons'

export interface QuickActionButtonProps {
  label: string
  icon: LucideIcon
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'success' | 'warning'
  disabled?: boolean
  className?: string
}

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  label,
  icon: Icon,
  onClick,
  variant = 'primary',
  disabled = false,
  className,
}) => {
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 border-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 border-gray-700',
    success: 'bg-green-600 text-white hover:bg-green-700 border-green-700',
    warning: 'bg-amber-600 text-white hover:bg-amber-700 border-amber-700',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-lg border-2 p-6 transition-all duration-200',
        'hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
        variantStyles[variant],
        className
      )}
    >
      <Icon className="h-8 w-8" />
      <span className="text-sm font-semibold">{label}</span>
    </button>
  )
}
