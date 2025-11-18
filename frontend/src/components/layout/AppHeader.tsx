import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'
import { Bell, HelpCircle, Plus, Search } from 'lucide-react'
import { Breadcrumbs } from './Breadcrumbs'
import { ContextualSubMenu } from './ContextualSubMenu'
import { CommandPalette } from '../common/CommandPalette'
import { APP_TITLE } from '../../const'

export const AppHeader: React.FC = () => {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsCommandPaletteOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Left: Logo/Brand (Hidden on large screens as it's in sidebar) */}
          <div className="flex items-center gap-4 min-w-0 lg:hidden">
            <Link
              to="/dashboard"
              className="text-lg font-bold text-indigo-600 hover:text-indigo-700 transition-colors whitespace-nowrap"
            >
              {APP_TITLE}
            </Link>
          </div>

          {/* Center: Breadcrumbs */}
          <div className="flex-1 flex items-center min-w-0 px-4">
            <Breadcrumbs />
          </div>

          {/* Right: Search, Actions, User */}
          <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
            {/* Command Palette Trigger */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-500 bg-slate-100/50 hover:bg-slate-100 rounded-md border border-slate-200/60 transition-colors mr-2"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search...</span>
              <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-white rounded border border-slate-200">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>

            {/* Global Action Button */}
            <button
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-md shadow-sm shadow-indigo-200 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create</span>
            </button>

            <div className="h-6 w-px bg-slate-200 mx-1" />

            {/* Notifications */}
            <button
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {/* Notification badge */}
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* Help */}
            <button
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Help"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* User Button */}
            <div className="flex items-center pl-1">
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

      {/* Contextual Sub-Menu */}
      <ContextualSubMenu />

      {/* Command Palette Modal */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
      />
    </>
  )
}
