import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'
import {
  Bell,
  CalendarPlus,
  HelpCircle,
  Layers,
  Plus,
  Search,
  UploadCloud,
} from '@/lib/icons'
import { Breadcrumbs } from './Breadcrumbs'
import { ContextualSubMenu } from './ContextualSubMenu'
import { CommandPalette } from '../common/CommandPalette'
import { APP_TITLE } from '../../const'

interface CreateAction {
  id: string
  label: string
  description: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  matcher: (pathname: string) => boolean
}

const CREATE_ACTIONS: CreateAction[] = [
  {
    id: 'deal',
    label: 'New Deal',
    description: 'Add an opportunity to your pipeline',
    href: '/deals/new',
    icon: Layers,
    matcher: (pathname) => pathname.startsWith('/deals'),
  },
  {
    id: 'task',
    label: 'New Task',
    description: 'Assign work to a deal squad',
    href: '/tasks',
    icon: CalendarPlus,
    matcher: (pathname) => pathname.startsWith('/tasks'),
  },
  {
    id: 'document',
    label: 'Upload Document',
    description: 'Drop files into the secure workspace',
    href: '/documents',
    icon: UploadCloud,
    matcher: (pathname) => pathname.startsWith('/documents'),
  },
]

const DEFAULT_CREATE_ACTION: CreateAction = {
  id: 'default',
  label: 'Create Something',
  description: 'Choose what you want to create next',
  href: '/deals/new',
  icon: Plus,
  matcher: () => true,
}

const NOTIFICATION_FEED = [
  {
    id: 'notif-1',
    title: 'Deal moved to Negotiation',
    context: 'Alpha Health Systems',
    time: '2m ago',
  },
  {
    id: 'notif-2',
    title: 'FP&A model refreshed',
    context: 'Q2 Scenario Planning',
    time: '18m ago',
  },
  {
    id: 'notif-3',
    title: 'Document approval required',
    context: 'CIM 2025 Draft',
    time: '1h ago',
  },
]

export const AppHeader: React.FC = () => {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const location = useLocation()

  const createButtonRef = useRef<HTMLButtonElement>(null)
  const createPopoverRef = useRef<HTMLDivElement>(null)
  const notificationButtonRef = useRef<HTMLButtonElement>(null)
  const notificationPopoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setIsCommandPaletteOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        isCreateMenuOpen &&
        !createButtonRef.current?.contains(target) &&
        !createPopoverRef.current?.contains(target)
      ) {
        setIsCreateMenuOpen(false)
      }
      if (
        isNotificationOpen &&
        !notificationButtonRef.current?.contains(target) &&
        !notificationPopoverRef.current?.contains(target)
      ) {
        setIsNotificationOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isCreateMenuOpen, isNotificationOpen])

  const activeCreateAction = useMemo(() => {
    return CREATE_ACTIONS.find((action) => action.matcher(location.pathname)) ?? DEFAULT_CREATE_ACTION
  }, [location.pathname])

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-md shadow-sm shadow-black/5">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          <div className="flex min-w-0 items-center gap-4 lg:hidden">
            <Link
              to="/dashboard"
              className="whitespace-nowrap text-lg font-semibold text-slate-900"
            >
              {APP_TITLE}
            </Link>
          </div>

          <div className="flex flex-1 items-center min-w-0 px-4">
            <Breadcrumbs />
          </div>

          <div className="flex flex-shrink-0 items-center gap-2 lg:gap-3">
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hidden md:flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-500 shadow-inner shadow-white/40 transition hover:bg-white"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="rounded border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-400">Cmd+K</kbd>
            </button>

            <div className="relative hidden sm:block">
              <button
                ref={createButtonRef}
                onClick={() => setIsCreateMenuOpen((open) => !open)}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500"
                aria-haspopup="menu"
                aria-expanded={isCreateMenuOpen}
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{activeCreateAction.label}</span>
              </button>
              {isCreateMenuOpen && (
                <div
                  ref={createPopoverRef}
                  className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-white/80 bg-white/95 p-3 text-left shadow-2xl shadow-slate-900/10 backdrop-blur"
                >
                  <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">Quick create</p>
                  <div className="mt-2 space-y-1">
                    {CREATE_ACTIONS.map((action) => {
                      const Icon = action.icon
                      return (
                        <Link
                          key={action.id}
                          to={action.href}
                          className="flex items-start gap-3 rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100"
                          onClick={() => setIsCreateMenuOpen(false)}
                        >
                          <span className="rounded-lg bg-slate-100 p-2 text-slate-500">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span>
                            <span className="block font-semibold text-slate-900">{action.label}</span>
                            <span className="block text-xs text-slate-500">{action.description}</span>
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                ref={notificationButtonRef}
                onClick={() => setIsNotificationOpen((open) => !open)}
                className="relative rounded-xl p-2 text-slate-600 transition hover:bg-slate-100"
                aria-haspopup="menu"
                aria-expanded={isNotificationOpen}
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-1 top-1 inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
              </button>
              {isNotificationOpen && (
                <div
                  ref={notificationPopoverRef}
                  className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-white/80 bg-white/95 p-3 text-left shadow-2xl shadow-slate-900/15 backdrop-blur"
                >
                  <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">Activity</p>
                  <ul className="mt-2 space-y-2 text-sm">
                    {NOTIFICATION_FEED.map((item) => (
                      <li key={item.id} className="rounded-xl border border-slate-100 px-3 py-2">
                        <p className="font-semibold text-slate-900">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.context}</p>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.3em] text-slate-400">{item.time}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button
              className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100"
              aria-label="Help"
            >
              <HelpCircle className="h-5 w-5" />
            </button>

            <div className="pl-1">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8 ring-2 ring-white shadow-sm',
                  },
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <ContextualSubMenu />

      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
    </>
  )
}
