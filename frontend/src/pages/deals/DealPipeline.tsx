import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, AlertCircle, Info } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { DealKanbanBoard } from '../../modules/deals/components/DealKanbanBoard'
import {
  listDeals,
  updateDealStage,
  type DealStage,
  type PaginatedDeals,
  formatCurrency,
} from '../../services/api/deals'
import { LoadingState } from '../../components/common/LoadingState'
import { EmptyState } from '../../components/common/EmptyState'

export const DealPipeline: React.FC = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)

  const { data: dealsData, isLoading, isError } = useQuery<PaginatedDeals>({
    queryKey: ['deals'],
    queryFn: () => listDeals({ per_page: 100, include_archived: false }),
  })

  const moveDealMutation = useMutation({
    mutationFn: ({ dealId, newStage }: { dealId: string; newStage: DealStage }) =>
      updateDealStage(dealId, newStage),
    onMutate: async ({ dealId, newStage }) => {
      await queryClient.cancelQueries({ queryKey: ['deals'] })
      const previousDeals = queryClient.getQueryData<PaginatedDeals>(['deals'])

      queryClient.setQueryData<PaginatedDeals | undefined>(['deals'], (old) => {
        if (!old) return old
        return {
          ...old,
          items: old.items.map((deal) =>
            deal.id === dealId ? { ...deal, stage: newStage } : deal
          ),
        }
      })

      return { previousDeals }
    },
    onError: (err, _vars, context) => {
      if (context?.previousDeals) {
        queryClient.setQueryData(['deals'], context.previousDeals)
      }
      setError(err instanceof Error ? err.message : 'Failed to update deal stage')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] })
    },
  })

  const handleDealMove = (dealId: string, newStage: DealStage) => {
    moveDealMutation.mutate({ dealId, newStage })
  }

  if (isLoading) {
    return <LoadingState message="Loading pipeline..." />
  }

  if (isError) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Error loading pipeline"
        description="We couldn't load your deals. Please try again."
        actionLabel="Retry"
        onAction={() => queryClient.invalidateQueries({ queryKey: ['deals'] })}
      />
    )
  }

  const deals = dealsData?.items ?? []
  const totalValue = deals.reduce((sum, deal) => sum + (deal.deal_size || 0), 0)

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-6 px-1">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            Deal Workspace
          </p>
          <h1 className="text-3xl font-bold text-slate-900">Pipeline Command Center</h1>
          <p className="text-sm text-slate-500 mt-1">
            {deals.length} active mandates · Total pipeline value{' '}
            <span className="font-semibold text-emerald-600">
              {formatCurrency(totalValue)}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/deals/new')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Deal
          </button>
        </div>
      </header>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <Info className="h-4 w-4" />
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="ml-auto text-xs font-semibold underline decoration-dotted hover:text-amber-900"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex-1 min-h-0 bg-white rounded-xl border border-slate-200 shadow-sm p-4 overflow-hidden">
        <DealKanbanBoard deals={deals} onDealMove={handleDealMove} />
      </div>
    </div>
  )
}

