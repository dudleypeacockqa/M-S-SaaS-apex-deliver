import type { UserRole } from './components/auth/ProtectedRoute'
import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Briefcase,
  CheckSquare,
  FileText,
  Calendar,
  Users,
  CreditCard,
  Mic,
  TrendingUp,
  Settings,
  UserCog,
  Building2,
  KanbanSquare,
} from 'lucide-react'

export const APP_LOGO = '/assets/brand/apexdeliver-wordmark.svg'
export const APP_TITLE = 'ApexDeliver'

export type WorkspaceNavId =
  | 'dashboard'
  | 'deals'
  | 'tasks'
  | 'documents'
  | 'events'
  | 'community'
  | 'billing'
  | 'podcast-studio'
  | 'fpa'
  | 'pmi'
  | 'customer-portal'
  | 'admin'
  | 'master-admin'

export interface SubMenuItem {
  label: string
  path: string
  icon?: LucideIcon
}

export interface WorkspaceNavigationItem {
  id: WorkspaceNavId
  label: string
  path: string
  roles: UserRole[]
  exact?: boolean
  icon?: LucideIcon
  section?: string
  hasSubMenu?: boolean
  subMenuItems?: SubMenuItem[]
}

// Base navigation items (always visible)
const baseNavItems: WorkspaceNavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    roles: ['solo', 'growth', 'enterprise', 'admin'],
    exact: true,
    icon: LayoutDashboard,
    section: 'OVERVIEW',
  },
  {
    id: 'deals',
    label: 'Deals',
    path: '/deals',
    roles: ['solo', 'growth', 'enterprise', 'admin'],
    icon: Briefcase,
    section: 'DEAL MANAGEMENT',
    hasSubMenu: true,
    subMenuItems: [
      { label: 'Pipeline', path: '/deals' },
      { label: 'Matching Intelligence', path: '/deals/matching' },
      { label: 'Deal Details', path: '/deals/workspaces/details' },
      { label: 'Data Room', path: '/deals/workspaces/data-room' },
      { label: 'Valuation Suite', path: '/deals/workspaces/valuation' },
      { label: 'Financial Intelligence', path: '/deals/workspaces/financial' },
    ],
  },
  {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    roles: ['solo', 'growth', 'enterprise', 'admin'],
    icon: CheckSquare,
    section: 'DEAL MANAGEMENT',
  },
  {
    id: 'documents',
    label: 'Documents',
    path: '/documents',
    roles: ['solo', 'growth', 'enterprise', 'admin'],
    icon: FileText,
    section: 'DEAL MANAGEMENT',
  },
  {
    id: 'events',
    label: 'Events',
    path: '/events',
    roles: ['growth', 'enterprise', 'admin'],
    icon: Calendar,
    section: 'COLLABORATION',
  },
  {
    id: 'community',
    label: 'Community',
    path: '/community',
    roles: ['growth', 'enterprise', 'admin'],
    icon: Users,
    section: 'COLLABORATION',
  },
  {
    id: 'podcast-studio',
    label: 'Podcast Studio',
    path: '/podcast-studio',
    roles: ['growth', 'enterprise', 'admin'],
    icon: Mic,
    section: 'CONTENT & MEDIA',
  },
  {
    id: 'fpa',
    label: 'FP&A',
    path: '/fpa',
    roles: ['growth', 'enterprise', 'admin'], // Professional+ tier (FP&A subscribers)
    icon: TrendingUp,
    section: 'FINANCIAL INTELLIGENCE',
    hasSubMenu: true,
    subMenuItems: [
      { label: 'Executive Dashboard', path: '/fpa' },
      { label: 'Demand Forecasting', path: '/fpa/demand-forecasting' },
      { label: 'Inventory Management', path: '/fpa/inventory' },
      { label: 'Production Tracking', path: '/fpa/production' },
      { label: 'Quality Control', path: '/fpa/quality' },
      { label: 'Working Capital', path: '/fpa/working-capital' },
      { label: 'What-If Analysis', path: '/fpa/what-if' },
      { label: 'Financial Reports', path: '/fpa/reports' },
      { label: 'Data Import', path: '/fpa/import' },
      { label: 'Admin Panel', path: '/fpa/admin' },
    ],
  },
  {
    id: 'pmi',
    label: 'PMI Projects',
    path: '/pmi/projects',
    roles: ['growth', 'enterprise', 'admin'],
    icon: KanbanSquare,
    section: 'DEAL MANAGEMENT',
    hasSubMenu: true,
    subMenuItems: [
      { label: 'Project Portfolio', path: '/pmi/projects' },
      { label: 'Create Project', path: '/pmi/projects/new' },
    ],
  },
  {
    id: 'billing',
    label: 'Billing',
    path: '/dashboard/billing',
    roles: ['solo', 'growth', 'enterprise', 'admin'],
    exact: true,
    icon: CreditCard,
    section: 'ADMINISTRATION',
  },
  {
    id: 'admin',
    label: 'Admin',
    path: '/admin',
    roles: ['admin'],
    icon: Settings,
    section: 'ADMINISTRATION',
    hasSubMenu: true,
    subMenuItems: [
      { label: 'Dashboard', path: '/admin' },
      { label: 'Users', path: '/admin/users' },
      { label: 'Organizations', path: '/admin/organizations' },
      { label: 'System Health', path: '/admin/system' },
    ],
  },
]

