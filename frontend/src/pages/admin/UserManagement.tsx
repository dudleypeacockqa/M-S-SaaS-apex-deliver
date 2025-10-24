import { NavigationMenu } from '../../components/layout/NavigationMenu'
import { Breadcrumbs } from '../../components/layout/Breadcrumbs'

/**
 * UserManagement Page
 *
 * Admin interface for managing users, roles, and permissions.
 * Protected route - requires authentication AND admin role.
 */
export const UserManagement = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <NavigationMenu />
      <Breadcrumbs />

      <main style={{ padding: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#111' }}>
              User Management
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
              + Invite User
            </button>
          </div>

          {/* User Table Placeholder */}
          <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f3f4f6' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem', color: '#374151' }}>
                    Name
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem', color: '#374151' }}>
                    Email
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem', color: '#374151' }}>
                    Role
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem', color: '#374151' }}>
                    Status
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', fontSize: '0.875rem', color: '#374151' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>
                    No users to display. Users will appear here once they sign up.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '2rem', background: '#dbeafe', padding: '1rem', borderRadius: '6px', border: '1px solid #93c5fd' }}>
            <p style={{ color: '#1e40af', fontSize: '0.875rem' }}>
              💡 <strong>Coming Soon:</strong> Search users, filter by role, bulk actions, and detailed user profiles.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
