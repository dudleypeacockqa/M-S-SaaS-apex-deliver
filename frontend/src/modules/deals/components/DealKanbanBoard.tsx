import React, { useMemo } from 'react'
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'
import { AlertCircle } from 'lucide-react'

import { Deal, DealStage, getStageDisplayName, getStageColor } from '../../../services/api/deals'
import { DealCard } from './DealCard'

interface DealKanbanBoardProps {
  deals: Deal[]
  onDealMove: (dealId: string, newStage: DealStage) => void
}

const STAGES: DealStage[] = ['sourcing', 'evaluation', 'due_diligence', 'negotiation', 'closing']

export const DealKanbanBoard: React.FC<DealKanbanBoardProps> = ({ deals, onDealMove }) => {
  const handleDragEnd = (result: DropResult) => {
    const { destination, draggableId, source } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    onDealMove(draggableId, destination.droppableId as DealStage)
  }

  const dealsByStage = useMemo(() => {
    const groups: Record<DealStage, Deal[]> = {
      sourcing: [],
      evaluation: [],
      due_diligence: [],
      negotiation: [],
      closing: [],
      won: [],
      lost: [],
    }
    deals.forEach((deal) => {
      if (!deal.archived_at && groups[deal.stage]) {
        groups[deal.stage] = [...groups[deal.stage], deal]
      }
    })
    return groups
  }, [deals])

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex h-full gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageDeals = dealsByStage[stage] ?? []
          const stageColor = getStageColor(stage)
          const stageValue = stageDeals.reduce((acc, deal) => acc + (deal.deal_size || 0), 0)

          return (
            <div
              key={stage}
              className="flex h-full min-w-[280px] w-[320px] flex-col rounded-2xl border border-slate-200 bg-slate-50/70 shadow-sm backdrop-blur"
            >
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 bg-white/80 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: stageColor,
                      boxShadow: `0 0 0 4px ${stageColor}20`,
                    }}
                  />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                      {getStageDisplayName(stage)}
                    </p>
                    <p className="text-[11px] text-slate-400">Health score 94%</p>
                  </div>
                </div>
                <span className="rounded-md bg-white px-2 py-0.5 text-xs font-bold text-slate-700 shadow">
                  {stageDeals.length}
                </span>
              </div>

              <Droppable droppableId={stage}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 overflow-y-auto px-3 py-3 transition-colors scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent ${
                      snapshot.isDraggingOver ? 'bg-slate-100/80' : ''
                    }`}
                  >
                    {stageDeals.map((deal, index) => (
                      <DealCard key={deal.id} deal={deal} index={index} />
                    ))}
                    {provided.placeholder}

                    {stageDeals.length === 0 && !snapshot.isDraggingOver && (
                      <div className="flex flex-col items-center justify-center py-8 text-center opacity-70">
                        <div className="mb-2 rounded-full bg-white p-3 shadow-sm">
                          <AlertCircle className="h-5 w-5 text-slate-400" />
                        </div>
                        <p className="text-xs font-medium text-slate-500">No active deals</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>

              <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs font-semibold text-slate-500">
                <span>Total Value</span>
                <span className="text-slate-800">
                  {new Intl.NumberFormat('en-GB', {
                    style: 'currency',
                    currency: 'GBP',
                    notation: 'compact',
                    compactDisplay: 'short',
                  }).format(stageValue)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </DragDropContext>
  )
}

