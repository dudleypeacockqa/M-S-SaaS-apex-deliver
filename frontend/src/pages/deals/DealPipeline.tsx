import { NavigationMenu } from '../../components/layout/NavigationMenu'
import { Breadcrumbs } from '../../components/layout/Breadcrumbs'

/**
 * DealPipeline Page
 *
 * Kanban-style deal pipeline view.
 * Protected route - requires authentication.
 *
 * Future: Implement drag-and-drop functionality with react-beautiful-dnd
 */
export const DealPipeline = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <NavigationMenu />
      <Breadcrumbs />

      <main style={{ padding: '2rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#111' }}>
              Deal Pipeline
            </h1>
            <button style={{
              background: '#667eea',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              + New Deal
            </button>
          </div>

          {/* Kanban Board Placeholder */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {['Sourcing', 'Evaluation', 'Due Diligence', 'Negotiation', 'Closing'].map((stage) => (
              <div key={stage} style={{
                background: '#e5e7eb',
                borderRadius: '8px',
                padding: '1rem',
                minHeight: '400px'
              }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>
                  {stage}
                </h2>
                <div style={{ background: 'white', padding: '1rem', borderRadius: '6px', marginBottom: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>
                  No deals in this stage
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2rem', background: '#dbeafe', padding: '1rem', borderRadius: '6px', border: '1px solid #93c5fd' }}>
            <p style={{ color: '#1e40af', fontSize: '0.875rem' }}>
              💡 <strong>Coming Soon:</strong> Drag-and-drop functionality, deal cards with financial metrics, and team collaboration features.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
