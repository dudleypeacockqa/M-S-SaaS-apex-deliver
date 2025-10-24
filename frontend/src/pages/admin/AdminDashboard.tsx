import { UserButton } from '@clerk/clerk-react'

export const AdminDashboard: React.FC = () => (
  <section data-testid="admin-dashboard" style={{ display: 'grid', gap: '1.5rem' }}>
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Platform Admin</h1>
        <p style={{ color: '#f97316', fontWeight: 600, marginTop: '0.5rem' }}>
          Restricted area · ApexDeliver platform configuration
        </p>
      </div>
      <UserButton />
    </header>

    <div
      style={{
        display: 'grid',
        gap: '1.25rem',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      }}
    >
      <article
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
        }}
      >
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Workspace Stats</h2>
        <ul style={{ marginTop: '0.75rem', color: '#475569', lineHeight: 1.6 }}>
          <li>Active users: 0</li>
          <li>Active organizations: 0</li>
          <li>Data rooms online: 0</li>
        </ul>
      </article>

      <article
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
        }}
      >
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Quick Actions</h2>
        <ul style={{ marginTop: '0.75rem', color: '#475569', lineHeight: 1.6 }}>
          <li>Review access requests</li>
          <li>Publish system announcement</li>
          <li>Run subscription reconciliation</li>
        </ul>
      </article>
    </div>
  </section>
)
