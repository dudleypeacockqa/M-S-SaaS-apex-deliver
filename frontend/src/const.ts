import type { UserRole } from './components/auth/ProtectedRoute'

export const APP_LOGO = '/logo.svg'
export const APP_TITLE = 'ApexDeliver'

export type WorkspaceNavId =
  | 'dashboard'
  | 'deals'
  | 'deal-matching'
  | 'tasks'
  | 'documents'
  | 'events'
  | 'community'
  | 'billing'
  | 'podcast-studio'
  | 'fpa'
  | 'customer-portal'
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
    id: 'deal-matching',
    label: 'Deal Matching',
    path: '/deals/matching',
    roles: ['growth', 'enterprise', 'admin'], // Professional+ tier
  },
  {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    roles: ['solo', 'growth', 'enterprise', 'admin'],
  },
  {
    id: 'documents',
    label: 'Documents',
    path: '/documents',
    roles: ['solo', 'growth', 'enterprise', 'admin'],
  },
  {
    id: 'events',
    label: 'Events',
    path: '/events',
    roles: ['growth', 'enterprise', 'admin'],
  },
  {
    id: 'community',
    label: 'Community',
    path: '/community',
    roles: ['growth', 'enterprise', 'admin'],
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
    id: 'fpa',
    label: 'FP&A',
    path: '/fpa',
    roles: ['growth', 'enterprise', 'admin'], // Professional+ tier (FP&A subscribers)
  },
  {
    id: 'admin',
    label: 'Admin',
    path: '/admin',
    roles: ['admin'],
  },
]

// Customer Portal navigation (for B2B2C sub-sub-accounts)
// Note: Customer portal role may need to be added to UserRole type if separate from main roles
const customerPortalNavItem: WorkspaceNavigationItem = {
  id: 'customer-portal',
  label: 'Customer Portal',
  path: '/customer-portal',
  roles: ['solo', 'growth', 'enterprise', 'admin'], // Will be restricted to customer role when implemented
}

// Master Admin Portal (feature-flagged - backend API not yet deployed)
const masterAdminNavItem: WorkspaceNavigationItem = {
  id: 'master-admin',
  label: 'Master Admin',
  path: '/master-admin',
  roles: ['admin'],
}

const enableMasterAdmin = import.meta.env.VITE_ENABLE_MASTER_ADMIN !== 'false'
const enableCustomerPortal = import.meta.env.VITE_ENABLE_CUSTOMER_PORTAL !== 'false'

export const WORKSPACE_NAV_ITEMS: WorkspaceNavigationItem[] = [
  ...baseNavItems,
  ...(enableMasterAdmin ? [masterAdminNavItem] : []),
  ...(enableCustomerPortal ? [customerPortalNavItem] : []),
]

export const getLoginUrl = () => {
  return import.meta.env.VITE_CLERK_SIGN_IN_URL || '/sign-in'
}
