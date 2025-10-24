export const DashboardSubscription: React.FC = () => (
  <section data-testid="dashboard-subscription" style={{ display: 'grid', gap: '1.5rem' }}>
    <header>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Subscription</h1>
      <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
        Review your current plan and manage billing preferences for your workspace.
      </p>
    </header>

    <article
      style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
        maxWidth: '640px',
      }}
    >
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Growth Plan</h2>
      <p style={{ color: '#64748b', marginTop: '0.75rem' }}>
        £598/month • 5 seats included
      </p>
      <ul style={{ marginTop: '1rem', color: '#475569', lineHeight: 1.6 }}>
        <li>Full deal pipeline analytics</li>
        <li>Collaborative workspaces and data rooms</li>
        <li>AI-generated diligence summaries</li>
      </ul>
    </article>
  </section>
)
