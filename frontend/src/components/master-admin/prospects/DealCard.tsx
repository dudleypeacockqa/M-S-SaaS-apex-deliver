/**
 * DealCard Component
 *
 * Mini deal card for displaying deal summary
 */

import React from 'react'
import { cn } from '@/styles/design-tokens'
import { DollarSign, Calendar, TrendingUp, Edit2, Trash2 } from '@/lib/icons'
import { AdminDealStage } from '@/services/api/masterAdmin'
import type { AdminDeal } from '@/services/api/masterAdmin'

export interface DealCardProps {
  deal: AdminDeal
  onEdit?: () => void
  onDelete?: () => void
  className?: string
}

export const DealCard: React.FC<DealCardProps> = ({
  deal,
  onEdit,
  onDelete,
  className,
}) => {
  const getStageBadge = (stage: AdminDealStage) => {
    const styles = {
      [AdminDealStage.DISCOVERY]: 'bg-gray-100 text-gray-800',
      [AdminDealStage.QUALIFICATION]: 'bg-blue-100 text-blue-800',
      [AdminDealStage.PROPOSAL]: 'bg-purple-100 text-purple-800',
      [AdminDealStage.NEGOTIATION]: 'bg-yellow-100 text-yellow-800',
      [AdminDealStage.CLOSING]: 'bg-orange-100 text-orange-800',
      [AdminDealStage.WON]: 'bg-green-100 text-green-800',
      [AdminDealStage.LOST]: 'bg-red-100 text-red-800',
    }

    const labels = {
      [AdminDealStage.DISCOVERY]: 'Discovery',
      [AdminDealStage.QUALIFICATION]: 'Qualification',
      [AdminDealStage.PROPOSAL]: 'Proposal',
      [AdminDealStage.NEGOTIATION]: 'Negotiation',
      [AdminDealStage.CLOSING]: 'Closing',
      [AdminDealStage.WON]: 'Won',
      [AdminDealStage.LOST]: 'Lost',
    }

    return (
      <span
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          styles[stage]
        )}
      >
        {labels[stage]}
      </span>
    )
  }

  const formatCurrency = (value?: number) => {
    if (!value || Number.isNaN(value)) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="text-base font-semibold text-gray-900 mb-1">
            {deal.title}
          </h4>
          {getStageBadge(deal.stage)}
        </div>

        {/* Actions */}
        {(onEdit || onDelete) && (
          <div className="flex gap-1 ml-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="text-gray-400 hover:text-blue-600 p-1"
                aria-label="Edit deal"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="text-gray-400 hover:text-red-600 p-1"
                aria-label="Delete deal"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Deal Info */}
      <div className="space-y-2">
        {/* Value */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <DollarSign className="h-4 w-4 text-green-600" />
          <span className="font-medium">{formatCurrency(deal.value)}</span>
        </div>

        {/* Probability */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <TrendingUp className="h-4 w-4 text-blue-600" />
          <span>{deal.probability}% win probability</span>
        </div>

        {/* Expected Close Date */}
        {deal.expected_close_date && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-purple-600" />
            <span>
              Close: {new Date(deal.expected_close_date).toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Actual Close Date (if won/lost) */}
        {deal.actual_close_date && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-2 pt-2 border-t border-gray-200">
            <Calendar className="h-4 w-4" />
            <span>
              Closed: {new Date(deal.actual_close_date).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {/* Notes */}
      {deal.notes && (
        <p className="mt-3 text-sm text-gray-600 line-clamp-2">
          {deal.notes}
        </p>
      )}
    </div>
  )
}
