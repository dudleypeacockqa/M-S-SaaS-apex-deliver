import { useParams } from 'react-router-dom'
import { NavigationMenu } from '../../components/layout/NavigationMenu'
import { Breadcrumbs } from '../../components/layout/Breadcrumbs'

/**
 * DealDetails Page
 *
 * Individual deal view with financial metrics, documents, and activity timeline.
 * Protected route - requires authentication.
 */
export const DealDetails = () => {
  const { dealId } = useParams<{ dealId: string }>()

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <NavigationMenu />
      <Breadcrumbs />

      <main style={{ padding: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', color: '#111' }}>
            Deal {dealId}
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            Detailed view coming soon
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
            {/* Main Content */}
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                Deal Overview
              </h2>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Deal details, financial metrics, and analysis will be displayed here.
              </p>
            </div>

            {/* Sidebar */}
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                Quick Info
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                <div>
                  <div style={{ color: '#6b7280' }}>Stage</div>
                  <div style={{ fontWeight: '600' }}>Evaluation</div>
                </div>
                <div>
                  <div style={{ color: '#6b7280' }}>Deal Size</div>
                  <div style={{ fontWeight: '600' }}>TBD</div>
                </div>
                <div>
                  <div style={{ color: '#6b7280' }}>Status</div>
                  <div style={{ fontWeight: '600' }}>Active</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
