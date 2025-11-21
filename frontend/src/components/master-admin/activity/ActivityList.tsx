/**
 * ActivityList Component
 *
 * Paginated list of activities with filters
 */

import React, { useState } from 'react'
import { cn } from '@/styles/design-tokens'
import { Calendar, Filter, Trash2 } from '@/lib/icons'
import { Button } from '@/components/ui/Button'
import { useActivities, useDeleteActivity } from '@/hooks/master-admin'
import { ActivityType, ActivityStatus } from '@/services/api/masterAdmin'
import type { ActivityFilters } from '@/services/api/masterAdmin'

export const ActivityList: React.FC = () => {
  const [filters, setFilters] = useState<ActivityFilters>({
    page: 1,
    per_page: 20,
  })

  const { data, isLoading } = useActivities(filters)
  const deleteActivity = useDeleteActivity()

  const handleDelete = async (activityId: number) => {
    if (confirm('Are you sure you want to delete this activity?')) {
      try {
        await deleteActivity.mutateAsync(activityId)
      } catch (error) {
        console.error('Failed to delete activity:', error)
      }
    }
  }

  const handleFilterChange = (key: keyof ActivityFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
  }

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case ActivityType.DISCOVERY:
        return '🔍'
      case ActivityType.EMAIL:
        return '📧'
      case ActivityType.VIDEO:
        return '🎥'
      case ActivityType.CALL:
        return '📞'
      default:
        return '📝'
    }
  }

  const getStatusBadge = (status: ActivityStatus) => {
    const styles = {
      [ActivityStatus.DONE]: 'bg-green-100 text-green-800',
      [ActivityStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
      [ActivityStatus.CANCELLED]: 'bg-red-100 text-red-800',
    }

    const labels = {
      [ActivityStatus.DONE]: 'Done',
      [ActivityStatus.PENDING]: 'Pending',
      [ActivityStatus.CANCELLED]: 'Cancelled',
    }

    return (
      <span
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          styles[status]
        )}
      >
        {labels[status]}
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header & Filters */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
          <span className="text-sm text-gray-500">
            {data?.total || 0} total
          </span>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-3">
          {/* Date Range */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <input
              type="date"
              value={filters.start_date || ''}
              onChange={(e) => handleFilterChange('start_date', e.target.value || undefined)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Start date"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={filters.end_date || ''}
              onChange={(e) => handleFilterChange('end_date', e.target.value || undefined)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="End date"
            />
          </div>

          {/* Activity Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filters.activity_type || ''}
              onChange={(e) => handleFilterChange('activity_type', e.target.value || undefined)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value={ActivityType.DISCOVERY}>Discovery</option>
              <option value={ActivityType.EMAIL}>Email</option>
              <option value={ActivityType.VIDEO}>Video</option>
              <option value={ActivityType.CALL}>Call</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-gray-200">
        {data?.items && data.items.length > 0 ? (
          data.items.map((activity) => (
            <div
              key={activity.id}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xl">{getActivityIcon(activity.type)}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 capitalize">
                          {activity.type}
                        </span>
                        {getStatusBadge(activity.status)}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span>{new Date(activity.date).toLocaleDateString()}</span>
                        {activity.amount > 1 && (
                          <span className="font-medium">× {activity.amount}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {activity.notes && (
                    <p className="mt-2 text-sm text-gray-600 ml-9">{activity.notes}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(activity.id)}
                  className="ml-4 text-gray-400 hover:text-red-600 transition-colors"
                  aria-label="Delete activity"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>No activities found.</p>
            <p className="text-sm mt-1">Start logging your activities above!</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {data && data.total > data.per_page && (
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
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
