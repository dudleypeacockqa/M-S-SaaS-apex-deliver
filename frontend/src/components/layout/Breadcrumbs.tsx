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
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-sm text-slate-600">
        <li>
          <Link to="/dashboard" className="hover:text-slate-900 transition-colors">
            Home
          </Link>
        </li>
        {crumbs.map((crumb) => (
          <li key={crumb.path} className="flex items-center gap-2">
            <span aria-hidden="true" className="text-slate-400">/</span>
            {crumb.isCurrent ? (
              <span className="text-indigo-600 font-semibold">{crumb.label}</span>
            ) : (
              <Link to={crumb.path} className="hover:text-slate-900 transition-colors">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
