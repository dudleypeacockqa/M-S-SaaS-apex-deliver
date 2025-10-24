import { Link, useLocation } from 'react-router-dom'

/**
 * Breadcrumbs Component
 *
 * Displays hierarchical navigation breadcrumbs based on current route.
 * Automatically generates breadcrumb trail from URL segments.
 */
export const Breadcrumbs: React.FC = () => {
  const location = useLocation()

  // Parse pathname into breadcrumb segments
  const pathSegments = location.pathname.split('/').filter(Boolean)

  // Map segment names to human-readable labels
  const segmentLabels: Record<string, string> = {
    dashboard: 'Dashboard',
    deals: 'Deals',
    admin: 'Admin',
    users: 'Users',
    organizations: 'Organizations',
    documents: 'Documents'
  }

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    ...pathSegments.map((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + 1).join('/')
      const label = segmentLabels[segment] || segment
      return { label, path }
    })
  ]

  // Don't show breadcrumbs on root path
  if (pathSegments.length === 0) {
    return null
  }

  return (
    <nav
      role="navigation"
      aria-label="breadcrumb"
      style={{
        padding: '1rem 2rem',
        background: '#f9fafb',
        borderBottom: '1px solid #e5e7eb'
      }}
    >
      <ol
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1

          return (
            <li key={item.path} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {index > 0 && (
                <span style={{ color: '#9ca3af' }}>/</span>
              )}
              {isLast ? (
                <span style={{ color: '#667eea', fontWeight: '600' }}>
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  style={{
                    color: '#6b7280',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#667eea'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#6b7280'
                  }}
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
