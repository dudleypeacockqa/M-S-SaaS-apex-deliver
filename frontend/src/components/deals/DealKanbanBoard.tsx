/**
 * DealKanbanBoard Component
 *
 * Kanban board for managing deal pipeline with drag-and-drop functionality
 */

import React, { useMemo, useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { useDeals, useUpdateDealStage } from '@/hooks/deals'
import type { Deal, DealStage } from '@/services/api/deals'
import { formatCurrency } from '@/services/api/deals'
import { Loader2, AlertCircle, Plus, Zap } from 'lucide-react'
import { cn } from '@/styles/design-tokens'
import { DealFilters } from './DealFilters'
import { usePipelineTemplates } from '@/hooks/pipelineTemplates'
import type { PipelineTemplate } from '@/services/api/pipelineTemplates'

const STAGE_ORDER: DealStage[] = ['sourcing', 'evaluation', 'due_diligence', 'negotiation', 'closing']

type StageConfig = {
  id: DealStage
  name: string
  color: string
  defaultSla?: number
}

const DEFAULT_STAGE_CONFIG: Record<DealStage, StageConfig> = {
  sourcing: { id: 'sourcing', name: 'Sourcing', color: 'bg-gray-100 text-gray-800', defaultSla: 48 },
  evaluation: { id: 'evaluation', name: 'Evaluation', color: 'bg-blue-100 text-blue-800', defaultSla: 72 },
  due_diligence: { id: 'due_diligence', name: 'Due Diligence', color: 'bg-yellow-100 text-yellow-800', defaultSla: 120 },
  negotiation: { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-100 text-orange-800', defaultSla: 96 },
  closing: { id: 'closing', name: 'Closing', color: 'bg-green-100 text-green-800', defaultSla: 72 },
  won: { id: 'won', name: 'Won', color: 'bg-emerald-100 text-emerald-800' },
  lost: { id: 'lost', name: 'Lost', color: 'bg-rose-100 text-rose-800' },
}

const slugify = (value: string) => value.toLowerCase().replace(/[\s-]+/g, '_')

const buildStageConfigs = (template?: PipelineTemplate | null) => {
  const lookup =
    template?.stages.reduce<Record<string, { probability?: number | null; sla_hours?: number | null }>>(
      (acc, stage) => {
        acc[slugify(stage.name)] = {
          probability: stage.probability,
          sla_hours: stage.sla_hours,
        }
        return acc
      },
      {}
    ) ?? {}

  return STAGE_ORDER.map((stageId) => {
    const defaults = DEFAULT_STAGE_CONFIG[stageId]
    const templateStage = lookup[stageId]
    const slaHours = templateStage?.sla_hours ?? defaults.defaultSla
    const probability = templateStage?.probability ?? undefined

    return {
      ...defaults,
      slaHours,
      probability,
    }
  })
}

export const DealKanbanBoard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [stageFilter, setStageFilter] = useState<DealStage | undefined>(undefined)

  const { data, isLoading, error } = useDeals({
    include_archived: false,
    search: searchQuery || undefined,
    stage: stageFilter,
  })
  const updateDealStage = useUpdateDealStage()
  const { data: pipelineTemplates } = usePipelineTemplates()

  const handleSearchChange = (search: string) => {
    setSearchQuery(search)
  }

  const handleFilterChange = (filters: { stage?: DealStage }) => {
    setStageFilter(filters.stage)
  }

  const activeFiltersCount = [searchQuery, stageFilter].filter(Boolean).length

  const selectedTemplate = useMemo(() => {
    if (!pipelineTemplates || pipelineTemplates.length === 0) {
      return null
    }
    return pipelineTemplates.find((tpl) => tpl.is_default) ?? pipelineTemplates[0]
  }, [pipelineTemplates])

  const pipelineStages = useMemo(() => buildStageConfigs(selectedTemplate), [selectedTemplate])

  // Group deals by stage
  const dealsByStage = React.useMemo(() => {
    if (!data?.items) return {}

    const grouped: Record<DealStage, Deal[]> = {
      sourcing: [],
      evaluation: [],
      due_diligence: [],
      negotiation: [],
      closing: [],
      won: [],
      lost: [],
    }

    data.items.forEach((deal) => {
      if (grouped[deal.stage]) {
        grouped[deal.stage].push(deal)
      }
    })

    return grouped
  }, [data])

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result

    // No destination or dropped in same place
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    const newStage = destination.droppableId as DealStage

    try {
      await updateDealStage.mutateAsync({
        dealId: draggableId,
        stage: newStage,
      })
    } catch (error) {
      console.error('Failed to update deal stage:', error)
      // Error handling - user will see the deal snap back due to query invalidation
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading deals...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-red-50 rounded-lg border border-red-200">
        <AlertCircle className="h-8 w-8 text-red-600" />
        <div className="ml-3">
          <p className="text-red-800 font-medium">Error loading deals</p>
          <p className="text-red-600 text-sm">Failed to fetch deals. Please try again.</p>
        </div>
      </div>
    )
  }

  if (!data?.items || data.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg border border-gray-200">
        <AlertCircle className="h-12 w-12 text-gray-400 mb-3" />
        <p className="text-gray-600 font-medium">No deals found</p>
        <p className="text-gray-500 text-sm mt-1">Create your first deal to get started</p>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Deal
        </button>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Filters */}
      <DealFilters
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        activeFilters={activeFiltersCount}
      />

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 p-4">
          {pipelineStages.map((stage) => {
            const dealsInStage = dealsByStage[stage.id] || []

            return (
              <div
                key={stage.id}
                className="flex-shrink-0 w-80 bg-gray-50 rounded-lg border border-gray-200"
              >
                {/* Column Header */}
                <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                    <span
                      className={cn(
                        'px-2 py-1 text-xs font-medium rounded-full',
                        stage.color
                      )}
                    >
                      {dealsInStage.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {stage.slaHours && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">
                        SLA {stage.slaHours}h
                      </span>
                    )}
                    {stage.probability && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-1 rounded-full">
                        Win {stage.probability}%
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                      <Zap className="h-3 w-3 text-slate-400" />
                      Automation
                    </span>
                  </div>
                </div>

                {/* Droppable Column */}
                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        'p-2 min-h-[500px] transition-colors',
                        snapshot.isDraggingOver && 'bg-blue-50'
                      )}
                    >
                      {dealsInStage.map((deal, index) => (
                        <Draggable key={deal.id} draggableId={deal.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={cn(
                                'mb-2 p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-grab',
                                snapshot.isDragging && 'shadow-lg cursor-grabbing rotate-2'
                              )}
                            >
                              {/* Deal Card Content */}
                              <div className="space-y-2">
                                <h4 className="font-medium text-gray-900 line-clamp-2">
                                  {deal.name}
                                </h4>
                                <p className="text-sm text-gray-600 line-clamp-1">
                                  {deal.target_company}
                                </p>
                                {deal.deal_size && (
                                  <p className="text-sm font-semibold text-green-600">
                                    {formatCurrency(deal.deal_size, deal.currency)}
                                  </p>
                                )}
                                {deal.industry && (
                                  <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                                    {deal.industry}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {/* Empty column placeholder */}
                      {dealsInStage.length === 0 && (
                        <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                          Drop deals here
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            )
          })}
        </div>
      </DragDropContext>
    </div>
  )
}
