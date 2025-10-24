import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { AuthErrorBoundary } from './components/auth/AuthErrorBoundary'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Dashboard } from './pages/Dashboard'
import { DealPipeline } from './pages/deals/DealPipeline'
import { DealDetails } from './pages/deals/DealDetails'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { UserManagement } from './pages/admin/UserManagement'
import { Unauthorized } from './pages/Unauthorized'

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key')
}

function LandingPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '2rem',
      }}
    >
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>M&A Intelligence Platform</h1>
      <p style={{ fontSize: '1.25rem', marginBottom: '2rem', textAlign: 'center', maxWidth: '600px' }}>
        Enterprise-grade M&A deal management, financial intelligence, and collaboration platform
      </p>
      <SignedOut>
        <div
          style={{
            background: 'white',
            padding: '1rem 2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        >
          <SignInButton mode="modal">
            <button
              style={{
                background: '#667eea',
                color: 'white',
                border: 'none',
                padding: '0.75rem 2rem',
                fontSize: '1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              Sign In to Get Started
            </button>
          </SignInButton>
        </div>
      </SignedOut>
      <SignedIn>
        <div
          style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            color: '#333',
            textAlign: 'center',
          }}
        >
          <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>✅ You're signed in!</p>
          <UserButton afterSignOutUrl="/" />
          <div style={{ marginTop: '1rem' }}>
            <a
              href="/dashboard"
              style={{
                color: '#667eea',
                textDecoration: 'none',
                fontWeight: '600',
                display: 'inline-block',
                marginTop: '0.5rem',
              }}
            >
              Go to Dashboard →
            </a>
          </div>
        </div>
      </SignedIn>
    </div>
  )
}

export const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/deals" element={<ProtectedRoute><DealPipeline /></ProtectedRoute>} />
    <Route path="/deals/:dealId" element={<ProtectedRoute><DealDetails /></ProtectedRoute>} />
    <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
    <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><UserManagement /></ProtectedRoute>} />
    <Route path="/unauthorized" element={<Unauthorized />} />
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
