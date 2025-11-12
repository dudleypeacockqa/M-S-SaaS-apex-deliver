import React, { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Document } from '../../services/api/documents'
import {
  createDocumentQuestion,
  resolveDocumentQuestion,
  listDocumentQuestions,
  type DocumentQuestion,
  type DocumentQuestionCreatePayload,
  type DocumentQuestionResolvePayload,
} from '../../services/api/documents'

interface DocumentQuestionsPanelProps {
  dealId: string
  document: Document | null
  onClose: () => void
}

const formatTimestamp = (value?: string | null): string => {
  if (!value) return ''
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value))
  } catch {
    return value
  }
}

export const DocumentQuestionsPanel: React.FC<DocumentQuestionsPanelProps> = ({ dealId, document, onClose }) => {
  const documentId = document?.id ?? null
  const queryClient = useQueryClient()
  const [questionText, setQuestionText] = useState('')
  const [activeResolveId, setActiveResolveId] = useState<string | null>(null)
  const [resolveDrafts, setResolveDrafts] = useState<Record<string, string>>({})

  useEffect(() => {
    setQuestionText('')
    setActiveResolveId(null)
    setResolveDrafts({})
  }, [documentId])

  const invalidateDocumentData = () => {
    queryClient.invalidateQueries({
      predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === 'document-questions',
    })
    queryClient.invalidateQueries({
      predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === 'deal-documents',
    })
  }

  const questionsQuery = useQuery({
    queryKey: ['document-questions', dealId, documentId],
    queryFn: () => listDocumentQuestions(dealId, documentId!),
    enabled: Boolean(documentId),
  })

  const createMutation = useMutation({
    mutationFn: (payload: DocumentQuestionCreatePayload) =>
      createDocumentQuestion(dealId, documentId!, payload),
    onSuccess: () => {
      setQuestionText('')
      invalidateDocumentData()
    },
  })

  const resolveMutation = useMutation({
    mutationFn: (payload: { questionId: string; data: DocumentQuestionResolvePayload }) =>
      resolveDocumentQuestion(dealId, payload.questionId, payload.data),
    onSuccess: () => {
      setActiveResolveId(null)
      setResolveDrafts((current) => ({ ...current, [activeResolveId ?? '']: '' }))
      invalidateDocumentData()
    },
  })

  const questions: DocumentQuestion[] = useMemo(() => {
    return questionsQuery.data?.items ?? []
  }, [questionsQuery.data])

  const handleSubmitQuestion = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!documentId) return
    const trimmed = questionText.trim()
    if (trimmed.length < 3) {
      return
    }

    await createMutation.mutateAsync({ question: trimmed })
  }

  const handleResolveSubmit = async (questionId: string) => {
    const draft = (resolveDrafts[questionId] ?? '').trim()
    if (!draft) return

    await resolveMutation.mutateAsync({ questionId, data: { answer: draft } })
  }

  const panelTitle = document ? document.name : 'Select a document'

  const renderContent = () => {
    if (!documentId) {
      return (
        <p className="text-sm text-slate-600">
          Select a document to view Q&amp;A history and collaborate with reviewers.
        </p>
      )
    }

    if (questionsQuery.isLoading) {
      return <p className="text-sm text-slate-500">Loading questions…</p>
    }

    if (questionsQuery.error) {
      return (
        <p className="text-sm text-rose-600">
          Failed to load document questions. Please try again.
        </p>
      )
    }

    if (questions.length === 0) {
      return (
        <p className="text-sm text-slate-500">
          No questions yet. Use the form above to start a thread for this document.
        </p>
      )
    }

    return (
      <div className="space-y-3">
        {questions.map((question) => {
          const isResolving = activeResolveId === question.id
          const resolveValue = resolveDrafts[question.id] ?? ''
          const statusClass = question.status === 'resolved'
            ? 'bg-emerald-100 text-emerald-800'
            : 'bg-amber-100 text-amber-800'

          return (
            <div key={question.id} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm" role="listitem">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{question.question}</p>
                  <p className="text-xs text-slate-500">
                    Asked by {question.asked_by_name ?? 'Unknown user'} · {formatTimestamp(question.created_at)}
                  </p>
                </div>
                <span className={"rounded-full px-2 py-0.5 text-xs font-semibold " + statusClass}>
                  {question.status === 'resolved' ? 'Resolved' : 'Open'}
                </span>
              </div>

              {question.answer && (
                <div className="mt-3 rounded-md bg-slate-50 p-3 text-sm text-slate-700">
                  <p className="mb-1 font-medium text-slate-900">Answer</p>
                  <p>{question.answer}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Responded by {question.answered_by_name ?? 'Unknown user'} · {formatTimestamp(question.answered_at)}
                  </p>
                </div>
              )}

              {question.status === 'open' && (
                <div className="mt-3 space-y-2">
                  {isResolving ? (
                    <>
                      <textarea
                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="Add answer"
                        value={resolveValue}
                        onChange={(event) =>
                          setResolveDrafts((current) => ({
                            ...current,
                            [question.id]: event.target.value,
                          }))}
                        rows={3}
                        disabled={resolveMutation.isPending}
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="rounded bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
                          onClick={() => handleResolveSubmit(question.id)}
                          disabled={resolveMutation.isPending || !resolveValue.trim()}
                        >
                          Submit answer
                        </button>
                        <button
                          type="button"
                          className="rounded border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                          onClick={() => {
                            setActiveResolveId(null)
                            setResolveDrafts((current) => ({ ...current, [question.id]: '' }))
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="rounded border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                      onClick={() => {
                        setActiveResolveId(question.id)
                        setResolveDrafts((current) => ({
                          ...current,
                          [question.id]: current[question.id] ?? '',
                        }))
                      }}
                    >
                      Resolve
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <aside
      data-testid="document-questions-panel"
      className="fixed bottom-6 right-6 z-40 w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-2xl"
    >
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Document Q&amp;A</p>
          <h2 className="text-base font-semibold text-slate-900">{panelTitle}</h2>
        </div>
        <button
          type="button"
          className="rounded border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      <div className="space-y-4 p-4">
        <form onSubmit={handleSubmitQuestion} className="space-y-2">
          <label className="text-xs font-medium text-slate-600" htmlFor="document-question-input">
            Ask a question
          </label>
          <textarea
            id="document-question-input"
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder={documentId ? 'Ask a question about this document' : 'Select a document to start asking questions'}
            value={questionText}
            onChange={(event) => setQuestionText(event.target.value)}
            rows={3}
            disabled={!documentId || createMutation.isPending}
          />
          {createMutation.isError && (
            <p className="text-xs text-rose-600">Unable to submit question. Please try again.</p>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
              disabled={!documentId || createMutation.isPending || questionText.trim().length < 3}
            >
              Send question
            </button>
          </div>
        </form>

        <div role="list" aria-live="polite">
          {renderContent()}
        </div>

        {resolveMutation.isError && (
          <p className="text-xs text-rose-600">Unable to resolve the question. Please try again.</p>
        )}
      </div>
    </aside>
  )
}
