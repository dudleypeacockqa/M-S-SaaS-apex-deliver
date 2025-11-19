/**
 * ProspectKanban Component
 *
 * Kanban board view of prospects by status
 * NOTE: This is a simplified version. For full drag-and-drop functionality,
 * integrate @hello-pangea/dnd or react-beautiful-dnd library
 */

import React, { useEffect, useState, useCallback } from 'react'
import { cn } from '@/styles/design-tokens'
import { Plus } from '@/lib/icons'
import { ProspectCard } from './ProspectCard'
import { useProspects, useUpdateProspect } from '@/hooks/master-admin'
import { ProspectStatus } from '@/services/api/masterAdmin'
import type { AdminProspect } from '@/services/api/masterAdmin'
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'

export interface ProspectKanbanProps {
  onProspectClick?: (prospect: AdminProspect) => void
  onProspectEdit?: (prospect: AdminProspect) => void
  onProspectDelete?: (prospect: AdminProspect) => void
  onAddProspect?: (status: ProspectStatus) => void
}

const KANBAN_COLUMNS = [
  { status: ProspectStatus.NEW, label: 'New', color: 'bg-gray-100' },
  { status: ProspectStatus.QUALIFIED, label: 'Qualified', color: 'bg-blue-100' },
  { status: ProspectStatus.ENGAGED, label: 'Engaged', color: 'bg-purple-100' },
  { status: ProspectStatus.PROPOSAL, label: 'Proposal', color: 'bg-yellow-100' },
  { status: ProspectStatus.NEGOTIATION, label: 'Negotiation', color: 'bg-orange-100' },
  { status: ProspectStatus.CLOSED_WON, label: 'Won', color: 'bg-green-100' },
  { status: ProspectStatus.CLOSED_LOST, label: 'Lost', color: 'bg-red-100' },
]

export const ProspectKanban: React.FC<ProspectKanbanProps> = ({
  onProspectClick,
  onProspectEdit,
  onProspectDelete,
  onAddProspect,
}) => {
  const { data: allProspects, isLoading } = useProspects({ per_page: 500 }) // Fetch all
  const updateProspect = useUpdateProspect()

  const [boardState, setBoardState] = useState<Record<ProspectStatus, AdminProspect[]>>(() =>
    KANBAN_COLUMNS.reduce(
      (acc, column) => ({
        ...acc,
        [column.status]: [],
      }),
      {} as Record<ProspectStatus, AdminProspect[]>,
    ),
  )

  useEffect(() => {
    if (!allProspects?.items) return
    const grouped = KANBAN_COLUMNS.reduce((acc, column) => {
      acc[column.status] = allProspects.items.filter((p) => p.status === column.status)
      return acc
    }, {} as Record<ProspectStatus, AdminProspect[]>)
    setBoardState(grouped)
  }, [allProspects])

  const handleStatusChange = async (prospect: AdminProspect, newStatus: ProspectStatus) => {
    if (prospect.status === newStatus) return

    try {
      await updateProspect.mutateAsync({
        prospectId: prospect.id,
        update: { status: newStatus },
      })
    } catch (error) {
      console.error('Failed to update prospect status:', error)
    }
  }

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return
      const sourceStatus = result.source.droppableId as ProspectStatus
      const destinationStatus = result.destination.droppableId as ProspectStatus

      if (!boardState[sourceStatus]) return
      const updated: Record<ProspectStatus, AdminProspect[]> = {
        ...boardState,
        [sourceStatus]: [...boardState[sourceStatus]],
        [destinationStatus]: [...boardState[destinationStatus]],
      }
      const [movedProspect] = updated[sourceStatus].splice(result.source.index, 1)
      if (movedProspect) {
        movedProspect.status = destinationStatus
        updated[destinationStatus].splice(result.destination.index, 0, movedProspect)
        setBoardState(updated)
        handleStatusChange(movedProspect, destinationStatus)
      }
    },
    [boardState],
  )

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {KANBAN_COLUMNS.map((column) => (
          <div key={column.status} className="flex-shrink-0 w-80">
            <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {KANBAN_COLUMNS.map((column) => {
          const prospects = boardState[column.status] || []

          return (
            <Droppable droppableId={column.status} key={column.status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex-shrink-0 w-80 bg-gray-50 rounded-lg p-4"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{column.label}</h3>
                      <span className="text-sm text-gray-500">
                        {prospects.length} {prospects.length === 1 ? 'prospect' : 'prospects'}
                      </span>
                    </div>
                    {onAddProspect && (
                      <button
                        onClick={() => onAddProspect(column.status)}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-200 transition-colors"
                        aria-label={`Add prospect to ${column.label}`}
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  {/* Prospects */}
                  <div className="space-y-3 min-h-[300px] max-h-[calc(100vh-300px)] overflow-y-auto">
                    {prospects.length > 0 ? (
                      prospects.map((prospect, index) => (
                        <Draggable key={prospect.id} draggableId={prospect.id} index={index}>
                          {(dragProvided, snapshot) => (
                            <div
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              className={cn(
                                'relative group',
                                snapshot.isDragging && 'ring-2 ring-indigo-300 bg-white',
                              )}
                            >
                              <ProspectCard
                                prospect={prospect}
                                onClick={() => onProspectClick?.(prospect)}
                                onEdit={() => onProspectEdit?.(prospect)}
                                onDelete={() => onProspectDelete?.(prospect)}
                              />

                              {/* Quick Status Change (on hover) */}
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <select
                                  value={prospect.status}
                                  onChange={(e) => handleStatusChange(prospect, e.target.value as ProspectStatus)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-xs px-2 py-1 border border-gray-300 rounded bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  aria-label="Change status"
                                >
                                  {KANBAN_COLUMNS.map((col) => (
                                    <option key={col.status} value={col.status}>
                                      {col.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-400">
                        <p className="text-sm">No prospects</p>
                        {onAddProspect && (
                          <button
                            onClick={() => onAddProspect(column.status)}
                            className="text-xs text-blue-600 hover:text-blue-800 mt-2"
                          >
                            Add one now
                          </button>
                        )}
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          )
        })}
      </div>
    </DragDropContext>
  )
}

/**
 * TODO: Enhance with drag-and-drop
 *
 * To add drag-and-drop functionality:
 * 1. Install: npm install @hello-pangea/dnd
 * 2. Import DragDropContext, Droppable, Draggable from @hello-pangea/dnd
 * 3. Wrap the kanban board in <DragDropContext onDragEnd={handleDragEnd}>
 * 4. Wrap each column in <Droppable droppableId={column.status}>
 * 5. Wrap each ProspectCard in <Draggable draggableId={prospect.id} index={index}>
 * 6. Implement handleDragEnd to update prospect status when dropped in new column
 *
 * Example:
 * const handleDragEnd = (result) => {
 *   if (!result.destination) return
 *   const newStatus = result.destination.droppableId as ProspectStatus
 *   const prospect = prospects.find(p => p.id === parseInt(result.draggableId))
 *   if (prospect) handleStatusChange(prospect, newStatus)
 * }
 */