// Customer Portal navigation (for B2B2C sub-sub-accounts)
// Note: Customer portal role may need to be added to UserRole type if separate from main roles
const customerPortalNavItem: WorkspaceNavigationItem = {
  id: 'customer-portal',
  label: 'Customer Portal',
  path: '/customer-portal',
  roles: ['solo', 'growth', 'enterprise', 'admin'], // Will be restricted to customer role when implemented
  icon: Building2,
  section: 'ADMINISTRATION',
}

// Master Admin Portal (feature-flagged - backend API not yet deployed)
const masterAdminNavItem: WorkspaceNavigationItem = {
  id: 'master-admin',
  label: 'Master Admin',
  path: '/master-admin',
  roles: ['master_admin'],
  icon: UserCog,
  section: 'ADMINISTRATION',
  hasSubMenu: true,
  subMenuItems: [
    { label: 'Dashboard', path: '/master-admin' },
    { label: 'Activity Tracker', path: '/master-admin/activity' },
    { label: 'Prospect Pipeline', path: '/master-admin/prospects' },
    { label: 'Campaign Manager', path: '/master-admin/campaigns' },
    { label: 'Voice Campaign', path: '/master-admin/voice' },
    { label: 'Template Manager', path: '/master-admin/templates' },
    { label: 'Content Studio', path: '/master-admin/content' },
    { label: 'Lead Capture', path: '/master-admin/leads' },
    { label: 'Sales Collateral', path: '/master-admin/collateral' },
  ],
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

export interface FlattenedWorkspaceNavItem {
  id: string
  label: string
  path: string
  section: string
  roles: UserRole[]
  icon?: LucideIcon
}

export const FLATTENED_WORKSPACE_NAV_ITEMS: FlattenedWorkspaceNavItem[] = WORKSPACE_NAV_ITEMS.flatMap((item) => {
  const baseItem = [{
    id: item.id,
    label: item.label,
    path: item.path,
    section: item.section || 'Navigation',
    roles: item.roles,
    icon: item.icon,
  }]

  const subItems = (item.subMenuItems ?? []).map((sub) => ({
    id: `${item.id}-${sub.path}`,
    label: `${item.label} > ${sub.label}`,
    path: sub.path,
    section: item.section || 'Navigation',
    roles: item.roles,
    icon: sub.icon || item.icon,
  }))

  return [...baseItem, ...subItems]
})

