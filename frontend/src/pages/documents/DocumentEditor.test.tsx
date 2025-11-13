import React from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { screen, waitFor, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { renderWithQueryClient } from '../../setupTests'
import { DocumentEditor } from './DocumentEditor'

vi.mock('../../services/api/documentGeneration', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../services/api/documentGeneration')>().catch(() => ({}))
  return {
    ...actual,
    fetchDocument: vi.fn(),
    saveDocument: vi.fn(),
    listTemplates: vi.fn(),
    applyTemplateToDocument: vi.fn(),
    fetchAISuggestions: vi.fn(),
    acceptAISuggestion: vi.fn(),
    rejectAISuggestion: vi.fn(),
    listDocumentVersions: vi.fn(),
    restoreDocumentVersion: vi.fn(),
    subscribeToPresence: vi.fn(),
  }
})

vi.mock('../../components/documents/DocumentExportQueuePanel', () => ({
  DocumentExportQueuePanel: () => <div data-testid="document-export-queue-panel" />,
}))

const DEFAULT_DOCUMENT_ID = 'doc-123'
const DEFAULT_DEAL_ID = 'deal-789'

const createRender = () =>
  renderWithQueryClient(
    <DocumentEditor
      documentId={DEFAULT_DOCUMENT_ID}
      dealId={DEFAULT_DEAL_ID}
      autoSaveDelayMs={0}
    />
  )

