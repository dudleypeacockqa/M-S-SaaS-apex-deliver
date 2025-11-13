import React from 'react'
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { renderWithQueryClient } from '../../setupTests'
import { DocumentExportQueuePanel } from './DocumentExportQueuePanel'

vi.mock('../../services/api/documentGeneration', () => ({
  queueDocumentExport: vi.fn(),
  listDocumentExportJobs: vi.fn(),
  getDocumentExportJob: vi.fn(),
}))

vi.mock('../../services/api/client', () => ({
  getAuthHeaders: vi.fn().mockResolvedValue({}),
}))

const apiPromise = import('../../services/api/documentGeneration')

describe('DocumentExportQueuePanel', () => {
  beforeEach(async () => {
    const api = await apiPromise
    vi.clearAllMocks()
    vi.mocked(api.listDocumentExportJobs).mockResolvedValue([])
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('queues an export and polls until ready', async () => {
    vi.useFakeTimers()
    const api = await apiPromise

    vi.mocked(api.queueDocumentExport).mockResolvedValueOnce({
      task_id: 'task-1',
      status: 'queued',
      format: 'application/pdf',
    })

    vi.mocked(api.getDocumentExportJob)
      .mockResolvedValueOnce({
        task_id: 'task-1',
        document_id: 'doc-123',
        format: 'application/pdf',
        status: 'queued',
        download_url: null,
      })
      .mockResolvedValueOnce({
        task_id: 'task-1',
        document_id: 'doc-123',
        format: 'application/pdf',
        status: 'ready',
        download_url: '/exports/doc-123.pdf',
      })

    renderWithQueryClient(
      <DocumentExportQueuePanel documentId="doc-123" pollIntervalMs={50} />,
    )

    const queueButton = await screen.findByRole('button', { name: /queue export/i })
    await userEvent.click(queueButton)

    await waitFor(() => expect(api.queueDocumentExport).toHaveBeenCalled())

    await act(async () => {
      vi.advanceTimersByTime(50)
    })

    await waitFor(() => expect(api.getDocumentExportJob).toHaveBeenCalled())

    await act(async () => {
      vi.advanceTimersByTime(50)
    })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /download export/i })).toBeInTheDocument()
    })
  })

  it('displays entitlement error when queueing is forbidden', async () => {
    const api = await apiPromise
    vi.mocked(api.queueDocumentExport).mockRejectedValueOnce({
      response: {
        status: 403,
        data: {
          detail: {
            message: 'Upgrade to the Pro tier to export documents.',
          },
        },
      },
    })

    renderWithQueryClient(<DocumentExportQueuePanel documentId="doc-123" />)

    const queueButton = await screen.findByRole('button', { name: /queue export/i })
    await userEvent.click(queueButton)

    await waitFor(() => {
      expect(
        screen.getByText(/upgrade to the pro tier to export documents/i),
      ).toBeInTheDocument()
    })
  })

  it('shows existing queued jobs from the API', async () => {
    const api = await apiPromise
    vi.mocked(api.listDocumentExportJobs).mockResolvedValueOnce([
      {
        task_id: 'task-existing',
        document_id: 'doc-123',
        format: 'text/html',
        status: 'processing',
        download_url: null,
        failure_reason: null,
        queued_at: '2025-11-14T10:00:00Z',
        completed_at: null,
      },
    ])

    renderWithQueryClient(<DocumentExportQueuePanel documentId="doc-123" />)

    await waitFor(() => {
      expect(screen.getByText(/task id task-existing/i)).toBeInTheDocument()
      expect(screen.getByText(/processing/i)).toBeInTheDocument()
    })
  })
})
