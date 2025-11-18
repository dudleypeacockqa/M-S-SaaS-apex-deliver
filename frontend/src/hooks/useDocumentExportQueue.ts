import { useCallback, useEffect, useRef, useState } from 'react'

import {
  queueDocumentExport,
  listDocumentExportJobs,
  getDocumentExportJob,
  type DocumentExportJob,
  type DocumentExportStatus,
  type ExportRequest,
} from '../services/api/documentGeneration'
import { getAuthHeaders } from '../services/api/client'

const EXPORT_FORMAT_LABELS: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word (.docx)',
  'text/html': 'HTML',
}

const FINAL_STATUSES: DocumentExportStatus[] = ['ready', 'failed']

export const EXPORT_STATUS_LABELS: Record<DocumentExportStatus, string> = {
  queued: 'Queued',
  processing: 'Processing',
  ready: 'Ready',
  failed: 'Failed',
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const getFormatLabel = (format: string): string => EXPORT_FORMAT_LABELS[format] ?? format.toUpperCase()

const isFinalStatus = (status: DocumentExportStatus) => FINAL_STATUSES.includes(status)

type QueueOptions = ExportRequest

type EntitlementDetail = {
  message?: string
  required_tier_label?: string
  upgrade_cta_url?: string
}

const parseEntitlementDetail = (error: unknown): EntitlementDetail | null => {
  if (typeof error !== 'object' || error === null) {
    return null
  }

  const response = (error as { response?: { status?: number; data?: { detail?: unknown } } }).response
  if (!response || response.status !== 403) {
    return null
  }

  const detail = response.data?.detail
  if (typeof detail === 'string') {
    return { message: detail }
  }

  if (detail && typeof detail === 'object') {
    return detail as EntitlementDetail
  }

  return { message: 'Upgrade required to export documents.' }
}

type ExportEntitlementState = {
  message: string
  requiredTierLabel?: string
  upgradeCtaUrl?: string
} | null

export type UseDocumentExportQueueResult = {
  exporting: boolean
  exportNotice: string | null
  exportError: string | null
  exportEntitlement: ExportEntitlementState
  exportJobs: DocumentExportJob[]
  queueExport: (options: QueueOptions) => Promise<void>
  downloadExport: (job: DocumentExportJob) => Promise<void>
  cancelExport: (job: DocumentExportJob) => Promise<void>
  clearExportNotice: () => void
  clearExportError: () => void
  clearExportEntitlement: () => void
}

export function useDocumentExportQueue(
  documentId: string,
  pollIntervalMs = 4000,
): UseDocumentExportQueueResult {
  const [exporting, setExporting] = useState(false)
  const [exportNotice, setExportNotice] = useState<string | null>(null)
  const [exportError, setExportError] = useState<string | null>(null)
  const [exportEntitlement, setExportEntitlement] = useState<ExportEntitlementState>(null)
  const [exportJobs, setExportJobs] = useState<DocumentExportJob[]>([])
  const pollersRef = useRef<Record<string, number>>({})

  const upsertJob = useCallback((job: DocumentExportJob) => {
    setExportJobs((current) => {
      const index = current.findIndex((entry) => entry.task_id === job.task_id)
      if (index === -1) {
        return [job, ...current]
      }
      const next = [...current]
      next[index] = job
      return next
    })
  }, [])

  const clearJobPolling = useCallback((taskId: string) => {
    const timer = pollersRef.current[taskId]
    if (timer) {
      window.clearTimeout(timer)
      delete pollersRef.current[taskId]
    }
  }, [])

  const clearAllPollers = useCallback(() => {
    Object.values(pollersRef.current).forEach((timer) => window.clearTimeout(timer))
    pollersRef.current = {}
  }, [])

  const pollJobStatus = useCallback(
    (taskId: string) => {
      // Prevent duplicate pollers for the same task
      if (pollersRef.current[taskId]) {
        return
      }

      let cancelled = false

      const poll = async () => {
        // Check if cancelled before making request
        if (cancelled) {
          return
        }

        try {
          const job = await getDocumentExportJob(documentId, taskId)
          
          // Check again after async operation
          if (cancelled) {
            return
          }

          upsertJob(job)
          
          if (isFinalStatus(job.status)) {
            clearJobPolling(taskId)
            return
          }
        } catch (error) {
          // Check if cancelled before handling error
          if (cancelled) {
            return
          }

          console.error('Failed to poll export job', error)
          
          // Update job with error state if possible
          upsertJob({
            task_id: taskId,
            document_id: documentId,
            format: 'unknown',
            status: 'failed',
            download_url: null,
            failure_reason: 'Failed to check job status. Please refresh the page.',
            queued_at: new Date().toISOString(),
            completed_at: null,
          } as DocumentExportJob)
          
          // Stop polling on persistent errors
          clearJobPolling(taskId)
          return
        }

        // Only schedule next poll if not cancelled and not in final status
        if (!cancelled) {
          pollersRef.current[taskId] = window.setTimeout(() => {
            // Clear the ref before polling to allow re-polling if needed
            delete pollersRef.current[taskId]
            void poll()
          }, pollIntervalMs)
        }
      }

      // Start polling
      void poll()

      // Return cleanup function
      return () => {
        cancelled = true
        clearJobPolling(taskId)
      }
    },
    [clearJobPolling, documentId, pollIntervalMs, upsertJob],
  )

  useEffect(() => {
    let cancelled = false

    const loadJobs = async () => {
      try {
        const jobs = await listDocumentExportJobs(documentId)
        if (cancelled) {
          return
        }
        setExportJobs(jobs)
        jobs
          .filter((job) => !isFinalStatus(job.status))
          .forEach((job) => pollJobStatus(job.task_id))
      } catch (error) {
        console.error('Failed to load export jobs', error)
      }
    }

    loadJobs()

    return () => {
      cancelled = true
      clearAllPollers()
    }
  }, [clearAllPollers, documentId, pollJobStatus])

  const queueExport = useCallback(
    async (options: QueueOptions) => {
      setExportNotice(null)
      setExportError(null)
      setExportEntitlement(null)
      setExporting(true)
      try {
        const response = await queueDocumentExport(documentId, options)
        const queuedJob: DocumentExportJob = {
          task_id: response.task_id,
          document_id: documentId,
          format: response.format,
          status: response.status,
          download_url: null,
          failure_reason: null,
          queued_at: new Date().toISOString(),
          completed_at: null,
        }
        upsertJob(queuedJob)
        setExportNotice(`Export queued: ${getFormatLabel(response.format)} • Task ID ${response.task_id}`)
        pollJobStatus(response.task_id)
      } catch (error) {
        const entitlement = parseEntitlementDetail(error)
        if (entitlement) {
          setExportEntitlement({
            message: entitlement.message ?? 'Upgrade required to export documents.',
            requiredTierLabel: entitlement.required_tier_label ?? undefined,
            upgradeCtaUrl: entitlement.upgrade_cta_url ?? undefined,
          })
        } else {
          setExportError('Failed to queue export. Please try again.')
        }
      } finally {
        setExporting(false)
      }
    },
    [documentId, pollJobStatus, upsertJob],
  )

  const cancelExport = useCallback(
    async (job: DocumentExportJob) => {
      // Stop polling for this job
      clearJobPolling(job.task_id)
      
      // Update job status to cancelled (local state only)
      // Note: Backend doesn't support cancellation yet, so this is UI-only
      upsertJob({
        ...job,
        status: 'failed' as DocumentExportStatus,
        failure_reason: 'Cancelled by user',
        completed_at: new Date().toISOString(),
      })
      
      setExportNotice(`Export cancelled: ${getFormatLabel(job.format)} • Task ID ${job.task_id}`)
    },
    [clearJobPolling, upsertJob],
  )

  const downloadExport = useCallback(
    async (job: DocumentExportJob) => {
      if (!job.download_url) {
        setExportError('Download URL not available. The export may still be processing.')
        return
      }

      try {
        const downloadUrl = job.download_url.startsWith('http')
          ? job.download_url
          : `${API_BASE_URL}${job.download_url}`
        const headers = await getAuthHeaders('')
        const response = await fetch(downloadUrl, { headers })
        if (!response.ok) {
          throw new Error(`Download failed: ${response.status} ${response.statusText}`)
        }

        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = `${job.document_id}-${job.task_id}`
        anchor.rel = 'noopener'
        anchor.click()
        window.setTimeout(() => {
          URL.revokeObjectURL(url)
        }, 100)
        
        setExportNotice(`Download started: ${getFormatLabel(job.format)}`)
      } catch (error) {
        console.error('Failed to download export', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        setExportError(`Failed to download export: ${errorMessage}. Please try again from the queue.`)
      }
    },
    [],
  )

  return {
    exporting,
    exportNotice,
    exportError,
    exportJobs,
    queueExport,
    downloadExport,
    cancelExport,
    clearExportNotice: () => setExportNotice(null),
    clearExportError: () => setExportError(null),
    exportEntitlement,
    clearExportEntitlement: () => setExportEntitlement(null),
  }
}

export const describeExportFormat = getFormatLabel
