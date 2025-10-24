import { useEffect, useState } from 'react';
import { listUsers, User, updateUser, softDeleteUser, restoreUser } from '../../services/api/admin';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState('');

  const perPage = 20;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await listUsers(page, perPage, search || undefined);
      setUsers(data.items);
      setTotal(data.total);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const handleUpdateRole = async (userId: string) => {
    if (!newRole) return;

    try {
      await updateUser(userId, { role: newRole });
      setEditingUser(null);
      setNewRole('');
      fetchUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action can be reversed.')) return;

    try {
      await softDeleteUser(userId);
      fetchUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  const handleRestoreUser = async (userId: string) => {
    try {
      await restoreUser(userId);
      fetchUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to restore user');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      admin: '#dc2626',
      enterprise: '#7c3aed',
      growth: '#2563eb',
      solo: '#64748b',
      community_leader: '#f59e0b',
    };
    return colors[role as keyof typeof colors] || '#64748b';
  };

  return (
    <section data-testid="admin-users" style={{ display: 'grid', gap: '1.5rem', padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>User Management</h1>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
            {total} total users across all organizations
          </p>
        </div>

        <input
          type="text"
          placeholder="Search by email, name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            fontSize: '0.875rem',
            minWidth: '280px',
          }}
        />
      </header>

      {loading && (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
          Loading users...
        </div>
      )}

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '1rem', color: '#991b1b' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {!loading && !error && (
        <article
          style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: '#475569' }}>
                    User
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: '#475569' }}>
                    Role
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: '#475569' }}>
                    Organization
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: '#475569' }}>
                    Created
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: '#475569' }}>
                    Last Active
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: '#475569' }}>
                    Status
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, fontSize: '0.875rem', color: '#475569' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '1rem' }}>
                        <div>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>
                            {user.first_name} {user.last_name}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {editingUser?.id === user.id ? (
                          <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            style={{
                              padding: '0.5rem',
                              borderRadius: '6px',
                              border: '1px solid #e2e8f0',
                              fontSize: '0.875rem',
                            }}
                          >
                            <option value="">Select role...</option>
                            <option value="solo">Solo</option>
                            <option value="growth">Growth</option>
                            <option value="enterprise">Enterprise</option>
                            <option value="community_leader">Community Leader</option>
                            <option value="admin">Admin</option>
                          </select>
                        ) : (
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: 'white',
                              background: getRoleBadgeColor(user.role),
                              textTransform: 'capitalize',
                            }}
                          >
                            {user.role.replace('_', ' ')}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                        {user.organization_id ? user.organization_id.substring(0, 8) + '...' : 'None'}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                        {formatDate(user.created_at)}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                        {formatDate(user.last_active_at)}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {user.deleted_at ? (
                          <span style={{ color: '#dc2626', fontSize: '0.875rem', fontWeight: 600 }}>
                            Deleted
                          </span>
                        ) : (
                          <span style={{ color: '#16a34a', fontSize: '0.875rem', fontWeight: 600 }}>
                            Active
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          {editingUser?.id === user.id ? (
                            <>
                              <button
                                onClick={() => handleUpdateRole(user.id)}
                                style={{
                                  padding: '0.5rem 1rem',
                                  borderRadius: '6px',
                                  border: 'none',
                                  background: '#16a34a',
                                  color: 'white',
                                  fontSize: '0.875rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingUser(null);
                                  setNewRole('');
                                }}
                                style={{
                                  padding: '0.5rem 1rem',
                                  borderRadius: '6px',
                                  border: '1px solid #e2e8f0',
                                  background: 'white',
                                  color: '#64748b',
                                  fontSize: '0.875rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditingUser(user);
                                  setNewRole(user.role);
                                }}
                                disabled={!!user.deleted_at}
                                style={{
                                  padding: '0.5rem 1rem',
                                  borderRadius: '6px',
                                  border: '1px solid #e2e8f0',
                                  background: user.deleted_at ? '#f1f5f9' : 'white',
                                  color: user.deleted_at ? '#94a3b8' : '#0f172a',
                                  fontSize: '0.875rem',
                                  fontWeight: 600,
                                  cursor: user.deleted_at ? 'not-allowed' : 'pointer',
                                }}
                              >
                                Edit Role
                              </button>
                              {user.deleted_at ? (
                                <button
                                  onClick={() => handleRestoreUser(user.id)}
                                  style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: '#16a34a',
                                    color: 'white',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                  }}
                                >
                                  Restore
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: '#dc2626',
                                    color: 'white',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                  }}
                                >
                                  Delete
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > perPage && (
            <div style={{ padding: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, total)} of {total} users
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    background: page === 1 ? '#f1f5f9' : 'white',
                    color: page === 1 ? '#94a3b8' : '#0f172a',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: page === 1 ? 'not-allowed' : 'pointer',
                  }}
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page * perPage >= total}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    background: page * perPage >= total ? '#f1f5f9' : 'white',
                    color: page * perPage >= total ? '#94a3b8' : '#0f172a',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: page * perPage >= total ? 'not-allowed' : 'pointer',
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </article>
      )}
    </section>
  );
};
