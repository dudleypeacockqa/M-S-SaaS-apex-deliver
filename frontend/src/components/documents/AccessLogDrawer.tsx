import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import {
  listDocumentAccessLogs,
  type DocumentAccessLogEntry,
} from '../../services/api/documents'

interface AccessLogDrawerProps {
  dealId: string
  documentId: string | null
  documentName?: string | null
  isOpen: boolean
  onClose: () => void
  limit?: number
}

const formatTimestamp = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))

const logQueryKey = (dealId: string, documentId: string | null, limit: number | undefined) => [
  'document-access-logs',
  dealId,
  documentId,
  limit ?? 'default',
]

export const AccessLogDrawer = ({
  dealId,
  documentId,
  documentName,
  isOpen,
  onClose,
  limit = 100,
}: AccessLogDrawerProps) => {
  const [filterAction, setFilterAction] = useState<'all' | string>('all')
  const enabled = isOpen && Boolean(documentId)

  const query = useQuery<DocumentAccessLogEntry[]>({
    enabled,
    queryKey: logQueryKey(dealId, documentId, limit),
    queryFn: () => listDocumentAccessLogs(dealId, documentId!, { limit }),
    staleTime: 30_000,
    suspense: false,
  })

  const logs = query.data ?? []
  const errorMessage = query.error instanceof Error ? query.error.message : 'Unable to load access logs.'
  const actionOptions = useMemo(
    () => Array.from(new Set(logs.map((entry) => entry.action))).sort(),
    [logs]
  )
  const filteredLogs = useMemo(
    () => (filterAction === 'all' ? logs : logs.filter((entry) => entry.action === filterAction)),
    [logs, filterAction]
  )

  useEffect(() => {
    if (!isOpen) {
      setFilterAction('all')
    }
  }, [isOpen, documentId])

  const title = useMemo(() => {
    if (!documentName) return 'Document activity'
    return `Activity • ${documentName}`
  }, [documentName])

  const handleDownloadCsv = () => {
    if (!filteredLogs.length) {
      return
    }

    const rows = filteredLogs.map((log) => [
      formatTimestamp(log.created_at),
      log.user_name ?? log.user_id,
      log.action,
      log.ip_address ?? '',
      log.user_agent ?? '',
    ])
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'IP', 'User Agent'].join(','),
      ...rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    const baseName = (documentName || 'document').replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)/g, '') || 'document'
    anchor.href = url
    anchor.download = `${baseName}-activity.csv`
    anchor.rel = 'noopener'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  if (!isOpen) {
    return null
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Document activity log"
      className="fixed inset-0 z-40 flex"
    >
      <div
        className="flex-1 bg-slate-900/30"
        aria-hidden="true"
        onClick={onClose}
      />
      <div className="relative h-full w-full max-w-md bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Audit log</p>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close access log drawer"
            className="rounded border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
        </header>

        <div className="border-b border-slate-100 px-5 py-3 text-sm text-slate-600">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {actionOptions.length > 1 ? (
              <label className="flex flex-col text-xs font-medium text-slate-600" htmlFor="access-log-filter">
                <span>Action filter</span>
                <select
                  id="access-log-filter"
                  value={filterAction}
                  onChange={(event) => setFilterAction(event.target.value)}
                  className="mt-1 rounded border border-slate-300 px-2 py-1 text-sm"
                >
                  <option value="all">All actions</option>
                  {actionOptions.map((action) => (
                    <option key={action} value={action}>
                      {action}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <div aria-hidden className="text-xs text-slate-400">
                Showing {filteredLogs.length} event{filteredLogs.length === 1 ? '' : 's'}
              </div>
            )}

            <button
              type="button"
              onClick={handleDownloadCsv}
              disabled={!filteredLogs.length || query.isLoading || query.isError}
              className="inline-flex items-center justify-center rounded border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Download CSV
            </button>
          </div>
        </div>

        <div className="flex h-[calc(100%_-_7rem)] flex-col">
          {query.isLoading ? (
            <div className="flex flex-1 items-center justify-center text-sm text-slate-500">
              Loading activity…
            </div>
          ) : query.isError ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 text-center text-sm text-rose-600">
              <p>{errorMessage}</p>
              <button
                type="button"
                onClick={() => query.refetch()}
                className="rounded border border-rose-200 px-3 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50"
              >
                Retry
              </button>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 px-5 text-center text-sm text-slate-500">
              <p>No activity recorded yet.</p>
              <p className="text-xs text-slate-400">Viewing or downloading this document will add entries here.</p>
            </div>
          ) : (
            <ul className="flex-1 divide-y divide-slate-100 overflow-y-auto">
              {filteredLogs.map((log) => (
                <li key={log.id} className="px-5 py-4">
                  <p className="text-sm font-medium text-slate-900">
                    {log.user_name ?? log.user_id}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-slate-500">{log.action}</p>
                  <p className="mt-1 text-xs text-slate-500">{formatTimestamp(log.created_at)}</p>
                  {(log.ip_address || log.user_agent) && (
                    <p className="mt-2 text-xs text-slate-400">
                      {log.ip_address && <span>IP: {log.ip_address}</span>}
                      {log.ip_address && log.user_agent && <span className="px-1">•</span>}
                      {log.user_agent && <span>{log.user_agent}</span>}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default AccessLogDrawer
