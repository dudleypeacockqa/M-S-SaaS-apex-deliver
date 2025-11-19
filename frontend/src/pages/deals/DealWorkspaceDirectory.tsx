import React, { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Layers, FolderKanban, LineChart, BarChart3, FileSpreadsheet, Building, type LucideIcon } from 'lucide-react'

import { listDeals, type Deal } from '../../services/api/deals'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Spinner } from '../../components/ui/Spinner'

interface WorkspaceDefinition {
  id: string
  label: string
  description: string
  icon: LucideIcon
  destination: (dealId?: string) => string
  hideDealSelector?: boolean
}

const WORKSPACES = [
  {
    id: 'details',
    label: 'Deal Details',
    description: 'Full diligence dossier with tabs for strategy, value creation, and integration notes.',
    icon: Layers,
    destination: (dealId?: string) => `/deals/${dealId ?? ''}`,
  },
  {
    id: 'data-room',
    label: 'Data Room',
    description: 'Secure document room with access logs, watermarks, and AI document assistant.',
    icon: FolderKanban,
    destination: (dealId?: string) => `/deals/${dealId ?? ''}/data-room`,
  },
  {
    id: 'valuation',
    label: 'Valuation Suite',
    description: 'DCF engine, comparables, precedent transactions, and Monte Carlo modeling.',
    icon: LineChart,
    destination: (dealId?: string) => `/deals/${dealId ?? ''}/valuation`,
  },
  {
    id: 'financial',
    label: 'Financial Intelligence',
    description: '47 ratio library, accounting integrations, and historical trend insights.',
    icon: BarChart3,
    destination: (dealId?: string) => `/deals/${dealId ?? ''}/financial`,
  },
  {
    id: 'documents',
    label: 'Document Workspace',
    description: 'Versioning, AI Q&A, workflow automation, and granular permissions.',
    icon: FileSpreadsheet,
    destination: (dealId?: string) => `/deals/${dealId ?? ''}/documents`,
  },
  {
    id: 'pmi',
    label: 'PMI Project',
    description: 'PMO control tower for day-one readiness, risk register, and synergy tracking.',
    icon: Building,
    destination: () => '/pmi/projects',
    hideDealSelector: true,
  },
] as const satisfies ReadonlyArray<WorkspaceDefinition>

type WorkspaceId = (typeof WORKSPACES)[number]['id']

export const DealWorkspaceDirectory: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId?: WorkspaceId }>()
  const navigate = useNavigate()
  const [selection, setSelection] = useState<Partial<Record<WorkspaceId, string>>>({})

  const { data, isLoading, isError } = useQuery({
    queryKey: ['deal-workspace-directory'],
    queryFn: () => listDeals({ include_archived: false }),
  })

  const deals = data?.items ?? []
  const highlightedWorkspace = workspaceId ?? WORKSPACES[0].id

  const handleLaunch = (id: WorkspaceId) => {
    const workspace = WORKSPACES.find((space) => space.id === id)
    if (!workspace) return

    if (workspace.hideDealSelector) {
      navigate(workspace.destination(selection[id] || deals[0]?.id || undefined))
      return
    }

    const targetDeal = selection[id] || deals[0]?.id
    if (!targetDeal) return
    navigate(workspace.destination(targetDeal))
  }

  const renderDealSelector = (id: WorkspaceId) => {
    if (deals.length === 0) {
      return (
        <p className="text-sm text-slate-500">
          Create your first deal to unlock workspaces.
        </p>
      )
    }

    return (
      <div className="flex flex-col gap-2">
        <label className="text-xs uppercase tracking-wide text-slate-400">Select Deal</label>
        <select
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          value={selection[id] ?? deals[0]?.id ?? ''}
          onChange={(event) => setSelection((prev) => ({ ...prev, [id]: event.target.value }))}
        >
          {deals.map((deal: Deal) => (
            <option key={deal.id} value={deal.id}>
              {deal.name}
            </option>
          ))}
        </select>
        <Button
          type="button"
          className="justify-center"
          onClick={() => handleLaunch(id)}
          disabled={deals.length === 0}
        >
          Launch Workspace
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Deal Operating System</p>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Workspace Directory</h1>
              <p className="text-base text-slate-600">
                Jump into any workspace with a single click. Pick a deal and launch detailed diligence hubs instantly.
              </p>
            </div>
            <Link
              to="/deals/new"
              className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              New Deal
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <Badge variant="primary">{deals.length} deals</Badge>
            <span>FP&A + PMI ready</span>
          </div>
        </header>

        {isLoading && (
          <div className="flex items-center justify-center rounded-lg border border-slate-200 bg-white py-12">
            <Spinner />
          </div>
        )}

        {isError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Unable to load deals. Please refresh the page.
          </div>
        )}

        {!isLoading && !isError && deals.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
            <p className="text-lg font-semibold text-slate-900">No deals yet</p>
            <p className="mt-2 text-sm text-slate-500">Create a deal to unlock valuation, financial, and PMI workspaces.</p>
            <Link
              to="/deals/new"
              className="mt-4 inline-flex items-center rounded-md border border-indigo-600 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
            >
              Start a Deal
            </Link>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {WORKSPACES.map((workspace) => {
            const Icon = workspace.icon
            const isActive = highlightedWorkspace === workspace.id

            return (
              <Card
                key={workspace.id}
                padding="none"
                className={`flex h-full flex-col justify-between border transition-shadow ${
                  isActive ? 'border-indigo-500 shadow-lg shadow-indigo-100' : 'border-slate-200 hover:shadow-md'
                }`}
              >
                <div className="space-y-4 p-6">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Workspace</p>
                      <h2 className="text-xl font-semibold text-slate-900">{workspace.label}</h2>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500">{workspace.description}</p>
                </div>
                <div className="border-t border-slate-100 bg-slate-50/60 p-6">
                  {workspace.hideDealSelector ? (
                    <Button type="button" variant="secondary" onClick={() => navigate(workspace.destination(selection[workspace.id] || undefined))}>
                      Open Module
                    </Button>
                  ) : (
                    renderDealSelector(workspace.id)
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default DealWorkspaceDirectory
