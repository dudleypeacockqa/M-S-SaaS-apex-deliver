import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Command, X } from 'lucide-react'
import { WORKSPACE_NAV_ITEMS } from '../../const'
import type { WorkspaceNavigationItem } from '../../const'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

interface CommandItem {
  id: string
  label: string
  path: string
  icon: React.ReactNode
  section: string
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      // Focus input when opened
      setTimeout(() => {
        inputRef.current?.focus()
      }, 10)
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
    } else {
      setQuery('')
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const items = useMemo(() => {
    const allItems: CommandItem[] = []
    
    WORKSPACE_NAV_ITEMS.forEach(item => {
      // Add main item
      allItems.push({
        id: item.id,
        label: item.label,
        path: item.path,
        icon: item.icon ? <item.icon className="w-4 h-4" /> : null,
        section: item.section || 'General'
      })

      // Add sub items
      if (item.subMenuItems) {
        item.subMenuItems.forEach(sub => {
          allItems.push({
            id: `${item.id}-${sub.path}`,
            label: `${item.label} > ${sub.label}`,
            path: sub.path,
            icon: sub.icon ? <sub.icon className="w-4 h-4" /> : (item.icon ? <item.icon className="w-4 h-4" /> : null),
            section: item.section || 'General'
          })
        })
      }
    })
    return allItems
  }, [])

  const filteredItems = useMemo(() => {
    if (!query) return items.slice(0, 5) // Show recent/top 5 by default
    
    return items.filter(item => 
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.section.toLowerCase().includes(query.toLowerCase())
    )
  }, [items, query])

  const handleSelect = (path: string) => {
    navigate(path)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center border-b border-slate-100 px-4 py-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for pages, commands, or deals..."
            className="flex-1 px-3 bg-transparent outline-none text-base placeholder:text-slate-400"
          />
          <div className="flex items-center gap-2">
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-slate-500 bg-slate-100 rounded border border-slate-200">
              Esc
            </kbd>
            <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="max-h-[300px] overflow-y-auto py-2">
          {filteredItems.length === 0 ? (
            <div className="px-4 py-8 text-center text-slate-500">
              No results found for "{query}"
            </div>
          ) : (
            <div className="px-2">
              {filteredItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.path)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors
                    ${index === 0 && query ? 'bg-indigo-50' : 'hover:bg-slate-50'}
                  `}
                >
                  <div className={`p-2 rounded-md ${index === 0 && query ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-900">
                      {item.label}
                    </div>
                    <div className="text-xs text-slate-500">
                      {item.section}
                    </div>
                  </div>
                  <Command className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
          <span>Search throughout ApexDeliver</span>
          <div className="flex gap-3">
             <span><kbd className="font-sans">↑↓</kbd> to navigate</span>
             <span><kbd className="font-sans">↵</kbd> to select</span>
          </div>
        </div>
      </div>
    </div>
  )
}

