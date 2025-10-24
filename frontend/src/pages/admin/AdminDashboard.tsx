import { NavigationMenu } from '../../components/layout/NavigationMenu'
import { Breadcrumbs } from '../../components/layout/Breadcrumbs'

/**
 * AdminDashboard Page
 *
 * Admin portal home - platform management and analytics.
 * Protected route - requires authentication AND admin role.
 */
export const AdminDashboard = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <NavigationMenu />
      <Breadcrumbs />

      <main style={{ padding: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '6px', border: '1px solid #fbbf24', marginBottom: '2rem' }}>
            <p style={{ color: '#92400e', fontSize: '0.875rem' }}>
              🔒 <strong>Admin Access:</strong> This area is restricted to platform administrators.
            </p>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem', color: '#111' }}>
            Admin Portal
          </h1>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {/* Platform Stats */}
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#667eea' }}>
                Platform Stats
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Total Users</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111' }}>0</div>
                </div>
                <div>
                  <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Total Organizations</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111' }}>0</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                Quick Actions
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button style={{
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  textAlign: 'left'
                }}>
                  Manage Users
                </button>
                <button style={{
                  background: 'white',
                  color: '#667eea',
                  border: '2px solid #667eea',
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  textAlign: 'left'
                }}>
                  View Analytics
                </button>
              </div>
            </div>

            {/* System Health */}
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                System Health
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>API Status</span>
                  <span style={{ color: '#10b981', fontWeight: '600' }}>✓ Operational</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Database</span>
                  <span style={{ color: '#10b981', fontWeight: '600' }}>✓ Healthy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
