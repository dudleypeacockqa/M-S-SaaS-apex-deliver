export const DealPipeline: React.FC = () => (
  <section data-testid="deal-pipeline" style={{ display: 'grid', gap: '1.5rem' }}>
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Deal Pipeline</h1>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
          Track opportunities across sourcing, diligence, and closing workflows.
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
        + New Deal
      </button>
    </header>

    <div
      style={{
        display: 'grid',
        gap: '1.25rem',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      }}
    >
      {['Sourcing', 'Evaluation', 'Due Diligence', 'Negotiation', 'Closing'].map((stage) => (
        <article
          key={stage}
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.25rem',
            boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
          }}
        >
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{stage}</h2>
          <p style={{ color: '#94a3b8', marginTop: '0.75rem' }}>No deals in this column yet.</p>
        </article>
      ))}
    </div>
  </section>
)
