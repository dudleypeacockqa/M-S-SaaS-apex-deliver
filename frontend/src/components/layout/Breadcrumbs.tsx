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
    <nav aria-label="Breadcrumb" className="text-xs font-medium text-slate-500">
      <ol className="flex items-center gap-1.5 whitespace-nowrap">
        <li>
          <Link
            to="/dashboard"
            className="text-slate-400 transition-colors hover:text-slate-900"
          >
            Home
          </Link>
        </li>
        {crumbs.map((crumb) => (
          <li key={crumb.path} className="flex items-center gap-1.5">
            <span aria-hidden="true" className="text-slate-300">{'>'}</span>
            {crumb.isCurrent ? (
              <span className="text-slate-900">{crumb.label}</span>
            ) : (
              <Link
                to={crumb.path}
                className="text-slate-400 transition-colors hover:text-slate-900"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
