export const DashboardOverview: React.FC = () => {
  return (
    <section data-testid="dashboard-overview" style={{ display: 'grid', gap: '1.5rem' }}>
      <header>
        <p style={{ color: '#475569', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Overview
        </p>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.25rem' }}>Welcome back</h1>
        <p style={{ color: '#64748b', marginTop: '0.75rem', maxWidth: '60ch' }}>
          Review the status of your active deals, track pipeline momentum, and jump into the most
          important work for your team.
        </p>
      </header>

      <div
        style={{
          display: 'grid',
          gap: '1.25rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        }}
      >
        {[
          { label: 'Active Deals', value: '6', trend: '+2 this week' },
          { label: 'In Diligence', value: '3', trend: 'On track' },
          { label: 'Average Cycle', value: '54d', trend: '-6 days vs last month' },
        ].map((metric) => (
          <article
            key={metric.label}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 12px 24px rgba(15, 23, 42, 0.08)',
            }}
          >
            <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>{metric.label}</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem' }}>{metric.value}</p>
            <p style={{ color: '#22c55e', fontSize: '0.875rem', marginTop: '0.75rem' }}>{metric.trend}</p>
          </article>
        ))}
      </div>

      <article
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
        }}
      >
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Today&apos;s Focus</h2>
        <ul style={{ marginTop: '1rem', color: '#475569', lineHeight: 1.6 }}>
          <li>Host diligence review for Deal #1347 at 11:00 GMT</li>
          <li>Review redlines from legal for Vertex Analytics acquisition</li>
          <li>Approve access requests for the Q4 data room</li>
        </ul>
      </article>
    </section>
  )
}
