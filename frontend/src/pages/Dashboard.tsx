import { NavigationMenu } from '../components/layout/NavigationMenu'
import { Breadcrumbs } from '../components/layout/Breadcrumbs'

/**
 * Dashboard Page
 *
 * User dashboard home - shows overview of deals, recent activity, and quick actions.
 * Protected route - requires authentication.
 */
export const Dashboard = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <NavigationMenu />
      <Breadcrumbs />

      <main style={{ padding: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem', color: '#111' }}>
            Dashboard
          </h1>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
            {/* Overview Card */}
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#667eea' }}>
                Welcome to ApexDeliver
              </h2>
              <p style={{ color: '#6b7280', lineHeight: '1.5' }}>
                Your M&A Intelligence Platform dashboard. Manage deals, track financial intelligence, and collaborate with your team.
              </p>
            </div>

            {/* Quick Stats */}
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                Quick Stats
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Active Deals</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111' }}>0</div>
                </div>
                <div>
                  <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Total Value</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111' }}>£0</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                Recent Activity
              </h2>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                No recent activity to display
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ marginTop: '2rem', background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
              Quick Actions
            </h2>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
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
                Create New Deal
              </button>
              <button style={{
                background: 'white',
                color: '#667eea',
                border: '2px solid #667eea',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: '600'
              }}>
                View Pipeline
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
