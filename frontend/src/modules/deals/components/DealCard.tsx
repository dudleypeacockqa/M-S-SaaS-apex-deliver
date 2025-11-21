import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Draggable } from '@hello-pangea/dnd'
import { Building2, MoreHorizontal } from 'lucide-react'

import { type Deal, formatCurrency } from '../../../services/api/deals'

interface DealCardProps {
  deal: Deal
  index: number
}

export const DealCard: React.FC<DealCardProps> = ({ deal, index }) => {
  const navigate = useNavigate()

  return (
    <Draggable draggableId={deal.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => navigate(`/deals/${deal.id}`)}
          style={{
            ...provided.draggableProps.style,
          }}
          className={`
            group relative mb-3 flex flex-col gap-3 rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md
            ${snapshot.isDragging ? 'rotate-2 scale-105 shadow-xl ring-2 ring-indigo-500 ring-opacity-50' : 'border-slate-200'}
          `}
        >
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-900 text-sm leading-snug group-hover:text-indigo-600">
              {deal.name}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation()
                // TODO: Open actions menu
              }}
              className="text-slate-400 opacity-0 transition-opacity hover:text-slate-600 group-hover:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Building2 className="h-3.5 w-3.5" />
            <span className="truncate font-medium">{deal.target_company}</span>
          </div>

          <div className="mt-auto flex items-center justify-between pt-2 border-t border-slate-100">
            {deal.deal_size ? (
              <div className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                <span className="text-emerald-600">{formatCurrency(deal.deal_size, deal.currency)}</span>
              </div>
            ) : (
              <span className="text-xs text-slate-400 italic">Value pending</span>
            )}

            {deal.industry && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-600">
                {deal.industry}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  )
}

