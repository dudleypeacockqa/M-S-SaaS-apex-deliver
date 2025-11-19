import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Command as CommandGlyph,
  CornerDownLeft,
  Layers,
  Plus,
  Search,
  Sparkles,
  UploadCloud,
} from '@/lib/icons'

import { WORKSPACE_NAV_ITEMS } from '../../const'
import type { WorkspaceNavigationItem } from '../../const'

const CONTEXT_EVENT = 'apex:command-search'

type CommandKind = 'navigation' | 'action' | 'context'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

interface CommandItem {
  id: string
  label: string
  section: string
  kind: CommandKind
  icon: React.ReactNode
  path?: string
  hint?: string
  onSelect?: () => void
}

const mapNavigationItems = (items: WorkspaceNavigationItem[]): CommandItem[] => {
  const result: CommandItem[] = []

  items.forEach((item) => {
    const Icon = item.icon ?? Layers
    result.push({
      id: item.id,
      label: item.label,
      section: item.section || 'Navigation',
      kind: 'navigation',
      path: item.path,
      icon: <Icon className="h-4 w-4" />,
    })

    if (item.hasSubMenu && item.subMenuItems) {
      item.subMenuItems.forEach((sub) => {
        result.push({
          id: `${item.id}-${sub.path}`,
          label: `${item.label} • ${sub.label}`,
          section: item.section || 'Navigation',
          kind: 'navigation',
          path: sub.path,
          icon: <Icon className="h-4 w-4" />,
        })
      })
    }
  })

  return result
}

const formatContextLabel = (pathname: string) => {
  const parts = pathname.split('/').filter(Boolean)
  if (!parts.length) {
    return 'dashboard'
  }
  return parts.map((part) => part.replace(/-/g, ' ')).join(' / ')
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      document.body.style.overflow = 'unset'
      return
    }

    document.body.style.overflow = 'hidden'
    const timeout = setTimeout(() => {
      inputRef.current?.focus()
    }, 10)

    return () => {
      clearTimeout(timeout)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      setActiveIndex(0)
    }
  }, [query, isOpen])

  const navigationItems = useMemo(() => mapNavigationItems(WORKSPACE_NAV_ITEMS), [])

  const quickActions = useMemo<CommandItem[]>(
    () => [
      {
        id: 'action-create-deal',
        label: 'Create New Deal',
        section: 'Quick Actions',
        kind: 'action',
        icon: <Plus className="h-4 w-4" />,
        hint: 'N',
        onSelect: () => navigate('/deals/new'),
      },
      {
        id: 'action-upload-doc',
        label: 'Upload Document',
        section: 'Quick Actions',
        kind: 'action',
        icon: <UploadCloud className="h-4 w-4" />,
        hint: 'Shift+U',
        onSelect: () => navigate('/documents'),
      },
      {
        id: 'action-open-billing',
        label: 'Open Billing Console',
        section: 'Quick Actions',
        kind: 'action',
        icon: <Layers className="h-4 w-4" />,
        onSelect: () => navigate('/dashboard/billing'),
      },
    ],
    [navigate]
  )

  const contextItems = useMemo<CommandItem[]>(() => {
    const contextLabel = formatContextLabel(location.pathname)
    return [
      {
        id: 'context-current-view',
        label: query ? `Search "${query}" inside ${contextLabel}` : `Search ${contextLabel}`,
        section: 'Context',
        kind: 'context',
        icon: <Sparkles className="h-4 w-4" />,
        hint: 'Enter',
        onSelect: () => {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(
              new CustomEvent(CONTEXT_EVENT, {
                detail: {
                  query,
                  pathname: location.pathname,
                },
              })
            )
          }
        },
      },
    ]
  }, [location.pathname, query])

  const dataset = useMemo(() => [...contextItems, ...quickActions, ...navigationItems], [contextItems, quickActions, navigationItems])

  const filteredItems = useMemo(() => {
    if (!query.trim()) {
      return dataset.slice(0, 8)
    }

    const term = query.toLowerCase()
    return dataset.filter((item) => item.label.toLowerCase().includes(term) || item.section.toLowerCase().includes(term))
  }, [dataset, query])

  const handleSelect = useCallback(
    (item: CommandItem) => {
      if (item.kind === 'navigation' && item.path) {
        navigate(item.path)
      } else if (item.onSelect) {
        item.onSelect()
      }
      onClose()
    },
    [navigate, onClose]
  )

  const handleKeyNavigation = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!filteredItems.length) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((prev) => (prev + 1) % filteredItems.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const item = filteredItems[activeIndex] ?? filteredItems[0]
      if (item) {
        handleSelect(item)
      }
    }
  }

  if (!isOpen) return null

  let lastSection: string | null = null

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center bg-slate-950/50 px-4 pt-[15vh] backdrop-blur-sm">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 text-white shadow-2xl shadow-slate-950/50 backdrop-blur-2xl">
        <div className="flex items-center gap-3 border-b border-white/5 px-5 py-4">
          <Search className="h-5 w-5 text-slate-300" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyNavigation}
            placeholder="Jump to a module, run an action, or search this view"
            className="flex-1 bg-transparent text-base text-white placeholder:text-slate-500 focus:outline-none"
          />
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="hidden md:inline-flex items-center gap-1 rounded-md border border-white/10 px-2 py-0.5">⌘K</span>
            <button onClick={onClose} className="rounded-lg p-1 hover:bg-white/10" aria-label="Close command palette">
              <CommandGlyph className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="max-h-[360px] overflow-y-auto py-2">
          {filteredItems.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-slate-400">
              No results for "{query}". Try a different module or action keyword.
            </div>
          ) : (
            <div className="px-3 py-1">
              {filteredItems.map((item, index) => {
                const showDivider = item.section !== lastSection
                lastSection = item.section

                return (
                  <div key={item.id}>
                    {showDivider && (
                      <div className="px-2 pt-4 pb-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500">
                        {item.section}
                      </div>
                    )}
                    <button
                      className={`
                        group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition
                        ${activeIndex === index ? 'bg-white/10 text-white ring-1 ring-white/10' : 'text-slate-200 hover:bg-white/5'}
                      `}
                      onClick={() => handleSelect(item)}
                    >
                      <span className={`rounded-xl p-2 ${activeIndex === index ? 'bg-indigo-500/20 text-indigo-200' : 'bg-white/5 text-slate-400'}`}>
                        {item.icon}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold tracking-tight">{item.label}</p>
                        <p className="text-xs text-slate-400">{item.kind === 'action' ? 'Action' : 'Navigate'}</p>
                      </div>
                      {item.hint && (
                        <span className="rounded-md border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-slate-400">
                          {item.hint}
                        </span>
                      )}
                      {activeIndex === index && <CornerDownLeft className="h-4 w-4 text-slate-400" />}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/5 bg-slate-950/70 px-5 py-3 text-[11px] uppercase tracking-[0.3em] text-slate-500">
          <span>Cmd Palette</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  )
}

