import { useEffect, useState } from 'react';
import {
  listOrganizations,
  getOrganizationUsers,
  getOrganizationMetrics,
  Organization,
  OrganizationUsers,
  OrganizationMetrics
} from '../../services/api/admin';

export const OrganizationManagement: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [orgUsers, setOrgUsers] = useState<OrganizationUsers | null>(null);
  const [orgMetrics, setOrgMetrics] = useState<OrganizationMetrics | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const perPage = 20;

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const data = await listOrganizations(page, perPage);
      setOrganizations(data.items);
      setTotal(data.total);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load organizations');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizationDetails = async (orgId: string) => {
    try {
      setLoadingDetails(true);
      const [usersData, metricsData] = await Promise.all([
        getOrganizationUsers(orgId),
        getOrganizationMetrics(orgId),
      ]);
      setOrgUsers(usersData);
      setOrgMetrics(metricsData);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to load organization details');
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, [page]);

  useEffect(() => {
    if (selectedOrg) {
      fetchOrganizationDetails(selectedOrg);
    }
  }, [selectedOrg]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTierBadgeColor = (tier: string) => {
    const colors = {
      starter: '#64748b',
      professional: '#2563eb',
      enterprise: '#7c3aed',
      community: '#f59e0b',
    };
    return colors[tier as keyof typeof colors] || '#64748b';
  };

  return (
    <section data-testid="admin-organizations" style={{ display: 'grid', gap: '1.5rem', padding: '2rem' }}>
      <header>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Organization Management</h1>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
          {total} total organizations across all subscription tiers
        </p>
      </header>

      {loading && (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
          Loading organizations...
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
                    Organization
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: '#475569' }}>
                    Subscription Tier
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: '#475569' }}>
                    Users
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: '#475569' }}>
                    Created
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, fontSize: '0.875rem', color: '#475569' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {organizations.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                      No organizations found
                    </td>
                  </tr>
                ) : (
                  organizations.map((org) => (
                    <tr key={org.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '1rem' }}>
                        <div>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>
                            {org.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem', fontFamily: 'monospace' }}>
                            ID: {org.id.substring(0, 8)}...
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: 'white',
                            background: getTierBadgeColor(org.subscription_tier),
                            textTransform: 'capitalize',
                          }}
                        >
                          {org.subscription_tier}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                        {org.user_count || 0} users
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                        {formatDate(org.created_at)}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <button
                          onClick={() => setSelectedOrg(selectedOrg === org.id ? null : org.id)}
                          style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            background: selectedOrg === org.id ? '#f97316' : 'white',
                            color: selectedOrg === org.id ? 'white' : '#0f172a',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          {selectedOrg === org.id ? 'Hide Details' : 'View Details'}
                        </button>
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
                Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, total)} of {total} organizations
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

      {/* Organization Details Panel */}
      {selectedOrg && (
        <article
          style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
            border: '2px solid #f97316',
            padding: '1.5rem',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
            Organization Details
          </h2>

          {loadingDetails ? (
            <p style={{ color: '#64748b' }}>Loading details...</p>
          ) : (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {/* Metrics */}
              {orgMetrics && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                      Total Users
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.25rem' }}>
                      {orgMetrics.user_count}
                    </p>
                  </div>
                  <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                      Active (30d)
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.25rem' }}>
                      {orgMetrics.active_users_last_30_days}
                    </p>
                  </div>
                  <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                      Deals
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.25rem' }}>
                      {orgMetrics.deals_count}
                    </p>
                  </div>
                  <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                      Documents
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.25rem' }}>
                      {orgMetrics.documents_count}
                    </p>
                  </div>
                </div>
              )}

              {/* Users List */}
              {orgUsers && (
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                    Organization Users ({orgUsers.total_users})
                  </h3>
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    {orgUsers.users.map((user) => (
                      <div
                        key={user.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.75rem',
                          background: '#f8fafc',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                            {user.first_name} {user.last_name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {user.email}
                          </div>
                        </div>
                        <span
                          style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: 'white',
                            background: user.role === 'admin' ? '#dc2626' : '#64748b',
                            textTransform: 'capitalize',
                          }}
                        >
                          {user.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </article>
      )}
    </section>
  );
};
