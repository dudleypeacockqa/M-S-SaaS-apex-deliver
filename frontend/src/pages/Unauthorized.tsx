const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#fef2f2',
  padding: '2rem',
}

const panelStyle: React.CSSProperties = {
  maxWidth: '480px',
  width: '100%',
  background: 'white',
  borderRadius: '12px',
  boxShadow: '0 20px 25px -15px rgba(239,68,68,0.4)',
  padding: '2.5rem',
  border: '1px solid #fecaca',
  textAlign: 'center',
}

export const Unauthorized: React.FC = () => {
  return (
    <div style={containerStyle}>
      <div style={panelStyle}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '3rem',
            height: '3rem',
            borderRadius: '9999px',
            background: '#fee2e2',
            color: '#dc2626',
            fontWeight: 700,
            marginBottom: '1.5rem',
          }}
        >
          !
        </span>
        <h1
          data-testid="unauthorized-page"
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: '#b91c1c',
            marginBottom: '1rem',
          }}
        >
          Access Restricted
        </h1>
        <p style={{ color: '#7f1d1d', lineHeight: 1.6, marginBottom: '2rem' }}>
          You need additional permissions to view this area. Contact an administrator if you believe this is a
          mistake.
        </p>
        <a
          href="/"
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            background: '#ef4444',
            color: 'white',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Return to Dashboard
        </a>
      </div>
    </div>
  )
}

export default Unauthorized
