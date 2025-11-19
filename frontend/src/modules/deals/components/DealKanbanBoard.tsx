import React from 'react'
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'
import { AlertCircle } from 'lucide-react'

import { Deal, DealStage, getStageDisplayName, getStageColor } from '../../../services/api/deals'
import { DealCard } from './DealCard'

interface DealKanbanBoardProps {
  deals: Deal[]
  onDealMove: (dealId: string, newStage: DealStage) => void
}

const STAGES: DealStage[] = [
  'sourcing',
  'evaluation',
  'due_diligence',
  'negotiation',
  'closing',
]

export const DealKanbanBoard: React.FC<DealKanbanBoardProps> = ({ deals, onDealMove }) => {
  const handleDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result

    if (!destination) return
    if (
      destination.droppableId === result.source.droppableId &&
      destination.index === result.source.index
    ) {
      return
    }

    onDealMove(draggableId, destination.droppableId as DealStage)
  }

  // Group deals by stage
  const dealsByStage = React.useMemo(() => {
    const groups: Record<string, Deal[]> = {}
    STAGES.forEach((stage) => {
      groups[stage] = deals.filter((deal) => deal.stage === stage && !deal.archived_at)
    })
    return groups
  }, [deals])

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex h-full gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageDeals = dealsByStage[stage] || []
          const stageColor = getStageColor(stage)

          return (
            <div
              key={stage}
              className="flex h-full min-w-[280px] w-[320px] flex-col rounded-xl bg-slate-50/50 border border-slate-200/60"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 bg-white/50 rounded-t-xl backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor: stageColor,
                      boxShadow: `0 0 0 2px ${stageColor}33`,
                    }}
                  />
                  <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-tight">
                    {getStageDisplayName(stage)}
                  </h3>
                </div>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                  {stageDeals.length}
                </span>
              </div>

              {/* Droppable Area */}
              <Droppable droppableId={stage}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`
                      flex-1 overflow-y-auto px-3 py-3 transition-colors scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent
                      ${snapshot.isDraggingOver ? 'bg-slate-100/50' : ''}
                    `}
                  >
                    {stageDeals.map((deal, index) => (
                      <DealCard key={deal.id} deal={deal} index={index} />
                    ))}
                    {provided.placeholder}

                    {stageDeals.length === 0 && !snapshot.isDraggingOver && (
                      <div className="flex flex-col items-center justify-center py-8 text-center opacity-60">
                        <div className="mb-2 rounded-full bg-slate-100 p-3">
                          <AlertCircle className="h-5 w-5 text-slate-400" />
                        </div>
                        <p className="text-xs font-medium text-slate-500">No deals</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>

              {/* Column Footer (Stats) */}
              <div className="border-t border-slate-200 px-4 py-3 bg-white/50 rounded-b-xl text-xs font-medium text-slate-500 flex justify-between">
                <span>Total Value</span>
                <span className="text-slate-700 font-bold">
                  {new Intl.NumberFormat('en-GB', {
                    style: 'currency',
                    currency: 'GBP',
                    notation: 'compact',
                    compactDisplay: 'short'
                  }).format(
                    stageDeals.reduce((acc, deal) => acc + (deal.deal_size || 0), 0)
                  )}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </DragDropContext>
  )
}

