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

// Base navigation items (always visible)
const baseNavItems: WorkspaceNavigationItem[] = [
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
]

// Master Admin Portal (feature-flagged - backend API not yet deployed)
const masterAdminNavItem: WorkspaceNavigationItem = {
  id: 'master-admin',
  label: 'Master Admin',
  path: '/master-admin',
  roles: ['admin'],
}

const enableMasterAdmin = import.meta.env.VITE_ENABLE_MASTER_ADMIN !== 'false'

export const WORKSPACE_NAV_ITEMS: WorkspaceNavigationItem[] = [
  ...baseNavItems,
  ...(enableMasterAdmin ? [masterAdminNavItem] : []),
]

export const getLoginUrl = () => {
  return import.meta.env.VITE_CLERK_SIGN_IN_URL || '/sign-in'
}
