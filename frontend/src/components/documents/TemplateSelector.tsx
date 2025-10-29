import React from 'react'
import type { DocumentTemplate } from '../../services/api/documentGeneration'

type TemplateSelectorProps = {
  templates: DocumentTemplate[]
  loading?: boolean
  selectedTemplateId?: string | null
  onUseTemplate: (templateId: string) => void
}

const buildCardClasses = (isSelected: boolean) => {
  const base = 'rounded-xl border p-4 transition hover:border-indigo-200'
  return isSelected
    ? base + ' border-indigo-500 bg-indigo-50'
    : base + ' border-slate-200 bg-white'
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  loading = false,
  selectedTemplateId = null,
  onUseTemplate,
}) => {
  if (loading) {
    return (
      <section aria-busy="true" className="space-y-4" aria-label="Document templates loading">
        <div className="h-20 animate-pulse rounded-md bg-slate-200" />
        <div className="h-20 animate-pulse rounded-md bg-slate-200" />
        <div className="h-20 animate-pulse rounded-md bg-slate-200" />
      </section>
    )
  }

  return (
    <section aria-label="Document templates" className="space-y-4">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold text-slate-900">Templates</h2>
        <p className="text-sm text-slate-500">
          Start from a curated blueprint tailored to M&A workflows.
        </p>
      </header>

      {templates.length === 0 ? (
        <p className="text-sm text-slate-500" data-testid="template-empty-state">
          No templates available yet. Check back after uploading your first document.
        </p>
      ) : (
        <ul className="space-y-3" role="list">
          {templates.map((template) => {
            const isSelected = template.id === selectedTemplateId
            return (
              <li key={template.id} className={buildCardClasses(isSelected)}>
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-slate-900">{template.name}</h3>
                      {template.category ? (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                          {template.category}
                        </span>
                      ) : null}
                    </div>
                    {template.description ? (
                      <p className="text-sm text-slate-600">{template.description}</p>
                    ) : null}
                    <dl className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
                      {template.estimated_length ? (
                        <div>
                          <dt className="font-medium text-slate-600">Length</dt>
                          <dd>{template.estimated_length}</dd>
                        </div>
                      ) : null}
                      {template.last_updated ? (
                        <div>
                          <dt className="font-medium text-slate-600">Updated</dt>
                          <dd>{new Date(template.last_updated).toLocaleDateString()}</dd>
                        </div>
                      ) : null}
                      {template.industries && template.industries.length > 0 ? (
                        <div>
                          <dt className="font-medium text-slate-600">Industries</dt>
                          <dd>{template.industries.join(', ')}</dd>
                        </div>
                      ) : null}
                      {template.tags && template.tags.length > 0 ? (
                        <div>
                          <dt className="font-medium text-slate-600">Tags</dt>
                          <dd>{template.tags.join(', ')}</dd>
                        </div>
                      ) : null}
                    </dl>
                    {template.sample_excerpt ? (
                      <blockquote className="rounded-md border-l-4 border-indigo-300 bg-indigo-50/60 p-3 text-xs text-slate-600">
                        <p className="italic">“{template.sample_excerpt}”</p>
                      </blockquote>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-2 md:flex-col md:items-stretch">
                    {isSelected ? (
                      <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                        In use
                      </span>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => onUseTemplate(template.id)}
                      className="inline-flex items-center justify-center rounded-lg border border-indigo-500 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
                      aria-label={'Use template ' + template.name}
                    >
                      {'Use template ' + template.name}
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
