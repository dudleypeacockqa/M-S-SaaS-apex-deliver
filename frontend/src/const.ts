import type { UserRole } from './components/auth/ProtectedRoute'

export const APP_LOGO = '/logo.svg'
export const APP_TITLE = 'ApexDeliver'

export type WorkspaceNavId =
  | 'dashboard'
  | 'deals'
  | 'billing'
  | 'podcast-studio'
  | 'admin'
  | 'master-admin'

export interface WorkspaceNavigationItem {
  id: WorkspaceNavId
  label: string
  path: string
  roles: UserRole[]
  exact?: boolean
}

export const WORKSPACE_NAV_ITEMS: WorkspaceNavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    roles: ['solo', 'growth', 'enterprise', 'admin'],
    exact: true,
  },
  {
    id: 'deals',
    label: 'Deals',
    path: '/deals',
    roles: ['solo', 'growth', 'enterprise', 'admin'],
  },
  {
    id: 'billing',
    label: 'Billing',
    path: '/dashboard/billing',
    roles: ['solo', 'growth', 'enterprise', 'admin'],
    exact: true,
  },
  {
    id: 'podcast-studio',
    label: 'Podcast Studio',
    path: '/podcast-studio',
    roles: ['growth', 'enterprise', 'admin'],
  },
  {
    id: 'admin',
    label: 'Admin',
    path: '/admin',
    roles: ['admin'],
  },
  {
    id: 'master-admin',
    label: 'Master Admin',
    path: '/master-admin',
    roles: ['admin'],
  },
]

export const getLoginUrl = () => {
  return import.meta.env.VITE_CLERK_SIGN_IN_URL || '/sign-in'
}