describe('DocumentEditor', () => {
  const documentApiPromise = import('../../services/api/documentGeneration')

  beforeEach(async () => {
    const documentApi = await documentApiPromise

    vi.useRealTimers()
    vi.clearAllTimers()
    vi.clearAllMocks()

    vi.mocked(documentApi.fetchDocument).mockResolvedValue({
      id: DEFAULT_DOCUMENT_ID,
      title: 'Acquisition Overview',
      content: '<p>Initial summary content.</p>',
      updated_at: '2025-10-28T10:00:00Z',
      last_saved_by: 'Alex Analyst',
    })

    vi.mocked(documentApi.saveDocument).mockResolvedValue({
      id: DEFAULT_DOCUMENT_ID,
      status: 'saved',
    })

    vi.mocked(documentApi.listTemplates).mockResolvedValue([
      {
        id: 'template-1',
        name: 'Executive Summary',
        category: 'Acquisition',
        description: 'High-level overview for board decks',
        last_updated: '2025-07-10T09:00:00Z',
        estimated_length: '2 pages',
        industries: ['Software', 'Services'],
        tags: ['executive', 'summary'],
        sample_excerpt: 'This document outlines the key highlights...'
      },
      {
        id: 'template-2',
        name: 'Due Diligence Checklist',
        category: 'Operations',
        description: 'Structured diligence tracker',
        last_updated: '2025-08-14T15:00:00Z',
        estimated_length: '3 pages',
        industries: ['Manufacturing'],
        tags: ['checklist'],
        sample_excerpt: 'Use this checklist to track diligence items.'
      },
    ])

    vi.mocked(documentApi.applyTemplateToDocument).mockResolvedValue({
      generated_document_id: DEFAULT_DOCUMENT_ID,
      generated_content: '<h1>Executive Summary</h1><p>Template content...</p>',
      file_path: '/tmp/document.pdf',
      status: 'generated',
    })

    vi.mocked(documentApi.fetchAISuggestions).mockResolvedValue([
      {
        id: 'suggestion-1',
        title: 'Add financial performance section',
        content: 'Include a summary of YoY revenue growth and EBITDA margins.',
        confidence: 0.81,
        reasoning: 'Detected missing performance overview',
      },
      {
        id: 'suggestion-2',
        title: 'Clarify integration risks',
        content: 'Highlight integration challenges and mitigation strategies.',
        confidence: 0.72,
        reasoning: 'Risk section is currently brief',
      },
    ])

    vi.mocked(documentApi.acceptAISuggestion).mockResolvedValue({
      id: 'suggestion-1',
      status: 'accepted',
      content: 'Include a summary of YoY revenue growth and EBITDA margins.',
    })

    vi.mocked(documentApi.rejectAISuggestion).mockResolvedValue({
      id: 'suggestion-2',
      status: 'rejected',
    })


    vi.mocked(documentApi.listDocumentVersions).mockResolvedValue([
      {
        id: 'version-3',
        label: 'v3',
        created_at: '2025-10-27T18:00:00Z',
        created_by: 'Jordan Manager',
        summary: 'Added integration section',
      },
      {
        id: 'version-2',
        label: 'v2',
        created_at: '2025-10-26T14:30:00Z',
        created_by: 'Alex Analyst',
        summary: 'Expanded executive summary',
      },
    ])

    vi.mocked(documentApi.restoreDocumentVersion).mockResolvedValue({
      id: DEFAULT_DOCUMENT_ID,
      content: '<p>Restored version content.</p>',
      restored_from_version_id: 'version-2',
    })

    const unsubscribeSpy = vi.fn()
    vi.mocked(documentApi.subscribeToPresence).mockImplementation((_documentId, callback) => {
      callback([
        { user_id: 'user-1', name: 'Alex Analyst', status: 'editing' },
        { user_id: 'user-2', name: 'Taylor Partner', status: 'reviewing' },
      ])
      return unsubscribeSpy
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('loads the document and supports rich text editing with autosave', async () => {
    const documentApi = await documentApiPromise

    createRender()

    const editorRegion = await screen.findByRole('textbox', { name: /document content editor/i })
    await waitFor(() => {
      expect(editorRegion).toHaveTextContent('Initial summary content.')
    })

    await userEvent.click(editorRegion)
    await userEvent.type(editorRegion, ' Updated with new findings.')

    await waitFor(() => {
      expect(documentApi.saveDocument).toHaveBeenCalled()
    })

    const lastCall = vi.mocked(documentApi.saveDocument).mock.calls.at(-1)
    expect(lastCall?.[0]).toBe(DEFAULT_DOCUMENT_ID)
    expect(lastCall?.[1]).toEqual(
      expect.objectContaining({
        content: expect.stringContaining('Updated with new findings.'),
        title: 'Acquisition Overview',
      })
    )
  })

  it('renders the export queue panel', async () => {
    createRender()
    expect(await screen.findByTestId('document-export-queue-panel')).toBeInTheDocument()
  })

  it('applies a selected template and updates the editor content', async () => {
    const documentApi = await documentApiPromise

    createRender()

    const templateButton = await screen.findByRole('button', { name: /use template executive summary/i })
    await userEvent.click(templateButton)

    await waitFor(() => {
      expect(documentApi.applyTemplateToDocument).toHaveBeenCalledWith(DEFAULT_DOCUMENT_ID, 'template-1', {
        dealId: DEFAULT_DEAL_ID,
      })
    })

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /document content editor/i })).toHaveTextContent('Executive Summary')
    })
  })

  it('surfaces AI suggestions and handles accept, reject, and regenerate flows', async () => {
    const documentApi = await documentApiPromise

    createRender()

    const suggestion = await screen.findByRole('heading', { name: /add financial performance section/i })
    expect(suggestion).toBeInTheDocument()

    const acceptButton = screen.getByRole('button', { name: /accept suggestion "add financial performance section"/i })
    await userEvent.click(acceptButton)

    await waitFor(() => {
      expect(documentApi.acceptAISuggestion).toHaveBeenCalledWith(DEFAULT_DOCUMENT_ID, 'suggestion-1')
    })

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /document content editor/i })).toHaveTextContent('revenue growth')
    })

    const rejectButton = screen.getByRole('button', { name: /reject suggestion "clarify integration risks"/i })
    await userEvent.click(rejectButton)

    await waitFor(() => {
      expect(documentApi.rejectAISuggestion).toHaveBeenCalledWith(DEFAULT_DOCUMENT_ID, 'suggestion-2')
    })

    vi.mocked(documentApi.fetchAISuggestions).mockResolvedValueOnce([
      {
        id: 'suggestion-3',
        title: 'Add valuation summary',
        content: 'Summarise valuation multiples and methodology.',
        confidence: 0.75,
        reasoning: 'Valuation details missing from overview',
      },
    ])

    const regenerateButton = screen.getByRole('button', { name: /regenerate suggestions/i })
    await userEvent.click(regenerateButton)

    await waitFor(() => {
      expect(documentApi.fetchAISuggestions).toHaveBeenCalledTimes(2)
      expect(screen.getByRole('heading', { name: /add valuation summary/i })).toBeInTheDocument()
    })
  })

  it('lists version history and restores a selected version into the editor', async () => {
    const documentApi = await documentApiPromise

    createRender()

    const versionButton = await screen.findByRole('button', { name: /restore version v2/i })
    await userEvent.click(versionButton)

    await waitFor(() => {
      expect(documentApi.restoreDocumentVersion).toHaveBeenCalledWith(DEFAULT_DOCUMENT_ID, 'version-2')
    })

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /document content editor/i })).toHaveTextContent('Restored version content')
    })
  })

  it('shows active collaborators and updates presence on subscription events', async () => {
    const documentApi = await documentApiPromise

    createRender()

    const presenceList = await screen.findByRole('list', { name: /active collaborators/i })
    expect(presenceList).toHaveTextContent('Alex Analyst')
    expect(presenceList).toHaveTextContent('Taylor Partner')

    const presenceCallback = vi.mocked(documentApi.subscribeToPresence).mock.calls[0][1]
    await act(async () => {
      presenceCallback([
        { user_id: 'user-3', name: 'Morgan Finance', status: 'viewing' },
      ])
    })

    await waitFor(() => {
      expect(presenceList).toHaveTextContent('Morgan Finance')
      expect(presenceList).not.toHaveTextContent('Taylor Partner')
    })
  })

  it('surfaces keyboard shortcuts to accelerate editing workflows', async () => {
    createRender()

    const shortcutsTrigger = await screen.findByRole('button', { name: /show keyboard shortcuts/i })
    await userEvent.click(shortcutsTrigger)

    expect(
      screen.getByRole('dialog', { name: /keyboard shortcuts/i })
    ).toHaveTextContent('Ctrl + B')
  })

  it('handles save errors gracefully and displays retry messaging', async () => {
    const documentApi = await documentApiPromise
    vi.mocked(documentApi.saveDocument).mockRejectedValueOnce(new Error('Network failure'))

    createRender()

    const editorRegion = await screen.findByRole('textbox', { name: /document content editor/i })
    await userEvent.type(editorRegion, '!')

    await waitFor(() => {
      expect(documentApi.saveDocument).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(screen.getByText(/auto-save failed/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /retry save/i })).toBeInTheDocument()
    })

    const retryButton = screen.getByRole('button', { name: /retry save/i })
    await userEvent.click(retryButton)

    await waitFor(() => {
      expect(documentApi.saveDocument).toHaveBeenCalledTimes(2)
    })
  })

  it('updates context for AI suggestions when the user provides additional details', async () => {
    const documentApi = await documentApiPromise

    createRender()

    const contextInput = await screen.findByLabelText(/ai context/i)
    await userEvent.type(contextInput, 'Focus on cross-selling opportunities')

    const refreshButton = screen.getByRole('button', { name: /regenerate suggestions/i })
    await userEvent.click(refreshButton)

    await waitFor(() => {
      expect(documentApi.fetchAISuggestions).toHaveBeenLastCalledWith(
        DEFAULT_DOCUMENT_ID,
        expect.objectContaining({
          context: 'Focus on cross-selling opportunities',
        })
      )
    })
  })
})
