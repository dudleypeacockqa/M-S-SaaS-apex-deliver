import { Link, useLocation } from 'react-router-dom'

const LABEL_MAP: Record<string, string> = {
  dashboard: 'Dashboard',
  deals: 'Deals',
  pipeline: 'Pipeline',
  admin: 'Admin',
  users: 'Users',
  organizations: 'Organizations',
  analytics: 'Analytics',
  documents: 'Documents',
  subscription: 'Subscription',
  settings: 'Settings',
  profile: 'Profile',
}

const prettifySegment = (segment: string): string => {
  if (LABEL_MAP[segment]) {
    return LABEL_MAP[segment]
  }
  if (/^\d+$/.test(segment)) {
    return segment
  }
  return segment
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export const Breadcrumbs: React.FC = () => {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)

  if (segments.length === 0) {
    return null
  }

  const crumbs = segments.map((segment, index) => {
    const path = '/' + segments.slice(0, index + 1).join('/')
    const label = prettifySegment(segment)
    return { label, path, isCurrent: index === segments.length - 1 }
  })

  return (
    <nav aria-label="Breadcrumb" style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
      <ol
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0.75rem 1.5rem',
          listStyle: 'none',
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          color: '#64748b',
        }}
      >
        <li>
          <Link to="/" style={{ color: '#64748b', textDecoration: 'none' }}>
            Home
          </Link>
        </li>
        {crumbs.map((crumb) => (
          <li key={crumb.path} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span aria-hidden="true">/</span>
            {crumb.isCurrent ? (
              <span style={{ color: '#4f46e5', fontWeight: 600 }}>{crumb.label}</span>
            ) : (
              <Link to={crumb.path} style={{ color: '#64748b', textDecoration: 'none' }}>
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
