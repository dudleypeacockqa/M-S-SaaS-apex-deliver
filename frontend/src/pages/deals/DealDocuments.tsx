export const DealDocuments: React.FC = () => (
  <section data-testid="deal-documents" style={{ display: 'grid', gap: '1.5rem' }}>
    <header>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Deal Documents</h1>
      <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
        Centralized repository for diligence materials, contracts, and disclosures.
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
      <p style={{ color: '#475569', lineHeight: 1.6 }}>
        Document storage integrations will sync here. Use the upload action to add files once the
        storage service is connected.
      </p>
    </article>
  </section>
)
