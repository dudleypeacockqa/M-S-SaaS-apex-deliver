import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useUser, UserButton } from '@clerk/clerk-react'
import {
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  Briefcase,
  CreditCard,
  Mic,
  Settings,
  ChevronLeft,
  ChevronRight
} from '@/lib/icons'

import type { UserRole } from '../auth/ProtectedRoute'
import { APP_TITLE } from '../../const'

const resolveRole = (role: unknown): UserRole => {
  if (role === 'growth' || role === 'enterprise' || role === 'admin' || role === 'master_admin') {
    return role
  }
  return 'solo'
}

interface NavSection {
  id: string
  label: string
  icon?: React.ReactNode
  roles: UserRole[]
  items?: NavItem[]
  path?: string
  exact?: boolean
}

interface NavItem {
  id: string
  label: string
  path: string
  roles: UserRole[]
  exact?: boolean
}

const navSections: NavSection[] = [
  {
    id: 'overview',
    label: 'OVERVIEW',
    roles: ['solo', 'growth', 'enterprise', 'admin'],
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/dashboard',
        roles: ['solo', 'growth', 'enterprise', 'admin'],
        exact: true,
      },
    ],
  },
  {
    id: 'deals-section',
    label: 'DEAL MANAGEMENT',
    roles: ['solo', 'growth', 'enterprise', 'admin'],
    items: [
      {
        id: 'deals',
        label: 'Deals Pipeline',
        path: '/deals',
        roles: ['solo', 'growth', 'enterprise', 'admin'],
      },
      {
        id: 'data-room',
        label: 'Data Room',
        path: '/deals/data-room',
        roles: ['solo', 'growth', 'enterprise', 'admin'],
      },
    ],
  },
  {
    id: 'financial',
    label: 'FINANCIAL MANAGEMENT',
    roles: ['solo', 'growth', 'enterprise', 'admin'],
    items: [
      {
        id: 'billing',
        label: 'Billing',
        path: '/dashboard/billing',
        roles: ['solo', 'growth', 'enterprise', 'admin'],
        exact: true,
      },
    ],
  },
  {
    id: 'content',
    label: 'CONTENT & MEDIA',
    roles: ['growth', 'enterprise', 'admin'],
    items: [
      {
        id: 'podcast-studio',
        label: 'Podcast Studio',
        path: '/podcast-studio',
        roles: ['growth', 'enterprise', 'admin'],
      },
    ],
  },
  {
    id: 'administration',
    label: 'ADMINISTRATION',
    roles: ['admin', 'master_admin'],
    items: [
      {
        id: 'admin',
        label: 'Admin Panel',
        path: '/admin',
        roles: ['admin'],
      },
      {
        id: 'master-admin',
        label: 'Master Admin',
        path: '/master-admin',
        roles: ['master_admin'],
      },
    ],
  },
]

export const Sidebar: React.FC = () => {
  const { user } = useUser()
  const role = resolveRole(user?.publicMetadata?.role)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    'deals-section': true,
    financial: false,
    content: false,
    administration: false,
  })
  const [collapsed, setCollapsed] = useState(false)

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  const visibleSections = navSections
    .map((section) => ({
      ...section,
      items: (section.items ?? []).filter((item) => item.roles.includes(role)),
    }))
    .filter(
      (section) => section.roles.includes(role) && section.items && section.items.length > 0,
    )

  return (
    <aside
      style={{
        width: collapsed ? '80px' : '280px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        background: '#0f172a',
        color: '#e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
      aria-label="Main navigation sidebar"
    >
      {/* Header */}
      <div
        style={{
          padding: collapsed ? '1.5rem 0.75rem' : '1.5rem 1.5rem',
          borderBottom: '1px solid rgba(226, 232, 240, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: collapsed ? '0.875rem' : '1rem',
              color: 'white',
            }}
          >
            {collapsed ? 'S' : 'S'}
          </div>
          {!collapsed && (
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: '1.125rem',
                  color: 'white',
                  lineHeight: 1,
                }}
              >
                {APP_TITLE}
              </div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#94a3b8',
                  marginTop: '2px',
                }}
              >
                M&A Intelligence
              </div>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'rgba(79, 70, 229, 0.2)',
            border: 'none',
            borderRadius: '6px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#4f46e5',
            transition: 'all 0.2s ease',
          }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: collapsed ? '1rem 0.5rem' : '1.5rem 1rem' }}>
        {visibleSections.map((section) => {
          const isExpanded = expandedSections[section.id]
          const visibleItems = section.items?.filter((item) => item.roles.includes(role)) || []

          if (visibleItems.length === 0) return null

          return (
            <div key={section.id} style={{ marginBottom: '1.5rem' }}>
              {/* Section Header */}
              {!collapsed && (
                <button
                  onClick={() => toggleSection(section.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.75rem',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'color 0.2s ease',
                  }}
                  aria-expanded={isExpanded}
                >
                  <span>{section.label}</span>
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              )}

              {/* Section Items */}
              {(collapsed || isExpanded) && (
                <div style={{ marginTop: collapsed ? '0' : '0.5rem' }}>
                  {visibleItems.map((item) => (
                    <NavLink
                      key={item.id}
                      to={item.path}
                      end={item.exact}
                      style={({ isActive }) => ({
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: collapsed ? '0.75rem' : '0.75rem 1rem',
                        marginBottom: '0.25rem',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        color: isActive ? 'white' : '#94a3b8',
                        background: isActive ? 'rgba(79, 70, 229, 0.2)' : 'transparent',
                        fontWeight: isActive ? 600 : 500,
                        fontSize: '0.875rem',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                      })}
                      onMouseEnter={(e) => {
                        if (!e.currentTarget.getAttribute('data-active')) {
                          e.currentTarget.style.background = 'rgba(148, 163, 184, 0.1)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!e.currentTarget.getAttribute('data-active')) {
                          e.currentTarget.style.background = 'transparent'
                        }
                      }}
                      data-active={undefined}
                    >
                      {collapsed ? (
                        <span
                          title={item.label}
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: 'currentColor',
                          }}
                        />
                      ) : (
                        <>
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: 'currentColor',
                              flexShrink: 0,
                            }}
                          />
                          <span>{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer with User Button */}
      <div
        style={{
          padding: collapsed ? '1rem 0.75rem' : '1rem 1.5rem',
          borderTop: '1px solid rgba(226, 232, 240, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          gap: '0.75rem',
        }}
      >
        {!collapsed && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'white',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {user?.fullName || user?.primaryEmailAddress?.emailAddress}
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                color: '#64748b',
                textTransform: 'capitalize',
              }}
            >
              {role} Plan
            </div>
          </div>
        )}
        <UserButton
          data-testid="user-button"
          appearance={{
            elements: {
              userButtonAvatarBox: {
                width: collapsed ? '40px' : '36px',
                height: collapsed ? '40px' : '36px',
              },
            },
          }}
        />
      </div>
    </aside>
  )
}
