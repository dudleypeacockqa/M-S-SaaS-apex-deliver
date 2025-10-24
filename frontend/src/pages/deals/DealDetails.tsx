import { useParams } from 'react-router-dom'

export const DealDetails: React.FC = () => {
  const { dealId } = useParams()

  return (
    <section data-testid="deal-details" style={{ display: 'grid', gap: '1.5rem' }}>
      <header>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Deal {dealId}</h1>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
          Comprehensive overview, diligence materials, and activity feed for this transaction.
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
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Summary</h2>
        <p style={{ color: '#475569', marginTop: '0.75rem', lineHeight: 1.6 }}>
          Key metrics, latest updates, and open actions will appear here once the backend services are
          connected.
        </p>
      </article>
    </section>
  )
}
