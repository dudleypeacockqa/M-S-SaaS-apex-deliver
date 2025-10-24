import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/clerk-react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { AuthErrorBoundary } from './components/auth/AuthErrorBoundary'
import { ProtectedLayout, PublicLayout } from './layouts/ProtectedLayout'
import { DashboardOverview } from './pages/dashboard/Overview'
import { DashboardProfile } from './pages/dashboard/Profile'
import { DashboardSubscription } from './pages/dashboard/Subscription'
import { DashboardSettings } from './pages/dashboard/Settings'
import { DealPipeline } from './pages/deals/DealPipeline'
import { DealDetails } from './pages/deals/DealDetails'
import { DealDocuments } from './pages/deals/DealDocuments'
import { NewDealPage } from './pages/deals/NewDealPage'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { UserManagement } from './pages/admin/UserManagement'
import { OrganizationManagement } from './pages/admin/OrganizationManagement'
import { AdminAnalytics } from './pages/admin/Analytics'
import { UnauthorizedPage } from './pages/UnauthorizedPage'

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY environment variable')
}

const LandingPage = () => (
  <section
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1.5rem',
      padding: '2rem',
      background: 'linear-gradient(135deg, #3730a3, #2563eb)',
      color: 'white',
      textAlign: 'center',
    }}
  >
    <h1 style={{ fontSize: '3rem', fontWeight: 700 }}>M&A Intelligence Platform</h1>
    <p style={{ fontSize: '1.15rem', maxWidth: '55ch' }}>
      Enterprise-grade deal execution, pipeline intelligence, and collaboration. Sign in to access
      your workspaces and data rooms.
    </p>
    <SignedOut>
      <SignInButton mode="modal" afterSignInUrl="/dashboard/overview">
        <span
          role="button"
          tabIndex={0}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.9rem 2.5rem',
            borderRadius: '9999px',
            background: 'rgba(255,255,255,0.15)',
            color: 'white',
            fontWeight: 600,
            boxShadow: '0 12px 30px rgba(15, 23, 42, 0.15)',
            cursor: 'pointer',
            border: '1px solid rgba(255,255,255,0.4)',
          }}
        >
          Sign In to Get Started
        </span>
      </SignInButton>
    </SignedOut>
    <SignedIn>
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.35)',
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <UserButton afterSignOutUrl="/" />
        <a
          href="/dashboard/overview"
          style={{
            color: 'white',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Go to Dashboard →
        </a>
      </div>
    </SignedIn>
  </section>
)

const SignInPage = () => (
  <section
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      padding: '2rem',
      background: '#f8fafc',
      color: '#0f172a',
    }}
  >
    <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Sign in to ApexDeliver</h1>
    <p style={{ color: '#64748b' }}>Use the button below to authenticate with Clerk.</p>
    <SignInButton mode="modal" afterSignInUrl="/dashboard/overview">
      <span
        role="button"
        tabIndex={0}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.75rem 1.75rem',
          borderRadius: '10px',
          background: '#4f46e5',
          color: 'white',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Open Sign-In
      </span>
    </SignInButton>
  </section>
)

export const AppRoutes = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      <Route index element={<LandingPage />} />
      <Route path="unauthorized" element={<UnauthorizedPage />} />
      <Route path="sign-in" element={<SignInPage />} />
    </Route>

    <Route element={<ProtectedLayout />}>
      <Route path="dashboard">
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<DashboardOverview />} />
        <Route path="profile" element={<DashboardProfile />} />
        <Route path="subscription" element={<DashboardSubscription />} />
        <Route path="settings" element={<DashboardSettings />} />
      </Route>

      <Route path="deals">
        <Route index element={<Navigate to="pipeline" replace />} />
        <Route path="pipeline" element={<DealPipeline />} />
        <Route path="new" element={<NewDealPage />} />
        <Route path=":dealId" element={<DealDetails />} />
        <Route path=":dealId/documents" element={<DealDocuments />} />
      </Route>
    </Route>

    <Route element={<ProtectedLayout requiredRole="admin" />}>
      <Route path="admin">
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="organizations" element={<OrganizationManagement />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <AuthErrorBoundary>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthErrorBoundary>
    </ClerkProvider>
  )
}

export default App
