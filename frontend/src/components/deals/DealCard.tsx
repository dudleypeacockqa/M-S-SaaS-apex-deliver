/**
 * DealCard Component
 *
 * Reusable card component for displaying deal information
 * Supports multiple variants and interactive states
 */

import React from 'react'
import type { Deal } from '@/services/api/deals'
import { getStageDisplayName, formatCurrency } from '@/services/api/deals'
import { cn } from '@/styles/design-tokens'
import { Calendar, Building2, TrendingUp, Archive } from 'lucide-react'
import { formatDate } from '@/utils/dateFormat'

export interface DealCardProps {
  deal: Deal
  variant?: 'default' | 'compact' | 'detailed'
  selected?: boolean
  onClick?: (dealId: string) => void
  actions?: React.ReactNode
  showDescription?: boolean
  showTimestamps?: boolean
  className?: string
}

const STAGE_COLORS: Record<string, string> = {
  sourcing: 'bg-gray-100 text-gray-800',
  evaluation: 'bg-blue-100 text-blue-800',
  due_diligence: 'bg-yellow-100 text-yellow-800',
  negotiation: 'bg-orange-100 text-orange-800',
  closing: 'bg-green-100 text-green-800',
  won: 'bg-green-200 text-green-900',
  lost: 'bg-red-100 text-red-800',
}

export const DealCard: React.FC<DealCardProps> = ({
  deal,
  variant = 'default',
  selected = false,
  onClick,
  actions,
  showDescription = false,
  showTimestamps = false,
  className,
}) => {
  const isClickable = !!onClick
  const isArchived = !!deal.archived_at

  const variantClasses = {
    default: 'p-4',
    compact: 'p-3',
    detailed: 'p-6',
  }

  const handleClick = () => {
    if (onClick) {
      onClick(deal.id)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onClick(deal.id)
    }
  }

  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 shadow-sm transition-all',
        variantClasses[variant],
        isClickable && 'cursor-pointer hover:shadow-md hover:border-gray-300',
        selected && 'ring-2 ring-blue-500 border-blue-500',
        isArchived && 'opacity-75 bg-gray-50',
        className
      )}
      onClick={isClickable ? handleClick : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-pressed={selected}
    >
      {/* Header */}
      <header className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 line-clamp-2 text-base">
            {deal.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Building2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <p className="text-sm text-gray-600 truncate">
              {deal.target_company}
            </p>
          </div>
        </div>

        {/* Archived Badge */}
        {isArchived && (
          <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded">
            <Archive className="h-3 w-3" />
            Archived
          </span>
        )}
      </header>

      {/* Deal Details */}
      <div className="space-y-2">
        {/* Deal Size */}
        {deal.deal_size && (
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span className="text-sm font-semibold text-green-600">
              {formatCurrency(deal.deal_size, deal.currency)}
            </span>
          </div>
        )}

        {/* Stage Badge */}
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'inline-block px-2 py-1 text-xs font-medium rounded',
              STAGE_COLORS[deal.stage] || 'bg-gray-100 text-gray-800'
            )}
          >
            {getStageDisplayName(deal.stage)}
          </span>

          {/* Industry Badge */}
          {deal.industry && (
            <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
              {deal.industry}
            </span>
          )}
        </div>

        {/* Description */}
        {showDescription && deal.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mt-2">
            {deal.description}
          </p>
        )}

        {/* Timestamps */}
        {showTimestamps && (
          <div className="flex items-center gap-4 text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>
                Created {formatDate(deal.created_at)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>
                Updated {formatDate(deal.updated_at)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      {actions && (
        <div className="mt-3 pt-3 border-t border-gray-100" data-testid="deal-card-actions">
          {actions}
        </div>
      )}
    </div>
  )
}
