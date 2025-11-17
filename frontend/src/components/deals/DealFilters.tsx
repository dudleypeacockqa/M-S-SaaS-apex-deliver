/**
 * DealFilters Component
 *
 * Provides search and filtering capabilities for the deal pipeline
 */

import React, { useState, useEffect } from 'react'
import { Search, X, Filter } from '@/lib/icons'
import type { DealStage } from '@/services/api/deals'
import { cn } from '@/styles/design-tokens'

export interface DealFiltersProps {
  onSearchChange: (search: string) => void
  onFilterChange: (filters: { stage?: DealStage }) => void
  defaultSearch?: string
  defaultStage?: DealStage
  activeFilters?: number
}

const STAGE_OPTIONS: Array<{ value: DealStage; label: string }> = [
  { value: 'sourcing' as DealStage, label: 'Sourcing' },
  { value: 'evaluation' as DealStage, label: 'Evaluation' },
  { value: 'due_diligence' as DealStage, label: 'Due Diligence' },
  { value: 'negotiation' as DealStage, label: 'Negotiation' },
  { value: 'closing' as DealStage, label: 'Closing' },
]

export const DealFilters: React.FC<DealFiltersProps> = ({
  onSearchChange,
  onFilterChange,
  defaultSearch = '',
  defaultStage,
  activeFilters,
}) => {
  const [searchValue, setSearchValue] = useState(defaultSearch)
  const [stageFilter, setStageFilter] = useState<DealStage | ''>(defaultStage || '')

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchValue)
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
  }, [searchValue, onSearchChange])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const handleStageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as DealStage | ''
    setStageFilter(value)
    onFilterChange({ stage: value || undefined })
  }

  const handleClearFilters = () => {
    setSearchValue('')
    setStageFilter('')
    onSearchChange('')
    onFilterChange({ stage: undefined })
  }

  // Calculate active filters internally if not provided
  const calculatedActiveFilters = (searchValue ? 1 : 0) + (stageFilter ? 1 : 0)
  const hasActiveFilters = activeFilters !== undefined ? activeFilters > 0 : calculatedActiveFilters > 0

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white border-b border-gray-200">
      {/* Search Input */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="Search deals by name or company..."
          aria-label="Search deals"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Stage Filter Dropdown */}
      <div className="sm:w-64">
        <label htmlFor="stage-filter" className="sr-only">
          Filter by stage
        </label>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            id="stage-filter"
            value={stageFilter}
            onChange={handleStageChange}
            aria-label="Filter by stage"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="">All Stages</option>
            {STAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Clear Filters Button */}
      <div className="flex items-center gap-2">
        {hasActiveFilters && (
          <span className="text-sm text-gray-600">
            {activeFilters !== undefined ? activeFilters : calculatedActiveFilters} {(activeFilters !== undefined ? activeFilters : calculatedActiveFilters) === 1 ? 'filter' : 'filters'} active
          </span>
        )}
        <button
          onClick={handleClearFilters}
          disabled={!hasActiveFilters}
          aria-label="Clear all filters"
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-md transition-colors',
            hasActiveFilters
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          )}
        >
          <X className="h-4 w-4" />
          Clear
        </button>
      </div>
    </div>
  )
}
