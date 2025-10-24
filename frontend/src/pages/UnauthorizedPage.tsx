import { Link, useLocation } from 'react-router-dom'

interface UnauthorizedState {
  requiredRole?: string | string[]
}

export const UnauthorizedPage: React.FC = () => {
  const location = useLocation()
  const state = location.state as UnauthorizedState | undefined

  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.25rem',
        background: '#f8fafc',
        color: '#0f172a',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '2.25rem', fontWeight: 700 }}>Access Denied</h1>
      <p style={{ color: '#64748b', maxWidth: '50ch' }}>
        You don't have permission to access this area. If you believe this is an error, please contact
        your administrator.
      </p>
      {state?.requiredRole && (
        <p style={{ color: '#ea580c' }}>
          Required role:
          <strong style={{ marginLeft: '0.5rem' }}>
            {Array.isArray(state.requiredRole) ? state.requiredRole.join(', ') : state.requiredRole}
          </strong>
        </p>
      )}
      <Link
        to="/"
        style={{
          marginTop: '0.5rem',
          padding: '0.75rem 1.75rem',
          background: '#4f46e5',
          color: 'white',
          borderRadius: '9999px',
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        Go to Home
      </Link>
    </section>
  )
}
