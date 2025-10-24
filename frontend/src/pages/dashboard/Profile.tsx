export const DashboardProfile: React.FC = () => (
  <section data-testid="dashboard-profile" style={{ display: 'grid', gap: '1.5rem' }}>
    <header>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Account Profile</h1>
      <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
        Manage your personal information, contact preferences, and authentication settings.
      </p>
    </header>

    <div
      style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
        maxWidth: '640px',
      }}
    >
      <dl style={{ display: 'grid', gap: '1rem' }}>
        <div>
          <dt style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Full Name</dt>
          <dd style={{ fontWeight: 600 }}>Jane Doe</dd>
        </div>
        <div>
          <dt style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Email</dt>
          <dd style={{ fontWeight: 600 }}>jane.doe@example.com</dd>
        </div>
        <div>
          <dt style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Multi-factor Authentication</dt>
          <dd style={{ fontWeight: 600 }}>Enabled</dd>
        </div>
      </dl>
    </div>
  </section>
)
