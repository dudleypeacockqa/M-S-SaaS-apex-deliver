import React, { useState, useMemo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useUser, UserButton } from '@clerk/clerk-react'
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
  Menu,
  PanelLeft,
  PanelLeftClose
} from 'lucide-react'

import type { UserRole } from '../auth/ProtectedRoute'
import { APP_TITLE, WORKSPACE_NAV_ITEMS } from '../../const'
import { useSidebar } from '../../hooks/useSidebar'

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
  const { isCollapsed, toggle: toggleCollapse } = useSidebar()

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['OVERVIEW', 'DEAL MANAGEMENT', 'COLLABORATION', 'CONTENT & MEDIA', 'FINANCIAL INTELLIGENCE', 'ADMINISTRATION'])
  )
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  // Filter items by role and remove duplicates
  const visibleItems = useMemo(() => {
    return role === 'master_admin'
      ? WORKSPACE_NAV_ITEMS
      : WORKSPACE_NAV_ITEMS.filter((item) => item.roles.includes(role))
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
    if (isCollapsed) return
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
        className={`fixed left-0 top-0 h-full bg-slate-900 text-white flex flex-col z-40 transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${!isMobileMenuOpen && isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Logo/Brand Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-white font-bold text-sm">AD</span>
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden transition-opacity duration-300">
                <h1 className="text-lg font-bold text-white whitespace-nowrap">{APP_TITLE}</h1>
                <p className="text-xs text-slate-400 whitespace-nowrap">Enterprise Platform</p>
              </div>
            )}
          </div>
          <button
            onClick={closeMobileMenu}
            className="lg:hidden p-1 text-slate-400 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900 overflow-x-hidden">
          {sections.map((section) => {
            // In collapsed mode, we always show items, ignoring expanded state
            const isExpanded = isCollapsed ? true : expandedSections.has(section.title)

            return (
              <div key={section.title} className="mb-4">
                {!isCollapsed && (
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="w-full px-6 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-200 transition-colors duration-150"
                  >
                    <span className="truncate">{section.title}</span>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 transition-transform duration-150 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 transition-transform duration-150 flex-shrink-0" />
                    )}
                  </button>
                )}

                {/* Separator for collapsed mode sections */}
                {isCollapsed && (
                  <div className="w-8 mx-auto h-px bg-slate-800 my-3 first:mt-0" />
                )}

                {isExpanded && (
                  <div className={`${!isCollapsed ? 'mt-1 space-y-0.5' : 'space-y-2'}`}>
                    {section.items.map((item) => {
                      const Icon = item.icon
                      const active = isActive(item.path, item.exact)

                      return (
                        <div key={item.id} className="relative group">
                          <NavLink
                            to={item.path}
                            onClick={closeMobileMenu}
                            className={`
                              flex items-center gap-3 text-sm font-medium transition-all duration-150 relative
                              ${isCollapsed 
                                ? 'justify-center p-3 mx-2 rounded-lg' 
                                : 'px-6 py-2.5'
                              }
                              ${active
                                ? isCollapsed
                                  ? 'bg-indigo-600 text-white shadow-lg'
                                  : 'bg-indigo-600 text-white border-r-2 border-indigo-400 shadow-sm'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                              }
                            `}
                            onMouseEnter={() => isCollapsed && setHoveredItem(item.id)}
                            onMouseLeave={() => isCollapsed && setHoveredItem(null)}
                          >
                            {Icon && (
                              <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                            )}
                            {!isCollapsed && <span className="truncate">{item.label}</span>}
                          </NavLink>

                          {/* Tooltip / Flyout Menu for Collapsed Mode */}
                          {isCollapsed && (
                            <div 
                              className={`
                                absolute left-full top-0 ml-2 z-50 bg-slate-800 text-white rounded-md shadow-xl border border-slate-700 py-1 min-w-[180px]
                                transition-all duration-150 origin-left
                                ${hoveredItem === item.id ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}
                              `}
                            >
                              <div className="px-3 py-2 text-sm font-medium border-b border-slate-700/50">
                                {item.label}
                              </div>
                              {item.hasSubMenu && item.subMenuItems && (
                                <div className="py-1">
                                  {item.subMenuItems.map((sub) => (
                                    <NavLink
                                      key={sub.path}
                                      to={sub.path}
                                      className={({ isActive: subActive }) => `
                                        block px-3 py-1.5 text-xs hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors
                                        ${subActive ? 'text-indigo-400 font-medium' : 'text-slate-400'}
                                      `}
                                    >
                                      {sub.label}
                                    </NavLink>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer/User Info & Collapse Toggle */}
        <div className="border-t border-slate-800 bg-slate-800/50">
          {/* Collapse Toggle (Desktop Only) */}
          <button 
            onClick={toggleCollapse}
            className="hidden lg:flex w-full items-center justify-center p-3 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border-b border-slate-800"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <PanelLeft className="w-5 h-5" />
            ) : (
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
                <PanelLeftClose className="w-4 h-4" />
                <span>Collapse Sidebar</span>
              </div>
            )}
          </button>

          <div className={`p-4 transition-all duration-300 ${isCollapsed ? 'flex justify-center' : ''}`}>
            <div className="flex items-center gap-3">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8 shadow-sm',
                  },
                }}
              />
              {!isCollapsed && (
                <div className="hidden lg:block overflow-hidden">
                  <p className="text-xs font-medium text-white truncate max-w-[140px]">
                    {user?.firstName || user?.emailAddresses[0]?.emailAddress || 'User'}
                  </p>
                  <p className="text-xs text-slate-400 capitalize">{role}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
