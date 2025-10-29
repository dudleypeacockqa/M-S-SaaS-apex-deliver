import React from 'react'
import type { AISuggestion } from '../../services/api/documentGeneration'

type AISuggestionPanelProps = {
  suggestions: AISuggestion[]
  loading?: boolean
  context: string
  onContextChange: (value: string) => void
  onAccept: (suggestionId: string) => void
  onReject: (suggestionId: string) => void
  onRegenerate: () => void
}

const confidenceToPercent = (confidence?: number) => {
  if (typeof confidence !== 'number') return '—'
  return Math.round(confidence * 100) + '%'
}

export const AISuggestionPanel: React.FC<AISuggestionPanelProps> = ({
  suggestions,
  loading = false,
  context,
  onContextChange,
  onAccept,
  onReject,
  onRegenerate,
}) => {
  return (
    <section className="space-y-4" aria-label="AI assistance">
      <header className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">AI Suggestions</h2>
          <button
            type="button"
            onClick={onRegenerate}
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
            aria-live="polite"
          >
            Regenerate suggestions
          </button>
        </div>
        <p className="text-xs text-slate-500">
          The assistant analyses your draft and flags sections that could improve clarity or completeness.
        </p>
      </header>

      <label className="flex flex-col gap-2 text-xs font-medium text-slate-600" htmlFor="ai-context-input">
        Add context for the assistant
        <textarea
          id="ai-context-input"
          aria-label="AI context"
          value={context}
          onChange={(event) => onContextChange(event.target.value)}
          className="min-h-[80px] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          placeholder="Share priorities, tone, or deal nuances to steer the AI."
        />
      </label>

      {loading ? (
        <div className="space-y-3" aria-busy="true">
          <div className="h-16 animate-pulse rounded-md bg-slate-200" />
          <div className="h-16 animate-pulse rounded-md bg-slate-200" />
          <div className="h-16 animate-pulse rounded-md bg-slate-200" />
        </div>
      ) : suggestions.length === 0 ? (
        <p className="rounded-md border border-dashed border-slate-300 px-3 py-4 text-sm text-slate-500">
          Draft looks polished. Provide more context to see targeted recommendations.
        </p>
      ) : (
        <ul className="space-y-3" role="list">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <header className="flex items-start justify-between gap-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  {suggestion.title}
                </h3>
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
                  {confidenceToPercent(suggestion.confidence)} confidence
                </span>
              </header>
              <p className="mt-2 text-sm text-slate-600">{suggestion.content}</p>
              {suggestion.reasoning ? (
                <p className="mt-2 text-xs text-slate-500">Reasoning: {suggestion.reasoning}</p>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onAccept(suggestion.id)}
                  className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500"
                  aria-label={'Accept suggestion "' + suggestion.title + '"'}
                >
                  Accept suggestion "{suggestion.title}"
                </button>
                <button
                  type="button"
                  onClick={() => onReject(suggestion.id)}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                  aria-label={'Reject suggestion "' + suggestion.title + '"'}
                >
                  Reject suggestion "{suggestion.title}"
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
