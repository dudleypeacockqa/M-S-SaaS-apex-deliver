export const UserManagement: React.FC = () => (
  <section data-testid="admin-users" style={{ display: 'grid', gap: '1.5rem' }}>
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>User Directory</h1>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
          Invite, manage, and audit user access across all organizations.
        </p>
      </div>
      <button
        style={{
          background: '#4f46e5',
          color: 'white',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Invite User
      </button>
    </header>

    <article
      style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
      }}
    >
      <p style={{ color: '#475569' }}>
        User provisioning, SSO enforcement, and advanced audit logs will surface here once backend
        endpoints are available.
      </p>
    </article>
  </section>
)
