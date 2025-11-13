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

      <div className="grid gap-6 md:grid-cols-[260px,1fr]">
        <aside className="space-y-3">
          <button
            type="button"
            onClick={() => handleFolderSelect(null)}
            className={`w-full rounded-md px-3 py-2 text-sm text-left ${
              selectedFolderId === null
                ? 'bg-indigo-50 font-semibold text-indigo-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All documents
          </button>
          <FolderTree
            dealId={dealId}
            selectedFolderId={selectedFolderId}
            onFolderSelect={handleFolderSelect}
          />
        </aside>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={uploading}
            >
              Upload document
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept={ALLOWED_FILE_TYPES.join(',')}
              onChange={handleFileUpload}
            />
            {uploading && (
              <span className="text-sm text-slate-500" role="status">
                {uploadMessage ?? 'Uploading...'}
              </span>
            )}
          </div>

          {error && (
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
            <>
              <DocumentList
                dealId={dealId}
                folderId={selectedFolderId}
                onSelectionChange={handleSelectionChange}
                onError={handleDocumentError}
                onDocumentsLoaded={handleDocumentsLoaded}
                resetSelectionSignal={selectionResetSignal}
                onManagePermissions={handleManagePermissions}
              />

              {selectedDocuments.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <BulkActions
                    dealId={dealId}
                    selectedDocuments={selectedDocuments}
                    onClearSelection={handleClearSelection}
                    onRefresh={invalidateDocuments}
                  />
                  {selectedDocuments.length === 1 && (
                    <button
                      type="button"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      onClick={() => handleManagePermissions(selectedDocuments[0])}
                    >
                      Manage access
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <PermissionModal
        documentId={permissionDocumentId ?? ''}
        isOpen={isPermissionModalOpen && permissionDocumentId !== null}
        onClose={handlePermissionModalClose}
      />
    </section>
  )
}
