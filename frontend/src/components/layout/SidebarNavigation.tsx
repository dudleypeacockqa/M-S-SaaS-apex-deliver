import React, { useMemo, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useUser, UserButton } from '@clerk/clerk-react'
import {
  ChevronDown,
  ChevronRight,
  Menu,
  PanelLeft,
  PanelRight,
  Sparkles,
  X,
} from '@/lib/icons'

import type { UserRole } from '../auth/ProtectedRoute'
import { APP_TITLE, WORKSPACE_NAV_ITEMS } from '../../const'
import { useSidebar } from '../../hooks/useSidebar'

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
    new Set([
      'OVERVIEW',
      'DEAL MANAGEMENT',
      'CONTENT & MEDIA',
      'FINANCIAL INTELLIGENCE',
      'COLLABORATION',
      'ADMINISTRATION',
    ])
  )
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const visibleItems = useMemo(() => {
    return role === 'master_admin' ? WORKSPACE_NAV_ITEMS : WORKSPACE_NAV_ITEMS.filter((item) => item.roles.includes(role))
  }, [role])

  const sections = useMemo(() => {
    const sectionMap = new Map<string, typeof WORKSPACE_NAV_ITEMS>()

    visibleItems.forEach((item) => {
      const section = item.section || 'OTHER'
      if (!sectionMap.has(section)) {
        sectionMap.set(section, [])
      }
      sectionMap.get(section)!.push(item)
    })

    const order = [
      'OVERVIEW',
      'DEAL MANAGEMENT',
      'COLLABORATION',
      'CONTENT & MEDIA',
      'FINANCIAL INTELLIGENCE',
      'ADMINISTRATION',
      'OTHER',
    ]

    return order
      .filter((section) => sectionMap.has(section))
      .map((section) => ({
        title: section,
        items: sectionMap.get(section)!,
      }))
  }, [visibleItems])

  const toggleSection = (section: string) => {
    if (isCollapsed) {
      return
    }
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(section)) {
        next.delete(section)
      } else {
        next.add(section)
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

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  const sidebarWidthClass = !isMobileMenuOpen && isCollapsed ? 'lg:w-16' : 'lg:w-64'
  const sidebarTranslation = isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileMenuOpen((open) => !open)}
        className="lg:hidden fixed top-4 left-4 z-50 rounded-lg bg-slate-950/90 p-2 text-white shadow-lg shadow-slate-900/40"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-slate-950/60 backdrop-blur"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      <aside
        className={`relative fixed left-0 top-0 z-40 flex h-full flex-col border-r border-white/10 bg-gradient-to-b from-slate-950/95 via-slate-950/80 to-slate-950/90 text-white shadow-[0_25px_120px_rgba(2,6,23,0.55)] backdrop-blur-2xl transition-[width,transform] duration-300 ease-out ${sidebarTranslation} ${sidebarWidthClass}`}
        data-collapsed={isCollapsed}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/10 via-white/5 to-transparent" aria-hidden="true" />

        {/* Brand */}
        <div className="relative z-10 flex h-16 items-center justify-between border-b border-white/5 px-4">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'w-full justify-center' : ''}`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-400 to-sky-400 text-lg font-bold shadow-lg shadow-indigo-900/40">
              AD
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-base font-semibold tracking-wide text-white">{APP_TITLE}</p>
                <p className="flex items-center gap-1 text-xs uppercase tracking-[0.3em] text-slate-400">
                  <Sparkles className="h-3 w-3 text-indigo-300" />
                  HQ Workspace
                </p>
              </div>
            )}
          </div>
          <button
            onClick={closeMobileMenu}
            className="lg:hidden rounded-md p-1 text-slate-400 transition hover:text-white"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex-1 overflow-y-auto px-2 py-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
          {sections.map((section) => {
            const expanded = isCollapsed ? true : expandedSections.has(section.title)

            return (
              <div key={section.title} className="mb-5">
                {!isCollapsed && (
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="flex w-full items-center justify-between px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400 transition hover:text-white"
                    aria-expanded={expanded}
                  >
                    <span className="truncate">{section.title}</span>
                    {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                )}

                {isCollapsed && (
                  <div className="mx-auto my-3 h-px w-8 bg-white/10" aria-hidden="true" />
                )}

                {expanded && (
                  <div className={isCollapsed ? 'space-y-3' : 'mt-2 space-y-1'}>
                    {section.items.map((item) => {
                      const Icon = item.icon
                      const active = isActive(item.path, item.exact)

                      return (
                        <div key={item.id} className="relative">
                          <NavLink
                            to={item.path}
                            end={item.exact}
                            onClick={closeMobileMenu}
                            className={`
                              group relative flex items-center gap-3 rounded-2xl text-sm font-medium transition-all
                              ${isCollapsed ? 'justify-center px-0 py-3' : 'px-4 py-2.5'}
                              ${active
                                ? 'bg-white/10 text-white ring-1 ring-white/20 shadow-inner shadow-indigo-900/30'
                                : 'text-slate-300 hover:bg-white/5 hover:text-white'}
                            `}
                            aria-label={isCollapsed ? item.label : undefined}
                            onMouseEnter={() => isCollapsed && setHoveredItem(item.id)}
                            onMouseLeave={() => isCollapsed && setHoveredItem(null)}
                          >
                            {Icon && <Icon className={`h-5 w-5 flex-shrink-0 ${active ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />}
                            {!isCollapsed && <span className="truncate">{item.label}</span>}
                          </NavLink>

                          {isCollapsed && (
                            <div
                              className={`
                                absolute left-full top-1/2 ml-3 min-w-[220px] -translate-y-1/2 rounded-2xl border border-white/10 bg-slate-900/90 p-3 text-left text-sm shadow-2xl shadow-slate-900/40 backdrop-blur-xl transition-all
                                ${hoveredItem === item.id ? 'visible opacity-100 translate-x-0' : 'invisible -translate-x-2 opacity-0'}
                              `}
                              aria-hidden={hoveredItem !== item.id}
                            >
                              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">{section.title}</p>
                              <p className="mt-1 text-sm font-semibold text-white">{item.label}</p>
                              {item.hasSubMenu && item.subMenuItems && (
                                <div className="mt-3 space-y-1">
                                  {item.subMenuItems.map((sub) => (
                                    <NavLink
                                      key={sub.path}
                                      to={sub.path}
                                      className={({ isActive: subActive }) => `
                                        block rounded-lg px-3 py-1.5 text-xs transition hover:bg-white/5
                                        ${subActive ? 'text-indigo-300' : 'text-slate-300'}
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
                      )}
                    })}
                  </div>
                )}
              </div>
            )}
          })}
        </nav>

        {/* Footer */}
        <div className="relative z-10 border-t border-white/5 bg-slate-950/60">
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex w-full items-center justify-center gap-2 border-b border-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 transition hover:text-white"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-pressed={isCollapsed}
          >
            {isCollapsed ? <PanelRight className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
            {!isCollapsed && <span>Mini Mode</span>}
          </button>

          <div className={`flex items-center gap-3 px-4 py-4 ${isCollapsed ? 'justify-center' : ''}`}>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-10 h-10 ring-2 ring-white/10 shadow-lg shadow-slate-900/40',
                },
              }}
            />
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {user?.firstName || user?.primaryEmailAddress?.emailAddress || 'User'}
                </p>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{role}</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
