import React, { useState, useMemo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useUser, UserButton } from '@clerk/clerk-react'
import {
  ChevronDown,
  ChevronRight,
  X,
  Menu,
} from 'lucide-react'

import type { UserRole } from '../auth/ProtectedRoute'
import { APP_TITLE, WORKSPACE_NAV_ITEMS } from '../../const'

interface NavSection {
  title: string
  items: typeof WORKSPACE_NAV_ITEMS
}

const resolveRole = (role: unknown): UserRole => {
  if (role === 'growth' || role === 'enterprise' || role === 'admin' || role === 'master_admin') {
    return role as UserRole
  }
  return 'solo'
}

export const SidebarNavigation: React.FC = () => {
  const { user } = useUser()
  const location = useLocation()
  const role = resolveRole(user?.publicMetadata?.role)

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['OVERVIEW', 'DEAL MANAGEMENT', 'COLLABORATION', 'CONTENT & MEDIA', 'FINANCIAL INTELLIGENCE', 'ADMINISTRATION'])
  )
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Filter items by role and remove duplicates (e.g., deal-matching is in deals sub-menu)
  const visibleItems = useMemo(() => {
    const filtered = role === 'master_admin'
      ? WORKSPACE_NAV_ITEMS
      : WORKSPACE_NAV_ITEMS.filter((item) => item.roles.includes(role))
    
    // Remove deal-matching from main nav since it's in deals sub-menu
    return filtered.filter((item) => item.id !== 'deal-matching')
  }, [role])

  // Group items by section
  const sections = useMemo(() => {
    const sectionMap = new Map<string, typeof WORKSPACE_NAV_ITEMS>()
    
    visibleItems.forEach((item) => {
      const section = item.section || 'OTHER'
      if (!sectionMap.has(section)) {
        sectionMap.set(section, [])
      }
      sectionMap.get(section)!.push(item)
    })

    // Convert to array and sort by predefined order
    const sectionOrder = [
      'OVERVIEW',
      'DEAL MANAGEMENT',
      'COLLABORATION',
      'CONTENT & MEDIA',
      'FINANCIAL INTELLIGENCE',
      'ADMINISTRATION',
      'OTHER',
    ]

    return sectionOrder
      .filter((section) => sectionMap.has(section))
      .map((section) => ({
        title: section,
        items: sectionMap.get(section)!,
      }))
  }, [visibleItems])

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(title)) {
        next.delete(title)
      } else {
        next.add(title)
      }
      return next
    })
  }

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-md shadow-lg hover:bg-slate-800 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-slate-900 text-white flex flex-col z-40 transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo/Brand Section */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AD</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">{APP_TITLE}</h1>
                <p className="text-xs text-slate-400">Enterprise Platform</p>
              </div>
            </div>
            <button
              onClick={closeMobileMenu}
              className="lg:hidden p-1 text-slate-400 hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {sections.map((section) => {
            const isExpanded = expandedSections.has(section.title)

            return (
              <div key={section.title} className="mb-6">
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full px-6 py-2 flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-200 transition-colors"
                >
                  <span>{section.title}</span>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                {isExpanded && (
                  <div className="mt-2">
                    {section.items.map((item) => {
                      const Icon = item.icon
                      const active = isActive(item.path, item.exact)

                      return (
                        <NavLink
                          key={item.id}
                          to={item.path}
                          onClick={closeMobileMenu}
                          className={`
                            flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-colors
                            ${active
                              ? 'bg-indigo-600 text-white border-r-2 border-indigo-400'
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                            }
                          `}
                        >
                          {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
                          <span>{item.label}</span>
                        </NavLink>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer/User Info */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8',
                  },
                }}
              />
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

