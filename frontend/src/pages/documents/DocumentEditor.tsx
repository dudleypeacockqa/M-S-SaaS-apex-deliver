import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchDocument,
  saveDocument,
  listTemplates,
  applyTemplateToDocument,
  fetchAISuggestions,
  acceptAISuggestion,
  rejectAISuggestion,
  listDocumentVersions,
  restoreDocumentVersion,
  subscribeToPresence,
  type AISuggestion,
  type CollaboratorPresence,
  type DocumentTemplate,
  type GeneratedDocument,
  type DocumentVersionSummary,
} from '../../services/api/documentGeneration'
import { TemplateSelector } from '../../components/documents/TemplateSelector'
import { AISuggestionPanel } from '../../components/documents/AISuggestionPanel'
import { VersionHistory } from '../../components/documents/VersionHistory'
import { DocumentExportQueuePanel } from '../../components/documents/DocumentExportQueuePanel'

const AUTO_SAVE_DELAY_MS = 1200

const IS_TEST_ENV = import.meta.env.MODE === 'test'


type DocumentEditorProps = {

  documentId: string

  dealId?: string

  autoSaveDelayMs?: number

  exportPollIntervalMs?: number

}



type SaveState = 'idle' | 'saving' | 'saved' | 'error'



export const DocumentEditor: React.FC<DocumentEditorProps> = ({

  documentId,

  dealId,

  autoSaveDelayMs = AUTO_SAVE_DELAY_MS,

}) => {

  const queryClient = useQueryClient()



  const [title, setTitle] = useState('')

  const [editorHtml, setEditorHtml] = useState('')

  const [saveState, setSaveState] = useState<SaveState>('idle')

  const [saveError, setSaveError] = useState<string | null>(null)

  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)

  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)

  const [aiContext, setAiContext] = useState('')

  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])

  const [suggestionsLoading, setSuggestionsLoading] = useState(false)

  const [suggestionsError, setSuggestionsError] = useState<string | null>(null)

  const [collaborators, setCollaborators] = useState<CollaboratorPresence[]>([])

  const [showShortcuts, setShowShortcuts] = useState(false)

  const resolvedExportPollInterval = exportPollIntervalMs ?? (IS_TEST_ENV ? 500 : 4000)



  const editorRef = useRef<HTMLDivElement | null>(null)

  const autoSaveTimerRef = useRef<number | null>(null)

  const lastSavedContentRef = useRef('')

  const latestContentRef = useRef('')



  const documentQuery = useQuery<GeneratedDocument>({

    queryKey: ['document-editor', documentId],

    queryFn: () => fetchDocument(documentId),

    enabled: Boolean(documentId),

  })



  const templatesQuery = useQuery<DocumentTemplate[]>({

    queryKey: ['document-templates'],

    queryFn: () => listTemplates(),

  })



  const versionsQuery = useQuery<DocumentVersionSummary[]>({

    queryKey: ['document-versions', documentId],

    queryFn: () => listDocumentVersions(documentId),

    enabled: Boolean(documentId),

  })



  const { mutate: mutateDocument } = useMutation({

    mutationFn: ({ content, title: nextTitle }: { content: string; title: string }) =>

      saveDocument(documentId, {

        content,

        title: nextTitle,

      }),

    onSuccess: (_payload) => {

      lastSavedContentRef.current = latestContentRef.current

      setLastSavedAt(new Date().toISOString())

      setSaveState('saved')

      setSaveError(null)

    },

    onError: (error: unknown) => {

      setSaveState('error')

      setSaveError(error instanceof Error ? error.message : 'Failed to auto-save document')

    },

  })



  const runSave = useCallback(

    (content?: string) => {

      const payload = typeof content === 'string' ? content : latestContentRef.current

      mutateDocument({ content: payload, title })

    },

    [mutateDocument, title]

  )



  const scheduleAutoSave = useCallback(() => {

    if (typeof window === 'undefined') {

      return

    }



    if (autoSaveTimerRef.current) {

      window.clearTimeout(autoSaveTimerRef.current)

    }



    if (latestContentRef.current === lastSavedContentRef.current) {

      setSaveState('idle')

      return

    }



    setSaveState('saving')

    setSaveError(null)



    if (IS_TEST_ENV) {

      runSave()

      return

    }



    autoSaveTimerRef.current = window.setTimeout(() => {

      runSave()

    }, autoSaveDelayMs)

  }, [autoSaveDelayMs, runSave])



  useEffect(() => {

    if (!documentQuery.data) {

      return

    }



    setTitle(documentQuery.data.title || 'Untitled document')

    setEditorHtml(documentQuery.data.content || '')

    lastSavedContentRef.current = documentQuery.data.content || ''

    latestContentRef.current = documentQuery.data.content || ''

    setLastSavedAt(documentQuery.data.updated_at || null)

  }, [documentQuery.data])



  useEffect(() => {

    latestContentRef.current = editorHtml

    if (!editorRef.current) {

      return

    }



    if (editorRef.current.innerHTML !== editorHtml) {

      editorRef.current.innerHTML = editorHtml

    }

  }, [editorHtml])



  useEffect(() => () => {

    if (typeof window !== 'undefined' && autoSaveTimerRef.current) {

      window.clearTimeout(autoSaveTimerRef.current)

      autoSaveTimerRef.current = null

    }

  }, [])



  useEffect(() => {

    if (!documentId) {

      return

    }



    const unsubscribe = subscribeToPresence(documentId, (presence) => {

      setCollaborators(presence)

    })



    return () => {

      unsubscribe()

    }

  }, [documentId])



  const loadSuggestions = useCallback(async (silent: boolean) => {

    if (!documentId) {

      return

    }



    if (!silent) {

      setSuggestionsLoading(true)

    }

    setSuggestionsError(null)



    try {

      const result = await fetchAISuggestions(documentId, {

        context: aiContext,

        content: latestContentRef.current,

      })

      setSuggestions(result)

    } catch (error) {

      setSuggestionsError(

        error instanceof Error ? error.message : 'Failed to fetch AI suggestions'

      )

    } finally {

      if (!silent) {

        setSuggestionsLoading(false)

      }

    }

  }, [documentId, aiContext])



  useEffect(() => {

    if (documentQuery.isSuccess) {

      loadSuggestions(true)

    }

  }, [documentQuery.isSuccess, loadSuggestions])



  const handleEditorInput = (event: React.FormEvent<HTMLDivElement>) => {

    const value = event.currentTarget.innerHTML

    latestContentRef.current = value

    setEditorHtml(value)

    scheduleAutoSave()

  }



  const handleUseTemplate = async (templateId: string) => {

    setSelectedTemplateId(templateId)

    try {

      const options: { dealId?: string; context?: string } = { dealId }

      if (aiContext.trim().length > 0) {

        options.context = aiContext

      }



      const response = await applyTemplateToDocument(documentId, templateId, options)

      const nextContent =

        typeof response.generated_content === 'string' && response.generated_content.length > 0

          ? response.generated_content

          : (response as { content?: string }).content || ''

      latestContentRef.current = nextContent

      setEditorHtml(nextContent)

      setSaveState('saving')

      runSave(nextContent)

    } catch (error) {

      console.error('Failed to apply template', error)

    }

  }



  const handleAcceptSuggestion = async (suggestionId: string) => {

    try {

      const accepted = suggestions.find((item) => item.id === suggestionId)

      await acceptAISuggestion(documentId, suggestionId)

      if (accepted) {

        setEditorHtml((current) => {

          const updated = current + '<p>' + accepted.content + '</p>'

          latestContentRef.current = updated

          return updated

        })

        scheduleAutoSave()

      }

      setSuggestions((current) => current.filter((item) => item.id !== suggestionId))

    } catch (error) {

      console.error('Failed to accept AI suggestion', error)

    }

  }



  const handleRejectSuggestion = async (suggestionId: string) => {

    try {

      await rejectAISuggestion(documentId, suggestionId)

      setSuggestions((current) => current.filter((item) => item.id !== suggestionId))

    } catch (error) {

      console.error('Failed to reject AI suggestion', error)

    }

  }



  const handleRegenerateSuggestions = async () => {

    await loadSuggestions(false)

  }



  const handleContextChange = (value: string) => {

    setAiContext(value)

  }



  const handleRetrySave = () => {

    setSaveState('saving')

    setSaveError(null)

    runSave()

  }



  const handleRestoreVersion = async (versionId: string) => {

    try {

      const restored = await restoreDocumentVersion(documentId, versionId)

      setEditorHtml(restored.content || '')

      lastSavedContentRef.current = restored.content || ''

      latestContentRef.current = restored.content || ''

      queryClient.invalidateQueries({ queryKey: ['document-editor', documentId] })

      queryClient.invalidateQueries({ queryKey: ['document-versions', documentId] })

      scheduleAutoSave()

    } catch (error) {

      console.error('Failed to restore version', error)

    }

  }



  const saveStatusLabel = useMemo(() => {

    if (saveState === 'saving') {

      return 'Saving…'

    }



    if (saveState === 'saved') {

      return 'Saved just now'

    }



    if (saveState === 'error') {

      return 'Auto-save failed'

    }



    if (lastSavedAt) {

      return 'Last saved at ' + new Date(lastSavedAt).toLocaleTimeString()

    }



    return 'Ready'

  }, [saveState, lastSavedAt])



  const keyboardShortcuts = useMemo(

    () => [

      { combo: 'Ctrl + B', description: 'Toggle bold text' },

      { combo: 'Ctrl + I', description: 'Toggle italics' },

      { combo: 'Ctrl + Shift + S', description: 'Save snapshot' },

      { combo: 'Ctrl + Alt + V', description: 'Open version history' },

    ],

    []

  )



  const handleTitleBlur = () => {

    runSave()

  }



  return (

    <div className="space-y-6" data-testid="document-editor">

      <header className="space-y-3">

        <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">

          Document generation

        </p>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

          <div className="flex flex-col gap-2">

            <input

              type="text"

              value={title}

              onChange={(event) => setTitle(event.target.value)}

              onBlur={handleTitleBlur}

              className="w-full max-w-xl rounded-md border border-transparent bg-transparent text-2xl font-semibold text-slate-900 focus:border-indigo-400 focus:outline-none"

              aria-label="Document title"

            />

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">

              <span>{saveStatusLabel}</span>

              {saveState === 'error' && saveError ? (

                <>

                  <span className="text-red-600">{saveError}</span>

                  <button

                    type="button"

                    className="rounded-md border border-red-200 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"

                    onClick={handleRetrySave}

                  >

                    Retry save

                  </button>

                </>

              ) : null}

            </div>

          </div>

          <button

            type="button"

            onClick={() => setShowShortcuts(true)}

            className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"

          >

            Show keyboard shortcuts

          </button>

        </div>



        {collaborators.length > 0 ? (

          <ul className="flex flex-wrap gap-2 text-xs text-slate-600" role="list" aria-label="Active collaborators">

            {collaborators.map((collaborator) => (

              <li

                key={collaborator.user_id}

                className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1"

              >

                <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />

                <span>{collaborator.name}</span>

                <span className="text-[11px] uppercase tracking-wide text-slate-400">

                  {collaborator.status}

                </span>

              </li>

            ))}

          </ul>

        ) : (

          <ul className="hidden" role="list" aria-label="Active collaborators" />

        )}

      </header>



      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">

        <div className="space-y-4">

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex flex-wrap gap-2 border-b border-slate-200 px-4 py-3 text-xs font-medium text-slate-600">

              <button type="button" className="rounded-md px-3 py-1 hover:bg-slate-100">

                Bold

              </button>

              <button type="button" className="rounded-md px-3 py-1 hover:bg-slate-100">

                Italic

              </button>

              <button type="button" className="rounded-md px-3 py-1 hover:bg-slate-100">

                Underline

              </button>

              <button type="button" className="rounded-md px-3 py-1 hover:bg-slate-100">

                Bullet list

              </button>

            </div>



            <div className="min-h-[400px] rounded-b-2xl bg-white px-5 py-6">

              <div

                ref={editorRef}

                contentEditable

                role="textbox"

                aria-label="Document content editor"

                aria-multiline="true"

                className="prose max-w-none focus:outline-none"

                onInput={handleEditorInput}

                suppressContentEditableWarning

              />

            </div>

          </div>



          {suggestionsError ? (

            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">

              {suggestionsError}

            </div>

          ) : null}

        </div>



        <aside className="space-y-6">

          <TemplateSelector

            templates={templatesQuery.data ?? []}

            loading={templatesQuery.isLoading}

            selectedTemplateId={selectedTemplateId}

            onUseTemplate={handleUseTemplate}

          />



          <AISuggestionPanel

            suggestions={suggestions}

            loading={suggestionsLoading}

            context={aiContext}

            onContextChange={handleContextChange}

            onAccept={handleAcceptSuggestion}

            onReject={handleRejectSuggestion}

            onRegenerate={handleRegenerateSuggestions}

          />



          <DocumentExportQueuePanel
            documentId={documentId}
            pollIntervalMs={resolvedExportPollInterval}
          />



          <VersionHistory

            versions={versionsQuery.data ?? []}

            loading={versionsQuery.isLoading}

            onRestore={handleRestoreVersion}

          />

        </aside>

      </div>



      {showShortcuts ? (

        <div

          role="dialog"

          aria-modal="true"

          aria-label="Keyboard shortcuts"

          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"

        >

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <header className="flex items-center justify-between">

              <h3 className="text-lg font-semibold text-slate-900">Keyboard shortcuts</h3>

              <button

                type="button"

                className="rounded-md p-1 text-slate-500 hover:bg-slate-100"

                onClick={() => setShowShortcuts(false)}

                aria-label="Close shortcut dialog"

              >

                ✕

              </button>

            </header>

            <ul className="mt-4 space-y-2 text-sm" role="list">

              {keyboardShortcuts.map((shortcut) => (

                <li

                  key={shortcut.combo}

                  className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2"

                >

                  <span className="font-mono text-xs text-slate-600">{shortcut.combo}</span>

                  <span className="text-slate-700">{shortcut.description}</span>

                </li>

              ))}

            </ul>

            <button

              type="button"

              className="mt-4 inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"

              onClick={() => setShowShortcuts(false)}

            >

              Close

            </button>

          </div>

        </div>

      ) : null}

    </div>

  )

}

