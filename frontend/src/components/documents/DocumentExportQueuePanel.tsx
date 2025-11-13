import React from 'react'

import { DocumentExporter } from './DocumentExporter'
import { describeExportFormat, EXPORT_STATUS_LABELS, useDocumentExportQueue } from '../../hooks/useDocumentExportQueue'
import type { DocumentExportStatus } from '../../services/api/documentGeneration'

type DocumentExportQueuePanelProps = {
  documentId: string
  pollIntervalMs?: number
}

const STATUS_BADGE_STYLES: Record<DocumentExportStatus, string> = {
  queued: 'bg-slate-100 text-slate-700',
  processing: 'bg-amber-100 text-amber-800',
  ready: 'bg-emerald-100 text-emerald-800',
  failed: 'bg-red-100 text-red-700',
}

export const DocumentExportQueuePanel: React.FC<DocumentExportQueuePanelProps> = ({
  documentId,
  pollIntervalMs,
}) => {
  const {
    exporting,
    exportNotice,
    exportError,
    exportJobs,
    queueExport,
    downloadExport,
    clearExportError,
    clearExportNotice,
  } = useDocumentExportQueue(documentId, pollIntervalMs)

  const handleQueueExport = async (options: {
    format: string
    margin: number
    fontFamily: string
    includeCoverPage: boolean
  }) => {
    await queueExport({
      format: options.format,
      options: {
        margin: options.margin,
        font_family: options.fontFamily,
        include_cover_page: options.includeCoverPage,
      },
    })
  }

  return (
    <section className="space-y-4" aria-label="Document export controls">
      <DocumentExporter onExport={handleQueueExport} exporting={exporting} />

      {exportNotice ? (
        <div
          role="status"
          className="flex items-start justify-between rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900"
        >
          <span>{exportNotice}</span>
          <button
            type="button"
            className="text-xs font-medium text-emerald-600 hover:text-emerald-800"
            onClick={clearExportNotice}
            aria-label="Dismiss export success message"
          >
            Dismiss
          </button>
        </div>
      ) : null}

      {exportError ? (
        <div
          role="alert"
          className="flex items-start justify-between rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          <span>{exportError}</span>
          <button
            type="button"
            className="text-xs font-medium text-red-700 hover:text-red-900"
            onClick={clearExportError}
            aria-label="Dismiss export error"
          >
            Close
          </button>
        </div>
      ) : null}

      <section
        aria-label="Export queue"
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <header className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Export queue</h3>
            <p className="text-xs text-slate-500">
              Track asynchronous export jobs and download files when they are ready.
            </p>
          </div>
        </header>

        {exportJobs.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500" data-testid="empty-export-queue">
            Queued exports will appear here after you submit a job.
          </p>
        ) : (
          <ul className="mt-4 space-y-3" role="list">
            {exportJobs.map((job) => (
              <li
                key={job.task_id}
                className="rounded-lg border border-slate-200 px-4 py-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {describeExportFormat(job.format)} • Task ID {job.task_id}
                    </p>
                    <p className="text-xs text-slate-500">
                      {job.completed_at ?? job.queued_at
                        ? new Date((job.completed_at ?? job.queued_at) as string).toLocaleString()
                        : 'Status updated just now'}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE_STYLES[job.status]}`}
                    data-testid={`export-status-${job.task_id}`}
                  >
                    {EXPORT_STATUS_LABELS[job.status] ?? job.status}
                  </span>
                </div>

                {job.status === 'ready' && job.download_url ? (
                  <button
                    type="button"
                    className="mt-3 inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    onClick={() => downloadExport(job)}
                  >
                    Download export
                  </button>
                ) : null}

                {job.status === 'failed' && job.failure_reason ? (
                  <p className="mt-2 text-sm text-red-600">{job.failure_reason}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  )
}
