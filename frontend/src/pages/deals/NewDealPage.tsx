export const NewDealPage: React.FC = () => (
  <section data-testid="deal-new" style={{ display: 'grid', gap: '1.5rem' }}>
    <header>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Create New Deal</h1>
      <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
        Capture core transaction details to initiate a new opportunity in the pipeline.
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
        Form components will be added here alongside validation and API integration.
      </p>
    </article>
  </section>
)
