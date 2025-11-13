import React, { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'

import DocumentWorkspace from '../documents/DocumentWorkspace'

interface EntitlementState {
  message: string
  requiredTierLabel?: string
  upgradeUrl?: string
}

export const DataRoom: React.FC = () => {
  const { dealId } = useParams<{ dealId: string }>()
  const [entitlementGate, setEntitlementGate] = useState<EntitlementState | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (!dealId) {
    throw new Error('dealId param is required to render DataRoom')
  }

  const handleDocumentsLoaded = useCallback(() => {
    setEntitlementGate(null)
    setError(null)
  }, [])

  const handleDocumentError = useCallback((err: unknown) => {
    const status = (err as { status?: number })?.status ?? (err as { response?: { status?: number } })?.response?.status
    if (status === 403) {
      const detail = (err as { data?: { detail?: Record<string, string> } })?.data?.detail ?? {}
      setEntitlementGate({
        message: detail.message ?? 'Upgrade to access the secure data room.',
        requiredTierLabel: detail.required_tier_label,
        upgradeUrl: detail.upgrade_cta_url,
      })
      setError(null)
      return
    }

    setError(err instanceof Error ? err.message : 'Failed to load documents')
  }, [])

  return (
    <section data-testid="deal-documents" className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">Data Room</h1>
        <p className="text-sm text-slate-500">
          Organise diligence files, manage permissions, and keep stakeholders aligned.
        </p>
      </header>

      {error && !entitlementGate && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-600">
          {error}
        </div>
      )}

      {entitlementGate ? (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-6">
          <h2 className="text-base font-semibold text-indigo-900">Access restricted</h2>
          <p className="mt-2 text-sm text-indigo-800">{entitlementGate.message}</p>
          {entitlementGate.requiredTierLabel && (
            <p className="mt-1 text-xs font-medium text-indigo-700">
              Required tier: {entitlementGate.requiredTierLabel}
            </p>
          )}
          {entitlementGate.upgradeUrl && (
            <a
              className="mt-3 inline-flex items-center text-sm font-medium text-indigo-700 underline"
              href={entitlementGate.upgradeUrl}
            >
              View pricing plans
            </a>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white/60 p-2 shadow-sm">
          <DocumentWorkspace
            dealId={dealId}
            onDocumentsLoaded={handleDocumentsLoaded}
            onError={handleDocumentError}
          />
        </div>
      )}
    </section>
  )
}
