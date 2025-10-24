export const DashboardSettings: React.FC = () => (
  <section data-testid="dashboard-settings" style={{ display: 'grid', gap: '1.5rem' }}>
    <header>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Workspace Settings</h1>
      <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
        Configure notifications, integrations, and security defaults for your team.
      </p>
    </header>

    <article
      style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
        maxWidth: '720px',
      }}
    >
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Notification Preferences</h2>
      <ul style={{ marginTop: '0.75rem', color: '#475569', lineHeight: 1.6 }}>
        <li>Email digests: Weekly</li>
        <li>Deal alerts: Enabled</li>
        <li>Legal notifications: Enabled</li>
      </ul>
    </article>
  </section>
)
