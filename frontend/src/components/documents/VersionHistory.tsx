import React from 'react'
import type { DocumentVersionSummary } from '../../services/api/documentGeneration'

type VersionHistoryProps = {
  versions: DocumentVersionSummary[]
  loading?: boolean
  onRestore: (versionId: string) => void
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({
  versions,
  loading = false,
  onRestore,
}) => {
  return (
    <section className="space-y-4" aria-label="Version history">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold text-slate-900">History</h2>
        <p className="text-xs text-slate-500">
          Roll back to a previous snapshot if recent edits missed the mark.
        </p>
      </header>

      {loading ? (
        <div className="space-y-3" aria-busy="true">
          <div className="h-14 animate-pulse rounded-md bg-slate-200" />
          <div className="h-14 animate-pulse rounded-md bg-slate-200" />
          <div className="h-14 animate-pulse rounded-md bg-slate-200" />
        </div>
      ) : versions.length === 0 ? (
        <p className="rounded-md border border-dashed border-slate-300 px-3 py-4 text-sm text-slate-500">
          New documents do not have a change history yet. Keep editing to create checkpoints.
        </p>
      ) : (
        <ul className="space-y-3" role="list">
          {versions.map((version) => (
            <li
              key={version.id}
              className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">{version.label}</p>
                <p className="text-xs text-slate-500">
                  {new Date(version.created_at).toLocaleString()} · {version.created_by || 'Unknown author'}
                </p>
                {version.summary ? (
                  <p className="mt-1 text-xs text-slate-500">{version.summary}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => onRestore(version.id)}
                className="inline-flex items-center justify-center rounded-md border border-indigo-500 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50"
                aria-label={'Restore version ' + version.label}
              >
                {'Restore version ' + version.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
