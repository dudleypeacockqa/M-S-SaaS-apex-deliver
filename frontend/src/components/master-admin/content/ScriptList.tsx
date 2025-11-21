/**
 * ScriptList Component
 *
 * Paginated list of content scripts with filters
 */

import React, { useState } from 'react'
import { ScriptCard } from './ScriptCard'
import { useContentScripts, useDeleteContentScript } from '@/hooks/master-admin'
import { ContentType } from '@/services/api/masterAdmin'
import type { AdminContentScript, ContentScriptFilters } from '@/services/api/masterAdmin'
import { ChevronLeft, ChevronRight } from '@/lib/icons'

export interface ScriptListProps {
  onScriptClick?: (script: AdminContentScript) => void
  onScriptEdit?: (script: AdminContentScript) => void
}

export const ScriptList: React.FC<ScriptListProps> = ({ onScriptClick, onScriptEdit }) => {
  const [filters, setFilters] = useState<ContentScriptFilters>({
    page: 1,
    per_page: 12,
  })

  const { data, isLoading } = useContentScripts(filters)
  const deleteScript = useDeleteContentScript()

  const handleDelete = async (script: AdminContentScript) => {
    if (confirm(`Are you sure you want to delete "${script.title}"?`)) {
      try {
        await deleteScript.mutateAsync(script.id)
      } catch (error) {
        console.error('Failed to delete script:', error)
      }
    }
  }

  const handleFilterChange = (field: keyof ContentScriptFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value, page: 1 }))
  }

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }))
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 h-48 rounded-lg" />
        ))}
      </div>
    )
  }

  const scripts = data?.items || []
  const totalPages = data?.total ? Math.ceil(data.total / (filters.per_page || 12)) : 1

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4">
        <div>
          <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Content Type
          </label>
          <select
            id="type-filter"
            value={filters.content_type || ''}
            onChange={(e) => handleFilterChange('content_type', e.target.value || undefined)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value={ContentType.ARTICLE}>Article</option>
            <option value={ContentType.VIDEO}>Video</option>
            <option value={ContentType.PODCAST}>Podcast</option>
            <option value={ContentType.SOCIAL}>Social</option>
            <option value={ContentType.NEWSLETTER}>Newsletter</option>
          </select>
        </div>
      </div>

      {/* Scripts Grid */}
      {scripts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scripts.map((script) => (
            <ScriptCard
              key={script.id}
              script={script}
              onClick={() => onScriptClick?.(script)}
              onEdit={() => onScriptEdit?.(script)}
              onDelete={() => handleDelete(script)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No scripts found</p>
          <p className="text-sm mt-2">Create your first content script to get started</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Page {filters.page} of {totalPages} ({data?.total || 0} total scripts)
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
