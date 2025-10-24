export const AdminAnalytics: React.FC = () => (
  <section data-testid="admin-analytics" style={{ display: 'grid', gap: '1.5rem' }}>
    <header>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Platform Analytics</h1>
      <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
        Monitor usage trends, subscription growth, and operational performance across the platform.
      </p>
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
        Analytics dashboards will connect here after the telemetry pipeline is deployed. Expect cohort
        breakdowns, pipeline velocity, and ARR projections.
      </p>
    </article>
  </section>
)
