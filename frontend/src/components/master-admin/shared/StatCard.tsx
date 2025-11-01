/**
 * StatCard Component
 *
 * Reusable card for displaying metrics in the Master Admin Portal
 */

import React from 'react'
import { cn } from '@/styles/design-tokens'
import { LucideIcon } from 'lucide-react'

export interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  trend?: {
    value: number // Percentage change
    isPositive: boolean
  }
  className?: string
  onClick?: () => void
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
  onClick,
}) => {
  const isClickable = !!onClick

  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 p-6 shadow-sm transition-all',
        isClickable && 'cursor-pointer hover:shadow-md hover:border-blue-300',
        className
      )}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="ml-4 flex-shrink-0">
            <div className="rounded-lg bg-blue-50 p-3">
              <Icon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-4">
          <span
            className={cn(
              'inline-flex items-center text-sm font-medium',
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            )}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            <span className="ml-2 text-gray-500">vs last week</span>
          </span>
        </div>
      )}
    </div>
  )
}
