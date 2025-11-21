/**
 * ProspectList Component
 *
 * Paginated list view of prospects with search and filters
 */

import React, { useState } from 'react'
import { Search, Filter, SortAsc } from '@/lib/icons'
import { Button } from '@/components/ui/Button'
import { ProspectCard } from './ProspectCard'
import { useProspects } from '@/hooks/master-admin'
import { ProspectStatus } from '@/services/api/masterAdmin'
import type { ProspectFilters, AdminProspect } from '@/services/api/masterAdmin'

export interface ProspectListProps {
  onProspectClick?: (prospect: AdminProspect) => void
  onProspectEdit?: (prospect: AdminProspect) => void
  onProspectDelete?: (prospect: AdminProspect) => void
}

export const ProspectList: React.FC<ProspectListProps> = ({
  onProspectClick,
  onProspectEdit,
  onProspectDelete,
}) => {
  const [filters, setFilters] = useState<ProspectFilters>({
    page: 1,
    per_page: 20,
  })
  const [searchTerm, setSearchTerm] = useState('')

  const { data, isLoading } = useProspects(filters)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setFilters((prev) => ({ ...prev, search: term || undefined, page: 1 }))
  }

  const handleStatusFilter = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: status ? (status as ProspectStatus) : undefined,
      page: 1,
    }))
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-wrap gap-3">
          {/* Search Bar */}
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by name, email, or company..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filters.status || ''}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value={ProspectStatus.NEW}>New</option>
              <option value={ProspectStatus.QUALIFIED}>Qualified</option>
              <option value={ProspectStatus.ENGAGED}>Engaged</option>
              <option value={ProspectStatus.PROPOSAL}>Proposal</option>
              <option value={ProspectStatus.NEGOTIATION}>Negotiation</option>
              <option value={ProspectStatus.CLOSED_WON}>Closed - Won</option>
              <option value={ProspectStatus.CLOSED_LOST}>Closed - Lost</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="flex items-center text-sm text-gray-600">
            <SortAsc className="h-4 w-4 mr-2" />
            {data?.total || 0} prospects found
          </div>
        </div>
      </div>

      {/* Prospect Cards Grid */}
      {data?.items && data.items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.items.map((prospect) => (
            <ProspectCard
              key={prospect.id}
              prospect={prospect}
              onClick={() => onProspectClick?.(prospect)}
              onEdit={() => onProspectEdit?.(prospect)}
              onDelete={() => onProspectDelete?.(prospect)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No prospects found.</p>
          <p className="text-sm text-gray-400 mt-1">
            {filters.search || filters.status
              ? 'Try adjusting your filters.'
              : 'Create your first prospect to get started!'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {data && data.total > data.per_page && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Showing {(data.page - 1) * data.per_page + 1} to{' '}
            {Math.min(data.page * data.per_page, data.total)} of {data.total}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              btnSize="sm"
              onClick={() => setFilters((prev) => ({ ...prev, page: prev.page! - 1 }))}
              disabled={data.page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              btnSize="sm"
              onClick={() => setFilters((prev) => ({ ...prev, page: prev.page! + 1 }))}
              disabled={data.page * data.per_page >= data.total}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
