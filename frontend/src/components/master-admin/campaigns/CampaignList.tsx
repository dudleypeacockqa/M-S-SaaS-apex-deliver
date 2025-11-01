/**
 * CampaignList Component
 *
 * Paginated list of campaigns with filters
 */

import React, { useState } from 'react'
import { CampaignCard } from './CampaignCard'
import { useCampaigns, useDeleteCampaign } from '@/hooks/master-admin'
import { CampaignType, CampaignStatus } from '@/services/api/masterAdmin'
import type { AdminCampaign, CampaignFilters } from '@/services/api/masterAdmin'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface CampaignListProps {
  onCampaignClick?: (campaign: AdminCampaign) => void
  onCampaignEdit?: (campaign: AdminCampaign) => void
  onCampaignSend?: (campaign: AdminCampaign) => void
}

export const CampaignList: React.FC<CampaignListProps> = ({
  onCampaignClick,
  onCampaignEdit,
  onCampaignSend,
}) => {
  const [filters, setFilters] = useState<CampaignFilters>({
    page: 1,
    per_page: 12,
  })

  const { data, isLoading } = useCampaigns(filters)
  const deleteCampaign = useDeleteCampaign()

  const handleDelete = async (campaign: AdminCampaign) => {
    if (confirm(`Are you sure you want to delete "${campaign.name}"?`)) {
      try {
        await deleteCampaign.mutateAsync(campaign.id)
      } catch (error) {
        console.error('Failed to delete campaign:', error)
      }
    }
  }

  const handleFilterChange = (field: keyof CampaignFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      page: 1, // Reset to page 1 when filters change
    }))
  }

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }))
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 h-64 rounded-lg" />
        ))}
      </div>
    )
  }

  const campaigns = data?.items || []
  const totalPages = data?.total ? Math.ceil(data.total / (filters.per_page || 12)) : 1

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        {/* Campaign Type Filter */}
        <div>
          <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            id="type-filter"
            value={filters.campaign_type || ''}
            onChange={(e) => handleFilterChange('campaign_type', e.target.value || undefined)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value={CampaignType.EMAIL}>Email</option>
            <option value={CampaignType.NEWSLETTER}>Newsletter</option>
            <option value={CampaignType.PROMOTION}>Promotion</option>
            <option value={CampaignType.FOLLOW_UP}>Follow-up</option>
            <option value={CampaignType.ANNOUNCEMENT}>Announcement</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status-filter"
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value={CampaignStatus.DRAFT}>Draft</option>
            <option value={CampaignStatus.SCHEDULED}>Scheduled</option>
            <option value={CampaignStatus.SENDING}>Sending</option>
            <option value={CampaignStatus.SENT}>Sent</option>
            <option value={CampaignStatus.FAILED}>Failed</option>
          </select>
        </div>
      </div>

      {/* Campaign Grid */}
      {campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onClick={() => onCampaignClick?.(campaign)}
              onEdit={() => onCampaignEdit?.(campaign)}
              onDelete={() => handleDelete(campaign)}
              onSend={() => onCampaignSend?.(campaign)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No campaigns found</p>
          <p className="text-sm mt-2">Create your first campaign to get started</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Page {filters.page} of {totalPages} ({data?.total || 0} total campaigns)
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange((filters.page || 1) - 1)}
              disabled={(filters.page || 1) <= 1}
              className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => handlePageChange((filters.page || 1) + 1)}
              disabled={(filters.page || 1) >= totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
