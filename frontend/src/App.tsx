import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Import Clerk publishable key from environment
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key')
}

// Landing page component
function LandingPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>
        M&A Intelligence Platform
      </h1>
      <p style={{ fontSize: '1.25rem', marginBottom: '2rem', textAlign: 'center', maxWidth: '600px' }}>
        Enterprise-grade M&A deal management, financial intelligence, and collaboration platform
      </p>
      <SignedOut>
        <div style={{ 
          background: 'white', 
          padding: '1rem 2rem', 
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <SignInButton mode="modal">
            <button style={{
              background: '#667eea',
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              Sign In to Get Started
            </button>
          </SignInButton>
        </div>
      </SignedOut>
      <SignedIn>
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          color: '#333',
          textAlign: 'center'
        }}>
          <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>✅ You're signed in!</p>
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>
    </div>
  )
}

// Dashboard component (protected route)
function Dashboard() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        padding: '1rem',
        background: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <h1 style={{ margin: 0 }}>Dashboard</h1>
        <UserButton afterSignOutUrl="/" />
      </header>
      <main>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2>Welcome to your M&A Intelligence Platform</h2>
          <p>This is a protected route. Only authenticated users can see this.</p>
          <div style={{ marginTop: '2rem' }}>
            <h3>Next Steps:</h3>
            <ul>
              <li>✅ Frontend authentication working (DEV-002 Complete)</li>
              <li>🔄 Protected routing (DEV-003 - In Progress)</li>
              <li>⏳ Backend Clerk sync (DEV-004 - Planned)</li>
              <li>⏳ RBAC implementation (DEV-005 - Planned)</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

// Main App component
function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/dashboard" 
            element={
              <SignedIn>
                <Dashboard />
              </SignedIn>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  )
}

export default App

