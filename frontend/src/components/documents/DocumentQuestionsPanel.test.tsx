import React from 'react'
import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DocumentQuestionsPanel } from './DocumentQuestionsPanel'
import type { Document } from '../../services/api/documents'

const documentApiMocks = vi.hoisted(() => ({
  list: vi.fn(),
  create: vi.fn(),
  resolve: vi.fn(),
}))

vi.mock('../../services/api/documents', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../services/api/documents')>()
  return {
    ...actual,
    listDocumentQuestions: documentApiMocks.list,
    createDocumentQuestion: documentApiMocks.create,
    resolveDocumentQuestion: documentApiMocks.resolve,
  }
})

const mockDocument: Document = {
  id: 'doc-1',
  name: 'Investment_Memo.pdf',
  file_size: 1024,
  file_type: 'application/pdf',
  deal_id: 'deal-1',
  folder_id: null,
  organization_id: 'org-1',
  uploaded_by: 'user-1',
  version: 1,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: null,
  archived_at: null,
}

type PanelOverrides = Partial<React.ComponentProps<typeof DocumentQuestionsPanel>>

const renderPanel = (document: Document | null, overrides: PanelOverrides = {}) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <DocumentQuestionsPanel dealId="deal-1" document={document} onClose={() => undefined} {...overrides} />
    </QueryClientProvider>
  )
}

describe('DocumentQuestionsPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    documentApiMocks.list.mockResolvedValue({ total: 0, items: [] })
    documentApiMocks.create.mockResolvedValue({
      id: 'question-1',
      document_id: 'doc-1',
      organization_id: 'org-1',
      question: 'placeholder',
      status: 'open',
      asked_by: 'user-1',
      asked_by_name: 'Test User',
      answer: null,
      answered_by: null,
      answered_by_name: null,
      answered_at: null,
      created_at: '2025-01-01T10:00:00Z',
      updated_at: null,
    })
    documentApiMocks.resolve.mockResolvedValue({
      id: 'question-1',
      document_id: 'doc-1',
      organization_id: 'org-1',
      question: 'placeholder',
      status: 'resolved',
      asked_by: 'user-1',
      asked_by_name: 'Test User',
      answer: 'Resolved',
      answered_by: 'user-2',
      answered_by_name: 'Answering User',
      answered_at: '2025-01-02T10:00:00Z',
      created_at: '2025-01-01T10:00:00Z',
      updated_at: '2025-01-02T10:00:00Z',
    })
  })

  it('prompts user to select a document when none is active', () => {
    renderPanel(null)
    expect(screen.getByText(/select a document to view q&a/i)).toBeInTheDocument()
  })

  it('renders questions from the API', async () => {
    documentApiMocks.list.mockResolvedValueOnce({
      total: 1,
      items: [
        {
          id: 'question-42',
          document_id: 'doc-1',
          organization_id: 'org-1',
          question: 'Has legal approved this?',
          status: 'open',
          asked_by: 'user-1',
          asked_by_name: 'Deal Owner',
          answer: null,
          answered_by: null,
          answered_by_name: null,
          answered_at: null,
          created_at: '2025-02-01T09:00:00Z',
          updated_at: null,
        },
      ],
    })

    renderPanel(mockDocument)

    expect(await screen.findByText('Has legal approved this?')).toBeInTheDocument()
    expect(screen.getByText('Deal Owner')).toBeInTheDocument()
  })

  it('submits a new question', async () => {
    renderPanel(mockDocument)

    const textarea = await screen.findByPlaceholderText(/ask a question/i)
    fireEvent.change(textarea, { target: { value: 'Need updated audited numbers?' } })
    fireEvent.click(screen.getByRole('button', { name: /send question/i }))

    await waitFor(() => {
      expect(documentApiMocks.create).toHaveBeenCalledWith('deal-1', 'doc-1', {
        question: 'Need updated audited numbers?'
      })
    })
  })

  it('resolves a question with an answer', async () => {
    documentApiMocks.list.mockResolvedValueOnce({
      total: 1,
      items: [
        {
          id: 'question-99',
          document_id: 'doc-1',
          organization_id: 'org-1',
          question: 'Is the signature page executed?',
          status: 'open',
          asked_by: 'user-1',
          asked_by_name: 'Analyst',
          answer: null,
          answered_by: null,
          answered_by_name: null,
          answered_at: null,
          created_at: '2025-02-02T09:00:00Z',
          updated_at: null,
        },
      ],
    })

    renderPanel(mockDocument)

    const resolveButton = await screen.findByRole('button', { name: /resolve/i })
    fireEvent.click(resolveButton)
    const answerBox = screen.getByPlaceholderText(/add answer/i)
    fireEvent.change(answerBox, { target: { value: 'Yes, signed yesterday.' } })
    fireEvent.click(screen.getByRole('button', { name: /submit answer/i }))

    await waitFor(() => {
      expect(documentApiMocks.resolve).toHaveBeenCalledWith('deal-1', 'question-99', {
        answer: 'Yes, signed yesterday.'
      })
    })
  })
})
